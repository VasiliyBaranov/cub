import { Field, Int, ObjectType } from 'type-graphql';
import GraphQLJSON from 'graphql-type-json';
import {isTarget} from '../../_validate/validate.access.pap.target';

@ObjectType()
export class RuleObjectType {
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


  @Field(() => GraphQLJSON, {nullable: true})
    // @ts-ignore
  condition: any;


  @Field(() => Boolean, {nullable: true})
    // @ts-ignore
  effect: boolean;
}
