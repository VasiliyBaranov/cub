import { Field, InputType } from 'type-graphql/dist';
import { FilterLikeInputType } from './filter.like.input-type';
import { FilterScalarInputType } from './filter.scalar.input-type';
import { FilterArrayInputType } from './filter.array.input-type';
import { FilterBooleanInputType } from './filter.boolean.input-type';


@InputType()
export class ConditionInputType {
  @Field(() => [FilterScalarInputType], { nullable: true })
    // @ts-ignore
  _eq?: FilterScalarInputType[];

  @Field(() => [FilterScalarInputType], { nullable: true })
    // @ts-ignore
  _neq?: FilterScalarInputType[];

  @Field(() => FilterScalarInputType, { nullable: true })
    // @ts-ignore
  _gt?: FilterScalarInputType;

  @Field(() => FilterScalarInputType, { nullable: true })
    // @ts-ignore
  _gte?: FilterScalarInputType;

  @Field(() => FilterScalarInputType, { nullable: true })
    // @ts-ignore
  _lt?: FilterScalarInputType;

  @Field(() => FilterScalarInputType, { nullable: true })
    // @ts-ignore
  _lte?: FilterScalarInputType;

  @Field(() => [FilterArrayInputType], { nullable: true })
    // @ts-ignore
  _in?: FilterArrayInputType[];

  @Field(() => [FilterArrayInputType], { nullable: true })
    // @ts-ignore
  _nin?: FilterArrayInputType[];

  @Field(() => [FilterLikeInputType], { nullable: true })
    // @ts-ignore
  _like?: FilterLikeInputType[];

  @Field(() => FilterLikeInputType, { nullable: true })
    // @ts-ignore
  _nlike?: FilterLikeInputType;

  @Field(() => FilterLikeInputType, { nullable: true })
    // @ts-ignore
  _ilike?: FilterLikeInputType;

  @Field(() => FilterLikeInputType, { nullable: true })
    // @ts-ignore
  _nilike?: FilterLikeInputType;

  @Field(() => FilterLikeInputType, { nullable: true })
    // @ts-ignore
  _similar?: FilterLikeInputType;

  @Field(() => FilterLikeInputType, { nullable: true })
    // @ts-ignore
  _nsimilar?: FilterLikeInputType;

  @Field(() => FilterBooleanInputType, { nullable: true })
    // @ts-ignore
  _isnull?: FilterBooleanInputType;
}
