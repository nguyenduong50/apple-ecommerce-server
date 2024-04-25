import express from 'express'
import { authValidation } from '~/validations/authValidation'
import { authController } from '~/controllers/authController'

const Router = express.Router()

Router.route('/register')
  .post(authValidation.register, authController.register)

Router.route('/login')
  .post(authValidation.login, authController.loginClient)

Router.route('/logout')
  .get(authController.logout)

export const authCustomerRoute = Router
