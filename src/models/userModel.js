import Joi from 'joi'
import bcrypt from 'bcryptjs'
import { ObjectId } from 'mongodb'
import { GET_DATABASE } from '~/config/mongodb'
import { ROLE } from '~/utils/constants'

const USER_COLLECTION_NAME = 'users'
const USER_COLLECTION_SCHEMA = Joi.object({
  name: Joi.string().required().min(5).max(50).trim().strict(),
  email: Joi.string().email({ minDomainSegments: 2 }).required(),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
  repeat_password: Joi.ref('password'),
  role: Joi.string().valid(ROLE.ADMIN, ROLE.SALE, ROLE.CUSTOMER).default(ROLE.CUSTOMER),
  phone: Joi.string().required().min(5).max(11).trim().strict(),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _deleted: Joi.boolean().default(false)
})

const INVALID_UPDATE_FIELDS = ['_id', 'createdAt']

const getList = async() => {
  try {
    return await GET_DATABASE().collection(USER_COLLECTION_NAME).find().toArray()
  } catch (error) {
    throw new Error(error)
  }
}

const getListUserCustomer = async() => {
  try {
    return await GET_DATABASE().collection(USER_COLLECTION_NAME).find({ role: 'customer' }).toArray()
  } catch (error) {
    throw new Error(error)
  }
}

const validateBeforeCreate = async(data) => {
  return await USER_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async(data) => {
  try {
    const validData = await validateBeforeCreate(data)
    delete validData.repeat_password
    const passwordHash = await bcrypt.hash(validData.password, 10)
    validData.password = passwordHash

    return await GET_DATABASE().collection(USER_COLLECTION_NAME).insertOne(validData)
  } catch (error) {
    throw new Error(error)
  }
}

const createNewCustomer = async(data) => {
  try {
    const passwordHash = await bcrypt.hash(data.password, 10)
    data.password = passwordHash

    return await GET_DATABASE().collection(USER_COLLECTION_NAME).insertOne(data)
  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async(userId) => {
  try {
    return await GET_DATABASE().collection(USER_COLLECTION_NAME).findOne({ _id: new ObjectId(userId) })
  } catch (error) {
    throw new Error(error)
  }
}

const findOneByEmail = async(email) => {
  try {
    return await GET_DATABASE().collection(USER_COLLECTION_NAME).findOne({ email: email })
  } catch (error) {
    throw new Error(error)
  }
}

const update = async(userId, updatedUser) => {
  try {
    Object.keys(updatedUser).forEach(fieldName => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
        delete updatedUser[fieldName]
      }
    })

    delete updatedUser.repeat_password
    updatedUser.password = bcrypt.hash(updatedUser.password, 20)

    const result = await GET_DATABASE().collection(USER_COLLECTION_NAME).findOneAndUpdate(
      {
        _id: new ObjectId(userId)
      },
      {
        $set: updatedUser
      },
      {
        returnDocument: 'after'
      }
    )
    return result
  } catch (error) {
    throw new Error(error)
  }
}

export const userModel = {
  getList,
  getListUserCustomer,
  createNew,
  createNewCustomer,
  findOneById,
  findOneByEmail,
  update
}
