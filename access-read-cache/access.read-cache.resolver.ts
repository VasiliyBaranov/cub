import {Mutation, Resolver} from 'type-graphql/dist';
import {AccessReadCacheHandler} from './access.read-cache.handler';

@Resolver()
export class AccessReadCacheResolver {
  constructor(private readonly _accessQueryHandler: AccessReadCacheHandler) {
  }


  @Mutation(() => String)
  async accessReadCache_refresh(): Promise<string> {
    await this._accessQueryHandler.refreshAccessForAll();
    return 'done';
  }
}
