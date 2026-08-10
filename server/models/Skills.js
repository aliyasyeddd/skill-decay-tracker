const mongoose = require('mongoose');
const { Schema } = mongoose;

const skillSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    category: {
        type: String
    },
    practiceLog: [
        {
            date: {
                type: Date,
                default: Date.now
            },
            note: {
                type: String
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
})


module.exports = mongoose.model('Skill', skillSchema);