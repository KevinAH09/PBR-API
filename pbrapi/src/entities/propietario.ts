import { validateOrReject } from "class-validator";
import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { EntityStates } from "../enums/entity-states.enum";
import { Propiedad } from "./propiedad";

@ObjectType()
@Entity()
export class Propietario extends BaseEntity {

    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column()
    nombre!: string;

    @Field()
    @Column()
    telefono!: string;

    @Field()
    @Column()
    email!: string;

  
    @Field(()=>[Propiedad])
    @ManyToMany(() => Propiedad, propiedad=> propiedad.propietarios)
    propiedades!:Propiedad[];

    @Field(() => String)
    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: string

    @Field(() => String)
    @CreateDateColumn({ type: 'timestamp' })
    updateAt!: string


    @Field(() => EntityStates)
    @Column()
    state!: EntityStates

    @BeforeInsert()
    async beforeInsert() {
        this.createdAt = new Date().valueOf().toString()
        this.state = EntityStates.ACTIVE
        await validateOrReject(this)
    }




    @BeforeUpdate()
    async beforeUpdate() {
        this.updateAt = new Date().valueOf().toString()
        await validateOrReject(this)
    }
}