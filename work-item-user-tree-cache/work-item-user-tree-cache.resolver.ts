import {Mutation, Query, Arg, Int, Resolver, FieldResolver, Root, Ctx, Args} from 'type-graphql/dist';
import {WorkItemUserTreeCacheUpdateInputType} from './_dvo/work-item-user-tree-cache.update.input-type';
import {WorkItemUserTreeCacheObjectType} from './_dvo/work-item-user-tree-cache.object-type';
import {WorkItemUserTreeCacheCreateInputType} from './_dvo/work-item-user-tree-cache.create.input-type';
import {WorkItemUserTreeCacheHandler} from './work-item-user-tree-cache.handler';
import {UserHandler} from '../user/user.handler';
import {ICommonContext} from '../context.interface';
import {FilterInputType} from '../work-item/_query/filter/input-dvo/filter.input-type';

@Resolver(() => WorkItemUserTreeCacheObjectType)
export class WorkItemUserTreeCacheResolver {


  constructor(
    private readonly _userHandler: UserHandler,
    private readonly _queryHandler: WorkItemUserTreeCacheHandler,
  ) {
  }


  @Query(() => [WorkItemUserTreeCacheObjectType], {nullable: true})
  async workItemUserTreeCache(
    @Args(() => FilterInputType) params: FilterInputType,
    @Ctx() ctx: ICommonContext
  ): Promise<any> {
    return await this._queryHandler.findFilter(ctx, params);
  }


  @Mutation(() => WorkItemUserTreeCacheObjectType, {nullable: true})
  async workItemUserTree_add(@Arg('data') data: WorkItemUserTreeCacheCreateInputType): Promise<WorkItemUserTreeCacheCreateInputType | null> {
    return await this._queryHandler.save(data);
  }


  @Mutation(() => WorkItemUserTreeCacheObjectType)
  async workItemUserTree_update(@Arg('data') data: WorkItemUserTreeCacheUpdateInputType): Promise<WorkItemUserTreeCacheUpdateInputType | null> {
    return await this._queryHandler.update(data);
  }


  @Mutation(() => [Int])
  async workItemUserTree_delete(@Arg('data', () => [Int]) data: number[]): Promise<number[]> {
    return await this._queryHandler.remove(data);
  }


  @Mutation(() => String)
  async workItemUserTree_refresh(): Promise<string> {
    await this._queryHandler.refreshCacheByUser();
    return 'done';
  }
}
