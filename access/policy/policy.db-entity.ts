import {Column, Entity, ManyToMany, PrimaryGeneratedColumn} from 'typeorm';
import {RuleDbEntity} from '../rule/rule.db-entity';
import {JoinTable} from 'typeorm/decorator/relations/JoinTable';


@Entity({ name: 'policy' })
export class PolicyDbEntity {
  @PrimaryGeneratedColumn()
    // @ts-ignore
  id: number;

  @Column({ type: 'jsonb' })
    // @ts-ignore
  target: any;


  @Column({ type: 'text' })
    // @ts-ignore
  description: string;


  @ManyToMany(type => RuleDbEntity, rule => rule.id)
  @JoinTable()
    // @ts-ignore
  rule: RuleDbEntity[];


  @Column({ type: 'text' })
    // @ts-ignore
  combine: string;
}
