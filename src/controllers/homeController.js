import { StatusCodes } from 'http-status-codes'
import { homeService } from '~/services/homeService'

const getHomeInfo = async(req, res, next) => {
  try {
    const homeInfo = await homeService.getHomeInfo()
    res.status(StatusCodes.OK).json(homeInfo)
  } catch (error) {
    next(error)
  }
}

export const homeController = {
  getHomeInfo
}