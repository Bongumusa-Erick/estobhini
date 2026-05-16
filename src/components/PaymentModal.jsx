import React, { useState } from 'react'

const METHODS = [
  { id:'capitec',  name:'Capitec Pay',   icon:'💙', color:'#0047AB', desc:'Pay instantly via Capitec app' },
  { id:'payshap',  name:'PayShap',       icon:'⚡', color:'#FF6B00', desc:'Instant EFT via any SA bank' },
  { id:'snapscan', name:'SnapScan',      icon:'📷', color:'#7B2D8B', desc:'Scan QR with SnapScan app' },
  { id:'ozow',     name:'Ozow',          icon:'🟢', color:'#00B050', desc:'Instant EFT — no card needed' },
  { id:'card',     name:'Card',          icon:'💳', color:'#1D4ED8', desc:'Visa / Mastercard debit or credit' },
  { id:'eft',      name:'Manual EFT',    icon:'🏦', color:'#374151', desc:'Bank transfer — 1-2 hours' },
  { id:'cash',     name:'Cash at Rank',  icon:'💵', color:'#059669', desc:'Pay cash to rank cashier' },
]

export default function PaymentModal({ plan, onClose, onSuccess }) {
  const [step, setStep] = useState('choose') // choose | details | success
  const [method, setMethod] = useState(null)
  const [cardNum, setCardNum] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [pin, setPin] = useState('')

  const handlePay = () => {
    setStep('processing')
    setTimeout(() => { setStep('success') }, 2000)
  }

  if (step === 'processing') return (
    <div style={{ textAlign:'center', padding:'32px 0', display:'flex', flexDirection:'column', alignItems:'center', gap:16 }}>
      <div style={{ width:56, height:56, borderRadius:'50%', border:'4px solid #00C566', borderTopColor:'transparent', animation:'spin 1s linear infinite' }} />
      <div style={{ fontSize:14, fontWeight:600 }}>Processing payment...</div>
      <div style={{ fontSize:11, color:'var(--text2)' }}>Please wait</div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  if (step === 'success') return (
    <div style={{ textAlign:'center', padding:'24px 0', display:'flex', flexDirection:'column', alignItems:'center', gap:12 }}>
      <div style={{ width:64, height:64, borderRadius:'50%', background:'#E6FBF2', display:'flex', alignItems:'center', justifyContent:'center', fontSize:32 }}>✅</div>
      <div style={{ fontSize:16, fontWeight:700, color:'#009950' }}>Payment Successful!</div>
      <div style={{ fontSize:12, color:'var(--text2)' }}>Your {plan.name} is now active</div>
      <div style={{ background:'var(--green-light)', borderRadius:8, padding:12, width:'100%' }}>
        <div style={{ fontSize:11, color:'var(--text2)', marginBottom:4 }}>Token ID</div>
        <div style={{ fontFamily:'monospace', fontSize:13, fontWeight:700, color:'#009950' }}>
          KZN-{plan.type==='weekly'?'W':'M'}-{Math.floor(Math.random()*9000)+1000}
        </div>
      </div>
      <button className="btn btn-green btn-full" onClick={() => { onSuccess && onSuccess(method); onClose(); }}>
        View my token
      </button>
    </div>
  )

  if (step === 'details' && method) {
    const m = METHODS.find(x => x.id === method)
    return (
      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <button className="btn btn-outline btn-sm" onClick={() => setStep('choose')}>← Back</button>
          <span style={{ fontSize:14, fontWeight:600 }}>{m.icon} {m.name}</span>
        </div>

        <div style={{ background:'var(--surface2)', borderRadius:8, padding:10 }}>
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:12 }}>
            <span style={{ color:'var(--text2)' }}>Plan</span><span style={{ fontWeight:600 }}>{plan.name}</span>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, marginTop:4 }}>
            <span style={{ color:'var(--text2)' }}>Amount</span><span style={{ fontWeight:700, color:'#009950' }}>{plan.price}</span>
          </div>
        </div>

        {method === 'card' && (
          <>
            <div className="form-group"><label>Card number</label>
              <input placeholder="1234 5678 9012 3456" value={cardNum} onChange={e=>setCardNum(e.target.value)} maxLength={19} />
            </div>
            <div className="form-grid-2">
              <div className="form-group"><label>Expiry</label><input placeholder="MM/YY" value={expiry} onChange={e=>setExpiry(e.target.value)} maxLength={5} /></div>
              <div className="form-group"><label>CVV</label><input placeholder="123" value={cvv} onChange={e=>setCvv(e.target.value)} maxLength={4} type="password" /></div>
            </div>
          </>
        )}
        {(method === 'capitec' || method === 'payshap') && (
          <div style={{ background:'var(--surface2)', borderRadius:8, padding:12, textAlign:'center', fontSize:12, color:'var(--text2)' }}>
            <div style={{ fontSize:24, marginBottom:8 }}>{m.icon}</div>
            Enter your {m.name} PIN to authorise payment of <strong style={{color:'#009950'}}>{plan.price}</strong>
            <div className="form-group" style={{ marginTop:12 }}>
              <input placeholder="Enter PIN" type="password" value={pin} onChange={e=>setPin(e.target.value)} maxLength={6} style={{ textAlign:'center', letterSpacing:8, fontSize:20 }} />
            </div>
          </div>
        )}
        {(method === 'snapscan' || method === 'ozow') && (
          <div style={{ background:'var(--surface2)', borderRadius:8, padding:16, textAlign:'center' }}>
            <div style={{ fontSize:13, fontWeight:600, marginBottom:8 }}>Scan this QR with {m.name}</div>
            <div style={{ width:120, height:120, background:'#fff', border:'1px solid var(--border)', borderRadius:8, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, color:'#666' }}>
              [QR for {plan.price}]
            </div>
            <div style={{ fontSize:11, color:'var(--text2)', marginTop:8 }}>Waiting for payment confirmation...</div>
          </div>
        )}
        {method === 'eft' && (
          <div style={{ background:'var(--surface2)', borderRadius:8, padding:12, fontSize:11, display:'flex', flexDirection:'column', gap:4 }}>
            <div style={{ fontWeight:600, marginBottom:4 }}>EFT Banking Details</div>
            <div><strong>Bank:</strong> FNB</div>
            <div><strong>Account name:</strong> eStobhini (Pty) Ltd</div>
            <div><strong>Account number:</strong> 627 011 1234</div>
            <div><strong>Branch code:</strong> 250 655</div>
            <div><strong>Reference:</strong> KZN-{Math.floor(Math.random()*9000)+1000}</div>
            <div style={{ color:'#F59E0B', marginTop:4 }}>⚠️ Payment reflects within 1–2 hours</div>
          </div>
        )}
        {method === 'cash' && (
          <div style={{ background:'var(--surface2)', borderRadius:8, padding:12, textAlign:'center', fontSize:12, color:'var(--text2)' }}>
            <div style={{ fontSize:28, marginBottom:8 }}>💵</div>
            <div style={{ fontWeight:600, color:'var(--text)', marginBottom:4 }}>Pay at Dassenhoek Taxi Rank</div>
            <div>Go to the cashier window and pay <strong style={{color:'#009950'}}>{plan.price}</strong></div>
            <div style={{ marginTop:8 }}>You will receive a paper token receipt.</div>
          </div>
        )}

        <button className="btn btn-green btn-full" onClick={handlePay}>
          Pay {plan.price} with {m.name}
        </button>
      </div>
    )
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
      <div style={{ background:'linear-gradient(135deg,#009950,#00C566)', borderRadius:10, padding:12, color:'#fff', textAlign:'center' }}>
        <div style={{ fontSize:11, opacity:.85 }}>{plan.name}</div>
        <div style={{ fontSize:26, fontWeight:700 }}>{plan.price}</div>
      </div>
      <div style={{ fontSize:12, fontWeight:600, color:'var(--text)' }}>Choose payment method:</div>
      {METHODS.map(m => (
        <button key={m.id} onClick={() => { setMethod(m.id); setStep('details') }}
          style={{
            display:'flex', alignItems:'center', gap:10, padding:'10px 12px',
            borderRadius:9, border:'1px solid var(--border)', background:'var(--surface)',
            cursor:'pointer', transition:'border-color .15s', textAlign:'left', width:'100%',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor='#00C566'}
          onMouseLeave={e => e.currentTarget.style.borderColor='var(--border)'}
        >
          <div style={{ width:36, height:36, borderRadius:9, background:m.color+'22', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>{m.icon}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:13, fontWeight:600, color:'var(--text)' }}>{m.name}</div>
            <div style={{ fontSize:10, color:'var(--text2)' }}>{m.desc}</div>
          </div>
          <span style={{ color:'var(--text2)', fontSize:16 }}>›</span>
        </button>
      ))}
    </div>
  )
}
