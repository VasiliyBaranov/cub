import { InputType, Field, Int, ObjectType } from 'type-graphql';
import GraphQLJSON from 'graphql-type-json';
import {AccessCombiningAlgorithmEnum} from '../../enums/access.combining-algorithm.enum';
import {isTarget} from '../../_validate/validate.access.pap.target';

@InputType()
export class PolicyAddInputType {
  @Field(() => Int, {nullable: true})
    // @ts-ignore
  id?: number;

  @Field(() => GraphQLJSON)
  @isTarget('target')
    // @ts-ignore
  target: any;


  @Field(() => String)
    // @ts-ignore
  description: string;


  @Field(() => [Int])
    // @ts-ignore
  rule: number[];


  @Field(() => AccessCombiningAlgorithmEnum)
    // @ts-ignore
  combine: string;
}
