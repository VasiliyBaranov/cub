import {Pip} from './pip';
import {Pap} from './pap';
import {Container, Service} from 'typedi';
import {PolicySet} from './policy-set/policy-set';
import {Policy} from './policy/policy';
import {AccessContext} from './access.context';
import {AccessStateAccessPoliyEnum} from './enums/access.state-access-poliy.enum';
import {Rule} from './rule/rule';
import {Utils} from './_utils';
import {PolicySetDbEntity} from './policy-set/policy-set.db-entity';
import {IListPap} from './acceess.interface';
import {PolicyDbEntity} from './policy/policy.db-entity';
import {AccessCombiningAlgorithmEnum} from './enums/access.combining-algorithm.enum';
import { _logTimeExecuteOperation } from '../_utils/log-time-execute-operation';

@Service()
export class Pdp {

  private readonly _informationPoint: Pip = Container.get(Pip);
  private readonly _administrationPoint: Pap = Container.get(Pap);


  /**
   * Формирование модели политик и вычисление доступов
   *
   * В данном разделе происходит четыре основных итерации
   *      1) Формирование модели политик для каждого элемента контектса, после выполнения, для в data будет новый объект Policy | PolicySet
   *      2) Преообразование текущего контекста в группированный вид более детально в Utils.prepareFlatData()
   *      3) Отрправка в PIP _informationPoint.prepareBatch() группированного контекста для получения данных из БД для каждого Condition.
   * После выполнения в data для  Policy | PolicySet будет мутирован attribute и valueAttribute в Rule.Condition
   *      4) Вычесление поля Access в policy.exec(), после выполнения будет мутирован data, поле access получит значение
   *
   * ОСТОРОЖНО!  Для 1, 3, 4 пункта Происходит мутирование контекста для data.
   *
   * @param data результат контекста с элементами и целями позже будет описание
   */
  // todo: Думаю имеет смысл разнести на три разных метода
  public async prepareDecision(data: AccessContext[]): Promise<void> {
    const startTimeExecutePDP = +new Date();
    const listPAP = await this._administrationPoint.listDataPap();

    const valuableList = [...listPAP.policySet, ...listPAP.policy];
    data.forEach(c => {
      const resultDecisionItems = this._administrationPoint.getPolicyForCtx(c, valuableList);

      if (resultDecisionItems.length === 1) {
        c.policy = this.createPolicy(resultDecisionItems[0], c, listPAP);
      }
      if (!resultDecisionItems.length) {
        c.access = AccessStateAccessPoliyEnum.permit;
      }
      if (resultDecisionItems.length > 1) {

        const policySetList: PolicySet[] = [];
        const policyList: Policy[] = [];
        resultDecisionItems.forEach(r => {
          const policy = this.createPolicy(r, c, listPAP);
          if (policy instanceof PolicySet) {
            policySetList.push(policy);
          }
          if (policy instanceof Policy) {
            policyList.push(policy);
          }
        });
        const policyAndPolicySet = {policy: policyList, policySet: policySetList};
        c.policy = new PolicySet(policyAndPolicySet, null, AccessCombiningAlgorithmEnum.permitUnlessDeny);
      }
    });

    const groupFlatData = Utils.prepareFlatData(
      data.filter(f => !f.access)
    );
    // _logTimeExecuteOperation('ExecutePDPFirst', startTimeExecutePDP);

    const startTimeExecutePIP = +new Date();
    await this._informationPoint.prepareBatch(groupFlatData);
    // _logTimeExecuteOperation('ExecutePIP', startTimeExecutePIP);

    const startTimeExecutePDPS = +new Date();
    data.filter(f => !f.access)
      .forEach(el => {
        el.policy.exec();
        el.access = el.policy.access;
      });
    // _logTimeExecuteOperation('ExecutePDPSecond', startTimeExecutePDPS);
  }


  createPolicy<T extends PolicyDbEntity | PolicySetDbEntity>(
    policyType: T,
    c: AccessContext,
    papRes: IListPap
  ): T extends PolicyDbEntity ? Policy : PolicySet {
    if (policyType instanceof PolicyDbEntity) {
      const rules = papRes.rule
        .filter(x => policyType.rule.find(r => r.id === x.id))
        .map(x => new Rule(x));

      return new Policy(rules, policyType) as any;
    }
    if (policyType instanceof PolicySetDbEntity) {
      const policies = papRes.policy
        .filter(x => policyType.policy.find(p => p.id === x.id))
        .map(x => this.createPolicy(x, c, papRes));

      const policyGroup = papRes.policySet
        .filter(x => policyType.policyGroup.find(p => p.id === x.id))
        .map(x => this.createPolicy(x, c, papRes));

      return new PolicySet({policy: policies, policySet: policyGroup}, policyType) as any;

    }
    throw new Error('wrong type for policyType!' + policyType);
  }


  /**
   * Проверка на существование политик или группы политик.
   *
   * Если не нашлось не одной политики в рамках текущего контекста, то разрешаем полный доступ
   *
   * @param ctx
   */
  public async isPolicy(ctx: AccessContext): Promise<boolean> {
    const listPAP = await this._administrationPoint.listDataPap();
    const valuableList = [...listPAP.policySet, ...listPAP.policy];
    const isPolicy = this._administrationPoint.getPolicyForCtx(ctx, valuableList);
    return !!isPolicy.length;
  }
}
