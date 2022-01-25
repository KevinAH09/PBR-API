import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, JoinTable, CreateDateColumn, BeforeInsert, BeforeUpdate, ManyToMany, OneToMany } from 'typeorm';
import { Field, Int, ObjectType } from "type-graphql";
import { validateOrReject } from 'class-validator';
import { EntityStates } from '../enums/entity-states.enum';
import { TipoBeneficioPropiedad } from './tipo-beneficio-propiedad';

@ObjectType()
@Entity()
export class TipoBeneficio extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column()
    nombre!: string;


    @Field(() => [TipoBeneficioPropiedad])
    @OneToMany(() => TipoBeneficioPropiedad, tipobeneficiopropiedad => tipobeneficiopropiedad.tipobeneficio)
    tipoBeneficioPropiedad!: TipoBeneficioPropiedad[];

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
}