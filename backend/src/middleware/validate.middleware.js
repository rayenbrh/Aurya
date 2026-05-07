import { validationResult } from 'express-validator'

export function validate(req, res, next) {
  const result = validationResult(req)
  if (!result.isEmpty()) {
    return res.status(422).json({ success: false, message: 'Validation échouée', errors: result.array() })
  }
  return next()
}
