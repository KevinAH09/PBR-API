import { Arg, Authorized, Field, InputType, Mutation, Query, Resolver } from "type-graphql";
import { Int } from "type-graphql";

import { Subcategoria } from "../entities/subcategoria";
import { RolesTypes } from "../enums/role-types.enum";

@InputType()
class SubcategoriaInput {
    @Field()
    nombre!: string

}

@Resolver()
export class SubcategoriaResolver {
    @Authorized()
    @Mutation(() => Subcategoria)
    async createSubcategoria(
        @Arg("data", () => SubcategoriaInput) data: SubcategoriaInput
    ) {
        await Subcategoria.insert(
            data
        );
        return await data;
    }

    @Authorized()
    @Mutation(() => Subcategoria)
    async updateSubcategoria(
        @Arg("id", () => Int) id: number,
        @Arg("data", () => SubcategoriaInput) data: SubcategoriaInput
    ) {
        await Subcategoria.update({ id }, data);
        const dataUpdated = await Subcategoria.findOne(id)
        return dataUpdated;
    }

    @Authorized(RolesTypes.ADMIN)
    @Mutation(() => Boolean)
    async deleteSubcategoria(
        @Arg("id", () => Int) id: number
    ) {
        await Subcategoria.delete(id);
        return true;
    }

    @Query(() => Subcategoria)
    Subcategorias() {
        return Subcategoria.find()
    }

    @Query(() => Subcategoria)
    SubcategoriaById(
        @Arg("id", () => Int) id: number
    ) {
        return Subcategoria.findOne(
            {
                where: {
                    id
                }
            }
        );
    }
}