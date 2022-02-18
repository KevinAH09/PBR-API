import { compare, hash } from "bcryptjs";
import { sign } from "jsonwebtoken";
import {
    Arg, Authorized, Ctx, Field, InputType, Int, Mutation, ObjectType, Query, Resolver, UseMiddleware
} from "type-graphql";
import { Like } from "typeorm";
import enviroment from "../config/enviroments.config";
import { Usuario } from "../entities/usuario";
import { EntityStates } from "../enums/entity-states.enum";
import { RolesTypes } from "../enums/role-types.enum";
import { Context } from "../interfaces/context.interface";
import { isAuthenticated } from "../middleware/is-authenticated";
import { getConnection } from "typeorm";



@ObjectType()
class LoginResponse {
    @Field()
    accessToken?: string;

    @Field()
    id?: Number;

    @Field()
    estado?: EntityStates;

    @Field()
    nombre!: string;

    @Field()
    telefono!: string;

    @Field()
    email!: string;

    @Field(type => RolesTypes)
    role!: RolesTypes;

    @Field()
    imagen!: string;

}

@InputType({ description: "Register user information" })
class UsuarioInput {
    @Field({ nullable: true })
    nombre!: string;

    @Field({ nullable: true })
    password!: string;

    @Field({ nullable: true })
    email!: string;

    @Field({ nullable: true })
    telefono!: string;

    @Field({ nullable: true })
    imagen!: string;

    @Field(type => RolesTypes)
    role!: RolesTypes;

    @Field(type => EntityStates)
    estado!: EntityStates;
}
@InputType({ description: "Editable user information" })
class UsuarioInput2 {
    @Field({ nullable: true })
    nombre!: string;

    @Field({ nullable: true })
    email!: string;

    @Field({ nullable: true })
    telefono!: string;

    @Field(type => RolesTypes)
    role!: RolesTypes;
}
@InputType({ description: "Editable user password" })
class UsuarioInput3 {
    @Field({ nullable: true })
    password!: string;
}
@InputType({ description: "Editable user foto" })
class UsuarioInput4 {
    @Field({ nullable: true })
    imagen!: string;
}
@InputType({ description: "Editable estado usuario" })
class UsuarioInput5 {
    @Field(type => EntityStates)
    estado!: EntityStates;
}


@Resolver()
export class UsuarioResolver {

    @Authorized([RolesTypes.ADMIN])
    @UseMiddleware(isAuthenticated)
    @Query(() => [Usuario])
    async users() {
        return Usuario.find();
    }

    @Authorized([RolesTypes.ADMIN,RolesTypes.AGENTE, RolesTypes.CENSADOR, RolesTypes.VALIDADOR])
    @UseMiddleware(isAuthenticated)
    @Query(() => Usuario)
    async UsuarioById(@Arg("id", () => Int) id: number) {
        return Usuario.findOne({ where: { id } });
    }

    @Authorized([RolesTypes.ADMIN, RolesTypes.AGENTE, RolesTypes.CENSADOR, RolesTypes.VALIDADOR])
    @UseMiddleware(isAuthenticated)
    @Mutation(() => Usuario)
    async updateUser(
        @Arg("id", () => Int) id: number,
        @Arg("data", () => UsuarioInput2) data: UsuarioInput2
    ) {
        await Usuario.update({ id }, data);
        const dataUpdated = await Usuario.findOne(id);
        return dataUpdated;
    }

    @Authorized([RolesTypes.ADMIN, RolesTypes.AGENTE,  RolesTypes.CENSADOR, RolesTypes.VALIDADOR])
    @UseMiddleware(isAuthenticated)
    @Mutation(() => Usuario)
    async updatePhoto(
        @Arg("id", () => Int) id: number,
        @Arg("data", () => UsuarioInput4) data: UsuarioInput4
    ) {
        await Usuario.update({ id }, data);
        const dataUpdated = await Usuario.findOne(id);
        return dataUpdated;
    }

    @Authorized([RolesTypes.ADMIN])
    @UseMiddleware(isAuthenticated)
    @Mutation(() => [Usuario])
    async updateState(
        @Arg("id", () => Int) id: number,
        @Arg("data", () => UsuarioInput5) data: UsuarioInput5
    ) {
        await Usuario.update({ id }, data);
        const dataUpdated = await Usuario.find();
        return dataUpdated;
    }

    @Authorized([RolesTypes.ADMIN, RolesTypes.AGENTE, RolesTypes.CENSADOR, RolesTypes.VALIDADOR])
    @UseMiddleware(isAuthenticated)
    @Mutation(() => Usuario)
    async updatePassword(
        @Arg("id", () => Int) id: number,
        @Arg("data", () => UsuarioInput3) data: UsuarioInput3
    ) {
        const hashedPassword = await hash(data.password, 13);
        data.password = hashedPassword;
        await Usuario.update({ id }, data);
        const dataUpdated = await Usuario.findOne(id);
        return dataUpdated;
    }

    @Authorized([RolesTypes.ADMIN])
    @UseMiddleware(isAuthenticated)
    @Mutation(() => Boolean)
    async Register(
        @Arg("data", () => UsuarioInput) data: UsuarioInput
    ) {
        const hashedPassword = await hash(data.password, 13);

        try {
            data.password = hashedPassword;
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
                expiresIn: "8h"
            }),
            id: usuario.id,
            estado: usuario.estado,
            nombre: usuario.nombre,
            email: usuario.email,
            telefono: usuario.telefono,
            imagen: usuario.imagen,
            role: usuario.role

        };
    }

    @Authorized([RolesTypes.ADMIN])
    @UseMiddleware(isAuthenticated)
    @Query(() => [Usuario])
    async UsuarioByName(@Arg("nombre", () => String) nombre: String) {
        let usuario = await getConnection()
            .getRepository(Usuario)
            .createQueryBuilder('u')
            .select(['u.id', 'u.nombre', 'u.telefono', 'u.email', 'u.estado', 'u.role'])
            .where('u.nombre like :nombre', { nombre: `%${nombre}%` })
            .getMany();
        return usuario;
    }

    @Authorized([RolesTypes.ADMIN])
    @UseMiddleware(isAuthenticated)
    @Query(() => [Usuario])
    async UsuarioByEmail(@Arg("email", () => String) email: String) {
        let usuario = await getConnection()
            .getRepository(Usuario)
            .createQueryBuilder('u')
            .select(['u.id', 'u.nombre', 'u.telefono', 'u.email', 'u.estado', 'u.role'])
            .where('u.email like :email', { email: `%${email}%` })
            .getMany();
        return usuario;
    }

    @Authorized([RolesTypes.ADMIN])
    @UseMiddleware(isAuthenticated)
    @Query(() => [Usuario])
    async UsuarioByTelephone(@Arg("telefono", () => String) telefono: String) {
        let usuario = await getConnection()
            .getRepository(Usuario)
            .createQueryBuilder('u')
            .select(['u.id', 'u.nombre', 'u.telefono', 'u.email', 'u.estado', 'u.role'])
            .where('u.telefono like :telefono', { telefono: `%${telefono}%` })
            .getMany();
        return usuario;
    }

    @Authorized([RolesTypes.ADMIN])
    @UseMiddleware(isAuthenticated)
    @Query(() => [Usuario])
    async UsuarioByState(@Arg("estado", () => String) estado: String) {
        let usuario = await getConnection()
            .getRepository(Usuario)
            .createQueryBuilder('u')
            .select(['u.id', 'u.nombre', 'u.telefono', 'u.email', 'u.estado', 'u.role'])
            .where('u.estado like :estado', { estado: `${estado}%` })
            .getMany();
        return usuario;
    }

    @Authorized([RolesTypes.ADMIN])
    @UseMiddleware(isAuthenticated)
    @Query(() => [Usuario])
    async UsuarioByRol(@Arg("role", () => String) role: String) {
        let usuario = await getConnection()
            .getRepository(Usuario)
            .createQueryBuilder('u')
            .select(['u.id', 'u.nombre', 'u.telefono', 'u.email', 'u.estado', 'u.role'])
            .where('u.role like :role', { role: `%${role}%` })
            .getMany();
        return usuario;
    }
}