import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const login = async(req, res, next) => {
  const correctCondition = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2 }).required().messages({
      'any.required': 'Email must required!',
      'string.empty': 'Email must not empty'
    }),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

const register = async(req, res, next) => {
  const correctCondition = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2 }).required().messages({
      'any.required': 'Email must required!',
      'string.empty': 'Email must not empty'
    }),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    name: Joi.string().required().min(5).max(50).trim().strict().messages({
      'any.required': 'Name must required!',
      'string.empty': 'Name must not empty'
    }),
    phone: Joi.string().required().min(5).max(11).trim().strict()
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.BAD_REQUEST, new Error(error).message))
  }
}

export const authValidation = {
  login,
  register
}