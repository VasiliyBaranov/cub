import {InjectRepository} from 'typeorm-typedi-extensions';
import { Repository} from 'typeorm';
import {WorkItemDbEntity} from '../work-item/work-item.db-entity';
import {Service} from 'typedi';
import {IConnectorPIP, IFlatData} from '../access/acceess.interface';
import {BaseAccessInformationData} from './base.access.information.data';
import {ColumnMetadata} from 'typeorm/metadata/ColumnMetadata';

@Service()
export class WorkItemApc extends BaseAccessInformationData<WorkItemDbEntity> implements IConnectorPIP {

  constructor(
    @InjectRepository(WorkItemDbEntity) repo: Repository<WorkItemDbEntity>,
  ) {
    super(repo, 'task', 'id');
  }

  public async batch(data: IFlatData[]): Promise<void> {
    await super.batch(data);
  }

  public getColumns(): ColumnMetadata[] {
    return this.repository.metadata.columns;
  }

}
