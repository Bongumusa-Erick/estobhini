import React, { useState } from 'react'
import GPSMap from '../components/GPSMap.jsx'
import Modal, { ModalHeader } from '../components/Modal.jsx'
import { STOPS, DRIVERS, OWNERS, ASSOCIATIONS } from '../data/db.js'

function VerifyModal({ onClose }) {
  const o = OWNERS[0]
  const a = ASSOCIATIONS.find(x => x.id === o.assocId)
  return (
    <Modal onClose={onClose}>
      <ModalHeader title="QR Verified ✓" onClose={onClose} />
      <div className="verify-success">
        <div className="verify-title">✓ Valid — Registered & Compliant</div>
        <div className="verify-sub">{o.name} · {o.qrId}</div>
      </div>
      <div className="qr-meta">
        <div><strong>Association:</strong> {a?.fullName} ({a?.level})</div>
        <div><strong>Province:</strong> KwaZulu-Natal</div>
        <div><strong>Registered taxis:</strong> {o.taxis.join(', ')}</div>
        <div><strong>Routes cleared:</strong> {o.routes.join(', ')}</div>
        <div><strong>Drivers:</strong> {o.drivers.join(', ')}</div>
        <div><strong>Status:</strong> <span style={{color:'#009950'}}>Active & compliant</span></div>
      </div>
    </Modal>
  )
}

function RankPage() {
  return (
    <div className="view fade-in">
      <div className="stat-grid">
        <div className="stat-box"><div className="snum">18</div><div className="slbl">Taxis out</div></div>
        <div className="stat-box"><div className="snum" style={{color:'#009950'}}>9 min</div><div className="slbl">Avg wait</div></div>
        <div className="stat-box"><div className="snum">5</div><div className="slbl">Active stops</div></div>
      </div>
      <div className="slabel">Stop congestion — Dassenhoek & Pinetown</div>
      <div className="card">
        {STOPS.map((s, i) => {
          const barColor = s.crowd < 50 ? 'green' : s.crowd < 75 ? 'amber' : 'red'
          const pillColor = s.crowd < 50 ? 'green' : s.crowd < 75 ? 'amber' : 'red'
          return (
            <div key={i} className="list-item" style={{flexDirection:'column', alignItems:'stretch', gap:6}}>
              <div className="row-sb">
                <div className="li-name">{s.name}</div>
                <span className={`pill ${pillColor}`}>{s.passengers} waiting · {s.crowd}%</span>
              </div>
              <div className="bar-track">
                <div className={`bar-fill ${barColor}`} style={{width:`${s.crowd}%`}} />
              </div>
              <div className="row" style={{flexWrap:'wrap', gap:4}}>
                {s.taxis.map(t => (
                  <span key={t} className={`pill ${s.enRoute.includes(t)?'green':'amber'}`} style={{fontSize:9}}>
                    {t}{s.enRoute.includes(t)?' →':''}
                  </span>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function GPSPage() {
  return (
    <div className="view fade-in">
      <div className="slabel">Live GPS — Dassenhoek, Pinetown & Durban routes</div>
      <div className="card">
        <div className="card-header">
          <span className="ch-title">Taxi positions</span>
          <span className="pill green"><i className="ti ti-wifi" style={{fontSize:10}} /> Live</span>
        </div>
        <GPSMap />
        <div className="card-body" style={{display:'flex', gap:6, flexWrap:'wrap'}}>
          {DRIVERS.map(d => (
            <span key={d.id} className={`pill ${d.status==='active'?'green':d.status==='idle'?'amber':'gray'}`} style={{fontSize:9}}>
              {d.taxi} · {d.name.split(' ')[0]}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

function LogPage() {
  return (
    <div className="view fade-in">
      <div className="slabel">Trip log — today</div>
      <div className="card">
        {DRIVERS.map(d => (
          <div key={d.id} className="list-item">
            <div className="li-icon" style={{background:'#F0F2F5'}}>
              <i className="ti ti-car" style={{color:'#6B7280'}} />
            </div>
            <div className="li-info">
              <div className="li-name">{d.taxi} — {d.name}</div>
              <div className="li-sub">{d.route} · {d.tripsToday} trips</div>
            </div>
            <span className={`pill ${d.status==='active'?'green':d.status==='idle'?'amber':'gray'}`}>{d.status}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function VerifyPage({ setModal }) {
  return (
    <div className="view fade-in">
      <div className="slabel">Scan & verify</div>
      <div className="card">
        <div className="card-body" style={{textAlign:'center', padding:28, display:'flex', flexDirection:'column', alignItems:'center', gap:14}}>
          <div style={{width:80, height:80, border:'2px dashed #D1D5DB', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center'}}>
            <i className="ti ti-scan" style={{fontSize:34, color:'#9CA3AF'}} />
          </div>
          <div style={{fontSize:13, fontWeight:600}}>Scan taxi or owner QR code</div>
          <div style={{fontSize:11, color:'#6B7280'}}>Verify registration, Dassenhoek/Pinetown route clearance and PDP compliance instantly</div>
          <button className="btn btn-blue" onClick={() => setModal('verify')}>Simulate scan — ND 142-RT</button>
        </div>
      </div>
    </div>
  )
}

export default function ManagerView({ activeNav }) {
  const [modal, setModal] = useState(null)
  const pages = [RankPage, RankPage, GPSPage, LogPage, VerifyPage]
  const Page = pages[activeNav] || pages[0]
  return (
    <>
      <Page setModal={setModal} />
      {modal === 'verify' && <VerifyModal onClose={() => setModal(null)} />}
    </>
  )
}
