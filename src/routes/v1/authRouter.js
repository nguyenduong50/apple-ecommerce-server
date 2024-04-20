import express from 'express'
import { authValidation } from '~/validations/authValidation'
import { authController } from '~/controllers/authController'

const Router = express.Router()

Router.route('/login')
  .post(authValidation.login, authController.login)

Router.route('/logout')
  .get((req, res) => {
    req.session.destroy()
    return res.send({})
  })

export const authRoute = Router
