import React, { useEffect, useRef, useState } from 'react'

const TAXIS = [
  { id:'ND 142-RT', lat:-29.870, lng:30.868, status:'active',  label:'ND 142', route:'Dassenhoek → Pinetown' },
  { id:'ND 289-KL', lat:-29.858, lng:30.881, status:'active',  label:'ND 289', route:'Dassenhoek → Durban CBD' },
  { id:'ND 331-SJ', lat:-29.848, lng:30.895, status:'active',  label:'ND 331', route:'Pinetown → Durban CBD' },
  { id:'ND 074-NM', lat:-29.843, lng:30.907, status:'idle',    label:'ND 074', route:'Dassenhoek → New Germany' },
  { id:'ND 019-VP', lat:-29.836, lng:30.919, status:'offline', label:'ND 019', route:'Pinetown → Westville' },
]

const ROUTE = [[-29.870,30.868],[-29.862,30.878],[-29.853,30.894],[-29.843,30.908],[-29.836,30.919],[-29.825,30.935]]

const STATUS_COLOR = { active:'#00C566', idle:'#F59E0B', offline:'#EF4444' }

export default function LeafletMap({ height='300px', dark=true }) {
  const ref = useRef(null)
  const mapRef = useRef(null)
  const markersRef = useRef([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (mapRef.current) return

    // Leaflet CSS
    if (!document.getElementById('lf-css')) {
      const l = document.createElement('link')
      l.id='lf-css'; l.rel='stylesheet'
      l.href='https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(l)
    }

    const s = document.createElement('script')
    s.src='https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    s.onload=()=>init()
    document.head.appendChild(s)
    return ()=>{ if(mapRef.current){ mapRef.current.remove(); mapRef.current=null } }
  },[])

  function init() {
    if (!ref.current || mapRef.current) return
    const L = window.L

    // Dark Uber-style tiles
    const map = L.map(ref.current,{ center:[-29.856,30.892], zoom:13, zoomControl:true, attributionControl:false })

    // Dark Uber-style tiles — Stadia Maps (clean, no flags, SA-centered)
    L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png',{
      attribution:'&copy; <a href="https://stadiamaps.com/">Stadia</a> &copy; <a href="https://www.openstreetmap.org/">OSM</a>',
      maxZoom:20,
    }).addTo(map)

    // Clean attribution — no flags
    L.control.attribution({ prefix: '© Stadia · © OSM' }).addTo(map)
    mapRef.current = map

    // Glowing green route line (Uber style)
    L.polyline(ROUTE,{ color:'#00C566', weight:5, opacity:.9 }).addTo(map)
    // Glow effect — wider faded line underneath
    L.polyline(ROUTE,{ color:'#00C566', weight:14, opacity:.15 }).addTo(map)

    // Stop circles
    const stops=[
      {pos:[-29.870,30.868],name:'Dassenhoek Rank',w:22},
      {pos:[-29.853,30.894],name:'Pinetown Rank',w:41},
      {pos:[-29.825,30.935],name:'Durban CBD — Warwick',w:67},
    ]
    stops.forEach(s=>{
      L.circle(s.pos,{radius:80,color:'#00C566',fillColor:'#00C566',fillOpacity:.15,weight:2}).addTo(map)
      L.marker(s.pos,{icon:L.divIcon({
        className:'',
        html:`<div style="background:#1a1a2e;border:2px solid #00C566;border-radius:50%;width:34px;height:34px;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:#00C566;box-shadow:0 0 12px rgba(0,198,102,.5)">${s.w}</div>`,
        iconSize:[34,34],iconAnchor:[17,17],
      })}).addTo(map).bindPopup(`<b>${s.name}</b><br>${s.w} waiting`)
    })

    // Taxi markers — look like real taxi icon
    TAXIS.forEach(t=>{
      const c = STATUS_COLOR[t.status]
      const icon = L.divIcon({
        className:'',
        html:`<div style="position:relative">
          <div style="background:${c};border-radius:6px 6px 6px 0;padding:3px 6px;font-size:9px;font-weight:700;color:#000;white-space:nowrap;box-shadow:0 2px 10px rgba(0,0,0,.5);display:flex;align-items:center;gap:3px">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2.5">
              <rect x="2" y="8" width="20" height="10" rx="2"/><path d="M6 8V6a2 2 0 012-2h8a2 2 0 012 2v2"/>
              <circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>
            </svg>
            ${t.label}
          </div>
          <div style="width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:6px solid ${c};margin-left:6px"></div>
        </div>`,
        iconSize:[70,32],iconAnchor:[35,32],
      })
      const marker = L.marker([t.lat,t.lng],{icon})
        .addTo(map)
        .bindPopup(`<b>${t.id}</b><br>${t.route}<br><span style="color:${c}">● ${t.status}</span>`)
      markersRef.current.push({marker,lat:t.lat,lng:t.lng,dir:1})
    })

    setLoaded(true)

    // Animate taxis
    setInterval(()=>{
      if (!mapRef.current) return
      markersRef.current.forEach(m=>{
        m.lng += 0.00025 * m.dir
        m.lat += (Math.random()-.5)*0.00004
        if (m.lng>30.938) m.dir=-1
        if (m.lng<30.868) m.dir=1
        m.marker.setLatLng([m.lat,m.lng])
      })
    },900)
  }

  return (
    <div style={{position:'relative',width:'100%',height,borderRadius:10,overflow:'hidden',border:'1px solid var(--border)'}}>
      <div ref={ref} style={{width:'100%',height:'100%'}} />
      {!loaded && (
        <div style={{position:'absolute',inset:0,background:'#0d1117',display:'flex',alignItems:'center',justifyContent:'center',gap:8,color:'#00C566',fontSize:12}}>
          <div style={{width:16,height:16,borderRadius:'50%',border:'2px solid #00C566',borderTopColor:'transparent',animation:'spin 1s linear infinite'}} />
          Loading map...
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      )}
      {/* Uber-style legend */}
      <div style={{position:'absolute',bottom:8,left:8,background:'rgba(10,10,20,.9)',borderRadius:8,padding:'5px 10px',zIndex:999,display:'flex',gap:10}}>
        {Object.entries(STATUS_COLOR).map(([s,c])=>(
          <div key={s} style={{display:'flex',alignItems:'center',gap:4,fontSize:9,color:'#e2e8f0'}}>
            <div style={{width:8,height:8,borderRadius:'50%',background:c,boxShadow:`0 0 4px ${c}`}} />{s}
          </div>
        ))}
      </div>
    </div>
  )
}
