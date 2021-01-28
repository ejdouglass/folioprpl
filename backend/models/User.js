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
    lab: String,
    encounters: Object,
    library: Object
});

module.exports = mongoose.model('User', UserSchema);