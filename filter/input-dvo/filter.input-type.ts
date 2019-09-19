import {ArgsType, Field, InputType, Int} from 'type-graphql/dist';
import {FilterWhereInputType} from './filter.where.input-type';
import {FilterOrderByInputType} from './filter.order-by.input-type';
import {LIMIT_FOR_QUERY} from '../../../../constants';


@InputType()
@ArgsType()
export class FilterInputType {
  @Field(() => FilterWhereInputType, { nullable: true })
    // @ts-ignore
  where?: FilterWhereInputType;

  @Field(() => [FilterOrderByInputType], { nullable: true })
    // @ts-ignore
  orderBy?: FilterOrderByInputType[];

  @Field(() => Int, { nullable: true })
    // @ts-ignore
  offset?: number;

  @Field(() => Int, { nullable: true, defaultValue: LIMIT_FOR_QUERY })
    // @ts-ignore
  limit?: number;
}
