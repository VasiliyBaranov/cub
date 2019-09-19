import { FilterQuery } from '../filter.query';
import { ConnectionManager } from 'typeorm';
import { Container } from 'typedi';
import { queryData } from './query.data';


describe('Filter Cases', () => {
  queryData.forEach(r => {
    test(`${r.id}:`, async () => {
      const filterQuery = new FilterQuery({userId: '', isFullAccess: false}, 'task', 'id');
      const connectionManager = Container.get(ConnectionManager);
      const connection = connectionManager.create({ type: 'postgres' });
      const qb = connection.createQueryBuilder().from('task', 'task');
      const result = filterQuery.render(qb, r.allAttrs, r.scheme, r.order);
      expect(result.sql).toEqual(r.expect);
    });
  });
});
