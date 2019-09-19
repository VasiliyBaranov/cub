import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';


@Entity({ name: 'rule' })
export class RuleDbEntity {
  @PrimaryGeneratedColumn()
    // @ts-ignore
  id: number;

  @Column({ type: 'text' })
    // @ts-ignore
  description: string;


  @Column({ type: 'jsonb' })
    // @ts-ignore
  target: any;


  @Column({ type: 'jsonb', nullable: true, default: {} })
    // @ts-ignore
  condition: any;


  @Column({ type: 'boolean' })
    // @ts-ignore
  effect: boolean;
}
