import { Arg, Authorized, Field, ID, InputType, Int, Mutation, Query, Resolver } from "type-graphql";
import { Tipo_Servicio_Propiedad } from "../entities/tipo_servicio_propiedad";
import { RolesTypes } from "../enums/role-types.enum";

@InputType()
class TipoServicioPropiedadInput {

    @Field()
    propiedadId!: number;

    @Field()
    tipoServicioId!: number;
}

@Resolver()
export class TipoServicioPropiedadResolver {
    // @Authorized(RolesTypes.ADMIN)
    @Mutation(() => Tipo_Servicio_Propiedad)
    async createTipo_Servicio_Propiedad(
        @Arg("data", () => TipoServicioPropiedadInput) data: TipoServicioPropiedadInput
    ) {
        const newData = Tipo_Servicio_Propiedad.create(data);
        return await newData.save();
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