import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { userModel } from '~/models/userModel'

const createNew = async(reqBody) => {
  try {
    const createdUser = await userModel.createNew(reqBody)
    const getNewUser = await userModel.findOneById(createdUser.insertedId)
    return getNewUser
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_GATEWAY, error)
  }
}

const update = async(userId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }

    return await userModel.update(userId, updateData)
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_GATEWAY, error)
  }
}

export const userService = {
  createNew,
  update
}