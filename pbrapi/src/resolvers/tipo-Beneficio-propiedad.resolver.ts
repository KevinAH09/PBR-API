import { Arg, Authorized, Field, ID, InputType, Int, Mutation, Query, Resolver } from "type-graphql";
import { Propiedad } from "../entities/propiedad";
import { TipoBeneficio } from "../entities/tipo-beneficio";
import { TipoBeneficioPropiedad } from "../entities/tipo-beneficio-propiedad";
import { RolesTypes } from "../enums/role-types.enum";

@InputType()
class TipoBeneficioPropiedadInput {


    @Field(type => Int)
    tipobeneficio!: TipoBeneficio[];

    @Field(type => Int)
    propiedad!: Propiedad[];
}

@Resolver()
export class TipoBeneficioPropiedadResolver {
    // @Authorized(RolesTypes.ADMIN)
    @Mutation(() => TipoBeneficioPropiedad)
    async createTipo_Beneficio_Propiedad(
        @Arg("data", () => TipoBeneficioPropiedadInput) data: TipoBeneficioPropiedadInput
    ) {
        await TipoBeneficioPropiedad.insert(
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


    @Query(() => [TipoBeneficioPropiedad])
    TipoBeneficioPropiedad() {
        return TipoBeneficioPropiedad.find()
    }

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