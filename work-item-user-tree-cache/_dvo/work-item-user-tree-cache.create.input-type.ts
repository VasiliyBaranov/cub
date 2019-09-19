import { InputType, Field, Int, ObjectType } from 'type-graphql/dist';
import {GqlShortId} from '../../_utils/gql-scalars/gql-short-id';

@InputType()
export class WorkItemUserTreeCacheCreateInputType {
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
