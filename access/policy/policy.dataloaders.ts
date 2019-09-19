import { methodLogger } from '../../_utils/logger/method-logger';
import { Service } from 'typedi';

import { DataLoaderDecorator } from '../../_utils/data-loader/data-loader.decorator';
import {PolicyHandler} from './policy.handler';
import {PolicyDbEntity} from './policy.db-entity';

@Service()
export class PolicyDataloaders {
  constructor(private readonly handler: PolicyHandler) {
  }


  @methodLogger()
  @DataLoaderDecorator()
  async ruleFindOneByIds(ids: number[]): Promise<Array<number[]> | null> {
    const related: PolicyDbEntity[] = await this.handler.findRules(ids);
    const res = ids.map(id => {
      const policy = related.find(y => y.id === id);
      if (policy) {
        return policy.rule.map(x => x.id);
      } else {
        return [];
      }
    });
    return res;
  }

}
