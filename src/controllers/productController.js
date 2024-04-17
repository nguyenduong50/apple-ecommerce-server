import { StatusCodes } from 'http-status-codes'
import { productService } from '~/services/productService'

const getList = async(req, res, next) => {
  try {
    const products = await productService.getList()
    res.status(StatusCodes.OK).json(products)
  } catch (error) {
    next(error)
  }
}

const createNew = async(req, res, next) => {
  try {
    const createNewProduct = await productService.createNew(req)
    res.status(StatusCodes.CREATED).json(createNewProduct)
  } catch (error) {
    next(error)
  }
}

const getDetails = async(req, res, next) => {
  try {
    const product = await productService.getDetails(req.params.id)
    res.status(StatusCodes.OK).json(product)
  } catch (error) {
    next(error)
  }
}

const update = async(req, res, next) => {
  try {
    const productId = req.params.id
    const updatedProduct = await productService.update(productId, req.body)

    res.status(StatusCodes.OK).json(updatedProduct)
  } catch (error) {
    next(error)
  }
}

const deleteProduct = async(req, res, next) => {
  try {
    const productId = req.params.id
    await productService.deleteProduct(productId)

    res.status(StatusCodes.OK).json({ message: 'Delete successfully!' })
  } catch (error) {
    next(error)
  }
}

export const productController = {
  getList,
  createNew,
  getDetails,
  update,
  deleteProduct
}
