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
    lab: {
        type: Object,
        default: {}
    },
    encounters: {
        type: Object,
        default: { tabula_rasa: 0 }
    },
    library: {
        type: Object,
        default: {}
    },
    joined: Date,
    following: {
        type: Array,
        default: []
    },
    friends: {
        type: Array,
        default: []
    },
    groups: {
        type: Array,
        default: []
    },
    milestones: {
        type: Object,
        default: {}
    },
    messages: {
        type: Object,
        default: {}
    },
    programs: {
        type: Array,
        default: []
    },
    treasures: {
        type: Array,
        default: []
    },
    whatDo: {
        type: Object,
        default: {}
    },
    cutscene: {
        type: Object,
        default: { pending: [], current: {id: -1} }
    },
    privacy: {
        type: Number,
        default: 0
    }
}, { minimize: false });

/*
    DATA MODELING++

    Defining Privacy Levels
    0 : Searchable, full information

    ... also, it probably makes sense to INITIALIZE all this stuff so newly registered users aren't "problematic" for the client code
    
*/

module.exports = mongoose.model('User', UserSchema);