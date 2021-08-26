import { validateOrReject } from 'class-validator';
import { Field, Int, ObjectType } from "type-graphql";
import { BaseEntity, BeforeInsert, BeforeUpdate, JoinTable, Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EntityStates } from '../enums/entity-states.enum';
import { Propiedad } from './propiedad';
import { TipoConstruccion } from './tipo-construccion';



@ObjectType()
@Entity()
export class Construccion extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id!: number;

    @Field(() => Propiedad)
    @ManyToMany(() => Propiedad, propiedad => propiedad.construcciones)
    @JoinTable()
    propiedades!: Propiedad[];

    @Field(() => [TipoConstruccion])
    @ManyToOne(() => TipoConstruccion, tipoConstruccion => tipoConstruccion.construcciones)
    tipoConstruccion!: TipoConstruccion[];

    @Field(() => EntityStates)
    @Column()
    estado!: EntityStates;

    @Field(() => String)
    @CreateDateColumn({ type: 'timestamp' })
    creado!: string;

    @Field(() => String)
    @CreateDateColumn({ type: 'timestamp' })
    actualizado!: string;

    @Field(() => Int)
    @Column('float', { nullable: true })
    metroCuadrado!: number;

    @Field(() => Int)
    @Column('int', { nullable: true })
    descripcion!: number;

    @Field()
    @Column("text", { nullable: true })
    bano!: string;

    @Field()
    @Column("text", { nullable: true })
    sala!: string;

    @Field()
    @Column("text", { nullable: true })
    planta!: string;

    @Field()
    @Column("text", { nullable: true })
    cocina!: string;

    @Field()
    @Column("text", { nullable: true })
    dormitorio!: string;

    @Field()
    @Column("text", { nullable: true })
    material!: string;

    @Field()
    @Column("text", { nullable: true })
    garage!: string;

    @BeforeInsert()
    async beforeInsert() {
        this.creado = new Date().valueOf().toString()
        this.actualizado = this.creado
        this.estado = EntityStates.ACTIVE
        await validateOrReject(this)
    }

    @BeforeUpdate()
    async beforeUpdate() {
        this.actualizado = new Date().valueOf().toString()
        await validateOrReject(this)
    }

}

