import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DATABASE } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const MESSAGE_COLLECTION_NAME = 'messages'
const MESSAGE_COLLECTION_SCHEMA = Joi.object({
  userId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  content: Joi.string().required().min(2).max(50).trim().strict(),
  isAdmin: Joi.boolean(),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  _deleted: Joi.boolean().default(false)
})

const getMessagesByRoom = async(reqBody) => {
  try {
    return await GET_DATABASE().collection(MESSAGE_COLLECTION_NAME).find({ userId: reqBody.userId }).toArray()
  } catch (error) {
    throw new Error(error)
  }
}

const validateBeforeCreate = async(data) => {
  return await MESSAGE_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async(data) => {
  try {
    const validData = await validateBeforeCreate(data)


    return await GET_DATABASE().collection(MESSAGE_COLLECTION_NAME).insertOne(validData)
  } catch (error) {
    throw new Error(error)
  }
}

export const messageModel = {
  getMessagesByRoom,
  createNew
}
