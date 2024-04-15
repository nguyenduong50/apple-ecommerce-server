import express from 'express'
import { orderValidation } from '~/validations/orderValidation'
import { orderController } from '~/controllers/orderController'

const Router = express.Router()

Router.route('/')
  .get(orderController.getList)
  .post(orderValidation.createNew, orderController.createNew)

Router.route('/:id')
  .get(orderController.getDetails)

export const orderRoute = Router