import {CurrentUserApc} from './current-user.apc';
import {Container} from 'typedi';
import {IConnectorPIP, IStructureConnector} from '../access/acceess.interface';
// tslint:disable-next-line:max-line-length
import { WorkItemUserTreeApc } from './work-item-user-tree.apc';
import { WorkItemApc } from './work-item.apc';

export class AccessConnectorContainer {
  static readonly CONNECTORS: any[] = [
    WorkItemApc,
    WorkItemUserTreeApc,
    CurrentUserApc,
  ];


  static getConnectorKeys(): string[] {
    return AccessConnectorContainer.CONNECTORS.map(x => x.name);
  }


  static getStructure(entity: string): IStructureConnector[] {
    const connector = AccessConnectorContainer.CONNECTORS.find(x => x.name === entity);
    if (connector) {
      const conn: IConnectorPIP = Container.get(connector);
      const columnsDb =  conn.getColumns();
      const listStructure = [] as IStructureConnector[];
      columnsDb.forEach( c => {
        listStructure.push({type: c.type.toString(), field: c.databaseName});
      });
      return listStructure;
    }
    return [];
  }

}
