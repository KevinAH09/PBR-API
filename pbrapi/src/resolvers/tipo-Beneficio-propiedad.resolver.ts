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

    @Authorized([RolesTypes.ADMIN])
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

    // @Authorized(RolesTypes.ADMIN)
    // @Mutation(() => Propiedad_Propietario)
    // async updatePropiedadPropietario(
    //     @Arg("id", () => Int) id: number,
    //     @Arg("data", () => PropiedadPropietarioInput) data: PropiedadPropietarioInput
    // ) {
    //     await Propiedad_Propietario.update({ id }, data);
    //     const dataUpdated = await Propiedad_Propietario.findOne(id)
    //     return dataUpdated;
    // }


    @Authorized([RolesTypes.ADMIN])
    @UseMiddleware(isAuthenticated)
    @Query(() => [TipoBeneficioPropiedad])
    TipoBeneficioPropiedad() {
        return TipoBeneficioPropiedad.find()
    }

    @Query(() => [TipoBeneficioPropiedad])
    async TipoBeneficioByPropiedadId(
        @Arg("id", () => Int) id: number
    ) {
        let tipoBeneficio = await getConnection().
        getRepository(TipoBeneficioPropiedad).
        createQueryBuilder("tipo_beneficio_propiedad").
        innerJoinAndSelect("tipo_beneficio_propiedad.tipobeneficio","tipo_beneficio")
        .where("tipo_beneficio_propiedad.propiedadId = :id")
        tipoBeneficio = tipoBeneficio.setParameters({ id: id})

        return tipoBeneficio.getMany();
        
    }
}