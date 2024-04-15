import express from 'express'
import { productValidation } from '~/validations/productValidation'
import { productController } from '~/controllers/productController'

const Router = express.Router()

Router.route('/')
  .get(productController.getList)
  .post(productValidation.createNew, productController.createNew)

Router.route('/:id')
  .get(productController.getDetails)
  .put(productValidation.update, productController.update)

export const productRoute = Router