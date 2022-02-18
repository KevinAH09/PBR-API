import { Arg, Authorized, Field, InputType, Int, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { TipoBeneficio } from "../entities/tipo-beneficio";
import { RolesTypes } from "../enums/role-types.enum";
import { isAuthenticated } from "../middleware/is-authenticated";


@InputType()
class TipoBeneficioInput {
    @Field()
    nombre!: string;


}

@Resolver()
export class TipoBeneficioResolver {
    
    @Authorized([RolesTypes.ADMIN, RolesTypes.CENSADOR, RolesTypes.VALIDADOR])
    @UseMiddleware(isAuthenticated)
    @Mutation(() => TipoBeneficio)
    async createTipoBeneficio(
        @Arg("data", () => TipoBeneficioInput) data: TipoBeneficioInput
    ) {
        await TipoBeneficio.insert(
            data
        );
        return await data;
    }

    @Authorized([RolesTypes.ADMIN, RolesTypes.CENSADOR, RolesTypes.VALIDADOR])
    @UseMiddleware(isAuthenticated)
    @Mutation(() => TipoBeneficio)
    async updateTipoBeneficio(
        @Arg("id", () => Int) id: number,
        @Arg("data", () => TipoBeneficioInput) data: TipoBeneficioInput
    ) {
        await TipoBeneficio.update({ id }, data);
        const dataUpdated = await TipoBeneficio.findOne(id)
        return dataUpdated;
    }

    @Authorized([RolesTypes.ADMIN, RolesTypes.CENSADOR, RolesTypes.VALIDADOR])
    @UseMiddleware(isAuthenticated)
    @Mutation(() => Boolean)
    async deleteTipoBeneficio(
        @Arg("id", () => Int) id: number
    ) {
        await TipoBeneficio.delete(id);
        return true;
    }

    @Authorized([RolesTypes.ADMIN, RolesTypes.AGENTE, RolesTypes.CENSADOR, RolesTypes.VALIDADOR])
    @UseMiddleware(isAuthenticated)
    @Query(() => [TipoBeneficio])
    TipoBeneficios() {
        return TipoBeneficio.find()
    }

    @Authorized([RolesTypes.ADMIN, RolesTypes.AGENTE, RolesTypes.CENSADOR, RolesTypes.VALIDADOR])
    @UseMiddleware(isAuthenticated)
    @Query(() => TipoBeneficio)
    TipoBeneficioById(
        @Arg("id", () => Int) id: number
    ) {
        return TipoBeneficio.findOne(
            {
                where: {
                    id
                }
            }
        );
    }
}