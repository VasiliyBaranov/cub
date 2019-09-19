import { Field, InputType } from 'type-graphql/dist';
import { universalScalarType } from '../../../../_utils/gql-scalars/scalar-type';


@InputType()
export class FilterArrayInputType {
  @Field(() => String)
    // @ts-ignore
  key: string;

  @Field(() => [universalScalarType], {nullable: 'itemsAndList'})
    // @ts-ignore
  val?: any[];
}
