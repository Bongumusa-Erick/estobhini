import React from 'react'
import { QRCodeSVG } from 'qrcode.react'

export default function QRDisplay({ data, title, subtitle, size = 150, children }) {
  const qrString = typeof data === 'string' ? data : JSON.stringify(data)

  return (
    <div className="qr-wrap">
      <div className="qr-frame">
        <QRCodeSVG
          value={qrString}
          size={size}
          bgColor="#ffffff"
          fgColor="#000000"
          level="M"
        />
      </div>
      {title && <div className="qr-title">{title}</div>}
      {subtitle && <div className="qr-sub">{subtitle}</div>}
      {children}
    </div>
  )
}
