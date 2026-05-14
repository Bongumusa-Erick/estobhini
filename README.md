# eStobhini — KZN Taxi Platform

A full-stack taxi industry management platform built with **Vite + React**, piloting in **KwaZulu-Natal** starting from Dassenhoek and Pinetown.

---

## 🚌 About

eStobhini transforms the taxi industry by connecting:
- **Riders** — book seats, pay via token, see live stop info
- **Drivers** — track trips, view passengers, carry digital QR identity
- **Taxi Owners** — manage fleet, register drivers, track earnings
- **Rank Managers** — monitor stop congestion, GPS track taxis, verify QR codes
- **Association Executives** — oversee KZN operations, approve special trips, view reports
- **Developer** — register associations across all 5 levels, issue QR codes, audit the system

---

## 🏗️ Association Hierarchy

```
SANTACO (National)
  └── KZN Provincial Taxi Council (Provincial)
        └── Durban Regional Taxi Council (Regional)
              └── Pinetown District Taxi Association (District)
                    └── Dassenhoek Local Taxi Association (Local)
```

---

## 📱 Features

- **6 role dashboards** — Developer, Executive, Manager, Owner, Driver, Rider
- **QR code generation** — unique QR per association, per owner, per driver
- **Live GPS tracking** — animated taxi positions on route map
- **Token payment system** — Weekly Unite (R75) and Monthly Unite (R250)
- **Stop congestion** — live crowd levels at Dassenhoek, Pinetown, Durban stops
- **Special trips** — book and approve convoy/event transport
- **Registration forms** — register associations, owners, taxis, drivers
- **Audit log** — full system activity trail
- **KZN routes** — Dassenhoek → Pinetown, Durban CBD, New Germany, Hillcrest

---

## 🚀 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open in browser
# http://localhost:5173
```

---

## 📦 Build for production

```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
eStobhini/
├── index.html                  # HTML entry point
├── vite.config.js              # Vite config
├── package.json
├── .env                        # Environment variables
├── .gitignore
├── .phcode.json                # PHCode editor config
└── src/
    ├── main.jsx                # React entry — mounts <App />
    ├── App.jsx                 # App shell: topbar, role tabs, bottom nav
    ├── styles.css              # Full design system
    ├── data/
    │   └── db.js               # All KZN mock data (associations, owners, drivers, stops, routes)
    ├── components/
    │   ├── Modal.jsx           # Reusable modal overlay
    │   ├── QRDisplay.jsx       # QR code renderer (wraps qrcode.react)
    │   └── GPSMap.jsx          # Animated SVG GPS map
    └── views/
        ├── DevView.jsx         # Developer handle — register associations, QR hub, audit
        ├── ExecView.jsx        # Association executive — overview, routes, special trips
        ├── ManagerView.jsx     # Rank manager — stops, GPS, log, verify
        ├── OwnerView.jsx       # Taxi owner — fleet, taxis, drivers, earnings, QR
        ├── DriverView.jsx      # Driver — today, passengers, stats, QR
        └── RiderView.jsx       # Rider — home, routes, stops, tokens, profile
```

---

## 🛠️ Tech Stack

| Tool | Purpose |
|------|---------|
| Vite 4 | Build tool & dev server |
| React 18 | UI framework |
| qrcode.react | QR code generation |
| Tabler Icons | Icon set (CDN) |
| Google Fonts | DM Sans + Space Grotesk |

---

## 🗺️ KZN Routes (Pilot)

| Route | Fare | Time | Frequency |
|-------|------|------|-----------|
| Dassenhoek → Pinetown | R10 | 22 min | Every 8 min |
| Dassenhoek → Durban CBD | R18 | 45 min | Every 12 min |
| Dassenhoek → New Germany | R13 | 30 min | Every 10 min |
| Pinetown → Durban CBD | R14 | 28 min | Every 6 min |
| Pinetown → Westville | R9 | 15 min | Every 15 min |
| Dassenhoek → Hillcrest | R16 | 35 min | Every 20 min |

---

## 📋 Customising

- **Routes & stops** — edit `src/data/db.js`
- **Colors & fonts** — CSS variables at top of `src/styles.css`
- **Add a real API** — replace mock data in `db.js` with fetch calls; prefix env vars with `VITE_`
- **Add maps** — drop Google Maps or Leaflet into `GPSMap.jsx`

---

## 📄 Licence

Built for the South African taxi industry. KZN pilot starting Dassenhoek, Pinetown — eStobhini © 2025.
