import { Arg, Authorized, Field, ID, InputType, Int, Mutation, Query, Resolver } from "type-graphql";
import { Tipo_Beneficio_Propiedad } from "../entities/tipo_beneficio_propiedad";
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
    @Mutation(() => Tipo_Beneficio_Propiedad)
    async createTipo_Beneficio_Propiedad(
        @Arg("data", () => TipoBeneficioPropiedadInput) data: TipoBeneficioPropiedadInput
    ) {
        const newData = Tipo_Beneficio_Propiedad.create(data);
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