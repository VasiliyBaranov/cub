import {RuleDbEntity} from './rule.db-entity';
import {IModelPolicy, IStructureRuleCondition, ITarget} from '../acceess.interface';
import {Condition} from '../condition/condition';
import {AccessAttributeVo} from '../condition/access-attribute-vo';
import {AccessStateAccessPoliyEnum} from '../enums/access.state-access-poliy.enum';

export class Rule implements IModelPolicy {
  public id: number;
  public target: ITarget;
  public effect: boolean;
  public condition: Condition[] = [];
  public access?: AccessStateAccessPoliyEnum;
  private conditionTxt?: IStructureRuleCondition;


  constructor(
    ruleData: RuleDbEntity | any,
  ) {
    this.id = ruleData.id;
    this.target = ruleData.target;
    this.effect = ruleData.effect;

    ruleData.condition.forEach((item: IStructureRuleCondition) => {
      const attrL = new AccessAttributeVo(item.attribute);
      const attrR = new AccessAttributeVo(item.valueAttribute);
      this.conditionTxt = item;
      this.condition.push(new Condition(attrL, attrR, item.operator));
    });
  }


  /**
   * Расчёт поля access на основе Condition.
   *
   * Каждый Condition должен вернуть true, если для текущего Rule любой из Condition окажется false, то значение в access
   * станет NOT_APPLICABLE, если все Condition будут исполнены, то значение access будет зависить от поля effect текущего Rule
   * для effect
   *      : true  - PERMIT
   *      : false - DENY
   */
  public exec(): void {
    let execCondition = true;
    this.condition.forEach((item: Condition) => {
      if (!item.getStateCondition()) {
        execCondition = false;
      }
    });
    let result = AccessStateAccessPoliyEnum.notApplicable;
    if (execCondition) {
      result = this.effect ? AccessStateAccessPoliyEnum.permit : AccessStateAccessPoliyEnum.deny;
    }
    this.access = result;
  }


  getDebugData(): any {
    return {
      condition: this.condition.map(x => x.getDebugData()),
      conditionTxt: this.conditionTxt,
      access: this.access,
      target: this.target,
      effect: this.effect,
    };
  }
}
