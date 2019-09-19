import {ConditionEqual} from './condition.equal';
import {AccessAttributeVo} from './access-attribute-vo';

export class Condition {
  public attribute: AccessAttributeVo;
  public operator: string;
  public valueAttribute: AccessAttributeVo;


  public constructor(attrL: AccessAttributeVo, attrR: AccessAttributeVo, operator: string) {
    this.attribute = attrL;
    this.operator = operator;
    this.valueAttribute = attrR;
  }


  /**
   * Сравнение результата расчитанных условий.
   *
   * Значение в resultValue может появится в двух вариантах,
   *      1) При администрировании в PAP для attribute или valueAttribute было задано скалярное значение string | int | bool
   *      2) При вычислении самого PIP
   * Второй вариант актуален когда для поля attribute или valueAttribute делается объект в PAP. Пример: {
   *    attr: "TaskUserTree.userId"
   *    param: {
   *       asDescendants: true
   *    },
   * }
   */
  public getStateCondition(): boolean {
    if (this.attribute.getResultValue() && this.valueAttribute.getResultValue()) {
      if (this.operator === 'in') {
        return ConditionEqual.checkOperatorIn(this.attribute.getResultValue(), this.valueAttribute.getResultValue());
      }
    }
    return false;
  }

  getDebugData(): any {
    return {
      attribute: this.attribute.getResultValue(),
      // attributeTxt: this.attribute,
      valueAttribute: this.valueAttribute.getResultValue(),
      // valueAttributeTxt: this.valueAttribute,
      operator: this.operator,
    };
  }
}
