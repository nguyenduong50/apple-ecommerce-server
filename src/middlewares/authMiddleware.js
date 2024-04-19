import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { GET_DATABASE } from '~/config/mongodb'

export const authMiddleware = async (req, res, next) => {
  // console.log(req.get('Cookie').split(';')[0].trim().split('=')[1])
  const accessToken = req.cookies.accessToken

  if (!accessToken) {
    return next(new ApiError(StatusCodes.FORBIDDEN, 'FORBIDDEN'))
  }

  const sessions = await GET_DATABASE().collection('sessions').find().toArray()
  const session = sessions.find((session) => {
    return session.session.accessToken === accessToken
  })

  if (!session) {
    return next(new ApiError(StatusCodes.FORBIDDEN, 'FORBIDDEN'))
  }

  if (session.expires < new Date()) {
    return next(new ApiError(StatusCodes.FORBIDDEN, 'FORBIDDEN'))
  }

  next()
}
