import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, BeforeInsert, BeforeUpdate, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { Field, Int, ObjectType } from "type-graphql";
import { validateOrReject } from 'class-validator';
import { EntityStates } from '../enums/entity-states.enum';
import { Propiedad } from './propiedad';
import { Subcategoria } from './subcategoria';
// import { TipoServicio } from './tipo-servicio';

@ObjectType()
@Entity()
export class Categoria extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column()
    nombre!: string;


    @Field(() => [Subcategoria])
    @OneToMany(() => Subcategoria, subcategoria => subcategoria.categorias)
    subcategorias!: Subcategoria[]

    @Field(() => [Propiedad])
    @ManyToMany(() => Propiedad, propiedad => propiedad.categorias)
    propiedades!: Propiedad[]

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