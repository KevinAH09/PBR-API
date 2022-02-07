import { Arg, Authorized, Field, InputType, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { Int } from "type-graphql";

import { TipoServicio } from "../entities/tipo-servicio";
import { RolesTypes } from "../enums/role-types.enum";
import { isAuthenticated } from "../middleware/is-authenticated";

@InputType()
class TipoServicioInput {
    @Field()
    nombre!: string

}

@Resolver()
export class TipoServicioResolver {
    
    @Authorized([RolesTypes.ADMIN])
    @UseMiddleware(isAuthenticated)
    @Mutation(() => TipoServicio)
    async createTipoServicio(
        @Arg("data", () => TipoServicioInput) data: TipoServicioInput
    ) {
        await TipoServicio.insert(
            data
        );
        return await data;
    }

    @Authorized([RolesTypes.ADMIN])
    @UseMiddleware(isAuthenticated)
    @Mutation(() => TipoServicio)
    async updateTipoServicio(
        @Arg("id", () => Int) id: number,
        @Arg("data", () => TipoServicioInput) data: TipoServicioInput
    ) {
        await TipoServicio.update({ id }, data);
        const dataUpdated = await TipoServicio.findOne(id)
        return dataUpdated;
    }

    @Authorized([RolesTypes.ADMIN])
    @UseMiddleware(isAuthenticated)
    @Mutation(() => Boolean)
    async deleteTipoServicio(
        @Arg("id", () => Int) id: number
    ) {
        await TipoServicio.delete(id);
        return true;
    }

    @Authorized([RolesTypes.ADMIN])
    @UseMiddleware(isAuthenticated)
    @Query(() => [TipoServicio])
    TipoServicios() {
        return TipoServicio.find()
    }

    @Authorized([RolesTypes.ADMIN])
    @UseMiddleware(isAuthenticated)
    @Query(() => TipoServicio)
    TipoServicioById(
        @Arg("id", () => Int) id: number
    ) {
        return TipoServicio.findOne(
            {
                where: {
                    id
                }
            }
        );
    }
}