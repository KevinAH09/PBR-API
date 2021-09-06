import { type } from "os";
import { Arg, Authorized, Field, ID, InputType, Int, Mutation, Query, Resolver } from "type-graphql";
import { Categoria } from "../entities/categoria";
import { Localizacion } from "../entities/localizacion";
import { Precio } from "../entities/precio";
import { Propiedad } from "../entities/propiedad";
import { Usuario } from "../entities/usuario";
import { RolesTypes } from "../enums/role-types.enum";

@InputType()
class PropiedadInput {
    @Field({ nullable: true })
    numero!: string;

    @Field({ nullable: true })
    descripcion!: string;

    @Field({ nullable: true })
    extension!: string;

    @Field(type =>ID,{ nullable: true })
    usuario!: Usuario[];

    @Field(type =>ID,{ nullable: true })
    localizacion!: Localizacion[];

    @Field(type => ID,{ nullable: true })
    categoria!: Categoria[];

    @Field(type => ID,{ nullable: true })
    precios!: Precio[];
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


    @Query(() => Propiedad)
    Propiedad() {
        return Propiedad.find()
    }

    @Query(() => Propiedad)
    PropiedadById(
        @Arg("id", () => Int) id: number
    ) {
        return Propiedad.findOne(
            {
                where: {
                    id
                },
                relations:["usuario","localizacion","categoria","fotos","precios"],
       
            }
        );
    }
}