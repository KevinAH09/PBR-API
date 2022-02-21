import { validateOrReject } from "class-validator";
import { Field, ObjectType } from "type-graphql";
import { BaseEntity, BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Propiedad } from "./propiedad";


@ObjectType()
@Entity()
export class Localizacion extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id!: number;

    @Field(() => String)
    @Column("varchar", { nullable: true })
    pais!: string;

    @Field(() => String)
    @Column("varchar", { nullable: true })
    divPrimaria!: string;

    @Field(() => String)
    @Column("varchar", { nullable: true })
    divSecundaria!: string;

    @Field(() => String)
    @Column("varchar", { nullable: true })
    divTerciaria!: string;

    @Field(() => String)
    @Column("varchar", { nullable: true })
    divCuaternaria!: string;

    @Field(() => String)
    @Column("varchar", { nullable: true })
    direccion!: string;

    @Field(() => Number)
    @Column("float", { nullable: true })
    latitud!: Number;

    @Field(() => Number)
    @Column("float", { nullable: true })
    longitud!: Number;

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


