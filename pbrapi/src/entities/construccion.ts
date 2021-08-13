import { validateOrReject } from 'class-validator';
import { Field, Int, ObjectType } from "type-graphql";
import { BaseEntity, BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EntityStates } from '../enums/entity-states.enum';
import { Propiedad } from './propiedad';
import { TipoConstruccion } from './tipo-construccion';



@ObjectType()
@Entity()
export class Construccion extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id!: number;

    @Field(()=>Propiedad)
    @ManyToMany(() => Propiedad, propiedad=> propiedad.construncciones)
    propiedades!:Propiedad;

    @ManyToOne(()=> TipoConstruccion, tipoConstruccion => tipoConstruccion.construcciones)
    @Field(()=>TipoConstruccion)
    tipoConstruccion!: TipoConstruccion;

    @Field(() => EntityStates)
    @Column()
    state!: EntityStates

    @Field(() => String)
    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: string

    @Field(() => String)
    @CreateDateColumn({ type: 'timestamp' })
    updateAt!: string

    @Field(()=>Int)
    @Column('float', { nullable: true })
    metroCuadrado!: number;

    @Field(()=>Int)
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

