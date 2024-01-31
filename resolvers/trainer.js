// ****************************JAVASCRIPT LIBRARIES******************************

// *****************************EXTERNAL LIBRARIES*******************************
const jwt = require( 'jsonwebtoken' );
const hash = require( 'bcrypt' );
require( "dotenv" ).config();
// ********************************OWN LIBRARIES*********************************
const Trainer = require( '../models/trainer' );
const Pokemon = require( '../models/pokemon' );
const context = require('../apollo/context');
// ******************************************************************************
const resolvers = {
    Query: {
        async trainers( obj, { params = {} } ) {
            try {
                // Destructuring params
                const { id = null, page = 1, limit = 5 } = params;

                // Create query conditions object
                const query = {};
    
                // If id is not null, add it to query conditions object
                if ( Boolean(id) ) query._id = id;
    
                // Create options object for pagination
                const options = {
                    page,
                    limit,
                    populate: { path: 'pokemons' }
                }
                
                // Query trainers collection
                const result = await Trainer.paginate(query, options);
    
                // Return trainers)
                return result.docs;

            } catch (error) {
                throw new Error(`There was an error trying to query the trainers collection: ${error}`);
            }
        }
    },
    Mutation: {
        signup( obj, { signupInfo } ) {
            try {
                // Create new trainer
                const newTrainer = new Trainer( signupInfo );

                // Validate password with the virtual property function
                newTrainer.virtualPassword = signupInfo.password;

                // Validate email with the virtual property function
                newTrainer.virtualEmail = signupInfo.email;

                // Save new trainer
                newTrainer.save();

                // Return new trainer
                return newTrainer;
            } catch ( error ) {
                // Throw error if there is the password is not valid
                if(error.message === "INVALID_PASSWORD") throw "Password must have at least 8 characters, 1 lowercase, 1 uppercase, 1 number and 1 symbol"
                
                // Throw error if there is the email is not valid
                if(error.message === "INVALID_EMAIL") throw "Email has not valid structure"
                
                // Throw error if there is the email already exists
                if(error.code === 11000) throw "Email already exists";
            }
        },
        async login( obj, { email, password } ) {
            try {
                // Validate if email and password were provided
                if ( !email || !password ) throw "Email and password are required";

                // Find trainer by email
                const trainer = await Trainer.findOne( { email: email } );

                // Throw error if trainer was not found
                if ( !trainer ) throw "There was an error trying to find the trainer";

                // Validate password with the virtual property function
                if ( !await hash.compareSync( password, trainer.password ) ) throw "There was an error trying to veryfy the password";

                // Create payload for token
                const payload = {
                    id: trainer._id,
                    name: trainer.name,
                    email: trainer.email,
                    password: trainer.password,
                };

                // Create token
                const token = jwt.sign( payload, process.env.SECRET_KEY );

                // Return token and trainer
                return { token, trainer };

            } catch (error) {
                // Throw error if there is the password is not valid
                throw new Error(`There was an error trying to login: ${error}`);
            }
        },
        async updateTrainer( obj, { id, updateInfo }, context ) {
            try {
                if ( !context || !context.trainerInfo ) throw new Error( "You must be logged in to update a trainer" );

                let trainer = await Trainer.findByIdAndUpdate( { _id: id }, updateInfo, { new: true } );

                if( updateInfo.email) trainer.virtualEmail = updateInfo.email;

                if( updateInfo.password ) trainer.virtualPassword = updateInfo.password;

                await trainer.save();

                return trainer;

            } catch (error) {
                throw new Error( `There was an error trying to update the trainer: ${error}` );
            }
        },
        async deleteTrainer( obj, { id }, context ) {
            try {
                // Validate if context and trainerInfo exists
                if ( !context || !context.trainerInfo ) throw new Error( "CONTEXT_ERROR" );

                // Get trainer by id and delete it
                const trainer = await Trainer.findByIdAndDelete( { _id: id } );
                
                // Iterate over trainer pokemons and set trainer field to empty string
                trainer.pokemons.forEach( async ( pokemonID ) => {
                    const pokemon = await Pokemon.findByIdAndUpdate( { _id: pokemonID }, { trainer: ""} );
                    pokemon.save();
                } );
                
                // Return success message
                return { message: "Trainer deleted successfully" };

            } catch (error) {
                // Throw error if there is any error
                throw new Error( `There was an error trying to delete the trainer: ${error}` );
            }
        }
    }
}

module.exports = resolvers;