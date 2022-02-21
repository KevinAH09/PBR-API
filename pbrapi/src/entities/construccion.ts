import { validateOrReject } from 'class-validator';
import { Field, ObjectType } from "type-graphql";
import { BaseEntity, BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Propiedad } from './propiedad';
import { TipoConstruccion } from './tipo-construccion';



@ObjectType()
@Entity()
export class Construccion extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id!: number;

    @Field(() => Propiedad)
    @ManyToOne(() => Propiedad, propiedad => propiedad.construcciones)
    propiedad!: Propiedad[];

    @Field(() => TipoConstruccion)
    @ManyToOne(() => TipoConstruccion, tipoConstruccion => tipoConstruccion.construcciones)
    tipoConstruccion!: TipoConstruccion[];

    @Field(() => String)
    @CreateDateColumn({ type: 'timestamp' })
    creado!: string;

    @Field(() => String)
    @CreateDateColumn({ type: 'timestamp' })
    actualizado!: string;

    @Field(() => String)
    @Column("varchar", { nullable: true })
    metroCuadrado!: string;

    @Field(() => String)
    @Column('varchar', { nullable: true })
    descripcion!: string;

    @Field()
    @Column("varchar", { nullable: true })
    bano!: string;

    @Field()
    @Column("varchar", { nullable: true })
    sala!: string;

    @Field()
    @Column("varchar", { nullable: true })
    planta!: string;

    @Field()
    @Column("varchar", { nullable: true })
    cocina!: string;

    @Field()
    @Column("varchar", { nullable: true })
    dormitorio!: string;

    @Field()
    @Column("varchar", { nullable: true })
    material!: string;

    @Field()
    @Column("varchar", { nullable: true })
    garage!: string;

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

