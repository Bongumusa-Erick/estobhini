import React, { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import Modal, { ModalHeader } from '../components/Modal.jsx'
import { OWNERS, DRIVERS, ASSOCIATIONS } from '../data/db.js'

const ME = OWNERS[0]
const MY_DRIVERS = DRIVERS.filter(d => ME.drivers.includes(d.name))
const MY_ASSOC = ASSOCIATIONS.find(a => a.id === ME.assocId)
const today = new Date().toISOString().split('T')[0]

function AddTaxiModal({ onClose }) {
  return (
    <Modal onClose={onClose}>
      <ModalHeader title="Register Taxi" onClose={onClose} />
      <div className="form-group"><label>Plate number (KZN)</label><input placeholder="e.g. ND 999-ZZ" /></div>
      <div className="form-group"><label>Make & model</label><input placeholder="e.g. Toyota Quantum 2.5 D-4D" /></div>
      <div className="form-grid-2">
        <div className="form-group"><label>Year</label><input placeholder="2020" /></div>
        <div className="form-group"><label>Capacity</label><select><option>15 seats</option><option>14 seats</option><option>10 seats</option></select></div>
      </div>
      <div className="form-group"><label>Operating route</label><input placeholder="Dassenhoek → Pinetown" /></div>
      <button className="btn btn-orange btn-full" onClick={onClose}><i className="ti ti-check" /> Register Taxi</button>
    </Modal>
  )
}

function AddDriverModal({ onClose }) {
  return (
    <Modal onClose={onClose}>
      <ModalHeader title="Register Driver" onClose={onClose} />
      <div className="form-group"><label>Driver full name</label><input placeholder="Full name" /></div>
      <div className="form-group"><label>PDP / License number</label><input placeholder="e.g. PDP-KZN-2024-007" /></div>
      <div className="form-group">
        <label>Assigned taxi</label>
        <select>{ME.taxis.map(t => <option key={t}>{t}</option>)}</select>
      </div>
      <div className="form-group"><label>Contact number</label><input placeholder="+27 ..." /></div>
      <button className="btn btn-orange btn-full" onClick={onClose}><i className="ti ti-check" /> Register Driver</button>
    </Modal>
  )
}

function FleetPage({ setModal }) {
  return (
    <div className="view fade-in">
      <div className="card" style={{borderColor:'#F97316', borderWidth:1.5}}>
        <div className="card-header" style={{background:'#FFF7ED'}}>
          <span style={{color:'#9A3412', fontWeight:600}}>{ME.name}</span>
          <span className="pill orange">{MY_ASSOC?.name}</span>
        </div>
        <div className="card-body">
          <div className="stat-grid">
            <div className="stat-box"><div className="snum">{ME.taxis.length}</div><div className="slbl">Taxis</div></div>
            <div className="stat-box"><div className="snum">{ME.drivers.length}</div><div className="slbl">Drivers</div></div>
            <div className="stat-box"><div className="snum">R580</div><div className="slbl">Today</div></div>
          </div>
        </div>
      </div>
      <div className="slabel">Fleet — live status</div>
      <div className="card">
        {MY_DRIVERS.map(d => (
          <div key={d.id} className="list-item">
            <div className="li-icon" style={{background:d.status==='active'?'#E6FBF2':d.status==='idle'?'#FEF3C7':'#F0F2F5'}}>
              <i className="ti ti-car" style={{color:d.status==='active'?'#009950':d.status==='idle'?'#92400E':'#6B7280'}} />
            </div>
            <div className="li-info">
              <div className="li-name">{d.taxi}</div>
              <div className="li-sub">{d.name} · {d.route} · {d.tripsToday} trips</div>
            </div>
            <span className={`pill ${d.status==='active'?'green':d.status==='idle'?'amber':'gray'}`}>{d.status}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function TaxisPage({ setModal }) {
  return (
    <div className="view fade-in">
      <div className="row-sb">
        <div className="slabel">Registered taxis</div>
        <button className="btn btn-orange btn-sm" onClick={() => setModal('addTaxi')}><i className="ti ti-plus" /> Add Taxi</button>
      </div>
      <div className="card">
        {ME.taxis.map(t => (
          <div key={t} className="list-item">
            <div className="li-icon" style={{background:'#E6FBF2'}}>
              <i className="ti ti-car" style={{color:'#009950'}} />
            </div>
            <div className="li-info">
              <div className="li-name">{t}</div>
              <div className="li-sub">KZN registered · {ME.routes[0]} · DLTA</div>
            </div>
            <span className="pill green">Active</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function DriversPage({ setModal }) {
  return (
    <div className="view fade-in">
      <div className="row-sb">
        <div className="slabel">Registered drivers</div>
        <button className="btn btn-orange btn-sm" onClick={() => setModal('addDriver')}><i className="ti ti-plus" /> Add Driver</button>
      </div>
      <div className="card">
        {MY_DRIVERS.map(d => (
          <div key={d.id} className="list-item">
            <div className="li-icon" style={{background:'#FFF7ED'}}>
              <i className="ti ti-user" style={{color:'#9A3412'}} />
            </div>
            <div className="li-info">
              <div className="li-name">{d.name}</div>
              <div className="li-sub">{d.taxi} · {d.license} · {d.tripsToday} trips today</div>
            </div>
            <span className={`pill ${d.status==='active'?'green':d.status==='idle'?'amber':'gray'}`}>{d.status}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function EarningsPage() {
  const days = ['M','T','W','T','F','S','S']
  const vals = [720,880,1040,920,1160,680,440]
  const max = Math.max(...vals)
  return (
    <div className="view fade-in">
      <div className="slabel">Earnings — KZN routes</div>
      <div className="stat-grid">
        <div className="stat-box"><div className="snum">R580</div><div className="slbl">Today</div></div>
        <div className="stat-box"><div className="snum">R3,840</div><div className="slbl">This week</div></div>
        <div className="stat-box"><div className="snum">R15,200</div><div className="slbl">This month</div></div>
      </div>
      <div className="card">
        <div className="card-header"><span className="ch-title">Weekly earnings</span><span className="pill green">This week</span></div>
        <div className="card-body">
          <div className="earn-chart">
            {vals.map((v, i) => (
              <div key={i} className="earn-col">
                <div className="earn-bar" style={{height: Math.round(v/max*55)+5}} title={`R${v}`} />
                <div className="earn-day">{days[i]}</div>
              </div>
            ))}
          </div>
          <div style={{fontSize:11, color:'#6B7280', marginTop:10}}>Routes: {ME.routes.join(' · ')}</div>
        </div>
      </div>
    </div>
  )
}

function MyQRPage() {
  const data = {
    id: ME.qrId,
    type: 'TAXI_OWNER',
    name: ME.name,
    association: MY_ASSOC?.fullName,
    assocLevel: MY_ASSOC?.level,
    taxis: ME.taxis,
    routes: ME.routes,
    drivers: ME.drivers,
    province: 'KwaZulu-Natal',
    issued: today,
  }
  return (
    <div className="view fade-in">
      <div className="slabel">My owner QR code</div>
      <div className="card">
        <div className="qr-wrap">
          <div className="qr-frame">
            <QRCodeSVG value={JSON.stringify(data)} size={160} bgColor="#fff" fgColor="#000" level="M" />
          </div>
          <div className="qr-title">{ME.name}</div>
          <div className="qr-sub">{ME.qrId}</div>
          <div style={{display:'flex', gap:5, flexWrap:'wrap', justifyContent:'center'}}>
            {ME.taxis.map(t => <span key={t} className="pill green" style={{fontSize:9}}>{t}</span>)}
          </div>
          <div className="qr-meta">
            <div><strong>Association:</strong> {MY_ASSOC?.fullName}</div>
            <div><strong>Routes:</strong> {ME.routes.join(', ')}</div>
            <div><strong>Drivers:</strong> {ME.drivers.join(', ')}</div>
            <div><strong>Province:</strong> KwaZulu-Natal</div>
          </div>
        </div>
        <div style={{padding:'0 14px 14px'}}>
          <button className="btn btn-outline btn-full"><i className="ti ti-download" /> Download QR</button>
        </div>
      </div>
    </div>
  )
}

export default function OwnerView({ activeNav }) {
  const [modal, setModal] = useState(null)
  const pages = [FleetPage, TaxisPage, DriversPage, EarningsPage, MyQRPage]
  const Page = pages[activeNav] || pages[0]
  return (
    <>
      <Page setModal={setModal} />
      {modal === 'addTaxi'   && <AddTaxiModal   onClose={() => setModal(null)} />}
      {modal === 'addDriver' && <AddDriverModal  onClose={() => setModal(null)} />}
    </>
  )
}
