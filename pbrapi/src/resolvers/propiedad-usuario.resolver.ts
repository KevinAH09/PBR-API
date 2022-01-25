import { Arg, Authorized, Field, ID, InputType, Int, Mutation, Query, Resolver } from "type-graphql";
import { Propiedad } from "../entities/propiedad";
import { PropiedadUsuario } from "../entities/propiedad_usuario";

@InputType()
class PropiedadUsuarioInput {


    @Field(type => Int)
    usuarioId!: PropiedadUsuario[];

    @Field(type => Int)
    propiedadId!: Propiedad[];

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


    // @Query(() => [Propiedad])
    // Propiedad() {
    //     return Propiedad.find()
    // }

    // @Query(() => [Propiedad])
    // PropiedadById(
    //     @Arg("id", () => Int) id: number
    // ) {
    //     return Propiedad.findOne(
    //         {
    //             where: {
    //                 id
    //             }
    //         }
    //     );
    // }
}