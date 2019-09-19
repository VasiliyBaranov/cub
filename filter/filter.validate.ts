import { FilterWhereInputType } from './input-dvo/filter.where.input-type';
import { IFilterTypeValidField } from './filter.interface';
import { IAttributeEntityExtended } from '../../custom-feild/custom-field.handler';
import { validateBaseField } from '../../base.work-item';

export class FilterValidate {

  /**
   * Валидация по сложным атрибутам
   *
   * После подготовки данных из generateCustomFieldsForValidate мы обходим все необходимые поля и выполняем для них
   * x._cft.dbIsScalar.validate в случае ошибочного формата будет выброшено исключение
   *
   * @param where то же самое условия которые приходит в фильтры с клиента (Не путать со схемой генерируемой
   * в FilterCondition)
   * @param allAttrs массив всех CFT
   */
  // todo требуется рефакторинг метода, разделения его на две основные части формирования схемы и валидация CFT
  public async validField(where: FilterWhereInputType, allAttrs: IAttributeEntityExtended[]): Promise<void> {
    let arrFields = [] as any;
    arrFields = arrFields.concat(
      where._and,
      where._or,
      where._eq,
    );


    const arrCat = this.generateCustomFieldsForValidate(arrFields, []) as Array<IFilterTypeValidField>;

    allAttrs.forEach(x => {
      arrCat.forEach(category => {
        if (category.key === x.key) {
          if (Array.isArray(category.val)) {
            category.val.forEach((inArr: any) => {
              x._cft.dbIsScalar.validate(inArr, category.key);
            });
          } else {
            x._cft.dbIsScalar.validate(category.val, category.key);
          }
        }
      });
    });
  }


  /**
   * Генерация данных для валидации
   *
   * Метод производит валидацию полей БД для основой таблицы, а так же генерирует следующую структуру:
   * [
   *    {key: "title", val: "Задача номер 5"}
   *    {key: "isVisible", val: true}
   *    {key: ".responsible", val: "user-246"}
   * ]
   *
   * @param fields для текушего поля требуется тип ConditionInputType, но здесь так же может оказаться любое строковое
   * значение
   * @param items
   */
  // todo требуется рефакторинг метода, разделения его на две основные части формирования схемы и валидация
  //  ядровых полей
  private generateCustomFieldsForValidate(fields: Array<any>, items: Array<IFilterTypeValidField>): Array<IFilterTypeValidField> {
    if (fields == null) {
      return [];
    }

    fields.forEach(filed => {
      let arr = [] as any;
      if (filed == null) {
        return [];
      }
      arr = arr.concat(
        filed._eq,
        filed._neq,
        filed._in,
        filed._nin,
        filed, // значение используется когда в нашем массиве элемент является любой кроме _and и _or
      );

      // const resultArr = [] as Array<IFilterTypeValidField>;
      for (const item of arr) {
        if (item != null && item.key != null) {
          const arrField = item.key.split('.');
          // const objEq = {} as any;
          if (arrField.length > 1) {
            const key = arrField.length > 1 ? arrField[1] : item.key;
            items.push({ key: key, val: item.val });
          } else {
            // old
            // this.coreIsField(item.key, item.val);

            // new
            if (Array.isArray(item.val)) {
              // в случае если массив, то проверяем каждый элемент
              item.val.forEach((val: any) => {
                validateBaseField(item.key, val);
              });
            } else {
              validateBaseField(item.key, item.val);
            }
          }
        }
      }

      if (filed._or) {
        this.generateCustomFieldsForValidate([filed._or], items);
      }
      if (filed._and) {
        this.generateCustomFieldsForValidate([filed._and], items);
      }
    });
    return items;
  }


  // old
  // private coreIsField(field: string, val: any): boolean {
  //   const arrField: Array<IFieldEntity> = TaskEntityIsScalar.fields;
  //   arrField.forEach(r => {
  //     if (field === r.field) {
  //       if (Array.isArray(val)) {
  //         val.forEach((inArr: any) => {
  //           r.type.validate(inArr, field);
  //         });
  //       } else {
  //         r.type.validate(val, field);
  //       }
  //     }
  //   });
  //   return true;
  // }
}
