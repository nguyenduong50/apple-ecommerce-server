import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { GET_DATABASE } from '~/config/mongodb'
import { userModel } from '~/models/userModel'

export const authorizeMiddleware = async (req, res, next) => {
  const accessToken = req.cookies.accessToken

  const sessions = await GET_DATABASE().collection('sessions').find().toArray()
  const session = sessions.find((session) => {
    return session.session.accessToken === accessToken
  })

  const userId = session.session.userId
  const user = await userModel.findOneById(userId)

  if (user.role !== 'admin') {
    return next(new ApiError(StatusCodes.FORBIDDEN, 'FORBIDDEN'))
  }

  next()
}