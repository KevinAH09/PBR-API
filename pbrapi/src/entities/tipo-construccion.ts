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
  @OneToMany(() => Construccion, (Construccion) => Construccion.tipoConstruccion)
  construcciones!: Construccion[];

  @Field(() => String)
  @CreateDateColumn({ type: 'timestamp' })
  creado!: string;

  @Field(() => String)
  @CreateDateColumn({ type: 'timestamp' })
  actualizado!: string;

  @BeforeInsert()
  async beforeInsert() {
    this.creado = new Date().valueOf().toString();
    this.actualizado = this.creado;
    await validateOrReject(this);
  }

  @BeforeUpdate()
  async beforeUpdate() {
    this.actualizado = new Date().valueOf().toString();
    await validateOrReject(this);
  }
}
