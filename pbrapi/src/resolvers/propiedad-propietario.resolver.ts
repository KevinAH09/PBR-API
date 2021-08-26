import { Arg, Authorized, Field, ID, InputType, Int, Mutation, Query, Resolver } from "type-graphql";
import { Propiedad_Propietario } from "../entities/propiedadPropietario";
import { RolesTypes } from "../enums/role-types.enum";

@InputType()
class PropiedadPropietarioInput {

    @Field()
    propiedadId!: number;

    @Field()
    propietarioId!: number;
}

@Resolver()
export class PropiedadPropietarioResolver {
    // @Authorized(RolesTypes.ADMIN)
    @Mutation(() => Propiedad_Propietario)
    async createPropiedadPropietario(
        @Arg("data", () => PropiedadPropietarioInput) data: PropiedadPropietarioInput
    ) {
        const newData = Propiedad_Propietario.create(data);
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