import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { WorkItemDbEntity } from '../work-item/work-item.db-entity';
import { UserDbEntity } from '../user/user.db-entity';
import { CustomFieldDbEntity } from '../work-item/custom-feild/custom-field.db-entity';

@Entity({ name: 'task_user_cache' })
export class WorkItemUserTreeCacheDbEntity {
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

  @ManyToOne(() => CustomFieldDbEntity)
  @JoinColumn({ name: 'attrKey' })
    // @ts-ignore
  attr: CustomFieldDbEntity;
  @Index()
  @Column({ type: 'text' })
    // @ts-ignore
  attrKey: string;


  @Index()
  @Column({ type: 'boolean' , nullable: true})
    // @ts-ignore
  asAncestors: boolean;


  @Index()
  @Column({ type: 'boolean' , nullable: true})
    // @ts-ignore
  asDescendants: boolean;
}
