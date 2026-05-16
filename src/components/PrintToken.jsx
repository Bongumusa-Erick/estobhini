import React, { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'

// ─── Generate a unique one-time token ID ─────────────────────────
export function generateTokenId(type, route) {
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase()
  const prefix = type === 'single' ? 'SGL' : type === 'weekly' ? 'WKL' : 'MTH'
  return `KZN-${prefix}-${rand}-${Date.now().toString(36).toUpperCase()}`
}

// ─── Token QR data (scanned by driver) ───────────────────────────
export function buildTokenQR({ tokenId, plan, route, rider, expires, tripsAllowed, type }) {
  return {
    id: tokenId,
    type: 'ESTOBHINI_TOKEN',
    plan,
    route,
    rider,
    expires,
    tripsAllowed,       // 1 for single, 7+ for weekly, unlimited for monthly
    tripsUsed: 0,
    singleUse: type === 'single',
    status: 'ACTIVE',
    issuedAt: new Date().toISOString(),
    platform: 'eStobhini',
    province: 'KwaZulu-Natal',
  }
}

// ─── Token QR display + Print + View buttons ─────────────────────
export function TokenQRCard({ token, onPrint, onView }) {
  return (
    <div style={{
      border: '1.5px solid #00C566', borderRadius: 12,
      overflow: 'hidden', background: 'var(--surface)',
    }}>
      {/* Green header */}
      <div style={{ background: '#009950', padding: '10px 14px', color: '#fff' }}>
        <div style={{ fontSize: 10, opacity: .8 }}>eStobhini Token — {token.plan}</div>
        <div style={{ fontFamily: 'Space Grotesk', fontSize: 15, fontWeight: 700 }}>{token.route}</div>
        <div style={{ fontSize: 10, opacity: .8, marginTop: 2 }}>Expires: {token.expires}</div>
      </div>
      {/* QR */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 14, gap: 8 }}>
        <div style={{ background: '#fff', borderRadius: 8, padding: 10, border: '1px solid #E5E7EB' }}>
          <QRCodeSVG
            value={JSON.stringify(buildTokenQR(token))}
            size={140}
            bgColor="#fff"
            fgColor="#000"
            level="H"
          />
        </div>
        <div style={{ fontFamily: 'monospace', fontSize: 10, color: 'var(--text2)' }}>{token.tokenId}</div>
        <div style={{ display: 'flex', gap: 6 }}>
          <span className={`pill ${token.type === 'single' ? 'blue' : token.type === 'weekly' ? 'green' : 'purple'}`}>
            {token.type === 'single' ? '1 trip only' : token.type === 'weekly' ? 'Weekly — deducts per trip' : 'Monthly — unlimited'}
          </span>
        </div>
        <p style={{ fontSize: 10, color: 'var(--text2)', textAlign: 'center' }}>
          {token.type === 'single'
            ? '⚠️ One-time use — expires after driver scans once'
            : token.type === 'weekly'
            ? 'Driver scans each trip — deducts 1 from your weekly balance'
            : 'Show each trip — never expires until end of month'}
        </p>
        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 8, width: '100%' }}>
          <button className="btn btn-green" style={{ flex: 1 }} onClick={onView}>
            <i className="ti ti-eye" /> View token
          </button>
          <button className="btn btn-outline" style={{ flex: 1 }} onClick={onPrint}>
            <i className="ti ti-printer" /> Print slip
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── PRINT function — 80mm till slip ─────────────────────────────
export function printTillSlip(token) {
  const qrData = JSON.stringify(buildTokenQR(token))
  const win = window.open('', '_blank', 'width=320,height=600')

  win.document.write(`<!DOCTYPE html>
<html>
<head>
  <title>eStobhini Token</title>
  <script src="https://cdn.jsdelivr.net/npm/qrcode/build/qrcode.min.js"></script>
  <style>
    @page { size: 80mm auto; margin: 0; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Courier New', monospace;
      width: 80mm;
      padding: 4mm;
      font-size: 11px;
      background: #fff;
      color: #000;
    }
    .center { text-align: center; }
    .bold { font-weight: bold; }
    .line { border-top: 1px dashed #000; margin: 4px 0; }
    .logo { font-size: 18px; font-weight: bold; margin-bottom: 2px; }
    .logo span { color: #009950; }
    .tagline { font-size: 8px; color: #666; margin-bottom: 4px; }
    .plan-box {
      border: 2px solid #009950; border-radius: 4px;
      padding: 6px; text-align: center; margin: 6px 0;
    }
    .plan-name { font-size: 13px; font-weight: bold; color: #009950; }
    .plan-price { font-size: 22px; font-weight: bold; }
    .qr-wrap { display: flex; justify-content: center; margin: 8px 0; }
    canvas { display: block; margin: 0 auto; }
    .token-id { text-align: center; font-size: 9px; letter-spacing: 1px; margin: 4px 0; font-weight: bold; }
    .valid-strip {
      background: #009950; color: #fff;
      text-align: center; padding: 5px;
      font-size: 9px; font-weight: bold;
      margin: 6px 0; border-radius: 3px;
    }
    .warn-strip {
      background: ${token.type === 'single' ? '#EF4444' : '#F59E0B'}; color: #fff;
      text-align: center; padding: 4px;
      font-size: 8px; font-weight: bold;
      margin: 4px 0; border-radius: 3px;
    }
    .row { display: flex; justify-content: space-between; padding: 2px 0; font-size: 9px; }
    .footer { font-size: 7px; color: #666; text-align: center; margin-top: 6px; }
    @media print { body { margin: 0; } }
  </style>
</head>
<body>
  <div class="center">
    <div class="logo">e<span>Stobhini</span></div>
    <div class="tagline">KwaZulu-Natal Taxi Platform</div>
    <div class="tagline">estobhini.vercel.app</div>
  </div>
  <div class="line"></div>

  <div class="plan-box">
    <div class="plan-name">${token.plan}</div>
    <div class="plan-price">${token.price}</div>
  </div>

  <div class="valid-strip">✓ VALID TOKEN — SHOW TO DRIVER</div>
  <div class="warn-strip">${token.type === 'single' ? '⚠ ONE-TIME USE — EXPIRES AFTER SCAN' : token.type === 'weekly' ? '📅 WEEKLY — 1 TRIP DEDUCTED PER SCAN' : '♾ MONTHLY — UNLIMITED TRIPS'}</div>

  <div class="qr-wrap">
    <canvas id="qr-canvas"></canvas>
  </div>
  <div class="token-id">${token.tokenId}</div>

  <div class="line"></div>
  <div class="row"><span>Route:</span><span><b>${token.route}</b></span></div>
  <div class="row"><span>Holder:</span><span>${token.rider}</span></div>
  <div class="row"><span>Issued:</span><span>${new Date().toLocaleDateString('en-ZA')}</span></div>
  <div class="row"><span>Expires:</span><span>${token.expires}</span></div>
  <div class="row"><span>Payment:</span><span>${token.paymentMethod || 'App'}</span></div>
  <div class="row"><span>Association:</span><span>DLTA</span></div>
  <div class="line"></div>

  <div class="footer">
    <p>Non-transferable. Valid for route shown only.</p>
    <p>For support: estobhini.vercel.app</p>
    <p>SANTACO — KwaZulu-Natal</p>
  </div>

  <script>
    QRCode.toCanvas(document.getElementById('qr-canvas'),
      ${JSON.stringify(qrData)},
      { width: 180, margin: 1, color: { dark: '#000', light: '#fff' } },
      function(err) { if (!err) setTimeout(() => window.print(), 500); }
    );
  </script>
</body>
</html>`)
  win.document.close()
}

// ─── Printer list modal content ───────────────────────────────────
export const PRINTERS = [
  { name:'Epson TM-T88VI',      type:'Thermal receipt', paper:'80mm roll', rec:true },
  { name:'Star TSP143III',      type:'Thermal receipt', paper:'80mm roll', rec:true },
  { name:'Sewoo LK-T212',       type:'Thermal receipt', paper:'80mm roll', rec:true },
  { name:'SNBC BTP-S80',        type:'Thermal receipt', paper:'80mm roll', rec:false },
  { name:'HP LaserJet Pro M15', type:'Laser A4',        paper:'A4 sheet',  rec:false },
]
