
import { AuthChecker } from "type-graphql"
import { Context } from "../interfaces/context.interface";
import { verify } from "jsonwebtoken";
import enviroment from "../config/enviroments.config";
import { Usuario } from "../entities/usuario";
export const isAuthorizated: AuthChecker<Context> = ({ context }, roles) => {

    const authorization = context.req.headers["authorization"];

    if (!authorization) {
        throw new Error("Not authenticated");
    }
    if (authorization.indexOf("bearer ", 0) < 0) {
        throw new Error("Not authenticated");
    }
    try {
        const token = authorization.replace("bearer ", "");
        const payload = verify(token, enviroment.jwtSecretKey ?? '');
        context.usuario = payload as Usuario;
    } catch (err) {
        console.log(err);
        throw new Error("Not authenticated");
    }

    const userContext = context.usuario;
    const userString =JSON.stringify(userContext);
    const user=JSON.parse(userString);
    const rol=user.usuario.role;

    if (roles.length === 0) {
        // if `@Authorized()`, check only if user exists
        return user !== undefined;
    }
    // there are some roles defined now

    if (!user) {
        // and if no user, restrict access
        return false;
    }
    if (roles.includes(rol)) {
        // grant access if the roles overlap
        return true;
    }
    // no roles matched, restrict access
    return false;
};