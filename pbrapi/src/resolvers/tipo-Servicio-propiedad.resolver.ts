import { Arg, Authorized, Field, ID, InputType, Int, Mutation, Query, Resolver } from "type-graphql";
import { Propiedad } from "../entities/propiedad";
import { TipoBeneficio } from "../entities/tipo-beneficio";
import { TipoServicio } from "../entities/tipo-servicio";
import { TipoServicioPropiedad } from "../entities/tipo_servicio_propiedad";
import { RolesTypes } from "../enums/role-types.enum";

@InputType()
class TipoServicioPropiedadInput {


    @Field(()=>ID)
    tiposervicioId!: TipoServicio[];

    @Field(()=>ID)
    propiedadId!: Propiedad[];   
}

@Resolver()
export class TipoServicioPropiedadResolver {
    // @Authorized(RolesTypes.ADMIN)
    @Mutation(() => TipoServicioPropiedad)
    async createTipo_Servicio_Propiedad(
        @Arg("data", () => TipoServicioPropiedadInput) data: TipoServicioPropiedadInput
    ) {
        const newData = TipoServicioPropiedad.create(data);
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