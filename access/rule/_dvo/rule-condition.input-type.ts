import { InputType, Field } from 'type-graphql';
import GraphQLJSON = require('graphql-type-json');
import {isAccessPapAttribute} from '../../_validate/validate.access.pap.attribute';
import {Service} from 'typedi';

@InputType()
@Service()
export class RuleConditionInputType {

  @Field(() => GraphQLJSON)
  @isAccessPapAttribute('attr')
    // @ts-ignore
  attribute: any;


  @Field(() => GraphQLJSON)
  @isAccessPapAttribute('attr')
    // @ts-ignore
  valueAttribute: any;


  @Field(() => String)
    // @ts-ignore
  operator: string;
}
