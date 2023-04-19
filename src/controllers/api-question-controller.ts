import { Response, Request } from 'express';
import { handleError } from '../utils/index.js';
import { questionService } from '../service/index.js';
import { IRequestBody, IRequestQuery } from '../types/IRequestRespons/index.js';
import { IQuestion } from '../types/QuestionTypes/IQuestion.js';


class QuestionController {

  async createQuestion(req: IRequestBody<{title: string, text: string}>, res: Response<IQuestion>) {
    const body = req.body
    await questionService 
      .create(body)
      .then((question) => res.status(201).json(question))
      .catch((error) => handleError(res, error.message, 'Не удалось создать статью'));
    }
    
    async getAllQuestion(req: IRequestQuery<any>, res: Response<IQuestion[]>) {
      await questionService 
      .getAllQuestion()
      .then((question) => res.status(200).json(question))
      .catch((error) => handleError(res, error.message, 'Не удалось найти статьи'));
  }
   
    async deleteQuestion(req: IRequestBody<{id: string}>, res: Response<{id:string, success: boolean}>) {
      const id = req.body.id
      await questionService
      .remove(id)
      .then(() => res.status(200).json({id: id, success: true }))
      .catch((error) => handleError(res, error.message, 'Не удалось удалить статью'));
    }
    


}

export const questionController = new QuestionController();