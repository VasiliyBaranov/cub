import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn, Index, Unique } from 'typeorm';
import {WorkItemDbEntity} from '../work-item/work-item.db-entity';
import {UserDbEntity} from '../user/user.db-entity';

@Entity({ name: 'task_access_read_cache' })
export class AccessReadCacheDbEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
    // @ts-ignore
  id: number;

  @ManyToOne(() => WorkItemDbEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'taskId' })
    // @ts-ignore
  task: WorkItemDbEntity;
  @Index()
  @Column({ type: 'text' })
    // @ts-ignore
  taskId: string;

  @ManyToOne(() => UserDbEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
    // @ts-ignore
  user: UserDbEntity;
  @Index()
  @Column({ type: 'text' })
    // @ts-ignore
  userId: string;
}
