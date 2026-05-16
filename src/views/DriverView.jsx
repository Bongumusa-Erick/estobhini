import React, { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { DRIVERS, OWNERS, FINANCE } from '../data/db.js'
import Modal, { ModalHeader } from '../components/Modal.jsx'
import LeafletMap from '../components/LeafletMap.jsx'

const ME = DRIVERS[0]
const MY_OWNER = OWNERS.find(o=>o.id===ME.ownerId)
const today = new Date().toISOString().split('T')[0]
const STOPS_ROUTE = ['Dassenhoek Taxi Rank (05:45)','Hammonds Farm Stop (06:00)','Pinetown Taxi Rank (06:22)','Durban CBD — Warwick (07:05)']

function ScanModal({ onClose, onScanned }) {
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState(null)
  const simulate = () => {
    setScanning(true)
    setTimeout(()=>{
      setResult({name:'Nokukhanya Dlamini',id:'RDR-KZN-0042',plan:'Weekly Unite',type:'weekly',valid:true,tripsLeft:5})
      setScanning(false)
    },1500)
  }
  return (
    <Modal onClose={onClose}>
      <ModalHeader title="Scan Rider Token" onClose={onClose} />
      {!result ? <>
        <div style={{background:'#0d1117',borderRadius:12,padding:24,textAlign:'center',display:'flex',flexDirection:'column',alignItems:'center',gap:12}}>
          <div style={{width:80,height:80,border:`2px solid ${scanning?'#00C566':'#30363d'}`,borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center'}}>
            {scanning ? <div style={{width:40,height:40,borderRadius:'50%',border:'3px solid #00C566',borderTopColor:'transparent',animation:'spin 1s linear infinite'}} /> : <i className="ti ti-scan" style={{fontSize:36,color:'#6B7280'}} />}
          </div>
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          <div style={{fontSize:13,color:'#9CA3AF'}}>{scanning?'Scanning...':'Point camera at rider QR or token slip'}</div>
        </div>
        <button className="btn btn-green btn-full" onClick={simulate} disabled={scanning}>{scanning?'Scanning...':'Simulate scan'}</button>
      </> : <>
        <div style={{background:result.valid?'var(--green-light)':'var(--red-light)',borderRadius:8,padding:12}}>
          <div style={{fontSize:13,fontWeight:700,color:result.valid?'#009950':'#991B1B'}}>
            {result.valid?'✓ Valid — allow boarding':'✗ Invalid — do not board'}
          </div>
        </div>
        <div className="qr-meta">
          <div><strong>Rider:</strong> {result.name}</div>
          <div><strong>Plan:</strong> {result.plan}</div>
          <div><strong>Type:</strong> {result.type==='single'?'Single trip — expires now':result.type==='weekly'?`Weekly — ${result.tripsLeft} trips remaining`:'Monthly — unlimited'}</div>
          <div><strong>Action:</strong> <span style={{color:result.type==='single'?'#EF4444':'#009950'}}>{result.type==='single'?'Token marked EXPIRED after this scan':'1 trip deducted from weekly balance'}</span></div>
        </div>
        <div style={{display:'flex',gap:8}}>
          <button className="btn btn-green btn-full" onClick={()=>{onScanned&&onScanned(result);onClose()}}>Confirm boarding</button>
          <button className="btn btn-outline btn-full" onClick={()=>setResult(null)}>Scan again</button>
        </div>
      </>}
    </Modal>
  )
}

function AddPassengerModal({ onClose, onAdd }) {
  const [name, setName] = useState('')
  const [payType, setPayType] = useState('token')
  return (
    <Modal onClose={onClose}>
      <ModalHeader title="Add Passenger" onClose={onClose} />
      <div className="form-group"><label>Passenger name</label><input placeholder="Full name (optional)" value={name} onChange={e=>setName(e.target.value)} /></div>
      <div className="form-group"><label>Payment type</label>
        <select value={payType} onChange={e=>setPayType(e.target.value)}>
          <option value="token">App Token</option>
          <option value="weekly">Weekly Unite</option>
          <option value="monthly">Monthly Unite</option>
          <option value="slip">Printed slip</option>
          <option value="cash">Cash</option>
        </select>
      </div>
      <button className="btn btn-green btn-full" onClick={()=>{onAdd&&onAdd({name:name||'Passenger',payType});onClose()}}>
        <i className="ti ti-user-plus" /> Add to trip
      </button>
    </Modal>
  )
}

function EndShiftModal({ onClose }) {
  const gross = 1430, commission = Math.round(gross*FINANCE.driverCommission/100), net = gross - commission
  return (
    <Modal onClose={onClose}>
      <ModalHeader title="End Shift — Cashout" onClose={onClose} />
      <div style={{background:'var(--surface2)',borderRadius:10,padding:14,display:'flex',flexDirection:'column',gap:8}}>
        <div className="row-sb"><span style={{fontSize:12,color:'var(--text2)'}}>Taxi</span><span style={{fontSize:13,fontWeight:600}}>{ME.taxi}</span></div>
        <div className="row-sb"><span style={{fontSize:12,color:'var(--text2)'}}>Total trips</span><span style={{fontSize:13,fontWeight:600}}>{ME.tripsToday}</span></div>
        <div className="row-sb"><span style={{fontSize:12,color:'var(--text2)'}}>Gross earnings</span><span style={{fontSize:13,fontWeight:600,color:'#009950'}}>R{gross.toLocaleString()}</span></div>
        <div style={{borderTop:'1px dashed var(--border)',paddingTop:8}}>
          <div className="row-sb"><span style={{fontSize:12,color:'#EF4444'}}>5% commission → Association</span><span style={{fontSize:13,fontWeight:600,color:'#EF4444'}}>-R{commission}</span></div>
        </div>
        <div style={{background:'var(--green-light)',borderRadius:8,padding:10,marginTop:4}}>
          <div className="row-sb">
            <span style={{fontSize:13,fontWeight:700,color:'#009950'}}>Payout to owner</span>
            <span style={{fontSize:18,fontWeight:700,color:'#009950'}}>R{net.toLocaleString()}</span>
          </div>
          <div style={{fontSize:11,color:'#009950',marginTop:2}}>{MY_OWNER?.bankAccount?.bank} — {MY_OWNER?.bankAccount?.accountNo}</div>
        </div>
      </div>
      <div style={{fontSize:11,color:'var(--text2)',textAlign:'center'}}>5% auto-transferred to {OWNERS.find(o=>o.id===ME.ownerId)?.assocId==='A005'?'Dassenhoek Local Taxi Assoc.':'Association'}</div>
      <button className="btn btn-green btn-full" onClick={onClose}><i className="ti ti-cash" /> Confirm end shift & cashout</button>
    </Modal>
  )
}

function TodayPage({ setModal }) {
  return (
    <div className="view fade-in">
      <div className="card" style={{borderColor:'#F59E0B',borderWidth:1.5}}>
        <div className="card-header" style={{background:'#FEF3C7'}}>
          <span style={{color:'#92400E',fontWeight:600}}>{ME.name}</span>
          <span className="pill amber">On duty</span>
        </div>
        <div className="card-body">
          <div className="stat-grid">
            <div className="stat-box"><div className="snum">{ME.tripsToday}</div><div className="slbl">Trips</div></div>
            <div className="stat-box"><div className="snum">{ME.earnings}</div><div className="slbl">Earned</div></div>
            <div className="stat-box"><div className="snum">44</div><div className="slbl">Passengers</div></div>
          </div>
          <div style={{marginTop:10,fontSize:12,color:'var(--text2)'}}><i className="ti ti-car" /> <strong style={{color:'var(--text)'}}>{ME.taxi}</strong> &nbsp;·&nbsp; {ME.model}</div>
          <div style={{marginTop:4,fontSize:11,color:'var(--text2)'}}>{ME.license}</div>
        </div>
      </div>
      <div className="slabel">Route stops — {ME.route}</div>
      <div className="card">
        <div className="card-body" style={{display:'flex',flexDirection:'column',gap:10}}>
          {STOPS_ROUTE.map((s,i)=>(
            <div key={i} className="row" style={{gap:10}}>
              <div style={{width:22,height:22,borderRadius:'50%',background:i<2?'#00C566':'var(--surface2)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                <i className="ti ti-check" style={{fontSize:11,color:i<2?'white':'var(--text3)'}} />
              </div>
              <span style={{fontSize:12,color:i<2?'var(--text)':'var(--text2)'}}>{s}</span>
            </div>
          ))}
        </div>
      </div>
      <button className="btn btn-outline btn-full" style={{borderColor:'#EF4444',color:'#EF4444'}} onClick={()=>setModal('endShift')}>
        <i className="ti ti-player-stop" /> End shift & cashout
      </button>
    </div>
  )
}

function RoutePage() {
  return (
    <div className="view fade-in">
      <div className="slabel">Live route map</div>
      <LeafletMap height="280px" dark />
    </div>
  )
}

function TripsPage({ setModal }) {
  const [passengers, setPassengers] = useState([
    {name:'Nokukhanya Dlamini',payType:'Weekly Unite',seat:1},
    {name:'Sibusiso Khumalo',payType:'Token',seat:2},
    {name:'Thandi Mokoena',payType:'Monthly Unite',seat:3},
    {name:'Bongani Sithole',payType:'Cash',seat:4},
  ])
  const [trips] = useState([
    {id:'T001',from:'Dassenhoek',to:'Pinetown',time:'05:50',pax:14,fare:'R140',status:'done'},
    {id:'T002',from:'Pinetown',to:'Durban CBD',time:'06:30',pax:15,fare:'R210',status:'done'},
    {id:'T003',from:'Durban CBD',to:'Dassenhoek',time:'07:45',pax:12,fare:'R120',status:'in-progress'},
    {id:'T004',from:'Dassenhoek',to:'Pinetown',time:'09:00',pax:0,fare:'—',status:'upcoming'},
  ])
  return (
    <div className="view fade-in">
      <div className="slabel">Current trip passengers</div>
      <div className="card">
        <div className="card-header">
          <span className="ch-title">{ME.route}</span>
          <span className="pill green">{passengers.length} / 15</span>
        </div>
        <div style={{padding:'8px 14px',display:'flex',gap:8,borderBottom:'1px solid var(--border)'}}>
          <button className="btn btn-green btn-sm" onClick={()=>setModal('scan')}><i className="ti ti-qrcode" /> Scan Token</button>
          <button className="btn btn-outline btn-sm" onClick={()=>setModal('addPax')}><i className="ti ti-user-plus" /> Add Passenger</button>
        </div>
        <div style={{maxHeight:200,overflowY:'auto'}}>
          {passengers.map((p,i)=>(
            <div key={i} className="list-item" style={{padding:'7px 14px'}}>
              <div className="li-icon" style={{background:'var(--surface2)',width:26,height:26,borderRadius:'50%'}}><i className="ti ti-user" style={{fontSize:12,color:'var(--text2)'}} /></div>
              <div className="li-info"><div className="li-name" style={{fontSize:12}}>{p.name}</div><div className="li-sub">Seat {p.seat}</div></div>
              <span className={`pill ${p.payType==='Cash'||p.payType==='slip'?'amber':'green'}`} style={{fontSize:9}}>{p.payType}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="slabel">Trip log today</div>
      <div className="card">
        {trips.map(t=>(
          <div key={t.id} className="list-item">
            <div className="li-icon" style={{background:t.status==='done'?'var(--green-light)':t.status==='in-progress'?'var(--amber-light)':'var(--surface2)'}}><i className="ti ti-route" style={{color:t.status==='done'?'#009950':t.status==='in-progress'?'#92400E':'var(--text2)'}} /></div>
            <div className="li-info"><div className="li-name">{t.from} → {t.to}</div><div className="li-sub">{t.time} · {t.pax} pax</div></div>
            <div className="li-right"><div style={{fontSize:12,fontWeight:600,color:'#009950'}}>{t.fare}</div><span className={`pill ${t.status==='done'?'green':t.status==='in-progress'?'amber':'gray'}`} style={{fontSize:9}}>{t.status}</span></div>
          </div>
        ))}
      </div>
    </div>
  )
}

function StatsPage() {
  return (
    <div className="view fade-in">
      <div className="stat-grid">
        <div className="stat-box"><div className="snum">13</div><div className="slbl">Today</div></div>
        <div className="stat-box"><div className="snum">62</div><div className="slbl">This week</div></div>
        <div className="stat-box"><div className="snum">4.9★</div><div className="slbl">Rating</div></div>
      </div>
      <div className="card">
        <div className="card-header"><span className="ch-title">Vehicle details</span></div>
        <div className="card-body" style={{display:'flex',flexDirection:'column',gap:6}}>
          {[['Plate',ME.taxi],['Model',ME.model],['PDP Licence',ME.license],['Route',ME.route],['Owner',MY_OWNER?.name],['5% commission',`Auto-deducted per shift end`]].map(([k,v])=>(
            <div key={k} className="row-sb"><span style={{fontSize:12,color:'var(--text2)'}}>{k}</span><span style={{fontSize:12,fontWeight:600}}>{v}</span></div>
          ))}
        </div>
      </div>
    </div>
  )
}

function MyQRPage() {
  const data={id:`DRV-${ME.id}`,type:'DRIVER',name:ME.name,taxi:ME.taxi,model:ME.model,license:ME.license,route:ME.route,province:'KwaZulu-Natal',issued:today}
  return (
    <div className="view fade-in">
      <div className="card">
        <div className="qr-wrap">
          <div className="qr-frame"><QRCodeSVG value={JSON.stringify(data)} size={160} bgColor="#fff" fgColor="#000" level="M" /></div>
          <div className="qr-title">{ME.name}</div>
          <div className="qr-sub">DRV-{ME.id} · {ME.taxi}</div>
          <div style={{fontSize:11,color:'var(--text2)',textAlign:'center'}}>{ME.model}</div>
          <div style={{fontSize:11,color:'var(--text2)',textAlign:'center'}}>{ME.license} · {ME.route}</div>
        </div>
        <div style={{padding:'0 14px 14px',display:'flex',gap:8}}>
          <button className="btn btn-outline btn-full" onClick={()=>window.print()}><i className="ti ti-printer" /> Print</button>
          <button className="btn btn-outline btn-full" onClick={()=>navigator.share?.({title:'eStobhini Driver QR',url:'https://estobhini.vercel.app'})}><i className="ti ti-share" /> Share</button>
        </div>
      </div>
    </div>
  )
}

export default function DriverView({ activeNav }) {
  const [modal, setModal] = useState(null)
  const [passengers, setPassengers] = useState([])
  const pages=[TodayPage, RoutePage, TripsPage, StatsPage, MyQRPage]
  const Page=pages[activeNav]||pages[0]
  return (
    <>
      <Page setModal={setModal} passengers={passengers} />
      {modal==='scan'     && <ScanModal         onClose={()=>setModal(null)} onScanned={p=>setPassengers(prev=>[...prev,p])} />}
      {modal==='addPax'   && <AddPassengerModal onClose={()=>setModal(null)} onAdd={p=>setPassengers(prev=>[...prev,p])} />}
      {modal==='endShift' && <EndShiftModal     onClose={()=>setModal(null)} />}
    </>
  )
}
