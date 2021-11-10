import { Arg, Authorized, Field, InputType, Int, Mutation, Query, Resolver } from "type-graphql";
import { TipoBeneficio } from "../entities/tipo-beneficio";
import { RolesTypes } from "../enums/role-types.enum";


@InputType()
class TipoBeneficioInput {
    @Field()
    nombre!: string;


}

@Resolver()
export class TipoBeneficioResolver {
    @Authorized()
    @Mutation(() => TipoBeneficio)
    async createTipoBeneficio(
        @Arg("data", () => TipoBeneficioInput) data: TipoBeneficioInput
    ) {
        const newData = TipoBeneficio.create(data);
        return await newData.save();
    }

    @Authorized()
    @Mutation(() => TipoBeneficio)
    async updateTipoBeneficio(
        @Arg("id", () => Int) id: number,
        @Arg("data", () => TipoBeneficioInput) data: TipoBeneficioInput
    ) {
        await TipoBeneficio.update({ id }, data);
        const dataUpdated = await TipoBeneficio.findOne(id)
        return dataUpdated;
    }

    @Authorized(RolesTypes.ADMIN)
    @Mutation(() => Boolean)
    async deleteTipoBeneficio(
        @Arg("id", () => Int) id: number
    ) {
        await TipoBeneficio.delete(id);
        return true;
    }

    @Query(() => [TipoBeneficio])
    TipoBeneficios() {
        return TipoBeneficio.find()
    }

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