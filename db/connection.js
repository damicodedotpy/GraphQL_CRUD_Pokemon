// ****************************JAVASCRIPT LIBRARIES******************************

// *****************************EXTERNAL LIBRARIES*******************************
const mongoose = require('mongoose');
require('dotenv').config();
// ********************************OWN LIBRARIES*********************************

// ******************************************************************************

// Create connection to database
function connectionDB() {
    try {
        // Connect to database
        mongoose.connect(process.env.MONGODB_URL);

        // Console confirmation message
        console.log('Database connected');

    } catch (error) {
        // Error message if database connection fails
        errorMessage = `Error connecting to database: ${error}`;

        // Console error message
        console.log(errorMessage);

        // Return error message
        return {errorMessage};
    }
}

module.exports = { connectionDB };