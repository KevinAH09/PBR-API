import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, BeforeInsert, BeforeUpdate, OneToMany } from 'typeorm';
import { Field, ObjectType } from "type-graphql";
import { validateOrReject } from 'class-validator';
import { TipoServicioPropiedad } from './tipo_servicio_propiedad';

@ObjectType()
@Entity()
export class TipoServicio extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column("varchar", { nullable: true, unique: true })
    nombre!: string;

    @Field(() => [TipoServicioPropiedad])
    @OneToMany(() => TipoServicioPropiedad, tiposerviciopropiedad => tiposerviciopropiedad.tiposervicio)
    tipoServicioPropiedad!: TipoServicioPropiedad[];

    @Field(() => String)
    @CreateDateColumn({ type: 'timestamp' })
    creado!: string;

    @Field(() => String)
    @CreateDateColumn({ type: 'timestamp' })
    actualizado!: string;

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