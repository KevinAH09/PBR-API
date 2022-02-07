import { Arg, Authorized, Field, InputType, Int, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { Localizacion } from "../entities/localizacion";
import { RolesTypes } from "../enums/role-types.enum";
import { isAuthenticated } from "../middleware/is-authenticated";


@InputType()
class LocalizacionInput {
    @Field(() => String)
    pais!: string;

    @Field(() => String)
    divPrimaria!: string;

    @Field(() => String)
    divSecundaria!: string;

    @Field(() => String)
    divTerciaria!: string;

    @Field(() => String)
    divCuaternaria!: string;

    @Field(() => String)
    direccion!: string;

    @Field(() => String)
    geolocalizacion!: string;

    @Field(() => Number)
    latitud!: Number;

    @Field(() => Number)
    longitud!: Number;
}

@Resolver()
export class LocalizacionResolver {

    @Authorized([RolesTypes.ADMIN])
    @UseMiddleware(isAuthenticated)
    @Mutation(() => Localizacion)
    async createLocalizacion(
        @Arg("data", () => LocalizacionInput) data: LocalizacionInput
    ): Promise<LocalizacionInput> {
        await Localizacion.insert(
            data
        );
        return await data;
    }

    @Authorized([RolesTypes.ADMIN])
    @UseMiddleware(isAuthenticated)
    @Mutation(() => Localizacion)
    async updateLocalizacion(
        @Arg("id", () => Int) id: number,
        @Arg("data", () => LocalizacionInput) data: LocalizacionInput
    ) {
        await Localizacion.update({ id }, data);
        const dataUpdated = await Localizacion.findOne(id)
        return dataUpdated;
    }

    @Authorized([RolesTypes.ADMIN])
    @UseMiddleware(isAuthenticated)
    @Mutation(() => Boolean)
    async deleteLocalizacion(
        @Arg("id", () => Int) id: number
    ) {
        await Localizacion.delete(id);
        return true;
    }

    @Authorized([RolesTypes.ADMIN])
    @UseMiddleware(isAuthenticated)
    @Query(() => Localizacion)
    Localizacions() {
        return Localizacion.find()
    }

    @Authorized([RolesTypes.ADMIN])
    @UseMiddleware(isAuthenticated)
    @Query(() => Localizacion)
    LocalizacionById(
        @Arg("id", () => Int) id: number
    ) {
        return Localizacion.findOne(
            {
                where: {
                    id
                }
            }
        );
    }
}