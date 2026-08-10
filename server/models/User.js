const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// userSchema defines the structure of the User documents in the MongoDB collection 
const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    } ,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

userSchema.methods.getJWT = async function() {

    const user = this;

    const token = jwt.sign(
        { _id : user._id },
        process.env.JWT_SECRET,
        { expiresIn: '8h'}
    )
    return token
}

userSchema.methods.comparePassword = async function (passwordInputByUser) {

    const user = this;
    
    const hashedPassword = user.password;

    const passwordMatch = await bcrypt.compare(passwordInputByUser, hashedPassword);

    return passwordMatch;
    
}

module.exports = mongoose.model('User', userSchema);