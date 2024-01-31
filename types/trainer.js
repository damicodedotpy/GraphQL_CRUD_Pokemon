// ****************************JAVASCRIPT LIBRARIES******************************

// *****************************EXTERNAL LIBRARIES*******************************

// ********************************OWN LIBRARIES*********************************

// ******************************************************************************
module.exports = `
    type Trainer {
        id: ID!
        email: String!
        password: String
        name: String!
        genre: String
        type: String
        badges: Int
        pokemons: [Pokemon]
        image: String
    }

    input TrainerInput {
        email: String!
        password: String!
        name: String!
        genre: String
        type: String
        badges: Int
        pokemons: [PokemonInput]
        image: String
    }

    input TrainerUpdateInput {
        email: String
        password: String
        name: String
        genre: String
        type: String
        badges: Int
        pokemons: [PokemonInput]
        image: String
    }


    extend type Query {
        trainers( params: PaginateInput ): [Trainer]
    }

    extend type Mutation {
        signup( signupInfo: TrainerInput ): Trainer
        login( email: String!, password: String! ): AuthPayload
        updateTrainer(id: ID!, updateInfo: TrainerUpdateInput ): Trainer
        deleteTrainer(id: ID!): Alert
    }
`