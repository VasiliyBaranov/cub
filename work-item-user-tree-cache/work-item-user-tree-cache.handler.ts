import { Container, Service } from 'typedi';
import { BaseHandler } from '../base-handler';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { In, Repository } from 'typeorm';
import { WorkItemUserTreeCacheDbEntity } from './work-item-user-tree-cache.db-entity';
import { WorkItemUserTreeCacheCreateInputType } from './_dvo/work-item-user-tree-cache.create.input-type';
import { WorkItemUserTreeCacheUpdateInputType } from './_dvo/work-item-user-tree-cache.update.input-type';
import { FilterHandler } from '../work-item/_query/filter/filter.handler';
import { ICommonContext } from '../context.interface';
import { UserHandler } from '../user/user.handler';
import {FilterInputType} from '../work-item/_query/filter/input-dvo/filter.input-type';


// todo избавится от BaseHandler
@Service()
export class WorkItemUserTreeCacheHandler extends BaseHandler {
  private readonly _userHandler: UserHandler = Container.get(UserHandler);


  constructor(
    @InjectRepository(WorkItemUserTreeCacheDbEntity) private repo: Repository<WorkItemUserTreeCacheDbEntity>,
  ) {
    super();
  }


  async findFilter(ctx: ICommonContext, params: FilterInputType): Promise<WorkItemUserTreeCacheDbEntity[]> {
    const filter = await new FilterHandler(ctx, this.repo, 'task_user', '_scalarAttrs');
    return await filter.getData(params);
  }


  async findTaskIds(taskIds: string[]): Promise<WorkItemUserTreeCacheDbEntity[]> {
    if (!taskIds.length) {
      return [];
    }
    return await this.repo.find({ taskId: In(taskIds) })
      .catch(err => {
        throw new Error(err);
      });
  }


  async update(data: WorkItemUserTreeCacheUpdateInputType): Promise<WorkItemUserTreeCacheUpdateInputType | null> {
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

    return res || null;
  }


  async save(data: WorkItemUserTreeCacheCreateInputType): Promise<WorkItemUserTreeCacheDbEntity | null> {
    const res = await this._baseUpsert(this.repo, data);
    return res;
  }


  async remove(data: number[]): Promise<number[]> {
    return await this._baseRemoveForever(this.repo, data);
  }


  /**
   * Процедура обновления task_user_cache.
   * На вход - список userIds, для которых необходимо обновить кеш.
   */
  async refreshCacheByUser(userIds?: string[]): Promise<void> {
    // todo в алгоритме не исключаются базорвые задачи от которых вычисляется наследование. Возможно нужно переделать.
    // language=PostgreSQL
    const sql = `
       with _del AS (
        -- 0. удаляем все старые записи
        -- SELECT 1
        delete from public.task_user_cache where "userId" = any ($1)
       ),
           _tou as (
             -- 1. получить taskId из task_user
             select "taskId", "attrKey", "userId"
             from task_user
             where "userId" = any ($1)
           ),
           tasks_for_cache as (
             -- 2. на основе taskId получить всех предков
             select DISTINCT on ( "taskId", "userId", "attrKey") *
             from (
                    select unnest(string_to_array(_t."mathPath", '.')) as "taskId", _tou."attrKey", _tou."userId"
                    from _tou
                           left join task as _t
                                     on (_tou."taskId" = _t."id")
                  ) as _t1
             -- 3. исключаем все задачи с которыми пользователь связан напрямую
             -- select * from tasks_for_cache
             -- where _t1."taskId" not in (select _tou."taskId" from _tou)
           ),
           add_ancestor as (
             -- 4. наполняем кэш новыми данными
             insert
               into task_user_cache ("taskId", "userId", "attrKey", "asAncestors", "asDescendants")
                 select "taskId", "userId", "attrKey", true as "asAncestors", false as "asDescendants"
                 from tasks_for_cache
           ),
           tasks_for_cache_dec as (
             -- 5. на основе taskId получить всех потомков
             select DISTINCT on ( "taskId", "userId", "attrKey") *
             from (
                    select _t."id" as "taskId", _tou."attrKey", _tou."userId"
                    from task as _t,
                         _tou
                    where _t."mathPath" LIKE ('%' || _tou."taskId" || '%')
                  ) as _t2
           )
           -- 4. наполняем кэш новыми данными для потомков
      insert
      into task_user_cache ("taskId", "userId", "attrKey", "asAncestors", "asDescendants")
      select "taskId", "userId", "attrKey", false as "asAncestors", true as "asDescendants"
      from tasks_for_cache_dec
    `;

    // todo проверить на корректность работы для userIds
    const ids = userIds ? userIds : (await this._userHandler.find()).map(x => x.id);
    // await this.repo.delete({userId: In(ids)})
    //   .catch((err: any) => {
    //     throw new Error(err);
    //   });
    await this.repo.query(sql, [ids])
      .catch((err: any) => {
        throw new Error(err);
      });
    // for (const id of ids) {
    //
    // }

  }
}
