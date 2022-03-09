import { Arg, Authorized, Field, InputType, Int, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { getConnection } from "typeorm";
import { Parametro } from "../entities/parametro";
import { RolesTypes } from "../enums/role-types.enum";
import { isAuthenticated } from "../middleware/is-authenticated";


@InputType()
class ParametroInput {

    @Field()
    nombre!: string;

    @Field()
    valor!: string;


}

@Resolver()
export class ParametroResolver {

    @Authorized([RolesTypes.ADMIN, RolesTypes.AGENTE, RolesTypes.CENSADOR, RolesTypes.VALIDADOR])
    @UseMiddleware(isAuthenticated)
    @Mutation(() => Parametro)
    async createParametro(
        @Arg("data", () => ParametroInput) data: ParametroInput
    ) {
        await Parametro.insert(
            data
        );
        return await data;
    }

    @Authorized([RolesTypes.ADMIN])
    @UseMiddleware(isAuthenticated)
    @Mutation(() => Parametro)
    async updateParametro(
        @Arg("id", () => Int) id: number,
        @Arg("data", () => ParametroInput) data: ParametroInput
    ) {
        await Parametro.update({ id }, data);
        const dataUpdated = await Parametro.findOne(id)
        return dataUpdated;
    }

    @Authorized([RolesTypes.ADMIN, RolesTypes.CENSADOR, RolesTypes.VALIDADOR, RolesTypes.AGENTE])
    @UseMiddleware(isAuthenticated)
    @Query(() => [Parametro])
    Parametros() {
        return Parametro.find()
    }

    @Authorized([RolesTypes.ADMIN, RolesTypes.CENSADOR, RolesTypes.VALIDADOR, RolesTypes.AGENTE])
    @UseMiddleware(isAuthenticated)
    @Query(() => Parametro)
    ParametroById(
        @Arg("id", () => Int) id: number
    ) {
        return Parametro.findOne(
            {
                where: {
                    id
                }
            }
        );
    }

    @Authorized([RolesTypes.ADMIN, RolesTypes.CENSADOR, RolesTypes.VALIDADOR, RolesTypes.AGENTE])
    @UseMiddleware(isAuthenticated)
    @Query(() => Parametro)
    ParametroByNombre(
        @Arg("nombre", () => String) nombre: String
    ) {
        return Parametro.findOne(
            {
                where: {
                    nombre
                }
            }
        );
    }

    @Authorized([RolesTypes.ADMIN, RolesTypes.CENSADOR, RolesTypes.VALIDADOR, RolesTypes.AGENTE])
    @UseMiddleware(isAuthenticated)
    @Query(() => [Parametro])
    async ParametroByName(
        @Arg("nombre", () => String) nombre: String
    ) {
        let parametro = await getConnection()
            .getRepository(Parametro)
            .createQueryBuilder('c')
            .select(['c.id', 'c.nombre', 'c.valor', 'c.creado'])
            .where('c.nombre like :nombre', { nombre: `%${nombre}%` })
            .getMany();
        return parametro;
    }


}