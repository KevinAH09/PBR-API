import { Arg, Authorized, Field, InputType, Mutation, Query, Resolver } from "type-graphql";
import { Int } from "type-graphql";

import { Foto } from "../entities/foto";
import { RolesTypes } from "../enums/role-types.enum";

@InputType()
class FotoInput {
    @Field()
    tag!: string

    @Field()
    base64!: string


    
}

@Resolver()
export class FotoResolver {
    @Authorized()
    @Mutation(() => Foto)
    async createFoto(
        @Arg("data", () => FotoInput) data: FotoInput
    ) {
        const newData = Foto.create(data);
        return await newData.save();
    }

    @Authorized()
    @Mutation(() => Foto)
    async updateFoto(
        @Arg("id", () => Int) id: number,
        @Arg("data", () => FotoInput) data: FotoInput
    ) {
        await Foto.update({ id }, data);
        const dataUpdated = await Foto.findOne(id)
        return dataUpdated;
    }

    @Authorized(RolesTypes.ADMIN)
    @Mutation(() => Boolean)
    async deleteFoto(
        @Arg("id", () => Int) id: number
    ) {
        await Foto.delete(id);
        return true;
    }

    @Query(() => Foto)
    Fotos() {
        return Foto.find()
    }

    @Query(() => Foto)
    FotoById(
        @Arg("id", () => Int) id: number
    ) {
        return Foto.findOne(
            {
                where: {
                    id
                }
            }
        );
    }
}