import mongoose from "mongoose";
const Schema = mongoose.Schema;
import { IPost } from "../types/postTypes/index.js";

const postSchema = new Schema<IPost>({
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
    public_id:{
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    }
  }]
},
{ timestamps: true },
);

export const postModel = mongoose.model<IPost>("Post", postSchema);
