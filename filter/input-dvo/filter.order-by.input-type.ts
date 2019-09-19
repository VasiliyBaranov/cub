import { Field, InputType } from 'type-graphql/dist';
import { registerEnumType } from 'type-graphql';

@InputType()
export class FilterOrderByInputType {
  @Field(() => String)
    // @ts-ignore
  key: string;

  @Field(() => SortOrderByEnum)
    // @ts-ignore
  sort: SortOrderByEnum;
}


export enum SortOrderByEnum {
  asc = 'ASC',
  desc = 'DESC',
}


registerEnumType(SortOrderByEnum, {
  name: 'SortOrderBy' // this one is mandatory
});
