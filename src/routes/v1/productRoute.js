import express from 'express'
import csrf from 'csurf'
import { productValidation } from '~/validations/productValidation'
import { productController } from '~/controllers/productController'
import { uploadImage, imagesMiddleware } from '~/middlewares/imagesMiddleware'

const Router = express.Router()
const csrfProtection = csrf()

Router.route('/')
  .get(productController.getList)
  .post(uploadImage, imagesMiddleware, productValidation.createNew, productController.createNew)

Router.route('/:id')
  .get(productController.getDetails)
  .put(csrfProtection, productValidation.update, productController.update)
  .delete(productController.deleteProduct)

export const productRoute = Router