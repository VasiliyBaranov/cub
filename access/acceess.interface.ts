import {RuleDbEntity} from './rule/rule.db-entity';
import {PolicyDbEntity} from './policy/policy.db-entity';
import {PolicySetDbEntity} from './policy-set/policy-set.db-entity';
import {AccessAttributeVo} from './condition/access-attribute-vo';
import {Condition} from './condition/condition';
import {AccessContext} from './access.context';
import {AccessActionTypeEnum} from './enums/access.action-type.enum';
import {ColumnMetadata} from 'typeorm/metadata/ColumnMetadata';

export interface IStructureRuleCondition {
  attribute: IStructureRuleConditionAttr | string;
  operator: string;
  valueAttribute: IStructureRuleConditionAttr | string | number | boolean;
}


export interface IStructureRuleConditionAttr {
  attr: string;
  param: {[key: string]: any};
}


export interface IListPap {
  rule: RuleDbEntity[];
  policy: PolicyDbEntity[];
  policySet: PolicySetDbEntity[];
}


export interface IFlatData {
  attr: AccessAttributeVo;
  condition: Condition;
  context: AccessContext;
}

/**
 * IResultPEP[] сгенерированный массив JSON объектов. Пример: [
 *    {el: "task-23",  accessAttribute: ["Task"], action: "Read", access: true, userId: "userId123"},
 *    {el: "task-23",  accessAttribute: ["Task", "typeId"], action: "Read", access: true, userId: "userId123"},
 *    {el: "task-24",  accessAttribute: ["Task"], action: "Read", access: true, userId: "userId3"},
 *    {el: "task-24",  accessAttribute: ["Task", ".responsible"], action: "Read", access: false, userId: "userId2"},
 *    ...
 * ]
 */
export interface IResultPEP {
  el: string;
  accessAttribute: string[]; // example: ["Task", ".responsible"]
  action?: AccessActionTypeEnum | string;
  userId?: string;
  access: boolean;
}

export interface IConnectorPIP {
  batch(data: IFlatData[]): Promise<void>;
  getColumns(): ColumnMetadata[];
}

export interface IStructureConnector {
  field: string;
  type: string;
}

export interface IModelPolicy {
  exec(): void;
  getDebugData(): any;
}

export interface ITarget {
  accessAttribute: string[];
  action: string;
  actionDetail: {};
}
