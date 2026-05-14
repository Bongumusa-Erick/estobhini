import React from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { DRIVERS } from '../data/db.js'

const ME = DRIVERS[0]
const today = new Date().toISOString().split('T')[0]
const STOPS = ['Dassenhoek Taxi Rank (05:45)', 'Hammonds Farm Stop (06:00)', 'Pinetown Taxi Rank (06:22)', 'Durban CBD — Warwick (07:05)']

function TodayPage() {
  return (
    <div className="view fade-in">
      <div className="card" style={{borderColor:'#F59E0B', borderWidth:1.5}}>
        <div className="card-header" style={{background:'#FEF3C7'}}>
          <span style={{color:'#92400E', fontWeight:600}}>{ME.name}</span>
          <span className="pill amber">On duty</span>
        </div>
        <div className="card-body">
          <div className="stat-grid">
            <div className="stat-box"><div className="snum">{ME.tripsToday}</div><div className="slbl">Trips</div></div>
            <div className="stat-box"><div className="snum">R300</div><div className="slbl">Earned</div></div>
            <div className="stat-box"><div className="snum">44</div><div className="slbl">Passengers</div></div>
          </div>
          <div style={{marginTop:10, fontSize:12, color:'#6B7280'}}>
            <i className="ti ti-car" /> <strong style={{color:'#111827'}}>{ME.taxi}</strong> &nbsp;·&nbsp; {ME.license}
          </div>
        </div>
      </div>
      <div className="slabel">Today's route — {ME.route}</div>
      <div className="card">
        <div className="card-body" style={{display:'flex', flexDirection:'column', gap:10}}>
          {STOPS.map((s, i) => (
            <div key={i} className="row" style={{gap:10}}>
              <div style={{width:22, height:22, borderRadius:'50%', background:i<2?'#00C566':'#F0F2F5', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0}}>
                <i className="ti ti-check" style={{fontSize:11, color:i<2?'white':'#9CA3AF'}} />
              </div>
              <span style={{fontSize:12, color:i<2?'#111827':'#6B7280'}}>{s}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function PassengersPage() {
  return (
    <div className="view fade-in">
      <div className="slabel">Current passengers — {ME.taxi}</div>
      <div className="card">
        <div className="card-header">
          <span className="ch-title">{ME.route}</span>
          <span className="pill green">12 / 15 seats</span>
        </div>
        <div className="card-body" style={{padding:'8px 14px'}}>
          {Array.from({length:12}, (_, i) => (
            <div key={i} className="list-item" style={{padding:'6px 0'}}>
              <div className="li-icon" style={{background:'#F0F2F5', width:26, height:26, borderRadius:'50%'}}>
                <i className="ti ti-user" style={{fontSize:13, color:'#9CA3AF'}} />
              </div>
              <div className="li-info">
                <div className="li-name" style={{fontSize:12}}>Seat {i+1} — Token #KZN{1000 + i*17}</div>
              </div>
              <span className="pill green" style={{fontSize:9}}>Paid</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function StatsPage() {
  return (
    <div className="view fade-in">
      <div className="slabel">My stats</div>
      <div className="stat-grid">
        <div className="stat-box"><div className="snum">13</div><div className="slbl">Today</div></div>
        <div className="stat-box"><div className="snum">62</div><div className="slbl">This week</div></div>
        <div className="stat-box"><div className="snum">4.9★</div><div className="slbl">Rating</div></div>
      </div>
      <div className="card">
        <div className="card-header"><span className="ch-title">Weekly trips</span></div>
        <div className="card-body">
          <div className="earn-chart">
            {[10,13,15,12,13,8,4].map((v, i) => (
              <div key={i} className="earn-col">
                <div className="earn-bar" style={{height: Math.round(v/15*55)+5, background:'#F59E0B'}} />
                <div className="earn-day">{['M','T','W','T','F','S','S'][i]}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function MyQRPage() {
  const data = { id: `DRV-${ME.id}`, type: 'DRIVER', name: ME.name, taxi: ME.taxi, license: ME.license, route: ME.route, operator: ME.ownerId, province: 'KwaZulu-Natal', issued: today }
  return (
    <div className="view fade-in">
      <div className="slabel">My driver QR code</div>
      <div className="card">
        <div className="qr-wrap">
          <div className="qr-frame">
            <QRCodeSVG value={JSON.stringify(data)} size={160} bgColor="#fff" fgColor="#000" level="M" />
          </div>
          <div className="qr-title">{ME.name}</div>
          <div className="qr-sub">DRV-{ME.id} · {ME.taxi}</div>
          <div style={{fontSize:11, color:'#6B7280', textAlign:'center'}}>{ME.license} · {ME.route}</div>
        </div>
        <div style={{padding:'0 14px 14px'}}>
          <button className="btn btn-outline btn-full"><i className="ti ti-download" /> Download QR</button>
        </div>
      </div>
    </div>
  )
}

export default function DriverView({ activeNav }) {
  const pages = [TodayPage, TodayPage, PassengersPage, StatsPage, MyQRPage]
  const Page = pages[activeNav] || pages[0]
  return <Page />
}
