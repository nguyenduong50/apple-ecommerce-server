import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const createNew = async(req, res, next) => {
  const correctCondition = Joi.object({
    name: Joi.string().required().min(5).max(50).trim().strict().messages({
      'any.required': 'Title must required!',
      'string.empty': 'Title must not empty'
    }),
    category: Joi.array().items(Joi.string()).min(1).required(),
    shortDescription: Joi.string().required().min(5).max(100).trim().strict().required(),
    longDescription: Joi.string().required().min(5).max(500).trim().strict().required(),
    images: Joi.array().items(Joi.string()).max(5).required()
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

const update = async(req, res, next) => {
  const correctCondition = Joi.object({
    name: Joi.string().required().min(5).max(50).trim().strict().messages({
      'any.required': 'Title must required!',
      'string.empty': 'Title must not empty'
    }),
    category: Joi.array().items(Joi.string()).min(1).required(),
    shortDescription: Joi.string().required().min(5).max(100).trim().strict().required(),
    longDescription: Joi.string().required().min(5).max(500).trim().strict().required(),
    images: Joi.array().items(Joi.string()).max(5).required()
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