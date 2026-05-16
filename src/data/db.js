// ─── eStobhini KZN Data Store v3 ─────────────────────────────────

export const TAXI_MODELS = [
  'Toyota Quantum 2.5 D-4D (15 seat)',
  'Toyota Quantum 2.8 D-4D (15 seat)',
  'Toyota HiAce (14 seat)',
  'Iveco Daily 50C (22 seat)',
  'Iveco Daily 35S (17 seat)',
  'Mercedes-Benz Sprinter (22 seat)',
  'Volkswagen Crafter (22 seat)',
  'Nissan NV350 Caravan (15 seat)',
  'Ford Transit (17 seat)',
]

// ─── Finance constants ────────────────────────────────────────────
export const FINANCE = {
  driverCommission: 5,       // 5% deducted per driver per shift → association
  assocCommission: 5,        // 5% deducted from association revenue → developer
  devPlatformSplit: 70,      // 70% of developer cut → developer account
  devBonusReserve: 30,       // 30% of developer cut → user bonus pool
  pointsPerTrip: 14,         // points earned per trip
  pointsForFreeLocal: 350,   // points needed for free local trip
  pointsForFreeLongDist: 350,// points needed for free long-distance trip
  tripsForFreeLocal: 25,     // rides needed for free local trip
  tripsForFreeLongDist: 15,  // rides needed for free long-distance trip
  monthlyFreeTrips: 1,       // monthly token holders get 1 free trip/month
}

// ─── Associations ─────────────────────────────────────────────────
export const ASSOCIATIONS = [
  {
    id:'A001', name:'SANTACO', fullName:'South African National Taxi Council',
    level:'National', type:'local', province:'National', region:'All Regions',
    district:'All Districts', local:'All Areas',
    routes:['All National Routes'],
    routeAmounts:{ single:0, weekly:150, monthly:500 },
    owners:1840, status:'active', qrId:'SANTACO-NAT-001',
    chair:'National Chairperson', logo:null,
    bankAccount:{ bank:'FNB', accountName:'SANTACO', accountNo:'627 011 0001', branch:'250 655' },
  },
  {
    id:'A002', name:'KZN Provincial Taxi Council', fullName:'KwaZulu-Natal Provincial Taxi Council',
    level:'Provincial', type:'local', province:'KwaZulu-Natal', region:'All KZN Regions',
    district:'All KZN Districts', local:'All KZN Areas',
    routes:['All KZN Routes'],
    routeAmounts:{ single:0, weekly:100, monthly:350 },
    owners:420, status:'active', qrId:'KZNPTC-PROV-002',
    chair:'KZN Provincial Chairperson', logo:null,
    bankAccount:{ bank:'Standard Bank', accountName:'KZN Prov Taxi Council', accountNo:'051 234 5678', branch:'051 001' },
  },
  {
    id:'A003', name:'Durban Regional Taxi Council', fullName:'Durban Regional Taxi Council',
    level:'Regional', type:'local', province:'KwaZulu-Natal', region:'Durban',
    district:'eThekwini Metro', local:'Durban & Surrounds',
    routes:['Durban CBD → Pinetown','Durban CBD → Umlazi','Durban CBD → KwaMashu','Durban → Hillcrest'],
    routeAmounts:{ single:14, weekly:90, monthly:300 },
    owners:185, status:'active', qrId:'DRTC-REG-003',
    chair:'Regional Chairperson', logo:null,
    bankAccount:{ bank:'Absa', accountName:'Durban Regional Taxi Council', accountNo:'405 678 9012', branch:'632 005' },
  },
  {
    id:'A004', name:'Pinetown District Taxi Assoc.', fullName:'Pinetown District Taxi Association',
    level:'District', type:'local', province:'KwaZulu-Natal', region:'Durban',
    district:'Pinetown', local:'Pinetown & Surrounds',
    routes:['Pinetown → Durban CBD','Pinetown → New Germany','Pinetown → Westville','Pinetown → Dassenhoek'],
    routeAmounts:{ single:12, weekly:80, monthly:260 },
    owners:48, status:'active', qrId:'PDTA-DIST-004',
    chair:'District Chairperson', logo:null,
    bankAccount:{ bank:'Capitec', accountName:'Pinetown District Taxi Assoc', accountNo:'131 000 1234', branch:'470 010' },
  },
  {
    id:'A005', name:'Dassenhoek Local Taxi Assoc.', fullName:'Dassenhoek Local Taxi Association',
    level:'Local', type:'local', province:'KwaZulu-Natal', region:'Durban',
    district:'Pinetown', local:'Dassenhoek',
    routes:['Dassenhoek → Pinetown','Dassenhoek → Durban CBD','Dassenhoek → New Germany','Dassenhoek → Hillcrest'],
    routeAmounts:{ single:10, weekly:75, monthly:250 },
    owners:14, status:'active', qrId:'DLTA-LOC-005',
    chair:'Local Chairperson', logo:null,
    bankAccount:{ bank:'Nedbank', accountName:'Dassenhoek Local Taxi Assoc', accountNo:'198 765 4321', branch:'198 765' },
  },
  // ─── Long distance associations ───────────────────────────────
  {
    id:'LD001', name:'Durban–Joburg Long Distance', fullName:'Durban–Johannesburg Long Distance Taxi Association',
    level:'National', type:'longdistance', province:'KwaZulu-Natal / Gauteng',
    region:'Inter-provincial', district:'N3 Corridor', local:'Durban & Joburg Hubs',
    routes:['Durban → Johannesburg','Durban → Pretoria','Durban → Midrand'],
    routeAmounts:{ single:350, weekly:0, monthly:0 },
    owners:32, status:'active', qrId:'LDTA-DJB-001',
    chair:'LD Chairperson', logo:null,
    bankAccount:{ bank:'FNB', accountName:'Durban Joburg Long Distance', accountNo:'627 099 8765', branch:'250 655' },
    jointTrips:[
      { name:'Dassenhoek → Pinetown → Durban → Joburg', segments:['Dassenhoek → Pinetown','Pinetown → Durban CBD','Durban → Johannesburg'], totalFare:'R370' },
      { name:'Dassenhoek → Durban → Pretoria', segments:['Dassenhoek → Durban CBD','Durban → Pretoria'], totalFare:'R380' },
    ],
  },
  {
    id:'LD002', name:'Mpangeni Long Distance Assoc.', fullName:'Mpangeni–Durban–Johannesburg Long Distance Association',
    level:'Regional', type:'longdistance', province:'KwaZulu-Natal',
    region:'North Coast / Zululand', district:'uThungulu', local:'Mpangeni / Richards Bay',
    routes:['Mpangeni → Durban','Mpangeni → Johannesburg','Richards Bay → Durban','Empangeni → Pietermaritzburg'],
    routeAmounts:{ single:180, weekly:0, monthly:0 },
    owners:18, status:'active', qrId:'LDTA-MPG-002',
    chair:'Mpangeni LD Chairperson', logo:null,
    bankAccount:{ bank:'Standard Bank', accountName:'Mpangeni Long Distance Assoc', accountNo:'051 888 7777', branch:'051 001' },
    jointTrips:[
      { name:'Mpangeni → Durban → Johannesburg', segments:['Mpangeni → Durban','Durban → Johannesburg'], totalFare:'R530' },
      { name:'Richards Bay → Durban → Pretoria', segments:['Richards Bay → Durban','Durban → Pretoria'], totalFare:'R540' },
    ],
  },
  {
    id:'LD003', name:'Cape Town Long Distance Assoc.', fullName:'KZN–Cape Town Long Distance Taxi Association',
    level:'National', type:'longdistance', province:'KwaZulu-Natal / Western Cape',
    region:'Inter-provincial', district:'N2 / N3 Corridor', local:'Durban & Cape Town Hubs',
    routes:['Durban → Cape Town','Pietermaritzburg → Cape Town','Durban → George'],
    routeAmounts:{ single:620, weekly:0, monthly:0 },
    owners:12, status:'active', qrId:'LDTA-CPT-003',
    chair:'Cape Town LD Chairperson', logo:null,
    bankAccount:{ bank:'Absa', accountName:'KZN Cape Town Long Distance', accountNo:'405 111 2222', branch:'632 005' },
    jointTrips:[
      { name:'Dassenhoek → Durban → Cape Town', segments:['Dassenhoek → Durban CBD','Durban → Cape Town'], totalFare:'R630' },
    ],
  },
]

// ─── Owners ───────────────────────────────────────────────────────
export const OWNERS = [
  {
    id:'O001', name:'Sibusiso Mthembu', assocId:'A005',
    idNumber:'7801015****086', phone:'+27 83 111 2233',
    taxis:['ND 142-RT','ND 289-KL'],
    taxiModels:{ 'ND 142-RT':'Toyota Quantum 2.5 D-4D (15 seat)', 'ND 289-KL':'Toyota HiAce (14 seat)' },
    routes:['Dassenhoek → Pinetown','Dassenhoek → Durban CBD'],
    drivers:['Thulani Gumede','Bongani Zulu'],
    status:'active', qrId:'OWNER-O001-DLTA',
    bankAccount:{ bank:'Capitec', accountName:'S Mthembu', accountNo:'131 456 7890', branch:'470 010' },
    dailyCashout:{ 'ND 142-RT':{ trips:13, gross:'R1,430', commission:'R71.50', net:'R1,358.50', status:'pending' }, 'ND 289-KL':{ trips:10, gross:'R1,200', commission:'R60', net:'R1,140', status:'pending' } },
  },
  {
    id:'O002', name:'Nomvula Dlamini', assocId:'A005',
    idNumber:'8503225****083', phone:'+27 72 222 3344',
    taxis:['ND 074-NM'],
    taxiModels:{ 'ND 074-NM':'Iveco Daily 50C (22 seat)' },
    routes:['Dassenhoek → New Germany'],
    drivers:['Lungelo Mthethwa'],
    status:'active', qrId:'OWNER-O002-DLTA',
    bankAccount:{ bank:'FNB', accountName:'N Dlamini', accountNo:'627 222 3333', branch:'250 655' },
    dailyCashout:{ 'ND 074-NM':{ trips:6, gross:'R780', commission:'R39', net:'R741', status:'cashed_out' } },
  },
  {
    id:'O003', name:'Sandile Khoza', assocId:'A004',
    idNumber:'7910105****082', phone:'+27 61 333 4455',
    taxis:['ND 331-SJ','ND 019-VP'],
    taxiModels:{ 'ND 331-SJ':'Toyota Quantum 2.8 D-4D (15 seat)', 'ND 019-VP':'Mercedes-Benz Sprinter (22 seat)' },
    routes:['Pinetown → Durban CBD','Pinetown → Westville'],
    drivers:['Siphamandla Nkosi','Vusi Ndlovu'],
    status:'active', qrId:'OWNER-O003-PDTA',
    bankAccount:{ bank:'Standard Bank', accountName:'S Khoza', accountNo:'051 333 4444', branch:'051 001' },
    dailyCashout:{ 'ND 331-SJ':{ trips:11, gross:'R1,540', commission:'R77', net:'R1,463', status:'pending' }, 'ND 019-VP':{ trips:0, gross:'R0', commission:'R0', net:'R0', status:'offline' } },
  },
]

// ─── Drivers ──────────────────────────────────────────────────────
export const DRIVERS = [
  { id:'D001', name:'Thulani Gumede',    ownerId:'O001', taxi:'ND 142-RT', model:'Toyota Quantum 2.5 D-4D (15 seat)', license:'PDP-KZN-2024-001', tripsToday:13, status:'active',  route:'Dassenhoek → Pinetown',    earnings:'R310', shiftEnded:false },
  { id:'D002', name:'Bongani Zulu',      ownerId:'O001', taxi:'ND 289-KL', model:'Toyota HiAce (14 seat)',            license:'PDP-KZN-2024-002', tripsToday:10, status:'active',  route:'Dassenhoek → Durban CBD',  earnings:'R270', shiftEnded:false },
  { id:'D003', name:'Lungelo Mthethwa',  ownerId:'O002', taxi:'ND 074-NM', model:'Iveco Daily 50C (22 seat)',         license:'PDP-KZN-2024-003', tripsToday:6,  status:'idle',    route:'Dassenhoek → New Germany', earnings:'R150', shiftEnded:true  },
  { id:'D004', name:'Siphamandla Nkosi', ownerId:'O003', taxi:'ND 331-SJ', model:'Toyota Quantum 2.8 D-4D (15 seat)',license:'PDP-KZN-2024-004', tripsToday:11, status:'active',  route:'Pinetown → Durban CBD',    earnings:'R290', shiftEnded:false },
  { id:'D005', name:'Vusi Ndlovu',       ownerId:'O003', taxi:'ND 019-VP', model:'Mercedes-Benz Sprinter (22 seat)', license:'PDP-KZN-2024-005', tripsToday:0,  status:'offline', route:'Pinetown → Westville',     earnings:'R0',   shiftEnded:true  },
]

// ─── Stops ────────────────────────────────────────────────────────
export const STOPS = [
  { name:'Dassenhoek Taxi Rank', crowd:68, taxis:['ND-142','ND-289'],          enRoute:['ND-142'],          passengers:22, area:'Dassenhoek', lat:-29.870, lng:30.868 },
  { name:'Pinetown Taxi Rank',   crowd:82, taxis:['ND-331','ND-019','ND-512'], enRoute:['ND-331','ND-512'], passengers:41, area:'Pinetown',   lat:-29.853, lng:30.896 },
  { name:'Durban CBD — Warwick', crowd:91, taxis:['ND-074','ND-289'],          enRoute:['ND-289'],          passengers:67, area:'Durban',     lat:-29.825, lng:30.935 },
  { name:'New Germany Stop',     crowd:44, taxis:['ND-074','ND-512'],          enRoute:['ND-074'],          passengers:18, area:'New Germany', lat:-29.843, lng:30.908 },
  { name:'Westville Stop',       crowd:35, taxis:['ND-019'],                   enRoute:[],                  passengers:11, area:'Westville',  lat:-29.836, lng:30.921 },
]

// ─── Local routes ─────────────────────────────────────────────────
export const ROUTES = [
  { name:'Dassenhoek → Pinetown',    time:'22 min', fare:'R10', freq:'Every 8 min',  seats:5, assocId:'A005', weeklyAmount:75,  monthlyAmount:250 },
  { name:'Dassenhoek → Durban CBD',  time:'45 min', fare:'R18', freq:'Every 12 min', seats:3, assocId:'A005', weeklyAmount:75,  monthlyAmount:250 },
  { name:'Dassenhoek → New Germany', time:'30 min', fare:'R13', freq:'Every 10 min', seats:7, assocId:'A005', weeklyAmount:75,  monthlyAmount:250 },
  { name:'Pinetown → Durban CBD',    time:'28 min', fare:'R14', freq:'Every 6 min',  seats:2, assocId:'A004', weeklyAmount:80,  monthlyAmount:260 },
  { name:'Pinetown → Westville',     time:'15 min', fare:'R9',  freq:'Every 15 min', seats:9, assocId:'A004', weeklyAmount:80,  monthlyAmount:260 },
  { name:'Dassenhoek → Hillcrest',   time:'35 min', fare:'R16', freq:'Every 20 min', seats:4, assocId:'A005', weeklyAmount:75,  monthlyAmount:250 },
  { name:'Pinetown → Clermont',      time:'20 min', fare:'R11', freq:'Every 10 min', seats:8, assocId:'A004', weeklyAmount:80,  monthlyAmount:260 },
  { name:'Durban → Hillcrest',       time:'40 min', fare:'R20', freq:'Every 15 min', seats:5, assocId:'A003', weeklyAmount:90,  monthlyAmount:300 },
]

// ─── Long distance routes ─────────────────────────────────────────
export const LONG_DISTANCE_ROUTES = [
  { name:'Durban → Johannesburg',         assocId:'LD001', fare:'R350', time:'~6 hrs', seats:4,  departs:'06:00, 08:00, 12:00, 16:00' },
  { name:'Durban → Pretoria',             assocId:'LD001', fare:'R370', time:'~6.5 hrs', seats:3, departs:'06:00, 10:00, 14:00' },
  { name:'Mpangeni → Durban',             assocId:'LD002', fare:'R180', time:'~2 hrs', seats:6,  departs:'05:30, 07:00, 09:00, 13:00, 17:00' },
  { name:'Mpangeni → Johannesburg',       assocId:'LD002', fare:'R520', time:'~8 hrs', seats:3,  departs:'05:00, 07:00' },
  { name:'Richards Bay → Durban',         assocId:'LD002', fare:'R190', time:'~2 hrs', seats:5,  departs:'06:00, 08:00, 12:00, 16:00' },
  { name:'Durban → Cape Town',            assocId:'LD003', fare:'R620', time:'~18 hrs', seats:2, departs:'06:00 (overnight)' },
  { name:'Pietermaritzburg → Cape Town',  assocId:'LD003', fare:'R600', time:'~17 hrs', seats:4, departs:'07:00 (overnight)' },
]

// ─── Joint trip combinations ──────────────────────────────────────
export const JOINT_TRIPS = [
  { name:'Dassenhoek → Pinetown → Durban → Joburg', segments:['Dassenhoek → Pinetown','Pinetown → Durban CBD','Durban → Johannesburg'], fares:['R10','R14','R350'], total:'R374', assocs:['A005','A004','LD001'] },
  { name:'Dassenhoek → Durban → Joburg',             segments:['Dassenhoek → Durban CBD','Durban → Johannesburg'],                       fares:['R18','R350'],       total:'R368', assocs:['A005','LD001'] },
  { name:'Mpangeni → Durban → Joburg',               segments:['Mpangeni → Durban','Durban → Johannesburg'],                             fares:['R180','R350'],      total:'R530', assocs:['LD002','LD001'] },
  { name:'Dassenhoek → Pinetown → Clermont',         segments:['Dassenhoek → Pinetown','Pinetown → Clermont'],                           fares:['R10','R11'],        total:'R21',  assocs:['A005','A004'] },
  { name:'Richards Bay → Durban → Cape Town',        segments:['Richards Bay → Durban','Durban → Cape Town'],                            fares:['R190','R620'],      total:'R810', assocs:['LD002','LD003'] },
]

// ─── Special trips ────────────────────────────────────────────────
export const SPECIAL_TRIPS = [
  { name:'Dassenhoek Community Funeral', date:'Sat 17 May', taxis:8,  assoc:'DLTA', icon:'ti-heart',   color:'red' },
  { name:'Moses Mabhida Stadium Shuttle',date:'Sun 18 May', taxis:20, assoc:'DRTC', icon:'ti-stadium', color:'blue' },
  { name:'Pinetown School Outing',       date:'Fri 16 May', taxis:5,  assoc:'PDTA', icon:'ti-school',  color:'amber' },
  { name:'Durban July Transport',        date:'Sat 5 Jul',  taxis:45, assoc:'DRTC', icon:'ti-star',    color:'purple' },
]

// ─── Developer finance summary ────────────────────────────────────
export const DEV_FINANCE = {
  totalRevenue:    'R2,840,000',
  assocCuts:       'R142,000',   // 5% from all associations
  driverCuts:      'R98,500',    // 5% from all drivers via owners
  devReceives:     'R240,500',   // total inflow to developer
  devAccount:      'R168,350',   // 70% to developer
  bonusPool:       'R72,150',    // 30% reserved for bonuses
  freeTripsIssued: 1840,
  activeUsers:     14200,
  bankAccount:     { bank:'FNB', accountName:'eStobhini (Pty) Ltd', accountNo:'627 777 8888', branch:'250 655' },
}

// ─── Level metadata ───────────────────────────────────────────────
export const LEVEL_META = {
  National:   { bg:'#FEE2E2', fg:'#991B1B', pill:'red',    label:'National'   },
  Provincial: { bg:'#F5F3FF', fg:'#6D28D9', pill:'purple', label:'Provincial' },
  Regional:   { bg:'#EFF6FF', fg:'#1D4ED8', pill:'blue',   label:'Regional'   },
  District:   { bg:'#FFF7ED', fg:'#9A3412', pill:'orange', label:'District'   },
  Local:      { bg:'#E6FBF2', fg:'#009950', pill:'green',  label:'Local'      },
}

// ─── Mock rider ───────────────────────────────────────────────────
export const MOCK_RIDER = {
  id:'RDR-KZN-0042', name:'Nokukhanya Dlamini', initials:'ND',
  phone:'+27 72 555 0042', area:'Dassenhoek', memberSince:'May 2025',
  subscription:'weekly', trips:142, saved:'R1,890',
  points:1988,   // 142 trips × 14 points each
  proPoints:135, // long distance points
}

// ─── Audit logs ───────────────────────────────────────────────────
export const AUDIT_LOGS = [
  { time:'08:02', action:'Platform initialised',        subject:'KZN Pilot — Dassenhoek',           by:'Dev' },
  { time:'08:15', action:'Association registered',      subject:'SANTACO (National)',                by:'Dev' },
  { time:'08:22', action:'Association registered',      subject:'KZN Provincial Taxi Council',      by:'Dev' },
  { time:'08:30', action:'Association registered',      subject:'Durban Regional Taxi Council',     by:'Dev' },
  { time:'08:38', action:'Association registered',      subject:'Pinetown District Taxi Assoc.',    by:'Dev' },
  { time:'08:45', action:'Association registered',      subject:'Dassenhoek Local Taxi Assoc.',     by:'Dev' },
  { time:'08:50', action:'Long distance assoc added',   subject:'Durban–Joburg LD Assoc.',          by:'Dev' },
  { time:'08:55', action:'Long distance assoc added',   subject:'Mpangeni LD Assoc.',               by:'Dev' },
  { time:'09:00', action:'Owner registered',            subject:'Sibusiso Mthembu → DLTA',          by:'DLTA Admin' },
  { time:'09:10', action:'QR codes issued',             subject:'All associations & owners',        by:'System' },
  { time:'09:20', action:'Driver end shift',            subject:'Lungelo Mthethwa — ND 074-NM',     by:'System' },
  { time:'09:25', action:'Cashout processed',           subject:'ND 074-NM → N.Dlamini: R741',      by:'System' },
  { time:'09:40', action:'Commission deducted (5%)',    subject:'DLTA → Dev: R39',                  by:'System' },
  { time:'09:45', action:'Dev split: 70/30',            subject:'R27.30 dev, R11.70 bonus pool',    by:'System' },
  { time:'10:00', action:'Token purchased',             subject:'Rider RDR-KZN-0042 — Weekly R75', by:'Rider' },
  { time:'10:05', action:'Points awarded',              subject:'+14 points → RDR-KZN-0042',        by:'System' },
]
