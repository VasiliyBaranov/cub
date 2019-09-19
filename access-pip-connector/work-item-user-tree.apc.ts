import { InjectRepository } from 'typeorm-typedi-extensions';
import { Repository } from 'typeorm';
import { Service } from 'typedi';
import { WorkItemUserTreeCacheDbEntity } from '../work-item-user-tree-cache/work-item-user-tree-cache.db-entity';
import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata';
import { BaseAccessInformationData } from './base.access.information.data';
import { IConnectorPIP, IFlatData } from '../access/acceess.interface';

@Service()
export class WorkItemUserTreeApc extends BaseAccessInformationData<WorkItemUserTreeCacheDbEntity> implements IConnectorPIP {
  constructor(
    @InjectRepository(WorkItemUserTreeCacheDbEntity) repo: Repository<WorkItemUserTreeCacheDbEntity>,
  ) {
    super(repo, 'task', 'taskId');
  }


  /**
   * Данный механизм необходим для того что бы сформировать более маленький запрос в базу,
   * группировать в другом месте мы не можем (возможно сможем необходимо исследование)
   * т.к. нам необходимы именно два варианта:
   *      1) все доступные поля для запроса,
   *      2) все поля для того что бы выполнить setResultValue() для конкретного элемента
   */
  private getParamForSql(data: IFlatData[]): IFlatData[] {
    const newFlatDataForQuery: IFlatData[] = [];
    const isQueryParam: string[] = [];

    data.forEach(r => {
      const params = r.attr.getParam();
      let paramStr = '';
      if (params) {
        Object.keys(params).forEach(key => {
          paramStr += `${key}${params[key]}`;
        });
      }
      const isKey = r.context.el + paramStr;
      if (isQueryParam.indexOf(isKey) === -1) {
        isQueryParam.push(r.context.el + paramStr);
        newFlatDataForQuery.push(r);
      }
    });
    return newFlatDataForQuery;
  }


  public async batch(data: IFlatData[]): Promise<void> {
    const paramForQuery = this.getParamForSql(data);
    await super.batch(data, paramForQuery);
  }

  public getColumns(): ColumnMetadata[] {
    return this.repository.metadata.columns;
  }
}
