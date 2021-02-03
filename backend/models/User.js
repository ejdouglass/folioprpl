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
        default: undefined
    },
    encounters: {
        type: Object,
        default: { tabula_rasa: 0 }
    },
    library: {
        type: Object,
        default: undefined
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
    milestones: Object,
    messages: Object,
    programs: Array,
    treasures: Array,
    whatDo: Object,
    cutscene: {
        type: Object,
        default: { pending: [], current: undefined }
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