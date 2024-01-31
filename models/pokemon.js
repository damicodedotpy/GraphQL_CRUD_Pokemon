// ****************************JAVASCRIPT LIBRARIES******************************

// *****************************EXTERNAL LIBRARIES*******************************
const { Schema, model } = require('mongoose');
const paginate = require('mongoose-paginate-v2');
// ********************************OWN LIBRARIES*********************************

// ******************************************************************************

const pokemonSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    gen: {
        type: Number,
        enum: [1, 2, 3, 4, 5, 6, 7, 8]
    },
    type: {
        type: String,
        enum: ['Normal', 'Fire', 'Water', 'Grass', 'Electric', 'Ice', 'Fighting', 'Poison', 'Ground', 'Flying', 'Psychic', 'Bug', 'Rock', 'Ghost', 'Dark', 'Dragon', 'Steel', 'Fairy'],
        required: true
    },
    evolution: Boolean,
    trainer: {
        type: Schema.Types.ObjectId,
        ref: "Trainer",
        required: true
    },
    image: {
        type: String,
        default: "default.png"
    }
});


pokemonSchema.plugin(paginate);

module.exports = model("Pokemon", pokemonSchema, "pokemons");
