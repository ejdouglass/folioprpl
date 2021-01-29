const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    hash: {
        type: String,
        required: true
    },
    firstname: String,
    lastname: String,
    playgroundname: {
        type: String,
        required: true
    },
    history: String,
    birthday: Date,
    lab: String,
    encounters: Object,
    library: Object,
    joined: Date
});

/*
    DATA MODELING++

    Some other variables to consider adding to this all
    -- privacy
*/

module.exports = mongoose.model('User', UserSchema);