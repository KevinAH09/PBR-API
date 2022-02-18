import { Arg, Authorized, Field, ID, InputType, Int, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { getConnection } from "typeorm";
import { Propiedad } from "../entities/propiedad";
import { TipoBeneficio } from "../entities/tipo-beneficio";
import { TipoBeneficioPropiedad } from "../entities/tipo-beneficio-propiedad";
import { RolesTypes } from "../enums/role-types.enum";
import { isAuthenticated } from "../middleware/is-authenticated";

@InputType()
class TipoBeneficioPropiedadInput {


    @Field(type => Int)
    tipobeneficio!: TipoBeneficio[];

    @Field(type => Int)
    propiedad!: Propiedad[];
}

@Resolver()
export class TipoBeneficioPropiedadResolver {

    @Authorized([RolesTypes.ADMIN, RolesTypes.CENSADOR, RolesTypes.VALIDADOR])
    @UseMiddleware(isAuthenticated)
    @Mutation(() => TipoBeneficioPropiedad)
    async createTipo_Beneficio_Propiedad(
        @Arg("data", () => TipoBeneficioPropiedadInput) data: TipoBeneficioPropiedadInput
    ) {
        await TipoBeneficioPropiedad.insert(
            data
        );
        return await data;
    }

    @Authorized([RolesTypes.ADMIN, RolesTypes.CENSADOR, RolesTypes.VALIDADOR])
    @UseMiddleware(isAuthenticated)
    @Mutation(() => Boolean)
    async delete_Beneficio_Propiedad(
        @Arg("tipobeneficioId", () => Int) tipobeneficioId: number,
        @Arg("propiedadId", () => Int) propiedadId: number
    ) {
        await getConnection()
            .getRepository(TipoBeneficioPropiedad)
            .createQueryBuilder('tipo')
            .leftJoinAndSelect("tipo.propiedad", "propiedad")
            .leftJoinAndSelect("tipo.tipobeneficio", "tipobeneficio")
            .delete()
            .where("tipobeneficio.id = :tipobeneficioId", { tipobeneficioId })
            .andWhere("propiedad.id = :propiedadId", { propiedadId })
            .execute();
        return true;

    }


    @Authorized([RolesTypes.ADMIN, RolesTypes.AGENTE, RolesTypes.CENSADOR, RolesTypes.VALIDADOR])
    @UseMiddleware(isAuthenticated)
    @Query(() => [TipoBeneficioPropiedad])
    TipoBeneficioPropiedad() {
        return TipoBeneficioPropiedad.find()
    }

    @Authorized([RolesTypes.ADMIN, RolesTypes.AGENTE, RolesTypes.CENSADOR, RolesTypes.VALIDADOR])
    @UseMiddleware(isAuthenticated)
    @Query(() => [TipoBeneficioPropiedad])
    async TipoBeneficioByPropiedadId(
        @Arg("id", () => Int) id: number
    ) {
        let tipoBeneficio = await getConnection().
            getRepository(TipoBeneficioPropiedad).
            createQueryBuilder("tipo_beneficio_propiedad").
            innerJoinAndSelect("tipo_beneficio_propiedad.tipobeneficio", "tipo_beneficio")
            .where("tipo_beneficio_propiedad.propiedadId = :id")
        tipoBeneficio = tipoBeneficio.setParameters({ id: id })

        return tipoBeneficio.getMany();

    }
}