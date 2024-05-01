import express from 'express'
import { roomchatController } from '~/controllers/roomchatController'

const Router = express.Router()

Router.route('/')
  .get(roomchatController.getList)
  .post(roomchatController.createNew)

export const roomchatCustomerRoute = Router