const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");

// userSchema defines the structure of the User documents in the MongoDB collection 
const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 20,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid email address: " + value);
            }
        },
    },
    password: {
        type: String,
        required: true
    },
},
    //timestamps option will add createdAt and updatedAt fields to the user document and 
    // it will automatically update the updatedAt field whenever we update the user document.
    {
        timestamps: true,
    }
);

// jwt method generates a JWT token for the user using the user's _id and 
// the secret key defined in the environment variables. The token is set to expire in 8 hours. 
// This method can be called on a user instance to generate a token for that specific user.
userSchema.methods.getJWT = async function () {

    const user = this;

    const token = jwt.sign(
        { _id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '8h' }
    )
    return token
}

// comparePassword method compares the password input by the user with the hashed password stored in the database.
userSchema.methods.comparePassword = async function (passwordInputByUser) {

    const user = this;

    const hashedPassword = user.password;

    const passwordMatch = await bcrypt.compare(passwordInputByUser, hashedPassword);

    return passwordMatch;

}

module.exports = mongoose.model('User', userSchema);