import Joi from 'joi';

export class Schemas {
  static readonly article = Joi.object({
    article: Joi.object({
      slug: Joi.string().required(),
      title: Joi.string().required(),
      description: Joi.string().required(),
      body: Joi.string().required(),
      createdAt: Joi.date().required(),
      updatedAt: Joi.date().required(),
      tagList: Joi.array().items(Joi.string()).required(),
      favorited: Joi.boolean().required(),
      favoritesCount: Joi.number().required(),
      author: Joi.object({
        username: Joi.string().required(),
        bio: Joi.string().optional(),
        image: Joi.string().uri().required(),
        following: Joi.boolean().required(),
      }),
    }),
  });
}
