import { StatusCodes } from 'http-status-codes'
import { roomchatModel } from '~/models/roomchatModel'
import ApiError from '~/utils/ApiError'

const getList = async() => {
  try {
    const roomchats = await roomchatModel.getList()
    if (!roomchats) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'No roomchats have been created yet!')
    }

    return roomchats
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_GATEWAY, error)
  }
}

const createNew = async(reqBody) => {
  try {
    const createdRoomChat = await roomchatModel.createNew(reqBody)
    const getNewRoomChat = await roomchatModel.findOneById(createdRoomChat.insertedId)
    return getNewRoomChat
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_GATEWAY, error)
  }
}

export const roomchatService = {
  getList,
  createNew
}