import { handleError } from '../utils/index.js';
import { questionService } from '../service/index.js';
class QuestionController {
    async createQuestion(req, res) {
        const body = req.body;
        await questionService
            .create(body)
            .then((question) => res.status(201).json(question))
            .catch((error) => handleError(res, error.message, 'Не удалось создать статью'));
    }
    async getAllQuestion(req, res) {
        await questionService
            .getAllQuestion()
            .then((question) => res.status(200).json(question))
            .catch((error) => handleError(res, error.message, 'Не удалось найти статьи'));
    }
    async deleteQuestion(req, res) {
        const id = req.body.id;
        await questionService
            .remove(id)
            .then(() => res.status(200).json({ id: id, success: true }))
            .catch((error) => handleError(res, error.message, 'Не удалось удалить статью'));
    }
}
export const questionController = new QuestionController();
