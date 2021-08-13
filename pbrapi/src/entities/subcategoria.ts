import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, BeforeInsert, BeforeUpdate, OneToMany } from 'typeorm';
import { Field, Int, ObjectType } from "type-graphql";
import { validateOrReject } from 'class-validator';
import { EntityStates } from '../enums/entity-states.enum';
import { Categoria } from './categoria';


@ObjectType()
@Entity()
export class Subcategoria extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column()
    nombre!: string;


    @Field(() => [Categoria])
    @OneToMany(() => Categoria, categoria => categoria.subcategorias)
    categorias!: Categoria[]

    @Field(() => EntityStates)
    @Column()
    state!: EntityStates

    @Field(() => String)
    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: string

    @Field(() => String)
    @CreateDateColumn({ type: 'timestamp' })
    updateAt!: string

    @BeforeInsert()
    async beforeInsert() {
        this.createdAt = new Date().valueOf().toString()
        this.updateAt = this.createdAt
        this.state = EntityStates.ACTIVE
        await validateOrReject(this)
    }

    @BeforeUpdate()
    async beforeUpdate() {
        this.updateAt = new Date().valueOf().toString()
        await validateOrReject(this)
    }
}