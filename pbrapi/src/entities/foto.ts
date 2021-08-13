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
    tag!:string;
    
    @Field()
    @Column()
    base64!:string;

    @Field(()=>Propiedad)
    @ManyToOne(()=> Propiedad, propiedad => propiedad.fotos)
    propiedad!: Propiedad;

    @Field(() => String)
    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: string

    @Field(() => EntityStates)
    @Column()
    state!: EntityStates
    
    @BeforeInsert()
    async beforeInsert() {
        this.createdAt = new Date().valueOf().toString()
        this.state = EntityStates.ACTIVE
        await validateOrReject(this)
    }

}

 
