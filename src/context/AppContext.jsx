import React, { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [darkMode, setDarkMode] = useState(false)
  const [loggedInRider, setLoggedInRider] = useState(null)
  const [notifications, setNotifications] = useState([
    { id:1, msg:'Your taxi ND 142-RT is 3 stops away', read:false, time:'2 min ago' },
    { id:2, msg:'Weekly Unite expires in 2 days — renew now', read:false, time:'1 hr ago' },
    { id:3, msg:'Dassenhoek Rank: Low congestion now', read:true, time:'3 hrs ago' },
  ])

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode)
  }, [darkMode])

  const addNotification = (msg) => {
    setNotifications(prev => [{ id: Date.now(), msg, read: false, time: 'just now' }, ...prev])
  }

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })))

  return (
    <AppContext.Provider value={{ darkMode, setDarkMode, loggedInRider, setLoggedInRider, notifications, addNotification, markAllRead }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
