import * as express from 'express';
import { postController }  from "../controllers/index.js";
import { handleValidationErrors } from "../utils/index.js";
import { postCreateValedation } from "../validations/postValidation.js";


const router: express.Router =  express.Router();

router.route('/api/post/:id')
.get( postController.getOnePost )
.delete( postController.deletePost )
.patch( postCreateValedation, handleValidationErrors,postController.updatePost );

router.route('/api/post')
.get( postController.getCategoryPosts)
.post( postCreateValedation, handleValidationErrors, postController.createPost );
// .post( postCreateValedation, handleValidationErrors, postController.createPost);

router.get("/api/lenght", postController.getLenght);

export const postRouter = router;


