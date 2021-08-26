import { type } from "os";
import { Arg, Authorized, Field, ID, InputType, Int, Mutation, Query, Resolver } from "type-graphql";
import { Localizacion } from "../entities/localizacion";
import { Propiedad } from "../entities/propiedad";
import { Usuario } from "../entities/usuario";
import { RolesTypes } from "../enums/role-types.enum";

@InputType()
class PropiedadInput {

    @Field()
    numero!: string;
    
    @Field() 
    descripcion!: string;

    @Field(type =>ID)
    usuario!: Usuario[];

    @Field(type =>ID)
    localizacion!: Localizacion[];
}

@Resolver()
export class PropiedadResolver {
    @Authorized(RolesTypes.ADMIN)
    @Mutation(() => Propiedad)
    async createPropiedad(
        @Arg("data", () => PropiedadInput) data: PropiedadInput
    ) {
        const newData = Propiedad.create(data);
        return await newData.save();
    }

    @Authorized(RolesTypes.ADMIN)
    @Mutation(() => Propiedad)
    async updatePropiedad(
        @Arg("id", () => Int) id: number,
        @Arg("data", () => PropiedadInput) data: PropiedadInput
    ) {
        await Propiedad.update({ id }, data);
        const dataUpdated = await Propiedad.findOne(id)
        return dataUpdated;
    }


    @Query(() => [Propiedad])
    Propiedad() {
        return Propiedad.find()
    }

    @Query(() => [Propiedad])
    PropiedadById(
        @Arg("id", () => Int) id: number
    ) {
        return Propiedad.findOne(
            {
                where: {
                    id
                }
            }
        );
    }
}