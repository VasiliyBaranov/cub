import { methodLogger } from '../../_utils/logger/method-logger';
import { Service } from 'typedi';

import { DataLoaderDecorator } from '../../_utils/data-loader/data-loader.decorator';
import {PolicySetHandler} from './policy-set.handler';
import {PolicySetDbEntity} from './policy-set.db-entity';

@Service()
export class PolicySetDataloaders {
  constructor(private readonly handler: PolicySetHandler) {
  }


  @methodLogger()
  @DataLoaderDecorator()
  async policyFindOneByIds(ids: number[]): Promise<Array<number[]> | null> {
    const related: PolicySetDbEntity[] = await this.handler.findPolicy(ids);
    const res = ids.map(id => {
      const policy = related.find(y => y.id === id);
      if (policy) {
        return policy.policy.map(x => x.id);
      } else {
        return [];
      }

    });
    return res;
  }


  @methodLogger()
  @DataLoaderDecorator()
  async policyGroupFindOneByIds(ids: number[]): Promise<Array<number[]> | null> {
    const related: PolicySetDbEntity[] = await this.handler.findPolicy(ids);
    const res = ids.map(id => {
      const policy = related.find(y => y.id === id);
      if (policy) {
        return policy.policyGroup.map(x => x.id);
      } else {
        return [];
      }

    });
    return res;
  }

}
