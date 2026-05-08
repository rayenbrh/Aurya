import User from '../models/User.js'
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.utils.js'

const getCookieOptions = () => {
  const isProd = process.env.NODE_ENV === 'production'
  return {
    httpOnly: true,
    sameSite: isProd ? 'none' : 'lax',
    secure: isProd,
    path: '/',
  }
}

const sanitizeUser = (u) => ({
  id: u._id,
  firstName: u.firstName,
  lastName: u.lastName,
  email: u.email,
  phone: u.phone,
  role: u.role,
  address: u.address,
})

export async function register(req, res) {
  const user = await User.create(req.body)
  const accessToken = signAccessToken({ id: user._id, email: user.email, role: user.role })
  const refreshToken = signRefreshToken({ id: user._id, role: user.role })
  user.refreshToken = refreshToken
  await user.save()
  res.cookie('refreshToken', refreshToken, getCookieOptions())
  return res.status(201).json({ success: true, data: { user: sanitizeUser(user), accessToken }, message: 'Compte créé' })
}

export async function login(req, res) {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ success: false, message: 'Email et mot de passe requis' })
  const normalizedEmail = email.toLowerCase().trim()
  const user = await User.findOne({ email: normalizedEmail }).select('+password +refreshToken')
  if (!user) {
    return res.status(401).json({ success: false, message: 'Aucun compte trouvé avec cet email' })
  }
  const passwordMatch = await user.comparePassword(password)
  if (!passwordMatch) {
    return res.status(401).json({ success: false, message: 'Mot de passe incorrect' })
  }
  const accessToken = signAccessToken({ id: user._id, email: user.email, role: user.role })
  const refreshToken = signRefreshToken({ id: user._id, role: user.role })
  user.refreshToken = refreshToken
  user.lastLogin = new Date()
  await user.save()
  res.cookie('refreshToken', refreshToken, getCookieOptions())
  return res.json({ success: true, data: { user: sanitizeUser(user), accessToken }, message: 'Connexion réussie' })
}

export async function logout(req, res) {
  const token = req.cookies.refreshToken
  if (token) {
    const user = await User.findOne({ refreshToken: token }).select('+refreshToken')
    if (user) {
      user.refreshToken = ''
      await user.save()
    }
  }
  res.clearCookie('refreshToken', { ...getCookieOptions(), maxAge: 0 })
  return res.json({ success: true, data: null, message: 'Déconnecté' })
}

export async function refresh(req, res) {
  const token = req.cookies.refreshToken
  if (!token) return res.status(401).json({ success: false, message: 'Aucun refresh token' })
  const decoded = verifyRefreshToken(token)
  const user = await User.findById(decoded.id).select('+refreshToken')
  if (!user || user.refreshToken !== token) return res.status(401).json({ success: false, message: 'Refresh token invalide' })
  const accessToken = signAccessToken({ id: user._id, email: user.email, role: user.role })
  return res.json({ success: true, data: { accessToken, user: sanitizeUser(user) }, message: 'Token rafraîchi' })
}

export async function me(req, res) {
  const user = await User.findById(req.user.id)
  return res.json({ success: true, data: sanitizeUser(user), message: 'Profil utilisateur' })
}

export async function updateMe(req, res) {
  const user = await User.findByIdAndUpdate(req.user.id, req.body, { new: true })
  return res.json({ success: true, data: sanitizeUser(user), message: 'Profil mis à jour' })
}

export async function changePassword(req, res) {
  const { currentPassword, newPassword } = req.body
  const user = await User.findById(req.user.id).select('+password')
  if (!(await user.comparePassword(currentPassword))) {
    return res.status(400).json({ success: false, message: 'Mot de passe actuel invalide' })
  }
  user.password = newPassword
  await user.save()
  return res.json({ success: true, data: null, message: 'Mot de passe modifié' })
}
