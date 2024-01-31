// ****************************JAVASCRIPT LIBRARIES******************************

// *****************************EXTERNAL LIBRARIES*******************************
const { ApolloServer } = require( "apollo-server-express" );
const { merge } = require( 'lodash' );
const express = require( 'express' );
const cors = require( 'cors' );
require( 'dotenv' ).config();
// ********************************OWN LIBRARIES*********************************
const { startApolloServer } = require( './apollo/server' );
const trainerResolvers = require( './resolvers/trainer' );
const pokemonResolvers = require( './resolvers/pokemon' );
const { connectionDB } = require( './db/connection' );
const trainerTypeDefs = require( './types/trainer' );
const pokemonTypeDefs = require( './types/pokemon' );
const basicTypeDefs = require( './types/basic' );
const context = require( './apollo/context' );
// ******************************************************************************

// Instanciate express app
const app = express();

// Connect to database
connectionDB();

// Middlewares
app.use( cors() );
app.use( express.json() );
app.use( express.urlencoded( { extended: false } ) );

// Instanciate and configure Apollo Server
const server = new ApolloServer({
    typeDefs: [ basicTypeDefs, trainerTypeDefs, pokemonTypeDefs ],
    resolvers: merge( trainerResolvers, pokemonResolvers ),
    context: context,
    introspection: true,
});

// Start Apollo Server
startApolloServer( app, server );

// Start Express Server
app.listen(process.env.PORT, () => {
    console.log( `Server running on port ${process.env.PORT}` );
});