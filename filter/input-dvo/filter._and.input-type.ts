import { Field, InputType } from 'type-graphql/dist';
import { FilterOrInputType } from './filter._or.input-type';
import { ConditionInputType } from './condition.input-type';


@InputType()
export class FilterAndInputType extends ConditionInputType {
  @Field(() => FilterAndInputType, { nullable: true })
    // @ts-ignore
  _and?: FilterAndInputType;

  @Field(() => FilterOrInputType, { nullable: true })
    // @ts-ignore
  _or?: FilterOrInputType;
}
