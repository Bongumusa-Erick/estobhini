import React, { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { ROUTES, STOPS, MOCK_RIDER, LONG_DISTANCE_ROUTES, JOINT_TRIPS, ASSOCIATIONS, FINANCE } from '../data/db.js'
import Modal, { ModalHeader } from '../components/Modal.jsx'
import LeafletMap from '../components/LeafletMap.jsx'
import PaymentModal from '../components/PaymentModal.jsx'
import TokenCard, { generateTokenId } from '../components/TokenCard.jsx'

const today = new Date().toISOString().split('T')[0]

// ─── Points bar ───────────────────────────────────────────────────
function PointsBar({ points, proPoints }) {
  const localPct = Math.min((points / FINANCE.pointsForFreeLocal)*100, 100)
  const ldPct    = Math.min((proPoints / FINANCE.pointsForFreeLongDist)*100, 100)
  return (
    <div className="card">
      <div className="card-header"><span className="ch-title">🏆 My points</span><span className="pill green">{points} pts</span></div>
      <div className="card-body" style={{display:'flex',flexDirection:'column',gap:10}}>
        <div>
          <div className="row-sb" style={{marginBottom:4}}>
            <span style={{fontSize:11,color:'var(--text2)'}}>Local trip reward</span>
            <span style={{fontSize:11,fontWeight:600,color:'#009950'}}>{points}/{FINANCE.pointsForFreeLocal} pts</span>
          </div>
          <div className="bar-track"><div className="bar-fill green" style={{width:`${localPct}%`}} /></div>
          <div style={{fontSize:10,color:'var(--text2)',marginTop:3}}>{FINANCE.tripsForFreeLocal} rides = {FINANCE.pointsForFreeLocal} pts = 1 free local trip</div>
        </div>
        <div>
          <div className="row-sb" style={{marginBottom:4}}>
            <span style={{fontSize:11,color:'var(--text2)'}}>Long distance reward</span>
            <span style={{fontSize:11,fontWeight:600,color:'#6D28D9'}}>{proPoints}/{FINANCE.pointsForFreeLongDist} pro pts</span>
          </div>
          <div className="bar-track"><div className="bar-fill" style={{width:`${ldPct}%`,background:'#8B5CF6'}} /></div>
          <div style={{fontSize:10,color:'var(--text2)',marginTop:3}}>{FINANCE.tripsForFreeLongDist} LD rides = {FINANCE.pointsForFreeLongDist} pro pts = 1 free LD trip</div>
        </div>
        {points >= FINANCE.pointsForFreeLocal && (
          <div style={{background:'var(--green-light)',borderRadius:8,padding:10,textAlign:'center'}}>
            <div style={{fontSize:13,fontWeight:700,color:'#009950'}}>🎉 Free trip earned!</div>
            <div style={{fontSize:11,color:'#009950'}}>Tap to redeem your free local trip</div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Signup modal ─────────────────────────────────────────────────
function SignupModal({ onClose, onSignup }) {
  const [mode, setMode] = useState('signup')
  const [form, setForm] = useState({ name:'', phone:'', area:'', pin:'' })
  const set = k => e => setForm(p=>({...p,[k]:e.target.value}))
  return (
    <Modal onClose={onClose}>
      <ModalHeader title={mode==='signup'?'Join eStobhini — Free':'Sign in'} onClose={onClose} />
      {mode==='signup' ? <>
        <div style={{background:'var(--green-light)',borderRadius:8,padding:10,fontSize:12,color:'#009950',fontWeight:500}}>✓ Free forever · ✓ No credit card · ✓ Rider QR instantly</div>
        <div className="form-grid-2">
          <div className="form-group"><label>First name</label><input placeholder="Nokukhanya" value={form.name} onChange={set('name')} /></div>
          <div className="form-group"><label>Surname</label><input placeholder="Dlamini" /></div>
        </div>
        <div className="form-group"><label>Phone number</label><input placeholder="+27 72 ..." value={form.phone} onChange={set('phone')} /></div>
        <div className="form-group"><label>Area / township</label><input placeholder="e.g. Dassenhoek" value={form.area} onChange={set('area')} /></div>
        <div className="form-group"><label>Create a PIN</label><input type="password" placeholder="4-digit PIN" maxLength={4} value={form.pin} onChange={set('pin')} /></div>
        <button className="btn btn-green btn-full" onClick={()=>{onSignup({...MOCK_RIDER,...form,initials:form.name?.charAt(0)||'N'});onClose()}}>
          <i className="ti ti-check" /> Create free account & get QR
        </button>
        <div style={{fontSize:11,color:'var(--text2)',textAlign:'center'}}>Already have an account? <span style={{color:'#00C566',cursor:'pointer'}} onClick={()=>setMode('login')}>Sign in</span></div>
      </> : <>
        <div className="form-group"><label>Phone number</label><input placeholder="+27 72 ..." /></div>
        <div className="form-group"><label>PIN</label><input type="password" placeholder="4-digit PIN" maxLength={4} /></div>
        <button className="btn btn-green btn-full" onClick={()=>{onSignup(MOCK_RIDER);onClose()}}>Sign in</button>
        <div style={{fontSize:11,color:'var(--text2)',textAlign:'center'}}>No account? <span style={{color:'#00C566',cursor:'pointer'}} onClick={()=>setMode('signup')}>Sign up free</span></div>
      </>}
    </Modal>
  )
}

// ─── Book token modal (with prior date + token card after) ────────
function BookModal({ plan, onClose }) {
  const [step, setStep] = useState('details') // details | payment | token
  const [route, setRoute] = useState(ROUTES[0].name)
  const [travelDate, setTravelDate] = useState(today)
  const [token, setToken] = useState(null)

  const selectedRoute = ROUTES.find(r=>r.name===route)||ROUTES[0]
  const price = plan==='single' ? selectedRoute.fare : plan==='weekly' ? `R${selectedRoute.weeklyAmount}` : `R${selectedRoute.monthlyAmount}`
  const planLabel = plan==='single'?'Single Trip':plan==='weekly'?'Weekly Unite':'Monthly Unite'
  const expires = plan==='single' ? travelDate : plan==='weekly' ? 'Sun 25 May 2025' : '30 Jun 2025'

  const handlePaid = () => {
    const tok = {
      tokenId: generateTokenId(plan),
      plan: planLabel, route, price,
      rider: MOCK_RIDER.name,
      travelDate: plan==='single' ? travelDate : null,
      expires, type: plan,
      paymentMethod: 'App',
    }
    setToken(tok)
    setStep('token')
  }

  if (step==='token' && token) return (
    <Modal onClose={onClose}>
      <ModalHeader title="Your token is ready!" onClose={onClose} />
      <TokenCard token={token} onClose={onClose} />
    </Modal>
  )

  if (step==='payment') return (
    <Modal onClose={onClose}>
      <ModalHeader title="Payment" onClose={onClose} />
      <PaymentModal plan={{name:planLabel, price, type:plan}} onClose={onClose} onSuccess={handlePaid} />
    </Modal>
  )

  return (
    <Modal onClose={onClose}>
      <ModalHeader title={`Book ${planLabel}`} onClose={onClose} />
      <div className="form-group">
        <label>Route <span style={{fontSize:10,color:'#009950'}}>(editable)</span></label>
        <select value={route} onChange={e=>setRoute(e.target.value)}>
          {ROUTES.map(r=><option key={r.name} value={r.name}>{r.name} — {r.fare}</option>)}
        </select>
      </div>
      {plan==='single' && (
        <div className="form-group">
          <label>Travel date <span style={{fontSize:10,color:'#6B7280'}}>(book for prior date)</span></label>
          <input type="date" value={travelDate} min={today} onChange={e=>setTravelDate(e.target.value)} />
        </div>
      )}
      <div style={{background:'var(--surface2)',borderRadius:8,padding:12,display:'flex',flexDirection:'column',gap:4}}>
        <div className="row-sb"><span style={{fontSize:12,color:'var(--text2)'}}>Plan</span><span style={{fontSize:12,fontWeight:600}}>{planLabel}</span></div>
        <div className="row-sb"><span style={{fontSize:12,color:'var(--text2)'}}>Route</span><span style={{fontSize:12,fontWeight:600}}>{route}</span></div>
        <div className="row-sb"><span style={{fontSize:12,color:'var(--text2)'}}>Price</span><span style={{fontSize:14,fontWeight:700,color:'#009950'}}>{price}</span></div>
        <div className="row-sb"><span style={{fontSize:12,color:'var(--text2)'}}>Expires</span><span style={{fontSize:12}}>{expires}</span></div>
        {plan==='single' && <div style={{fontSize:10,color:'#EF4444',marginTop:4}}>⚠ One-time use — token expires after driver scans once</div>}
        {plan==='monthly' && <div style={{fontSize:10,color:'#6D28D9',marginTop:4}}>✓ Includes 1 free trip bonus (25+ rides = 350 pts)</div>}
      </div>
      <button className="btn btn-green btn-full" onClick={()=>setStep('payment')}>Proceed to payment →</button>
    </Modal>
  )
}

// ─── Joint trip modal ─────────────────────────────────────────────
function JointTripModal({ onClose }) {
  const [selected, setSelected] = useState(null)
  const [step, setStep] = useState('choose')
  const [token, setToken] = useState(null)

  if (step==='token' && token) return (
    <Modal onClose={onClose}>
      <ModalHeader title="Joint trip token ready!" onClose={onClose} />
      <TokenCard token={token} onClose={onClose} />
    </Modal>
  )

  return (
    <Modal onClose={onClose}>
      <ModalHeader title="Joint Trip Token" onClose={onClose} />
      <p style={{fontSize:12,color:'var(--text2)'}}>One token covers all connected segments of your journey.</p>
      <div style={{display:'flex',flexDirection:'column',gap:8}}>
        {JOINT_TRIPS.map((jt,i)=>(
          <div key={i} onClick={()=>setSelected(i)} style={{border:`1.5px solid ${selected===i?'#00C566':'var(--border)'}`,background:selected===i?'var(--green-light)':'var(--surface)',borderRadius:10,padding:12,cursor:'pointer'}}>
            <div style={{fontSize:13,fontWeight:600,color:'var(--text)',marginBottom:6}}>{jt.name}</div>
            <div style={{display:'flex',flexDirection:'column',gap:3}}>
              {jt.segments.map((seg,j)=>(
                <div key={j} style={{display:'flex',alignItems:'center',gap:6,fontSize:11,color:'var(--text2)'}}>
                  <span style={{width:16,height:16,borderRadius:'50%',background:'#009950',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:8,flexShrink:0}}>{j+1}</span>
                  {seg} <span style={{marginLeft:'auto',fontWeight:600,color:'#009950'}}>{jt.fares[j]}</span>
                </div>
              ))}
            </div>
            <div style={{marginTop:8,borderTop:'1px solid var(--border)',paddingTop:6,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <span style={{fontSize:11,color:'var(--text2)'}}>Total fare</span>
              <span style={{fontSize:15,fontWeight:700,color:'#009950'}}>{jt.total}</span>
            </div>
          </div>
        ))}
      </div>
      {selected!==null && (
        <button className="btn btn-green btn-full" onClick={()=>{
          const jt=JOINT_TRIPS[selected]
          const tok={tokenId:generateTokenId('single'),plan:'Joint Trip Token',route:jt.name,price:jt.total,rider:MOCK_RIDER.name,travelDate:today,expires:today,type:'single',paymentMethod:'App'}
          setToken(tok); setStep('token')
        }}>Book joint trip — {JOINT_TRIPS[selected].total} →</button>
      )}
    </Modal>
  )
}

// ─── Long distance modal ──────────────────────────────────────────
function LongDistanceModal({ onClose }) {
  const [assocId, setAssocId] = useState('LD001')
  const [routeName, setRouteName] = useState('')
  const [token, setToken] = useState(null)
  const assocs = ASSOCIATIONS.filter(a=>a.type==='longdistance')
  const ldRoutes = LONG_DISTANCE_ROUTES.filter(r=>r.assocId===assocId)

  if (token) return (
    <Modal onClose={onClose}>
      <ModalHeader title="Long distance token ready!" onClose={onClose} />
      <TokenCard token={token} onClose={onClose} />
    </Modal>
  )

  return (
    <Modal onClose={onClose}>
      <ModalHeader title="Long Distance Trip" onClose={onClose} />
      <div className="form-group">
        <label>Association</label>
        <select value={assocId} onChange={e=>{setAssocId(e.target.value);setRouteName('')}}>
          {assocs.map(a=><option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:8}}>
        {ldRoutes.map((r,i)=>(
          <div key={i} onClick={()=>setRouteName(r.name)} style={{border:`1.5px solid ${routeName===r.name?'#00C566':'var(--border)'}`,background:routeName===r.name?'var(--green-light)':'var(--surface)',borderRadius:10,padding:12,cursor:'pointer'}}>
            <div className="row-sb">
              <div>
                <div style={{fontSize:13,fontWeight:600}}>{r.name}</div>
                <div style={{fontSize:11,color:'var(--text2)',marginTop:2}}>{r.time} · {r.departs}</div>
              </div>
              <div style={{fontSize:18,fontWeight:700,color:'#009950'}}>{r.fare}</div>
            </div>
            <div style={{fontSize:10,color:'var(--text2)',marginTop:4}}>{r.seats} seats remaining</div>
          </div>
        ))}
      </div>
      {routeName && (
        <button className="btn btn-green btn-full" onClick={()=>{
          const r=ldRoutes.find(x=>x.name===routeName)
          setToken({tokenId:generateTokenId('single'),plan:'Long Distance Token',route:r.name,price:r.fare,rider:MOCK_RIDER.name,travelDate:today,expires:today,type:'single',paymentMethod:'App'})
        }}>Book — {ldRoutes.find(r=>r.name===routeName)?.fare} →</button>
      )}
    </Modal>
  )
}

// ─── Pages ────────────────────────────────────────────────────────
function HomePage({ setModal, rider }) {
  const [sel, setSel] = useState(0)
  return (
    <div className="view fade-in">
      <div className="hero">
        <div className="hero-badge"><i className="ti ti-map-pin" style={{fontSize:10}} /> Dassenhoek · KwaZulu-Natal</div>
        <h2>Where to today?</h2>
        <p>Book · Pay by token · No cash · No waiting</p>
        <div className="hero-search">
          <input className="hero-input" placeholder="Search route..." />
          <button className="btn" style={{background:'#fff',color:'#009950',fontSize:12,padding:'7px 14px',borderRadius:8,border:'none',fontWeight:500}}>Go</button>
        </div>
      </div>
      <div className="slabel">Quick book</div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8}}>
        <button className="btn btn-green btn-full" style={{flexDirection:'column',gap:4,padding:'12px 6px',fontSize:11}} onClick={()=>setModal({type:'book',plan:'single'})}>
          <i className="ti ti-ticket" style={{fontSize:20}} />Single Trip
        </button>
        <button className="btn btn-outline btn-full" style={{flexDirection:'column',gap:4,padding:'12px 6px',fontSize:11,borderColor:'#00C566',color:'#009950'}} onClick={()=>setModal({type:'book',plan:'weekly'})}>
          <i className="ti ti-calendar-week" style={{fontSize:20}} />Weekly Unite
        </button>
        <button className="btn btn-outline btn-full" style={{flexDirection:'column',gap:4,padding:'12px 6px',fontSize:11,borderColor:'#8B5CF6',color:'#6D28D9'}} onClick={()=>setModal({type:'book',plan:'monthly'})}>
          <i className="ti ti-calendar-month" style={{fontSize:20}} />Monthly Unite
        </button>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
        <button className="btn btn-outline btn-full" style={{flexDirection:'column',gap:4,padding:'12px',fontSize:11,borderColor:'#F97316',color:'#9A3412'}} onClick={()=>setModal({type:'joint'})}>
          <i className="ti ti-arrows-transfer-up" style={{fontSize:20}} />Joint Trip
        </button>
        <button className="btn btn-outline btn-full" style={{flexDirection:'column',gap:4,padding:'12px',fontSize:11,borderColor:'#3B82F6',color:'#1D4ED8'}} onClick={()=>setModal({type:'longdist'})}>
          <i className="ti ti-road" style={{fontSize:20}} />Long Distance
        </button>
      </div>
      <div className="slabel">Routes near you</div>
      <div className="routes-grid">
        {ROUTES.slice(0,4).map((r,i)=>(
          <div key={i} className="route-card" onClick={()=>setSel(i)} style={sel===i?{borderColor:'#00C566',background:'var(--green-light)'}:{}}>
            <div className="route-name">{r.name}</div>
            <div className="route-pills">
              <span className="pill green">{r.time}</span>
              <span className="pill blue">{r.fare}</span>
              <span className="pill amber">{r.seats} seats</span>
            </div>
          </div>
        ))}
      </div>
      {!rider && (
        <div style={{background:'linear-gradient(135deg,#1a1a2e,#2d3748)',borderRadius:12,padding:16,color:'#fff'}}>
          <div style={{fontFamily:'Space Grotesk',fontSize:14,fontWeight:700,marginBottom:4}}>Sign up free — get your Rider QR</div>
          <div style={{fontSize:11,opacity:.8,marginBottom:12}}>Book, pay by token, earn points — all free</div>
          <button className="btn btn-green btn-full" onClick={()=>setModal({type:'signup'})}>Join free <i className="ti ti-arrow-right" /></button>
        </div>
      )}
    </div>
  )
}

function RoutesPage({ setModal }) {
  return (
    <div className="view fade-in">
      <div className="slabel">Local routes</div>
      {ROUTES.map((r,i)=>(
        <div key={i} className="card">
          <div className="card-body" style={{padding:11}}>
            <div className="row-sb" style={{marginBottom:6}}>
              <div style={{fontSize:13,fontWeight:600}}>{r.name}</div>
              <span className="pill blue">{r.fare}/trip</span>
            </div>
            <div className="route-pills" style={{marginBottom:6}}>
              <span className="pill green">{r.time}</span>
              <span className="pill amber">{r.seats} seats</span>
              <span className="pill green">{r.freq}</span>
            </div>
            <div className="row-sb">
              <span style={{fontSize:10,color:'var(--text2)'}}>Weekly: <strong style={{color:'#009950'}}>R{r.weeklyAmount}</strong> · Monthly: <strong style={{color:'#6D28D9'}}>R{r.monthlyAmount}</strong></span>
              <button className="btn btn-green btn-sm" onClick={()=>setModal({type:'book',plan:'single'})}>Book</button>
            </div>
          </div>
        </div>
      ))}
      <div className="slabel">Long distance routes</div>
      {ASSOCIATIONS.filter(a=>a.type==='longdistance').map(a=>(
        <div key={a.id} className="card">
          <div className="card-header">
            <span className="ch-title">{a.name}</span>
            <span className="pill blue">Long distance</span>
          </div>
          {LONG_DISTANCE_ROUTES.filter(r=>r.assocId===a.id).map((r,i)=>(
            <div key={i} className="list-item">
              <div className="li-icon" style={{background:'#EFF6FF'}}><i className="ti ti-road" style={{color:'#1D4ED8'}} /></div>
              <div className="li-info">
                <div className="li-name">{r.name}</div>
                <div className="li-sub">{r.time} · {r.departs}</div>
              </div>
              <div style={{textAlign:'right'}}>
                <div style={{fontSize:14,fontWeight:700,color:'#009950'}}>{r.fare}</div>
                <button className="btn btn-green btn-sm" style={{marginTop:2}} onClick={()=>setModal({type:'longdist'})}>Book</button>
              </div>
            </div>
          ))}
        </div>
      ))}
      <div className="slabel">Joint trips</div>
      <button className="btn btn-outline btn-full" onClick={()=>setModal({type:'joint'})}>
        <i className="ti ti-arrows-transfer-up" /> Browse joint trips →
      </button>
    </div>
  )
}

function MapPage() {
  return (
    <div className="view fade-in">
      <div className="slabel">Live taxi map — Dassenhoek & Pinetown</div>
      <LeafletMap height="350px" dark />
      <div className="slabel">Stop congestion</div>
      {STOPS.slice(0,3).map((s,i)=>{
        const p=s.crowd<50?'green':s.crowd<75?'amber':'red'
        return (
          <div key={i} className="card">
            <div className="card-body" style={{padding:10}}>
              <div className="row-sb" style={{marginBottom:5}}>
                <div style={{fontSize:12,fontWeight:600}}>{s.name}</div>
                <span className={`pill ${p}`}>{s.passengers} waiting</span>
              </div>
              <div className="bar-track"><div className={`bar-fill ${p}`} style={{width:`${s.crowd}%`}} /></div>
              <div style={{fontSize:10,color:'var(--text2)',marginTop:4}}>{s.area} · {s.crowd}% full</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function TokensPage({ setModal, subscription }) {
  return (
    <div className="view fade-in">
      <div className="slabel">My active token</div>
      <div className="active-token">
        <div className="at-label">Weekly Unite — Active</div>
        <div className="at-title">Dassenhoek → Pinetown</div>
        <div className="at-sub">Expires: Sun 18 May · Token #KZN-WKL-4472</div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8}}>
        <button className="btn btn-green btn-full" style={{flexDirection:'column',gap:4,padding:'12px 6px',fontSize:11}} onClick={()=>setModal({type:'book',plan:'single'})}><i className="ti ti-ticket" style={{fontSize:20}} />Single Trip</button>
        <button className="btn btn-outline btn-full" style={{flexDirection:'column',gap:4,padding:'12px 6px',fontSize:11,borderColor:'#00C566',color:'#009950'}} onClick={()=>setModal({type:'book',plan:'weekly'})}><i className="ti ti-calendar-week" style={{fontSize:20}} />Weekly Unite</button>
        <button className="btn btn-outline btn-full" style={{flexDirection:'column',gap:4,padding:'12px 6px',fontSize:11,borderColor:'#8B5CF6',color:'#6D28D9'}} onClick={()=>setModal({type:'book',plan:'monthly'})}><i className="ti ti-calendar-month" style={{fontSize:20}} />Monthly Unite</button>
      </div>
      <PointsBar points={MOCK_RIDER.points} proPoints={MOCK_RIDER.proPoints} />
      <div className="slabel">Token history</div>
      <div className="card">
        {[{date:'7–13 May',type:'Weekly Unite',route:'Dassenhoek → Pinetown',amount:'R75',pts:'+14pts'},{date:'30 Apr',type:'Single Trip',route:'Dassenhoek → Pinetown',amount:'R10',pts:'+14pts'},{date:'April',type:'Monthly Unite',route:'All routes',amount:'R250',pts:'+14pts'}].map((t,i)=>(
          <div key={i} className="list-item">
            <div className="li-icon" style={{background:'var(--green-light)'}}><i className="ti ti-credit-card" style={{color:'#009950'}} /></div>
            <div className="li-info"><div className="li-name">{t.type}</div><div className="li-sub">{t.date} · {t.route}</div></div>
            <div style={{textAlign:'right'}}>
              <div style={{fontSize:13,fontWeight:600,color:'#009950'}}>{t.amount}</div>
              <div style={{fontSize:10,color:'#009950'}}>{t.pts}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ProfilePage({ setModal, rider, subscription }) {
  const r = rider||MOCK_RIDER
  return (
    <div className="view fade-in">
      <div className="slabel">My profile</div>
      <div className="card">
        <div className="card-body" style={{display:'flex',flexDirection:'column',alignItems:'center',textAlign:'center',gap:12,padding:20}}>
          <div style={{width:64,height:64,borderRadius:'50%',background:'var(--green-light)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,fontWeight:700,color:'#009950',fontFamily:'Space Grotesk'}}>{r.initials||'ND'}</div>
          <div>
            <div style={{fontSize:16,fontWeight:700,fontFamily:'Space Grotesk'}}>{r.name}</div>
            <div style={{fontSize:11,color:'var(--text2)',marginTop:2}}>{r.area} · Since {r.memberSince}</div>
          </div>
          <div style={{background:subscription==='free'?'var(--surface2)':subscription==='weekly'?'var(--green-light)':'var(--purple-light)',borderRadius:8,padding:'8px 16px',width:'100%',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <div>
              <div style={{fontSize:11,color:'var(--text2)'}}>Current plan</div>
              <div style={{fontSize:13,fontWeight:700,color:subscription==='free'?'var(--text2)':subscription==='weekly'?'#009950':'#6D28D9'}}>
                {subscription==='free'?'Free':subscription==='weekly'?'Weekly Unite — R75/wk':'Monthly Unite — R250/mo'}
              </div>
            </div>
            <button className="btn btn-sm btn-green" onClick={()=>setModal({type:'book',plan:subscription==='free'?'weekly':subscription})}>Upgrade</button>
          </div>
          <div className="stat-grid" style={{width:'100%',gridTemplateColumns:'1fr 1fr 1fr'}}>
            <div className="stat-box"><div className="snum">{r.trips}</div><div className="slbl">Trips</div></div>
            <div className="stat-box"><div className="snum">{r.points}</div><div className="slbl">Points</div></div>
            <div className="stat-box"><div className="snum">{r.saved}</div><div className="slbl">Saved</div></div>
          </div>
        </div>
      </div>
      <div className="card" style={{borderColor:'#00C566',borderWidth:1.5}}>
        <div className="card-header" style={{background:'var(--green-light)'}}>
          <span style={{color:'#009950',fontWeight:600}}><i className="ti ti-qrcode" /> My Rider QR Code</span>
          <span className={`pill ${subscription==='free'?'gray':subscription==='weekly'?'green':'purple'}`}>{subscription==='free'?'Free':'Active'}</span>
        </div>
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:8,padding:16}}>
          <div style={{background:'#fff',borderRadius:10,padding:10,border:'1px solid var(--border)'}}>
            <QRCodeSVG value={JSON.stringify({id:r.id,type:'RIDER',name:r.name,area:r.area,subscription,platform:'eStobhini'})} size={130} bgColor="#fff" fgColor="#000" level="M" />
          </div>
          <div style={{fontFamily:'Space Grotesk',fontSize:13,fontWeight:700}}>{r.name}</div>
          <div style={{fontSize:9,color:'var(--text2)',fontFamily:'monospace'}}>{r.id}</div>
          <div style={{display:'flex',gap:8,width:'100%'}}>
            <button className="btn btn-green btn-full" onClick={()=>setModal({type:'riderQR'})}><i className="ti ti-maximize" /> Full view</button>
            <button className="btn btn-outline btn-full" onClick={()=>window.print()}><i className="ti ti-printer" /> Print</button>
          </div>
        </div>
      </div>
      <PointsBar points={r.points} proPoints={r.proPoints} />
    </div>
  )
}

// ─── RiderView ────────────────────────────────────────────────────
export default function RiderView({ activeNav }) {
  const [modal, setModal]               = useState(null)
  const [subscription, setSubscription] = useState('weekly')
  const [rider, setRider]               = useState(null)

  const pages=[HomePage, RoutesPage, MapPage, TokensPage, ProfilePage]
  const Page=pages[activeNav]||pages[0]

  return (
    <>
      <Page setModal={setModal} rider={rider} subscription={subscription} />

      {modal?.type==='signup'   && <SignupModal    onClose={()=>setModal(null)} onSignup={u=>setRider(u)} />}
      {modal?.type==='book'     && <BookModal      plan={modal.plan} onClose={()=>setModal(null)} />}
      {modal?.type==='joint'    && <JointTripModal onClose={()=>setModal(null)} />}
      {modal?.type==='longdist' && <LongDistanceModal onClose={()=>setModal(null)} />}
      {modal?.type==='riderQR'  && (
        <Modal onClose={()=>setModal(null)}>
          <ModalHeader title="My Rider QR" onClose={()=>setModal(null)} />
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:10,padding:'8px 0'}}>
            <div style={{background:'#fff',borderRadius:12,padding:14,border:'1px solid var(--border)'}}>
              <QRCodeSVG value={JSON.stringify({id:(rider||MOCK_RIDER).id,type:'RIDER',name:(rider||MOCK_RIDER).name,subscription,platform:'eStobhini'})} size={200} bgColor="#fff" fgColor="#000" level="M" />
            </div>
            <div style={{fontFamily:'Space Grotesk',fontSize:14,fontWeight:700}}>{(rider||MOCK_RIDER).name}</div>
            <div style={{fontSize:10,color:'var(--text2)',fontFamily:'monospace'}}>{(rider||MOCK_RIDER).id}</div>
          </div>
          <div style={{display:'flex',gap:8}}>
            <button className="btn btn-green btn-full" onClick={()=>{navigator.share?.({title:'eStobhini Rider QR',url:'https://estobhini.vercel.app'})}}><i className="ti ti-share" /> Share QR link</button>
            <button className="btn btn-outline btn-full" onClick={()=>window.print()}><i className="ti ti-printer" /> Print</button>
          </div>
        </Modal>
      )}
    </>
  )
}
