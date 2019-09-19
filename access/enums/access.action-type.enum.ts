import {registerEnumType} from 'type-graphql';

export enum AccessActionTypeEnum {
  Create = 'Create',
  Read = 'Read',
  Update = 'Update',
  Delete = 'Delete'
}
registerEnumType(AccessActionTypeEnum, {
  name: 'accessActionTypeEnum',
});
