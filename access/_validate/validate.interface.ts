export interface ITarget {
  accessAttribute: string[];
  action: string;
  detail: string;
}


export interface IAccessValidateAttr {
  accessValidateAttrName: string;
  accessValidateActions: string[];
}


export interface IAccessValidateTarget {
  validateTarget(fields: string[], action: string, detail: string): Promise<boolean>;
}
