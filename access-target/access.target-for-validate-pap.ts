import { AccessTargetWorkItem } from './access.target.work-item';
import { Container } from 'typedi';
import { StatusCft } from '../cft/complex/status-cft/status-cft';
import { IAccessValidateTarget } from '../access/_validate/validate.interface';


// todo Нужно уменьшать связность
export class AccessTargetForValidatePap implements IAccessValidateTarget {
  constructor() { //
  }

  private getAttrsListAccess(): IAccessClass[] {
    const staticAttrs = [
      {
        accessValidateAttrName: 'Task',
        initClass: AccessTargetWorkItem,
        accessValidateActions: ['Read', 'CreateSubTask', 'Update', 'Delete']
      },
      {
        accessValidateAttrName: 'application',
        initClass: AccessTargetWorkItem, // какой будет использоваться здесь, пока под вопросом.
        accessValidateActions: ['CreateTopLevelTask']
      },
      {
        accessValidateAttrName: 'status',
        initClass: StatusCft,
        accessValidateActions: ['Read']
      },
    ];
    return staticAttrs;
  }


  public async validateTarget(fields: string[], action: string, detail: string): Promise<boolean> {
    if (!Array.isArray(fields) || !fields[0]) {
      console.error('Непредвиденная ошибка! validateTarget - Некорректное значение параметра fields: "' + fields + '" (AccessTargetForValidatePap)');
      return false;
    }

    const listAccess = this.getAttrsListAccess();

    const attr = listAccess.find(f => f.accessValidateAttrName === fields[0]);
    if (!attr) {
      console.error('Для цели должен быть задан параметр accessAttribute. Атрибут не найден: ' + fields[0] + '(AccessTargetForValidatePap)');
      return false;
    }
    fields.shift();
    if (fields.length && attr) {

      const task: any = Container.get(attr.initClass);
      return await task.validateTarget(fields, action, detail);
    } else {
      if (!attr.accessValidateActions.includes(action) && action) {
        console.error(`Для атрибута ${attr.accessValidateAttrName} action не валиден (AccessTargetForValidatePap)`);
        return false;
      }
    }
    return true;
  }
}

interface IAccessClass {
  accessValidateAttrName: string;
  initClass: any;
  accessValidateActions: any[];
}
