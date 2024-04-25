import express from 'express'
import { orderController } from '~/controllers/orderControler'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

Router.route('/')
  .get(authMiddleware, orderController.getListByUser)
  .post(authMiddleware, orderController.createNew)

Router.route('/:id')
  .get(authMiddleware, orderController.getDetails)

export const orderRouter = Router