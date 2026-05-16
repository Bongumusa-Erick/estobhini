import React, { useState } from 'react'
import { AppProvider, useApp } from './context/AppContext.jsx'
import DevView     from './views/DevView.jsx'
import ExecView    from './views/ExecView.jsx'
import ManagerView from './views/ManagerView.jsx'
import OwnerView   from './views/OwnerView.jsx'
import DriverView  from './views/DriverView.jsx'
import RiderView   from './views/RiderView.jsx'
import Modal, { ModalHeader } from './components/Modal.jsx'

const ROLES = [
  { key:'dev',     label:'Developer', initials:'Dev', avatarBg:'#1a1a2e', avatarColor:'#a0aec0' },
  { key:'exec',    label:'Executive', initials:'Ex',  avatarBg:'#F5F3FF', avatarColor:'#6D28D9' },
  { key:'manager', label:'Manager',   initials:'Mg',  avatarBg:'#EFF6FF', avatarColor:'#1D4ED8' },
  { key:'owner',   label:'Owner',     initials:'Ow',  avatarBg:'#FFF7ED', avatarColor:'#9A3412' },
  { key:'driver',  label:'Driver',    initials:'Dr',  avatarBg:'#FEF3C7', avatarColor:'#92400E' },
  { key:'rider',   label:'Rider',     initials:'Rd',  avatarBg:'#E6FBF2', avatarColor:'#009950' },
]

const NAV_DEFS = {
  dev:     [{i:'ti-code',l:'Handle'},{i:'ti-building',l:'Assocs'},{i:'ti-users',l:'Owners'},{i:'ti-qrcode',l:'QR Hub'},{i:'ti-clipboard-list',l:'Audit'}],
  exec:    [{i:'ti-chart-bar',l:'Overview'},{i:'ti-route',l:'Routes'},{i:'ti-star',l:'Special'},{i:'ti-report',l:'Reports'},{i:'ti-settings',l:'Admin'}],
  manager: [{i:'ti-dashboard',l:'Rank'},{i:'ti-map-pin',l:'Stops'},{i:'ti-map',l:'GPS'},{i:'ti-list',l:'Log'},{i:'ti-scan',l:'Verify'}],
  owner:   [{i:'ti-dashboard',l:'Fleet'},{i:'ti-car',l:'Taxis'},{i:'ti-users',l:'Drivers'},{i:'ti-chart-bar',l:'Earnings'},{i:'ti-qrcode',l:'My QR'}],
  driver:  [{i:'ti-home',l:'Today'},{i:'ti-route',l:'Route'},{i:'ti-receipt',l:'Trips'},{i:'ti-chart-bar',l:'Stats'},{i:'ti-qrcode',l:'My QR'}],
  rider:   [{i:'ti-home',l:'Home'},{i:'ti-route',l:'Routes'},{i:'ti-map',l:'Map'},{i:'ti-credit-card',l:'Tokens'},{i:'ti-user',l:'Profile'}],
}

const VIEW_MAP = { dev:DevView, exec:ExecView, manager:ManagerView, owner:OwnerView, driver:DriverView, rider:RiderView }

function NotifModal({ onClose }) {
  const { notifications, markAllRead } = useApp()
  return (
    <Modal onClose={onClose}>
      <ModalHeader title="Notifications" onClose={onClose} />
      <button className="btn btn-outline btn-sm" onClick={markAllRead}>Mark all read</button>
      <div style={{display:'flex',flexDirection:'column',gap:8}}>
      {notifications.map(n => (
        <div key={n.id} style={{padding:'10px 12px',borderRadius:8,background:n.read?'var(--surface2)':'var(--green-light)',border:`1px solid ${n.read?'var(--border)':'#00C566'}`,display:'flex',gap:10,alignItems:'flex-start'}}>
          <div style={{width:8,height:8,borderRadius:'50%',background:n.read?'var(--text2)':'#00C566',flexShrink:0,marginTop:4}} />
          <div style={{flex:1}}>
            <div style={{fontSize:12,color:'var(--text)'}}>{n.msg}</div>
            <div style={{fontSize:10,color:'var(--text2)',marginTop:2}}>{n.time}</div>
          </div>
        </div>
      ))}
      </div>
    </Modal>
  )
}

function AppShell() {
  const [role, setRole]           = useState('dev')
  const [activeNav, setActiveNav] = useState(0)
  const [showNotif, setShowNotif] = useState(false)
  const { darkMode, setDarkMode, notifications } = useApp()
  const unread = notifications.filter(n => !n.read).length
  const currentRole = ROLES.find(r => r.key === role)
  const View = VIEW_MAP[role]

  function handleRoleSwitch(key) { setRole(key); setActiveNav(0) }

  return (
    <div className="app">
      <div className="topbar">
        <div className="logo">
          <div className="logo-mark"><i className="ti ti-bus" /></div>
          <div className="logo-text">e<span>Stobhini</span></div>
        </div>
        <div className="role-pills">
          {ROLES.map(r => (
            <button key={r.key} className={`rpill${role===r.key?' active':''}`} data-role={r.key} onClick={() => handleRoleSwitch(r.key)}>{r.label}</button>
          ))}
        </div>
        <div className="topbar-right">
          <button onClick={() => setDarkMode(!darkMode)} style={{background:darkMode?'#00C566':'var(--surface2)',border:'1px solid var(--border)',borderRadius:20,padding:'4px 10px',cursor:'pointer',display:'flex',alignItems:'center',gap:5,fontSize:11,color:darkMode?'#000':'var(--text2)',transition:'all .2s'}} title="Toggle dark mode">
            <i className={`ti ${darkMode?'ti-sun':'ti-moon'}`} style={{fontSize:14}} />
            <span>{darkMode?'Light':'Dark'}</span>
          </button>
          <button className="bell" style={{position:'relative'}} onClick={() => setShowNotif(true)}>
            <i className="ti ti-bell" />
            {unread > 0 && <span style={{position:'absolute',top:-2,right:-2,background:'#EF4444',color:'#fff',borderRadius:'50%',width:14,height:14,fontSize:9,fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center'}}>{unread}</span>}
          </button>
          <div className="top-avatar" style={{background:currentRole.avatarBg,color:currentRole.avatarColor}}>{currentRole.initials}</div>
        </div>
      </div>
      <div className="main-area">
        <div className="bottomnav">
          {NAV_DEFS[role].map((item,i) => (
            <button key={i} className={`bnav${activeNav===i?' active':''}`} onClick={() => setActiveNav(i)}>
              <i className={`ti ${item.i}`} /><span>{item.l}</span>
            </button>
          ))}
        </div>
        <div className="content"><View activeNav={activeNav} /></div>
      </div>
      {showNotif && <NotifModal onClose={() => setShowNotif(false)} />}
    </div>
  )
}

export default function App() {
  return <AppProvider><AppShell /></AppProvider>
}
