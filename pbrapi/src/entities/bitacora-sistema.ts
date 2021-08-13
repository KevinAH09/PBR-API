import {Entity, Column, PrimaryGeneratedColumn,BaseEntity, CreateDateColumn, BeforeInsert, BeforeUpdate, ManyToMany, ManyToOne} from 'typeorm';
import { Field, Int, ObjectType } from "type-graphql";
import { validateOrReject } from 'class-validator';
import { EntityStates } from '../enums/entity-states.enum';
import { Usuario } from './usuario';

@ObjectType()
@Entity()
export class BitacoraSistema extends BaseEntity{
    @Field()
    @PrimaryGeneratedColumn()
    id!:number;
   
    @Field()
    @Column()
    accion!:string;


    @Field(()=>Usuario)
    @ManyToOne(() => Usuario, usuario=> usuario.bitacoraSistema)
    usuario!:Usuario

    @Field(() => EntityStates)
    @Column()
    state!: EntityStates

    @Field(() => String)
    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: string

    @BeforeInsert()
    async beforeInsert() {
        this.createdAt = new Date().valueOf().toString()
        this.state = EntityStates.ACTIVE
        await validateOrReject(this)
    }

}