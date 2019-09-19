import {Pdp} from './pdp';
import {IResultPEP} from './acceess.interface';
import {AccessContext} from './access.context';
import {Container, Service} from 'typedi';
import {AccessStateAccessPoliyEnum} from './enums/access.state-access-poliy.enum';

@Service()
export class Pep {
  private readonly _decisionPoint: Pdp = Container.get(Pdp);

  /**
   * Обработка полученного результата из PDP
   *
   * После выполенния prepareDecision массив data мутирует. У него появятся новые объекты, Policy и Access
   * для дальнейшей обработки нам требуется только access. Он будет иметь одно из состояний: DENY | PERMIT | NOT_APPLICABLE | INDETERMINATE
   * @param data результат контекста с элементами и целями
   *
   * @return  IResultPEP[] сгенерированный массив JSON объектов. Пример: [
   *    {el: "task-23",  accessAttribute: ["Task"], action: "Read", access: true, userId: "userId123"},
   *    {el: "task-23",  accessAttribute: ["Task", "typeId"], action: "Read", access: true, userId: "userId123"},
   *    {el: "task-24",  accessAttribute: ["Task"], action: "Read", access: true, userId: "userId3"},
   *    {el: "task-24",  accessAttribute: ["Task", ".responsible"], action: "Read", access: false, userId: "userId2"},
   *    ...
   * ]
   */
  public async enforce(data: AccessContext[]): Promise<IResultPEP[]> {
    await this._decisionPoint.prepareDecision(data);
    const resultPEP = [] as IResultPEP[];
    data.forEach(r => {
      const stateAccess = Pep.getStateAccess(r.access);
      resultPEP.push({el: r.el, accessAttribute: r.target.accessAttribute, action: r.target.action, access: stateAccess, userId: r.currentUser});
    });
    return resultPEP;
  }


  public async enforceDebug(data: AccessContext[]): Promise<{res: IResultPEP[], debugInfo: any}> {
    const res = await this.enforce(data);
    const debugInfo = {} as any;
    data.forEach(r => {
      debugInfo.policy = r.policy.getDebugData();
    });
    return {
      res,
      debugInfo,
    };
  }


  private static getStateAccess(access?: AccessStateAccessPoliyEnum): boolean {
    switch (access) {
      case AccessStateAccessPoliyEnum.deny:
      case AccessStateAccessPoliyEnum.indeterminate:
      case AccessStateAccessPoliyEnum.notApplicable:
        return false;
      case AccessStateAccessPoliyEnum.permit:
        return true;
    }
    return false;

  }

}
