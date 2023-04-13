import { Response, Request } from 'express';
import { handleError } from '../utils/index.js';
import { postService } from '../service/index.js';
import { IRequestBody, IRequestQuery } from '../types/IRequestRespons/index.js';
import * as types from '../types/postTypes/index.js';


class PostController {

  async createPost(req: IRequestBody<types.CreateTypeBody>, res: Response<types.IPost>) {
    const body = req.body
    await postService 
      .create(body)
      .then((post) => res.status(201).json(post))
      .catch((error) => handleError(res, error.message, 'Не удалось создать статью'));
    }
    
    async getCategoryPosts(req: IRequestQuery<{category: string, searchValue: string}>, res: Response<types.IPost[]>) {
      const category = req.query.category
      const searchValue = req.query.searchValue
      await postService
      .getAllPost(category, searchValue) 
      .then((posts) => res.status(200).json(posts))
      .catch((error) => handleError(res, error.message, 'Не удалось найти статьи'));
    }
    
    async getAllGlobalPosts(req: IRequestQuery<any>, res: Response<types.IPost[]>) {
    const query = req.query 
    await postService
      .getAll(query)
      .then((posts) => res.status(200).json(posts))
      .catch((error) => handleError(res, error.message, 'Не удалось найти статьи'));
  }

  async getLenght(req: Request, res: Response<number>) {
    await postService
    .getLength()
    .then((length) => res.status(200).json(length))
    .catch((error) => handleError(res, error.message, `Не удалось найти длину данных ${req}`));
  }
  
  async getOnePost(req: IRequestBody<{id: string}>, res: Response<types.IPost >) {
    const id = req.params.id;
    await postService
    .findOne(id)
      .then((post) => res.status(200).json(post))
      .catch((error) => handleError(res, error.message, 'Статья не найдена'));
    }
    
    async deletePost(req: IRequestBody<{options: {id: string, images: string[]}}>, res: Response<{id:string, success: boolean}>) {
      await postService
      .remove({id: req.body.options.id, images: req.body.options.images})
      .then(() => res.status(200).json({id: req.body.options.id, success: true }))
      .catch((error) => handleError(res, error.message, 'Не удалось удалить статью'));
    }
    
    async updatePost(req: IRequestBody<types.UpdatePostBody>, res: Response<types.IPost>) {
      const body = req.body
      await postService
      .update(body)
      .then((post) => res.status(200).json(post))
      .catch((error) => handleError(res, error, 'Не удалось обновить статью'));
    }

}

export const postController = new PostController();
