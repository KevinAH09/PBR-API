import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, BeforeInsert, BeforeUpdate, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { Field, Int, ObjectType } from "type-graphql";
import { validateOrReject } from 'class-validator';
import { Propiedad } from './propiedad';
import { Subcategoria } from './subcategoria';


@ObjectType()
@Entity()
export class Categoria extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column()
    nombre!: string;

    @Field(() => Propiedad)
    @OneToMany(() => Propiedad, propiedad => propiedad.categoria)
    propiedad!: Propiedad[];

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