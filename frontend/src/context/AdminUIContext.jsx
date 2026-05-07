import { createContext, useContext, useState } from 'react'

const AdminUIContext = createContext(null)

export function AdminUIProvider({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const toggleSidebar = () => setSidebarOpen((prev) => !prev)
  const closeSidebar = () => setSidebarOpen(false)

  return (
    <AdminUIContext.Provider value={{ sidebarOpen, setSidebarOpen, toggleSidebar, closeSidebar }}>
      {children}
    </AdminUIContext.Provider>
  )
}

export function useAdminUI() {
  const ctx = useContext(AdminUIContext)
  if (!ctx) throw new Error('useAdminUI must be used within AdminUIProvider')
  return ctx
}
