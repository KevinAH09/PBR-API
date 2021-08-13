import { validateOrReject } from "class-validator";
import { Field, ObjectType } from "type-graphql";
import { BaseEntity, BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
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
    state!: EntityStates

    @OneToOne(()=> Propiedad, propiedad => propiedad.localizacion)
    @Field(()=>Propiedad)
    propiedad!: Propiedad;

    @Field(() => String)
    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: string

    @Field(() => String)
    @CreateDateColumn({ type: 'timestamp' })
    updateAt!: string

    @BeforeUpdate()
    async beforeUpdate() {
        this.updateAt = new Date().valueOf().toString()
        await validateOrReject(this)
    }

    @BeforeInsert()
    async beforeInsert() {
        this.createdAt = new Date().valueOf().toString()
        await validateOrReject(this)
    }
    
}


