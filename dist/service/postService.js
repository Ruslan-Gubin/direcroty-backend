import { postModel } from '../models/index.js';
import { cloudinary } from '../utils/cloudinary.js';
import { cloudinaryImagesMethod } from '../utils/cloudinaryImagesMethod.js';
class PostService {
    constructor(model) {
        this.model = model;
    }
    async getAllPost(category, searchValue) {
        if (!searchValue) {
            return await this.model.find({ category }).sort({ createdAt: -1 }).exec();
        }
        return await this.model
            .find({ title: { $regex: `${searchValue}`, $options: 'i' }, category })
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
        const post = await this.model.findById(id);
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
        const { category, id, images, text, title } = body;
        const prevPost = await this.model.findById(id);
        if (!prevPost) {
            throw new Error('Not find Post');
        }
        const imageMap = {
            prevImages: [],
            newImages: [],
            deleteImages: [],
        };
        images.forEach((img) => {
            if (img.match('https://res.cloudinary')) {
                const imgObj = prevPost.image.find((item) => item.url === img);
                if (imgObj) {
                    imageMap.prevImages.push(imgObj);
                }
            }
            else {
                imageMap.newImages.push(img);
            }
        });
        prevPost.image.forEach((img) => {
            if (!imageMap.prevImages.map((item) => item.url).includes(img.url)) {
                imageMap.deleteImages.push(img.public_id);
            }
        });
        if (imageMap.deleteImages.length) {
            for (const removeImg of imageMap.deleteImages) {
                await cloudinary.uploader.destroy(removeImg);
            }
        }
        if (imageMap.newImages.length) {
            for (const img of imageMap.newImages) {
                const newImgObj = await cloudinaryImagesMethod(img, 'PostsDirectory');
                imageMap.prevImages.push(newImgObj);
            }
        }
        const updatePost = await this.model.findByIdAndUpdate(id, {
            category,
            text,
            title,
            image: imageMap.prevImages,
        }, { returnDocument: 'after' });
        if (!updatePost) {
            throw new Error('Не удалось изменить данные');
        }
        return updatePost;
    }
}
export const postService = new PostService(postModel);
