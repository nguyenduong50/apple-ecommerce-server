import { StatusCodes } from 'http-status-codes'
import { orderService } from '~/services/orderService'

const getList = async(req, res, next) => {
  try {
    const orders = await orderService.getList()
    res.status(StatusCodes.OK).json(orders)
  } catch (error) {
    next(error)
  }
}

const getListByUser = async(req, res, next) => {
  try {
    const orders = await orderService.getListByUser(req)
    res.status(StatusCodes.OK).json(orders)
  } catch (error) {
    next(error)
  }
}

const createNew = async(req, res, next) => {
  try {
    const newOrder = await orderService.createNew(req.body)
    res.status(StatusCodes.CREATED).json(newOrder)
  } catch (error) {
    next(error)
  }
}

const getDetails = async(req, res, next) => {
  try {
    const order = await orderService.getDetails(req.params.id)
    res.status(StatusCodes.OK).json(order)
  } catch (error) {
    next(error)
  }
}

export const orderController = {
  getList,
  getListByUser,
  createNew,
  getDetails
}