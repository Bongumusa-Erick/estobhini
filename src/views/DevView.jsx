import React, { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import Modal, { ModalHeader } from '../components/Modal.jsx'
import QRDisplay from '../components/QRDisplay.jsx'
import { ASSOCIATIONS, OWNERS, DRIVERS, AUDIT_LOGS, LEVEL_META } from '../data/db.js'

const today = new Date().toISOString().split('T')[0]

function LevelPill({ level }) {
  const meta = LEVEL_META[level] || LEVEL_META.Local
  const cls = { National:'red', Provincial:'purple', Regional:'blue', District:'orange', Local:'green' }
  return <span className={`pill ${cls[level]||'green'}`}>{level}</span>
}

// ─── Modals ───────────────────────────────────────────────────────

function AssocQRModal({ assoc, onClose }) {
  const data = { id: assoc.qrId, type: 'ASSOCIATION', name: assoc.fullName, level: assoc.level, province: assoc.province, region: assoc.region, district: assoc.district, local: assoc.local, routes: assoc.routes, owners: assoc.owners, issued: today }
  return (
    <Modal onClose={onClose}>
      <ModalHeader title="Association QR Code" onClose={onClose} />
      <QRDisplay data={data} title={assoc.fullName} subtitle={assoc.qrId} size={160}>
        <LevelPill level={assoc.level} />
        <div className="qr-meta">
          <div><strong>Province:</strong> {assoc.province}</div>
          <div><strong>Region:</strong> {assoc.region}</div>
          <div><strong>District:</strong> {assoc.district}</div>
          <div><strong>Local:</strong> {assoc.local}</div>
          <div><strong>Routes:</strong> {assoc.routes.join(', ')}</div>
          <div><strong>Owners registered:</strong> {assoc.owners}</div>
          <div><strong>Issued:</strong> {today}</div>
        </div>
      </QRDisplay>
      <button className="btn btn-outline btn-full"><i className="ti ti-download" /> Download QR</button>
    </Modal>
  )
}

function OwnerQRModal({ owner, onClose }) {
  const assoc = ASSOCIATIONS.find(a => a.id === owner.assocId)
  const data = { id: owner.qrId, type: 'TAXI_OWNER', name: owner.name, association: assoc?.fullName, assocLevel: assoc?.level, taxis: owner.taxis, routes: owner.routes, drivers: owner.drivers, province: 'KwaZulu-Natal', issued: today }
  return (
    <Modal onClose={onClose}>
      <ModalHeader title="Taxi Owner QR Code" onClose={onClose} />
      <QRDisplay data={data} title={owner.name} subtitle={owner.qrId} size={160}>
        <span className="pill orange">Taxi Owner · {assoc?.level}</span>
        <div className="qr-meta">
          <div><strong>Association:</strong> {assoc?.fullName}</div>
          <div><strong>Taxis:</strong> {owner.taxis.join(', ')}</div>
          <div><strong>Routes:</strong> {owner.routes.join(', ')}</div>
          <div><strong>Drivers:</strong> {owner.drivers.join(', ')}</div>
          <div><strong>Province:</strong> KwaZulu-Natal</div>
          <div><strong>Issued:</strong> {today}</div>
        </div>
      </QRDisplay>
      <button className="btn btn-outline btn-full"><i className="ti ti-download" /> Download QR</button>
    </Modal>
  )
}

function DevQRModal({ onClose }) {
  const data = { id: 'DEV-eStobhini-KZN-v1', platform: 'eStobhini', role: 'Developer', region: 'KwaZulu-Natal Pilot', access: 'FULL_SYSTEM_ADMIN', issued: today }
  return (
    <Modal onClose={onClose}>
      <ModalHeader title="Developer QR Code" onClose={onClose} />
      <QRDisplay data={data} title="eStobhini Developer Handle" subtitle="DEV-eStobhini-KZN-v1" size={160}>
        <span className="pill dark">Full System Admin</span>
      </QRDisplay>
    </Modal>
  )
}

function RegAssocModal({ onClose }) {
  return (
    <Modal onClose={onClose}>
      <ModalHeader title="Register Association" onClose={onClose} />
      <div className="form-group"><label>Association full name</label><input placeholder="e.g. Hillcrest Local Taxi Association" /></div>
      <div className="form-grid-2">
        <div className="form-group">
          <label>Level</label>
          <select>
            <option>Local</option><option>District</option><option>Regional</option>
            <option>Provincial</option><option>National (SANTACO)</option>
          </select>
        </div>
        <div className="form-group">
          <label>Province</label>
          <select>
            <option>KwaZulu-Natal</option><option>Gauteng</option>
            <option>Western Cape</option><option>Eastern Cape</option><option>All Provinces</option>
          </select>
        </div>
      </div>
      <div className="form-group">
        <label>Region</label>
        <select><option>Durban</option><option>Pietermaritzburg</option><option>Richards Bay</option><option>All KZN Regions</option></select>
      </div>
      <div className="form-grid-2">
        <div className="form-group"><label>District</label><input placeholder="e.g. Pinetown" /></div>
        <div className="form-group"><label>Local area</label><input placeholder="e.g. Dassenhoek" /></div>
      </div>
      <div className="form-group"><label>Primary route(s)</label><input placeholder="e.g. Hillcrest → Pinetown" /></div>
      <div className="form-group"><label>Chairperson name</label><input placeholder="Full name" /></div>
      <div className="form-group"><label>Contact number</label><input placeholder="+27 ..." /></div>
      <button className="btn btn-dark btn-full" onClick={onClose}><i className="ti ti-check" /> Register & Generate QR</button>
    </Modal>
  )
}

function RegOwnerModal({ onClose }) {
  return (
    <Modal onClose={onClose}>
      <ModalHeader title="Register Taxi Owner" onClose={onClose} />
      <div className="form-group"><label>Full name</label><input placeholder="Owner full name" /></div>
      <div className="form-group"><label>SA ID number</label><input placeholder="13-digit SA ID" /></div>
      <div className="form-group">
        <label>Association</label>
        <select>{ASSOCIATIONS.map(a => <option key={a.id} value={a.id}>{a.fullName} ({a.level})</option>)}</select>
      </div>
      <div className="form-group"><label>Contact number</label><input placeholder="+27 ..." /></div>
      <div className="form-group"><label>Operating route(s)</label><input placeholder="e.g. Dassenhoek → Pinetown" /></div>
      <div className="form-group"><label>Taxi plate number(s)</label><input placeholder="e.g. ND 123-AB, ND 456-CD" /></div>
      <button className="btn btn-green btn-full" onClick={onClose}><i className="ti ti-check" /> Register & Generate QR</button>
    </Modal>
  )
}

// ─── Pages ────────────────────────────────────────────────────────

function HandlePage({ setModal }) {
  return (
    <div className="view fade-in">
      <div className="dev-header">
        <div className="dh-row">
          <div className="dev-title"><i className="ti ti-code" /> Developer Handle — eStobhini</div>
          <span className="pill dark">KZN Pilot v1.0</span>
        </div>
        <div className="dev-info">
          <span style={{color:'#00C566'}}>●</span> Pilot region: <strong>KwaZulu-Natal</strong><br />
          <span style={{color:'#00C566'}}>●</span> Starting local: <strong>Dassenhoek, Pinetown</strong><br />
          <span style={{color:'#00C566'}}>●</span> National body: <strong>SANTACO</strong>
        </div>
        <div className="stat-grid">
          <div className="stat-box"><div className="snum">{ASSOCIATIONS.length}</div><div className="slbl">Associations</div></div>
          <div className="stat-box"><div className="snum">{OWNERS.length}</div><div className="slbl">Owners</div></div>
          <div className="stat-box"><div className="snum">{DRIVERS.length}</div><div className="slbl">Drivers</div></div>
          <div className="stat-box"><div className="snum">{ASSOCIATIONS.length + OWNERS.length + DRIVERS.length}</div><div className="slbl">QR Codes</div></div>
          <div className="stat-box"><div className="snum">21</div><div className="slbl">Taxis</div></div>
          <div className="stat-box"><div className="snum">5</div><div className="slbl">Levels</div></div>
        </div>
        <div className="row">
          <button className="btn btn-dark" onClick={() => setModal('regAssoc')}><i className="ti ti-building-plus" /> Register Association</button>
          <button className="btn btn-green" onClick={() => setModal('devQR')}><i className="ti ti-qrcode" /> Dev QR</button>
        </div>
      </div>

      <div className="slabel">KZN Association Hierarchy</div>
      <div className="hier-tree">
        {[
          { assocId:'A001', indent:'', label:'SANTACO — South African National Taxi Council', sub:'National · 1,840 owners across SA', icon:'ti-flag', color:'#FEE2E2', fg:'#991B1B', level:'National' },
          { assocId:'A002', indent:'indent-1', label:'KZN Provincial Taxi Council', sub:'KwaZulu-Natal Province · 420 owners', icon:'ti-building', color:'#F5F3FF', fg:'#6D28D9', level:'Provincial' },
          { assocId:'A003', indent:'indent-2', label:'Durban Regional Taxi Council', sub:'eThekwini Metro · 185 owners', icon:'ti-building', color:'#EFF6FF', fg:'#1D4ED8', level:'Regional' },
          { assocId:'A004', indent:'indent-3', label:'Pinetown District Taxi Association', sub:'Pinetown · 48 owners', icon:'ti-building', color:'#FFF7ED', fg:'#9A3412', level:'District' },
          { assocId:'A005', indent:'indent-4', label:'Dassenhoek Local Taxi Association', sub:'Dassenhoek · 14 owners', icon:'ti-building', color:'#E6FBF2', fg:'#009950', level:'Local' },
        ].map(n => (
          <div key={n.assocId} className={`tree-node ${n.indent}`} onClick={() => setModal({ type:'assocQR', id:n.assocId })}>
            <div className="tn-icon" style={{background:n.color}}>
              <i className={`ti ${n.icon}`} style={{color:n.fg}} />
            </div>
            <div className="tn-info">
              <div className="tn-name">{n.label}</div>
              <div className="tn-sub">{n.sub}</div>
            </div>
            <LevelPill level={n.level} />
          </div>
        ))}
      </div>
    </div>
  )
}

function AssocsPage({ setModal }) {
  return (
    <div className="view fade-in">
      <div className="row-sb">
        <div className="slabel">All registered associations</div>
        <button className="btn btn-dark btn-sm" onClick={() => setModal('regAssoc')}><i className="ti ti-plus" /> Register</button>
      </div>
      <div className="card">
        {ASSOCIATIONS.map(a => {
          const cls = { National:'red', Provincial:'purple', Regional:'blue', District:'orange', Local:'green' }
          const meta = LEVEL_META[a.level]
          return (
            <div key={a.id} className="list-item">
              <div className="li-icon" style={{background:meta.bg}}>
                <i className="ti ti-building" style={{color:meta.fg}} />
              </div>
              <div className="li-info">
                <div className="li-name">{a.fullName}</div>
                <div className="li-sub">{a.district} · {a.owners} owners · {a.routes.length} route(s)</div>
              </div>
              <div className="li-right" style={{display:'flex',flexDirection:'column',gap:4,alignItems:'flex-end'}}>
                <LevelPill level={a.level} />
                <button className="btn btn-outline btn-sm" onClick={() => setModal({ type:'assocQR', id:a.id })}><i className="ti ti-qrcode" /> QR</button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function OwnersPage({ setModal }) {
  return (
    <div className="view fade-in">
      <div className="row-sb">
        <div className="slabel">Registered taxi owners</div>
        <button className="btn btn-green btn-sm" onClick={() => setModal('regOwner')}><i className="ti ti-plus" /> Add Owner</button>
      </div>
      <div className="card">
        {OWNERS.map(o => {
          const assoc = ASSOCIATIONS.find(a => a.id === o.assocId)
          return (
            <div key={o.id} className="list-item">
              <div className="li-icon" style={{background:'#FFF7ED'}}>
                <i className="ti ti-user" style={{color:'#9A3412'}} />
              </div>
              <div className="li-info">
                <div className="li-name">{o.name}</div>
                <div className="li-sub">{assoc?.name} · {o.taxis.length} taxi(s) · {o.drivers.length} driver(s)</div>
              </div>
              <div className="li-right" style={{display:'flex',flexDirection:'column',gap:4,alignItems:'flex-end'}}>
                <span className="pill green">Active</span>
                <button className="btn btn-outline btn-sm" onClick={() => setModal({ type:'ownerQR', id:o.id })}><i className="ti ti-qrcode" /> QR</button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function QRHubPage({ setModal }) {
  return (
    <div className="view fade-in">
      <div className="slabel">Association QR codes</div>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10}}>
        {ASSOCIATIONS.map(a => {
          const cls = { National:'red', Provincial:'purple', Regional:'blue', District:'orange', Local:'green' }
          const data = JSON.stringify({ id:a.qrId, name:a.name, level:a.level })
          return (
            <div key={a.id} className="card" style={{cursor:'pointer'}} onClick={() => setModal({ type:'assocQR', id:a.id })}>
              <div className="card-body" style={{textAlign:'center', padding:10, display:'flex', flexDirection:'column', alignItems:'center', gap:6}}>
                <QRCodeSVG value={data} size={90} bgColor="#fff" fgColor="#000" level="M" />
                <div style={{fontSize:10, fontWeight:600}}>{a.name.substring(0,22)}{a.name.length>22?'...':''}</div>
                <div style={{fontSize:9, color:'#6B7280', fontFamily:'monospace'}}>{a.qrId}</div>
                <LevelPill level={a.level} />
              </div>
            </div>
          )
        })}
      </div>
      <div className="slabel">Owner QR codes</div>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10}}>
        {OWNERS.map(o => {
          const data = JSON.stringify({ id:o.qrId, name:o.name, taxis:o.taxis })
          return (
            <div key={o.id} className="card" style={{cursor:'pointer'}} onClick={() => setModal({ type:'ownerQR', id:o.id })}>
              <div className="card-body" style={{textAlign:'center', padding:10, display:'flex', flexDirection:'column', alignItems:'center', gap:6}}>
                <QRCodeSVG value={data} size={90} bgColor="#fff" fgColor="#000" level="M" />
                <div style={{fontSize:10, fontWeight:600}}>{o.name}</div>
                <div style={{fontSize:9, color:'#6B7280', fontFamily:'monospace'}}>{o.qrId}</div>
                <span className="pill orange">Owner</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function AuditPage() {
  return (
    <div className="view fade-in">
      <div className="slabel">Audit log</div>
      <div className="card">
        {AUDIT_LOGS.map((l, i) => (
          <div key={i} className="list-item">
            <div className="li-icon" style={{background:'#F0F2F5'}}>
              <i className="ti ti-clipboard-list" style={{color:'#6B7280'}} />
            </div>
            <div className="li-info">
              <div className="li-name">{l.action}</div>
              <div className="li-sub">{l.subject} · by {l.by}</div>
            </div>
            <div style={{fontSize:10, color:'#6B7280', whiteSpace:'nowrap'}}>{l.time}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── DevView ──────────────────────────────────────────────────────
export default function DevView({ activeNav }) {
  const [modal, setModal] = useState(null)

  const pages = [HandlePage, AssocsPage, OwnersPage, QRHubPage, AuditPage]
  const Page = pages[activeNav] || pages[0]

  const closeModal = () => setModal(null)

  return (
    <>
      <Page setModal={setModal} />

      {modal === 'devQR' && <DevQRModal onClose={closeModal} />}
      {modal === 'regAssoc' && <RegAssocModal onClose={closeModal} />}
      {modal === 'regOwner' && <RegOwnerModal onClose={closeModal} />}
      {modal?.type === 'assocQR' && (
        <AssocQRModal assoc={ASSOCIATIONS.find(a => a.id === modal.id)} onClose={closeModal} />
      )}
      {modal?.type === 'ownerQR' && (
        <OwnerQRModal owner={OWNERS.find(o => o.id === modal.id)} onClose={closeModal} />
      )}
    </>
  )
}
