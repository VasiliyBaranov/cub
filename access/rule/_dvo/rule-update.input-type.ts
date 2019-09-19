import { InputType, Field, Int } from 'type-graphql';
import GraphQLJSON from 'graphql-type-json';
import {isTarget} from '../../_validate/validate.access.pap.target';
import {RuleConditionInputType} from './rule-condition.input-type';

@InputType()
export class RuleUpdateInputType {
  @Field(() => Int)
    // @ts-ignore
  id: number;

  @Field(() => String, {nullable: true})
    // @ts-ignore
  description: string;


  @Field(() => GraphQLJSON)
  @isTarget('target')
    // @ts-ignore
  target: any;


  @Field(() => [RuleConditionInputType])
    // @ts-ignore
  condition: RuleConditionInputType[];


  @Field(() => Boolean, {nullable: true})
    // @ts-ignore
  effect: boolean;
}
