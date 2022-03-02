import { Arg, Authorized, Field, InputType, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { Int } from "type-graphql";
import { getConnection } from "typeorm";

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

    @Authorized([RolesTypes.ADMIN, RolesTypes.AGENTE, RolesTypes.CENSADOR, RolesTypes.VALIDADOR])
    @UseMiddleware(isAuthenticated)
    @Query(() => [TipoServicio])
    TipoServicios() {
        return TipoServicio.find()
    }

    @Authorized([RolesTypes.ADMIN, RolesTypes.AGENTE, RolesTypes.CENSADOR, RolesTypes.VALIDADOR])
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
    @Authorized([RolesTypes.ADMIN, RolesTypes.AGENTE, RolesTypes.CENSADOR, RolesTypes.VALIDADOR])
    @UseMiddleware(isAuthenticated)
    @Query(() => [TipoServicio])
    async TipoServicioByName(@Arg("nombre", () => String) nombre: String) {
        let tipoServicio = await getConnection()
            .getRepository(TipoServicio)
            .createQueryBuilder('t')
            .select(['t.id', 't.nombre', 't.creado'])
            .where('t.nombre like :nombre', { nombre: `%${nombre}%` })
            .getMany();
        return tipoServicio;
    }
}