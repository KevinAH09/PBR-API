import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, BeforeInsert, BeforeUpdate, ManyToOne } from 'typeorm';
import { Field, ObjectType } from "type-graphql";
import { validateOrReject } from 'class-validator';
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
    @ManyToOne(() => Categoria, categoria => categoria.subcategorias)
    categorias!: Categoria[];

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
        this.creado = new Date().valueOf().toString()
        await validateOrReject(this)
    }
}