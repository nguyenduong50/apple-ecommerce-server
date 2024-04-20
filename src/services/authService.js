import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import jwt from 'jsonwebtoken'
import { userModel } from '~/models/userModel'
import { compare } from 'bcrypt'

const login = async(reqBody) => {
  try {
    const { email, password } = reqBody
    const users = await userModel.getList()

    const user = users.find(async(user) => {
      const isCompare = await compare(password, user.password)
      return user.email === email && isCompare && user.role === 'admin'
    })

    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Not found user!')
    }

    const accessToken = jwt.sign(
      {
        email: user.email,
        userId: user._id.toString()
      },
      'tokenSecretKey',
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