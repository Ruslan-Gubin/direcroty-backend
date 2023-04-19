import { questionModel } from '../models/index.js';
class QuestionService {
    constructor(model) {
        this.model = model;
    }
    async getAllQuestion() {
        return await this.model
            .find({})
            .sort({ createdAt: -1 })
            .exec();
    }
    async create(body) {
        const newQustion = await new this.model({
            title: body.title,
            text: body.text,
        }).save();
        return newQustion;
    }
    async remove(id) {
        try {
            return this.model.findByIdAndDelete(id);
        }
        catch (error) {
            console.log(error);
        }
    }
}
export const questionService = new QuestionService(questionModel);
