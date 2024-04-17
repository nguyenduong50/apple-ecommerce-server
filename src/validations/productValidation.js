import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const createNew = async(req, res, next) => {
  const correctCondition = Joi.object({
    name: Joi.string().required().min(5).max(50).trim().strict().messages({
      'any.required': 'Title must required!',
      'string.empty': 'Title must not empty'
    }),
    category: Joi.string().min(1).max(50).trim().strict().required(),
    price: Joi.number().min(1).required(),
    quantity: Joi.number().min(1).required(),
    shortDescription: Joi.string().required().min(5).max(1000).trim().strict().required(),
    longDescription: Joi.string().required().min(5).max(2000).trim().strict().required()
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false, allowUnknown: true })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

const update = async(req, res, next) => {
  const correctCondition = Joi.object({
    name: Joi.string().required().min(1).max(50).trim().strict().messages({
      'any.required': 'Title must required!',
      'string.empty': 'Title must not empty'
    }),
    category: Joi.string().min(1).max(50).trim().strict().required(),
    price: Joi.number().min(1).required(),
    quantity: Joi.number().min(1).required(),
    shortDescription: Joi.string().required().min(5).max(1000).trim().strict().required(),
    longDescription: Joi.string().required().min(5).max(2000).trim().strict().required()
  })

  try {
    await correctCondition.validateAsync(
      req.body,
      {
        abortEarly: false
      }
    )

    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

export const productValidation = {
  createNew,
  update
}