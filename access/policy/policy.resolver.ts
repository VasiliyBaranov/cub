import { Mutation, Query, Arg, Int, Resolver, FieldResolver, Root, Ctx } from 'type-graphql';
import { PolicyUpdateInputType } from './_dvo/policy-update.input-type';
import { PolicyObjectType } from './_dvo/policy.object-type';
import { PolicyAddInputType } from './_dvo/policy-add.input-type';
import { PolicyHandler } from './policy.handler';
import {PolicyDbEntity} from './policy.db-entity';
import {IContext} from '../../context.interface';
import {PolicyDataloaders} from './policy.dataloaders';

@Resolver(() => PolicyObjectType)
export class PolicyResolver {


  constructor(
    private readonly handlerMeta: PolicyHandler
  ) {
  }


  @Query(() => [PolicyObjectType], { nullable: true })
  async policy(@Arg('id', { nullable: true }) id: number): Promise<any> {
    if (id == null) {
      return await this.handlerMeta.getAll();
    } else {
      return await this.handlerMeta.find(id);
    }
  }


  @Mutation(() => PolicyObjectType, {nullable: true})
  async policy_add(@Arg('data') data: PolicyAddInputType): Promise<PolicyDbEntity | null> {
    return await this.handlerMeta.save(data);
  }


  @FieldResolver(() => [Int], {nullable: true})
  async rule(
    @Root() root: PolicyObjectType,
    @Ctx() ctx: IContext
  ): Promise<number[] | null> {
    if (root.id == null) {
      return null;
    }
    return await ctx.loader(PolicyDataloaders).ruleFindOneByIds.load(root.id);
  }


  @Mutation(() => PolicyObjectType)
  async policy_update(@Arg('data') data: PolicyUpdateInputType): Promise<PolicyDbEntity | null> {
    return await this.handlerMeta.save(data);
  }


  @Mutation(() => [Int])
  async policy_delete(@Arg('data', () => [Int]) data: number[]): Promise<number[]> {
    return await this.handlerMeta.remove(data);
  }
}
