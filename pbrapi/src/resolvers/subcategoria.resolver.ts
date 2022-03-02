import { Arg, Authorized, Field, InputType, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { Int } from "type-graphql";
import { getConnection } from "typeorm";

import { Subcategoria } from "../entities/subcategoria";
import { RolesTypes } from "../enums/role-types.enum";
import { isAuthenticated } from "../middleware/is-authenticated";

@InputType()
class SubcategoriaInput {

    @Field()
    nombre!: string

}

@Resolver()
export class SubcategoriaResolver {
    
    @Authorized([RolesTypes.ADMIN])
    @UseMiddleware(isAuthenticated)
    @Mutation(() => Subcategoria)
    async createSubcategoria(
        @Arg("data", () => SubcategoriaInput) data: SubcategoriaInput
    ) {
        await Subcategoria.insert(
            data
        );
        return await data;
    }

    @Authorized([RolesTypes.ADMIN])
    @UseMiddleware(isAuthenticated)
    @Mutation(() => Subcategoria)
    async updateSubcategoria(
        @Arg("id", () => Int) id: number,
        @Arg("data", () => SubcategoriaInput) data: SubcategoriaInput
    ) {
        await Subcategoria.update({ id }, data);
        const dataUpdated = await Subcategoria.findOne(id)
        return dataUpdated;
    }

    @Authorized([RolesTypes.ADMIN])
    @UseMiddleware(isAuthenticated)
    @Mutation(() => Boolean)
    async deleteSubcategoria(
        @Arg("id", () => Int) id: number
    ) {
        await Subcategoria.delete(id);
        return true;
    }

    @Authorized([RolesTypes.ADMIN, RolesTypes.AGENTE, RolesTypes.CENSADOR, RolesTypes.VALIDADOR])
    @UseMiddleware(isAuthenticated)
    @Query(() => [Subcategoria])
    Subcategorias() {
        return Subcategoria.find()
    }

    @Authorized([RolesTypes.ADMIN, RolesTypes.AGENTE, RolesTypes.CENSADOR, RolesTypes.VALIDADOR])
    @UseMiddleware(isAuthenticated)
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

    @Authorized([RolesTypes.ADMIN, RolesTypes.AGENTE, RolesTypes.CENSADOR, RolesTypes.VALIDADOR])
    @UseMiddleware(isAuthenticated)
    @Query(() => [Subcategoria])
    async SubCategoriaByName(@Arg("nombre", () => String) nombre: String) {
        let subcategoria = await getConnection()
            .getRepository(Subcategoria)
            .createQueryBuilder('s')
            .select(['s.id', 's.nombre', 's.creado'])
            .where('s.nombre like :nombre', { nombre: `%${nombre}%` })
            .getMany();
        return subcategoria;
    }
}