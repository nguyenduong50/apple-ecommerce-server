import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { slugify } from '~/utils/formatter'
import { productModel } from '~/models/productModel'
import { createRandomString } from '~/utils/randomString'

const getList = async() => {
  try {
    const products = await productModel.getList()
    if (!products) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'No products have been created yet!')
    }

    return products
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_GATEWAY, error)
  }
}

const createNew = async(reqBody) => {
  try {
    const newProduct = {
      ...reqBody,
      slug: slugify(reqBody.name) + '-' + createRandomString(20)
    }

    const createdProduct = await productModel.createNew(newProduct)
    const getNewProduct = await productModel.findOneById(createdProduct.insertedId)
    return getNewProduct
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_GATEWAY, error)
  }
}

const getDetails = async(id) => {
  try {
    const product = await productModel.getDetails(id)
    if (!product) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found!')
    }

    return product
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_GATEWAY, error)
  }
}

const update = async(productId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }

    return await productModel.update(productId, updateData)
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_GATEWAY, error)
  }
}

export const productService = {
  getList,
  createNew,
  getDetails,
  update
}