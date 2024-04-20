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

export const authValidation = {
  login
}