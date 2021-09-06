import { Arg, Authorized, Field, InputType, Int, Mutation, Query, Resolver } from "type-graphql";
import { TipoConstruccion } from "../entities/tipo-construccion";
import { RolesTypes } from "../enums/role-types.enum";


@InputType()
class TipoConstruccionInput {
    @Field()
    nombre!: string;


}

@Resolver()
export class TipoConstruccionResolver {
    @Authorized()
    @Mutation(() => TipoConstruccion)
    async createTipoConstruccion(
        @Arg("data", () => TipoConstruccionInput) data: TipoConstruccionInput
    ) {
        const newData = TipoConstruccion.create(data);
        return await newData.save();
    }

    @Authorized()
    @Mutation(() => TipoConstruccion)
    async updateTipoConstruccion(
        @Arg("id", () => Int) id: number,
        @Arg("data", () => TipoConstruccionInput) data: TipoConstruccionInput
    ) {
        await TipoConstruccion.update({ id }, data);
        const dataUpdated = await TipoConstruccion.findOne(id)
        return dataUpdated;
    }

    @Authorized(RolesTypes.ADMIN)
    @Mutation(() => Boolean)
    async deleteTipoConstruccion(
        @Arg("id", () => Int) id: number
    ) {
        await TipoConstruccion.delete(id);
        return true;
    }

    @Query(() => TipoConstruccion)
    TipoConstruccions() {
        return TipoConstruccion.find()
    }

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