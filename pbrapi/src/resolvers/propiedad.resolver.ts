import { type } from "os";
import { Arg, Authorized, Field, ID, InputType, Int, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { getConnection } from "typeorm";
import { Categoria } from "../entities/categoria";
import { Subcategoria } from "../entities/subcategoria";
import { Localizacion } from "../entities/localizacion";
import { Propiedad } from "../entities/propiedad";
import { Usuario } from "../entities/usuario";
import { EntityStates } from "../enums/entity-states.enum";
import { RolesTypes } from "../enums/role-types.enum";
import { isAuthenticated } from "../middleware/is-authenticated";

@InputType()
class PropiedadInput {
    @Field({ nullable: true })
    numero!: string;

    @Field({ nullable: true })
    descripcion!: string;

    @Field(() => Number)
    extension!: Number;

    @Field(type => Int, { nullable: true })
    usuario!: Usuario[];

    @Field(type => Int, { nullable: true })
    localizacion!: Localizacion[];

    @Field(type => Int, { nullable: true })
    categoria!: Categoria[];

    @Field(type => EntityStates)
    estado!: EntityStates;

    @Field(type => Int, { nullable: true })
    subcategoria!: Subcategoria[];
}
@Resolver()
export class PropiedadResolver {

    @Authorized([RolesTypes.ADMIN, RolesTypes.CENSADOR, RolesTypes.VALIDADOR])
    @UseMiddleware(isAuthenticated)
    @Mutation(() => Propiedad)
    async createPropiedad(
        @Arg("data", () => PropiedadInput) data: PropiedadInput
    ) {
        await Propiedad.insert(
            data
        );
        return await data;
    }

    @Authorized([RolesTypes.ADMIN, RolesTypes.CENSADOR, RolesTypes.VALIDADOR])
    @UseMiddleware(isAuthenticated)
    @Mutation(() => Propiedad)
    async updatePropiedad(
        @Arg("id", () => Int) id: number,
        @Arg("data", () => PropiedadInput) data: PropiedadInput
    ) {
        await Propiedad.update({ id }, data);
        const dataUpdated = await Propiedad.findOne(id)
        return dataUpdated;
    }

    @Authorized([RolesTypes.ADMIN, RolesTypes.AGENTE, RolesTypes.CENSADOR, RolesTypes.VALIDADOR])
    @UseMiddleware(isAuthenticated)
    @Query(() => [Propiedad])
    Propiedad() {
        return Propiedad.find({
            relations: ["usuario", "localizacion", "categoria", "fotos", "precios"]
        })
    }

    @Authorized([RolesTypes.ADMIN, RolesTypes.AGENTE, RolesTypes.CENSADOR, RolesTypes.VALIDADOR])
    @UseMiddleware(isAuthenticated)
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

    @Authorized([RolesTypes.ADMIN, RolesTypes.AGENTE, RolesTypes.CENSADOR, RolesTypes.VALIDADOR])
    @UseMiddleware(isAuthenticated)
    @Query(() => [Propiedad])
    async PropiedadByRecientes() {
        let propiedades = await getConnection()
            .getRepository(Propiedad)
            .createQueryBuilder("propiedad")
            .leftJoinAndSelect("propiedad.categoria", "categoria")
            .leftJoinAndSelect("propiedad.subcategoria", "subcategoria")
            .leftJoinAndSelect("propiedad.localizacion", "localizacion")
            .leftJoinAndSelect("propiedad.fotos", "fotos")
            .leftJoinAndSelect("propiedad.usuario", "usuario")
            .leftJoinAndSelect("propiedad.precios", "precios")
            .where("propiedad.estado != 'Inactivo'")
            .orderBy("propiedad.creado", "DESC").take(10);
        return propiedades.getMany();
    }

    @Authorized([RolesTypes.ADMIN, RolesTypes.AGENTE, RolesTypes.CENSADOR, RolesTypes.VALIDADOR])
    @UseMiddleware(isAuthenticated)
    @Query(() => [Propiedad])
    async PropiedadByCercanas(
        @Arg("latInferior", () => Number) latInferior: Number,
        @Arg("logInferior", () => Number) logInferior: Number,
        @Arg("latSuperior", () => Number) latSuperior: Number,
        @Arg("logSuperior", () => Number) logSuperior: Number,
    ) {
        let propiedades = await getConnection()
            .getRepository(Propiedad)
            .createQueryBuilder("propiedad")
            .leftJoinAndSelect("propiedad.categoria", "categoria")
            .leftJoinAndSelect("propiedad.subcategoria", "subcategoria")
            .leftJoinAndSelect("propiedad.localizacion", "localizacion")
            .leftJoinAndSelect("propiedad.fotos", "fotos")
            .leftJoinAndSelect("propiedad.usuario", "usuario")
            .leftJoinAndSelect("propiedad.precios", "precios")
            .where("propiedad.estado != 'Inactivo'")
            .andWhere("localizacion.latitud > :latInferior")
            .andWhere("localizacion.longitud < :logInferior")
            .andWhere("localizacion.latitud < :latSuperior")
            .andWhere("localizacion.longitud > :logSuperior");

        propiedades = propiedades.setParameters({ latInferior: latInferior, logInferior: logInferior, latSuperior: latSuperior, logSuperior: logSuperior });

        return propiedades.getMany();
    }

    @Authorized([RolesTypes.ADMIN, RolesTypes.AGENTE, RolesTypes.CENSADOR, RolesTypes.VALIDADOR])
    @UseMiddleware(isAuthenticated)
    @Query(() => [Propiedad])
    async PropiedadByLocalizacionAndCategoriaAndPrecioAprox(
        @Arg("byBots", () => String) byBots: String,
        @Arg("usuarioId", () => Int) usuarioId: Number,
        @Arg("estado", () => String) estado: String,
        @Arg("categoriaNombre", () => String) categoriaNombre: String,
        @Arg("subcategoria", () => String) subcategoria: String,
        @Arg("pais", () => String) pais: String,
        @Arg("divprimaria", () => String) divprimaria: String,
        @Arg("divSecundaria", () => String) divSecundaria: String,
        @Arg("precioMax", () => String) precioMax: String,
        @Arg("precioMin", () => String) precioMin: String,
        @Arg("banosMax", () => String) banosMax: String,
        @Arg("banosMin", () => String) banosMin: String,
        @Arg("extencionMin", () => Number) extencionMin: Number,
        @Arg("extencionMax", () => Number) extencionMax: Number,
        @Arg("habitacionMin", () => String) habitacionMin: String,
        @Arg("habitacionMax", () => String) habitacionMax: String,
        @Arg("plantasMin", () => String) plantasMin: String,
        @Arg("plantasMax", () => String) plantasMax: String,
        @Arg("garageMin", () => String) garageMin: String,
        @Arg("garageMax", () => String) garageMax: String,
        @Arg("tipoConstruccion", () => String) tipoConstruccion: String,
    ) {
        let propiedades = await getConnection()
            .getRepository(Propiedad)
            .createQueryBuilder("propiedad")
            .leftJoinAndSelect("propiedad.categoria", "categoria")
            .leftJoinAndSelect("propiedad.subcategoria", "subcategoria")
            .leftJoinAndSelect("propiedad.localizacion", "localizacion")
            .leftJoinAndSelect("propiedad.fotos", "fotos")
            .leftJoinAndSelect("propiedad.usuario", "usuario")
            .leftJoinAndSelect("propiedad.precios", "precios")
            .leftJoinAndSelect("propiedad.construcciones", "construcciones")
            .leftJoinAndSelect("construcciones.tipoConstruccion", "tipoConstruccion");

        if (categoriaNombre) {
            propiedades = propiedades.andWhere("categoria.nombre =:categorianombre")
        }
        if (subcategoria) {
            propiedades = propiedades.andWhere("subcategoria.nombre =:subcategoria")
        }
        if (pais) {
            propiedades = propiedades.andWhere("UPPER(localizacion.pais) =UPPER(:pais)")
        }
        if (divprimaria) {
            propiedades = propiedades.andWhere("UPPER(localizacion.divPrimaria) = UPPER(:divprimaria)")
        }
        if (divSecundaria) {
            propiedades = propiedades.andWhere("UPPER(localizacion.divSecundaria) = UPPER(:divsecundaria)")
        }
        if (precioMin != "" && precioMax != "") {
            propiedades = propiedades.andWhere('precios.id = (SELECT p.id FROM precio p WHERE p.id=(SELECT p.id FROM precio p WHERE p.propiedadId =propiedad.id ORDER BY(p.id) DESC LIMIT 1) AND p.precio BETWEEN ' + precioMin + ' AND ' + precioMax +' )')
        }
        if (extencionMin > 0 && extencionMax > 0) {
            propiedades = propiedades.andWhere('propiedad.extension BETWEEN  :extencionMin  AND  :extencionMax')
        }

        if (banosMin != "") {
            propiedades = propiedades.andWhere('construcciones.bano BETWEEN ' + banosMin + ' AND ' + banosMax)
        }
        if (tipoConstruccion != "") {
            propiedades = propiedades.andWhere('tipoConstruccion.nombre= :tipoConstruccion')
        }

        if (habitacionMin != "") {
            propiedades = propiedades.andWhere('construcciones.dormitorio BETWEEN ' + habitacionMin + ' AND ' + habitacionMax)
        }
        if (plantasMin != "") {
            propiedades = propiedades.andWhere('construcciones.planta BETWEEN ' + plantasMin + ' AND ' + plantasMax)
        }
        if (garageMin != "") {
            propiedades = propiedades.andWhere('construcciones.garage BETWEEN ' + garageMin + ' AND ' + garageMax)
        }
        if (estado) {
            propiedades = propiedades.andWhere("propiedad.estado = '"+ estado+"'")
        }else{
            propiedades = propiedades.andWhere("propiedad.estado != 'Inactivo'")
        }
        if (usuarioId) {
            propiedades = propiedades.andWhere('usuario.id = ' + usuarioId)
        }
        if (byBots=="S") {
            propiedades = propiedades.andWhere("usuario.nombre = 'usuarioBot'" )
        }

        propiedades = propiedades.orderBy("propiedad.creado", "DESC")
            .setParameters({ divsecundaria:divSecundaria,subcategoria: subcategoria, garageMin: garageMin, garageMax: garageMax, plantasMin: plantasMin, plantasMax: plantasMax, habitacionMin: habitacionMin, habitacionMax: habitacionMax, tipoConstruccion: tipoConstruccion, banosMax: banosMax, banosMin: banosMin, categorianombre: categoriaNombre, divprimaria: divprimaria, pais: pais, precioMin: precioMin, precioMax: precioMax, extencionMax: extencionMax, extencionMin: extencionMin });

        // .andWhere("(photo.name = :photoName OR photo.name = :bearName)")
        // .orderBy("photo.id", "DESC")
        // .skip(5)
        // .take(10)
        // console.log(propiedades.getQuery());
        return propiedades.getMany();
    }

    @Authorized([RolesTypes.ADMIN, RolesTypes.AGENTE, RolesTypes.CENSADOR, RolesTypes.VALIDADOR])
    @UseMiddleware(isAuthenticated)
    @Query(() => Propiedad)
    async PropiedadById(
        @Arg("id", () => Int) id: number
    ) {
        let propiedades = await getConnection()
            .getRepository(Propiedad)
            .createQueryBuilder("propiedad")
            .leftJoinAndSelect("propiedad.categoria", "categoria")
            .leftJoinAndSelect("propiedad.subcategoria", "subcategoria")
            .leftJoinAndSelect("propiedad.localizacion", "localizacion")
            .leftJoinAndSelect("propiedad.fotos", "fotos")
            .leftJoinAndSelect("propiedad.usuario", "usuario")
            .leftJoinAndSelect("propiedad.precios", "precios")
            .leftJoinAndSelect("propiedad.propietarios", "propietarios")
            .leftJoinAndSelect("propiedad.construcciones", "construcciones")
            .leftJoinAndSelect("construcciones.tipoConstruccion", "tipoConstruccion")
            .where("propiedad.id = :id")
            .andWhere("propiedad.estado != 'Inactivo'")
        propiedades = propiedades.setParameters({ id: id });
        return propiedades.getOne();
    }
}