import {Service} from 'typedi';
import {IConnectorPIP, IFlatData} from '../access/acceess.interface';
import {InjectRepository} from 'typeorm-typedi-extensions';
import {Repository} from 'typeorm';
import {UserDbEntity} from '../user/user.db-entity';
import {BaseAccessInformationData} from './base.access.information.data';
import {ColumnMetadata} from 'typeorm/metadata/ColumnMetadata';
import { _logTimeExecuteOperation } from '../_utils/log-time-execute-operation';

@Service()
export class CurrentUserApc  extends BaseAccessInformationData<UserDbEntity> implements IConnectorPIP {

  constructor(
    @InjectRepository(UserDbEntity) repo: Repository<UserDbEntity>,
  ) {
    super(repo, 'user', 'id');
  }


  public async batch(data: IFlatData[]): Promise<void> {
    const startCurrentUserExec = +new Date();
    data.forEach((item) => {
      item.attr.setResultValue([item.context.currentUser]);
    });
    _logTimeExecuteOperation('CurrentUserExec', startCurrentUserExec);
  }


  public getColumns(): ColumnMetadata[] {
    return this.repository.metadata.columns;
  }

}
