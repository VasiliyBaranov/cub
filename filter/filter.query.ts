import {FilterOrderByInputType} from './input-dvo/filter.order-by.input-type';
import { IFilterOrderBy, IPrepareDataForQB } from './filter.interface';
import {Brackets, SelectQueryBuilder} from 'typeorm';
import {TextCft} from '../../../cft/inline/text-cft/text-cft';
import {IntCft} from '../../../cft/inline/int-cft/int-cft';
import {CftContainer} from '../../../cft/cft.container';
import {Container} from 'typedi';
import {BaseCft} from '../../../cft/base-cft';
import {AccessReadCacheHandler} from '../../../access-read-cache/access.read-cache.handler';
import {ICommonContext} from '../../../context.interface';


export class FilterQuery {
  public relation: Array<any> = [];


  constructor(
    private readonly ctx: ICommonContext,
    private readonly alias: string,
    private readonly primaryKey: string
  ) {
  }


  /**
   * Формирование QueryBuilder для получение данных из БД
   *
   * @param dataForQB
   * @param order
   */
  public renderForData(dataForQB: IPrepareDataForQB, order?: FilterOrderByInputType[]): SelectQueryBuilder<any> {
    this.render(dataForQB, order);
    dataForQB.qb.addOrderBy(`${this.alias}.id`, 'ASC');
    return dataForQB.qb;
  }


  /**
   * Формирование QueryBuilder только для подсчёта количества записей
   *
   * @param dataForQB
   */
  public renderForCount(dataForQB: IPrepareDataForQB): SelectQueryBuilder<any> {
    this.render(dataForQB);
    return dataForQB.qb;
  }


  /**
   * Основные шаги для формирования конечного QueryBuilder на основе всех фильтров
   *
   * Если присутсвуют политики на чтение WorkItem, то реузльтат работы текущего метода будет зависеть от
   * AccessReadCacheHandler.generateJoin т.к. именно здесь происходит обращение к таблице кэша
   *
   * @param dataForQB
   * @param order
   */
  private render(dataForQB: IPrepareDataForQB, order?: FilterOrderByInputType[]): SelectQueryBuilder<any> {
    this.generateWhere(dataForQB.scheme, dataForQB.qb);
    if (order != null) {

      const queryOrder: Array<IFilterOrderBy> = this.generateOrderBy(order, dataForQB.allAttrs);
      queryOrder.forEach((item) => (
        dataForQB.qb.addOrderBy(item.field, item.sort)
      ));
    }
    this.generateJoinForCft(dataForQB.qb);

    if (this.ctx.isPolicy) {
      AccessReadCacheHandler.generateJoin(dataForQB.qb, this.alias, this.primaryKey, this.ctx.userId);
    }

    dataForQB.qb.andWhere(`${this.alias}.isDeleted = false`);
    return dataForQB.qb;
  }


  /**
   * Генерация LEFT JOIN для фильтрации WorkItem по CustomFields
   *
   * Основные требования для корректного поиска по CustomFields - это три поля которые заполняются для конкретного
   * cft пример cft/complex/user-cft.ts в текущем файле:
   *    1)  entity = UserWorkItemDbEntity; - это реальный Entity работющий с данной сущностью
   *    2)  dbIsScalar = new StringDbIsScalar(); Значение текущего поля зависит от типа поля по которому он
   *    будет использован в данном случае 'userId' имеет тип string
   *    3)  relation = {searchField: 'userId', mainTableJoinField: 'taskId'}; Текущая связь всегда описана
   *    из двух полей
   *
   * @param qb
   */
  private generateJoinForCft(qb: SelectQueryBuilder<any>): void {
    const categoriesContainer: CftContainer = Container.get(CftContainer);
    let objPlugin: BaseCft<any, any> | null = null;
    this.relation.forEach(r => {
      for (const categoryClass of categoriesContainer.categories) {
        if (categoryClass.title === r && categoryClass.relation != null) {
          objPlugin = categoryClass;
          const joinField = `${categoryClass.entity.name.toLowerCase()}.${categoryClass.relation.mainTableJoinField}`;
          qb.leftJoin(categoryClass.entity, categoryClass.entity.name.toLowerCase(), `${joinField} = ${this.alias}.${this.primaryKey}`);
        }
      }
    });
  }


  /**
   * Формирование основных блоков условий (AND | OR)
   *
   * Основные особенности данного метода формирование запроса на основе JSON интерфейс для которого IFilterSchema,
   * однако перенести текущий интерфейс в данный метод пока нет возможности, в связи с ограничением TS,
   * возможно есть какие - то фичи как это сделать
   *
   * @param scheme схема которая формируется в классе FilterCondition
   * @param qb нельзя явно задать SelectQueryBuilder<any> т.к. внутри операторов
   * ( происходят subQuery для которых тип различается от отличающи)
   * @return текущий метод ничего не возвращает т.к. при обработки он мутирует переданный в него QB
   */
  // todo в идеале необходимо как-то зарефакторить работу с типами, на текущий момент она имеет ряд ограничений.
  private generateWhere(scheme: any[], qb: any): void {
    scheme.forEach(mainItem => {
      if (mainItem.items.length !== 0) {
        switch (mainItem.operator) {
          case 'and' :
            qb.andWhere(new Brackets(subQbAnd => {
              mainItem.items.forEach((item: any) => {
                if (item.operator && item.items.length !== 0) {
                  const arrS = [{operator: item.operator, items: item.items}];
                  if (mainItem.operator === 'and') {
                    subQbAnd.andWhere(new Brackets(subQbAnd2 => {
                      this.generateWhere(arrS, subQbAnd2);
                    }));
                  } else {
                    subQbAnd.orWhere(new Brackets(subQbOr => {
                      this.generateWhere(arrS, subQbOr);
                    }));
                  }
                }
                if (item.condition !== undefined && item.conditionParam !== undefined) {
                  subQbAnd.andWhere(item.condition, item.conditionParam);
                }
              });
            }));
            break;
          case 'or':
            qb.orWhere(new Brackets(subQbOr => {
              mainItem.items.forEach((item: any) => {
                if (item.operator && item.items.length !== 0) {
                  const arrS = [{operator: item.operator, items: item.items}];
                  if (mainItem.operator === 'and') {
                    subQbOr.andWhere(new Brackets(subQbAnd => {
                      this.generateWhere(arrS, subQbAnd);
                    }));
                  } else {
                    subQbOr.orWhere(new Brackets(subQbOr2 => {
                      this.generateWhere(arrS, subQbOr2);
                    }));
                  }

                }
                if (item.condition !== undefined && item.conditionParam !== undefined) {
                  subQbOr.orWhere(item.condition, item.conditionParam);
                }
              });
            }));
            break;
        }
      }
    });
  }

  /**
   * Генерация orderBy
   *
   * Текущий метод не предназначен для сортировке на основе CustomFields (Complex), так же при сортировки по обычным
   * атрибутом неплохо было бы сделать другой механизм типизации для SQL полей, в том случае если мы сортируем по полю
   * name и для него не будет указан следующий синтаксис ORDER_BY (wi."name")::text, то сортировка будет
   * очень длительной т.к. без текущего синтаксиса индексы БД использовать не будет, да же если они указаны
   *
   * @param order
   * @param allAttrs
   */
  private generateOrderBy(order: FilterOrderByInputType[], allAttrs: any[]): Array<IFilterOrderBy> {
    const partOrder = [] as Array<IFilterOrderBy>;
    order.forEach(async (item: any) => {
      allAttrs.forEach(attr => {
        let key = item.key;
        const value = item.sort;
        const arrField = key.split('.');
        key = arrField.length > 1 ? arrField[1] : item.key;
        let field = arrField.length > 1
          ? `(${this.alias}."${arrField[0]}"->>'${key}')` : `${this.alias}.${key}`;
        if (attr.key === key) {
          if (attr.cft === 'TextCft') {
            field = arrField.length > 1
              ? `(${this.alias}."${arrField[0]}"->>'${arrField[1]}')::text` : `(${this.alias}.${key})::text`;
          }
          if (attr.cft === 'IntCft') {
            field = arrField.length > 1
              ? `(${this.alias}."${arrField[0]}"->>'${arrField[1]}')::int` : `(${this.alias}.${key})::int`;
          }
        }
        partOrder.push({field: field, sort: value});
      });
    });
    return partOrder;
  }
}
