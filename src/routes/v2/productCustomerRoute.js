import express from 'express'
import { productController } from '~/controllers/productController'

const Router = express.Router()

Router.route('/')
  .get(productController.getList)

Router.route('/:slug')
  .get(productController.getDetailsBySlug)

export const productCustomerRoute = Router