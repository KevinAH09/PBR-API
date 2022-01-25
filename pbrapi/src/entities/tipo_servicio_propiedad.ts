import { validateOrReject } from "class-validator";
import { Field, ID, ObjectType } from "type-graphql";
import { Entity, JoinColumn, PrimaryColumn, BaseEntity, CreateDateColumn, BeforeInsert, BeforeUpdate, ManyToMany, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Propiedad } from "./propiedad";
import { TipoServicio } from "./tipo-servicio";


@ObjectType()
@Entity()
export class TipoServicioPropiedad extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => TipoServicio)
  @ManyToOne(() => TipoServicio, tiposervicio => tiposervicio.tipoServicioPropiedad)
  tiposervicio!: TipoServicio[];

  @Field(() => Propiedad)
  @ManyToOne(() => Propiedad, propiedad => propiedad.tipoServicioPropiedad)
  propiedad!: Propiedad[];


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