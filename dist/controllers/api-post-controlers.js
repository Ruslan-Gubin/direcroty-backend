import { handleError } from '../utils/index.js';
import { postService } from '../service/index.js';
class PostController {
    async createPost(req, res) {
        const body = req.body;
        await postService
            .create(body)
            .then((post) => res.status(201).json(post))
            .catch((error) => handleError(res, error.message, 'Не удалось создать статью'));
    }
    async getCategoryPosts(req, res) {
        const category = req.query.category;
        const searchValue = req.query.searchValue;
        console.log(category, searchValue);
        await postService
            .getAllPost(category, searchValue)
            .then((posts) => res.status(200).json(posts))
            .catch((error) => handleError(res, error.message, 'Не удалось найти статьи'));
    }
    async getAllGlobalPosts(req, res) {
        const query = req.query;
        await postService
            .getAll(query)
            .then((posts) => res.status(200).json(posts))
            .catch((error) => handleError(res, error.message, 'Не удалось найти статьи'));
    }
    async getLenght(req, res) {
        await postService
            .getLength()
            .then((length) => res.status(200).json(length))
            .catch((error) => handleError(res, error.message, `Не удалось найти длину данных ${req}`));
    }
    async getOnePost(req, res) {
        const id = req.params.id;
        await postService
            .findOne(id)
            .then((post) => res.status(200).json(post))
            .catch((error) => handleError(res, error.message, 'Статья не найдена'));
    }
    async deletePost(req, res) {
        await postService
            .remove({ id: req.body.options.id, images: req.body.options.images })
            .then(() => res.status(200).json({ id: req.body.options.id, success: true }))
            .catch((error) => handleError(res, error.message, 'Не удалось удалить статью'));
    }
    async updatePost(req, res) {
        const body = req.body;
        await postService
            .update(body)
            .then(() => res.status(200).json({ success: true }))
            .catch((error) => handleError(res, error, 'Не удалось обновить статью'));
    }
}
export const postController = new PostController();
