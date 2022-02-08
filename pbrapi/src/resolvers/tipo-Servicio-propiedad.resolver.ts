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
    
    @Authorized([RolesTypes.ADMIN])
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
}