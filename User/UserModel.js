const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    phoneNumber: {
        type: String,
        required: true,
        unique: true, // This enforces uniqueness on the phoneNumber field
      },
    password: {
        type: String
    },

    confirmPassword: {
        type: String
    }
})

const UserModel = mongoose.model('User', userSchema)
module.exports = UserModel