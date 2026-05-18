export function getAdminErrorMessage(err, fallback = 'Une erreur est survenue.') {
  return (
    err?.response?.data?.message
    || err?.response?.data?.errors?.join?.(', ')
    || err?.message
    || fallback
  )
}
