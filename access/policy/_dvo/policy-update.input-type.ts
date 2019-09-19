import { InputType, Field, Int } from 'type-graphql';
import GraphQLJSON from 'graphql-type-json';
import {AccessCombiningAlgorithmEnum} from '../../enums/access.combining-algorithm.enum';
import {isTarget} from '../../_validate/validate.access.pap.target';

@InputType()
export class PolicyUpdateInputType {
  @Field(() => Int)
    // @ts-ignore
  id: number;

  @Field(() => GraphQLJSON)
  @isTarget('target')
    // @ts-ignore
  target: any;


  @Field(() => String, {nullable: true})
    // @ts-ignore
  description?: string;


  @Field(() => [Int], {nullable: true})
    // @ts-ignore
  rule?: number[];


  @Field(() => AccessCombiningAlgorithmEnum, { nullable: true })
    // @ts-ignore
  combine?: string;
}
