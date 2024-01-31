// ****************************JAVASCRIPT LIBRARIES******************************

// *****************************EXTERNAL LIBRARIES*******************************

// ********************************OWN LIBRARIES*********************************
const Pokemon = require("../models/pokemon");
const Trainer = require("../models/trainer");
// ******************************************************************************

const resolvers = {
    Query: {
        pokemons: async ( obj, { options = {} }, context ) => {
            try {
                // Verify context and trainerInfo fields
                if ( !context || !context.trainerInfo ) throw new Error( "You must be logged in to see pokemons" );
                
                // Initialize query object
                let query = {};
                
                // Destructure options object
                let { id = null, page = 1, limit = 5 } = options;

                // Fill query object with id if exists
                if ( id !== null ) query = { _id: id }

                // Pagination options + populate trainer field
                const config = {
                    page: page,
                    limit: limit,
                    populate: { path: "trainer" }
                }

                // Get pokemons from database using pagination options and populate trainer field
                const pokemons = await Pokemon.paginate( query, config );

                // Return pokemons from database with pagination
                return pokemons.docs;
            } catch (error) {
                return error
            }
        }
    },
    Mutation: {
        addPokemon: async ( obj, { input } ) => {
            try {
                // Create new pokemon object
                const newPokemon = new Pokemon( input );

                // Save new pokemon object
                await newPokemon.save();

                // Find trainer by id
                const trainer = await Trainer.findById( input.trainer );

                // If trainer not found, throw error
                if ( !trainer ) throw new Error( "Trainer not found" );

                // Push new pokemon to trainer's pokemons array
                await trainer.pokemons.push( newPokemon );

                // Save trainer
                await trainer.save();

                // Return new pokemon
                return newPokemon;
            } catch (error) {
                throw new Error( error );
            }
        },

        updatePokemon: async ( obj, { id, input } ) => {
            try {
                // Find pokemon by id and update it
                const pokemon = await Pokemon.findOneAndUpdate({ "_id": id }, input, { new: true });

                // If pokemon not found, throw error
                if ( !pokemon ) throw new Error( "Pokemon not found" );

                // Return updated pokemon
                return pokemon
                
            } catch (error) {
                // If error, throw error
                throw new Error( `Error updating pokemon: ${error}` )
            }
        }, 
        
        deletePokemon: async ( obj, { id } ) => {
            try {
                // Find pokemon by id and delete it
                const pokemon = await Pokemon.findOneAndDelete( { "_id": id } );

                // If pokemon not found, throw error
                if ( !pokemon ) throw new Error( "Pokemon not found" );

                // Return success message
                return { message: "Pokemon deleted successfully" }

            } catch (error) {
                // If error, throw error
                throw new Error( `Error deleting pokemon: ${error}` );
            }
        }
    }
};

// Export resolvers
module.exports = resolvers;