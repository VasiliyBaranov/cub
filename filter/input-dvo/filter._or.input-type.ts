import { Field, InputType } from 'type-graphql/dist';
import { FilterAndInputType } from './filter._and.input-type';
import { ConditionInputType } from './condition.input-type';


@InputType()
export class FilterOrInputType extends ConditionInputType {
  @Field(() => FilterAndInputType, { nullable: true })
    // @ts-ignore
  _and?: FilterAndInputType;

  @Field(() => FilterOrInputType, { nullable: true })
    // @ts-ignore
  _or?: FilterOrInputType;
}
