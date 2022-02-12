import { Arg, Authorized, Field, InputType, Int, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { getConnection } from "typeorm";
import { BitacoraSistema } from "../entities/bitacora-sistema";
import { Usuario } from "../entities/usuario";
import { RolesTypes } from "../enums/role-types.enum";
import { isAuthenticated } from "../middleware/is-authenticated";


@InputType()
class BitacoraSistemaInput {

    @Field({ nullable: false })
    accion!: string;

    @Field(type => Int)
    usuario!: Usuario[];

}

@Resolver()
export class BitacoraSistemaResolver {

    @Authorized([RolesTypes.ADMIN])
    @UseMiddleware(isAuthenticated)
    @Mutation(() => BitacoraSistema)
    async createBitacoraSistema(
        @Arg("data", () => BitacoraSistemaInput) data: BitacoraSistemaInput
    ) {
        await BitacoraSistema.insert(
            data
        );
        return await data;
    }


    @Authorized([RolesTypes.ADMIN])
    @UseMiddleware(isAuthenticated)
    @Query(() => [BitacoraSistema])
    BitacoraSistemas() {
        return BitacoraSistema.find({
            relations: ["usuario"]
        })
    }

    @Authorized([RolesTypes.ADMIN])
    @UseMiddleware(isAuthenticated)
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

    @Authorized([RolesTypes.ADMIN])
    @UseMiddleware(isAuthenticated)
    @Query(() => [BitacoraSistema])
    async BitacoraFecha(
        @Arg("creadoInf", () => String) creadoInf: String,
        @Arg("creadoPost", () => String) creadoPost: String,
    ) {
        let bitacora = await getConnection()
            .getRepository(BitacoraSistema)
            .createQueryBuilder('bitacora')
            .leftJoinAndSelect("bitacora.usuario", "usuario")
            .andWhere("bitacora.creado >= :creadoInf")
            .orWhere("bitacora.creado <= :creadoPost");
        bitacora = bitacora.setParameters({ creadoInf: creadoInf, creadoPost: creadoPost });
        return bitacora.getMany();
    }
}