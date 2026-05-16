import React, { useState } from 'react'
import Modal, { ModalHeader } from '../components/Modal.jsx'
import LeafletMap from '../components/LeafletMap.jsx'
import { printTillSlip, generateTokenId } from '../components/TokenCard.jsx'
import { STOPS, DRIVERS, OWNERS, ASSOCIATIONS, ROUTES, FINANCE } from '../data/db.js'

function VerifyModal({ onClose }) {
  const o=OWNERS[0]; const a=ASSOCIATIONS.find(x=>x.id===o.assocId)
  return (
    <Modal onClose={onClose}>
      <ModalHeader title="QR Verified ✓" onClose={onClose} />
      <div className="verify-success">
        <div className="verify-title">✓ Valid — Registered & Compliant</div>
        <div className="verify-sub">{o.name} · {o.qrId}</div>
      </div>
      <div className="qr-meta">
        <div><strong>Association:</strong> {a?.fullName} ({a?.level})</div>
        <div><strong>Taxis:</strong> {o.taxis.join(', ')}</div>
        <div><strong>Models:</strong> {Object.values(o.taxiModels).join(', ')}</div>
        <div><strong>Routes:</strong> {o.routes.join(', ')}</div>
        <div><strong>Status:</strong> <span style={{color:'#009950'}}>Active & compliant</span></div>
      </div>
    </Modal>
  )
}

function PrintRankTokenModal({ onClose }) {
  const [route, setRoute] = useState(ROUTES[0].name)
  const [plan, setPlan] = useState('single')
  const [travelDate, setTravelDate] = useState(new Date().toISOString().split('T')[0])
  const [printed, setPrinted] = useState(false)

  const selectedRoute = ROUTES.find(r=>r.name===route)||ROUTES[0]
  const price = plan==='single' ? selectedRoute.fare : plan==='weekly' ? `R${selectedRoute.weeklyAmount}` : `R${selectedRoute.monthlyAmount}`

  const handlePrint = () => {
    const token = {
      tokenId: generateTokenId(plan),
      plan: plan==='single'?'Single Trip':plan==='weekly'?'Weekly Unite':'Monthly Unite',
      route, price,
      rider: 'Cash Purchase — Rank',
      travelDate: plan==='single' ? travelDate : null,
      expires: plan==='single' ? travelDate : plan==='weekly' ? 'Sun 25 May 2025' : '30 Jun 2025',
      type: plan,
      paymentMethod: 'Cash at Rank',
    }
    printTillSlip(token)
    setPrinted(true)
  }

  return (
    <Modal onClose={onClose}>
      <ModalHeader title="Print Rank Token" onClose={onClose} />
      <p style={{fontSize:12,color:'var(--text2)'}}>Issue a printed token to riders who pay cash at the rank.</p>
      <div className="form-group">
        <label>Route</label>
        <select value={route} onChange={e=>setRoute(e.target.value)}>
          {ROUTES.map(r=><option key={r.name} value={r.name}>{r.name} — {r.fare}</option>)}
        </select>
      </div>
      <div className="form-group">
        <label>Plan type</label>
        <select value={plan} onChange={e=>setPlan(e.target.value)}>
          <option value="single">Single Trip — {selectedRoute.fare}</option>
          <option value="weekly">Weekly Unite — R{selectedRoute.weeklyAmount}</option>
          <option value="monthly">Monthly Unite — R{selectedRoute.monthlyAmount}</option>
        </select>
      </div>
      {plan==='single' && (
        <div className="form-group"><label>Travel date</label><input type="date" value={travelDate} onChange={e=>setTravelDate(e.target.value)} /></div>
      )}
      <div style={{background:'var(--surface2)',borderRadius:8,padding:10,fontSize:11}}>
        <div className="row-sb"><span style={{color:'var(--text2)'}}>Route</span><span style={{fontWeight:600}}>{route}</span></div>
        <div className="row-sb" style={{marginTop:4}}><span style={{color:'var(--text2)'}}>Amount to collect</span><span style={{fontWeight:700,color:'#009950',fontSize:14}}>{price}</span></div>
        <div className="row-sb" style={{marginTop:4}}><span style={{color:'var(--text2)'}}>Type</span><span style={{color:plan==='single'?'#EF4444':'#009950'}}>{plan==='single'?'⚠ One-time use':plan==='weekly'?'📅 Weekly':'♾ Monthly'}</span></div>
      </div>
      <button className="btn btn-green btn-full" onClick={handlePrint}>
        <i className="ti ti-printer" /> {printed ? 'Print another slip' : 'Print till slip (80mm)'}
      </button>
      {printed && <div style={{background:'var(--green-light)',borderRadius:8,padding:8,fontSize:11,color:'#009950',textAlign:'center'}}>✓ Token printed! Collect {price} from rider.</div>}
      <div style={{fontSize:10,color:'var(--text2)',textAlign:'center'}}>Compatible: Epson TM-T88VI · Star TSP143 · Sewoo LK-T212 (80mm thermal)</div>
    </Modal>
  )
}

function RankPage({ setModal }) {
  return (
    <div className="view fade-in">
      <div className="stat-grid">
        <div className="stat-box"><div className="snum">18</div><div className="slbl">Taxis out</div></div>
        <div className="stat-box"><div className="snum" style={{color:'#009950'}}>9 min</div><div className="slbl">Avg wait</div></div>
        <div className="stat-box"><div className="snum">5</div><div className="slbl">Stops</div></div>
      </div>
      <div className="row-sb">
        <div className="slabel">Stop congestion — live</div>
        <button className="btn btn-green btn-sm" onClick={()=>setModal('printToken')}><i className="ti ti-printer" /> Print Token</button>
      </div>
      <div className="card">
        {STOPS.map((s,i)=>{
          const barColor=s.crowd<50?'green':s.crowd<75?'amber':'red'
          return (
            <div key={i} className="list-item" style={{flexDirection:'column',alignItems:'stretch',gap:6}}>
              <div className="row-sb">
                <div className="li-name">{s.name}</div>
                <span className={`pill ${barColor}`}>{s.passengers} waiting · {s.crowd}%</span>
              </div>
              <div className="bar-track"><div className={`bar-fill ${barColor}`} style={{width:`${s.crowd}%`}} /></div>
              <div className="row" style={{flexWrap:'wrap',gap:4}}>
                {s.taxis.map(t=><span key={t} className={`pill ${s.enRoute.includes(t)?'green':'amber'}`} style={{fontSize:9}}>{t}{s.enRoute.includes(t)?' →':''}</span>)}
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
      <div className="slabel">Live GPS — all routes</div>
      <div className="card">
        <div className="card-header">
          <span className="ch-title">Taxi positions</span>
          <span className="pill green"><i className="ti ti-wifi" style={{fontSize:10}} /> Live</span>
        </div>
        <LeafletMap height="300px" dark />
        <div className="card-body" style={{display:'flex',gap:6,flexWrap:'wrap'}}>
          {DRIVERS.map(d=>(
            <span key={d.id} className={`pill ${d.status==='active'?'green':d.status==='idle'?'amber':'gray'}`} style={{fontSize:9}}>
              🚌 {d.taxi} · {d.name.split(' ')[0]}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

function LogPage({ setModal }) {
  return (
    <div className="view fade-in">
      <div className="row-sb">
        <div className="slabel">Trip log — today</div>
        <button className="btn btn-green btn-sm" onClick={()=>setModal('printToken')}><i className="ti ti-printer" /> Print Token</button>
      </div>
      <div className="card">
        {DRIVERS.map(d=>(
          <div key={d.id} className="list-item">
            <div className="li-icon" style={{background:'var(--surface2)'}}><i className="ti ti-car" style={{color:'var(--text2)'}} /></div>
            <div className="li-info">
              <div className="li-name">{d.taxi} — {d.name}</div>
              <div className="li-sub">{d.route} · {d.model}</div>
              <div className="li-sub">{d.tripsToday} trips · {d.earnings} {d.shiftEnded?'· Shift ended':''}</div>
            </div>
            <span className={`pill ${d.status==='active'?'green':d.status==='idle'?'amber':'gray'}`}>{d.status}</span>
          </div>
        ))}
      </div>
      <div className="slabel">Commission summary today</div>
      <div className="card">
        <div className="card-body" style={{display:'flex',flexDirection:'column',gap:6}}>
          <div className="row-sb"><span style={{fontSize:12,color:'var(--text2)'}}>Total driver earnings</span><span style={{fontSize:13,fontWeight:600}}>R3,420</span></div>
          <div className="row-sb"><span style={{fontSize:12,color:'var(--text2)'}}>5% commission collected</span><span style={{fontSize:13,fontWeight:600,color:'#F59E0B'}}>R171</span></div>
          <div className="row-sb"><span style={{fontSize:12,color:'var(--text2)'}}>70% → Developer</span><span style={{fontSize:13,fontWeight:600,color:'#009950'}}>R119.70</span></div>
          <div className="row-sb"><span style={{fontSize:12,color:'var(--text2)'}}>30% → Bonus pool</span><span style={{fontSize:13,fontWeight:600,color:'#8B5CF6'}}>R51.30</span></div>
        </div>
      </div>
    </div>
  )
}

function VerifyPage({ setModal }) {
  return (
    <div className="view fade-in">
      <div className="slabel">Scan & verify</div>
      <div className="card">
        <div className="card-body" style={{textAlign:'center',padding:28,display:'flex',flexDirection:'column',alignItems:'center',gap:14}}>
          <div style={{width:80,height:80,border:'2px dashed var(--border2)',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center'}}>
            <i className="ti ti-scan" style={{fontSize:34,color:'var(--text3)'}} />
          </div>
          <div style={{fontSize:13,fontWeight:600}}>Scan taxi, owner or rider QR code</div>
          <div style={{fontSize:11,color:'var(--text2)'}}>Verify registration, route clearance, PDP compliance and token validity</div>
          <button className="btn btn-blue" onClick={()=>setModal('verify')}>Simulate scan</button>
        </div>
      </div>
      <div className="slabel">Print rank token</div>
      <div className="card">
        <div className="card-body" style={{display:'flex',flexDirection:'column',gap:8}}>
          <p style={{fontSize:12,color:'var(--text2)'}}>Issue a printed token to riders who pay cash at the rank. Token has a unique QR that expires after use.</p>
          <button className="btn btn-green btn-full" onClick={()=>setModal('printToken')}><i className="ti ti-printer" /> Print Token Slip (80mm)</button>
        </div>
      </div>
    </div>
  )
}

export default function ManagerView({ activeNav }) {
  const [modal, setModal] = useState(null)
  const pages=[RankPage,RankPage,GPSPage,LogPage,VerifyPage]
  const Page=pages[activeNav]||pages[0]
  return (
    <>
      <Page setModal={setModal} />
      {modal==='verify'     && <VerifyModal         onClose={()=>setModal(null)} />}
      {modal==='printToken' && <PrintRankTokenModal onClose={()=>setModal(null)} />}
    </>
  )
}
