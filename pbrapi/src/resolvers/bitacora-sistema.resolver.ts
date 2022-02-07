import { Arg, Authorized, Field, InputType, Int, Mutation, Query, Resolver } from "type-graphql";
import { BitacoraSistema } from "../entities/bitacora-sistema";
import { Usuario } from "../entities/usuario";
import { RolesTypes } from "../enums/role-types.enum";


@InputType()
class BitacoraSistemaInput {

    @Field({ nullable: false })
    accion!: string;

    @Field(type => Int)
    usuario!: Usuario[];

}

@Resolver()
export class BitacoraSistemaResolver {
    @Authorized()
    @Mutation(() => BitacoraSistema)
    async createBitacoraSistema(
        @Arg("data", () => BitacoraSistemaInput) data: BitacoraSistemaInput
    ) {
        await BitacoraSistema.insert(
            data
        );
        return await data;
    }


    @Authorized()
    @Query(() => [BitacoraSistema])
    BitacoraSistemas() {
        return BitacoraSistema.find({
            relations: ["usuario"]
        })
    }

    @Authorized()
    @Query(() => BitacoraSistema)
    BitacoraSistemaById(
        @Arg("id", () => Int) id: number
    ) {
        return BitacoraSistema.findOne(
            {
                where: {
                    id
                }
            }
        );
    }
}