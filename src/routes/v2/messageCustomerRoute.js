import express from 'express'
import { messageController } from '~/controllers/messageController'

const Router = express.Router()

Router.route('/')
  .post(messageController.createNew)

export const messageCustomerRoute = Router