import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import jwt from 'jsonwebtoken'
import { userModel } from '~/models/userModel'
import { compare } from 'bcryptjs'
import { env } from '~/config/environment'

const login = async(reqBody) => {
  try {
    const { email, password } = reqBody

    const user = await userModel.findOneByEmail(email)

    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not existed!')
    }

    const isCompare = await compare(password, user.password)

    if (!isCompare) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Wrong Password!')
    }

    const accessToken = jwt.sign(
      {
        email: user.email,
        userId: user._id.toString()
      },
      env.JWT_SECRET_KEY,
      { expiresIn: '1h' }
    )

    return { accessToken, userId: user._id.toString(), user }
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_GATEWAY, error)
  }
}

export const authService = {
  login
}