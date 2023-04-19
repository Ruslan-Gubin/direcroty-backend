import * as express from 'express';
import { questionController } from "../controllers/index.js";
const router = express.Router();
router.route('/api/question/:id');
router.route('/api/question')
    .get(questionController.getAllQuestion)
    .post(questionController.createQuestion)
    .delete(questionController.deleteQuestion);
export const questionRouter = router;
