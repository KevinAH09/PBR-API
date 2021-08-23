import { validateOrReject } from 'class-validator';
import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
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
export class Propiedad extends BaseEntity{
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id!:number;
   
    @Field()
    @Column()
    numero!:string;

    @Field()
    @Column()
    descripcion!:string;

    @Field(()=>[Precio])
    @ManyToMany(() => Precio, precio=> precio.propiedad)
    precios!:Precio[]

    @Field(()=>[TipoServicio])
    @ManyToMany(() => TipoServicio, servicio=> servicio.propiedades)
    servicios!:TipoServicio[]

    @Field(()=>[TipoBeneficio])
    @ManyToMany(() => TipoBeneficio, beneficio=> beneficio.propiedades)
    beneficios!:TipoBeneficio[]

    @Field(()=>[Categoria])
    @ManyToMany(() => Categoria, categoria=> categoria.propiedades)
    categorias!:Categoria[]

    @Field(()=>[Construccion])
    @ManyToMany(() => Construccion, construccion=> construccion.propiedades)
    construncciones!:Construccion[]

    @Field(()=>[Propietario])
    @ManyToMany(() => Propietario, propietario=> propietario.propiedades)
    propietarios!:Propietario[]

    @Field(()=>Localizacion)
    @OneToOne(()=> Localizacion, localizacion => localizacion.propiedad)
    localizacion!: Localizacion;
    
    @Field(()=>Usuario)
    @ManyToOne(()=> Usuario, usuario => usuario.propiedadesRegistradas)    
    usuario!: Usuario;

    @Field(() => [Foto] )
    @OneToMany(() => Foto, foto => foto.propiedad)
    fotos!: Foto[];

    @Field(() => EntityStates)
    @Column()
    state!: EntityStates

    @Field(() => String)
    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: string

    @Field(() => String)
    @CreateDateColumn({ type: 'timestamp' })
    updateAt!: string

    @BeforeInsert()
    async beforeInsert() {
        this.createdAt = new Date().valueOf().toString()
        this.updateAt = this.createdAt
        this.state = EntityStates.ACTIVE
        await validateOrReject(this)
    }

    @BeforeUpdate()
    async beforeUpdate() {
        this.updateAt = new Date().valueOf().toString()
        await validateOrReject(this)
    }
}