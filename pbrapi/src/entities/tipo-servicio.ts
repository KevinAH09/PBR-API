import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, JoinTable, CreateDateColumn, BeforeInsert, BeforeUpdate, ManyToMany } from 'typeorm';
import { Field, Int, ObjectType } from "type-graphql";
import { validateOrReject } from 'class-validator';
import { EntityStates } from '../enums/entity-states.enum';
import { Propiedad } from './propiedad';

@ObjectType()
@Entity()
export class TipoServicio extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column()
    nombre!: string;


    @Field(() => [Propiedad])
    @ManyToMany(() => Propiedad, propiedad => propiedad.servicios)
    propiedades!: Propiedad[]

    @Field(() => String)
    @CreateDateColumn({ type: 'timestamp' })
    creado!: string;

    @Field(() => String)
    @CreateDateColumn({ type: 'timestamp' })
    actualizado!: string;

    @BeforeInsert()
    async beforeInsert() {
        this.creado = new Date().valueOf().toString()
        this.actualizado = this.creado
        await validateOrReject(this)
    }

    @BeforeUpdate()
    async beforeUpdate() {
        this.actualizado = new Date().valueOf().toString()
        await validateOrReject(this)
    }
}