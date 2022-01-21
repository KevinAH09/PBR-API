import { Arg, Authorized, Field, ID, InputType, Mutation, Query, Resolver } from "type-graphql";
import { Int } from "type-graphql";

import { Precio } from "../entities/precio";
import { Propiedad } from "../entities/propiedad";
import { RolesTypes } from "../enums/role-types.enum";

@InputType()
class PrecioInput {


    @Field()
    precio!: string;

    @Field(type => Int)
    propiedad!: Propiedad[];


}

@Resolver()
export class PrecioResolver {
    @Authorized()
    @Mutation(() => Precio)
    async createPrecio(
        @Arg("data", () => PrecioInput) data: PrecioInput
    ) {
        await Precio.insert(
            data
        );
        return await data;
    }

    @Authorized(RolesTypes.ADMIN)
    @Mutation(() => Boolean)
    async deletePrecio(
        @Arg("id", () => Int) id: number
    ) {
        await Precio.delete(id);
        return true;
    }

    @Query(() => Precio)
    Precios() {
        return Precio.find()
    }

    @Query(() => Precio)
    PrecioById(
        @Arg("id", () => Int) id: number
    ) {
        return Precio.findOne(
            {
                where: {
                    id
                }
            }
        );
    }
}