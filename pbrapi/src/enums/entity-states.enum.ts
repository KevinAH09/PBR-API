import { registerEnumType } from 'type-graphql'

export enum EntityStates {
    ACTIVO = 'Activo',
    INACTIVO = 'Inactivo' 
}

registerEnumType(EntityStates, {
    name: 'EntityStates',
    description: 'States of entities information',
    valuesConfig: {
        ACTIVO: {
            description: 'Estado Activo ',
        },
        INACTIVO: {
            description: 'Estado Inactivo',
        },
    },
})