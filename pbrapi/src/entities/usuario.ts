import { Authorized, Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
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

    @Field(()=>[Propiedad])
    @ManyToMany(() => Propiedad, propiedad=> propiedad.usuario)
    propiedadesRegistradas!:Propiedad[]

    @Field(() => [BitacoraSistema] )
    @OneToMany(() => BitacoraSistema, bitacoraSistema => bitacoraSistema.usuario)
    bitacoraSistema!: BitacoraSistema[];

    @Authorized(RolesTypes.ADMIN)
    @Field(type => RolesTypes)
    @Column("text", { nullable: true })
    role!: RolesTypes;
}


