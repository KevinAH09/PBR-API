import express from 'express'
import { ApolloServer } from 'apollo-server-express'

import { buildSchema } from "type-graphql"

import { TipoServicioResolver } from "./resolvers/tipo-servicio.resolver";
import { TipoBeneficioResolver } from "./resolvers/tipo-beneficio.resolver";
import { ConstruccionResolver } from "./resolvers/construccion.resolver";
import { UsuarioResolver } from './resolvers/usuario.resolver';
import { CategoriaResolver } from './resolvers/categoria.resolver';
import { SubcategoriaResolver } from './resolvers/subcategoria.resolver';
import { isAuthorizated } from "./middleware/is-authorizated";
import { FotoResolver } from './resolvers/foto.resolver';
import { PropietarioResolver } from './resolvers/propietario.resolver';
import { PropiedadResolver } from './resolvers/propiedad.resolver';
import { PrecioResolver } from './resolvers/precio.resolver';
import { BitacoraSistemaResolver } from './resolvers/bitacora-sistema.resolver';
import { LocalizacionResolver } from './resolvers/localizacion.resolver';
import { TipoConstruccionResolver } from './resolvers/tipo-construccion.resolver';



export async function startServer() {
    const app = express();
    const server = new ApolloServer({
        schema: await buildSchema({

            resolvers: [PrecioResolver, PropiedadResolver, PropietarioResolver, TipoServicioResolver, TipoBeneficioResolver, UsuarioResolver, ConstruccionResolver, CategoriaResolver, SubcategoriaResolver, FotoResolver,
                BitacoraSistemaResolver, LocalizacionResolver, TipoConstruccionResolver],
            authChecker: isAuthorizated
        }),
        context: ({ req, res }) => ({ req, res }),

    });
    server.applyMiddleware({ app, path: '/graphql' });
    return app;
}


