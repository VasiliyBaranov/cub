import {Container} from 'typedi';
import {CacheService} from '../work-item/cache.service';
import {WorkItemUserTreeCacheHandler} from '../work-item-user-tree-cache/work-item-user-tree-cache.handler';
import {AccessReadCacheHandler} from './access.read-cache.handler';

export class AccessReadCacheUpdateAll {
  static async init(): Promise<void> {
    Container.import([CacheService]);
    const taskUserCacheHandler = Container.get(WorkItemUserTreeCacheHandler);
    await taskUserCacheHandler.refreshCacheByUser();
    const taskCache = Container.get(AccessReadCacheHandler);
    await taskCache.refreshAccessForAll();
  }

}
