import mongoose, { Schema } from "mongoose"

const userSchema = new Schema({
    firebaseId: {
        type: String,
        required: true,
        unique: true
    },
    fullname: {
        type: String,
        default: ""
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    avatar: {
        type: String,
        default: process.env.DEFAULT_PROFILE
    },
    about: {
        type: String,
        maxlength: 100,
        required: true,
        default: "No about here"
    },
    intrest: {
        type: [String],  // instead of array of objects
        default: []
    }
}, { timestamps: true })

export const User = mongoose.model("User", userSchema);