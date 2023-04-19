import * as express from 'express';
import { questionController }  from "../controllers/index.js";
import { handleValidationErrors } from "../utils/index.js";
import { postCreateValedation } from "../validations/postValidation.js";


const router: express.Router =  express.Router();

router.route('/api/question/:id')
// .get( questionController.getOnePost )

// router.patch('/api/question-update', postCreateValedation, handleValidationErrors,questionController.updatePost );

router.route('/api/question')
.get( questionController.getAllQuestion)
.post(  questionController.createQuestion )
.delete( questionController.deleteQuestion );

// router.get("/api/lenght", questionController.getLenght);

export const questionRouter = router;