import { validateOrReject } from 'class-validator';
import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, BeforeInsert, BeforeUpdate, JoinTable, Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EntityStates } from '../enums/entity-states.enum';
import { Categoria } from './categoria';
import { Construccion } from './construccion';
import { Foto } from './foto';
import { Localizacion } from './localizacion';
import { Precio } from './precio';
import { PropiedadUsuario } from './propiedad_usuario';
import { Propietario } from './propietario';
import { TipoBeneficio } from './tipo-beneficio';
import { TipoBeneficioPropiedad } from './tipo-beneficio-propiedad';
import { TipoServicio } from './tipo-servicio';
import { TipoServicioPropiedad } from './tipo_servicio_propiedad';
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

    @Field(() => Number)
    @Column("float")
    extension!: Number;

    @Field()
    @Column({length:5000})
    descripcion!: string;

    @Field(() => [Precio])
    @OneToMany(() => Precio, precio => precio.propiedad)
    precios!: Precio[];

    @Field(() => [TipoServicioPropiedad])
    @OneToMany(() => TipoServicioPropiedad, tiposerviciopropiedad => tiposerviciopropiedad.propiedad)
    tipoServicioPropiedad!: TipoServicioPropiedad[];

    @Field(() => [TipoBeneficioPropiedad])
    @OneToMany(() => TipoBeneficioPropiedad, tipobeneficiopropiedad => tipobeneficiopropiedad.propiedad)
    tipoBeneficioPropiedad!: TipoServicioPropiedad[];

    @Field(() => [PropiedadUsuario])
    @OneToMany(() => PropiedadUsuario, propiedadUsuario => propiedadUsuario.propiedad)
    propiedadUsuario!: PropiedadUsuario[];

    @Field(() => Categoria)
    @ManyToOne(() => Categoria, categoria => categoria.propiedad)
    categoria!: Categoria[];

    @Field(() => [Construccion])
    @OneToMany(() => Construccion, construccion => construccion.propiedad)
    construcciones!: Construccion[];

    @Field(() => [Propietario])
    @OneToMany(() => Propietario, propietario => propietario.propiedad)
    propietarios!: Propietario[];

    @Field(() => Localizacion)
    @ManyToOne(() => Localizacion, localizacion => localizacion.propiedad)
    localizacion!: Localizacion[];

    @Field(() => Usuario)
    @ManyToOne(() => Usuario, usuario => usuario.propiedadesRegistradas)
    usuario!: Usuario[];

    @Field(() => [Foto])
    @OneToMany(() => Foto, foto => foto.propiedad)
    fotos!: Foto[];

    @Field(() => EntityStates)
    @Column("varchar")
    estado!: EntityStates;

    @Field(() => String)
    @CreateDateColumn({ type: 'timestamp' })
    creado!: string;

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