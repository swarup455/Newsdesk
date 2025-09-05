import mongoose, { Schema } from "mongoose"

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Category name is required.'],
        unique: true,
        trim: true,
        maxlength: 100
    },
}, {
    timestamps: true,
});

export const Category = mongoose.model("Category", categorySchema)