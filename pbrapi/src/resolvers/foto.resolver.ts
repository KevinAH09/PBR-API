import { Arg, Authorized, Field, ID, InputType, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { Int } from "type-graphql";
import { EntityStates } from "../enums/entity-states.enum";

import { Foto } from "../entities/foto";
import { Propiedad } from "../entities/propiedad";
import { RolesTypes } from "../enums/role-types.enum";
import { isAuthenticated } from "../middleware/is-authenticated";

@InputType()
class FotoInput {

    @Field()
    tag!: string
    
    @Field(type =>Int)
    propiedad!: Propiedad[];

    @Field(type => EntityStates)
    estado!: EntityStates;
}

@Resolver()
export class FotoResolver {
    
    @Authorized([RolesTypes.ADMIN])
    @UseMiddleware(isAuthenticated)
    @Mutation(() => Foto)
    async createFoto(
        @Arg("data", () => FotoInput) data: FotoInput
    ): Promise<FotoInput> {
        await Foto.insert(
            data
        );
        return await data;
    }

    @Authorized([RolesTypes.ADMIN])
    @UseMiddleware(isAuthenticated)
    @Mutation(() => Foto)
    async updateFoto(
        @Arg("id", () => Int) id: number,
        @Arg("data", () => FotoInput) data: FotoInput
    ) {
        await Foto.update({ id }, data);
        const dataUpdated = await Foto.findOne(id)
        return dataUpdated;
    }

    @Authorized([RolesTypes.ADMIN])
    @UseMiddleware(isAuthenticated)
    @Mutation(() => Boolean)
    async deleteFoto(
        @Arg("id", () => Int) id: number
    ) {
        await Foto.delete(id);
        return true;
    }

    @Authorized([RolesTypes.ADMIN])
    @UseMiddleware(isAuthenticated)
    @Query(() => Foto)
    Fotos() {
        return Foto.find()
    }

    @Authorized([RolesTypes.ADMIN])
    @UseMiddleware(isAuthenticated)
    @Query(() => Foto)
    FotoById(
        @Arg("id", () => Int) id: number
    ) {
        return Foto.findOne(
            {
                where: {
                    id
                }
            }
        );
    }
}