import { Container, Service } from 'typedi';
import { BaseHandler } from '../../base-handler';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { FindConditions, In, Repository } from 'typeorm';
import { methodLogger } from '../../_utils/logger/method-logger';
import { RuleDbEntity } from './rule.db-entity';
import { RuleAddInputType } from './_dvo/rule-add.input-type';
import { RuleUpdateInputType } from './_dvo/rule-update.input-type';
import {transformAndValidate} from 'class-transformer-validator';
import {RuleConditionInputType} from './_dvo/rule-condition.input-type';
import {AccessReadCacheUpdateAll} from '../../access-read-cache/access.read-cache.update-all';

@Service()
export class RuleHandler extends BaseHandler {
  constructor(
    @InjectRepository(RuleDbEntity) private repo: Repository<RuleDbEntity>
  ) {
    super();
  }


  @methodLogger()
  async getOne(id?: number): Promise<RuleDbEntity | null> {
    if (id == null) {
      return null;
    }

    const res = await this.repo.findOne({ where: { id }, relations: [] })
      .catch(e => {
        throw new Error(e); // тут обязательно писать, тк отладка асинхронных операций в JS боль.
      });

    return res || null;
  }


  async getAll(): Promise<RuleDbEntity[]> {
    return await this.repo.find()
      .catch(e => {
        throw new Error(e); // тут обязательно писать, тк отладка асинхронных операций в JS боль.
      });
  }


  async find(id: number): Promise<RuleDbEntity[]> {
    return await this.repo.find({ id: id })
      .catch(e => {
        throw new Error(e); // тут обязательно писать, тк отладка асинхронных операций в JS боль.
      });
  }


  async update(data: RuleUpdateInputType | any): Promise<RuleUpdateInputType | null> {
    await this.repo.createQueryBuilder()
      .update()
      .set(data)
      .where({ id: data.id })
      .execute()
      .catch(e => {
        throw new Error(e); // тут обязательно писать, тк отладка асинхронных операций в JS боль.
      });

    const res = await this.repo.findOne(data.id)
      .catch(e => {
        throw new Error(e); // тут обязательно писать, тк отладка асинхронных операций в JS боль.
      });

    // todo переделать на слабое связывание!
    await AccessReadCacheUpdateAll.init();
    return res || null;
  }


  async save(data: RuleAddInputType): Promise<RuleDbEntity | null> {
    const res = await this._baseUpsert(this.repo, data).catch(e => {
      throw new Error(e);
    });
    await AccessReadCacheUpdateAll.init();
    return res;
  }


  async remove(data: number[]): Promise<number[]> {
    const result = await this._baseRemoveForever(this.repo, data);
    await AccessReadCacheUpdateAll.init();
    return result;
  }
}
