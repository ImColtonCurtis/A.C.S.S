const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true, minlength: 6 },
        phoneNumber: { type: String, required: true, minlength: 10, maxlength: 10 }
    }
)

userSchema.plugin(uniqueValidator); // With this unique validator library, we can query faster

// Name of DB will be called 'User' + 's' on MongoDB
module.exports = mongoose.model('User', userSchema);