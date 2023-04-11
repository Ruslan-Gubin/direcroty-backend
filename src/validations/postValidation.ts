import {body} from 'express-validator';

const postCreateValedation = [
  body('title', 'Введите заголовок статьи').isLength({min: 3}).isString(),
  body('text', 'Введите текст статьи').isLength({min: 3}).isString(),
]

export {
  postCreateValedation,
}