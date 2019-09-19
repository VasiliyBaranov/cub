import { Field, Int, ObjectType } from 'type-graphql';
import GraphQLJSON from 'graphql-type-json';
import {AccessCombiningAlgorithmEnum} from '../../enums/access.combining-algorithm.enum';
import {isTarget} from '../../_validate/validate.access.pap.target';

@ObjectType()
export class PolicyObjectType {
  @Field(() => Int)
    // @ts-ignore
  id: number;

  @Field(() => GraphQLJSON)
  @isTarget('target')
    // @ts-ignore
  target: any;


  @Field(() => String, {nullable: true})
    // @ts-ignore
  description: string;


  @Field(() => [Int], {nullable: true})
    // @ts-ignore
  rule: number[];


  @Field(() => AccessCombiningAlgorithmEnum)
    // @ts-ignore
  combine: string;
}
