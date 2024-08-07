import { StatusCodes } from 'http-status-codes'
import { userService } from '~/services/userService'

const getList = async(req, res, next) => {
  try {
    const users = await userService.getList()
    res.status(StatusCodes.OK).json(users)
  } catch (error) {
    next(error)
  }
}

const createNew = async(req, res, next) => {
  try {
    const createNewUser = await userService.createNew(req.body)
    res.status(StatusCodes.CREATED).json(createNewUser)
  } catch (error) {
    next(error)
  }
}

const update = async(req, res, next) => {
  try {
    const userId = req.params.id
    const updatedUser = await userService.update(userId, req.body)

    res.status(StatusCodes.OK).json(updatedUser)
  } catch (error) {
    next(error)
  }
}

export const userController = {
  getList,
  createNew,
  update
}
