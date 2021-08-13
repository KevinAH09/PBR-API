import { Request, Response } from "express";
import { Usuario } from "../entities/usuario";

export interface Context {
  req: Request;
  res: Response;
  // payload?: { userId: string };
  usuario?: Usuario;
}