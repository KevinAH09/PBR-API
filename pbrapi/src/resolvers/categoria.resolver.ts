import { Arg, Authorized, Field, InputType, Mutation, Query, Resolver } from "type-graphql";
import { Int } from "type-graphql";

import { Categoria } from "../entities/categoria";
import { RolesTypes } from "../enums/role-types.enum";

@InputType()
class CategoriaInput {
    @Field()
    nombre!: string
    // @Field()
    // quantity!: number
}

@Resolver()
export class CategoriaResolver {
    @Authorized()
    @Mutation(() => Categoria)
    async createCategoria(
        @Arg("data", () => CategoriaInput) data: CategoriaInput
    ) {
        const newData = Categoria.create(data);
        return await newData.save();
    }

    @Authorized()
    @Mutation(() => Categoria)
    async updateCategoria(
        @Arg("id", () => Int) id: number,
        @Arg("data", () => CategoriaInput) data: CategoriaInput
    ) {
        await Categoria.update({ id }, data);
        const dataUpdated = await Categoria.findOne(id)
        return dataUpdated;
    }

    @Authorized(RolesTypes.ADMIN)
    @Mutation(() => Boolean)
    async deleteCategoria(
        @Arg("id", () => Int) id: number
    ) {
        await Categoria.delete(id);
        return true;
    }

    @Query(() => [Categoria])
    Categorias() {
        return Categoria.find()
    }

    @Query(() => [Categoria])
    CategoriaById(
        @Arg("id", () => Int) id: number
    ) {
        return Categoria.findOne(
            {
                where: {
                    id
                }
            }
        );
    }
}