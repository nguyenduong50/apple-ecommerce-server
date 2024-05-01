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

const createNew = async(req) => {
  try {
    let newProduct = req.body
    const slug = slugify(req.body.name) + '-' + createRandomString(20)

    let listFile = []
    req.files.forEach(file => {
      listFile.push(file.path.split('\\')[1])
    })
    newProduct = {
      ...newProduct,
      quantity: Number(newProduct.quantity),
      slug: slug,
      images: listFile
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

const getDetailsBySlug = async(slug) => {
  try {
    const product = await productModel.getDetailsBySlug(slug)
    if (!product) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found!')
    }

    const products = await productModel.getList() ?? []
    const productRelated = products.filter(productRelate => productRelate.slug !== slug && productRelate.category === product.category) ?? []

    return { product, productRelated }
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_GATEWAY, error)
  }
}

const update = async(productId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      quantity: Number(reqBody.quantity),
      updatedAt: Date.now()
    }

    return await productModel.update(productId, updateData)
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_GATEWAY, error)
  }
}

const deleteProduct = async(productId) => {
  try {
    return await productModel.deleteProduct(productId)
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_GATEWAY, error)
  }
}

export const productService = {
  getList,
  createNew,
  getDetails,
  getDetailsBySlug,
  update,
  deleteProduct
}