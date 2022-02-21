import { validateOrReject } from 'class-validator';
import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { EntityStates } from '../enums/entity-states.enum';
import { RolesTypes } from "../enums/role-types.enum";
import { BitacoraSistema } from "./bitacora-sistema";
import { Propiedad } from "./propiedad";
import { PropiedadUsuario } from "./propiedad_usuario";

@ObjectType()
@Entity()
export class Usuario extends BaseEntity {

    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id!: number;
    
    @Field(() => String)
    @Column("varchar", { nullable: true })
    nombre!: string;

    @Field(() => String)
    @Column("varchar", { nullable: true })
    telefono!: string;

    @Field(() => String)
    @Column("varchar", { nullable: true, unique: true })
    email!: string;

    @Column("varchar", { nullable: true })
    password!: string;

    @Field(() => String)
    @Column("varchar", { nullable: true })
    imagen!: string;

    @Field(() => Propiedad)
    @OneToMany(() => Propiedad, propiedad => propiedad.usuario)
    propiedadesRegistradas!: Propiedad[];

    @Field(() => BitacoraSistema)
    @OneToMany(() => BitacoraSistema, bitacoraSistema => bitacoraSistema.usuario)
    bitacoraSistema!: BitacoraSistema[];

    @Field(() => [PropiedadUsuario])
    @OneToMany(() => PropiedadUsuario, propiedadUsuario => propiedadUsuario.usuario)
    propiedadUsuario!: PropiedadUsuario[];

    @Field(type => RolesTypes)
    @Column("varchar", { nullable: true })
    role!: RolesTypes;

    @Field(() => EntityStates)
    @Column("varchar")
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
        await validateOrReject(this)
    }

    @BeforeUpdate()
    async beforeUpdate() {
        this.actualizado = new Date().valueOf().toString()
        await validateOrReject(this)
    }
    //Foto del usuario
}


