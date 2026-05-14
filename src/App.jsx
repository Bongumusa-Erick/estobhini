import React, { useState } from 'react'
import DevView     from './views/DevView.jsx'
import ExecView    from './views/ExecView.jsx'
import ManagerView from './views/ManagerView.jsx'
import OwnerView   from './views/OwnerView.jsx'
import DriverView  from './views/DriverView.jsx'
import RiderView   from './views/RiderView.jsx'

// ─── Role config ──────────────────────────────────────────────────
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
  driver:  [{i:'ti-home',l:'Today'},{i:'ti-route',l:'Route'},{i:'ti-users',l:'Passengers'},{i:'ti-chart-bar',l:'Stats'},{i:'ti-qrcode',l:'My QR'}],
  rider:   [{i:'ti-home',l:'Home'},{i:'ti-route',l:'Routes'},{i:'ti-map-pin',l:'Stops'},{i:'ti-credit-card',l:'Tokens'},{i:'ti-user',l:'Profile'}],
}

const VIEW_MAP = { dev:DevView, exec:ExecView, manager:ManagerView, owner:OwnerView, driver:DriverView, rider:RiderView }

// ─── App ──────────────────────────────────────────────────────────
export default function App() {
  const [role, setRole]       = useState('dev')
  const [activeNav, setActiveNav] = useState(0)

  const currentRole = ROLES.find(r => r.key === role)
  const navItems    = NAV_DEFS[role]
  const View        = VIEW_MAP[role]

  function handleRoleSwitch(key) {
    setRole(key)
    setActiveNav(0)
  }

  return (
    <div className="app">
      {/* ── Topbar ── */}
      <div className="topbar">
        <div className="logo">
          <div className="logo-mark"><i className="ti ti-bus" /></div>
          <div className="logo-text">e<span>Stobhini</span></div>
        </div>

        <div className="role-pills">
          {ROLES.map(r => (
            <button
              key={r.key}
              className={`rpill${role === r.key ? ' active' : ''}`}
              data-role={r.key}
              onClick={() => handleRoleSwitch(r.key)}
            >
              {r.label}
            </button>
          ))}
        </div>

        <div className="topbar-right">
          <button className="bell"><i className="ti ti-bell" /></button>
          <div
            className="top-avatar"
            style={{ background: currentRole.avatarBg, color: currentRole.avatarColor }}
          >
            {currentRole.initials}
          </div>
        </div>
      </div>

      <div className="main-area">
        {/* ── Bottom nav (desktop: top subbar, mobile: bottom bar) ── */}
        <div className="bottomnav">
          {navItems.map((item, i) => (
            <button
              key={i}
              className={`bnav${activeNav === i ? ' active' : ''}`}
              onClick={() => setActiveNav(i)}
            >
              <i className={`ti ${item.i}`} />
              <span>{item.l}</span>
            </button>
          ))}
        </div>
        {/* ── Content ── */}
        <div className="content">
          <View activeNav={activeNav} />
        </div>
      </div>
    </div>
  )
}
