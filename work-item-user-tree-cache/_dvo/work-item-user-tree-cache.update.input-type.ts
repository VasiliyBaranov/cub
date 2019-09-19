import { InputType, Field, Int } from 'type-graphql/dist';
import GraphQLJSON from 'graphql-type-json';
import {GqlShortId} from '../../_utils/gql-scalars/gql-short-id';

@InputType()
export class WorkItemUserTreeCacheUpdateInputType {
  @Field(() => Int)
    // @ts-ignore
  id: number;


  @Field(() => GqlShortId)
    // @ts-ignore
  taskId: string;


  @Field(() => GqlShortId)
    // @ts-ignore
  userId: string;


  @Field(() => String)
    // @ts-ignore
  attrKey: string;


  @Field(() => Boolean, { nullable: true })
    // @ts-ignore
  asAncestors?: boolean;


  @Field(() => Boolean, { nullable: true })
    // @ts-ignore
  asDescendants?: boolean;
}
