import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DATABASE } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const MESSAGE_COLLECTION_NAME = 'messages'
const MESSAGE_COLLECTION_SCHEMA = Joi.object({
  roomId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  userId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  content: Joi.string().required().min(2).max(50).trim().strict(),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  _deleted: Joi.boolean().default(false)
})

const getMessagesByRoom = async(reqBody) => {
  try {
    return await GET_DATABASE().collection(MESSAGE_COLLECTION_NAME).find({ roomId: new ObjectId(reqBody.roomId) }).toArray()
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
    const message = {
      ...validData,
      roomId: new ObjectId(validData.roomId),
      userId: new ObjectId(validData.userId)
    }

    return await GET_DATABASE().collection(MESSAGE_COLLECTION_NAME).insertOne(message)
  } catch (error) {
    throw new Error(error)
  }
}

export const messageModel = {
  getMessagesByRoom,
  createNew
}
