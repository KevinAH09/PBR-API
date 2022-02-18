import { Arg, Authorized, Field, InputType, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { Int } from "type-graphql";
import { isAuthenticated } from "../middleware/is-authenticated";

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

    @Authorized([RolesTypes.ADMIN])
    @UseMiddleware(isAuthenticated)
    @Mutation(() => Categoria)
    async createCategoria(
        @Arg("data", () => CategoriaInput) data: CategoriaInput
    ) {
        await Categoria.insert(
            data
        );
        return await data;
    }

    @Authorized([RolesTypes.ADMIN])
    @UseMiddleware(isAuthenticated)
    @Mutation(() => Categoria)
    async updateCategoria(
        @Arg("id", () => Int) id: number,
        @Arg("data", () => CategoriaInput) data: CategoriaInput
    ) {
        await Categoria.update({ id }, data);
        const dataUpdated = await Categoria.findOne(id)
        return dataUpdated;
    }

    @Authorized([RolesTypes.ADMIN])
    @UseMiddleware(isAuthenticated)
    @Mutation(() => Boolean)
    async deleteCategoria(
        @Arg("id", () => Int) id: number
    ) {
        await Categoria.delete(id);
        return true;
    }

    @Authorized([RolesTypes.ADMIN, RolesTypes.AGENTE, RolesTypes.CENSADOR, RolesTypes.VALIDADOR])
    @UseMiddleware(isAuthenticated)
    @Query(() => [Categoria])
    Categorias() {
        return Categoria.find()
    }

    @Authorized([RolesTypes.ADMIN, RolesTypes.AGENTE, RolesTypes.CENSADOR, RolesTypes.VALIDADOR])
    @UseMiddleware(isAuthenticated)
    @Query(() => Categoria)
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