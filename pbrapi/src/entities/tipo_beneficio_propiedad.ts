import { validateOrReject } from "class-validator";
import { Field, ObjectType } from "type-graphql";
import { Entity, JoinColumn, PrimaryColumn, BaseEntity, CreateDateColumn, BeforeInsert, BeforeUpdate, ManyToMany } from "typeorm";
import { Propiedad } from "./propiedad";
import { TipoBeneficio } from "./tipo-beneficio";


@ObjectType()
@Entity()
export class Tipo_Beneficio_Propiedad extends BaseEntity {
  @PrimaryColumn("int")
  propiedadId!: number;

  @PrimaryColumn("int")
  tipoBeneficioId!: number;

  @ManyToMany(() => TipoBeneficio)
  @JoinColumn()
  tipoBeneficio!: TipoBeneficio;

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