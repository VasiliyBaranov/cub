import {Container, Service} from 'typedi';
import {BaseHandler} from '../../base-handler';
import {InjectRepository} from 'typeorm-typedi-extensions';
import {In, Repository} from 'typeorm';
import {methodLogger} from '../../_utils/logger/method-logger';
import {PolicyDbEntity} from './policy.db-entity';
import {PolicyAddInputType} from './_dvo/policy-add.input-type';
import {RuleDbEntity} from '../rule/rule.db-entity';
import {AccessReadCacheUpdateAll} from '../../access-read-cache/access.read-cache.update-all';
import { PolicyUpdateInputType } from './_dvo/policy-update.input-type';

@Service()
export class PolicyHandler extends BaseHandler {
  constructor(
    @InjectRepository(PolicyDbEntity) private repo: Repository<PolicyDbEntity>,
    @InjectRepository(RuleDbEntity) private repoRule: Repository<RuleDbEntity>
  ) {
    super();
  }


  @methodLogger()
  async getOne(id?: number): Promise<PolicyDbEntity | null> {
    if (id == null) {
      return null;
    }

    const res = await this.repo.findOne({where: {id}, relations: []})
      .catch(e => {
        throw new Error(e); // тут обязательно писать, тк отладка асинхронных операций в JS боль.
      });

    return res || null;
  }


  async getAll(): Promise<PolicyDbEntity[]> {
    return await this.repo.find({relations: ['rule']})
      .catch(e => {
        throw new Error(e); // тут обязательно писать, тк отладка асинхронных операций в JS боль.
      });
  }

  async findRules(ids: number[]): Promise<PolicyDbEntity[]> {
    return await this.repo.find({where: {id: In(ids)}, relations: ['rule']}, )
      .catch(e => {
        throw new Error(e); // тут обязательно писать, тк отладка асинхронных операций в JS боль.
      });
  }


  async find(id: number): Promise<PolicyDbEntity[]> {
    return await this.repo.find({id: id})
      .catch(e => {
        throw new Error(e); // тут обязательно писать, тк отладка асинхронных операций в JS боль.
      });
  }


  async save(data: PolicyAddInputType | PolicyUpdateInputType): Promise<PolicyDbEntity | null> {
    // let result = null as any;
    let rules = [] as RuleDbEntity[];
    if (data.rule && data.rule.length) {
      rules = await this.repoRule.find({id: In(data.rule)});
    }
    const policy = this.repo.create({...data, rule: rules});
    const result = await this.repo.save(policy).catch( e => {
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
