import * as Joi from '@hapi/joi';

export const configValidationSchema = Joi.object({
  PORT: Joi.number().default(4000),
  JWT_SECRET: Joi.string().required(),
  DATABASE_URL: Joi.string().required(),
});
