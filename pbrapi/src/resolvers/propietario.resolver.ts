import { Arg, Authorized, Field, InputType, Mutation, Query, Resolver } from "type-graphql";
import { Int } from "type-graphql";

import { Propietario } from "../entities/propietario";
import { RolesTypes } from "../enums/role-types.enum";

@InputType()
class PropietarioInput {
    @Field()
    nombre!: string

    @Field()
    telefono!: string

    @Field()
    email!: string

}

@Resolver()
export class PropietarioResolver {
    @Authorized(RolesTypes.ADMIN)
    @Mutation(() => Propietario)
    async createPropietario(
        @Arg("data", () => PropietarioInput) data: PropietarioInput
    ) {
        const newData = Propietario.create(data);
        return await newData.save();
    }

    @Authorized(RolesTypes.ADMIN)
    @Mutation(() => Propietario)
    async updatePropietario(
        @Arg("id", () => Int) id: number,
        @Arg("data", () => PropietarioInput) data: PropietarioInput
    ) {
        await Propietario.update({ id }, data);
        const dataUpdated = await Propietario.findOne(id)
        return dataUpdated;
    }

    @Authorized(RolesTypes.ADMIN)
    @Mutation(() => Boolean)
    async deletePropietario(
        @Arg("id", () => Int) id: number
    ) {
        await Propietario.delete(id);
        return true;
    }

    @Query(() => [Propietario])
    Propietarios() {
        return Propietario.find()
    }

    @Query(() => [Propietario])
    PropietarioById(
        @Arg("id", () => Int) id: number
    ) {
        return Propietario.findOne(
            {
                where: {
                    id
                }
            }
        );
    }
}