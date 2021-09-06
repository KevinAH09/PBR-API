import { Arg, Authorized, Field, InputType, Int, Mutation, Query, Resolver } from "type-graphql";
import { BitacoraSistema } from "../entities/bitacora-sistema";
import { Usuario } from "../entities/usuario";
import { RolesTypes } from "../enums/role-types.enum";


@InputType()
class BitacoraSistemaInput {
    @Field()
    id!:number;
   
    @Field()
    accion!:string;


    // @Field(()=>Usuario)
    // usuario!:Usuario


}

@Resolver()
export class BitacoraSistemaResolver {
    @Authorized()
    @Mutation(() => BitacoraSistema)
    async createBitacoraSistema(
        @Arg("data", () => BitacoraSistemaInput) data: BitacoraSistemaInput
    ) {
        const newData = BitacoraSistema.create(data);
        return await newData.save();
    }


    @Query(() => BitacoraSistema)
    BitacoraSistemas() {
        return BitacoraSistema.find()
    }

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