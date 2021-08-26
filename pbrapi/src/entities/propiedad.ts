import { validateOrReject } from 'class-validator';
import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, BeforeInsert, BeforeUpdate, JoinTable, Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EntityStates } from '../enums/entity-states.enum';
import { Categoria } from './categoria';
import { Construccion } from './construccion';
import { Foto } from './foto';
import { Localizacion } from './localizacion';
import { Precio } from './precio';
import { Propietario } from './propietario';
import { TipoBeneficio } from './tipo-beneficio';
import { TipoServicio } from './tipo-servicio';
import { Usuario } from './usuario';

@ObjectType()
@Entity()
export class Propiedad extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column()
    numero!: string;

    @Field()
    @Column()
    descripcion!: string;

    @Field(() => [Precio])
    @ManyToMany(() => Precio, precio => precio.propiedad)
    precios!: Precio[]

    @Field(() => [TipoServicio])
    @ManyToMany(() => TipoServicio, servicio => servicio.propiedades)
    servicios!: TipoServicio[]

    @Field(() => [TipoBeneficio])
    @ManyToMany(() => TipoBeneficio, beneficio => beneficio.propiedades)
    beneficios!: TipoBeneficio[]

    @Field(() => [Categoria])
    @ManyToMany(() => Categoria, categoria => categoria.propiedades)
    categorias!: Categoria[]

    @Field(() => [Construccion])
    @ManyToMany(() => Construccion, construccion => construccion.propiedades)
    construcciones!: Construccion[]

    @Field(() => [Propietario])
    @ManyToMany(() => Propietario, propietario => propietario.propiedades)
    @JoinTable()
    propietarios!: Propietario[]

    @Field(() => [Localizacion])
    @ManyToOne(() => Localizacion, localizacion => localizacion.propiedad)
    localizacion!: Localizacion[];

    @Field(() => [Usuario])
    @ManyToOne(() => Usuario, usuario => usuario.propiedadesRegistradas)
    usuario!: Usuario[];

    @Field(() => [Foto])
    @OneToMany(() => Foto, foto => foto.propiedad)
    fotos!: Foto[];

    @Field(() => EntityStates)
    @Column()
    estado!: EntityStates

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
        this.estado = EntityStates.ACTIVE
        await validateOrReject(this)
    }

    @BeforeUpdate()
    async beforeUpdate() {
        this.actualizado = new Date().valueOf().toString()
        await validateOrReject(this)
    }
    //Propiedad estado vendida, o cualquier otro estado
}