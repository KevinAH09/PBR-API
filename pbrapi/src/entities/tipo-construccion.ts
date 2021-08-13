import { validateOrReject } from 'class-validator';
import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EntityStates } from '../enums/entity-states.enum';
import { Construccion } from './construccion';

@ObjectType()
@Entity()
export class TipoConstruccion extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  nombre!: string;

  @Field(() => [Construccion])
  @OneToMany(() => Construccion,(Construccion) => Construccion.tipoConstruccion)
  construcciones!: Construccion[];

  @Field(() => EntityStates)
  @Column()
  state!: EntityStates;

  @Field(() => String)
  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: string;

  @Field(() => String)
  @CreateDateColumn({ type: 'timestamp' })
  updateAt!: string;

  @BeforeInsert()
  async beforeInsert() {
    this.createdAt = new Date().valueOf().toString();
    this.updateAt = this.createdAt;
    this.state = EntityStates.ACTIVE;
    await validateOrReject(this);
  }

  @BeforeUpdate()
  async beforeUpdate() {
    this.updateAt = new Date().valueOf().toString();
    await validateOrReject(this);
  }
}
