import {registerEnumType} from 'type-graphql';

export enum AccessStateAccessPoliyEnum {
  deny = 'DENY',
  permit = 'PERMIT',
  notApplicable = 'NOT_APPLICABLE',
  indeterminate = 'INDETERMINATE',
}
registerEnumType(AccessStateAccessPoliyEnum, {
  name: 'accessStateAccessPoliyEnum',
});
