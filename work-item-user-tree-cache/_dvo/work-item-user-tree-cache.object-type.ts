import { Field, Int, ObjectType } from 'type-graphql';
import {GqlShortId} from '../../_utils/gql-scalars/gql-short-id';

@ObjectType()
export class WorkItemUserTreeCacheObjectType {
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


  @Field(() => Boolean)
    // @ts-ignore
  asAncestors: boolean;


  @Field(() => Boolean)
    // @ts-ignore
  asDescendants: boolean;
}
