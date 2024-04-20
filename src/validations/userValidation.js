import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { ROLE } from '~/utils/constants'
import { userModel } from '~/models/userModel'

const createNew = async(req, res, next) => {
  const correctCondition = Joi.object({
    name: Joi.string().required().min(5).max(50).trim().strict().messages({
      'any.required': 'Name must required!',
      'string.empty': 'Name must not empty'
    }),
    email: Joi.string().email({ minDomainSegments: 2 }).required().messages({
      'any.required': 'Email must required!',
      'string.empty': 'Email must not empty'
    }),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    repeat_password: Joi.ref('password'),
    role: Joi.string().valid(ROLE.ADMIN, ROLE.SALE, ROLE.CUSTOMER)
  })

  try {
    //Validate Username unique
    const userEmail = await userModel.findOneByEmail(req.body.email)
    if (userEmail) {
      return next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, 'ValidationError: Email unique'))
    }

    //Next Controller
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

const update = async(req, res, next) => {
  const correctCondition = Joi.object({
    name: Joi.string().min(5).max(50).trim().strict(),
    email: Joi.string().email({ minDomainSegments: 2 }),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    repeat_password: Joi.ref('password'),
    role: Joi.string().valid(ROLE.ADMIN, ROLE.SALE, ROLE.CUSTOMER)
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

export const userValidation = {
  createNew,
  update
}