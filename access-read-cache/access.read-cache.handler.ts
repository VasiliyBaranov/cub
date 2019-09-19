import {InjectRepository} from 'typeorm-typedi-extensions';
import {In, Repository, SelectQueryBuilder} from 'typeorm';
import {Container, Service} from 'typedi';
import {AccessReadCacheDbEntity} from './access.read-cache.db-entity';
import {WorkItemDbEntity} from '../work-item/work-item.db-entity';
import { _logTimeExecuteOperation } from '../_utils/log-time-execute-operation';
import { AccessActionTypeEnum } from '../access/enums/access.action-type.enum';
import { WorkItemUserTreeCacheDbEntity } from '../work-item-user-tree-cache/work-item-user-tree-cache.db-entity';
import { AccessContext } from '../access/access.context';
import { Pep } from '../access/pep';

// todo подумать как уменьшить связность с деталями реализации access
@Service()
export class AccessReadCacheHandler {
  private readonly TARGET_ENTITY: string = 'Task';
  private readonly action: AccessActionTypeEnum = AccessActionTypeEnum.Read;

  constructor(
    @InjectRepository(WorkItemDbEntity) private repoTask: Repository<WorkItemDbEntity>,
    @InjectRepository(WorkItemUserTreeCacheDbEntity) private repoTaskUser: Repository<WorkItemUserTreeCacheDbEntity>,
    @InjectRepository(AccessReadCacheDbEntity) private repoTaskAccess: Repository<AccessReadCacheDbEntity>
  ) {
  }


  /**
   * Создание дополнительного INNER JOIN для Фильтра задач
   *
   * Когда мы осуществляем поиск или фильтрацию задач мы будем использовать текущий метод для того что бы получить только те
   * задачи которые нам доступны для чтения, все остальные права доступа относящиеся к атрибутам будут высчитываться уже в соответствующих классах.
   *
   *
   * @param qb экземляр QueryBuilder конкретного Entity
   * @param alias алиас для таблицы
   * @param primaryKey конкретного Entity
   * @param userId клиент или авторизованный пользователь
   */
  public static generateJoin(qb: SelectQueryBuilder<any>, alias: string, primaryKey: string, userId: string
  ): SelectQueryBuilder<any> {
    const entity = AccessReadCacheDbEntity;
    const joinField = `${entity.name.toLowerCase()}."taskId"`;
    const params = {} as any;
    const paramName = `${entity.name.toLowerCase()}userId`;
    params[paramName] = userId;

    qb.innerJoin(subQuery => {
      return subQuery
        .select(['DISTINCT("taskId") as "taskId"'])
        .from(entity, entity.name.toLowerCase())
        .where(`${entity.name.toLowerCase()}."userId" = :${entity.name.toLowerCase()}userId`, params);
    }, entity.name.toLowerCase(), `${joinField} = ${alias}.${primaryKey}`);
    return qb;
  }


  public async refreshAccessForAll(): Promise<void> {
    const getTaskIdsOfUserIds = await this.repoTaskUser.find().catch(e => {
      throw new Error(e);
    });
    if (getTaskIdsOfUserIds.length) {
      await this.refreshUserTask(getTaskIdsOfUserIds);
    }
  }


  public async refreshAccessForId(ids: string[]): Promise<void> {
    if (ids.length) {
      const getTaskIdsOfUserIds = await this.getTaskIdsOfUserIds(ids);
      await this.refreshUserTask(getTaskIdsOfUserIds);
    }
  }

  public async refreshAccessForIdOne(id: string): Promise<void> {
    if (id) {
      const getTaskIdsOfUserIds = await this.getTaskIdsOfUserIdsOne(id);
      await this.refreshUserTask(getTaskIdsOfUserIds);
    }
  }


  /**
   * Создание доступа на чтение задач
   *
   * Когда мы получили задачи с пользователями из метода getTaskIdsOfUserIds(), первое мы по ним формируем контекст для ABAC.
   * После выполнения контекста из ABAC, для AccessTaskReadCacheEntity будут добавлены только те задачи,
   * которые доступны для чтения.
   *
   * @param taskIdsOfUserIds
   */
  // private async refreshUserTask(taskIdsOfUserIds: TaskUserCacheEntity[]): Promise<void> {
  private async refreshUserTask(taskIdsOfUserIds: Array<{taskId: string, userId: string}>): Promise<void> {
    const startTimeExecuteABAC = +new Date();
    const dataContext: AccessContext[] = [];
    taskIdsOfUserIds.forEach(item => {
      const target = {accessAttribute: [this.TARGET_ENTITY], action: 'Read', actionDetail: {}};
      dataContext.push(
        new AccessContext(item.taskId, target, {userId: item.userId, isFullTaskAccess: false})
      );
    });
    const pep = Container.get(Pep);
    const resultPEP = await pep.enforce(dataContext);
    const listTaskIdOfUserId = [] as Array<{ taskId: string, userId: string }>;
    resultPEP.forEach(r => {
      if (r.access && r.userId) {
        listTaskIdOfUserId.push({taskId: r.el, userId: r.userId});
      }
    });
    // _logTimeExecuteOperation('ExecuteABAC', startTimeExecuteABAC);

    const startTimeAccessReadInsert = +new Date();
    if (listTaskIdOfUserId.length) {
      await this.repoTaskAccess.insert(listTaskIdOfUserId);
    }
    // _logTimeExecuteOperation('AccessReadInsert', startTimeAccessReadInsert);

  }


  /**
   * Получаем список задач с привязанными пользователями
   *
   * Для того что бы сфоримровать основной кэш доступа на чтение задачи, сначала мы получим список нужных задач.
   * Дальше мы найдём всех пользователей которые относятся к текущему списку.
   *
   * @param taskId используется для поиска списка задач которые к нему относятся вверх и вниз по иерархии
   */
  private async getTaskIdsOfUserIds(taskIds: string[]): Promise<Array<{taskId: string, userId: string}>> {
    const startTimeTaskIdsForLike = +new Date();
    const taskIdsForLike = taskIds.map(id => `%${id}%`);
    // todo возможно нужно перенести в task Handler
    let result = await this.repoTask.query(`
      SELECT "id"
      FROM task
      WHERE task."mathPath" LIKE ANY($1)
      UNION
      SELECT unnest(string_to_array("mathPath", '.'))
      FROM task
      WHERE task."id" = ANY($2)
    `, [taskIdsForLike, taskIds]).catch(e => {
      throw new Error(e);
    });
    result = result.map((r: any) => r.id);
    _logTimeExecuteOperation('taskIdsForLike', startTimeTaskIdsForLike);

    const startTimeGrouped = +new Date();
    await this.clearOldAccessTask(result);

    const qb = await this.repoTaskUser.createQueryBuilder()
      .select(['"taskId"', '"userId"'])
      .where('"taskId" IN (:...taskId)', {taskId: result})
      .groupBy('"taskId"')
      .addGroupBy('"userId"')
      .addGroupBy('"attrKey"');
    _logTimeExecuteOperation('Grouped', startTimeGrouped);
    return qb.getRawMany().catch(e => {
      throw new Error(e);
    });

    return await this.repoTaskUser.find({taskId: In(result)}).catch(e => {
      throw new Error(e);
    });
  }
  private async getTaskIdsOfUserIdsOne(taskId: string): Promise<Array<{taskId: string, userId: string}>> {
    // TaskUserCacheEntity[]
    // todo возможно нужно перенести в task Handler
    let result = await this.repoTask.query(`
      SELECT "id"
      FROM task
      WHERE task."mathPath" LIKE ('%' || $1 || '%')
      UNION
      SELECT unnest(string_to_array("mathPath", '.'))
      FROM task
      WHERE task."id" = $1
    `, [taskId]).catch(e => {
      throw new Error(e);
    });
    result = result.map((r: any) => r.id);
    await this.clearOldAccessTask(result);
    return await this.repoTaskUser.find({taskId: In(result)}).catch(e => {
      throw new Error(e);
    });
  }


  private async clearOldAccessTask(ids: string[]): Promise<void> {
    await this.repoTaskAccess.delete({taskId: In(ids)}).catch(e => {
      throw new Error(e);
    });
  }

}
