import { validateOrReject } from "class-validator";
import { Field, ObjectType } from "type-graphql";
import { Entity, JoinColumn, PrimaryColumn, BaseEntity, CreateDateColumn, BeforeInsert, BeforeUpdate, ManyToMany } from "typeorm";
import { Propiedad } from "./propiedad";
import { TipoServicio } from "./tipo-servicio";


@ObjectType()
@Entity()
export class TipoServicioPropiedad extends BaseEntity {
  @PrimaryColumn("int")
  propiedadId!: number;

  @PrimaryColumn("int")
  tipoServicioId!: number;

  @ManyToMany(() => TipoServicio)
  @JoinColumn()
  tipoServicio!: TipoServicio;

  @ManyToMany(() => Propiedad)
  @JoinColumn()
  propiedad!: Propiedad;

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