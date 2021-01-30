const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
// const cors = require('cors');
// const bcrypt = require('bcryptjs'); // Consider using this one later, if it might help: https://www.npmjs.com/package/bcryptjs
const crypto = require('crypto'); // Let's start with the built-in fella
require('dotenv').config();

const app = express();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Credentials", "true");
    res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Authorization, Origin, X-Requested-With, Content-Type, Accept');
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
    // Remember, never trust the client! Vet the req.body contents again here.
    const newUserCredentials = req.body;

    // HERE: Vet req.body contents, juuuust in case 

    newUserCredentials.salt = createSalt();
    newUserCredentials.hash = hash(newUserCredentials.password, newUserCredentials.salt);

    User.findOne({ email: newUserCredentials.email })
        .then(searchResult => {
            if (searchResult === null) {
                // Make new user in DB
                const newUser = new User({
                    email: newUserCredentials.email,
                    hash: newUserCredentials.hash,
                    salt: newUserCredentials.salt,
                    playgroundname: newUserCredentials.playgroundname,
                    joined: new Date()
                });
                // Might add in some additional defaults later, like default level privacy and such

                newUser.save()
                    .then(res.json({
                        message: `${newUser.playgroundname} has been registered!`,
                        user: newUser, // Our current whoopsie is that, well, we're including the salt AND hash here, which we shouldn't :P
                        token: craftAccessToken(newUser.email, newUser._id)
                    }))
                    .catch(err => {
                        console.log(`${err} occurred while trying to save new user.`);
                        res.json({message: `Welp, we hit a snag registering this user: ${err}.`});
                    });
            } else {
                // Already got this email address registered. Nevermind!
                res.json({message: `Whoops! That user already exists. Try again.`});
            }
        })
    
    // res.json({message: `Bork bork, ${newUserCredentials.pgName}`, status: 200});
});

app.post('/user/login', (req, res, next) => {
    // Expecting .email and .password
    const loginCredentials = req.body;

    User.findOne({ email: loginCredentials.email })
        .then(searchResult => {
            if (searchResult === null) {
                // No email like that found, no such user
                console.log(`Incorrect user.`);
                res.json({message: `Email and password do not match.`});
            } else {
                let salt = searchResult.salt;
                if (hash(loginCredentials.password, salt) === searchResult.hash) {
                    console.log(`Password matches!`);
                    // Do yay-success stuff here
                    let loggedInUser = {
                        playgroundname: searchResult.playgroundname,
                        birthday: searchResult.birthday,
                        history: searchResult.history,
                        lab: searchResult.lab,
                        encounters: searchResult.encounters,
                        library: searchResult.library,
                        token: craftAccessToken(searchResult.email, searchResult._id)
                    };
                    res.json({message: `Login successful!`, user: loggedInUser});
                } else {
                    console.log(`Incorrect password.`);
                    res.json({message: `Email and password do not match.`});
                }
            }
        })
        .catch(err => {
            console.log(`User login error occurred: ${err}.`);
            res.json({message: `Error occurred logging you in: ${err}.`});
        })

    
});

app.get('/auth_check', authenticateToken, (req, res, next) => {
    res.json({message: `I am the endpoint and have received ${JSON.stringify(req.userData)}`});
});



// Salting & Hashing functions -- note that there are implementations that do it async, so research the strengths of that approach
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

// Token generating function
function craftAccessToken(email, id) {
    return jwt.sign({ email: email, userId: id }, process.env.SECRET, { expiresIn: '4h' });
}

// Token checking function
function authenticateToken(req, res, next) {
    // Expecting a TOKEN for this route. Check it and proceed!
    const token = req.headers.authorization.split(' ')[1];
    console.log(`I found this token during auth: ${token}.`);
    const decodedToken = jwt.verify(token, process.env.SECRET);
    console.log(`This token, decoded: ${JSON.stringify(decodedToken)}`);

    req.userData = {email: decodedToken.email, userId: decodedToken.userId};

    next();
}

app.listen(PORT, () => console.log(`Project : Playground Alpha is listening on Port ${PORT}.`));