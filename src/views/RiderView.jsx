import React, { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { ROUTES, STOPS } from '../data/db.js'
import Modal, { ModalHeader } from '../components/Modal.jsx'

const today = new Date().toISOString().split('T')[0]

// ─── Rider profile (mock logged-in user) ─────────────────────────
const RIDER = {
  id: 'RDR-KZN-0042',
  name: 'Nokukhanya Dlamini',
  initials: 'ND',
  phone: '+27 72 555 0042',
  area: 'Dassenhoek',
  memberSince: 'May 2025',
  subscription: 'free',   // 'free' | 'weekly' | 'monthly'
  trips: 142,
  saved: 'R1,890',
}

// ─── Subscribe Modal ──────────────────────────────────────────────
function SubscribeModal({ onClose, onSubscribe }) {
  const [selected, setSelected] = useState('free')
  return (
    <Modal onClose={onClose}>
      <ModalHeader title="Choose your plan" onClose={onClose} />
      <p style={{fontSize:12, color:'#6B7280'}}>eStobhini is free to use. Upgrade anytime for unlimited tokens and priority booking.</p>

      {/* Free plan */}
      <div onClick={() => setSelected('free')} style={{
        border: `1.5px solid ${selected==='free'?'#00C566':'#E5E7EB'}`,
        background: selected==='free'?'#E6FBF2':'#fff',
        borderRadius:10, padding:14, cursor:'pointer'
      }}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <div>
            <div style={{fontWeight:700, fontSize:14, color:'#111827'}}>Free <span style={{fontSize:11, fontWeight:400, color:'#6B7280'}}>— No cost, ever</span></div>
            <div style={{fontSize:11, color:'#6B7280', marginTop:4}}>
              ✓ Book rides &nbsp;·&nbsp; ✓ View live stops &nbsp;·&nbsp; ✓ Rider QR code<br/>
              ✓ Route info &nbsp;·&nbsp; ✓ Cash or token payment
            </div>
          </div>
          <div style={{fontSize:22, fontWeight:700, color:'#009950'}}>R0</div>
        </div>
      </div>

      {/* Weekly plan */}
      <div onClick={() => setSelected('weekly')} style={{
        border: `1.5px solid ${selected==='weekly'?'#00C566':'#E5E7EB'}`,
        background: selected==='weekly'?'#E6FBF2':'#fff',
        borderRadius:10, padding:14, cursor:'pointer'
      }}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <div>
            <div style={{fontWeight:700, fontSize:14, color:'#111827'}}>Weekly Unite</div>
            <div style={{fontSize:11, color:'#6B7280', marginTop:4}}>
              ✓ Everything in Free<br/>
              ✓ Unlimited trips on 1 route for 7 days<br/>
              ✓ Priority seat booking &nbsp;·&nbsp; ✓ No per-trip fee
            </div>
          </div>
          <div style={{fontSize:22, fontWeight:700, color:'#009950'}}>R75</div>
        </div>
      </div>

      {/* Monthly plan */}
      <div onClick={() => setSelected('monthly')} style={{
        border: `1.5px solid ${selected==='monthly'?'#8B5CF6':'#E5E7EB'}`,
        background: selected==='monthly'?'#F5F3FF':'#fff',
        borderRadius:10, padding:14, cursor:'pointer', position:'relative'
      }}>
        <div style={{position:'absolute', top:-10, right:12, background:'#8B5CF6', color:'#fff', fontSize:9, fontWeight:700, padding:'2px 8px', borderRadius:100}}>BEST VALUE</div>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <div>
            <div style={{fontWeight:700, fontSize:14, color:'#111827'}}>Monthly Unite</div>
            <div style={{fontSize:11, color:'#6B7280', marginTop:4}}>
              ✓ Everything in Weekly<br/>
              ✓ All routes for 30 days<br/>
              ✓ Special trip booking &nbsp;·&nbsp; ✓ Early boarding
            </div>
          </div>
          <div style={{fontSize:22, fontWeight:700, color:'#6D28D9'}}>R250</div>
        </div>
      </div>

      <button
        className={`btn btn-full ${selected==='monthly'?'btn-purple':'btn-green'}`}
        onClick={() => { onSubscribe(selected); onClose(); }}
      >
        {selected==='free' ? 'Continue with Free' : `Subscribe — ${selected==='weekly'?'R75/week':'R250/month'}`}
      </button>
      <div style={{fontSize:10, color:'#9CA3AF', textAlign:'center'}}>Cancel anytime · No hidden fees · Secure payment via EFT or card</div>
    </Modal>
  )
}

// ─── Rider QR Modal ───────────────────────────────────────────────
function RiderQRModal({ rider, onClose }) {
  const data = {
    id: rider.id,
    type: 'RIDER',
    name: rider.name,
    phone: rider.phone,
    area: rider.area,
    subscription: rider.subscription,
    memberSince: rider.memberSince,
    province: 'KwaZulu-Natal',
    platform: 'eStobhini',
    issued: today,
  }
  return (
    <Modal onClose={onClose}>
      <ModalHeader title="My Rider QR Code" onClose={onClose} />
      <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:10, padding:'8px 0'}}>
        <div style={{background:'#fff', borderRadius:12, padding:14, border:'1px solid #E5E7EB', boxShadow:'0 4px 12px rgba(0,0,0,.1)'}}>
          <QRCodeSVG value={JSON.stringify(data)} size={180} bgColor="#fff" fgColor="#000" level="M" />
        </div>
        <div style={{fontFamily:'Space Grotesk', fontSize:14, fontWeight:700, textAlign:'center'}}>{rider.name}</div>
        <div style={{fontSize:10, color:'#6B7280', fontFamily:'monospace', textAlign:'center'}}>{rider.id}</div>
        <div style={{display:'flex', gap:6, flexWrap:'wrap', justifyContent:'center'}}>
          <span className="pill green">Rider</span>
          <span className={`pill ${rider.subscription==='free'?'gray':rider.subscription==='weekly'?'green':'purple'}`}>
            {rider.subscription==='free'?'Free plan':rider.subscription==='weekly'?'Weekly Unite':'Monthly Unite'}
          </span>
          <span className="pill blue">KZN</span>
        </div>
        <div style={{background:'#F0F2F5', borderRadius:9, padding:11, width:'100%', fontSize:11, color:'#6B7280', display:'flex', flexDirection:'column', gap:4}}>
          <div><strong style={{color:'#111827'}}>Area:</strong> {rider.area}, KwaZulu-Natal</div>
          <div><strong style={{color:'#111827'}}>Member since:</strong> {rider.memberSince}</div>
          <div><strong style={{color:'#111827'}}>Platform:</strong> eStobhini</div>
          <div><strong style={{color:'#111827'}}>Issued:</strong> {today}</div>
        </div>
        <p style={{fontSize:10, color:'#9CA3AF', textAlign:'center'}}>Show this QR to rank managers or drivers to verify your eStobhini membership and active subscription.</p>
      </div>
      <button className="btn btn-outline btn-full"><i className="ti ti-download" /> Download QR</button>
    </Modal>
  )
}

// ─── Sign up / Login Modal ────────────────────────────────────────
function SignupModal({ onClose }) {
  const [mode, setMode] = useState('signup')
  return (
    <Modal onClose={onClose}>
      <ModalHeader title={mode==='signup'?'Join eStobhini — Free':'Sign in'} onClose={onClose} />
      {mode==='signup' && (
        <>
          <div style={{background:'#E6FBF2', borderRadius:8, padding:10, fontSize:12, color:'#009950', fontWeight:500}}>
            ✓ Free forever &nbsp;·&nbsp; ✓ No credit card needed &nbsp;·&nbsp; ✓ Get your Rider QR instantly
          </div>
          <div className="form-grid-2">
            <div className="form-group"><label>First name</label><input placeholder="e.g. Nokukhanya" /></div>
            <div className="form-group"><label>Surname</label><input placeholder="e.g. Dlamini" /></div>
          </div>
          <div className="form-group"><label>Phone number</label><input placeholder="+27 72 ..." /></div>
          <div className="form-group"><label>Area / township</label><input placeholder="e.g. Dassenhoek" /></div>
          <div className="form-group"><label>Create a PIN</label><input type="password" placeholder="4-digit PIN" maxLength={4} /></div>
          <button className="btn btn-green btn-full" onClick={onClose}><i className="ti ti-check" /> Create free account & get QR</button>
          <div style={{fontSize:11, color:'#6B7280', textAlign:'center'}}>Already have an account? <span style={{color:'#00C566', cursor:'pointer'}} onClick={()=>setMode('login')}>Sign in</span></div>
        </>
      )}
      {mode==='login' && (
        <>
          <div className="form-group"><label>Phone number</label><input placeholder="+27 72 ..." /></div>
          <div className="form-group"><label>PIN</label><input type="password" placeholder="4-digit PIN" maxLength={4} /></div>
          <button className="btn btn-green btn-full" onClick={onClose}>Sign in</button>
          <div style={{fontSize:11, color:'#6B7280', textAlign:'center'}}>No account? <span style={{color:'#00C566', cursor:'pointer'}} onClick={()=>setMode('signup')}>Sign up free</span></div>
        </>
      )}
    </Modal>
  )
}

// ─── Pages ────────────────────────────────────────────────────────
function HomePage({ setModal }) {
  const [selected, setSelected] = useState(0)

  return (
    <div className="view fade-in">
      <div className="hero">
        <div className="hero-badge"><i className="ti ti-map-pin" style={{fontSize:10}} /> Dassenhoek · KwaZulu-Natal</div>
        <h2>Where to today?</h2>
        <p>Book your seat · Pay by token · No cash · No waiting</p>
        <div className="hero-search">
          <input className="hero-input" placeholder="e.g. Dassenhoek → Pinetown..." />
          <button className="btn" style={{background:'#fff', color:'#009950', fontSize:12, padding:'7px 14px', borderRadius:8, border:'none', fontWeight:500}}>Go</button>
        </div>
      </div>

      <div className="slabel">Popular routes near you</div>
      <div className="routes-grid">
        {ROUTES.slice(0,4).map((r,i) => (
          <div key={i} className="route-card" onClick={() => setSelected(i)}
            style={selected===i?{borderColor:'#00C566', background:'#E6FBF2'}:{}}>
            <div className="route-name">{r.name}</div>
            <div className="route-pills">
              <span className="pill green">{r.time}</span>
              <span className="pill blue">{r.fare}</span>
              <span className="pill amber">{r.seats} seats</span>
            </div>
            <div className="route-freq">{r.freq}</div>
          </div>
        ))}
      </div>

      {/* Free subscription CTA */}
      <div style={{background:'linear-gradient(135deg,#1a1a2e,#2d3748)', borderRadius:12, padding:16, color:'#fff'}}>
        <div style={{fontSize:10, opacity:.7, marginBottom:4}}>NEW — Free for all riders</div>
        <div style={{fontFamily:'Space Grotesk', fontSize:15, fontWeight:700, marginBottom:4}}>Get your free Rider QR code</div>
        <div style={{fontSize:11, opacity:.8, marginBottom:12}}>Sign up free · Show at rank · Upgrade anytime for unlimited trips</div>
        <div style={{display:'flex', gap:8}}>
          <button className="btn btn-green" style={{flex:1}} onClick={() => setModal('signup')}><i className="ti ti-user-plus" /> Join free</button>
          <button className="btn" style={{background:'rgba(255,255,255,.15)', color:'#fff', flex:1}} onClick={() => setModal('subscribe')}><i className="ti ti-crown" /> View plans</button>
        </div>
      </div>
    </div>
  )
}

function RoutesPage() {
  return (
    <div className="view fade-in">
      <div className="slabel">All KZN routes</div>
      {ROUTES.map((r,i) => (
        <div key={i} className="card">
          <div className="card-body" style={{padding:11}}>
            <div className="row-sb" style={{marginBottom:6}}>
              <div style={{fontSize:13, fontWeight:600}}>{r.name}</div>
              <span className="pill blue">{r.fare}</span>
            </div>
            <div className="route-pills">
              <span className="pill green">{r.time}</span>
              <span className="pill amber">{r.seats} seats</span>
              <span className="pill green">{r.freq}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function StopsPage() {
  return (
    <div className="view fade-in">
      <div className="slabel">Live stop info</div>
      {STOPS.map((s,i) => {
        const barColor = s.crowd<50?'green':s.crowd<75?'amber':'red'
        const pillColor = s.crowd<50?'green':s.crowd<75?'amber':'red'
        return (
          <div key={i} className="card">
            <div className="card-body" style={{padding:11}}>
              <div className="row-sb" style={{marginBottom:6}}>
                <div style={{fontSize:13, fontWeight:600}}>{s.name}</div>
                <span className={`pill ${pillColor}`}>{s.passengers} waiting</span>
              </div>
              <div className="bar-track">
                <div className={`bar-fill ${barColor}`} style={{width:`${s.crowd}%`}} />
              </div>
              <div style={{fontSize:10, color:'#6B7280', marginTop:4}}>{s.area} · {s.crowd}% full</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function TokensPage({ setModal }) {
  return (
    <div className="view fade-in">
      <div className="slabel">My tokens</div>
      <div className="active-token">
        <div className="at-label">Active token</div>
        <div className="at-title">Weekly Unite — Dassenhoek → Pinetown</div>
        <div className="at-sub">Expires: Sun 18 May · Token #KZN-W-4472</div>
      </div>
      <div className="card">
        <div className="card-body" style={{display:'flex', flexDirection:'column', gap:10}}>
          <div className="row-sb">
            <div style={{fontSize:12, color:'#6B7280'}}>Trips used this week</div>
            <div style={{fontSize:12, fontWeight:600}}>9 / unlimited</div>
          </div>
          <div className="bar-track"><div className="bar-fill green" style={{width:'60%'}} /></div>
          <button className="btn btn-green btn-full" onClick={() => setModal('subscribe')}>Upgrade plan</button>
          <button className="btn btn-outline btn-full">Transfer to bank · R45 balance</button>
        </div>
      </div>
      <div className="slabel">Token history</div>
      <div className="card">
        {[
          {date:'7–13 May', type:'Weekly Unite', route:'Dassenhoek → Pinetown', amount:'R75'},
          {date:'30 Apr–6 May', type:'Weekly Unite', route:'Dassenhoek → Pinetown', amount:'R75'},
          {date:'April', type:'Monthly Unite', route:'All routes', amount:'R250'},
        ].map((t,i) => (
          <div key={i} className="list-item">
            <div className="li-icon" style={{background:'#E6FBF2'}}><i className="ti ti-credit-card" style={{color:'#009950'}} /></div>
            <div className="li-info">
              <div className="li-name">{t.type}</div>
              <div className="li-sub">{t.date} · {t.route}</div>
            </div>
            <div style={{fontSize:13, fontWeight:600, color:'#009950'}}>{t.amount}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ProfilePage({ setModal, subscription, setSubscription }) {
  return (
    <div className="view fade-in">
      <div className="slabel">My profile</div>
      <div className="card">
        <div className="card-body" style={{display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', gap:12, padding:20}}>
          <div style={{width:64, height:64, borderRadius:'50%', background:'#E6FBF2', display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, fontWeight:700, color:'#009950', fontFamily:'Space Grotesk'}}>{RIDER.initials}</div>
          <div>
            <div style={{fontSize:16, fontWeight:700, fontFamily:'Space Grotesk'}}>{RIDER.name}</div>
            <div style={{fontSize:11, color:'#6B7280', marginTop:2}}>{RIDER.area} · eStobhini rider since {RIDER.memberSince}</div>
          </div>

          {/* Subscription badge */}
          <div style={{
            background: subscription==='free'?'#F0F2F5':subscription==='weekly'?'#E6FBF2':'#F5F3FF',
            borderRadius:8, padding:'8px 16px', width:'100%',
            display:'flex', alignItems:'center', justifyContent:'space-between'
          }}>
            <div>
              <div style={{fontSize:11, color:'#6B7280'}}>Current plan</div>
              <div style={{fontSize:13, fontWeight:700, color: subscription==='free'?'#6B7280':subscription==='weekly'?'#009950':'#6D28D9'}}>
                {subscription==='free'?'Free plan':subscription==='weekly'?'Weekly Unite — R75/wk':'Monthly Unite — R250/mo'}
              </div>
            </div>
            <button className="btn btn-sm btn-green" onClick={() => setModal('subscribe')}>
              {subscription==='free'?'Upgrade':'Change'}
            </button>
          </div>

          <div className="stat-grid" style={{width:'100%', gridTemplateColumns:'1fr 1fr'}}>
            <div className="stat-box"><div className="snum">{RIDER.trips}</div><div className="slbl">Total trips</div></div>
            <div className="stat-box"><div className="snum">{RIDER.saved}</div><div className="slbl">Saved vs cash</div></div>
          </div>
        </div>
      </div>

      {/* Rider QR code */}
      <div className="card" style={{borderColor:'#00C566', borderWidth:1.5}}>
        <div className="card-header" style={{background:'#E6FBF2'}}>
          <span style={{color:'#009950', fontWeight:600, display:'flex', alignItems:'center', gap:6}}><i className="ti ti-qrcode" /> My Rider QR Code</span>
          <span className={`pill ${subscription==='free'?'gray':subscription==='weekly'?'green':'purple'}`}>
            {subscription==='free'?'Free':'Active'}
          </span>
        </div>
        <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:10, padding:16}}>
          <div style={{background:'#fff', borderRadius:10, padding:10, border:'1px solid #E5E7EB'}}>
            <QRCodeSVG
              value={JSON.stringify({id:RIDER.id, type:'RIDER', name:RIDER.name, area:RIDER.area, subscription, platform:'eStobhini', issued:today})}
              size={140} bgColor="#fff" fgColor="#000" level="M"
            />
          </div>
          <div style={{fontFamily:'Space Grotesk', fontSize:13, fontWeight:700}}>{RIDER.name}</div>
          <div style={{fontSize:9, color:'#6B7280', fontFamily:'monospace'}}>{RIDER.id}</div>
          <p style={{fontSize:10, color:'#9CA3AF', textAlign:'center'}}>Show this QR at the taxi rank or to your driver to verify your eStobhini membership.</p>
          <div style={{display:'flex', gap:8, width:'100%'}}>
            <button className="btn btn-outline btn-full" onClick={() => setModal('riderQR')}><i className="ti ti-maximize" /> Full view</button>
            <button className="btn btn-outline btn-full"><i className="ti ti-download" /> Download</button>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body" style={{display:'flex', flexDirection:'column', gap:8}}>
          <button className="btn btn-outline btn-full"><i className="ti ti-user-edit" /> Edit profile</button>
          <button className="btn btn-outline btn-full"><i className="ti ti-bell" /> Notification settings</button>
          <button className="btn btn-outline btn-full"><i className="ti ti-credit-card" /> Payment methods</button>
          <button className="btn btn-outline btn-full"><i className="ti ti-help" /> Help & support</button>
        </div>
      </div>
    </div>
  )
}

// ─── RiderView ────────────────────────────────────────────────────
export default function RiderView({ activeNav }) {
  const [modal, setModal]               = useState(null)
  const [subscription, setSubscription] = useState(RIDER.subscription)

  const pages = [HomePage, RoutesPage, StopsPage, TokensPage, ProfilePage]
  const Page  = pages[activeNav] || pages[0]

  return (
    <>
      <Page setModal={setModal} subscription={subscription} setSubscription={setSubscription} />

      {modal === 'signup'    && <SignupModal    onClose={() => setModal(null)} />}
      {modal === 'subscribe' && <SubscribeModal onClose={() => setModal(null)} onSubscribe={setSubscription} />}
      {modal === 'riderQR'   && <RiderQRModal   rider={{...RIDER, subscription}} onClose={() => setModal(null)} />}
    </>
  )
}
