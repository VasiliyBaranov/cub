import { AccessContext } from './access.context';
import { ICommonContext } from '../context.interface';
import { AccessTargetInputType } from '../work-item/access-target.input-type';
import { IResultPEP, ITarget } from './acceess.interface';
import { Container, Service } from 'typedi';
import { Pep } from './pep';

// todo избавиться от прямой зависимости AccessTargetInputType
@Service()
export class ABAC {
  private accessElements: IResultPEP[] = [];
  private TARGET_ENTITY: string = '';


  /**
   * Формирование контекста для PEP на основе всех входящих данных
   *
   * @param ids массив id любого Entity
   * @param ctx глобальный контекст клиента, не путать с контекстом ABAC
   * @param targetEntity для ABAC это атрибут, но рамках конкретного вызова это какая то сущность Task, User, ...
   * @param data Конкретные поля, они же атрибуты, они же цели
   */
  public async sendData(ids: string[],
                        ctx: ICommonContext,
                        targetEntity: string,
                        data?: AccessTargetInputType[],
  ): Promise<ABAC> {
    this.TARGET_ENTITY = targetEntity;
    const dataContext = [] as AccessContext[];
    ids.forEach(id => {
      if (data && id) {
        data.forEach(attr => {
          const target: ITarget = {
            accessAttribute: attr.accessAttribute,
            action: attr.action,
            actionDetail: {},
          };
          dataContext.push(
            new AccessContext(id, target, ctx),
          );
        });
      }
    });
    const pep = Container.get(Pep);
    this.accessElements = [];
    this.accessElements = await pep.enforce(dataContext);
    return this;
  }


  public async sendDataInfoDebug(ctx: AccessContext): Promise<{ res: IResultPEP[], debugInfo: any }> {
    const pep = Container.get(Pep);
    return await pep.enforceDebug([ctx]);
  }


  /**
   * Получение нужного элемента со всеми атрибутами
   *
   * Вызов данного метода должен происходить только после обработки PEP когда для this.accessElements будет сформирован необходимый контекст,
   * после этого текущий метод будет вызван каждый раз для поиска по контексту конкретной записи.
   *
   * @param id используется для поиска в контексте
   * return массив значений для конкретного элемента, пример [
   * {
   *     accessAttribute: ["Task", "typeId"],
   *     actions: [Read],
   *     access: true,
   * }
   * {
   *     accessAttribute: ["Task", ".responsible"],
   *     actions: [Read],
   *     access: false,
   * }
   * ...
   * ]
   */
  public getFieldAccess(id: string): IResultPEP[] {
    return this.accessElements.filter(item => item.el === id);
  }
}
