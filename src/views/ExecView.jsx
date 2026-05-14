import React, { useState } from 'react'
import Modal, { ModalHeader } from '../components/Modal.jsx'
import { ASSOCIATIONS, ROUTES, SPECIAL_TRIPS, LEVEL_META } from '../data/db.js'

function SpecialModal({ onClose }) {
  return (
    <Modal onClose={onClose}>
      <ModalHeader title="Book Special Trip — KZN" onClose={onClose} />
      <div className="form-group"><label>Trip name</label><input placeholder="e.g. Dassenhoek community event" /></div>
      <div className="form-grid-2">
        <div className="form-group"><label>Date</label><input type="date" /></div>
        <div className="form-group"><label>Taxis needed</label><input type="number" placeholder="5" /></div>
      </div>
      <div className="form-group"><label>Route / area</label><input placeholder="From → To" /></div>
      <div className="form-group">
        <label>Association</label>
        <select>{ASSOCIATIONS.map(a => <option key={a.id}>{a.name}</option>)}</select>
      </div>
      <button className="btn btn-purple btn-full" onClick={onClose}>Submit for Approval</button>
    </Modal>
  )
}

function OverviewPage() {
  return (
    <div className="view fade-in">
      <div className="hero">
        <div className="hero-badge"><i className="ti ti-map-pin" style={{fontSize:10}} /> KwaZulu-Natal · eStobhini Pilot</div>
        <h2>Association Executive</h2>
        <p>SANTACO → KZN Provincial → Durban Regional → Pinetown → Dassenhoek</p>
      </div>
      <div className="stat-grid">
        <div className="stat-box"><div className="snum">14,200</div><div className="slbl">KZN Riders/mo</div></div>
        <div className="stat-box"><div className="snum">667</div><div className="slbl">KZN Owners</div></div>
        <div className="stat-box"><div className="snum">R162K</div><div className="slbl">Token Revenue</div></div>
        <div className="stat-box"><div className="snum">5</div><div className="slbl">Assoc. Levels</div></div>
        <div className="stat-box"><div className="snum">78%</div><div className="slbl">Cashless</div></div>
        <div className="stat-box"><div className="snum">87%</div><div className="slbl">Compliance</div></div>
      </div>
      <div className="slabel">KZN association breakdown</div>
      <div className="card">
        {ASSOCIATIONS.map(a => {
          const meta = LEVEL_META[a.level]
          const cls = { National:'red', Provincial:'purple', Regional:'blue', District:'orange', Local:'green' }
          return (
            <div key={a.id} className="list-item">
              <div className="li-icon" style={{background:meta.bg}}>
                <i className="ti ti-building" style={{color:meta.fg}} />
              </div>
              <div className="li-info">
                <div className="li-name">{a.fullName}</div>
                <div className="li-sub">{a.level} · {a.owners} owners</div>
              </div>
              <span className={`pill ${cls[a.level]||'green'}`}>{a.level}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function RoutesPage() {
  const perf = [
    { n:'Dassenhoek → Pinetown', t:210, s:88 },
    { n:'Dassenhoek → Durban CBD', t:180, s:82 },
    { n:'Pinetown → Durban CBD', t:390, s:91 },
    { n:'Dassenhoek → New Germany', t:140, s:76 },
    { n:'Pinetown → Westville', t:95, s:70 },
    { n:'Dassenhoek → Hillcrest', t:75, s:65 },
  ]
  return (
    <div className="view fade-in">
      <div className="slabel">Route performance — KZN</div>
      <div className="card">
        {perf.map((r, i) => (
          <div key={i} className="list-item">
            <div className="li-info">
              <div className="li-name">{r.n}</div>
              <div className="row" style={{marginTop:5, gap:6}}>
                <div className="bar-track">
                  <div className={`bar-fill ${r.s>=85?'green':r.s>=75?'amber':'red'}`} style={{width:`${r.s}%`}} />
                </div>
                <span style={{fontSize:10, color:'#6B7280', minWidth:28}}>{r.s}%</span>
              </div>
            </div>
            <div className="li-right">
              <div style={{fontSize:13, fontWeight:600}}>{r.t}</div>
              <div style={{fontSize:10, color:'#6B7280'}}>trips/day</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SpecialPage({ setModal }) {
  return (
    <div className="view fade-in">
      <div className="row-sb">
        <div className="slabel">Special trips — KZN</div>
        <button className="btn btn-purple btn-sm" onClick={() => setModal('special')}><i className="ti ti-plus" /> Book</button>
      </div>
      <div className="card">
        {SPECIAL_TRIPS.map((t, i) => (
          <div key={i} className="list-item">
            <div className="li-icon" style={{background:'#F0F2F5'}}>
              <i className={`ti ${t.icon}`} style={{color:'#6B7280'}} />
            </div>
            <div className="li-info">
              <div className="li-name">{t.name}</div>
              <div className="li-sub">{t.date} · {t.taxis} taxis · {t.assoc}</div>
            </div>
            <button className="btn btn-green btn-sm">Approve</button>
          </div>
        ))}
      </div>
    </div>
  )
}

function ReportsPage() {
  const reports = ['KZN Monthly revenue report','Dassenhoek route utilisation','Pinetown compliance audit','Driver performance — KZN','Association activity log — KZN']
  return (
    <div className="view fade-in">
      <div className="slabel">Reports — KZN</div>
      <div className="card">
        <div className="card-body" style={{display:'flex', flexDirection:'column', gap:8}}>
          {reports.map((r, i) => (
            <div key={i} className="row-sb" style={{padding:'8px 0', borderBottom:'1px solid #E5E7EB'}}>
              <span style={{fontSize:12}}><i className="ti ti-file-text" style={{marginRight:6}} />{r}</span>
              <button className="btn btn-outline btn-sm"><i className="ti ti-download" /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function AdminPage() {
  return (
    <div className="view fade-in">
      <div className="slabel">Executive admin</div>
      <div className="card">
        <div className="card-body" style={{display:'flex', flexDirection:'column', gap:8}}>
          {['Set token pricing per route','Configure compliance scoring','Manage association permissions','Broadcast announcement — KZN','Suspend / reinstate association'].map((a, i) => (
            <button key={i} className={`btn btn-full ${i<2?'btn-purple':'btn-outline'}`}>{a}</button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function ExecView({ activeNav }) {
  const [modal, setModal] = useState(null)
  const pages = [OverviewPage, RoutesPage, SpecialPage, ReportsPage, AdminPage]
  const Page = pages[activeNav] || pages[0]
  return (
    <>
      <Page setModal={setModal} />
      {modal === 'special' && <SpecialModal onClose={() => setModal(null)} />}
    </>
  )
}
