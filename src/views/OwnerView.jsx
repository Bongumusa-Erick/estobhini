import React, { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import Modal, { ModalHeader } from '../components/Modal.jsx'
import { OWNERS, DRIVERS, ASSOCIATIONS, ROUTES, TAXI_MODELS, FINANCE } from '../data/db.js'

const ME = OWNERS[0]
const MY_DRIVERS = DRIVERS.filter(d => ME.drivers.includes(d.name))
const MY_ASSOC = ASSOCIATIONS.find(a => a.id === ME.assocId)
const today = new Date().toISOString().split('T')[0]

// ─── Cash out modal ───────────────────────────────────────────────
function CashoutModal({ taxi, data, onClose }) {
  const commission = (parseFloat(data.gross.replace('R','').replace(',','')) * FINANCE.driverCommission / 100).toFixed(2)
  const net = (parseFloat(data.gross.replace('R','').replace(',','')) - commission).toFixed(2)
  return (
    <Modal onClose={onClose}>
      <ModalHeader title={`End shift — ${taxi}`} onClose={onClose} />
      <div style={{background:'var(--surface2)',borderRadius:10,padding:14,display:'flex',flexDirection:'column',gap:8}}>
        <div className="row-sb"><span style={{fontSize:12,color:'var(--text2)'}}>Taxi plate</span><span style={{fontSize:13,fontWeight:600}}>{taxi}</span></div>
        <div className="row-sb"><span style={{fontSize:12,color:'var(--text2)'}}>Total trips</span><span style={{fontSize:13,fontWeight:600}}>{data.trips}</span></div>
        <div className="row-sb"><span style={{fontSize:12,color:'var(--text2)'}}>Gross earnings</span><span style={{fontSize:13,fontWeight:600,color:'#009950'}}>{data.gross}</span></div>
        <div style={{borderTop:'1px dashed var(--border)',paddingTop:8}}>
          <div className="row-sb"><span style={{fontSize:12,color:'#EF4444'}}>5% commission → Association</span><span style={{fontSize:13,fontWeight:600,color:'#EF4444'}}>-R{commission}</span></div>
        </div>
        <div style={{background:'var(--green-light)',borderRadius:8,padding:10,marginTop:4}}>
          <div className="row-sb">
            <span style={{fontSize:13,fontWeight:700,color:'#009950'}}>Net payout to your bank</span>
            <span style={{fontSize:18,fontWeight:700,color:'#009950'}}>R{net}</span>
          </div>
          <div style={{fontSize:11,color:'#009950',marginTop:4}}>{ME.bankAccount.bank} — {ME.bankAccount.accountNo}</div>
        </div>
      </div>
      <div style={{fontSize:11,color:'var(--text2)',textAlign:'center'}}>The 5% commission is auto-transferred to {MY_ASSOC?.name}.<br/>70% of that goes to the developer, 30% to the bonus pool.</div>
      <button className="btn btn-green btn-full" onClick={onClose}><i className="ti ti-cash" /> Confirm cashout — R{net}</button>
    </Modal>
  )
}

function AddRouteModal({ onClose }) {
  return (
    <Modal onClose={onClose}>
      <ModalHeader title="Add Route & Amounts" onClose={onClose} />
      <div className="form-group"><label>Route name</label><input placeholder="e.g. Dassenhoek → Hillcrest" /></div>
      <div className="form-group"><label>Single trip fare</label><input placeholder="e.g. R16" /></div>
      <div className="form-grid-2">
        <div className="form-group"><label>Weekly Unite</label><input placeholder="R75" /></div>
        <div className="form-group"><label>Monthly Unite</label><input placeholder="R250" /></div>
      </div>
      <div className="form-group"><label>Frequency</label><input placeholder="e.g. Every 10 min" /></div>
      <button className="btn btn-green btn-full" onClick={onClose}><i className="ti ti-check" /> Save Route</button>
    </Modal>
  )
}

function AddDriverModal({ onClose }) {
  return (
    <Modal onClose={onClose}>
      <ModalHeader title="Register Driver" onClose={onClose} />
      <div className="form-group"><label>Driver full name</label><input placeholder="Full name" /></div>
      <div className="form-group"><label>SA ID number</label><input placeholder="13-digit SA ID" /></div>
      <div className="form-group"><label>PDP / Licence number</label><input placeholder="PDP-KZN-2024-007" /></div>
      <div className="form-group"><label>Assigned taxi</label>
        <select>{ME.taxis.map(t=><option key={t}>{t} — {ME.taxiModels[t]}</option>)}</select>
      </div>
      <div className="form-group"><label>Contact number</label><input placeholder="+27 ..." /></div>
      <button className="btn btn-orange btn-full" onClick={onClose}><i className="ti ti-check" /> Register Driver</button>
    </Modal>
  )
}

function FleetPage({ setModal }) {
  return (
    <div className="view fade-in">
      <div className="card" style={{borderColor:'#F97316',borderWidth:1.5}}>
        <div className="card-header" style={{background:'#FFF7ED'}}>
          <span style={{color:'#9A3412',fontWeight:600}}>{ME.name}</span>
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
      <div className="slabel">Fleet — daily cashout</div>
      <div className="card">
        {ME.taxis.map(t=>{
          const co = ME.dailyCashout[t]
          const d = MY_DRIVERS.find(x=>x.taxi===t)
          return (
            <div key={t} className="list-item">
              <div className="li-icon" style={{background:co?.status==='cashed_out'?'var(--surface2)':co?.status==='offline'?'var(--surface2)':'#E6FBF2'}}>
                <i className="ti ti-bus" style={{color:co?.status==='cashed_out'?'var(--text3)':co?.status==='offline'?'var(--text3)':'#009950'}} />
              </div>
              <div className="li-info">
                <div className="li-name">{t}</div>
                <div className="li-sub">{ME.taxiModels[t]}</div>
                <div className="li-sub">{co?.trips} trips · Gross: {co?.gross} · Net: {co?.net}</div>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:4,alignItems:'flex-end'}}>
                <span className={`pill ${co?.status==='cashed_out'?'gray':co?.status==='offline'?'gray':'green'}`}>{co?.status==='cashed_out'?'Cashed out':co?.status==='offline'?'Offline':'Pending'}</span>
                {co?.status==='pending' && (
                  <button className="btn btn-green btn-sm" style={{fontSize:10,padding:'2px 8px'}} onClick={()=>setModal({type:'cashout',taxi:t,data:co})}>
                    End shift
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
      <div style={{background:'var(--surface2)',borderRadius:8,padding:10,fontSize:11,color:'var(--text2)'}}>
        <strong style={{color:'var(--text)'}}>Auto-deduction:</strong> 5% commission per shift → {MY_ASSOC?.name}<br/>
        Payout to: {ME.bankAccount.bank} — {ME.bankAccount.accountNo}
      </div>
    </div>
  )
}

function TaxisPage({ setModal }) {
  return (
    <div className="view fade-in">
      <div className="row-sb">
        <div className="slabel">Registered taxis</div>
      </div>
      <div className="card">
        {ME.taxis.map(t=>(
          <div key={t} className="list-item">
            <div className="li-icon" style={{background:'#E6FBF2'}}><i className="ti ti-bus" style={{color:'#009950'}} /></div>
            <div className="li-info">
              <div className="li-name">{t}</div>
              <div className="li-sub">{ME.taxiModels[t]}</div>
              <div className="li-sub">{ME.routes[0]} · DLTA · KZN</div>
            </div>
            <span className="pill green">Active</span>
          </div>
        ))}
      </div>
      <div className="slabel">Routes & amounts</div>
      <div className="card">
        <div style={{padding:'10px 14px',borderBottom:'1px solid var(--border)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <span style={{fontSize:13,fontWeight:500}}>My routes</span>
          <button className="btn btn-green btn-sm" onClick={()=>setModal('addRoute')}><i className="ti ti-plus" /> Add Route</button>
        </div>
        {ME.routes.map((r,i)=>{
          const rd=ROUTES.find(x=>x.name===r)
          return (
            <div key={i} className="list-item">
              <div className="li-icon" style={{background:'var(--surface2)'}}><i className="ti ti-route" style={{color:'var(--text2)'}} /></div>
              <div className="li-info">
                <div className="li-name">{r}</div>
                <div className="li-sub">Single: {rd?.fare} · Weekly: R{rd?.weeklyAmount} · Monthly: R{rd?.monthlyAmount}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function DriversPage({ setModal }) {
  return (
    <div className="view fade-in">
      <div className="row-sb">
        <div className="slabel">Registered drivers</div>
        <button className="btn btn-orange btn-sm" onClick={()=>setModal('addDriver')}><i className="ti ti-plus" /> Add Driver</button>
      </div>
      <div className="card">
        {MY_DRIVERS.map(d=>(
          <div key={d.id} className="list-item">
            <div className="li-icon" style={{background:'#FFF7ED'}}><i className="ti ti-user" style={{color:'#9A3412'}} /></div>
            <div className="li-info">
              <div className="li-name">{d.name}</div>
              <div className="li-sub">{d.taxi} · {d.model}</div>
              <div className="li-sub">{d.license} · {d.tripsToday} trips · {d.earnings}</div>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:4,alignItems:'flex-end'}}>
              <span className={`pill ${d.status==='active'?'green':d.status==='idle'?'amber':'gray'}`}>{d.status}</span>
              {!d.shiftEnded && <button className="btn btn-outline btn-sm" style={{fontSize:10,padding:'2px 7px'}} onClick={()=>setModal({type:'cashout',taxi:d.taxi,data:ME.dailyCashout[d.taxi]||{trips:d.tripsToday,gross:'R'+d.earnings.replace('R',''),net:'—',status:'pending'}})}>End shift</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function EarningsPage() {
  const vals=[720,880,1040,920,1160,680,440], max=Math.max(...vals)
  return (
    <div className="view fade-in">
      <div className="stat-grid">
        <div className="stat-box"><div className="snum">R580</div><div className="slbl">Today</div></div>
        <div className="stat-box"><div className="snum">R3,840</div><div className="slbl">This week</div></div>
        <div className="stat-box"><div className="snum">R15,200</div><div className="slbl">This month</div></div>
      </div>
      <div className="card">
        <div className="card-header"><span className="ch-title">Weekly earnings</span><span className="pill green">This week</span></div>
        <div className="card-body">
          <div className="earn-chart">
            {vals.map((v,i)=>(<div key={i} className="earn-col"><div className="earn-bar" style={{height:Math.round(v/max*55)+5}} /><div className="earn-day">{['M','T','W','T','F','S','S'][i]}</div></div>))}
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-header"><span className="ch-title">Bank account (receiving)</span></div>
        <div className="card-body" style={{display:'flex',flexDirection:'column',gap:6}}>
          <div className="row-sb"><span style={{fontSize:12,color:'var(--text2)'}}>Bank</span><span style={{fontSize:12,fontWeight:600}}>{ME.bankAccount.bank}</span></div>
          <div className="row-sb"><span style={{fontSize:12,color:'var(--text2)'}}>Account name</span><span style={{fontSize:12,fontWeight:600}}>{ME.bankAccount.accountName}</span></div>
          <div className="row-sb"><span style={{fontSize:12,color:'var(--text2)'}}>Account number</span><span style={{fontSize:12,fontWeight:600}}>{ME.bankAccount.accountNo}</span></div>
          <div className="row-sb"><span style={{fontSize:12,color:'var(--text2)'}}>5% commission</span><span style={{fontSize:12,fontWeight:600,color:'#EF4444'}}>Auto-deducted per shift</span></div>
          <button className="btn btn-outline btn-full" style={{marginTop:4}}>Update bank account</button>
        </div>
      </div>
    </div>
  )
}

function MyQRPage() {
  const assoc = MY_ASSOC
  const data = {id:ME.qrId,type:'TAXI_OWNER',name:ME.name,association:assoc?.fullName,taxis:ME.taxis,taxiModels:ME.taxiModels,routes:ME.routes,province:'KwaZulu-Natal',issued:today}
  return (
    <div className="view fade-in">
      <div className="slabel">My owner QR code</div>
      <div className="card">
        <div className="qr-wrap">
          <div className="qr-frame"><QRCodeSVG value={JSON.stringify(data)} size={160} bgColor="#fff" fgColor="#000" level="M" /></div>
          <div className="qr-title">{ME.name}</div>
          <div className="qr-sub">{ME.qrId}</div>
          <div style={{display:'flex',gap:5,flexWrap:'wrap',justifyContent:'center'}}>
            {ME.taxis.map(t=><span key={t} className="pill green" style={{fontSize:9}}>{t}</span>)}
          </div>
          <div className="qr-meta">
            <div><strong>Association:</strong> {assoc?.fullName}</div>
            <div><strong>Taxi models:</strong> {Object.values(ME.taxiModels).join(', ')}</div>
            <div><strong>Routes:</strong> {ME.routes.join(', ')}</div>
            <div><strong>Bank:</strong> {ME.bankAccount.bank} — {ME.bankAccount.accountNo}</div>
          </div>
        </div>
        <div style={{padding:'0 14px 14px',display:'flex',gap:8}}>
          <button className="btn btn-outline btn-full"><i className="ti ti-download" /> Download</button>
          <button className="btn btn-outline btn-full" onClick={()=>navigator.share?.({title:'eStobhini Owner QR',url:'https://estobhini.vercel.app'})}><i className="ti ti-share" /> Share</button>
        </div>
      </div>
    </div>
  )
}

export default function OwnerView({ activeNav }) {
  const [modal, setModal] = useState(null)
  const pages=[FleetPage, TaxisPage, DriversPage, EarningsPage, MyQRPage]
  const Page=pages[activeNav]||pages[0]
  return (
    <>
      <Page setModal={setModal} />
      {modal==='addRoute'             && <AddRouteModal  onClose={()=>setModal(null)} />}
      {modal==='addDriver'            && <AddDriverModal  onClose={()=>setModal(null)} />}
      {modal?.type==='cashout'        && <CashoutModal   taxi={modal.taxi} data={modal.data} onClose={()=>setModal(null)} />}
    </>
  )
}
