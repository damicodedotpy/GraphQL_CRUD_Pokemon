// ****************************JAVASCRIPT LIBRARIES******************************

// *****************************EXTERNAL LIBRARIES*******************************
const paginate = require('mongoose-paginate-v2');
const { Schema, model } = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const moment = require('moment');
// ********************************OWN LIBRARIES*********************************

// ******************************************************************************

const TrainerSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        require: true,
    },
    genre: {
        type: String,
        enum: ["Male", "Female"]
    },
    type: {
        type: String,
        enum: ["Fire", "Water", "Grass", "Electric", "Ice", "Fighting", "Poison", "Ground", "Flying", "Psychic", "Bug", "Rock", "Ghost", "Dark", "Dragon", "Steel", "Fairy"]
    },
    badges: {
        type: Number,
        default: 0
    },
    pokemons: [{
        type: Schema.Types.ObjectId,
        ref: "Pokemon",
        default: []
    }],
    image: {
        type: String,
        default: "default.png"
    },
},
{
    versionKey: false,
});

// Add paginate plugin
TrainerSchema.plugin(paginate);

// Virtual properties
TrainerSchema.virtual("virtualPassword").set(function (password) {
    if(!validator.isStrongPassword(password)) throw new Error("INVALID_PASSWORD")

    // If password has strong structure, hash it
    this.password = bcrypt.hashSync(password, 10);
});

TrainerSchema.virtual("virtualEmail").set(function (email) {
    if(!validator.isEmail(email)) throw new Error("INVALID_EMAIL");
});



// Export model
module.exports = model("Trainer", TrainerSchema, "trainers");