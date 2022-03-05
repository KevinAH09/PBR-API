import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, BeforeInsert, BeforeUpdate, ManyToMany, ManyToOne } from 'typeorm';
import { Field, ObjectType } from "type-graphql";
import { validateOrReject } from 'class-validator';

@ObjectType()
@Entity()
export class Parametro extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id!: number;

    @Field(() => String)
    @Column("varchar", { nullable: false, unique: true })
    nombre!: string;

    @Field(() => String)
    @Column("varchar", { nullable: false })
    valor!: string;

    @Field(() => String)
    @CreateDateColumn({ type: 'timestamp' })
    creado!: string;

    @BeforeInsert()
    async beforeInsert() {
        this.creado = new Date().valueOf().toString()
        await validateOrReject(this)
    }

}