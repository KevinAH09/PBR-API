import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, BeforeInsert, BeforeUpdate, ManyToMany, ManyToOne } from 'typeorm';
import { Field, Int, ObjectType } from "type-graphql";
import { validateOrReject } from 'class-validator';
import { EntityStates } from '../enums/entity-states.enum';
import { Usuario } from './usuario';

@ObjectType()
@Entity()
export class BitacoraSistema extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column()
    accion!: string;


    @Field(() => [Usuario])
    @ManyToOne(() => Usuario, usuario => usuario.bitacoraSistema)
    usuario!: Usuario[];

    @Field(() => String)
    @CreateDateColumn({ type: 'timestamp' })
    creado!: string;

    @BeforeInsert()
    async beforeInsert() {
        this.creado = new Date().valueOf().toString()
        await validateOrReject(this)
    }

}