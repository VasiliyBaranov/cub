import {Rule} from '../rule/rule';
import {PolicyDbEntity} from './policy.db-entity';
import {IModelPolicy, ITarget} from '../acceess.interface';
import {CombiningAlgorithm} from '../combining-algorithm/combining-algorithm';
import {AccessStateAccessPoliyEnum} from '../enums/access.state-access-poliy.enum';
import {AccessCombiningAlgorithmEnum} from '../enums/access.combining-algorithm.enum';

export class Policy implements IModelPolicy {
  public id: number;
  public rule: Rule[] = [];
  public combine: AccessCombiningAlgorithmEnum = AccessCombiningAlgorithmEnum.permitUnlessDeny;
  public access?: AccessStateAccessPoliyEnum;
  public target?: ITarget;
  public description?: string;


  public constructor(
    allRule: Rule[],
    policyData: PolicyDbEntity
  ) {
    this.id = policyData.id;
    this.target = policyData.target;
    this.combine = policyData.combine as AccessCombiningAlgorithmEnum;
    this.rule = allRule;
  }


  /**
   * Вычисление поля access на основе всех данных.
   *
   * Расчёт данного метода возможен только после того, как будут подготовлены все данные из PIP. Иначе для политики будет INDETERMINATE
   */
  public exec(): void {
    if (!this.access) {
      const listAccess: AccessStateAccessPoliyEnum[] = [];
      this.rule.forEach((rule: Rule) => {
        rule.exec();
        if (rule.access) {
          listAccess.push(rule.access);
        }
      });
      this.access = CombiningAlgorithm.init(listAccess, this.combine);
    }
  }


  getDebugData(): any {
    return {
      rule: this.rule.map(x => x.getDebugData()),
      combine: this.combine,
      access: this.access,
      target: this.target,
      description: this.description
    };
  }
}
