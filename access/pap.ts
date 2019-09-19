import {PolicySetHandler} from './policy-set/policy-set.handler';
import {PolicyHandler} from './policy/policy.handler';
import {RuleHandler} from './rule/rule.handler';
import {RuleDbEntity} from './rule/rule.db-entity';
import {PolicyDbEntity} from './policy/policy.db-entity';
import {PolicySetDbEntity} from './policy-set/policy-set.db-entity';
import {Service} from 'typedi';
import {IListPap} from './acceess.interface';
import {AccessContext} from './access.context';


@Service()
export class Pap {
  constructor(
    private readonly handlerRule: RuleHandler,
    private readonly handlerPolicy: PolicyHandler,
    private readonly handlerPolicySet: PolicySetHandler,
  ) { //
  }


  public async listDataPap(): Promise<IListPap> {
    const rule = await this.listRule();
    const policy = await this.listPolicy();
    const policySet = await this.listPolicySet();
    return {rule: rule, policy: policy, policySet: policySet};

  }

  public getPolicyForCtx(ctx: AccessContext, valuableList: Array<PolicyDbEntity | PolicySetDbEntity>
  ): Array<PolicyDbEntity | PolicySetDbEntity> {
    return valuableList
      .filter(decisionItem => {
        return this.isTarget(ctx, decisionItem);
      })
      .filter((decisionItem, i, arr) => {
        return !arr.find(item => (item !== decisionItem) && this.has(item, decisionItem));
      });
  }


  private isTarget(ctx: AccessContext, item: PolicyDbEntity | PolicySetDbEntity): boolean {
    return (this.equals(ctx.target, item.target) || !item.target);
  }

  equals(x: any, y: any): boolean {
    if (x === y) {
      return true;
    }
    if (!(x instanceof Object) || !(y instanceof Object)) {
      return false;
    }
    if (x.constructor !== y.constructor) {
      return false;
    }
    for (const p in x) {
      if (!x.hasOwnProperty(p)) {
        continue;
      }
      if (!y.hasOwnProperty(p)) {
        return false;
      }
      if (x[p] === y[p]) {
        continue;
      }
      if (typeof (x[p]) !== 'object') {
        return false;
      }
      if (!this.equals(x[p], y[p])) {
        return false;
      }
    }

    for (const p in y) {
      if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) {
        return false;
      }
    }
    return true;
  }


  private has(item: PolicyDbEntity | PolicySetDbEntity, decisionItem: PolicyDbEntity | PolicySetDbEntity): boolean {
    let isHas = false;
    if (decisionItem instanceof PolicyDbEntity) {
      if (item instanceof PolicySetDbEntity) {
        const isPolicy = item.policy.find(r => r.id === decisionItem.id);
        if (isPolicy) {
          isHas = true;
        }
      }
    }
    if (decisionItem instanceof PolicySetDbEntity) {
      const isPolicy = decisionItem.policyGroup.find(r => r.id === item.id);
      if (isPolicy) {
        isHas = true;
      }

    }
    return isHas;
  }


  // public has(policy: Policy | PolicySet): boolean {
  //   let isHas = false;
  //   if (policy instanceof Policy) {
  //     const isPolicy = this.policy.find(r => r.id === policy.id);
  //     if (isPolicy) {
  //       isHas = true;
  //     }
  //   }
  //   if (policy instanceof PolicySet) {
  //     const isPolicy = this.policySet.find(r => r.id === policy.id);
  //     if (isPolicy) {
  //       isHas = true;
  //     }
  //   }
  //   return isHas;
  // }


  private async listRule(): Promise<RuleDbEntity[]> {
    return await this.handlerRule.getAll();
  }


  private async listPolicy(): Promise<PolicyDbEntity[]> {
    return await this.handlerPolicy.getAll();

  }


  private async listPolicySet(): Promise<PolicySetDbEntity[]> {
    return await this.handlerPolicySet.getAll();
  }

}
