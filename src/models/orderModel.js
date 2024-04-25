import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DATABASE } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const ORDER_COLLECTION_NAME = 'orders'
const ORDER_COLLECTION_SCHEMA = Joi.object({
  userId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  name: Joi.string().required().min(4).max(50).trim().strict(),
  email: Joi.string().email({ minDomainSegments: 2 }).required(),
  phone: Joi.string().required().min(5).max(12).trim().strict(),
  address: Joi.string().required().min(2).max(100).trim().strict(),
  productOrder: Joi.array().items(Joi.object()),
  totalOrder: Joi.number(),
  createdAt: Joi.date().timestamp('javascript').default(Date.now)
})

const getList = async() => {
  try {
    return await GET_DATABASE().collection(ORDER_COLLECTION_NAME).find().toArray()
  } catch (error) {
    throw new Error(error)
  }
}

const validateBeforeCreate = async(data) => {
  return await ORDER_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async(data) => {
  try {
    const validData = await validateBeforeCreate(data)
    const order = {
      ...validData,
      userId: new ObjectId(validData.userId)
    }

    return await GET_DATABASE().collection(ORDER_COLLECTION_NAME).insertOne(order)
  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async(orderId) => {
  try {
    return await GET_DATABASE().collection(ORDER_COLLECTION_NAME).findOne({ _id: new ObjectId(orderId) })
  } catch (error) {
    throw new Error(error)
  }
}

const getDetails = async(orderId) => {
  try {
    return await GET_DATABASE().collection(ORDER_COLLECTION_NAME).findOne({ _id: new ObjectId(orderId) })
  } catch (error) {
    throw new Error(error)
  }
}

export const orderModel = {
  getList,
  createNew,
  findOneById,
  getDetails
}
