import { type } from "os";
import { Arg, Authorized, Field, ID, InputType, Int, Mutation, Query, Resolver } from "type-graphql";
import { getConnection } from "typeorm";
import { Categoria } from "../entities/categoria";
import { Localizacion } from "../entities/localizacion";
import { Propiedad } from "../entities/propiedad";
import { Usuario } from "../entities/usuario";
import { EntityStates } from "../enums/entity-states.enum";
import { RolesTypes } from "../enums/role-types.enum";

@InputType()
class PropiedadInput {
    @Field({ nullable: true })
    numero!: string;

    @Field({ nullable: true })
    descripcion!: string;

    @Field({ nullable: true })
    extension!: string;

    @Field(type => Int, { nullable: true })
    usuario!: Usuario[];

    @Field(type => Int, { nullable: true })
    localizacion!: Localizacion[];

    @Field(type => Int, { nullable: true })
    categoria!: Categoria[];

    @Field(type => EntityStates)
    estado!: EntityStates;
}
@Resolver()
export class PropiedadResolver {
    @Authorized(RolesTypes.ADMIN)
    @Mutation(() => Propiedad)
    async createPropiedad(
        @Arg("data", () => PropiedadInput) data: PropiedadInput
    ) {
        await Propiedad.insert(
            data
        );
        return await data;
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


    @Query(() => Int)
    async PropiedadByFolio(
        @Arg("numero", () => String) numero: String,
    ) {
        let propiedades = await getConnection()
            .getRepository(Propiedad)
            .createQueryBuilder("propiedad");
        if (numero) {
            propiedades = propiedades.andWhere("propiedad.numero =:numero")
        }
        propiedades = propiedades.setParameters({ numero: numero });
        return propiedades.getCount();
    }

    @Query(() => [Propiedad])
    async PropiedadByRecientes() {
        let propiedades = await getConnection()
            .getRepository(Propiedad)
            .createQueryBuilder("propiedad")
            .innerJoinAndSelect("propiedad.categoria", "categoria")
            .innerJoinAndSelect("propiedad.localizacion", "localizacion")
            .innerJoinAndSelect("propiedad.fotos", "fotos")
            .innerJoinAndSelect("propiedad.usuario", "usuario")
            .innerJoinAndSelect("propiedad.precios", "precios").orderBy("propiedad.creado").take(10);
        return propiedades.getMany();
    }

    @Query(() => [Propiedad])
    async PropiedadByCercanas(
        @Arg("latInferior", () => String) latInferior: String,
        @Arg("logInferior", () => String) logInferior: String,
        @Arg("latSuperior", () => String) latSuperior: String,
        @Arg("logSuperior", () => String) logSuperior: String,
    ) {
        let propiedades = await getConnection()
            .getRepository(Propiedad)
            .createQueryBuilder("propiedad")
            .innerJoinAndSelect("propiedad.categoria", "categoria")
            .innerJoinAndSelect("propiedad.localizacion", "localizacion")
            .innerJoinAndSelect("propiedad.fotos", "fotos")
            .innerJoinAndSelect("propiedad.usuario", "usuario")
            .innerJoinAndSelect("propiedad.precios", "precios")
            .andWhere("localizacion.latitud > :latInferior")
            .andWhere("localizacion.longitud > :logInferior")
            .andWhere("localizacion.latitud < :latSuperior")
            .andWhere("localizacion.longitud < :logSuperior");

            propiedades = propiedades.setParameters({ latInferior: latInferior, logInferior: logInferior, latSuperior: latSuperior, logSuperior: logSuperior });

        return propiedades.getMany();
    }

    @Query(() => [Propiedad])
    async PropiedadByLocalizacionAndCategoriaAndPrecioAprox(
        @Arg("categoriaNombre", () => String) categoriaNombre: String,
        @Arg("pais", () => String) pais: String,
        @Arg("divprimaria", () => String) divprimaria: String,
        @Arg("precioMax", () => String) precioMax: String,
        @Arg("precioMin", () => String) precioMin: String
    ) {
        let propiedades = await getConnection()
            .getRepository(Propiedad)
            .createQueryBuilder("propiedad")
            .innerJoinAndSelect("propiedad.categoria", "categoria")
            .innerJoinAndSelect("propiedad.localizacion", "localizacion")
            .innerJoinAndSelect("propiedad.fotos", "fotos")
            .innerJoinAndSelect("propiedad.usuario", "usuario")
            .innerJoinAndSelect("propiedad.precios", "precios");

        console.log(categoriaNombre);
        if (categoriaNombre) {
            propiedades = propiedades.andWhere("categoria.nombre =:categorianombre")
        }
        if (pais) {
            propiedades = propiedades.andWhere("localizacion.pais =:pais")
        }
        // if (divprimaria) {
        //     propiedades = propiedades.andWhere("localizacion.pais =:pais")
        // }
        // SELECT p.id FROM precio p WHERE p.propiedadId = 239 AND p.precio BETWEEN 0 AND 1000000000000000000000 ORDER BY(p.creado) DESC LIMIT 1
        if (precioMin) {
            propiedades = propiedades.andWhere('precios.id = (SELECT p.id FROM precio p WHERE p.propiedadId =propiedad.id AND p.precio BETWEEN ' + precioMin + ' AND ' + precioMax + ' ORDER BY(p.creado) DESC LIMIT 1)')
        }

        // .andWhere("(photo.name = :photoName OR photo.name = :bearName)")
        // .orderBy("photo.id", "DESC")
        // .skip(5)
        // .take(10)
        propiedades = propiedades.setParameters({ categorianombre: categoriaNombre, pais: pais, precioMin: precioMin, precioMax: precioMax });
        // console.log(propiedades.getQuery());
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
                relations: ["usuario", "localizacion", "categoria", "fotos", "precios","propietarios"],

            }
        );
    }
}