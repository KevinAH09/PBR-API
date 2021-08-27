import { Arg, Authorized, Field, ID, InputType, Int, Mutation, Query, Resolver } from "type-graphql";
import { TipoBeneficioPropiedad } from "../entities/tipo-beneficio-propiedad";
import { RolesTypes } from "../enums/role-types.enum";

@InputType()
class TipoBeneficioPropiedadInput {

    @Field()
    propiedadId!: number;

    @Field()
    tipoBeneficioId!: number;
}

@Resolver()
export class TipoBeneficioPropiedadResolver {
    // @Authorized(RolesTypes.ADMIN)
    @Mutation(() => TipoBeneficioPropiedad)
    async createTipo_Beneficio_Propiedad(
        @Arg("data", () => TipoBeneficioPropiedadInput) data: TipoBeneficioPropiedadInput
    ) {
        const newData = TipoBeneficioPropiedad.create(data);
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