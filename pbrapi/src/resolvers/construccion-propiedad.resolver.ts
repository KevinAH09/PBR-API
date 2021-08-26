import { Arg, Authorized, Field, ID, InputType, Int, Mutation, Query, Resolver } from "type-graphql";
import { Construccion_Propiedad } from "../entities/construccion_propiedad";

import { RolesTypes } from "../enums/role-types.enum";

@InputType()
class ConstruccionPropiedadInput {

    @Field()
    propiedadId!: number;

    @Field()
    construccionId!: number;
}

@Resolver()
export class ConstruccionPropiedadResolver {
    // @Authorized(RolesTypes.ADMIN)
    @Mutation(() => Construccion_Propiedad)
    async createConstruccionPropiedad(
        @Arg("data", () => ConstruccionPropiedadInput) data: ConstruccionPropiedadInput
    ) {
        const newData = Construccion_Propiedad.create(data);
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