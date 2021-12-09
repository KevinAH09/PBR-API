import { Arg, Authorized, Field, ID, InputType, Int, Mutation, Query, Resolver } from "type-graphql";
import { Construccion } from "../entities/construccion";
import { Propiedad } from "../entities/propiedad";
import { TipoConstruccion } from "../entities/tipo-construccion";

// import { RolesTypes } from "../enums/role-types.enum";

@InputType()
class ConstruccionInput {


    @Field(type =>Int)
    tipoConstruccion!: TipoConstruccion[];

    @Field(type =>Int)
    propiedad!: Propiedad[];

    @Field()
    metroCuadrado!: string;

    @Field()
    descripcion!: string;

    @Field()
    bano!: string;

    @Field()
    sala!: string;

    @Field()
    planta!: string;

    @Field()
    cocina!: string;

    @Field()
    dormitorio!: string;

    @Field()
    material!: string;

    @Field()
    garage!: string;
   
}

@Resolver()
export class ConstruccionResolver {
    @Authorized()
    @Mutation(() => Construccion)
    async createConstruccion(
        @Arg("data", () => ConstruccionInput) data: ConstruccionInput
    ) {
        const newData = Construccion.create(data);
        return await newData.save();
    }

    @Authorized()
    @Mutation(() => Construccion)
    async updateConstruccion(
        @Arg("id", () => Int) id: number,
        @Arg("data", () => ConstruccionInput) data: ConstruccionInput
    ) {
        await Construccion.update({ id }, data);
        const dataUpdated = await Construccion.findOne(id)
        return dataUpdated;
    }

    // @Authorized(RolesTypes.ADMIN)
    // @Mutation(() => Boolean)
    // async deleteTipoServicio(
    //     @Arg("id", () => Int) id: number
    // ) {
    //     await TipoServicio.delete(id);
    //     return true;
    // }

    @Query(() => Construccion)
    Construccion() {
        return Construccion.find()
    }
    

    @Query(() => Construccion)
    ConstruccionById(
        @Arg("id", () => Int) id: number
    ) {
        return Construccion.findOne(
            {
                where: {
                    id
                }
            }
        );
    }
}