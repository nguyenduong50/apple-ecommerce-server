import express from 'express'
import { orderController } from '~/controllers/orderControler'

const Router = express.Router()

Router.route('/')
  .get(orderController.getList)

Router.route('/:id')
  .get(orderController.getDetails)

export const orderRoute = Router