import { StatusCodes } from 'http-status-codes'
import { orderModel } from '~/models/orderModel'
import { userModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'

const getHomeInfo = async() => {
  try {
    const users = await userModel.getListUserCustomer()
    const now = new Date()
    let orders = await orderModel.getList()
    orders = orders.filter(order => new Date(order.createdAt).getMonth() === now.getMonth() && new Date(order.createdAt).getFullYear() === now.getFullYear())

    const totalEarningMonth = orders.reduce((total, order) => {
      return total + order.totalOrder
    }, 0)

    const homeInfo = {
      client: users.length,
      totalEarningMonth,
      newOrder: orders.length,
      orders
    }
    return homeInfo
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_GATEWAY, error)
  }
}

export const homeService = {
  getHomeInfo
}