import Joi from 'joi';

export const createPostValidationSchema = Joi.object({
  title: Joi.string().min(3).max(255).required().messages({
    'string.base': `"title" should be a type of 'text'`,
    'string.min': `"title" should have a minimum length of 3`,
    'string.max': `"title" should have a maximum length of 255`,
    'any.required': `"title" is a required field`
  }),
  content: Joi.string().min(1).required().messages({
    'string.base': `"content" should be a type of 'text'`,
    'string.min': `"content" should have a minimum length of 1`,
    'any.required': `"content" is a required field`
  }),
  userId: Joi.string().length(24).hex().required().messages({
    'string.base': `"userId" should be a type of 'text'`,
    'string.length': `"userId" should have a length of 24 characters`,
    'any.required': `"userId" is a required field`
  }),
});