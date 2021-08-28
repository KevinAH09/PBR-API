import { Authorized, Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, ManyToMany, OneToMany, CreateDateColumn, BeforeInsert, BeforeUpdate, PrimaryGeneratedColumn } from "typeorm";
import { validateOrReject } from 'class-validator';
import { EntityStates } from '../enums/entity-states.enum';
import { RolesTypes } from "../enums/role-types.enum";
import { BitacoraSistema } from "./bitacora-sistema";
import { Propiedad } from "./propiedad";

@ObjectType()
@Entity()
export class Usuario extends BaseEntity {

    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id!: number;

    @Authorized([RolesTypes.ADMIN, RolesTypes.AGENTE])
    @Field(() => String)
    @Column("text", { nullable: true })
    nombre!: string;

    @Authorized([RolesTypes.ADMIN])
    @Field(() => String)
    @Column("text", { nullable: true })
    telefono!: string;

    @Field(() => String)
    @Column("text", { nullable: true })
    email!: string;

    @Column("text", { nullable: true })
    password!: string;

    @Field(() => [Propiedad])
    @OneToMany(() => Propiedad, propiedad => propiedad.usuario)
    propiedadesRegistradas!: Propiedad[]

    @Field(() => [BitacoraSistema])
    @OneToMany(() => BitacoraSistema, bitacoraSistema => bitacoraSistema.usuario)
    bitacoraSistema!: BitacoraSistema[];

    @Authorized(RolesTypes.ADMIN)
    @Field(type => RolesTypes)
    @Column("text", { nullable: true })
    role!: RolesTypes;

    @Field(() => EntityStates)
    @Column()
    estado!: EntityStates;

    @Field(() => String)
    @CreateDateColumn({ type: 'timestamp' })
    creado!: string

    @Field(() => String)
    @CreateDateColumn({ type: 'timestamp' })
    actualizado!: string

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
    //Foto del usuario
}

