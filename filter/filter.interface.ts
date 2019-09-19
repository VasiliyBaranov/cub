import {SelectQueryBuilder} from 'typeorm';
import {IAttributeEntityExtended} from '../../custom-feild/custom-field.handler';

export interface IFilterOrderBy {
  field: string;
  sort: 'ASC' | 'DESC';
}


export interface IFilterTypeValidField {
  key: string;
  val: any;
}


export type IFilterSchema = IFilterSchemaOperator | IFilterSchemaCondition;


export interface IFilterSchemaOperator {
  operator: string;
  items: IFilterSchema[];
}


export interface IFilterSchemaCondition {
  condition: string;
  conditionParam: {};
}


export interface IFilterQuerySql {
  sql?: string;
  param?: Array<any>;
  qb?: any;
}


export interface IPrepareDataForQB {
  qb: SelectQueryBuilder<any>;
  allAttrs: IAttributeEntityExtended[];
  scheme: any;
}
