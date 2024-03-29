import { MiddlewareFn } from "type-graphql";
import { verify } from "jsonwebtoken";
import { Context } from "../interfaces/context.interface"; 
import  enviroment   from "../config/enviroments.config";
import { Usuario } from "../entities/usuario";

export const isAuthenticated: MiddlewareFn<Context> = ({ context }, next) => {

  const authorization = context.req.headers["authorization"];

  if (!authorization) {
    throw new Error("Not authenticated");
  }
  if (authorization.indexOf("bearer ",0) < 0) {
    throw new Error("Not authenticated");
  }
  try { 
    const token = authorization.replace("bearer ",""); 
    const payload = verify(token, enviroment.jwtSecretKey ?? ''); 
    context.usuario = payload as Usuario;
  } catch (err) {
    console.log(err);
    throw new Error("Not authenticated");
  }
  return next();
};