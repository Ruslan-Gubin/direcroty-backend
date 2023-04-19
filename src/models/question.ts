import mongoose from "mongoose";
const Schema = mongoose.Schema;
import { IQuestion } from '../types/QuestionTypes/IQuestion.js';

const questionSchema = new Schema<IQuestion>({
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
},
{ timestamps: true },
);

export const questionModel = mongoose.model<IQuestion>("Question", questionSchema);