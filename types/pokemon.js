// ****************************JAVASCRIPT LIBRARIES******************************

// *****************************EXTERNAL LIBRARIES*******************************

// ********************************OWN LIBRARIES*********************************

// ******************************************************************************
// Types definition for Pokemon
module.exports = `
    type Pokemon {
        id: ID!
        name: String!
        type: String!
        gen: Int
        evolution: Boolean
        trainer: Trainer
        image: String
    }

    input PokemonInput {
        name: String!
        type: String!
        gen: Int
        evolution: Boolean
        trainer: ID!
        image: String
    }

    input PokemonUpdateInput {
        name: String
        type: String
        gen: Int
        evolution: Boolean
        trainer: ID
        image: String
    }

    type Query {
        pokemons( options: PaginateInput ): [Pokemon]
    }

    type Mutation {
        addPokemon( input: PokemonInput ): Pokemon
        updatePokemon( id: ID!, input: PokemonUpdateInput ): Pokemon
        deletePokemon( id: ID! ): Alert
    }
`