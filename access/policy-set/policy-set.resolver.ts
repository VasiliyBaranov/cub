import { Mutation, Query, Arg, Int, Resolver, FieldResolver, Root, Ctx } from 'type-graphql';
import { PolicySetUpdateInputType } from './_dvo/policy-set-update.input-type';
import { PolicySetObjectType } from './_dvo/policy-set.object-type';
import { PolicySetAddInputType } from './_dvo/policy-set-add.input-type';
import { PolicySetHandler } from './policy-set.handler';
import {PolicyObjectType} from '../policy/_dvo/policy.object-type';
import {IContext} from '../../context.interface';
import {PolicySetDataloaders} from './policy-set.dataloaders';
import {PolicySetDbEntity} from './policy-set.db-entity';

@Resolver(() => PolicySetObjectType)
export class PolicySetResolver {


  constructor(
    private readonly handler: PolicySetHandler
  ) {
  }


  @Query(() => [PolicySetObjectType], { nullable: true })
  async policySet(@Arg('id', { nullable: true }) id: number): Promise<any> {
    if (id == null) {
      return await this.handler.getAll();
    } else {
      return await this.handler.find(id);
    }
  }


  @FieldResolver(() => [Int], {nullable: true})
  async policy(
    @Root() root: PolicyObjectType,
    @Ctx() ctx: IContext
  ): Promise<number[] | null> {
    if (root.id == null) {
      return null;
    }
    return await ctx.loader(PolicySetDataloaders).policyFindOneByIds.load(root.id);
  }


  @FieldResolver(() => [Int], {nullable: true})
  async policyGroup(
    @Root() root: PolicyObjectType,
    @Ctx() ctx: IContext
  ): Promise<number[] | null> {
    if (root.id == null) {
      return null;
    }
    return await ctx.loader(PolicySetDataloaders).policyGroupFindOneByIds.load(root.id);
  }


  @Mutation(() => PolicySetObjectType, {nullable: true})
  async policySet_add(@Arg('data') data: PolicySetAddInputType): Promise<PolicySetDbEntity | null> {
    return await this.handler.save(data);
  }


  @Mutation(() => PolicySetObjectType)
  async policySet_update(@Arg('data') data: PolicySetUpdateInputType): Promise<PolicySetDbEntity | null> {
    return await this.handler.save(data);
  }


  @Mutation(() => [Int])
  async policySet_delete(@Arg('data', () => [Int]) data: number[]): Promise<number[]> {
    return await this.handler.remove(data);
  }
}
