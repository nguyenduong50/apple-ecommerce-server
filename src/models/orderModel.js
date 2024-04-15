import Joi from 'joi'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { ObjectId } from 'mongodb'
import { GET_DATABASE } from '~/config/mongodb'
import { STATUS_ORDER, DELIVERY_ORDER } from '~/utils/constants'

const COLUMN_COLLECTION_NAME = 'columns'
const COLUMN_COLLECTION_SCHEMA = Joi.object({
  name: Joi.string().required().min(5).max(50).trim().strict(),
  email: Joi.string().email({ minDomainSegments: 2 }).required(),
  phone: Joi.string().required().min(5).max(20).trim().strict(),
  address: Joi.string().required().min(5).max(50).trim().strict(),
  userId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  products: Joi.array().items(Joi.object().keys({
    productId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    quantity: Joi.number().required()
  })),
  status: Joi.string().valid(STATUS_ORDER.WAIT_FOR_PAY, STATUS_ORDER.PAID).default(STATUS_ORDER.WAIT_FOR_PAY),
  delivery: Joi.string().valid(DELIVERY_ORDER.WAIT_FOR_DELIVERY, DELIVERY_ORDER.DELIVERING, DELIVERY_ORDER.DELIVERED).default(DELIVERY_ORDER.WAIT_FOR_DELIVERY),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _deleted: Joi.boolean().default(false)
})

const validateBeforeCreate = async(data) => {
  return await COLUMN_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async(data) => {
  try {
    const validData = await validateBeforeCreate(data)

    return await GET_DATABASE().collection(COLUMN_COLLECTION_NAME).insertOne(validData)
  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async(orderId) => {
  try {
    return await GET_DATABASE().collection(COLUMN_COLLECTION_NAME).findOne({ _id: new ObjectId(orderId) })
  } catch (error) {
    throw new Error(error)
  }
}

export const columnModel = {
  createNew,
  findOneById
}
