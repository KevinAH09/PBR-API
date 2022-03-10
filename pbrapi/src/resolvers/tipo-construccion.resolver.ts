import { Arg, Authorized, Field, InputType, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { Int } from "type-graphql";

import { TipoConstruccion } from "../entities/tipo-construccion";
import { RolesTypes } from "../enums/role-types.enum";
import { isAuthenticated } from "../middleware/is-authenticated";


@InputType()
class TipoConstruccionInput {
    @Field()
    nombre!: string;


}

@Resolver()
export class TipoConstruccionResolver {
    
    @Authorized([RolesTypes.ADMIN, RolesTypes.CENSADOR, RolesTypes.VALIDADOR])
    @UseMiddleware(isAuthenticated)
    @Mutation(() => TipoConstruccion)
    async createTipoConstruccion(
        @Arg("data", () => TipoConstruccionInput) data: TipoConstruccionInput
    ) {
        await TipoConstruccion.insert(
            data
        );
        return await data;
    }

    @Authorized([RolesTypes.ADMIN, RolesTypes.CENSADOR, RolesTypes.VALIDADOR])
    @UseMiddleware(isAuthenticated)
    @Mutation(() => TipoConstruccion)
    async updateTipoConstruccion(
        @Arg("id", () => Int) id: number,
        @Arg("data", () => TipoConstruccionInput) data: TipoConstruccionInput
    ) {
        await TipoConstruccion.update({ id }, data);
        const dataUpdated = await TipoConstruccion.findOne(id)
        return dataUpdated;
    }

    @Authorized([RolesTypes.ADMIN, RolesTypes.CENSADOR, RolesTypes.VALIDADOR])
    @UseMiddleware(isAuthenticated)
    @Mutation(() => Boolean)
    async deleteTipoConstruccion(
        @Arg("id", () => Int) id: number
    ) {
        await TipoConstruccion.delete(id);
        return true;
    }

    @Authorized([RolesTypes.ADMIN, RolesTypes.AGENTE,RolesTypes.CENSADOR, RolesTypes.VALIDADOR])
    @UseMiddleware(isAuthenticated)
    @Query(() => [TipoConstruccion])
    TipoConstrucciones() {
        return TipoConstruccion.find()
    }

    @Authorized([RolesTypes.ADMIN,RolesTypes.AGENTE, RolesTypes.CENSADOR, RolesTypes.VALIDADOR])
    @UseMiddleware(isAuthenticated)
    @Query(() => TipoConstruccion)
    TipoConstruccionById(
        @Arg("id", () => Int) id: number
    ) {
        return TipoConstruccion.findOne(
            {
                where: {
                    id
                }
            }
        );
    }
}