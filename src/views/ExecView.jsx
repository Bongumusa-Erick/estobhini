import React, { useState } from 'react'
import Modal, { ModalHeader } from '../components/Modal.jsx'
import { ASSOCIATIONS, ROUTES, SPECIAL_TRIPS, LEVEL_META, LONG_DISTANCE_ROUTES, FINANCE, DEV_FINANCE } from '../data/db.js'

function SpecialModal({ onClose }) {
  return (
    <Modal onClose={onClose}>
      <ModalHeader title="Book Special Trip" onClose={onClose} />
      <div className="form-group"><label>Trip name</label><input placeholder="e.g. Community event" /></div>
      <div className="form-grid-2">
        <div className="form-group"><label>Date</label><input type="date" /></div>
        <div className="form-group"><label>Taxis needed</label><input type="number" placeholder="5" /></div>
      </div>
      <div className="form-group"><label>Route</label><input placeholder="From → To" /></div>
      <div className="form-group"><label>Association</label>
        <select>{ASSOCIATIONS.map(a=><option key={a.id}>{a.name}</option>)}</select>
      </div>
      <button className="btn btn-purple btn-full" onClick={onClose}>Submit for Approval</button>
    </Modal>
  )
}

function RegOwnerModal({ assoc, onClose }) {
  const [numTaxis, setNumTaxis] = useState(1)
  return (
    <Modal onClose={onClose}>
      <ModalHeader title={`Register Owner — ${assoc?.name}`} onClose={onClose} />
      <div style={{background:'var(--green-light)',borderRadius:8,padding:8,fontSize:11,color:'#009950',marginBottom:4}}>
        Association: <strong>{assoc?.fullName}</strong> ({assoc?.level})
      </div>
      <div className="form-group"><label>Owner full name</label><input placeholder="Full name" /></div>
      <div className="form-group"><label>SA ID number</label><input placeholder="13-digit SA ID" /></div>
      <div className="form-group"><label>Contact number</label><input placeholder="+27 ..." /></div>
      <div className="form-group"><label>Number of vehicles</label>
        <select value={numTaxis} onChange={e=>setNumTaxis(Number(e.target.value))}>
          {[1,2,3,4,5,6,7,8,9,10].map(n=><option key={n} value={n}>{n} vehicle{n>1?'s':''}</option>)}
        </select>
      </div>
      {Array.from({length:numTaxis}).map((_,i)=>(
        <div key={i} style={{border:'1px solid var(--border)',borderRadius:8,padding:10,display:'flex',flexDirection:'column',gap:8}}>
          <div style={{fontSize:11,fontWeight:600}}>Vehicle {i+1}</div>
          <div className="form-group"><label>Plate number</label><input placeholder={`e.g. ND ${100+i*10}-AB`} /></div>
          <div className="form-group"><label>Model</label>
            <select>
              {['Toyota Quantum 2.5 D-4D (15 seat)','Toyota HiAce (14 seat)','Iveco Daily 50C (22 seat)','Mercedes-Benz Sprinter (22 seat)'].map(m=><option key={m}>{m}</option>)}
            </select>
          </div>
          <div className="form-group"><label>Route</label>
            <select>{(assoc?.routes||[]).map(r=><option key={r}>{r}</option>)}</select>
          </div>
        </div>
      ))}
      <div className="form-group"><label>Owner bank account</label><input placeholder="Bank name" /></div>
      <div className="form-grid-2">
        <div className="form-group"><label>Account number</label><input placeholder="Account no." /></div>
        <div className="form-group"><label>Branch code</label><input placeholder="Branch code" /></div>
      </div>
      <div style={{background:'var(--surface2)',borderRadius:8,padding:10,fontSize:11,color:'var(--text2)'}}>
        <strong style={{color:'var(--text)'}}>Auto-deduction:</strong> 5% per driver shift → Association → Developer (70/30 split)
      </div>
      <button className="btn btn-green btn-full" onClick={onClose}><i className="ti ti-check" /> Register Owner & Generate QR</button>
    </Modal>
  )
}

function AddRouteModal({ onClose }) {
  return (
    <Modal onClose={onClose}>
      <ModalHeader title="Add Route & Set Amounts" onClose={onClose} />
      <div className="form-group"><label>Route name</label><input placeholder="e.g. Durban CBD → Hillcrest" /></div>
      <div className="form-group"><label>Association</label>
        <select>{ASSOCIATIONS.map(a=><option key={a.id}>{a.fullName} ({a.level})</option>)}</select>
      </div>
      <div className="form-group"><label>Single trip fare</label><input placeholder="R18" /></div>
      <div className="form-grid-2">
        <div className="form-group"><label>Weekly Unite</label><input placeholder="R90" /></div>
        <div className="form-group"><label>Monthly Unite</label><input placeholder="R300" /></div>
      </div>
      <div className="form-group"><label>Frequency</label><input placeholder="Every 8 min" /></div>
      <button className="btn btn-purple btn-full" onClick={onClose}><i className="ti ti-check" /> Save Route</button>
    </Modal>
  )
}

function FinanceModal({ onClose }) {
  return (
    <Modal onClose={onClose}>
      <ModalHeader title="Association Finance" onClose={onClose} />
      <div style={{display:'flex',flexDirection:'column',gap:8}}>
        {ASSOCIATIONS.filter(a=>a.type==='local').map(a=>(
          <div key={a.id} style={{background:'var(--surface2)',borderRadius:8,padding:10}}>
            <div style={{fontSize:12,fontWeight:600,color:'var(--text)',marginBottom:6}}>{a.name}</div>
            <div className="row-sb"><span style={{fontSize:11,color:'var(--text2)'}}>Bank</span><span style={{fontSize:11}}>{a.bankAccount?.bank}</span></div>
            <div className="row-sb"><span style={{fontSize:11,color:'var(--text2)'}}>Account</span><span style={{fontSize:11}}>{a.bankAccount?.accountNo}</span></div>
            <div className="row-sb"><span style={{fontSize:11,color:'var(--text2)'}}>5% commission</span><span style={{fontSize:11,color:'#EF4444',fontWeight:600}}>Auto → Developer</span></div>
            <div className="row-sb" style={{marginTop:4}}><span style={{fontSize:11,color:'var(--text2)'}}>Dev split</span><span style={{fontSize:11}}>70% dev / 30% bonus pool</span></div>
          </div>
        ))}
      </div>
    </Modal>
  )
}

function OverviewPage({ setModal }) {
  return (
    <div className="view fade-in">
      <div className="hero">
        <div className="hero-badge"><i className="ti ti-map-pin" style={{fontSize:10}} /> KwaZulu-Natal · eStobhini Pilot</div>
        <h2>Association Executive</h2>
        <p>SANTACO → KZN → Durban → Pinetown → Dassenhoek + Long Distance</p>
      </div>
      <div className="stat-grid">
        <div className="stat-box"><div className="snum">14,200</div><div className="slbl">KZN Riders</div></div>
        <div className="stat-box"><div className="snum">667</div><div className="slbl">Owners</div></div>
        <div className="stat-box"><div className="snum">R162K</div><div className="slbl">Revenue</div></div>
        <div className="stat-box"><div className="snum">{ASSOCIATIONS.length}</div><div className="slbl">Associations</div></div>
        <div className="stat-box"><div className="snum">78%</div><div className="slbl">Cashless</div></div>
        <div className="stat-box"><div className="snum">87%</div><div className="slbl">Compliance</div></div>
      </div>

      {/* Finance summary */}
      <div className="card">
        <div className="card-header">
          <span className="ch-title">💰 Revenue & commission flow</span>
          <button className="btn btn-outline btn-sm" onClick={()=>setModal('finance')}>Details</button>
        </div>
        <div className="card-body" style={{display:'flex',flexDirection:'column',gap:6}}>
          {[
            {l:`Driver 5% → Association`,v:'R98,500',c:'#F59E0B'},
            {l:`Association 5% → Developer`,v:DEV_FINANCE.assocCuts,c:'#F59E0B'},
            {l:`Dev account (${FINANCE.devPlatformSplit}%)`,v:DEV_FINANCE.devAccount,c:'#00C566'},
            {l:`Bonus pool (${FINANCE.devBonusReserve}%)`,v:DEV_FINANCE.bonusPool,c:'#8B5CF6'},
          ].map((r,i)=>(
            <div key={i} className="row-sb" style={{padding:'4px 0',borderBottom:'1px solid var(--border)'}}>
              <span style={{fontSize:11,color:'var(--text2)'}}>{r.l}</span>
              <span style={{fontSize:12,fontWeight:700,color:r.c}}>{r.v}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="slabel">All associations</div>
      <div className="card">
        {ASSOCIATIONS.map(a=>{
          const meta=LEVEL_META[a.level]||LEVEL_META.Local
          const cls={National:'red',Provincial:'purple',Regional:'blue',District:'orange',Local:'green'}
          return (
            <div key={a.id} className="list-item">
              <div className="li-icon" style={{background:meta.bg}}>
                {a.logo?<img src={a.logo} style={{width:24,height:24,borderRadius:4,objectFit:'cover'}} />:<i className={`ti ${a.type==='longdistance'?'ti-road':'ti-building'}`} style={{color:meta.fg}} />}
              </div>
              <div className="li-info">
                <div className="li-name">{a.fullName}</div>
                <div className="li-sub">{a.type==='longdistance'?'Long distance':'Local'} · {a.owners} owners</div>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:3,alignItems:'flex-end'}}>
                <span className={`pill ${cls[a.level]||'blue'}`}>{a.level}</span>
                <button className="btn btn-outline btn-sm" style={{fontSize:9,padding:'2px 6px'}} onClick={()=>setModal({type:'regOwner',assocId:a.id})}>+ Owner</button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function RoutesPage({ setModal }) {
  const perf=[
    {n:'Dassenhoek → Pinetown',t:210,s:88,w:75,m:250},
    {n:'Dassenhoek → Durban CBD',t:180,s:82,w:75,m:250},
    {n:'Pinetown → Durban CBD',t:390,s:91,w:80,m:260},
    {n:'Dassenhoek → New Germany',t:140,s:76,w:75,m:250},
    {n:'Pinetown → Westville',t:95,s:70,w:80,m:260},
    {n:'Dassenhoek → Hillcrest',t:75,s:65,w:75,m:250},
  ]
  return (
    <div className="view fade-in">
      <div className="row-sb">
        <div className="slabel">Local routes</div>
        <button className="btn btn-purple btn-sm" onClick={()=>setModal('addRoute')}><i className="ti ti-plus" /> Add Route</button>
      </div>
      <div className="card">
        {perf.map((r,i)=>(
          <div key={i} className="list-item">
            <div className="li-info">
              <div className="li-name">{r.n}</div>
              <div style={{display:'flex',alignItems:'center',gap:6,margin:'4px 0'}}>
                <div className="bar-track"><div className={`bar-fill ${r.s>=85?'green':r.s>=75?'amber':'red'}`} style={{width:`${r.s}%`}} /></div>
                <span style={{fontSize:10,color:'var(--text2)',minWidth:28}}>{r.s}%</span>
              </div>
              <div style={{fontSize:10,color:'var(--text2)'}}>Weekly: <strong style={{color:'#009950'}}>R{r.w}</strong> · Monthly: <strong style={{color:'#6D28D9'}}>R{r.m}</strong></div>
            </div>
            <div className="li-right"><div style={{fontSize:13,fontWeight:600}}>{r.t}</div><div style={{fontSize:10,color:'var(--text2)'}}>trips/day</div></div>
          </div>
        ))}
      </div>
      <div className="slabel">Long distance routes</div>
      <div className="card">
        {LONG_DISTANCE_ROUTES.map((r,i)=>{
          const assoc=ASSOCIATIONS.find(a=>a.id===r.assocId)
          return (
            <div key={i} className="list-item">
              <div className="li-icon" style={{background:'#EFF6FF'}}><i className="ti ti-road" style={{color:'#1D4ED8'}} /></div>
              <div className="li-info">
                <div className="li-name">{r.name}</div>
                <div className="li-sub">{assoc?.name} · {r.time} · {r.departs}</div>
              </div>
              <div style={{fontSize:14,fontWeight:700,color:'#009950'}}>{r.fare}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function SpecialPage({ setModal }) {
  return (
    <div className="view fade-in">
      <div className="row-sb">
        <div className="slabel">Special trips</div>
        <button className="btn btn-purple btn-sm" onClick={()=>setModal('special')}><i className="ti ti-plus" /> Book</button>
      </div>
      <div className="card">
        {SPECIAL_TRIPS.map((t,i)=>(
          <div key={i} className="list-item">
            <div className="li-icon" style={{background:'var(--surface2)'}}><i className={`ti ${t.icon}`} style={{color:'var(--text2)'}} /></div>
            <div className="li-info"><div className="li-name">{t.name}</div><div className="li-sub">{t.date} · {t.taxis} taxis · {t.assoc}</div></div>
            <button className="btn btn-green btn-sm">Approve</button>
          </div>
        ))}
      </div>
    </div>
  )
}

function ReportsPage() {
  return (
    <div className="view fade-in">
      <div className="slabel">Reports</div>
      <div className="card"><div className="card-body" style={{display:'flex',flexDirection:'column',gap:8}}>
        {['KZN Monthly revenue','Dassenhoek utilisation','Pinetown compliance','Driver performance','Commission audit','Long distance revenue'].map((r,i)=>(
          <div key={i} className="row-sb" style={{padding:'7px 0',borderBottom:'1px solid var(--border)'}}>
            <span style={{fontSize:12}}><i className="ti ti-file-text" style={{marginRight:6}} />{r}</span>
            <button className="btn btn-outline btn-sm"><i className="ti ti-download" /></button>
          </div>
        ))}
      </div></div>
    </div>
  )
}

function AdminPage() {
  return (
    <div className="view fade-in">
      <div className="slabel">Admin settings</div>
      <div className="card"><div className="card-body" style={{display:'flex',flexDirection:'column',gap:8}}>
        {['Set token pricing per route','Configure compliance scoring','Upload association logo','Manage permissions','Broadcast announcement','Suspend / reinstate association','Configure long distance routes'].map((a,i)=>(
          <button key={i} className={`btn btn-full ${i<2?'btn-purple':'btn-outline'}`}>{a}</button>
        ))}
      </div></div>
    </div>
  )
}

export default function ExecView({ activeNav }) {
  const [modal, setModal] = useState(null)
  const pages=[OverviewPage,RoutesPage,SpecialPage,ReportsPage,AdminPage]
  const Page=pages[activeNav]||pages[0]
  const assocForOwner = modal?.type==='regOwner' ? ASSOCIATIONS.find(a=>a.id===modal.assocId) : null
  return (
    <>
      <Page setModal={setModal} />
      {modal==='special'         && <SpecialModal  onClose={()=>setModal(null)} />}
      {modal==='addRoute'        && <AddRouteModal onClose={()=>setModal(null)} />}
      {modal==='finance'         && <FinanceModal  onClose={()=>setModal(null)} />}
      {modal?.type==='regOwner'  && <RegOwnerModal assoc={assocForOwner} onClose={()=>setModal(null)} />}
    </>
  )
}
