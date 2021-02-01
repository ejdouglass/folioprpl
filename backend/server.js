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
                    .then(yay => {
                        let newToken = craftAccessToken(newUser.email, newUser._id);
                        let frontEndUser = {
                            email: newUser.email,
                            playgroundname: newUser.playgroundname,
                            joined: newUser.joined,
                            history: {},
                            lab: '',
                            encounters: {},
                            library: {},
                            isAuthenticated: true,
                            token: newToken
                        };
                        res.json({
                        message: `${newUser.playgroundname} has been registered!`,
                        user: frontEndUser, // Our current whoopsie is that, well, we're including the salt AND hash here, which we shouldn't :P
                        token: newToken
                    })})
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
                        history: searchResult.history || {},
                        lab: searchResult.lab || '',
                        encounters: searchResult.encounters || {},
                        library: searchResult.library || {},
                        token: craftAccessToken(searchResult.email, searchResult._id),
                        isAuthenticated: true
                    };
                    res.json({message: `Login successful!`, user: loggedInUser, success: true});
                } else {
                    console.log(`Incorrect password.`);
                    res.json({message: `Email and password do not match.`, success: false});
                }
            }
        })
        .catch(err => {
            console.log(`User login error occurred: ${err}.`);
            res.json({message: `Error occurred logging you in: ${err}.`});
        })

    
});

app.post('/user/update', authenticateToken, (req, res, next) => {
    // req.userData SHOULD be an object containing email and userId
    // req.body should still have the updated STATE object on there? Ideally, if state matches the model, we can just nudge it on it there
    
    const filter = { email: req.userData.email };
    const update = { $set: req.body };
    const options = { new: true, useFindAndModify: false }

    User.findOneAndUpdate(filter, update, options)
        .then(searchResult => {
            console.log(`Updated user data: ${searchResult}`);
            res.json({message: `User info has been updated.`, success: true});
        })
        .catch(err => {
            console.log(`Error updating user info: ${err}`);
            res.json({message: `Error updating user info on backend: ${err}`, success: false});
        })
});

app.post('/user/change_pw', authenticateToken, (req, res, next) => {
    // User is sending their old PW and new PW, so confirm old PW is good with hash-y, then set new PW's hash as their proper hash
    // const PWRequest = {oldPW: oldPassword, newPW: newPassword};
    const oldPW = req.body.oldPW;
    const newPW = req.body.newPW;

    User.findOne({ email: req.userData.email })
        .then(searchResult => {
            if (searchResult === null) {
                // This shouldn't happen since the user's email is being passed by token, but here we are anyway
            } else {
                let salt = searchResult.salt;
                if (hash(oldPW, salt) === searchResult.hash) {
                    // Ok, old password checks out. Let's save the new PW!
                    console.log(`Attempting to update to new password ${newPW}`);
                    User.findOneAndUpdate({ email : req.userData.email }, { $set: { hash: hash(newPW, salt) } }, { new: true, useFindAndModify: false })
                        .then(searchResult => {
                            console.log(`The user ${searchResult.email} successfully updated their password.`);
                            res.json({message: `Your password has successfully been updated.`, success: true});
                        })
                        .catch(err => {
                            console.log(`An error occurred saving ${searchResult.email}'s new PW: ${err}`);
                            res.json({message: `An error occurred saving your new PW: ${err}`, success: false})
                        });
                }
            }

        })
        .catch(err => {
            console.log(`Error finding user to update PW: ${err}`);
            res.json({message: `Error updating your new PW: ${err}`, success: false});
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