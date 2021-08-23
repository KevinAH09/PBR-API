import { validateOrReject } from "class-validator";
import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, BeforeInsert, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { EntityStates } from "../enums/entity-states.enum";
import { Propiedad } from "./propiedad";



@ObjectType()
@Entity()
export class Precio extends BaseEntity{
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id!:number;
   
    @Field()
    @Column()
    precio!:string;

    @Field(()=>Propiedad)
    @ManyToOne(()=> Propiedad, propiedad => propiedad.precios)    
    propiedad!: Propiedad;

    @Field(() => EntityStates)
    @Column()
    estado!: EntityStates

    @Field(() => String)
    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: string

    @BeforeInsert()
    async beforeInsert() {
        this.createdAt = new Date().valueOf().toString()
        this.estado = EntityStates.ACTIVE
        await validateOrReject(this)
    }


}
