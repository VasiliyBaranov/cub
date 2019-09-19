import {IModelPolicy, ITarget} from '../acceess.interface';
import {PolicySetDbEntity} from './policy-set.db-entity';
import {Policy} from '../policy/policy';
import {CombiningAlgorithm} from '../combining-algorithm/combining-algorithm';
import {AccessCombiningAlgorithmEnum} from '../enums/access.combining-algorithm.enum';
import {AccessStateAccessPoliyEnum} from '../enums/access.state-access-poliy.enum';

export class PolicySet implements IModelPolicy {
  public policy: Policy[] = [];
  private policySet: PolicySet[] = [];
  public combine?: AccessCombiningAlgorithmEnum;
  public id?: number;
  public access?: AccessStateAccessPoliyEnum;
  public target?: ITarget;
  public actionType?: string;
  public description?: string;

  public constructor(
    allPolicy: { policy: Policy[], policySet: PolicySet[] },
    policySetData: PolicySetDbEntity | null,
    combine?: AccessCombiningAlgorithmEnum
  ) {
    if (policySetData) {
      this.id = policySetData.id;
      this.target = policySetData.target;
      this.combine = policySetData.combine as AccessCombiningAlgorithmEnum;
    }
    if (combine) {
      this.combine = combine;
    }
    if (allPolicy.policy.length) {
      this.policy = allPolicy.policy;
    }
    if (allPolicy.policySet.length) {
      this.policySet = allPolicy.policySet;
    }
  }


  /**
   * Вычисление поля access на основе всех данных.
   *
   * Расчёт данного метода возможен только после того как будут подготовлены все данные из PIP  иначе для политики будет INDETERMINATE
   */
  public exec(): void {
    if (!this.access) {
      const listAccess: AccessStateAccessPoliyEnum[] = [];
      this.policy.forEach((policy: Policy) => {
        policy.exec();
        if (policy.access) {
          listAccess.push(policy.access);
        }
      });
      this.policySet.forEach((policy: PolicySet) => {
        policy.exec();
        if (policy.access) {
          listAccess.push(policy.access);
        }
      });
      this.access = (this.combine) ? this.access = CombiningAlgorithm.init(listAccess, this.combine) : AccessStateAccessPoliyEnum.indeterminate;

    }
  }


  getDebugData(): any {
    return {
      policy: this.policy.map(x => x.getDebugData()),
      combine: this.combine,
      access: this.access,
      target: this.target,
      description: this.description
    };
  }

}
