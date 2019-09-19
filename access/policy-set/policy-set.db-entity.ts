import {Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn} from 'typeorm';
import {PolicyDbEntity} from '../policy/policy.db-entity';


@Entity({ name: 'policy-set' })
export class PolicySetDbEntity {
  @PrimaryGeneratedColumn()
    // @ts-ignore
  id: number;

  @Column({ type: 'jsonb' })
    // @ts-ignore
  target: any;


  @Column({ type: 'text' })
    // @ts-ignore
  description: string;


  @ManyToMany(type => PolicyDbEntity, policy => policy.id)
  @JoinTable()
    // @ts-ignore
  policy: PolicyDbEntity[];


  @ManyToMany(type => PolicySetDbEntity, policyGroup => policyGroup.id)
  @JoinTable()
    // @ts-ignore
  policyGroup: PolicySetDbEntity[];


  @Column({ type: 'jsonb', nullable: true })
    // @ts-ignore
  policyGroup: any;


  @Column({ type: 'text' })
    // @ts-ignore
  combine: string;
}
