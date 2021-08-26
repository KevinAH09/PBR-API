import { compare, hash } from "bcryptjs";
import { sign } from "jsonwebtoken";
import {Arg, Authorized, Ctx, Field, InputType, Int, Mutation,ObjectType, Query, Resolver, UseMiddleware
} from "type-graphql";
import enviroment from "../config/enviroments.config";
import { Usuario } from "../entities/usuario";
import { RolesTypes } from "../enums/role-types.enum";
import { Context } from "../interfaces/context.interface";
import { isAuthenticated } from "../middleware/is-authenticated";



@ObjectType()
class LoginResponse {
    @Field()
    accessToken?: string;
    @Field()
    id?: Number;

}

@InputType({ description: "Editable user information" })
class UsuarioInput {
    @Field({ nullable: true })
    nombre!: string;

    @Field({ nullable: true })
    password!: string;

    @Field({ nullable: true })
    email!: string;

    @Field({ nullable: true })
    telefono!: string;

    @Field(type => RolesTypes)
    role!: RolesTypes;
}


@Resolver()
export class UsuarioResolver {

    @Query(() => [Usuario])
    async users() {
        return Usuario.find();
    }
    
    @Query(() => Usuario)
    async UsuarioById(@Arg("id", () => Int) id: number) {
        return Usuario.findOne({where: {id}});
    }

    @Authorized("ADMIN")
    @Mutation(() => Usuario)
    async updateUser(
        @Arg("id", () => Int) id: number,
        @Arg("data", () => UsuarioInput) data: UsuarioInput
    ) {
        await Usuario.update({ id }, data);
        const dataUpdated = await Usuario.findOne(id);
        return dataUpdated;
    }

    @Query(() => String)
    @UseMiddleware(isAuthenticated)
    async Me(@Ctx() { usuario }: Context) {
        console.log(JSON.stringify(usuario));

        return `El usuario id : ${usuario!.id}`;
    }

    @Mutation(() => Boolean)
    async Register(
        @Arg("data", () => UsuarioInput) data: UsuarioInput
    ) {
        const hashedPassword = await hash(data.password, 13);

        try {
            data.password=hashedPassword;
            await Usuario.insert(
                data
            );
        } catch (err) {
            console.log(err);
            return false;
        }

        return true;
    }
    

    @Mutation(() => LoginResponse)
    async Login(@Arg("email") email: string, @Arg("password") password: string) {
        const usuario = await Usuario.findOne({ where: { email } });


        if (!usuario) {
            throw new Error("No se pudo encontrar el usuario");
        }

        const verify = await compare(password, usuario.password);

        if (!verify) {
            throw new Error("Contraseña incorrecta");
        }

        return {
            accessToken: sign({ usuario: usuario }, enviroment.jwtSecretKey, {
                expiresIn: "10h"
            }),
            id: usuario.id
        };
    }
}