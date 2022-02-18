import { Arg, Authorized, Field, ID, InputType, Int, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { Construccion } from "../entities/construccion";
import { Propiedad } from "../entities/propiedad";
import { TipoConstruccion } from "../entities/tipo-construccion";
import { RolesTypes } from "../enums/role-types.enum";
import { isAuthenticated } from "../middleware/is-authenticated";

// import { RolesTypes } from "../enums/role-types.enum";

@InputType()
class ConstruccionInput {


    @Field(type => Int)
    tipoConstruccion!: TipoConstruccion[];

    @Field(type => Int)
    propiedad!: Propiedad[];

    @Field()
    metroCuadrado!: string;

    @Field()
    descripcion!: string;

    @Field()
    bano!: string;

    @Field()
    sala!: string;

    @Field()
    planta!: string;

    @Field()
    cocina!: string;

    @Field()
    dormitorio!: string;

    @Field()
    material!: string;

    @Field()
    garage!: string;

}

@Resolver()
export class ConstruccionResolver {

    @Authorized([RolesTypes.ADMIN])
    @UseMiddleware(isAuthenticated)
    @Mutation(() => Construccion)
    async createConstruccion(
        @Arg("data", () => ConstruccionInput) data: ConstruccionInput
    ): Promise<ConstruccionInput> {
        await Construccion.insert(
            data
        );
        return await data;
    }

    @Authorized([RolesTypes.ADMIN])
    @UseMiddleware(isAuthenticated)
    @Mutation(() => Construccion)
    async updateConstruccion(
        @Arg("id", () => Int) id: number,
        @Arg("data", () => ConstruccionInput) data: ConstruccionInput
    ) {
        await Construccion.update({ id }, data);
        const dataUpdated = await Construccion.findOne(id)
        return dataUpdated;
    }

    @Authorized(RolesTypes.ADMIN)
    @UseMiddleware(isAuthenticated)
    @Mutation(() => Boolean)
    async deleteConstrucciones(
        @Arg("id", () => Int) id: number
    ) {
        await Construccion.delete(id);
        return true;
    }

    @Authorized([RolesTypes.ADMIN, RolesTypes.AGENTE, RolesTypes.CENSADOR, RolesTypes.VALIDADOR])
    @UseMiddleware(isAuthenticated)
    @Query(() => Construccion)
    Construccion() {
        return Construccion.find()
    }

    @Authorized([RolesTypes.ADMIN, RolesTypes.AGENTE, RolesTypes.CENSADOR, RolesTypes.VALIDADOR])
    @UseMiddleware(isAuthenticated)
    @Query(() => Construccion)
    ConstruccionById(
        @Arg("id", () => Int) id: number
    ) {
        return Construccion.findOne(
            {
                where: {
                    id
                }
            }
        );
    }
}