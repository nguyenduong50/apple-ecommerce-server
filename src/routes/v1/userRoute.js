import express from 'express'
import { userValidation } from '~/validations/userValidation'
import { userController } from '~/controllers/userController'

const Router = express.Router()

Router.route('/')
  .get(userController.getList)
  .post(userValidation.createNew, userController.createNew)

Router.route('/:id')
  .put(userValidation.update, userController.update)

export const userRoute = Router