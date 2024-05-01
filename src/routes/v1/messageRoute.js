import express from 'express'
import { messageController } from '~/controllers/messageController'

const Router = express.Router()

Router.route('/')
  .post(messageController.getMessagesByRoom)

Router.route('/send')
  .post(messageController.createNew)

export const messageRoute = Router