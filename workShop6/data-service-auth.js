const bcrypt = require('bcryptjs');
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var userSchema = new Schema({
    "userName": {
        "type": String,
        "unique": true
    },
    "password": String,
    "email": String,
    "loginHistory": [{ "dateTime": Date, "userAgent": String }]

});

let User; // to be defined on new connection (see initialize)


function initialize() {
    return new Promise(function (resolve, reject) {
        
        let db = mongoose.createConnection(`mongodb+srv://Amir:1234@cluster0-alqps.mongodb.net/test?retryWrites=true&w=majority`);
        db.on('error', (err) => {
            reject(err); // reject the promise with the provided error
        });
        db.once('open', () => {
            User = db.model("users", userSchema);
            resolve();
        });
    });
};

function registerUser(userData) {

    return new Promise(function (resolve, reject) {
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(userData.password, salt, function (err, hash) {
                if (err) {
                    reject("There was an error encrypting the password");
                } else {
                        
                    if (userData.password == userData.password2) {

                        userData.password = hash;

                        console.log(userData);

                        let newUser = new User(userData);
                        
                        newUser.save((err) => {
                            if (err) {
                                if (err.code == 11000) {
                                    reject("User Name already taken");
                                }
                                else {
                                    console.log(err);
                                    reject("There was an error creating the user:", err);
                                }
                            } else {
                                resolve();
                            }
                        })
                    } else {
                        reject("Passwords do not match");
                    }
                }
            })
        })
    })
};

function checkUser(userData) {
    return new Promise(function(resolve,reject){
    User.find({ userName: userData.userName })
        .exec()
        .then((users) => {
            if (users.length == 0) {
                reject("Empty! Unable to find user: " + userData.userName);
            }

            bcrypt.compare(userData.password, users[0].password)
                .then((res) => {
                    users[0].loginHistory.push({ dateTime: (new Date()).toString(), userAgent: userData.userAgent });
                    User.update(
                        { userName: users[0].userName },
                        { $set: { loginHistory: users[0].loginHistory } },
                        { multi: false })
                        .exec()
                        .then(() => {
                            resolve(users[0]);
                        })
                        .catch((err) => {
                            reject("There was an error verifying the user: ", err);
                        })
                })
                .catch((err) => {
                    reject("Incorrect Password for user: " + userData.userName);
                })
        })
        .catch((err) => {
            console.log("Unable to find user: user" + userData.userName + err);
        })

    });
};

module.exports = {
    initialize,
    registerUser,
    checkUser
};