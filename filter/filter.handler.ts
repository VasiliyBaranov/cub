import {Repository} from 'typeorm';
import {FilterCondition} from './filter.condition';
import {FilterQuery} from './filter.query';
import {FilterValidate} from './filter.validate';
import {Container} from 'typedi';
import {CftContainer} from '../../../cft/cft.container';
import {CustomFieldHandler} from '../../custom-feild/custom-field.handler';
import {ICommonContext} from '../../../context.interface';
import {FilterInputType} from './input-dvo/filter.input-type';
import {IPrepareDataForQB} from './filter.interface';

// todo Идеи для рефакторинга:
//  - добавить проверку для несуществующих полей в json атрибутах т.к. в случае если поле будет не найдено,
//  поиск может осуществляться крайне долго из-за отсутствия индексации для не существующего поля
export class FilterHandler {
  public _filterValidate: FilterValidate;
  public _filterQuery: FilterQuery;


  constructor(
    private readonly ctx: ICommonContext,
    private readonly repository: Repository<any>,
    private readonly alias: string,
    private readonly columnJson: string
  ) {

    this._filterValidate = new FilterValidate();
    this._filterQuery = new FilterQuery(this.ctx, this.alias, this.repository.metadata.primaryColumns[0].propertyName);
  }


  /**
   * Используется для получения данных из БД
   * @param params
   */
  public async getData(params: FilterInputType | any): Promise<any> {
    const prepareDataForQB = await this.prepareDataForQueryBuilder(params);
    const qb = this._filterQuery.renderForData(prepareDataForQB, params.orderBy);
    qb.select(`${this.alias}.*`);
    qb.limit(params.limit);
    if (params.offset) {
      qb.offset(params.offset);
    }
    console.log(qb.getSql());
    return qb.getRawMany().catch((e: any) => {
      throw new Error(e);
    });
  }


  /**
   * Исполльзуется для получения количества записей из БД
   * @param params
   */
  public async getCount(params: FilterInputType | any): Promise<{countRows: number}> {
    const prepareDataForQB = await this.prepareDataForQueryBuilder(params);
    const qb = this._filterQuery.renderForCount(prepareDataForQB);
    qb.select(`COUNT(${this.alias}.*) as "countRows"`);
    console.log(qb.getSql());
    return qb.getRawOne().catch((e: any) => {
      throw new Error(e);
    });
  }


  /**
   * Подготовка данных для геранции QueryBuilder
   *
   * Здесь мы получаем набор всех cft из базы, а так же все cft классы. Перед тем как формировать схему для
   * QueryBuilder, сначала производится валидация всех полей, а после мы фомируем необходимую схему на основе клиентских
   * данных.
   *
   * @param params
   */
  private async prepareDataForQueryBuilder(params: FilterInputType | any): Promise<IPrepareDataForQB> {
    const categoriesContainer: CftContainer = Container.get(CftContainer);
    const allAttrs = await Container.get(CustomFieldHandler).getAll();

    const filterCondition = new FilterCondition(this.alias, categoriesContainer, allAttrs, this.columnJson);

    filterCondition.resetCounterForParam();
    // let scheme = {} as ISchema;
    let scheme = [] as any;

    if (params.where != null) {
      await this._filterValidate.validField(params.where, allAttrs);

      const key = Object.keys(params.where);
      if (key.length > 1) {
        throw new Error('Для where должен быть выбран только один параметр');
      }
      const operator = key[0];
      switch (operator) {
        case '_or':
        case '_and':
          params.where = params.where[operator];
          break;
      }

      scheme = filterCondition.conditionPrepare(params.where, [], (operator === '_or'));
    }
    this._filterQuery.relation = filterCondition.relation;
    const qb = this.repository.createQueryBuilder(filterCondition.aliasTable);
    return {qb: qb, allAttrs, scheme};
  }
}

