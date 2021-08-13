import { registerEnumType } from 'type-graphql'

export enum EntityStates {
    ACTIVE = 'Active',
    INACTIVE = 'Inactive' 
}

registerEnumType(EntityStates, {
    name: 'EntityStates',
    description: 'States of entities information',
    valuesConfig: {
        ACTIVE: {
            description: 'Active state',
        },
        INACTIVE: {
            description: 'Inactive state',
        },
    },
})