import { Arg, Authorized, Field, ID, InputType, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { Int } from "type-graphql";
import { Propiedad } from "../entities/propiedad";

import { Propietario } from "../entities/propietario";
import { RolesTypes } from "../enums/role-types.enum";
import { isAuthenticated } from "../middleware/is-authenticated";

@InputType()
class PropietarioInput {
    @Field()
    nombre!: string

    @Field()
    telefono!: string

    @Field()
    email!: string

    @Field(type => Int)
    propiedad!: Propiedad[];

}

@Resolver()
export class PropietarioResolver {
    
    @Authorized([RolesTypes.ADMIN])
    @UseMiddleware(isAuthenticated)
    @Mutation(() => Propietario)
    async createPropietario(
        @Arg("data", () => PropietarioInput) data: PropietarioInput
    ) {
        await Propietario.insert(
            data
        );
        return await data;
    }

    @Authorized([RolesTypes.ADMIN])
    @UseMiddleware(isAuthenticated)
    @Mutation(() => Propietario)
    async updatePropietario(
        @Arg("id", () => Int) id: number,
        @Arg("data", () => PropietarioInput) data: PropietarioInput
    ) {
        await Propietario.update({ id }, data);
        const dataUpdated = await Propietario.findOne(id)
        return dataUpdated;
    }

    @Authorized([RolesTypes.ADMIN])
    @UseMiddleware(isAuthenticated)
    @Mutation(() => Boolean)
    async deletePropietario(
        @Arg("id", () => Int) id: number
    ) {
        await Propietario.delete(id);
        return true;
    }

    @Authorized([RolesTypes.ADMIN])
    @UseMiddleware(isAuthenticated)
    @Query(() => Propietario)
    Propietarios() {
        return Propietario.find()
    }

    @Authorized([RolesTypes.ADMIN])
    @UseMiddleware(isAuthenticated)
    @Query(() => Propietario)
    PropietarioById(
        @Arg("id", () => Int) id: number
    ) {
        return Propietario.findOne(
            {
                where: {
                    id
                }
            }
        );
    }
}