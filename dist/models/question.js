import mongoose from "mongoose";
const Schema = mongoose.Schema;
const questionSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
}, { timestamps: true });
export const questionModel = mongoose.model("Question", questionSchema);
