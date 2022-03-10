import { Arg, Authorized, Field, ID, InputType, Int, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { Propiedad } from "../entities/propiedad";
import { getConnection } from "typeorm";
import { PropiedadUsuario } from "../entities/propiedad_usuario";
import { Usuario } from "../entities/usuario";
import { RolesTypes } from "../enums/role-types.enum";
import { isAuthenticated } from "../middleware/is-authenticated";

@InputType()
class PropiedadUsuarioInput {


    @Field(type => Int)
    usuario!: Usuario[];

    @Field(type => Int)
    propiedad!: Propiedad[];

    @Field(type => Boolean)
    favorita!: boolean;
}

@Resolver()
export class PropiedadUsuarioResolver {

    @Authorized([RolesTypes.ADMIN, RolesTypes.CENSADOR, RolesTypes.VALIDADOR,RolesTypes.AGENTE])
    @UseMiddleware(isAuthenticated)
    @Mutation(() => PropiedadUsuario)
    async createPropiedad_Usuario(
        @Arg("data", () => PropiedadUsuarioInput) data: PropiedadUsuarioInput
    ) {
        await PropiedadUsuario.insert(
            data
        );
        return await data;
    }

    //     mutation{
    //         updatePropiedad_Usuario(id:15,data:{propiedad:240,usuario:3,favorita:false}){id}

    // }

    // mutation{
    //     createPropiedad_Usuario(data:{propiedad:240,usuario:3,favorita:true}){id}

    // }

    @Authorized([RolesTypes.ADMIN, RolesTypes.CENSADOR, RolesTypes.VALIDADOR,RolesTypes.AGENTE])
    @UseMiddleware(isAuthenticated)
    @Mutation(() => PropiedadUsuario)
    async updatePropiedad_Usuario(
        @Arg("id", () => Int) id: number,
        @Arg("data", () => PropiedadUsuarioInput) data: PropiedadUsuarioInput
    ) {
        await PropiedadUsuario.update({ id }, data);
        const dataUpdated = await PropiedadUsuario.findOne(id)
        return dataUpdated;
    }

    @Authorized([RolesTypes.ADMIN, RolesTypes.AGENTE, RolesTypes.CENSADOR, RolesTypes.VALIDADOR])
    @UseMiddleware(isAuthenticated)
    @Query(() => [PropiedadUsuario])
    PropiedadUsuario() {
        return PropiedadUsuario.find()
    }

    @Authorized([RolesTypes.ADMIN, RolesTypes.AGENTE, RolesTypes.CENSADOR, RolesTypes.VALIDADOR])
    @UseMiddleware(isAuthenticated)
    @Query(() => [PropiedadUsuario])
    async PropiedadUsuarioByusuarioId(
        @Arg("usuarioid", () => Int) usuarioid: number
    ) {
        let propiedades = await getConnection()
            .getRepository(PropiedadUsuario)
            .createQueryBuilder("propiedad_usuario")
            .leftJoinAndSelect("propiedad_usuario.propiedad", "propiedad")
            .leftJoinAndSelect("propiedad.categoria", "categoria")
            .leftJoinAndSelect("propiedad.subcategoria", "subcategoria")
            .leftJoinAndSelect("propiedad.localizacion", "localizacion")
            .leftJoinAndSelect("propiedad.fotos", "fotos")
            .leftJoinAndSelect("propiedad.usuario", "usuario")
            .leftJoinAndSelect("propiedad.precios", "precios")
            .andWhere("(propiedad_usuario.favorita =1)")
            .andWhere("(propiedad_usuario.usuario =:usuarioid)");

        propiedades = propiedades.setParameters({ usuarioid: usuarioid });
        // console.log(propiedades.getQuery());
        return propiedades.getMany();
    }

    @Authorized([RolesTypes.ADMIN, RolesTypes.AGENTE, RolesTypes.CENSADOR, RolesTypes.VALIDADOR])
    @UseMiddleware(isAuthenticated)
    @Query(() => PropiedadUsuario)
    async PropiedadUsuarioByusuarioIdAndPropiedadId(
        @Arg("usuarioid", () => Int) usuarioid: number,
        @Arg("propiedadid", () => Int) propiedadid: number
    ) {
        let propiedades = await getConnection()
            .getRepository(PropiedadUsuario)
            .createQueryBuilder("propiedad_usuario")
            .innerJoinAndSelect("propiedad_usuario.propiedad", "propiedad")
            .innerJoinAndSelect("propiedad.categoria", "categoria")
            .innerJoinAndSelect("propiedad.localizacion", "localizacion")
            .innerJoinAndSelect("propiedad.fotos", "fotos")
            .innerJoinAndSelect("propiedad.usuario", "usuario")
            .innerJoinAndSelect("propiedad.precios", "precios")
            .andWhere("(propiedad_usuario.propiedad =:propiedadid )")
            .andWhere("(propiedad_usuario.usuario =:usuarioid)")
            .limit(1);

        propiedades = propiedades.setParameters({ usuarioid: usuarioid, propiedadid: propiedadid });
        // console.log(propiedades.getQuery());
        return propiedades.getOne();
    }
}