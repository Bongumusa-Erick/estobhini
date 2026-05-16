import React, { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'

export function generateTokenId(type) {
  const prefix = type==='single'?'SGL':type==='weekly'?'WKL':'MTH'
  const rand = Math.random().toString(36).substring(2,8).toUpperCase()
  return `KZN-${prefix}-${rand}-${Date.now().toString(36).toUpperCase()}`
}

export function buildTokenQRData({ tokenId, plan, route, rider, expires, type, price }) {
  return {
    id: tokenId, type:'ESTOBHINI_TOKEN',
    plan, route, rider, expires, price,
    singleUse: type==='single',
    tripsAllowed: type==='single' ? 1 : type==='weekly' ? 999 : 9999,
    tripsUsed: 0,
    status:'ACTIVE',
    issuedAt: new Date().toISOString(),
    platform:'eStobhini', province:'KwaZulu-Natal',
  }
}

// ─── Print till slip (80mm) ───────────────────────────────────────
export function printTillSlip(token) {
  const qrStr = JSON.stringify(buildTokenQRData(token))
  const win = window.open('','_blank','width=340,height=700')
  win.document.write(`<!DOCTYPE html>
<html><head>
<title>eStobhini Token</title>
<script src="https://cdn.jsdelivr.net/npm/qrcode/build/qrcode.min.js"><\/script>
<style>
@page{size:80mm auto;margin:0}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Courier New',monospace;width:72mm;padding:4mm 4mm 6mm;font-size:10px;background:#fff;color:#000}
.c{text-align:center}.b{font-weight:bold}
.logo{font-size:17px;font-weight:bold}.logo span{color:#009950}
.tag{font-size:7px;color:#666}
.dash{border-top:1px dashed #000;margin:3px 0}
.plan-box{border:2px solid #009950;border-radius:3px;padding:5px;text-align:center;margin:5px 0}
.plan-name{font-size:12px;font-weight:bold;color:#009950}
.plan-price{font-size:20px;font-weight:bold}
.valid{background:#009950;color:#fff;text-align:center;padding:4px;font-size:8px;font-weight:bold;margin:4px 0;border-radius:2px}
.warn{background:${token.type==='single'?'#EF4444':'#F59E0B'};color:#fff;text-align:center;padding:3px;font-size:7px;font-weight:bold;margin:3px 0;border-radius:2px}
.qr{display:flex;justify-content:center;margin:6px 0}
.tid{text-align:center;font-size:8px;letter-spacing:1px;margin:3px 0;font-weight:bold}
.row{display:flex;justify-content:space-between;padding:2px 0;font-size:8px}
.foot{font-size:7px;color:#666;text-align:center;margin-top:5px}
</style></head><body>
<div class="c"><div class="logo">e<span>Stobhini</span></div>
<div class="tag">KwaZulu-Natal Taxi Platform</div>
<div class="tag">estobhini.vercel.app</div></div>
<div class="dash"></div>
<div class="plan-box">
<div class="plan-name">${token.plan}</div>
<div class="plan-price">${token.price}</div>
</div>
<div class="valid">✓ VALID TOKEN — SHOW TO DRIVER BEFORE BOARDING</div>
<div class="warn">${token.type==='single'?'⚠ ONE-TIME USE — EXPIRES AFTER 1 SCAN':token.type==='weekly'?'📅 WEEKLY — 1 TRIP DEDUCTED PER SCAN':'♾ MONTHLY — UNLIMITED TRIPS'}</div>
<div class="qr"><canvas id="qrc"></canvas></div>
<div class="tid">${token.tokenId}</div>
<div class="dash"></div>
<div class="row"><span>Route:</span><span class="b">${token.route}</span></div>
<div class="row"><span>Holder:</span><span>${token.rider}</span></div>
<div class="row"><span>Travel date:</span><span>${token.travelDate||'Any valid day'}</span></div>
<div class="row"><span>Issued:</span><span>${new Date().toLocaleDateString('en-ZA')}</span></div>
<div class="row"><span>Expires:</span><span>${token.expires}</span></div>
<div class="row"><span>Payment:</span><span>${token.paymentMethod||'App'}</span></div>
<div class="row"><span>Association:</span><span>DLTA — Dassenhoek</span></div>
<div class="dash"></div>
<div class="foot"><p>Non-transferable. Valid for route shown only.</p>
<p>Support: estobhini.vercel.app | SANTACO KZN</p></div>
<script>
QRCode.toCanvas(document.getElementById('qrc'),${JSON.stringify(qrStr)},{width:168,margin:1,color:{dark:'#000',light:'#fff'}},function(e){if(!e)setTimeout(()=>window.print(),600)})
<\/script></body></html>`)
  win.document.close()
}

// ─── Share token ──────────────────────────────────────────────────
export function shareToken(token) {
  const text = `🚌 eStobhini Token\n\nPlan: ${token.plan}\nRoute: ${token.route}\nPrice: ${token.price}\nToken ID: ${token.tokenId}\nExpires: ${token.expires}\n\nDownload eStobhini: estobhini.vercel.app`
  if (navigator.share) {
    navigator.share({ title:'eStobhini Token', text, url:'https://estobhini.vercel.app' })
  } else {
    // fallback — copy to clipboard
    navigator.clipboard?.writeText(text)
    alert('Token details copied! Paste into WhatsApp, SMS or any app.')
  }
}

// ─── Token display card (shown after purchase) ────────────────────
export default function TokenCard({ token, onClose }) {
  const [shared, setShared] = useState(false)

  const handleShare = () => { shareToken(token); setShared(true); setTimeout(()=>setShared(false),2000) }
  const handlePrint = () => printTillSlip(token)

  const qrData = buildTokenQRData(token)

  return (
    <div style={{display:'flex',flexDirection:'column',gap:0,borderRadius:12,overflow:'hidden',border:'1.5px solid #00C566',boxShadow:'0 4px 20px rgba(0,198,102,.2)'}}>
      {/* Header */}
      <div style={{background:'linear-gradient(135deg,#009950,#00C566)',padding:'14px 16px',color:'#fff'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
          <div>
            <div style={{fontSize:10,opacity:.8,marginBottom:2}}>✓ Token purchased</div>
            <div style={{fontFamily:'Space Grotesk',fontSize:16,fontWeight:700}}>{token.plan}</div>
            <div style={{fontSize:11,opacity:.85,marginTop:2}}>{token.route}</div>
          </div>
          <div style={{textAlign:'right'}}>
            <div style={{fontFamily:'Space Grotesk',fontSize:22,fontWeight:700}}>{token.price}</div>
            {token.travelDate && <div style={{fontSize:10,opacity:.8}}>{token.travelDate}</div>}
          </div>
        </div>
      </div>

      {/* QR code */}
      <div style={{background:'#fff',display:'flex',flexDirection:'column',alignItems:'center',padding:'16px',gap:8}}>
        <div style={{padding:10,border:'1px solid #E5E7EB',borderRadius:8,background:'#fff'}}>
          <QRCodeSVG value={JSON.stringify(qrData)} size={160} bgColor="#fff" fgColor="#000" level="H" />
        </div>
        <div style={{fontFamily:'monospace',fontSize:9,color:'#6B7280',textAlign:'center'}}>{token.tokenId}</div>
        <div style={{background:token.type==='single'?'#FEE2E2':token.type==='weekly'?'#E6FBF2':'#F5F3FF',borderRadius:6,padding:'4px 10px',fontSize:10,fontWeight:600,color:token.type==='single'?'#991B1B':token.type==='weekly'?'#009950':'#6D28D9'}}>
          {token.type==='single'?'⚠ One-time use — expires after 1 driver scan':token.type==='weekly'?'📅 Weekly — driver scans deduct 1 trip each time':'♾ Monthly — unlimited trips until expiry'}
        </div>
        <div style={{fontSize:10,color:'#6B7280',textAlign:'center'}}>Expires: <strong>{token.expires}</strong></div>
      </div>

      {/* Action buttons */}
      <div style={{padding:'10px 14px',background:'var(--surface2)',display:'flex',gap:8,borderTop:'1px solid var(--border)'}}>
        <button className="btn btn-green" style={{flex:1,fontSize:12}} onClick={handleShare}>
          <i className="ti ti-share" /> {shared?'Shared!':'Share'}
        </button>
        <button className="btn btn-outline" style={{flex:1,fontSize:12}} onClick={handlePrint}>
          <i className="ti ti-printer" /> Print slip
        </button>
        {onClose && <button className="btn btn-outline" style={{flex:1,fontSize:12}} onClick={onClose}>
          <i className="ti ti-x" /> Close
        </button>}
      </div>

      {/* Share options hint */}
      <div style={{padding:'8px 14px',background:'var(--surface2)',borderTop:'1px solid var(--border)',display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
        {[{icon:'ti-brand-whatsapp',label:'WhatsApp',color:'#25D366'},{icon:'ti-bluetooth',label:'Bluetooth',color:'#0082FC'},{icon:'ti-mail',label:'Email',color:'#EA4335'},{icon:'ti-message',label:'SMS',color:'#6B7280'}].map(s=>(
          <button key={s.label} onClick={handleShare} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:2,background:'none',border:'none',cursor:'pointer'}}>
            <i className={`ti ${s.icon}`} style={{fontSize:20,color:s.color}} />
            <span style={{fontSize:9,color:'var(--text2)'}}>{s.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
