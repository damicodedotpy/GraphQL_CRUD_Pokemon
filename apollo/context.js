// ****************************JAVASCRIPT LIBRARIES******************************

// *****************************EXTERNAL LIBRARIES*******************************
const jsonwebtoken = require( 'jsonwebtoken' );
require( 'dotenv' ).config();
// ********************************OWN LIBRARIES*********************************
const Trainer = require( '../models/trainer' );
// ******************************************************************************
module.exports = async ( { req } ) => {
    // Get token from request headers
    const token = req.headers.authorization || '';
    // Initialize trainerInfo variable
    let trainerInfo = null; 

    // Verify if token is present
    if ( token ) {
        try {
            // Decode token
            const data = await jsonwebtoken.verify( token, process.env.SECRET_KEY );
    
            // Throw error if token is not valid or has not been passed
            if( !data ) throw new Error( 'INVALID_TOKEN' );
    
            // Get trainer from database using id from token
            trainerInfo = await Trainer.findById( data.id );
    
            // Throw error if trainer was not found
            if( trainerInfo == null ) throw new Error( 'USER_NOT_FOUND' );

            // Return token and trainer info
            return { token, trainerInfo }
    
        } catch (error) {
            // Stantar error message
            let errorMessage =  new Error( `There was an error trying to get the token: ${error}` );
    
            // Error message: token not present
            if ( error.message === "INVALID_TOKEN" ) errorMessage = "The token has not been passed";
    
            // Error message: user not found
            if ( error.message === "USER_NOT_FOUND" ) errorMessage = "The user was not found in the database";
    
            // Throw error
            throw errorMessage;
        }
    }

    // Return token and trainer info
    return { token, trainerInfo }
}

