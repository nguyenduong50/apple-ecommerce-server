import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DATABASE } from '~/config/mongodb'

const PRODUCT_COLLECTION_NAME = 'products'
const PRODUCT_COLLECTION_SCHEMA = Joi.object({
  name: Joi.string().required().min(5).max(50).trim().strict().messages({
    'any.required': 'Title must required!',
    'string.empty': 'Title must not empty'
  }),
  slug: Joi.string().required().trim().strict(),
  category: Joi.array().items(Joi.string()).min(1).required(),
  shortDescription: Joi.string().required().min(5).max(100).trim().strict().required(),
  longDescription: Joi.string().required().min(5).max(500).trim().strict().required(),
  images: Joi.array().items(Joi.string()).max(5).required(),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _deleted: Joi.boolean().default(false)
})

const INVALID_UPDATE_FIELDS = ['_id', 'createdAt']

const getList = async() => {
  try {
    return await GET_DATABASE().collection(PRODUCT_COLLECTION_NAME).find({ _deleted: false }).toArray()
  } catch (error) {
    throw new Error(error)
  }
}

const validateBeforeCreate = async(data) => {
  return await PRODUCT_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async(data) => {
  try {
    const validData = await validateBeforeCreate(data)
    return await GET_DATABASE().collection(PRODUCT_COLLECTION_NAME).insertOne(validData)
  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async(productId) => {
  try {
    return await GET_DATABASE().collection(PRODUCT_COLLECTION_NAME).findOne({ _id: new ObjectId(productId) })
  } catch (error) {
    throw new Error(error)
  }
}

const getDetails = async(productId) => {
  try {
    return await GET_DATABASE().collection(PRODUCT_COLLECTION_NAME).findOne({ _id: productId, _deleted: false })
  } catch (error) {
    throw new Error(error)
  }
}

const update = async(productId, updatedProduct) => {
  try {
    Object.keys(updatedProduct).forEach(fieldName => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
        delete updatedProduct[fieldName]
      }
    })

    const result = await GET_DATABASE().collection(PRODUCT_COLLECTION_NAME).findOneAndUpdate(
      {
        _id: new ObjectId(productId)
      },
      {
        $set: updatedProduct
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

export const productModel = {
  getList,
  createNew,
  findOneById,
  getDetails,
  update
}
