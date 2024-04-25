import { StatusCodes } from 'http-status-codes'
import { authService } from '~/services/authService'

const login = async(req, res, next) => {
  try {
    const { accessToken, userId, user } = await authService.login(req.body)
    req.session.accessToken = accessToken
    req.session.userId = userId

    res.cookie('accessToken', accessToken, { maxAge: 1000*60*60, httpOnly: true, sameSite: 'none', secure: true, partitioned: true })
    res.status(StatusCodes.OK).json({ accessToken, user: JSON.stringify(user) })
  } catch (error) {
    next(error)
  }
}

const loginClient = async(req, res, next) => {
  try {
    const { accessToken, userId, user } = await authService.loginClient(req.body)
    req.session.accessToken = accessToken
    req.session.userId = userId

    res.cookie('accessToken', accessToken, { maxAge: 1000*60*60, httpOnly: true, sameSite: 'none', secure: true, partitioned: true })
    res.status(StatusCodes.OK).json({ accessToken, user: JSON.stringify(user) })
  } catch (error) {
    next(error)
  }
}

const register = async(req, res, next) => {
  try {
    const { accessToken, userId, user } = await authService.register(req.body)
    req.session.accessToken = accessToken
    req.session.userId = userId

    res.cookie('accessToken', accessToken, { httpOnly: true, sameSite: 'none', secure: true, partitioned: true })
    res.status(StatusCodes.OK).json({ accessToken, user: JSON.stringify(user) })
  } catch (error) {
    next(error)
  }
}

const logout = (req, res, next) => {
  try {
    req.session.destroy()
    res.send()
  } catch (error) {
    next(error)
  }
}

export const authController = {
  login,
  loginClient,
  register,
  logout
}