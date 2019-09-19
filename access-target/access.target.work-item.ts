import {CftContainer} from '../cft/cft.container';
import {Container, Service} from 'typedi';
import {CustomFieldHandler} from '../work-item/custom-feild/custom-field.handler';
import {BaseCft} from '../cft/base-cft';
import { IAccessValidateAttr, IAccessValidateTarget } from '../access/_validate/validate.interface';


// todo Нужно выносить это отсюда! В work-item


Service();
export class AccessTargetWorkItem implements IAccessValidateTarget {

  // todo убирать хардкод
  async getAttrsListAccess(): Promise<IAccessValidateAttr[]> {
    const staticAttrs: IAccessValidateAttr[] = [
      {
        accessValidateAttrName: 'id',
        accessValidateActions: ['Read']
      },
      {
        accessValidateAttrName: 'typeId',
        accessValidateActions: ['Read']
      },
      {
        accessValidateAttrName: 'parentId',
        accessValidateActions: ['Read', 'Update']
      },
      {
        accessValidateAttrName: 'title',
        accessValidateActions: ['Read', 'Update']
      },
      {
        accessValidateAttrName: 'createTime',
        accessValidateActions: ['Read']
      },
      {
        accessValidateAttrName: 'updateTime',
        accessValidateActions: ['Read']
      },
      {
        accessValidateAttrName: 'children',
        accessValidateActions: ['Read']
      },
      {
        accessValidateAttrName: 'hasChildren',
        accessValidateActions: ['Read']
      },
      {
        accessValidateAttrName: 'node.parent.ts',
        accessValidateActions: ['Read']
      },
      {
        accessValidateAttrName: 'ancestors',
        accessValidateActions: ['Read']
      },
      {
        accessValidateAttrName: 'descendants',
        accessValidateActions: ['Read']
      },
      {
        accessValidateAttrName: 'type',
        accessValidateActions: ['Read']
      },
      {
        accessValidateAttrName: 'isDeleted',
        accessValidateActions: ['Read']
      },
    ];

    const allAttrs = await Container.get(CustomFieldHandler).getAll();
    const taskSystemAttrs = Container.get(CftContainer).categories;
    allAttrs.forEach(attr => {
      const category = taskSystemAttrs.find(f => f.key === attr.cft);
      if (category) {
        staticAttrs.push({
          accessValidateAttrName: `.${attr.key}`,
          accessValidateActions: category.accessValidateActions ? category.accessValidateActions : []
        });
      }
    });
    return staticAttrs;
  }


  constructor() { //
  }


  public async validateTarget(fields: string[], action: string, detail: string): Promise<boolean> {
    const listAccess = await this.getAttrsListAccess();
    const firstField = fields[0];
    const isElementAccess = listAccess.find(r => r.accessValidateAttrName === firstField);
    if (!isElementAccess) {
      console.error(`Атрибут ${firstField} не найден (AccessTargetWorkItem)`);
      return false;
    }
    const isFieldPlugin = firstField.split('.')[1];
    if (isFieldPlugin) {
      fields.shift();
      const category: any = await this.getCategory(isFieldPlugin);
      // tslint:disable-next-line:no-string-literal
      if (category['validateTarget'] !== undefined && fields.length) {
        return await category.validateTarget(fields.shift(), action, detail);
      } else {
        if (!isElementAccess.accessValidateActions.includes(action) && action) {
          console.error(`Для атрибута ${firstField} actions не найден (AccessTargetWorkItem)`);
          return false;
        }
      }
    } else {
     if (!isElementAccess.accessValidateActions.includes(action) && action) {
        console.error(`Для атрибута ${firstField} actions не найден (AccessTargetWorkItem)`);
        return false;
      }
    }
    return true;
  }


  /**
   * Текущий метод потребуется для валидации
   * @param allAttrs
   */
  private async getCategory(field: string): Promise<BaseCft<any, any> | undefined> {
    const allAttrs = await Container.get(CustomFieldHandler).getAll();
    const allCategory = Container.get(CftContainer);
    let category: BaseCft<any, any> | undefined;
    allAttrs.forEach(attr => {
      if (attr.key === field) {
        category = allCategory.categories.find(r => r.key === attr.cft);
      }
    });
    return category;
  }
}
