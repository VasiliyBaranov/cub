import {Brackets, Repository} from 'typeorm';
import {IFlatData} from '../access/acceess.interface';
import { _logTimeExecuteOperation } from '../_utils/log-time-execute-operation';


export class BaseAccessInformationData<T> {

  constructor(
    protected readonly repository: Repository<any>,
    private _alias: string,
    private FIELD_SEARCH: keyof T,
  ) {
  }


  /**
   * Получение результата из БД на основе контекста
   *
   * После получение полей для SELECT будет формирование параметров для WHERE  логика формирования идентична формированию полей из SELECT.
   * Для контекста имеющий el: "taskId3456123" и в item.attr.getParam() следующую стурктуру: {
   *      "asAncestors": true,
   *      "attrKey": "auditor"
   * }
   * Будет условие (task.id = "taskId3456123" AND task.asAncestors = true AND task.attrKey = "auditor")
   * Элемент каждого контекста в условии будет формироваться через OR пример т.е. конечная структура для WHERE будет:
   *    (field AND field AND field AND ....) OR (field AND field AND field AND ....) OR (field AND field AND field AND ....) и т.д.
   * После получения результата он отправляется в setResultFlatData() для того что бы в каждом Condition записать нужный результат из БД
   * @param data группированный контекст из PDP
   */
  protected async batch(data: IFlatData[], paramForSql?: IFlatData[]): Promise<void> {

    const fieldSelect = this.getFieldsForSelect(data);
    const qb = this.repository.createQueryBuilder(this._alias);
    qb.select(fieldSelect);
    const datas = paramForSql ? paramForSql : data;
    datas.forEach((item, index) => {
      qb.orWhere(new Brackets(subQbOr => {
        const taskId = this.FIELD_SEARCH + index.toString();
        const obj = {} as any;
        obj[taskId] = item.context.el;
        subQbOr.andWhere(`"${this.FIELD_SEARCH}" = :${taskId}`, obj);

        const params = item.attr.getParam() || {};
        Object.keys(params).forEach(k => {
          const key = k + index;
          const objParam = {} as any;
          objParam[key] = params[k];

          subQbOr.andWhere(`"${k}" = :${key}`, objParam);
        });
      }));
    });
    const startCurrentTaskTreeUserExec = +new Date();
    const result = await qb.getRawMany().catch(e => {
      throw new Error(e);
    });
    _logTimeExecuteOperation('CurrentTaskTreeUserExec', startCurrentTaskTreeUserExec);
    this.setResultFlatData(data, result);
  }


  /**
   * Группировка результата для attribute и valueAttribute
   *
   * При обработки контекста для текущего attribute | valueAttribute будет установлено значение в setResultValue на основе
   * параметров текущего контекста. Т.е. параметры в текущем элементе контекста произведут поиск в resultQuery для поиска соответсвующих данных
   * ( ОСТОРОЖНО!!! именно здесь происходит мутирование для AccessContext[] )
   *
   * @param data группированный контекст из PDP. ВАЖНО!!! Контекст каждый элемент которого будет attribute | valueAttribute быть оба одновременно
   * не могут, так же это не единственные объекты контекста
   * @param resultQuery здесь результат из БД для всех элементов контекста
   */
  private setResultFlatData(data: IFlatData[], resultQuery: any[]): void {
    data.forEach(flat => {
      const el = flat.context.el;
      let listDataKeys = [] as any[];
      const params = flat.attr.getParam() || {};
      const res = resultQuery.filter(f => {
        let keysCondition = true;
        const paramKeys = Object.keys(params);
        paramKeys.forEach(k => {
          const param = params[k];
          keysCondition = keysCondition && (f[k as keyof T] === param);
        });
        return keysCondition && (f[this.FIELD_SEARCH as keyof T] === el);
      });

      if (res.length) {
        const elements = res.map(r => r[flat.attr.getEntityAttr() as keyof T]);
        if (elements.length) {
          listDataKeys = [...listDataKeys, elements];
        }
      }
      const listData = ([] as any[]).concat(...listDataKeys);
      flat.attr.setResultValue(listData);
    });
  }


  /**
   * Получение полей которые будут использованы для запроса в SELECT
   *
   * Два основных этапа:
   *      1) Получение поля из getEntityAttr()
   *      2) Получение всех ключей из параметров, текущие ключи так же являются полями в БД для текущей таблицы.
   * Текущие ключи храняться в Condition в поле attribute | valueAttribute имеющие значение param который будет иметь объект вида key: val.
   *
   * @param data группированный контекст из PDP
   * return массив строк следующего вида: [
   * "task.id as id",
   * "task.typeId as typeId",
   * ...
   * ]
   */
  private getFieldsForSelect(data: IFlatData[]): string[] {
    const fieldSelect = [] as string[];
    const field = data[0].attr.getEntityAttr();
    if (field) {
      fieldSelect.push(`${this._alias}."${field}" AS "${field}"`);
      fieldSelect.push(`${this._alias}."${this.FIELD_SEARCH}" AS "${this.FIELD_SEARCH}"`);
    }

    data.map(d => d.attr.getParam())
      .forEach(objParam => {
      if (objParam) {
        Object.keys(objParam).forEach(k => {
          const isField = fieldSelect.find(r => r === `${this._alias}."${k}" AS "${k}"`);
          if (!isField) {
            fieldSelect.push(`${this._alias}."${k}" AS "${k}"`);
          }
        });
      }
    });

    return fieldSelect;
  }
}
