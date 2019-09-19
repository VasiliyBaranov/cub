import {FilterArrayInputType} from './input-dvo/filter.array.input-type';
import {FilterScalarInputType} from './input-dvo/filter.scalar.input-type';
import {IFilterSchema, IFilterSchemaCondition} from './filter.interface';
import {CftContainer} from '../../../cft/cft.container';
import {IAttributeEntityExtended} from '../../custom-feild/custom-field.handler';
import {FilterWhereInputType} from './input-dvo/filter.where.input-type';

export class FilterCondition {
  private conditionParam: any = {} as any;
  private keyParam: string = '';
  protected counterVar: number = 1;

  public relation: Array<any> = [];

  private _aliasTable: string = '';
  set aliasTable(alias: string) {
    this._aliasTable = alias;
  }


  get aliasTable(): string {
    return this._aliasTable;
  }


  constructor(
    private readonly alias: string,
    private readonly allCategory: CftContainer,
    private readonly allAttrs: IAttributeEntityExtended[],
    private readonly columnJson: string
  ) {
    this.aliasTable = this.alias;
  }


  /**
   * Формирование схемы для whereBuilder на основе данных из GrpahQl
   *
   * @param condition
   * @param items
   * @param typeOr лучше заменить на condition instanceof FilterOrInputType, но пока, в этом есть ограничение
   */
  // todo: проверка типа по instanceof не получилась, нужно поянть как можно проверить тип, возможности нет переделать с передваемым параметром
  public conditionPrepare(condition: FilterWhereInputType | undefined, items: Array<IFilterSchema>, typeOr: boolean = false)
    : Array<IFilterSchema> | [] {
    if (condition == null) {
      return [];
    }

    let arr = [] as any;
    arr = arr.concat(
      this.addEq(condition._eq),
      this.addNeq(condition._neq),
      this.addLike(condition._like),
      this.addIn(condition._in),
      this.addNin(condition._nin)
    );

    if (typeOr) {
      items.push({operator: 'or', items: arr});
    } else {
      items.push({operator: 'and', items: arr});
    }

    if (condition._and) {
      this.conditionPrepare(condition._and, arr);
    }

    if (condition._or) {
      this.conditionPrepare(condition._or, arr, true);
    }
    return items;
  }


  /**
   * Подготовка для формировани еденичного блока в условии
   * @param data
   */
  private addIn(data: Array<FilterArrayInputType> = []): Array<IFilterSchemaCondition> {
    this.conditionParam = [];
    if (data == null) {
      return [];
    }
    const resultArr = [] as Array<IFilterSchemaCondition>;
    data.forEach(item => {
      this.conditionParam = {};
      this.keyParam = item.key + this.incrementCounterForParam();
      this.conditionParam[this.keyParam] = item.val;
      item.val = item.val ? item.val[0] : null;
      const conditionField = this.jsonOrString(item.key, item.val);
      if (conditionField != null && item.val) {
        resultArr.push({condition: `${conditionField} IN (:...${this.keyParam})`, conditionParam: this.conditionParam});
      }
      if (item.val == null) {
        resultArr.push({condition: `${conditionField} IS NULL`, conditionParam: {}});
      }
    });

    return resultArr;
  }


  private addNin(data: Array<FilterArrayInputType> = []): Array<IFilterSchemaCondition> {
    if (data == null) {
      return [];
    }
    const resultArr = [] as Array<IFilterSchemaCondition>;
    data.forEach(item => {
      this.conditionParam = {};
      this.keyParam = item.key + this.incrementCounterForParam();
      this.conditionParam[this.keyParam] = item.val;
      item.val = item.val ? item.val[0] : null;
      const conditionField = this.jsonOrString(item.key, item.val);
      if (conditionField != null && item.val) {
        resultArr.push({condition: `${conditionField} NOT IN (:...${this.keyParam})`, conditionParam: this.conditionParam});
      }
      if (item.val == null) {
        resultArr.push({condition: `${conditionField} IS NOT NULL`, conditionParam: {}});
      }
    });

    return resultArr;
  }


  private addEq(data: Array<FilterScalarInputType> = []): Array<IFilterSchemaCondition> {
    if (data == null) {
      return [];
    }
    const resultArr = [] as Array<IFilterSchemaCondition>;
    data.forEach(item => {
      this.conditionParam = {};
      this.keyParam = item.key + this.incrementCounterForParam();
      this.conditionParam[this.keyParam] = item.val;
      const conditionField = this.jsonOrString(item.key, item.val);
      if (conditionField != null && item.val) {
        resultArr.push({condition: `${conditionField} = :${this.keyParam}`, conditionParam: this.conditionParam});
      }
      if (item.val == null) {
        resultArr.push({condition: `${conditionField} IS NULL`, conditionParam: {}});
      }

    });

    return resultArr;
  }


  private addLike(data: Array<FilterScalarInputType> = []): Array<IFilterSchemaCondition> {
    if (data == null) {
      return [];
    }
    const resultArr = [] as Array<IFilterSchemaCondition>;
    data.forEach(item => {
      this.conditionParam = {};
      this.keyParam = item.key + this.incrementCounterForParam();
      this.conditionParam[this.keyParam] = item.val;
      resultArr.push({condition: this.jsonOrString(item.key, item.val) + ' LIKE (:' + this.keyParam + ')', conditionParam: this.conditionParam});
    });

    return resultArr;
  }


  private addNeq(data: Array<FilterScalarInputType> = []): Array<IFilterSchemaCondition> {
    if (data == null) {
      return [];
    }
    const resultArr = [] as Array<IFilterSchemaCondition>;
    data.forEach(item => {
      this.conditionParam = {};
      this.keyParam = item.key + this.incrementCounterForParam();
      this.conditionParam[this.keyParam] = item.val;
      const conditionField = this.jsonOrString(item.key, item.val);
      if (conditionField != null && item.val) {
        resultArr.push({condition: `${conditionField} <> :${this.keyParam}`, conditionParam: this.conditionParam});
      }
      if (item.val == null) {
        resultArr.push({condition: `${conditionField} IS NOT NULL`, conditionParam: {}});
      }
    });

    return resultArr;
  }


  /**
   * Формирование структуры, для того что бы создать запрос в FilterQuery.generateJoinForCft() здесь,
   * это блок с проверкой (category.entity != null && category.relation != null)
   * так же формирование параметров для SQL запроса, на основе пришедших полей
   *
   * @param field
   * @param val
   */
  // todo требуется рефкторинг, разделить данный метод на два отдельных
  //  1 - это подготовка relation, 2 - это формирование простых Cft
  private fieldType(field: any, val: any): string | null {
    let newField = null;
    let isKey = false;
    this.allAttrs.forEach(attr => {
      if (attr.key === field.key) {
        isKey = true;
        this.allCategory.categories.forEach(category => {
          if (category.key === attr.cft) {

            if (category.entity != null && category.relation != null) {
              if (this.relation.indexOf(attr.cft) === -1) {
                this.relation.push(attr.cft);
              }

              newField = this.setFieldForSql(`${category.entity.name.toLowerCase()}."${category.relation.searchField}"`, val);
            } else {
              newField = this.setFieldForSql(`${this.aliasTable}."${field.column}"->>'${field.key}'`, val);
            }
          }
        });
      }
    });
    if (!isKey) {
      throw new Error(`Атрибут "${field.key}" отсутсвует в БД`);
    }
    return newField;
  }


  /**
   * Проверка поля, является ли оно cft или это поле из основной таблицы WorkItem
   *
   * Т.к. за основу клиентских запросов мы определили что будем писать обычное поле без точки, если это cft
   * поле то с точкой пример:
   *    1) "title" - поле из таблицы WorkItem
   *    2) ".startWork" - это поле так же находится в таблице WorkItem, но внутри поля _scalarAttrs
   *    поэтому оно является cft (всё что внутри _scalarAttrs - это всё cft)
   *    3) ".responsible" это так же поле cft, однако теперь это уже отдельная сущность
   *
   * @param field
   * @param val
   */
  private jsonOrString(field: string, val: any): string | null {
    const arrField = field.split('.');
    if (arrField.length > 1) {
      return this.fieldType({column: this.columnJson, key: arrField[1]}, val);
    } else {
      return this.setFieldForSql(`${this.aliasTable}."${field}"`, val);
    }
  }


  /**
   * Установки правильного формата поля для SQL запроса
   *
   * Это своеобразная минивалидация, а так же составление более корректного запроса для SQL
   * т.к. если для SQL запроса не указать правильные типы, то текущий запрос будет выполняться игнорируя индексы.
   *
   * @param tplField
   * @param val
   */
  // todo требуется рефакторинг, а так же расширение логики
  private setFieldForSql(tplField: string, val: any): string {
    let field = '';

    switch (typeof val) {
      case 'number' :
        field = this.isFloat(val) ? `(${tplField})::float` : `(${tplField})::int`;
        break;
      case 'string' :
        field = `(${tplField})::text`;
        break;
      case 'boolean' :
        field = `(${tplField})::boolean`;
        break;
      default :
        field = tplField;
        break;
    }
    return field;
  }

  /**
   * Проверка числа на Float
   * @param n
   */
  private isFloat(n: number): boolean {
    return Number(n) === n && n % 1 !== 0;
  }


  /**
   * Обнуления счётчика для генерации уникальных параметров
   */
  public resetCounterForParam(): void {
    this.counterVar = 0;
  }


  /**
   * Счётчик формирования инкремента для параметров т.к.
   *
   * Параметры для QueryBuilder формируеются на основе полей таких как name, title и т.д. по сколько в клиентском
   * запросе может быть много одинаковых полей, а для запроса параметры должны быть уникальны, мы формируем для них
   * условный инкремент поэтому параметры будут выглядеть так:
   *    name1, title2, name3, name4, isVisible5 и т.д.
   *
   */
  private incrementCounterForParam(): number {
    return ++this.counterVar;
  }
}
