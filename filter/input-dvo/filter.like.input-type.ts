import { Field, InputType } from 'type-graphql/dist';


@InputType()
export class FilterLikeInputType {
  @Field(() => String)
    // @ts-ignore
  key: string;

  @Field(() => String, {nullable: true})
    // @ts-ignore
  val?: string;
}
