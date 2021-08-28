import { validateOrReject } from "class-validator";
import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, BeforeInsert, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { EntityStates } from "../enums/entity-states.enum";
import { Propiedad } from "./propiedad";

@ObjectType()
@Entity()
export class Foto extends BaseEntity {

    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column()
    tag!: string;

    @Field()
    @Column()
    base64!: string;

    @Field(() => [Propiedad])
    @ManyToOne(() => Propiedad, propiedad => propiedad.fotos)
    propiedad!: Propiedad[];

    @Field(() => String)
    @CreateDateColumn({ type: 'timestamp' })
    creado!: string;

    @Field(() => EntityStates)
    @Column()
    estado!: EntityStates

    @BeforeInsert()
    async beforeInsert() {
        this.creado = new Date().valueOf().toString()
        this.estado = EntityStates.ACTIVE
        await validateOrReject(this)
    }

}

