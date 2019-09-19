import { InputType, Field, Int } from 'type-graphql';
import GraphQLJSON from 'graphql-type-json';
import {Service} from 'typedi';
import {isTarget} from '../../_validate/validate.access.pap.target';
import {RuleConditionInputType} from './rule-condition.input-type';

@InputType()
@Service()
export class RuleAddInputType {
  @Field(() => Int, {nullable: true})
    // @ts-ignore
  id: number;

  @Field(() => String)
    // @ts-ignore
  description: string;


  @Field(() => GraphQLJSON)
  @isTarget('target')
    // @ts-ignore
  target: any;


  @Field(() => [RuleConditionInputType])
    // @ts-ignore
  condition: RuleConditionInputType[];


  @Field(() => Boolean)
    // @ts-ignore
  effect: boolean;
}
