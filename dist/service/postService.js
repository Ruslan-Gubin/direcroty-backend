import { postModel } from '../models/index.js';
import { cloudinary } from '../utils/cloudinary.js';
import { cloudinaryImagesMethod } from '../utils/cloudinaryImagesMethod.js';
class PostService {
    constructor(model) {
        this.model = model;
    }
    async getAllPost(category, searchValue) {
        if (!searchValue) {
            return await this.model.find({ category: { $regex: `${category}`, $options: 'i' } });
        }
        return await this.model
            .find({ title: { $regex: `${searchValue}`, $options: 'i' }, category: { $regex: `${category}`, $options: 'i' } })
            .sort({ createdAt: -1 })
            .exec();
    }
    async create(body) {
        const imageUrl = [];
        const files = body.images;
        for (const file of files) {
            const newImage = await cloudinaryImagesMethod(file, 'PostsDirectory');
            imageUrl.push(newImage);
        }
        const newPost = await new this.model({
            title: body.title,
            text: body.text,
            category: body.category,
            image: imageUrl.map((item) => item),
        }).save();
        return newPost;
    }
    async getAll(query) {
        const category = query.categor ? query.categor : false;
        const search = query.search ? query.search : '';
        const page = query.page ? query.page : 0;
        const perPage = query.perpage ? query.perpage : 0;
        const skips = (page - 1) * perPage;
        const result = await this.model
            .find({
            $and: [{ title: { $regex: `${search}`, $options: 'i' } }],
        })
            .skip(skips)
            .limit(perPage)
            .sort(category == 'popular' ? { viewsCount: -1 } : { createdAt: -1 });
        return result;
    }
    async getLength() {
        return await this.model.countDocuments();
    }
    async findOne(id) {
        if (!id) {
            throw new Error('Не найден ID');
        }
        const post = await this.model
            .findById(id);
        if (!post) {
            throw new Error('Пост не найден');
        }
        return post;
    }
    async remove({ id, images }) {
        try {
            for (let imgPublickId of images) {
                if (imgPublickId) {
                    await cloudinary.uploader.destroy(imgPublickId);
                }
            }
            return this.model.findByIdAndDelete(id);
        }
        catch (error) {
            console.log(error);
        }
    }
    async update(body) {
        return await this.model.updateOne({
            ...body,
        });
    }
}
export const postService = new PostService(postModel);
