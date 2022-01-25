import { Arg, Authorized, Field, ID, InputType, Int, Mutation, Query, Resolver } from "type-graphql";
import { Propiedad } from "../entities/propiedad";
import { TipoBeneficio } from "../entities/tipo-beneficio";
import { TipoServicio } from "../entities/tipo-servicio";
import { TipoServicioPropiedad } from "../entities/tipo_servicio_propiedad";
import { RolesTypes } from "../enums/role-types.enum";

@InputType()
class TipoServicioPropiedadInput {


    @Field(type => Int)
    tiposervicio!: TipoServicio[];

    @Field(type => Int)
    propiedad!: Propiedad[];
}

@Resolver()
export class TipoServicioPropiedadResolver {
    // @Authorized(RolesTypes.ADMIN)
    @Mutation(() => TipoServicioPropiedad)
    async createTipo_Servicio_Propiedad(
        @Arg("data", () => TipoServicioPropiedadInput) data: TipoServicioPropiedadInput
    ) {
        await TipoServicioPropiedad.insert(
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