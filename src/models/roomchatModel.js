import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DATABASE } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const MESSAGE_COLLECTION_NAME = 'roomchats'
const MESSAGE_COLLECTION_SCHEMA = Joi.object({
  name: Joi.string(),
  userId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  _deleted: Joi.boolean().default(false)
})

const getList = async() => {
  try {
    return await GET_DATABASE().collection(MESSAGE_COLLECTION_NAME).find().toArray()
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
    const roomchat = {
      ...validData,
      userId: new ObjectId(validData.userId)
    }

    return await GET_DATABASE().collection(MESSAGE_COLLECTION_NAME).insertOne(roomchat)
  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async(roomId) => {
  try {
    return await GET_DATABASE().collection(MESSAGE_COLLECTION_NAME).findOne({ _id: new ObjectId(roomId) })
  } catch (error) {
    throw new Error(error)
  }
}

export const roomchatModel = {
  getList,
  createNew,
  findOneById
}
