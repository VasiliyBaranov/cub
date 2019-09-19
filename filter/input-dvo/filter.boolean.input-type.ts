import { Field, InputType } from 'type-graphql/dist';


@InputType()
export class FilterBooleanInputType {
  @Field(() => String)
    // @ts-ignore
  key: string;

  @Field(() => Boolean, {nullable: true})
    // @ts-ignore
  val?: boolean;
}
