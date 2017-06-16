const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

let emailLengthChecker = (email) => {
    if(!email) {
        return false;
    } else {
        if(email.length < 5 || email.length > 30) {
            return false;
        } else {
            return true;
        }
    }
};

let validEmailChecker = (email) => {
    if(!email) {
        return false;
    } else {
        const emailRegex = new RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);
        return emailRegex.test(email);
    }
}

const emailValidators = [{
    validator: emailLengthChecker,
    message: 'E-mail must be atleast 5 characters but not more than 30 characters in length'
}, 
{
    validator: validEmailChecker,
    message: 'Must be a valid Email'
}];

let usernameLengthChecker = (username) => {
    if(!username) {
        return false;
    } else {
        if(username.length < 3 || username.length > 20) {
            return false;
        } else {
            return true;
        }
    }
};

let validUsernameChecker = (username) => {
    if(!username) {
        return false;
    } else {
        const nameRegex = new RegExp(/^[a-zA-Z ]{2,30}$/);
        return nameRegex.test(username);
    }
};

const usernameValidators = [
    {
        validator: usernameLengthChecker,
        message: 'E-mail must be atleast 3 characters but not more than 20 characters in length'
    },
    {
        validator: validUsernameChecker,
        message: 'Username should not contain any special characters'
    }
];

let passwordLengthChecker = (password) => {
    if(!password) {
        return false;
    } else {
        if(password.length < 8 || password.length > 35) {
            return false;
        } else {
            return true;
        }
    }
};

let validPassword = (password) => {
    if(!password) {
        return false;
    } else {
        const passwordRegex = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
        return passwordRegex.test(password);
    }
}

const passwordValidators = [
    {
        validator: passwordLengthChecker,
        message: 'Password must be atleast 8 characters but not more than 35 characters in length'
    },
    {
        validator: validPassword,
        message: 'Must have atleast one special character, uppercase, lowercase and a number'
    }
];

const userSchema = new Schema({
    email: { type: String, required: true, unique: true, lowercase: true, validate: emailValidators },
    username: { type: String, required: true, unique: true, lowercase: true, validate: usernameValidators },
    password: { type: String, required: true, validate: passwordValidators }
});

userSchema.pre('save', function(next) {
    if(!this.isModified('password'))
    return next();

    bcrypt.hash(this.password, null, null, (err, hash) => {
        if(err) return next(err);
        this.password = hash;
        next();        
    });
});

userSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);