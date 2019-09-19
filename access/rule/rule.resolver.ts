import {Mutation, Query, Arg, Int, Resolver} from 'type-graphql';
import {RuleUpdateInputType} from './_dvo/rule-update.input-type';
import {RuleObjectType} from './_dvo/rule.object-type';
import {RuleAddInputType} from './_dvo/rule-add.input-type';
import {RuleHandler} from './rule.handler';

@Resolver(() => RuleObjectType)
export class RuleResolver {


  constructor(
    private readonly handler: RuleHandler
  ) {
  }


  @Query(() => [RuleObjectType], {nullable: true})
  async rule(@Arg('id', {nullable: true}) id: number): Promise<any> {
    if (id == null) {
      return await this.handler.getAll();
    } else {
      return await this.handler.find(id);
    }
  }


  @Mutation(() => RuleObjectType, {nullable: true})
  async rule_add(@Arg('data') data: RuleAddInputType): Promise<RuleAddInputType | null> {
    return await this.handler.save(data);
  }


  @Mutation(() => RuleObjectType)
  async rule_update(@Arg('data') data: RuleUpdateInputType): Promise<RuleUpdateInputType | null> {
    return await this.handler.update(data);
  }


  @Mutation(() => [Int])
  async rule_delete(@Arg('data', () => [Int]) data: number[]): Promise<number[]> {
    return await this.handler.remove(data);
  }
}
