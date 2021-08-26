import { validateOrReject } from "class-validator";
import { Field, ObjectType } from "type-graphql";
import { BaseEntity, BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { EntityStates } from "../enums/entity-states.enum";
import { Propiedad } from "./propiedad";


@ObjectType()
@Entity()
export class Localizacion extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id!: number;

    @Field(() => String)
    @Column("text", { nullable: true })
    pais!: string;

    @Field(() => String)
    @Column("text", { nullable: true })
    divPrimaria!: string;

    @Field(() => String)
    @Column("text", { nullable: true })
    divSecundaria!: string;

    @Field(() => String)
    @Column("text", { nullable: true })
    divTerciaria!: string;

    @Field(() => String)
    @Column("text", { nullable: true })
    divCuaternaria!: string;

    @Field(() => String)
    @Column("text", { nullable: true })
    direccion!: string;

    @Field(() => String)
    @Column("text", { nullable: true })
    geolocalizacion!: string;

    @Field(() => EntityStates)
    @Column()
    estado!: EntityStates

    @Field(() => Propiedad)
    @OneToMany(() => Propiedad, propiedad => propiedad.localizacion)
    propiedad!: Propiedad[];

    @Field(() => String)
    @CreateDateColumn({ type: 'timestamp' })
    creado!: string

    @Field(() => String)
    @CreateDateColumn({ type: 'timestamp' })
    actualizado!: string

    @BeforeUpdate()
    async beforeUpdate() {
        this.actualizado = new Date().valueOf().toString()
        await validateOrReject(this)
    }

    @BeforeInsert()
    async beforeInsert() {
        this.creado = new Date().valueOf().toString()
        await validateOrReject(this)
    }

}


