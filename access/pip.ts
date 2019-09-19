import {
  IConnectorPIP,
  IFlatData,
} from './acceess.interface';

import {Container, Service} from 'typedi';
import { AccessConnectorContainer } from '../access-pip-connector/access.connector.container';


@Service()
export class Pip {

  /**
   * Получения данных из БД на основе группированного котекста
   * @param groupByFlatData
   */
  public async prepareBatch(groupByFlatData: { [key: string]: IFlatData[] }): Promise<void> {
    const promises = [];
    const arrKeyGroup = Object.keys(groupByFlatData);
    for (const item of arrKeyGroup) {
      const isConnector = this.getConnector(item);
      if (isConnector) {
        promises.push(isConnector.batch(groupByFlatData[item]));
      }
    }

    await Promise.all(promises).catch(e => {
      throw new Error(e);
    });
  }


  private getConnector(entity: string): IConnectorPIP | undefined {
    let connector: IConnectorPIP | undefined;
    AccessConnectorContainer.CONNECTORS.forEach(r => {
      if (r.name === entity) {
        connector = Container.get(r);
      }
    });
    return connector;

  }

}
