const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const User = require('./models/User');
// const cors = require('cors');
// const bcrypt = require('bcryptjs'); // Consider using this one later, if it might help: https://www.npmjs.com/package/bcryptjs
const crypto = require('crypto'); // Let's start with the built-in fella
require('dotenv').config();

const app = express();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.json({limit: '50mb', extended: true}));

const connectionParams = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
};

mongoose.connect(process.env.DB_HOST, connectionParams)
    .then(() => console.log(`Successfully connected to database.`))
    .catch(err => console.log(`Database connection error encountered: ${err}`));

const PORT = process.env.PORT || 8000;

app.post('/user/register', (req, res, next) => {

});

app.post('/user/login', (req, res, next) => {

});



// HERE: Salting & Hashing functions -- note that there are implementations that do it async, so research the strengths of that approach
function createSalt() {
    return crypto.randomBytes(20).toString('hex');
}

function hash(password, salt) {
    password = password.length && typeof password === 'string' ? password : undefined;

    if (password && salt) {
        let hash = crypto
            .createHmac('sha512', salt)
            .update(password)
            .digest('hex');

        return hash;
    } else {
        return null;
    }
}

// HERE: Token generating function



app.listen(PORT, () => console.log(`Project : Playground Alpha is listening on Port ${PORT}.`));