import { Arg, Authorized, InputType, Int, Mutation, Query, Resolver } from "type-graphql";
import { Propiedad } from "../entities/propiedad";

// import { RolesTypes } from "../enums/role-types.enum";

@InputType()
class PropiedadInput {
   
    name!:string;

}

@Resolver()
export class PropiedadResolver {
    @Authorized()
    @Mutation(() => Propiedad)
    async createPropiedad(
        @Arg("data", () => PropiedadInput) data: PropiedadInput
    ) {
        const newData = Propiedad.create(data);
        return await newData.save();
    }

    @Authorized()
    @Mutation(() => Propiedad)
    async updatePropiedad(
        @Arg("id", () => Int) id: number,
        @Arg("data", () => PropiedadInput) data: PropiedadInput
    ) {
        await Propiedad.update({ id }, data);
        const dataUpdated = await Propiedad.findOne(id)
        return dataUpdated;
    }

    // @Authorized(RolesTypes.ADMIN)
    // @Mutation(() => Boolean)
    // async deleteTipoServicio(
    //     @Arg("id", () => Int) id: number
    // ) {
    //     await TipoServicio.delete(id);
    //     return true;
    // }

    @Query(() => [Propiedad])
    Propiedad() {
        return Propiedad.find()
    }

    @Query(() => [Propiedad])
    PropiedadById(
        @Arg("id", () => Int) id: number
    ) {
        return Propiedad.findOne(
            {
                where: {
                    id
                }
            }
        );
    }
}