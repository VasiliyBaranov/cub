import { Field, InputType } from 'type-graphql/dist';
import { universalScalarType } from '../../../../_utils/gql-scalars/scalar-type';


@InputType()
export class FilterScalarInputType {
  @Field(() => String)
    // @ts-ignore
  key: string;

  @Field(() => universalScalarType, {nullable: true})
    // @ts-ignore
  val?: universalScalarType;
}
