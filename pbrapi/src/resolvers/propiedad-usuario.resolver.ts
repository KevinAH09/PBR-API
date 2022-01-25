import { Arg, Authorized, Field, ID, InputType, Int, Mutation, Query, Resolver } from "type-graphql";
import { Propiedad } from "../entities/propiedad";
import { getConnection } from "typeorm";
import { PropiedadUsuario } from "../entities/propiedad_usuario";
import { Usuario } from "../entities/usuario";

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
    // @Authorized(RolesTypes.ADMIN)
    @Mutation(() => PropiedadUsuario)
    async createPropiedad_Usuario(
        @Arg("data", () => PropiedadUsuarioInput) data: PropiedadUsuarioInput
    ) {
        await PropiedadUsuario.insert(
            data
        );
        return await data;
    }

    // @Authorized(RolesTypes.ADMIN)
    // @Mutation(() => Propiedad_Propietario)
    // async updatePropiedadPropietario(
    //     @Arg("id", () => Int) id: number,
    //     @Arg("data", () => PropiedadPropietarioInput) data: PropiedadPropietarioInput
    // ) {
    //     await Propiedad_Propietario.update({ id }, data);
    //     const dataUpdated = await Propiedad_Propietario.findOne(id)
    //     return dataUpdated;
    // }


    @Query(() => [PropiedadUsuario])
    PropiedadUsuario() {
        return PropiedadUsuario.find()
    }

    @Query(() => [PropiedadUsuario])
    async PropiedadUsuarioByusuarioId(
        @Arg("usuarioid", () => Int) usuarioid: number
    ) {
        let propiedades = await getConnection()
            .getRepository(PropiedadUsuario)
            .createQueryBuilder("propiedad_usuario")
            .innerJoinAndSelect("propiedad_usuario.propiedad", "propiedad")
            .andWhere("(propiedad_usuario.favorita =1)")
            .andWhere("(propiedad_usuario.usuario =:usuarioid)");
        //     console.log(categoriaNombre);
        // if (categoriaNombre) {
        //     propiedades = propiedades.andWhere("categoria.nombre =:categorianombre")
        // }
        // if (pais) {
        //     propiedades = propiedades.andWhere("localizacion.pais =:pais")
        // }
        // // if (divprimaria) {
        // //     propiedades = propiedades.andWhere("localizacion.pais =:pais")
        // // }
        // // SELECT p.id FROM precio p WHERE p.propiedadId = 239 AND p.precio BETWEEN 0 AND 1000000000000000000000 ORDER BY(p.creado) DESC LIMIT 1
        // if(precioMin){
        //     propiedades=propiedades.andWhere('precios.id = (SELECT p.id FROM precio p WHERE p.propiedadId =propiedad.id AND p.precio BETWEEN '+precioMin+' AND '+precioMax+' ORDER BY(p.creado) DESC LIMIT 1)')
        // }
        
        
        // // .orderBy("photo.id", "DESC")
        // // .skip(5)
        // // .take(10)
        propiedades = propiedades.setParameters({ usuarioid: usuarioid} );
        // console.log(propiedades.getQuery());
        return propiedades.getMany();
    }
}