import { validateOrReject } from "class-validator";
import { Field, ID, ObjectType } from "type-graphql";
import { Entity, JoinColumn, PrimaryColumn, BaseEntity, CreateDateColumn, BeforeInsert, BeforeUpdate, ManyToMany, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Propiedad } from "./propiedad";
import { TipoBeneficio } from "./tipo-beneficio";


@ObjectType()
@Entity()
export class TipoBeneficioPropiedad extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => Propiedad)
  @ManyToOne(() => Propiedad, propiedad => propiedad.tipoBeneficioPropiedad)
  propiedad!: Propiedad[];

  @Field(() => TipoBeneficio)
  @ManyToOne(() => TipoBeneficio, tipobeneficio => tipobeneficio.tipoBeneficioPropiedad)
  tipobeneficio!: TipoBeneficio[];
  

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