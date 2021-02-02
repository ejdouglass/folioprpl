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
    history: {
        type: Object,
        default: {}
    },
    birthday: Date,
    lab: String,
    encounters: {
        type: Object,
        default: { tabula_rasa: 0 }
    },
    library: Object,
    joined: Date,
    following: Array,
    friends: Array,
    groups: Array,
    milestones: Object,
    messages: Object,
    programs: Array,
    treasures: Array,
    whatDo: Object,
    cutscene: {
        type: Object,
        default: { pending: [], current: {} }
    },
    privacy: {
        type: Number,
        default: 0
    }
});

/*
    DATA MODELING++

    Defining Privacy Levels
    0 : Searchable, full information

    ... also, it probably makes sense to INITIALIZE all this stuff so newly registered users aren't "problematic" for the client code
    
*/

module.exports = mongoose.model('User', UserSchema);