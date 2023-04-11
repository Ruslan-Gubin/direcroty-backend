import mongoose from "mongoose";
const Schema = mongoose.Schema;
const postSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    viewsCount: {
        type: Number,
        default: 0,
    },
    category: {
        type: String,
        required: true,
        default: 'JavaScript',
    },
    image: [{
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        }]
}, { timestamps: true });
export const postModel = mongoose.model("Post", postSchema);
