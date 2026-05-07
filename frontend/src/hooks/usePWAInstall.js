import { useEffect, useState } from 'react'

export const usePWAInstall = () => {
  const [promptEvent, setPromptEvent] = useState(null)
  useEffect(() => {
    const handle = (e) => {
      e.preventDefault()
      setPromptEvent(e)
    }
    window.addEventListener('beforeinstallprompt', handle)
    return () => window.removeEventListener('beforeinstallprompt', handle)
  }, [])
  const install = async () => {
    if (!promptEvent) return
    promptEvent.prompt()
    await promptEvent.userChoice
    setPromptEvent(null)
  }
  return { canInstall: Boolean(promptEvent), install }
}
