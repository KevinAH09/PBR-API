import { type } from "os";
import { Arg, Authorized, Field, ID, InputType, Int, Mutation, Query, Resolver } from "type-graphql";
import { getConnection } from "typeorm";
import { Categoria } from "../entities/categoria";
import { Localizacion } from "../entities/localizacion";
import { Precio } from "../entities/precio";
import { Propiedad } from "../entities/propiedad";
import { Usuario } from "../entities/usuario";
import { RolesTypes } from "../enums/role-types.enum";

@InputType()
class PropiedadInput {
    @Field({ nullable: true })
    numero!: string;

    @Field({ nullable: true })
    descripcion!: string;

    @Field({ nullable: true })
    extension!: string;

    @Field(type => Int,{ nullable: true })
    usuario!: Usuario[];

    @Field(type => Int,{ nullable: true })
    localizacion!: Localizacion[];

    @Field(type => Int, { nullable: true })
    categoria!: Categoria[];

    // @Field(type => Int, { nullable: true })
    // precios!: Precio[];
}

@Resolver()
export class PropiedadResolver {
    @Authorized(RolesTypes.ADMIN)
    @Mutation(() => Propiedad)
    async createPropiedad(
        @Arg("data", () => PropiedadInput) data: PropiedadInput
    ) {
        const newData = Propiedad.create(data);
        return await newData.save();
    }

    @Authorized(RolesTypes.ADMIN)
    @Mutation(() => Propiedad)
    async updatePropiedad(
        @Arg("id", () => Int) id: number,
        @Arg("data", () => PropiedadInput) data: PropiedadInput
    ) {
        await Propiedad.update({ id }, data);
        const dataUpdated = await Propiedad.findOne(id)
        return dataUpdated;
    }


    @Query(() => [Propiedad])
    Propiedad() {
        return Propiedad.find({
            relations: ["usuario", "localizacion", "categoria", "fotos", "precios"]
        })
    }
    @Query(() => [Propiedad])
    async PropiedadByLocalizacionAndCategoriaAndPrecioAprox(
        @Arg("categoriaNombre", () => String) categoriaNombre: String,
        @Arg("pais", () => String) pais: String,
        @Arg("divprimaria", () => String) divprimaria: String,
        @Arg("precio", () => String) precio: String
    ) {
        let propiedades = await getConnection()
        .getRepository(Propiedad)
        .createQueryBuilder("propiedad")
        .innerJoinAndSelect("propiedad.categoria", "categoria")
        .innerJoinAndSelect("propiedad.localizacion", "localizacion")
        .innerJoinAndSelect("propiedad.fotos", "fotos")
        .innerJoinAndSelect("propiedad.usuario", "usuario")
        .innerJoinAndSelect("propiedad.precios", "precios");
        if(categoriaNombre){
            propiedades=propiedades.andWhere("categoria.nombre =:categorianombre")
        }
        if(pais){
            propiedades=propiedades.andWhere("localizacion.pais =:pais")
        }
        if(divprimaria){
            propiedades=propiedades.andWhere("localizacion.pais =:pais")
        }
        // if(precio){
        //     propiedades=propiedades.andWhere("localizacion.pais =:pais")
        // }
        
        // .andWhere("(photo.name = :photoName OR photo.name = :bearName)")
        // .orderBy("photo.id", "DESC")
        // .skip(5)
        // .take(10)
        propiedades = propiedades.setParameters({ categorianombre:categoriaNombre , pais:pais});
        return propiedades.getMany();
    }

    @Query(() => Propiedad)
    PropiedadById(
        @Arg("id", () => Int) id: number
    ) {
        return Propiedad.findOne(
            {
                
                where: {
                    id
                },
                relations: ["usuario", "localizacion", "categoria", "fotos", "precios"],

            }
        );
    }
}