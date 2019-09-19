import {Arg, Query, Resolver} from 'type-graphql/dist';
import {Container} from 'typedi';
import {ABAC} from './abac';
import GraphQLJSON = require('graphql-type-json');
import {IResultPEP} from './acceess.interface';
import {AccessContext} from './access.context';

@Resolver()
export class AbacResolver {

  @Query(() => GraphQLJSON, {nullable: true})
  async permissionInfo(
    @Arg('taskId', () => String) taskId: string,
    @Arg('userId', () => String) userId: string,
    @Arg('target', () => String) target: string,
    @Arg('actionType', () => String) actionType: string,
  ): Promise<{res: IResultPEP[], debugInfo: any}> {
    const abac = Container.get(ABAC);
    const targets = {accessAttribute: [target], action: actionType, actionDetail: {}};
    const accessContext = new AccessContext(taskId, targets, {userId: userId});
    return await abac.sendDataInfoDebug(accessContext);
  }
}
