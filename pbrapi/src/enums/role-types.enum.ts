import { registerEnumType } from 'type-graphql'

export enum RolesTypes {
    NONE = '',
    ADMIN = 'ADMIN',
    SENSADOR = 'SENSADOR',
    AGENTE = 'AGENTE',
    VALIDADOR = 'VALIDADOR',
    SCRAPPER = 'SCRAPPER',
    CLIENTE_AVANZADO= 'CLIENTE_AVANZADO',
    CLIENTE = 'CLIENTE' 

}

registerEnumType(RolesTypes, {
    name: 'RolesTypes',
    description: 'Roles types of the application',
    valuesConfig: {
        SENSADOR: {
            description: 'Sensador user role',
        },
        ADMIN: {
            description: 'Admin user role',
        },
        AGENTE:{
            description:'Agente user role'
        },
        SCRAPPER:{
            description:'Scrapper user role'
        },
        CLIENTE_AVANZADO:{
            description:'Cliente avanzado user role'
        },
        CLIENTE:{
            description:'Cliente no user role'
        },
        VALIDADOR:{
            description:'Validador user role'
        }
    },
})