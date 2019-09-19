import {registerEnumType} from 'type-graphql';

export enum AccessCombiningAlgorithmEnum {
  permitUnlessDeny = 'Permit-unless-deny',
  denyUnlessPermit = 'Deny-unless-permit',

}
registerEnumType(AccessCombiningAlgorithmEnum, {
  name: 'accessCombiningAlgorithmEnum',
});
