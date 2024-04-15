import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const createNew = async(req, res, next) => {
  const correctCondition = Joi.object({
    name: Joi.string().required().min(5).max(50).trim().strict(),
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
    phone: Joi.string().required().min(5).max(20).trim().strict(),
    address: Joi.string().required().min(5).max(50).trim().strict(),
    userId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    products: Joi.array().items(Joi.object().keys({
      productId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
      quantity: Joi.number().required()
    }))
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

export const columnValidation = {
  createNew
}