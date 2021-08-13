import { Arg, Authorized, Field, InputType, Int, Mutation, Query, Resolver } from "type-graphql";
import { Localizacion } from "../entities/localizacion";
import { RolesTypes } from "../enums/role-types.enum";


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
}

@Resolver()
export class LocalizacionResolver {
    @Authorized()
    @Mutation(() => Localizacion)
    async createLocalizacion(
        @Arg("data", () => LocalizacionInput) data: LocalizacionInput
    ) {
        const newData = Localizacion.create(data);
        return await newData.save();
    }

    @Authorized()
    @Mutation(() => Localizacion)
    async updateLocalizacion(
        @Arg("id", () => Int) id: number,
        @Arg("data", () => LocalizacionInput) data: LocalizacionInput
    ) {
        await Localizacion.update({ id }, data);
        const dataUpdated = await Localizacion.findOne(id)
        return dataUpdated;
    }

    @Authorized(RolesTypes.ADMIN)
    @Mutation(() => Boolean)
    async deleteLocalizacion(
        @Arg("id", () => Int) id: number
    ) {
        await Localizacion.delete(id);
        return true;
    }

    @Query(() => [Localizacion])
    Localizacions() {
        return Localizacion.find()
    }

    @Query(() => [Localizacion])
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