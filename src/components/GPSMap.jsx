import React, { useEffect, useRef, useState } from 'react'

const PATHS = [
  { id: 't1', color: '#00C566', label: 'T1', pts: [{x:60,y:80},{x:120,y:80},{x:180,y:80},{x:240,y:80},{x:300,y:80}] },
  { id: 't2', color: '#00C566', label: 'T2', pts: [{x:120,y:80},{x:200,y:80},{x:280,y:80},{x:360,y:80},{x:440,y:80}] },
  { id: 't3', color: '#F59E0B', label: 'T3', pts: [{x:300,y:80},{x:380,y:80},{x:440,y:80},{x:500,y:80},{x:570,y:80}] },
  { id: 't4', color: '#EF4444', label: 'T4', pts: [{x:440,y:80},{x:380,y:80},{x:300,y:80},{x:220,y:80},{x:140,y:80}] },
  { id: 't5', color: '#3B82F6', label: 'T5', pts: [{x:270,y:40},{x:270,y:55},{x:270,y:70},{x:270,y:80}] },
  { id: 't6', color: '#00C566', label: 'T6', pts: [{x:420,y:130},{x:420,y:115},{x:420,y:100},{x:420,y:80}] },
]

export default function GPSMap() {
  const [positions, setPositions] = useState(() =>
    PATHS.map((p, i) => ({ ...p, step: i % p.pts.length, dir: 1 }))
  )

  useEffect(() => {
    const id = setInterval(() => {
      setPositions(prev => prev.map(m => {
        const next = { ...m }
        const pt = m.pts[m.step]
        next.cx = pt.x
        next.cy = pt.y
        next.step += m.dir
        if (next.step >= m.pts.length - 1) next.dir = -1
        if (next.step <= 0) next.dir = 1
        return next
      }))
    }, 220)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="gps-wrap">
      <svg viewBox="0 0 640 160" preserveAspectRatio="xMidYMid meet">
        <rect width="640" height="160" fill="#F0F2F5" />
        {/* Main road: Dassenhoek → Pinetown → Durban */}
        <line x1="0" y1="80" x2="640" y2="80" stroke="#D1D5DB" strokeWidth="16" strokeLinecap="round"/>
        {/* Branch: Pinetown → Westville */}
        <line x1="270" y1="80" x2="270" y2="15" stroke="#D1D5DB" strokeWidth="9"/>
        {/* Branch: New Germany */}
        <line x1="420" y1="80" x2="420" y2="145" stroke="#D1D5DB" strokeWidth="9"/>
        {/* Road centre lines */}
        <line x1="0" y1="80" x2="640" y2="80" stroke="#E5E7EB" strokeWidth="1" strokeDasharray="12 8"/>

        {/* Stop nodes */}
        <circle cx="60"  cy="80" r="8" fill="#00C566" opacity=".35"/>
        <circle cx="270" cy="80" r="8" fill="#F59E0B" opacity=".35"/>
        <circle cx="570" cy="80" r="8" fill="#EF4444" opacity=".35"/>

        {/* Labels */}
        <text x="55"  y="68" textAnchor="middle" fontSize="8" fill="#6B7280">Dassenhoek</text>
        <text x="268" y="68" textAnchor="middle" fontSize="8" fill="#6B7280">Pinetown</text>
        <text x="565" y="68" textAnchor="middle" fontSize="8" fill="#6B7280">Durban CBD</text>
        <text x="245" y="14" textAnchor="middle" fontSize="8" fill="#6B7280">Westville</text>
        <text x="398" y="152" textAnchor="middle" fontSize="8" fill="#6B7280">New Germany</text>

        {/* Taxi dots */}
        {positions.map(m => (
          <g key={m.id} transform={`translate(${m.cx ?? m.pts[0].x},${m.cy ?? m.pts[0].y})`}>
            <circle r="10" fill={m.color} opacity=".95"/>
            <text y="4" textAnchor="middle" fontSize="7.5" fill="white" fontWeight="600">{m.label}</text>
          </g>
        ))}

        {/* Legend */}
        <circle cx="16" cy="150" r="5" fill="#00C566"/>
        <text x="25" y="154" fontSize="8" fill="#6B7280">En route</text>
        <circle cx="75" cy="150" r="5" fill="#F59E0B"/>
        <text x="84" y="154" fontSize="8" fill="#6B7280">Loading</text>
        <circle cx="130" cy="150" r="5" fill="#EF4444"/>
        <text x="139" y="154" fontSize="8" fill="#6B7280">Stopped</text>
        <circle cx="185" cy="150" r="5" fill="#3B82F6"/>
        <text x="194" y="154" fontSize="8" fill="#6B7280">Special trip</text>
      </svg>
    </div>
  )
}
