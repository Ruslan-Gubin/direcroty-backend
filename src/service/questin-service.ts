import { Model } from 'mongoose';
import { questionModel } from '../models/index.js';
import { IQuestion } from '../types/QuestionTypes/IQuestion.js';



class QuestionService {
  constructor(private readonly model: Model<IQuestion>) {}

  async getAllQuestion(): Promise<IQuestion[]> {
      return await this.model
      .find({ })
      .sort({ createdAt: -1 })
      .exec();
  }

  async create(body: {title: string, text: string}): Promise<IQuestion> {

    const newQustion = await new this.model({
      title: body.title,
      text: body.text,
    }).save();

    return newQustion;
  }

  async remove( id: string ): Promise<any> {
    try {
      return this.model.findByIdAndDelete(id);
    } catch (error) {
      console.log(error);
    }
  }

}

export const questionService = new QuestionService(questionModel);