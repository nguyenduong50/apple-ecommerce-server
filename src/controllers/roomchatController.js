import { StatusCodes } from 'http-status-codes'
import { roomchatService } from '~/services/roomchatService'

const getList = async(req, res, next) => {
  try {
    const roomchats = await roomchatService.getList()
    res.status(StatusCodes.OK).json(roomchats)
  } catch (error) {
    next(error)
  }
}

const createNew = async(req, res, next) => {
  try {
    const createNewRoomChat = await roomchatService.createNew(req.body)
    res.status(StatusCodes.CREATED).json(createNewRoomChat)
  } catch (error) {
    next(error)
  }
}

export const roomchatController = {
  getList,
  createNew
}
