import express from 'express'
import { roomchatController } from '~/controllers/roomchatController'

const Router = express.Router()

Router.route('/')
  .get(roomchatController.getList)

export const roomchatRoute = Router