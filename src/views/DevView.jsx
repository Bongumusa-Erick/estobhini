import React, { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import Modal, { ModalHeader } from '../components/Modal.jsx'
import { ASSOCIATIONS, OWNERS, DRIVERS, AUDIT_LOGS, LEVEL_META, DEV_FINANCE, FINANCE } from '../data/db.js'

const today = new Date().toISOString().split('T')[0]

function LevelPill({ level }) {
  const cls = { National:'red', Provincial:'purple', Regional:'blue', District:'orange', Local:'green' }
  return <span className={`pill ${cls[level]||'green'}`}>{level}</span>
}

// ─── Register Association Modal ───────────────────────────────────
function RegAssocModal({ onClose }) {
  const [type, setType] = useState('local')
  const [logo, setLogo] = useState(null)
  return (
    <Modal onClose={onClose}>
      <ModalHeader title="Register Association" onClose={onClose} />
      <div className="form-group"><label>Type</label>
        <select value={type} onChange={e=>setType(e.target.value)}>
          <option value="local">Local / District / Regional / Provincial / National</option>
          <option value="longdistance">Long Distance Association</option>
        </select>
      </div>
      <div className="form-group"><label>Full name</label><input placeholder="e.g. Hillcrest Local Taxi Association" /></div>
      <div className="form-grid-2">
        <div className="form-group"><label>Level</label>
          <select><option>Local</option><option>District</option><option>Regional</option><option>Provincial</option><option>National</option></select>
        </div>
        <div className="form-group"><label>Province</label>
          <select><option>KwaZulu-Natal</option><option>Gauteng</option><option>Western Cape</option><option>Eastern Cape</option><option>All</option></select>
        </div>
      </div>
      {type==='local' ? <>
        <div className="form-grid-2">
          <div className="form-group"><label>District</label><input placeholder="e.g. Pinetown" /></div>
          <div className="form-group"><label>Local area</label><input placeholder="e.g. Dassenhoek" /></div>
        </div>
        <div className="form-group"><label>Primary routes</label><input placeholder="e.g. Hillcrest → Pinetown" /></div>
        <div className="form-grid-2">
          <div className="form-group"><label>Single trip fare</label><input placeholder="R12" /></div>
          <div className="form-group"><label>Weekly Unite</label><input placeholder="R75" /></div>
        </div>
        <div className="form-group"><label>Monthly Unite</label><input placeholder="R250" /></div>
      </> : <>
        <div className="form-group"><label>Long distance routes</label><input placeholder="e.g. Durban → Johannesburg, Durban → Cape Town" /></div>
        <div className="form-group"><label>Single trip fare (per route)</label><input placeholder="e.g. R350 per route" /></div>
        <div className="form-group"><label>Departure times</label><input placeholder="e.g. 06:00, 08:00, 12:00" /></div>
      </>}
      <div className="form-group"><label>Association logo</label>
        <input type="file" accept="image/*" onChange={e=>setLogo(e.target.files[0])} style={{padding:'6px'}} />
        <div style={{fontSize:10,color:'var(--text2)',marginTop:4}}>Logo will appear on all owner, manager, driver and rider handles for this association.</div>
      </div>
      <div className="form-group"><label>Chairperson name</label><input placeholder="Full name" /></div>
      <div className="form-group"><label>Contact number</label><input placeholder="+27 ..." /></div>
      <div style={{background:'var(--surface2)',borderRadius:8,padding:10,fontSize:11,color:'var(--text2)'}}>
        <strong style={{color:'var(--text)'}}>Auto deductions on registration:</strong><br/>
        · 5% of all driver earnings → Association<br/>
        · 5% of Association revenue → Developer (70% dev / 30% bonus pool)
      </div>
      <div className="form-group"><label>Receiving bank account</label><input placeholder="Bank name" /></div>
      <div className="form-grid-2">
        <div className="form-group"><label>Account number</label><input placeholder="Account no." /></div>
        <div className="form-group"><label>Branch code</label><input placeholder="Branch code" /></div>
      </div>
      <button className="btn btn-dark btn-full" onClick={onClose}><i className="ti ti-check" /> Register & Generate QR</button>
    </Modal>
  )
}

// ─── Register Owner Modal (on Association) ────────────────────────
function RegOwnerModal({ assoc, onClose }) {
  const [numTaxis, setNumTaxis] = useState(1)
  return (
    <Modal onClose={onClose}>
      <ModalHeader title={`Register Owner — ${assoc?.name||'Association'}`} onClose={onClose} />
      <div style={{background:'var(--green-light)',borderRadius:8,padding:8,fontSize:11,color:'#009950',marginBottom:4}}>
        Registering under: <strong>{assoc?.fullName}</strong> ({assoc?.level})
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
          <div style={{fontSize:11,fontWeight:600,color:'var(--text)'}}>Vehicle {i+1}</div>
          <div className="form-group"><label>Plate number (KZN)</label><input placeholder={`e.g. ND ${100+i*10}-AB`} /></div>
          <div className="form-group"><label>Taxi model</label>
            <select>
              {['Toyota Quantum 2.5 D-4D (15 seat)','Toyota HiAce (14 seat)','Iveco Daily 50C (22 seat)','Mercedes-Benz Sprinter (22 seat)','Volkswagen Crafter (22 seat)'].map(m=><option key={m}>{m}</option>)}
            </select>
          </div>
          <div className="form-group"><label>Operating route</label>
            <select>{(assoc?.routes||[]).map(r=><option key={r}>{r}</option>)}</select>
          </div>
        </div>
      ))}
      <div className="form-group"><label>Receiving bank account</label><input placeholder="Bank name" /></div>
      <div className="form-grid-2">
        <div className="form-group"><label>Account number</label><input placeholder="Account no." /></div>
        <div className="form-group"><label>Branch code</label><input placeholder="Branch code" /></div>
      </div>
      <div style={{background:'var(--surface2)',borderRadius:8,padding:10,fontSize:11,color:'var(--text2)'}}>
        <strong style={{color:'var(--text)'}}>On registration:</strong><br/>
        · Owner gets QR code with all {numTaxis} vehicle{numTaxis>1?'s':''}<br/>
        · 5% commission deducted per driver shift end<br/>
        · Daily cashout auto-transfers to bank account
      </div>
      <button className="btn btn-green btn-full" onClick={onClose}><i className="ti ti-check" /> Register Owner & Generate QR</button>
    </Modal>
  )
}

// ─── Association QR Modal ─────────────────────────────────────────
function AssocQRModal({ assoc, onClose }) {
  if (!assoc) return null
  const data = {id:assoc.qrId,type:'ASSOCIATION',name:assoc.fullName,level:assoc.level,province:assoc.province,routes:assoc.routes,issued:today}
  return (
    <Modal onClose={onClose}>
      <ModalHeader title="Association QR Code" onClose={onClose} />
      <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:10,padding:'8px 0'}}>
        {assoc.logo && <img src={assoc.logo} alt="logo" style={{width:60,height:60,borderRadius:10,objectFit:'cover'}} />}
        <div style={{background:'#fff',borderRadius:12,padding:12,border:'1px solid var(--border)'}}>
          <QRCodeSVG value={JSON.stringify(data)} size={160} bgColor="#fff" fgColor="#000" level="M" />
        </div>
        <div style={{fontFamily:'Space Grotesk',fontSize:13,fontWeight:700,textAlign:'center'}}>{assoc.fullName}</div>
        <div style={{fontSize:10,color:'var(--text2)',fontFamily:'monospace'}}>{assoc.qrId}</div>
        <LevelPill level={assoc.level} />
        <div className="qr-meta">
          <div><strong>Province:</strong> {assoc.province}</div>
          <div><strong>Routes:</strong> {assoc.routes.join(', ')}</div>
          <div><strong>Owners:</strong> {assoc.owners}</div>
          <div><strong>Bank:</strong> {assoc.bankAccount?.bank} — {assoc.bankAccount?.accountNo}</div>
          <div><strong>5% commission:</strong> Auto-deducted to developer</div>
        </div>
      </div>
      <button className="btn btn-outline btn-full"><i className="ti ti-download" /> Download QR</button>
    </Modal>
  )
}

// ─── Dev Finance Modal ────────────────────────────────────────────
function DevFinanceModal({ onClose }) {
  return (
    <Modal onClose={onClose}>
      <ModalHeader title="Developer Finance Dashboard" onClose={onClose} />
      <div style={{background:'#1a1a2e',borderRadius:10,padding:14,display:'flex',flexDirection:'column',gap:10}}>
        <div style={{fontSize:12,fontWeight:600,color:'#00C566'}}>Revenue flow — eStobhini Platform</div>
        {[
          {label:'Total platform revenue',val:DEV_FINANCE.totalRevenue,color:'#e2e8f0'},
          {label:`Association 5% cuts (all assocs)`,val:DEV_FINANCE.assocCuts,color:'#F59E0B'},
          {label:`Driver 5% cuts (via owners)`,val:DEV_FINANCE.driverCuts,color:'#F59E0B'},
          {label:'Total developer inflow',val:DEV_FINANCE.devReceives,color:'#00C566'},
          {label:`${FINANCE.devPlatformSplit}% → Developer account`,val:DEV_FINANCE.devAccount,color:'#00C566'},
          {label:`${FINANCE.devBonusReserve}% → User bonus pool (free trips + points)`,val:DEV_FINANCE.bonusPool,color:'#8B5CF6'},
        ].map((r,i)=>(
          <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'6px 0',borderBottom:'1px solid #30363d'}}>
            <span style={{fontSize:11,color:'#9CA3AF'}}>{r.label}</span>
            <span style={{fontSize:13,fontWeight:700,color:r.color}}>{r.val}</span>
          </div>
        ))}
        <div style={{background:'#21262d',borderRadius:8,padding:10,fontSize:11,color:'#6B7280'}}>
          <strong style={{color:'#e2e8f0'}}>Developer bank account</strong><br/>
          {DEV_FINANCE.bankAccount.bank} — {DEV_FINANCE.bankAccount.accountName}<br/>
          {DEV_FINANCE.bankAccount.accountNo}
        </div>
        <div style={{fontSize:11,color:'#6B7280'}}>
          Free trips issued from bonus pool: <strong style={{color:'#8B5CF6'}}>{DEV_FINANCE.freeTripsIssued.toLocaleString()}</strong><br/>
          Active users: <strong style={{color:'#00C566'}}>{DEV_FINANCE.activeUsers.toLocaleString()}</strong>
        </div>
      </div>
    </Modal>
  )
}

// ─── Pages ────────────────────────────────────────────────────────
function HandlePage({ setModal }) {
  const localAssocs  = ASSOCIATIONS.filter(a=>a.type==='local')
  const ldAssocs     = ASSOCIATIONS.filter(a=>a.type==='longdistance')
  return (
    <div className="view fade-in">
      <div className="dev-header">
        <div className="dh-row">
          <div className="dev-title"><i className="ti ti-code" /> Developer Handle — eStobhini</div>
          <span className="pill dark">KZN Pilot v3.0</span>
        </div>
        <div className="dev-info">
          <span style={{color:'#00C566'}}>●</span> Pilot: <strong>KwaZulu-Natal</strong> — Dassenhoek, Pinetown<br/>
          <span style={{color:'#00C566'}}>●</span> National body: <strong>SANTACO</strong><br/>
          <span style={{color:'#8B5CF6'}}>●</span> Long distance: <strong>{ldAssocs.length} LD associations</strong>
        </div>
        <div className="stat-grid">
          <div className="stat-box"><div className="snum">{ASSOCIATIONS.length}</div><div className="slbl">Associations</div></div>
          <div className="stat-box"><div className="snum">{OWNERS.length}</div><div className="slbl">Owners</div></div>
          <div className="stat-box"><div className="snum">{DRIVERS.length}</div><div className="slbl">Drivers</div></div>
          <div className="stat-box"><div className="snum">{ldAssocs.length}</div><div className="slbl">LD Assocs</div></div>
          <div className="stat-box"><div className="snum">R72K</div><div className="slbl">Bonus pool</div></div>
          <div className="stat-box"><div className="snum">5%</div><div className="slbl">Commission</div></div>
        </div>
        <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
          <button className="btn btn-dark" onClick={()=>setModal('regAssoc')}><i className="ti ti-building-plus" /> Register Association</button>
          <button className="btn btn-green" onClick={()=>setModal('devFinance')}><i className="ti ti-chart-bar" /> Dev Finance</button>
          <button className="btn btn-outline" style={{color:'#a0aec0',borderColor:'#30363d'}} onClick={()=>setModal('devQR')}><i className="ti ti-qrcode" /> Dev QR</button>
        </div>
      </div>

      {/* Finance summary */}
      <div className="card" style={{borderColor:'#30363d',background:'#161b22'}}>
        <div className="card-header" style={{background:'#1a1a2e',borderColor:'#30363d'}}>
          <span style={{color:'#00C566',fontWeight:600}}>💰 Developer revenue split</span>
        </div>
        <div className="card-body" style={{display:'flex',flexDirection:'column',gap:8}}>
          {[
            {label:`Association 5% → Developer`,val:DEV_FINANCE.assocCuts,c:'#F59E0B'},
            {label:`Driver 5% → Association → Developer`,val:DEV_FINANCE.driverCuts,c:'#F59E0B'},
            {label:`${FINANCE.devPlatformSplit}% → Dev account`,val:DEV_FINANCE.devAccount,c:'#00C566'},
            {label:`${FINANCE.devBonusReserve}% → Bonus pool`,val:DEV_FINANCE.bonusPool,c:'#8B5CF6'},
          ].map((r,i)=>(
            <div key={i} className="row-sb" style={{padding:'4px 0',borderBottom:'1px solid #21262d'}}>
              <span style={{fontSize:11,color:'#9CA3AF'}}>{r.label}</span>
              <span style={{fontSize:12,fontWeight:700,color:r.c}}>{r.val}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="slabel">Local association hierarchy</div>
      <div className="hier-tree">
        {[
          {id:'A001',indent:'',level:'National'},
          {id:'A002',indent:'indent-1',level:'Provincial'},
          {id:'A003',indent:'indent-2',level:'Regional'},
          {id:'A004',indent:'indent-3',level:'District'},
          {id:'A005',indent:'indent-4',level:'Local'},
        ].map(n=>{
          const a=ASSOCIATIONS.find(x=>x.id===n.id); if(!a) return null
          const meta=LEVEL_META[n.level]
          return (
            <div key={n.id} className={`tree-node ${n.indent}`} onClick={()=>setModal({type:'assocQR',id:n.id})}>
              <div className="tn-icon" style={{background:meta.bg}}><i className="ti ti-building" style={{color:meta.fg}} /></div>
              <div className="tn-info">
                <div className="tn-name">{a.fullName}</div>
                <div className="tn-sub">{a.level} · {a.owners} owners · 5% commission</div>
              </div>
              <LevelPill level={n.level} />
            </div>
          )
        })}
      </div>

      <div className="slabel">Long distance associations</div>
      <div className="hier-tree">
        {ldAssocs.map(a=>(
          <div key={a.id} className="tree-node" onClick={()=>setModal({type:'assocQR',id:a.id})}>
            <div className="tn-icon" style={{background:'#EFF6FF'}}><i className="ti ti-road" style={{color:'#1D4ED8'}} /></div>
            <div className="tn-info">
              <div className="tn-name">{a.fullName}</div>
              <div className="tn-sub">LD · {a.owners} owners · {a.routes.join(', ').substring(0,40)}...</div>
            </div>
            <span className="pill blue">LD</span>
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
        <button className="btn btn-dark btn-sm" onClick={()=>setModal('regAssoc')}><i className="ti ti-plus" /> Register</button>
      </div>
      <div className="card">
        {ASSOCIATIONS.map(a=>{
          const meta=LEVEL_META[a.level]||LEVEL_META.Local
          const cls={National:'red',Provincial:'purple',Regional:'blue',District:'orange',Local:'green'}
          return (
            <div key={a.id} className="list-item">
              <div className="li-icon" style={{background:meta.bg}}>
                {a.logo ? <img src={a.logo} style={{width:24,height:24,borderRadius:4,objectFit:'cover'}} /> : <i className="ti ti-building" style={{color:meta.fg}} />}
              </div>
              <div className="li-info">
                <div className="li-name">{a.fullName}</div>
                <div className="li-sub">{a.type==='longdistance'?'Long distance':'Local'} · {a.owners} owners · 5% → dev</div>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:4,alignItems:'flex-end'}}>
                <span className={`pill ${cls[a.level]||'blue'}`}>{a.level}</span>
                <button className="btn btn-outline btn-sm" style={{padding:'2px 7px',fontSize:10}} onClick={()=>setModal({type:'regOwner',assocId:a.id})}>+ Owner</button>
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
        <button className="btn btn-green btn-sm" onClick={()=>setModal({type:'regOwner',assocId:'A005'})}><i className="ti ti-plus" /> Add Owner</button>
      </div>
      <div className="card">
        {OWNERS.map(o=>{
          const a=ASSOCIATIONS.find(x=>x.id===o.assocId)
          return (
            <div key={o.id} className="list-item">
              <div className="li-icon" style={{background:'#FFF7ED'}}><i className="ti ti-user" style={{color:'#9A3412'}} /></div>
              <div className="li-info">
                <div className="li-name">{o.name}</div>
                <div className="li-sub">{a?.name} · {o.taxis.length} taxi(s) · {o.drivers.length} driver(s)</div>
                <div className="li-sub">{o.bankAccount?.bank} — {o.bankAccount?.accountNo}</div>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:4,alignItems:'flex-end'}}>
                <span className="pill green">Active</span>
                <button className="btn btn-outline btn-sm" style={{padding:'2px 7px',fontSize:10}} onClick={()=>setModal({type:'ownerQR',id:o.id})}><i className="ti ti-qrcode" /></button>
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
      <div className="slabel">All QR codes</div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
        {ASSOCIATIONS.map(a=>{
          const cls={National:'red',Provincial:'purple',Regional:'blue',District:'orange',Local:'green'}
          return (
            <div key={a.id} className="card" style={{cursor:'pointer'}} onClick={()=>setModal({type:'assocQR',id:a.id})}>
              <div className="card-body" style={{textAlign:'center',padding:10,display:'flex',flexDirection:'column',alignItems:'center',gap:6}}>
                <QRCodeSVG value={JSON.stringify({id:a.qrId,name:a.name,level:a.level})} size={90} bgColor="#fff" fgColor="#000" level="M" />
                <div style={{fontSize:10,fontWeight:600}}>{a.name.substring(0,18)}{a.name.length>18?'...':''}</div>
                <span className={`pill ${cls[a.level]||'blue'}`} style={{fontSize:9}}>{a.level}</span>
              </div>
            </div>
          )
        })}
        {OWNERS.map(o=>(
          <div key={o.id} className="card" style={{cursor:'pointer'}} onClick={()=>setModal({type:'ownerQR',id:o.id})}>
            <div className="card-body" style={{textAlign:'center',padding:10,display:'flex',flexDirection:'column',alignItems:'center',gap:6}}>
              <QRCodeSVG value={JSON.stringify({id:o.qrId,name:o.name,taxis:o.taxis})} size={90} bgColor="#fff" fgColor="#000" level="M" />
              <div style={{fontSize:10,fontWeight:600}}>{o.name}</div>
              <span className="pill orange" style={{fontSize:9}}>Owner · {o.taxis.length} taxis</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function AuditPage() {
  return (
    <div className="view fade-in">
      <div className="slabel">Audit log</div>
      <div className="card">
        {AUDIT_LOGS.map((l,i)=>(
          <div key={i} className="list-item">
            <div className="li-icon" style={{background:'var(--surface2)'}}><i className="ti ti-clipboard-list" style={{color:'var(--text2)'}} /></div>
            <div className="li-info"><div className="li-name">{l.action}</div><div className="li-sub">{l.subject} · by {l.by}</div></div>
            <div style={{fontSize:10,color:'var(--text2)',whiteSpace:'nowrap'}}>{l.time}</div>
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
  const Page  = pages[activeNav]||pages[0]
  const close = ()=>setModal(null)

  const assocForOwner = modal?.type==='regOwner' ? ASSOCIATIONS.find(a=>a.id===modal.assocId) : null
  const assocForQR    = modal?.type==='assocQR'  ? ASSOCIATIONS.find(a=>a.id===modal.id) : null

  return (
    <>
      <Page setModal={setModal} />
      {modal==='regAssoc'              && <RegAssocModal  onClose={close} />}
      {modal==='devFinance'            && <DevFinanceModal onClose={close} />}
      {modal?.type==='regOwner'        && <RegOwnerModal  assoc={assocForOwner} onClose={close} />}
      {modal?.type==='assocQR'         && <AssocQRModal   assoc={assocForQR} onClose={close} />}
      {modal==='devQR'                 && (
        <Modal onClose={close}>
          <ModalHeader title="Developer QR" onClose={close} />
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:10,padding:'8px 0'}}>
            <div style={{background:'#fff',borderRadius:12,padding:12,border:'1px solid var(--border)'}}>
              <QRCodeSVG value={JSON.stringify({id:'DEV-eStobhini-KZN-v3',role:'Developer',access:'FULL_SYSTEM_ADMIN',issued:today})} size={160} bgColor="#fff" fgColor="#000" level="M" />
            </div>
            <div style={{fontFamily:'Space Grotesk',fontSize:13,fontWeight:700}}>eStobhini Developer Handle</div>
            <span className="pill dark">Full System Admin</span>
          </div>
        </Modal>
      )}
    </>
  )
}
