import { validateOrReject } from "class-validator";
import { Field, ID, ObjectType } from "type-graphql";
import { Entity, BaseEntity, CreateDateColumn, BeforeInsert, BeforeUpdate, PrimaryGeneratedColumn, ManyToOne, Column } from "typeorm";
import { Propiedad } from "./propiedad";
import { Usuario } from "./usuario";


@ObjectType()
@Entity()
export class PropiedadUsuario extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => Usuario)
  @ManyToOne(() => Usuario, usuario => usuario.propiedadUsuario)
  usuario!: Usuario[];

  @Field(() => Propiedad)
  @ManyToOne(() => Propiedad, propiedad => propiedad.propiedadUsuario)
  propiedad!: Propiedad[];

  @Field(() => Boolean)
  @Column("boolean")
  favorita!: boolean;

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