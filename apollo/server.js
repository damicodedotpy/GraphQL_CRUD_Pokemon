// ****************************JAVASCRIPT LIBRARIES******************************

// *****************************EXTERNAL LIBRARIES*******************************

// ********************************OWN LIBRARIES*********************************

// ******************************************************************************
async function startApolloServer(app, server, path = `${process.env.APOLLO_SERVER_PATH}`) {
    try {
        await server.start();

        server.applyMiddleware({ app, path });

    } catch (error) {
        errorMessage = `Error starting Apollo Server: ${error}`;
        console.log(errorMessage);
        return new Error(errorMessage);
    }
}

module.exports = { startApolloServer }