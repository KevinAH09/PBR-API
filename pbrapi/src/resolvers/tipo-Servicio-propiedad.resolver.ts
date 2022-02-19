import { Arg, Authorized, Field, ID, InputType, Int, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { getConnection } from "typeorm";
import { Propiedad } from "../entities/propiedad";
import { TipoBeneficio } from "../entities/tipo-beneficio";
import { TipoServicio } from "../entities/tipo-servicio";
import { TipoServicioPropiedad } from "../entities/tipo_servicio_propiedad";
import { RolesTypes } from "../enums/role-types.enum";
import { isAuthenticated } from "../middleware/is-authenticated";

@InputType()
class TipoServicioPropiedadInput {


    @Field(type => Int)
    tiposervicio!: TipoServicio[];

    @Field(type => Int)
    propiedad!: Propiedad[];
}

@Resolver()
export class TipoServicioPropiedadResolver {
    
    @Authorized([RolesTypes.ADMIN, RolesTypes.CENSADOR, RolesTypes.VALIDADOR])
    @UseMiddleware(isAuthenticated)
    @Mutation(() => TipoServicioPropiedad)
    async createTipo_Servicio_Propiedad(
        @Arg("data", () => TipoServicioPropiedadInput) data: TipoServicioPropiedadInput
    ) {
        await TipoServicioPropiedad.insert(
            data
        );
        return await data;
    }

    @Authorized([RolesTypes.ADMIN, RolesTypes.AGENTE, RolesTypes.CENSADOR, RolesTypes.VALIDADOR])
    @UseMiddleware(isAuthenticated)
    @Query(() => [TipoServicioPropiedad])
    async TipoServicioByPropiedadId(
        @Arg("id", () => Int) id: number
    ) {
        let tipoServicio = await getConnection().
        getRepository(TipoServicioPropiedad).
        createQueryBuilder("tipo_servicio_propiedad").
        innerJoinAndSelect("tipo_servicio_propiedad.tiposervicio","tipo_servicio")
        .where("tipo_servicio_propiedad.propiedadId = :id")
        tipoServicio = tipoServicio.setParameters({ id: id})

        return tipoServicio.getMany();
        
    }

    @Authorized([RolesTypes.ADMIN, RolesTypes.CENSADOR, RolesTypes.VALIDADOR])
    @UseMiddleware(isAuthenticated)
    @Mutation(() => Boolean)
    async delete_Servicio_Propiedad(
        @Arg("tiposervicio", () => Int) tiposervicio: number,
        @Arg("propiedad", () => Int) propiedad: number
    ) {
        await getConnection()
            .getRepository(TipoServicioPropiedad)
            .createQueryBuilder('tipo')
            .leftJoinAndSelect("tipo.propiedad", "propiedad")
            .leftJoinAndSelect("tipo.tiposervicio", "tiposervicio")
            .delete()
            .where("tiposervicio.id = :tiposervicio", { tiposervicio })
            .andWhere("propiedad.id = :propiedad", { propiedad })
            .execute();
        return true;

    }
}