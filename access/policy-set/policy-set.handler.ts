import { Container, Service } from 'typedi';
import { BaseHandler } from '../../base-handler';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { FindConditions, In, Repository } from 'typeorm';
import { methodLogger } from '../../_utils/logger/method-logger';
import { PolicySetDbEntity } from './policy-set.db-entity';
import { PolicySetAddInputType } from './_dvo/policy-set-add.input-type';
import {PolicyDbEntity} from '../policy/policy.db-entity';
import {AccessReadCacheUpdateAll} from '../../access-read-cache/access.read-cache.update-all';

@Service()
export class PolicySetHandler extends BaseHandler {
  constructor(
    @InjectRepository(PolicySetDbEntity) private repo: Repository<PolicySetDbEntity>,
    @InjectRepository(PolicyDbEntity) private repoPolicy: Repository<PolicyDbEntity>,
  ) {
    super();
  }


  @methodLogger()
  async getOne(id?: number): Promise<PolicySetDbEntity | null> {
    if (id == null) {
      return null;
    }

    const res = await this.repo.findOne({ where: { id }, relations: [] })
      .catch(e => {
        throw new Error(e); // тут обязательно писать, тк отладка асинхронных операций в JS боль.
      });

    return res || null;
  }


  async getAll(): Promise<PolicySetDbEntity[]> {
    return await this.repo.find({relations: ['policy', 'policyGroup']})
      .catch(e => {
        throw new Error(e); // тут обязательно писать, тк отладка асинхронных операций в JS боль.
      });
  }


  async find(id: number): Promise<PolicySetDbEntity[]> {
    return  await this.repo.find({ id: id })
      .catch(e => {
        throw new Error(e); // тут обязательно писать, тк отладка асинхронных операций в JS боль.
      });
  }


  async findPolicy(ids: number[]): Promise<PolicySetDbEntity[]> {
    return await this.repo.find({where: {id: In(ids)}, relations: ['policy', 'policyGroup']}, )
      .catch(e => {
        throw new Error(e); // тут обязательно писать, тк отладка асинхронных операций в JS боль.
      });
  }


  async save(data: PolicySetAddInputType): Promise<PolicySetDbEntity | null> {
    let policy = [] as PolicyDbEntity[];
    let policySet = [] as PolicySetDbEntity[];
    if (data.policy && data.policy.length) {
      policy = await this.repoPolicy.find({id: In(data.policy)});
    }
    if (data.policyGroup && data.policyGroup.length) {
      policySet = await this.repo.find({id: In(data.policyGroup)});
    }
    const policySetCreate = this.repo.create({...data, policy: policy, policyGroup: policySet, });
    const result = await this.repo.save(policySetCreate).catch( e => {
      throw new Error(e);
    });

    // todo переделать на слабое связывание!
    await AccessReadCacheUpdateAll.init();
    return result;
  }


  async remove(data: number[]): Promise<number[]> {

    const result = await this._baseRemoveForever(this.repo, data).catch( e => {
      throw new Error(e);
    });

    // todo переделать на слабое связывание!
    await AccessReadCacheUpdateAll.init();
    return result;
  }
}
