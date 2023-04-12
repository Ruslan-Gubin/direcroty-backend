import { Model, UpdateWriteOpResult } from 'mongoose';
import { postModel } from '../models/index.js';
import * as types from '../types/postTypes/index.js';
import { cloudinary } from '../utils/cloudinary.js';
import { cloudinaryImagesMethod } from '../utils/cloudinaryImagesMethod.js';


type IImageArr = {public_id: string, url: string}[]
  

class PostService {
  constructor(private readonly model: Model<types.IPost>) {}

  async getAllPost(category: string, searchValue: string): Promise<types.IPost[]> {
    console.log('getAllPost:', category, searchValue)

    return await this.model
      .find({ title: { $regex: `${searchValue}`, $options: 'ig' }, category })
      .sort({ createdAt: -1 })
      .exec();
  }

  async create(body: types.CreateTypeBody): Promise<types.IPost> {

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

  async getAll(query: types.GetPostsQuery): Promise<types.IPost[]> {
    const category = query.categor ? query.categor : false;
    const search = query.search ? query.search : '';
 
    const page: number = query.page ? query.page : 0;
    const perPage = query.perpage ? query.perpage : 0;
    const skips = (page - 1) * perPage;

    const result = await this.model
      .find({
        $and: [{ title: { $regex: `${search}`, $options: 'i' } }],
      })
      .skip(skips)
      .limit(perPage)
      .sort(category == 'popular' ? { viewsCount: -1 } : { createdAt: -1 })
    return result;
  }

  async getLength(): Promise<number> {
    return await this.model.countDocuments();
  }

  async findOne(id: string): Promise<types.IPost> {
    if (!id) {
      throw new Error('Не найден ID');
    }

    const post = await this.model
      .findById( id )
      if (!post) {
        throw new Error('Пост не найден');
    }

    return post;
  }

  async remove( { id, images}: {id: string, images: string[]}): Promise<any> {

    try { 
      for (let imgPublickId of images) {
        if (imgPublickId) {
          await cloudinary.uploader.destroy(imgPublickId); // delete image cloudinary
        }
      }
      
    return  this.model.findByIdAndDelete(id);
    } catch (error) {
      console.log(error);
    }
  }
  
  async update(body: types.UpdatePostBody): Promise<UpdateWriteOpResult> {
    const postId = body.id;
    const prevPost = await this.model.findById(postId);
    const prevImage = prevPost?.image;
    
    if (prevImage[0].url === body.image) {
      return await this.model.updateOne({ _id: postId }, { ...body, image: prevImage });
    } else {
      const imgId = await prevPost?.image.public_id;
      if (imgId) {
        await cloudinary.uploader.destroy(imgId);
      }
      
      const newImage = body.image;
      const result = await cloudinary.uploader.upload(newImage, {
        folder: 'PostsDirectory',
        fetch_format: 'auto',
      });

      return await this.model.updateOne(
        { _id: postId },
        {
          ...body,
          image: { public_id: result.public_id, url: result.secure_url },
        },
      );
    }
  }


}

export const postService = new PostService(postModel);
