import { Arg, Authorized, Field, ID, InputType, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { Int } from "type-graphql";

import { Precio } from "../entities/precio";
import { Propiedad } from "../entities/propiedad";
import { RolesTypes } from "../enums/role-types.enum";
import { isAuthenticated } from "../middleware/is-authenticated";

@InputType()
class PrecioInput {


    @Field()
    precio!: string;

    @Field(type => Int)
    propiedad!: Propiedad[];


}

@Resolver()
export class PrecioResolver {
    
    @Authorized([RolesTypes.ADMIN, RolesTypes.CENSADOR, RolesTypes.VALIDADOR])
    @UseMiddleware(isAuthenticated)
    @Mutation(() => Precio)
    async createPrecio(
        @Arg("data", () => PrecioInput) data: PrecioInput
    ) {
        await Precio.insert(
            data
        );
        return await data;
    }

    @Authorized([RolesTypes.ADMIN, RolesTypes.CENSADOR, RolesTypes.VALIDADOR])
    @UseMiddleware(isAuthenticated)
    @Mutation(() => Boolean)
    async deletePrecio(
        @Arg("id", () => Int) id: number
    ) {
        await Precio.delete(id);
        return true;
    }

    @Authorized([RolesTypes.ADMIN, RolesTypes.AGENTE, RolesTypes.CENSADOR, RolesTypes.VALIDADOR])
    @UseMiddleware(isAuthenticated)
    @Query(() => Precio)
    Precios() {
        return Precio.find()
    }

    @Authorized([RolesTypes.ADMIN, RolesTypes.AGENTE, RolesTypes.CENSADOR, RolesTypes.VALIDADOR])
    @UseMiddleware(isAuthenticated)
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