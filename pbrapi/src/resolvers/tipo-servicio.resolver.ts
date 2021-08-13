import { Arg, Authorized, Field, InputType, Mutation, Query, Resolver } from "type-graphql";
import { Int } from "type-graphql";

import { TipoServicio } from "../entities/tipo-servicio";
import { RolesTypes } from "../enums/role-types.enum";

@InputType()
class TipoServicioInput {
    @Field()
    nombre!: string
    
}

@Resolver()
export class TipoServicioResolver {
    @Authorized()
    @Mutation(() => TipoServicio)
    async createTipoServicio(
        @Arg("data", () => TipoServicioInput) data: TipoServicioInput
    ) {
        const newData = TipoServicio.create(data);
        return await newData.save();
    }

    @Authorized()
    @Mutation(() => TipoServicio)
    async updateTipoServicio(
        @Arg("id", () => Int) id: number,
        @Arg("data", () => TipoServicioInput) data: TipoServicioInput
    ) {
        await TipoServicio.update({ id }, data);
        const dataUpdated = await TipoServicio.findOne(id)
        return dataUpdated;
    }

    @Authorized(RolesTypes.ADMIN)
    @Mutation(() => Boolean)
    async deleteTipoServicio(
        @Arg("id", () => Int) id: number
    ) {
        await TipoServicio.delete(id);
        return true;
    }

    @Query(() => [TipoServicio])
    TipoServicios() {
        return TipoServicio.find()
    }

    @Query(() => [TipoServicio])
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
}