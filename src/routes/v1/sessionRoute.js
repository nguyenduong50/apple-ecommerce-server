import express from 'express'
import { sessionValidation } from '~/validations/sessionValidation'
import { sessionController } from '~/controllers/sessionController'

const Router = express.Router()

Router.route('/')
  .post(sessionValidation.createNew, sessionController.createNew)

export const sessionRoute = Router