import * as THREE from 'three';
import './style.css';

const projects = [
  {
    id: 'pakeezah', index: '01', title: 'Pakeezah Atelier', category: 'INTERIOR / PORTFOLIO', room: 'ROOM I — INTERIORS', image: '/art/pakeezah.webp',
    blurb: 'A quiet portfolio that moves from design intent to the reality of the site.',
    detail: 'Editorial pacing, site-to-finish storytelling and a WhatsApp-first enquiry path.',
    href: 'https://pakeezahatelier.vercel.app/', linkLabel: 'SEE THE EDITORIAL PROJECT FLOW ↗'
  },
  {
    id: 'trove', index: '02', title: 'The Design Trove', category: 'INTERIOR / CONCEPT', room: 'ROOM I — INTERIORS', image: '/art/trove.webp',
    blurb: 'A concept built around the distance between a brief and a finished home.',
    detail: 'Horizontal moments, restrained transitions and a project-led narrative.',
    href: 'https://thedesigntrove.vercel.app/', linkLabel: 'SEE THE BRIEF-TO-HOME STORY ↗'
  },
  {
    id: 'regnant', index: '03', title: 'Regnant', category: 'INTERIOR / BEFORE → AFTER', room: 'ROOM II — TRANSFORMATIONS', image: '/art/regnant.webp',
    blurb: 'A visual before-and-after portfolio for showing execution, not just outcomes.',
    detail: 'Construction-to-finished comparisons, project captions and a concise brief flow.',
    href: 'https://regnant-beta.vercel.app/', linkLabel: 'SEE THE BEFORE / AFTER SYSTEM ↗'
  },
  {
    id: 'still', index: '04', title: 'Still Skincare', category: 'BEAUTY / CONCEPT', room: 'ROOM II — TRANSFORMATIONS', image: '/art/still.webp',
    blurb: 'A skincare story built around one idea: lock the age you are in.',
    detail: 'A scroll-led brand journey from concern → science → treatment → consultation.',
    href: 'https://stillskincare.vercel.app/', linkLabel: 'SEE THE SCROLL-LED BRAND STORY ↗'
  },
  {
    id: 'everafter', index: '05', title: 'Ever After', category: 'WEDDING / EDITORIAL', room: 'ROOM III — OCCASIONS', image: '/art/everafter.webp',
    blurb: 'An editorial wedding experience designed to feel closer to a magazine than a template.',
    detail: 'Deep tones, full-frame imagery and a clear route from atmosphere to enquiry.',
    href: 'https://everafterweddings-five.vercel.app/', linkLabel: 'SEE THE EDITORIAL WEDDING EXPERIENCE ↗'
  },
  {
    id: 'archive35', index: '06', title: '35mm Archive', category: 'EXPERIMENTAL / CAMERA', room: 'ROOM III — OCCASIONS', image: '/art/archive35.webp',
    blurb: 'A tactile film-camera experiment built as a digital object rather than a normal page.',
    detail: 'Tape, contact sheets, film-strip movement and a physical-feeling visual system.',
    href: '', linkLabel: 'EXPERIMENTAL STUDY · PRIVATE BUILD'
  }
];

const ui = {
  canvas: document.querySelector('#gallery'),
  entry: document.querySelector('#entry'),
  enterButton: document.querySelector('#enterButton'),
  enterLabel: document.querySelector('#enterLabel'),
  hud: document.querySelector('#hud'),
  crosshair: document.querySelector('#crosshair'),
  firstHint: document.querySelector('#firstHint'),
  loadingNote: document.querySelector('#loadingNote'),
  roomNumber: document.querySelector('#roomNumber'),
  roomName: document.querySelector('#roomName'),
  roomProgress: document.querySelector('#roomProgress'),
  mobileControls: document.querySelector('#mobileControls'),
  joystick: document.querySelector('#joystick'),
  knob: document.querySelector('#knob'),
  lookZone: document.querySelector('#lookZone'),
  indexButton: document.querySelector('#indexButton'),
  brandButton: document.querySelector('#brandButton'),
  projectOverlay: document.querySelector('#projectOverlay'),
  archiveOverlay: document.querySelector('#archiveOverlay'),
  contactOverlay: document.querySelector('#contactOverlay'),
  archiveList: document.querySelector('#archiveList'),
  projectImage: document.querySelector('#projectImage'),
  projectRoom: document.querySelector('#projectRoom'),
  projectNumber: document.querySelector('#projectNumber'),
  projectTitle: document.querySelector('#projectTitle'),
  projectLede: document.querySelector('#projectLede'),
  projectDetail: document.querySelector('#projectDetail'),
  projectLink: document.querySelector('#projectLink')
};

// --- renderer / scene ------------------------------------------------------
function canUseWebGL() {
  try {
    const probe = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (probe.getContext('webgl2') || probe.getContext('webgl')));
  } catch { return false; }
}
if (!canUseWebGL()) {
  ui.loadingNote.textContent = '3D is not available on this device. Opening the fast project list.';
  location.hash = 'projects';
  throw new Error('WebGL unavailable — using HTML portfolio fallback.');
}

const renderer = new THREE.WebGLRenderer({ canvas: ui.canvas, antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = false;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.08;
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
scene.background = new THREE.Color('#11130f');
scene.fog = new THREE.Fog('#100c08', 17, 48);

const camera = new THREE.PerspectiveCamera(64, window.innerWidth / window.innerHeight, 0.1, 72);
camera.position.set(0, 1.65, 11.2);
camera.rotation.order = 'YXZ';

scene.add(new THREE.HemisphereLight('#cbbdaa', '#070807', 0.58));
const sun = new THREE.DirectionalLight('#f4dfc0', 0.62);
sun.position.set(4, 10, 8);
scene.add(sun);

function addPointLight(x, z, color, intensity = 12, distance = 7) {
  const l = new THREE.PointLight(color, intensity, distance, 2);
  l.position.set(x, 3.7, z);
  scene.add(l);
}
// Room I — warm gallery
addPointLight(-5.8, 8.2, '#e3a866', 18, 7.2);
addPointLight(5.8, 7.0, '#ffd0a0', 17, 7.2);
// Room II — cooler transformation room
addPointLight(-5.8, -0.4, '#e7ded1', 15, 7.4);
addPointLight(5.8, -1.0, '#d7c6be', 14, 7.4);
// Room III — darker olive / occasion room
addPointLight(-5.8, -9.0, '#ba9d76', 14, 7.0);
addPointLight(5.8, -9.8, '#a9b39c', 11, 7.0);

const MAT = {
  room1Wall: new THREE.MeshStandardMaterial({ color: '#282620', roughness: 0.96 }),
  room1Floor: new THREE.MeshStandardMaterial({ color: '#171815', roughness: 0.9 }),
  room1Ceiling: new THREE.MeshStandardMaterial({ color: '#1d1e1a', roughness: 1, side: THREE.DoubleSide }),
  room2Wall: new THREE.MeshStandardMaterial({ color: '#aaa69d', roughness: 0.94 }),
  room2Floor: new THREE.MeshStandardMaterial({ color: '#5f5b55', roughness: 0.88 }),
  room2Ceiling: new THREE.MeshStandardMaterial({ color: '#8c8982', roughness: 1, side: THREE.DoubleSide }),
  room3Wall: new THREE.MeshStandardMaterial({ color: '#1a211a', roughness: 0.96 }),
  room3Floor: new THREE.MeshStandardMaterial({ color: '#0e120e', roughness: 0.9 }),
  room3Ceiling: new THREE.MeshStandardMaterial({ color: '#111611', roughness: 1, side: THREE.DoubleSide }),
  frame: new THREE.MeshStandardMaterial({ color: '#090a08', roughness: 0.58 }),
  plinth1: new THREE.MeshStandardMaterial({ color: '#5b5144', roughness: 0.86 }),
  plinth2: new THREE.MeshStandardMaterial({ color: '#c2bdb4', roughness: 0.86 }),
  plinth3: new THREE.MeshStandardMaterial({ color: '#343d32', roughness: 0.86 }),
  dark: new THREE.MeshStandardMaterial({ color: '#090a08', roughness: 0.9 }),
  sandstone: new THREE.MeshStandardMaterial({ color: '#8f7255', roughness: 0.94, metalness: 0.0 }),
  sandstoneDark: new THREE.MeshStandardMaterial({ color: '#5d4937', roughness: 0.98 }),
  sandstoneLight: new THREE.MeshStandardMaterial({ color: '#b39876', roughness: 0.92 }),
  brass: new THREE.MeshStandardMaterial({ color: '#8c6b35', roughness: 0.58, metalness: 0.28 })
};

function box(x, y, z, sx, sy, sz, material = MAT.room1Wall, cast = false) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz), material);
  m.position.set(x, y, z);
  m.castShadow = false;
  m.receiveShadow = false;
  scene.add(m);
  return m;
}

// Three materially distinct rooms. Lighting is intentionally baked-looking: no runtime shadows.
const rooms = [
  { z: 8.88, len: 9.28, wall: MAT.room1Wall, floor: MAT.room1Floor, ceiling: MAT.room1Ceiling },
  { z: -0.45, len: 8.66, wall: MAT.room2Wall, floor: MAT.room2Floor, ceiling: MAT.room2Ceiling },
  { z: -9.82, len: 9.34, wall: MAT.room3Wall, floor: MAT.room3Floor, ceiling: MAT.room3Ceiling }
];
for (const r of rooms) {
  box(0, -0.08, r.z, 17, 0.16, r.len, r.floor, false);
  box(0, 4.61, r.z, 17, 0.12, r.len, r.ceiling, false);
  box(-8.25, 2.25, r.z, 0.5, 4.5, r.len, r.wall);
  box(8.25, 2.25, r.z, 0.5, 4.5, r.len, r.wall);
}
box(0, 2.25, 13.72, 17, 4.5, 0.5, MAT.room1Wall);
box(-5.4, 2.25, -14.72, 5.8, 4.5, 0.5, MAT.room3Wall);
box(5.4, 2.25, -14.72, 5.8, 4.5, 0.5, MAT.room3Wall);

// partitions with generous central openings
for (const [z,mat] of [[4.05,MAT.room1Wall],[-4.95,MAT.room3Wall]]) {
  box(-5.55, 2.25, z, 5.4, 4.5, 0.35, mat);
  box(5.55, 2.25, z, 5.4, 4.5, 0.35, mat);
}

// --- temple-castle architecture -------------------------------------------
// A stylised Indian stone mandapa rather than a generic white-box gallery.
// The geometry stays procedural/lightweight so the exhibition still runs on phones.
function cylinder(radiusTop, radiusBottom, height, segments, material) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(radiusTop, radiusBottom, height, segments), material);
  scene.add(m); return m;
}
function torus(x,y,z,r,tube,rotX,rotY,material,arc=Math.PI) {
  const m=new THREE.Mesh(new THREE.TorusGeometry(r,tube,8,32,arc),material);
  m.position.set(x,y,z); m.rotation.set(rotX,rotY,0); scene.add(m); return m;
}
function templePillar(x,z,scale=1) {
  const g=new THREE.Group(); g.position.set(x,0,z); scene.add(g);
  const add=(geo,mat,y)=>{const m=new THREE.Mesh(geo,mat);m.position.y=y;g.add(m);return m;};
  add(new THREE.CylinderGeometry(.48*scale,.58*scale,.20*scale,8),MAT.sandstoneDark,.10*scale);
  add(new THREE.CylinderGeometry(.40*scale,.48*scale,.18*scale,8),MAT.sandstoneLight,.29*scale);
  add(new THREE.CylinderGeometry(.29*scale,.34*scale,2.72*scale,12),MAT.sandstone,1.74*scale);
  // carved-looking shaft bands
  for(const y of [.55,1.02,2.38,2.76]) add(new THREE.CylinderGeometry(.38*scale,.38*scale,.09*scale,12),MAT.sandstoneLight,y*scale);
  // stepped floral/corbel capital
  add(new THREE.CylinderGeometry(.46*scale,.32*scale,.22*scale,8),MAT.sandstoneLight,3.18*scale);
  add(new THREE.BoxGeometry(.92*scale,.16*scale,.92*scale),MAT.sandstoneDark,3.38*scale);
  add(new THREE.BoxGeometry(1.16*scale,.14*scale,.66*scale),MAT.sandstoneLight,3.53*scale);
  // small diamond bosses read like hand-carved ornament at walking distance
  for(let i=0;i<4;i++){const b=add(new THREE.OctahedronGeometry(.11*scale,0),MAT.sandstoneLight,(1.22+i*.42)*scale);b.position.x=.29*scale;b.rotation.z=Math.PI/4;}
  return g;
}
// Colonnade: repeated stone pillars make the long archive read as a palace/temple hall.
for(const z of [11.8,9.25,6.7,2.55,0,-2.55,-7.15,-9.7,-12.25]) {
  templePillar(-5.35,z,.98); templePillar(5.35,z,.98);
}
// Stone beams and layered cornices bind the columns together.
for(const x of [-5.35,5.35]) {
  box(x,3.62,-.45,.72,.22,27.2,MAT.sandstoneDark);
  box(x,3.80,-.45,.96,.12,27.2,MAT.sandstoneLight);
  box(x,4.00,-.45,.62,.18,27.2,MAT.sandstone);
}
// Decorative transverse beams create a coffered, ceremonial ceiling rhythm.
for(const z of [11.8,9.25,6.7,4.05,2.55,0,-2.55,-4.95,-7.15,-9.7,-12.25]) {
  box(0,4.02,z,11.3,.18,.30,MAT.sandstoneDark);
  for(const x of [-3.9,-1.3,1.3,3.9]) {
    const boss=cylinder(.16,.16,.10,12,MAT.brass); boss.position.set(x,3.88,z); boss.rotation.x=Math.PI/2;
  }
}
// Torana-like gateways at the room transitions: stepped lintel, brackets and a central crest.
for(const z of [4.05,-4.95]) {
  box(-2.42,3.18,z,.48,2.15,.55,MAT.sandstone);
  box(2.42,3.18,z,.48,2.15,.55,MAT.sandstone);
  box(0,4.02,z,5.35,.26,.62,MAT.sandstoneDark);
  box(0,4.27,z,4.55,.18,.48,MAT.sandstoneLight);
  const crest=new THREE.Mesh(new THREE.OctahedronGeometry(.34,0),MAT.brass);crest.position.set(0,4.18,z-.34);crest.rotation.z=Math.PI/4;scene.add(crest);
  for(const x of [-1.85,1.85]){const b=box(x,3.70,z,.72,.52,.68,MAT.sandstoneLight);b.rotation.z=x<0?-.18:.18;}
}
// Recessed shrine-like frames behind every artwork, so the websites feel installed in stone niches.
for(const [x,z,rot] of [[-7.72,8.1,Math.PI/2],[7.72,7.15,-Math.PI/2],[-7.72,-.35,Math.PI/2],[7.72,-1,-Math.PI/2],[-7.72,-9,Math.PI/2],[7.72,-9.75,-Math.PI/2]]) {
  const g=new THREE.Group();g.position.set(x,2.22,z);g.rotation.y=rot;scene.add(g);
  const back=new THREE.Mesh(new THREE.BoxGeometry(4.25,3.12,.18),MAT.sandstoneDark);back.position.z=-.22;g.add(back);
  const top=new THREE.Mesh(new THREE.BoxGeometry(4.55,.20,.42),MAT.sandstoneLight);top.position.set(0,1.67,-.13);g.add(top);
  for(const sx of [-2.12,2.12]){const side=new THREE.Mesh(new THREE.BoxGeometry(.20,3.18,.42),MAT.sandstoneLight);side.position.set(sx,0,-.13);g.add(side);}
  for(const sx of [-1.65,-.82,0,.82,1.65]){const bead=new THREE.Mesh(new THREE.OctahedronGeometry(.095,0),MAT.brass);bead.position.set(sx,1.67,.11);g.add(bead);}
}
// Central floor inlay: restrained brass/stone medallions, not a theme-park texture.
for(const z of [7.4,-.7,-9.4]) {
  const ring=torus(0,.025,z,.92,.035,Math.PI/2,0,MAT.brass,Math.PI*2);
  const core=new THREE.Mesh(new THREE.CircleGeometry(.62,32),MAT.sandstoneDark);core.rotation.x=-Math.PI/2;core.position.set(0,.018,z);scene.add(core);
}

// Architectural hierarchy: ceremonial court, grand mandapa and carved wall rhythm.
function lotusRosette(x,y,z,scale=1) {
  const g=new THREE.Group(); g.position.set(x,y,z); scene.add(g);
  const center=new THREE.Mesh(new THREE.CylinderGeometry(.17*scale,.17*scale,.07*scale,16),MAT.brass);
  center.rotation.x=Math.PI/2; g.add(center);
  for(let i=0;i<8;i++){
    const a=i*Math.PI/4;
    const petal=new THREE.Mesh(new THREE.SphereGeometry(.16*scale,8,6),MAT.sandstoneLight);
    petal.scale.set(.55,1.35,.25); petal.position.set(Math.cos(a)*.31*scale,Math.sin(a)*.31*scale,0);
    petal.rotation.z=a-Math.PI/2; g.add(petal);
  }
}
function jaliPanel(x,y,z,rotY=0) {
  const g=new THREE.Group(); g.position.set(x,y,z); g.rotation.y=rotY; scene.add(g);
  for(let i=-3;i<=3;i++){
    const a=new THREE.Mesh(new THREE.BoxGeometry(.055,2.25,.08),MAT.sandstoneLight);
    a.position.x=i*.32; a.rotation.z=Math.PI/4; g.add(a);
    const b=a.clone(); b.rotation.z=-Math.PI/4; g.add(b);
  }
  for(const yy of [-1.18,1.18]){const rail=new THREE.Mesh(new THREE.BoxGeometry(2.5,.12,.14),MAT.sandstoneDark);rail.position.y=yy;g.add(rail);}
}
// Broad entrance court.
for(const x of [-6.65,-3.35,3.35,6.65]) templePillar(x,12.7,1.08);
box(0,4.12,12.7,14.4,.28,.58,MAT.sandstoneDark);
box(0,4.36,12.7,12.7,.16,.46,MAT.sandstoneLight);
lotusRosette(0,3.93,12.38,1.18);
jaliPanel(-7.72,2.2,11.5,Math.PI/2); jaliPanel(7.72,2.2,10.6,-Math.PI/2);

// Grand mandapa: heavier pillars and a layered ceiling canopy at the centre.
for(const p of [[-3.15,1.72],[3.15,1.72],[-3.15,-1.72],[3.15,-1.72]]) templePillar(p[0],p[1],1.16);
box(0,4.16,1.72,7.2,.30,.46,MAT.sandstoneDark); box(0,4.16,-1.72,7.2,.30,.46,MAT.sandstoneDark);
for(let layer=0;layer<3;layer++){const slab=box(0,4.34+layer*.12,0,5-layer*.7,.10,5-layer*.7,MAT.sandstoneDark);slab.rotation.y=layer*Math.PI/12;}
lotusRosette(0,4.18,0,1.48);

// Repeated shallow reliefs and rosettes keep the walls from reading as flat game boxes.
for(const z of [10.55,5.7,2.85,-2.85,-7.05,-11.55]){
  for(const x of [-7.93,7.93]){
    box(x,2.55,z,.16,2.7,1.28,MAT.sandstoneDark);
    for(const yy of [1.55,2.12,2.69,3.26]) box(x+(x<0?.10:-.10),yy,z,.08,.08,1.05,MAT.sandstoneLight);
  }
}

// Compressed threshold and monumental Room VII: spatial compression followed by release.
box(-4.45,2.2,-14.15,3.55,4.4,1.25,MAT.sandstoneDark);
box(4.45,2.2,-14.15,3.55,4.4,1.25,MAT.sandstoneDark);
box(0,3.48,-14.15,5.45,.22,1.25,MAT.sandstoneDark);
for(const x of [-2.48,2.48]) templePillar(x,-13.72,.86);

box(0,-.08,-18.15,15.4,.16,6.4,MAT.room3Floor);
box(-7.45,3.65,-18.15,.48,7.3,6.4,MAT.sandstoneDark);
box(7.45,3.65,-18.15,.48,7.3,6.4,MAT.sandstoneDark);
box(0,7.18,-18.15,15.4,.18,6.4,MAT.room3Ceiling);
box(0,3.65,-21.28,15.4,7.3,.48,MAT.sandstoneDark);
for(const z of [-16.15,-18.15,-20.15]){templePillar(-5.5,z,1.2);templePillar(5.5,z,1.2);box(0,4.72,z,11.6,.24,.42,MAT.sandstoneDark);}
for(const x of [-5.5,5.5]){box(x,4.52,-18.15,.86,.24,5.55,MAT.sandstone);box(x,4.78,-18.15,1.10,.16,5.55,MAT.sandstoneLight);}
lotusRosette(0,6.93,-18.15,2.05);
for(const x of [-3.5,0,3.5]) for(const z of [-17,-19.3]) lotusRosette(x,6.93,z,.68);
addPointLight(-4.7,-18.2,'#d18b46',22,9); addPointLight(4.7,-18.2,'#d18b46',22,9);
const finalGlow=new THREE.PointLight('#f3c27d',28,12,2);finalGlow.position.set(0,5.6,-20.2);scene.add(finalGlow);

// Authored-looking hero ornament: denser only at important bays, inspired by Indian carved-stone halls.
function carvedHeroPillar(x,z,scale=1){
  const g=new THREE.Group();g.position.set(x,0,z);scene.add(g);
  const part=(geo,mat,y)=>{const m=new THREE.Mesh(geo,mat);m.position.y=y;g.add(m);return m;};
  // stepped plinth
  for(const [y,r,h] of [[.08,.70,.16],[.22,.59,.12],[.34,.50,.12],[.46,.43,.10]]) part(new THREE.CylinderGeometry(r*scale,r*scale,h*scale,8),MAT.sandstoneDark,y*scale);
  // lathe-turned shaft with alternating drums
  let y=.62;
  for(let i=0;i<9;i++){const r=(i%3===1?.34:i%3===2?.29:.39)*scale;part(new THREE.CylinderGeometry(r,r,(i%2?.22:.28)*scale,16),i%2?MAT.sandstoneLight:MAT.sandstone,y*scale);y+=i%2?.22:.28;}
  part(new THREE.CylinderGeometry(.34*scale,.29*scale,.62*scale,16),MAT.sandstone,2.82*scale);
  // ornate capital + bracket silhouette
  part(new THREE.CylinderGeometry(.48*scale,.33*scale,.20*scale,8),MAT.sandstoneLight,3.24*scale);
  part(new THREE.BoxGeometry(1.04*scale,.16*scale,1.04*scale),MAT.sandstoneDark,3.42*scale);
  part(new THREE.BoxGeometry(1.30*scale,.15*scale,.76*scale),MAT.sandstoneLight,3.58*scale);
  for(const side of [-1,1]){const b=part(new THREE.BoxGeometry(.46*scale,.50*scale,.34*scale),MAT.sandstone,3.76*scale);b.position.x=side*.42*scale;b.rotation.z=side*.52;}
  // floral bosses around the hero capital
  for(let i=0;i<8;i++){const a=i*Math.PI/4;const boss=new THREE.Mesh(new THREE.OctahedronGeometry(.105*scale,1),MAT.brass);boss.position.set(Math.cos(a)*.44*scale,3.38*scale,Math.sin(a)*.44*scale);g.add(boss);}
  return g;
}
function ceilingMandala(x,z,scale=1){
  const g=new THREE.Group();g.position.set(x,4.43,z);g.rotation.x=Math.PI/2;scene.add(g);
  for(let ring=0;ring<4;ring++){const r=.28+ring*.27;const t=new THREE.Mesh(new THREE.TorusGeometry(r*scale,.045*scale,8,32),ring===2?MAT.brass:MAT.sandstoneLight);g.add(t);}
  for(let i=0;i<12;i++){const a=i*Math.PI/6;const p=new THREE.Mesh(new THREE.OctahedronGeometry(.10*scale,0),MAT.sandstoneLight);p.position.set(Math.cos(a)*.82*scale,Math.sin(a)*.82*scale,.03);p.rotation.z=a;g.add(p);}
  const pendant=new THREE.Mesh(new THREE.ConeGeometry(.22*scale,.34*scale,12),MAT.brass);pendant.rotation.x=-Math.PI/2;pendant.position.z=.18*scale;g.add(pendant);
}
function carvedPortal(z){
  // layered jambs and corbelled lintel around the circulation opening
  for(const x of [-2.75,2.75]){
    box(x,2.18,z,.24,4.18,.66,MAT.sandstoneDark);
    box(x+(x<0?.20:-.20),2.18,z-.02,.12,3.82,.72,MAT.sandstoneLight);
    for(const y of [.58,1.12,1.66,2.20,2.74,3.28]) box(x+(x<0?.31:-.31),y,z-.36,.10,.12,.18,MAT.brass);
  }
  for(let i=0;i<4;i++) box(0,3.72+i*.18,z,5.75-i*.48,.14,.62-i*.06,i===2?MAT.sandstoneLight:MAT.sandstoneDark);
  ceilingMandala(0,z-.28,.56);
}
// Replace uniformity at focal points with genuinely denser hero bays.
for(const p of [[-3.15,1.72],[3.15,1.72],[-3.15,-1.72],[3.15,-1.72]]) carvedHeroPillar(p[0],p[1],1.08);
for(const z of [7.45,0,-9.35]) ceilingMandala(0,z,1.0);
carvedPortal(4.02); carvedPortal(-4.92);

// Stone bench / parapet rhythm along quieter walls, creating architectural depth without ornament everywhere.
for(const x of [-6.55,6.55]){
  for(const z of [9.55,6.25,-.55,-2.65,-8.35,-11.15]){
    const seat=box(x,.47,z,1.45,.46,.62,MAT.sandstoneDark);
    const back=box(x,.92,z,1.45,.70,.18,MAT.sandstone);
    if(Math.abs(x)>0){seat.rotation.y=Math.PI/2;back.rotation.y=Math.PI/2;}
  }
}

// Light and material pass: carved stone should read through grazing light, not flat colour.
const stoneNoise=document.createElement('canvas');stoneNoise.width=stoneNoise.height=256;
const sn=stoneNoise.getContext('2d');const img=sn.createImageData(256,256);
for(let i=0;i<img.data.length;i+=4){const n=118+Math.floor((Math.random()-.5)*34);img.data[i]=n;img.data[i+1]=n-7;img.data[i+2]=n-15;img.data[i+3]=255;}
sn.putImageData(img,0,0);
const stoneMap=new THREE.CanvasTexture(stoneNoise);stoneMap.wrapS=stoneMap.wrapT=THREE.RepeatWrapping;stoneMap.repeat.set(5,5);
for(const m of [MAT.sandstone,MAT.sandstoneDark,MAT.sandstoneLight]){m.roughnessMap=stoneMap;m.bumpMap=stoneMap;m.bumpScale=.035;m.needsUpdate=true;}

function warmSpot(x,y,z,tx,ty,tz,intensity=26,distance=11,angle=.48){
  const l=new THREE.SpotLight('#f0b96f',intensity,distance,angle,.58,1.7);
  l.position.set(x,y,z);l.target.position.set(tx,ty,tz);scene.add(l,l.target);return l;
}
// Grazing light across capitals, portals and artworks.
for(const [x,z,tx] of [[-6.6,9.5,-7.7],[6.6,8.0,7.7],[-6.4,.3,-7.7],[6.4,-1.2,7.7],[-6.5,-8.7,-7.7],[6.5,-10,7.7]])
  warmSpot(x,3.95,z,tx,2.15,z,18,8,.42);
warmSpot(-4.8,4.35,1.9,0,2.7,0,30,10,.55);warmSpot(4.8,4.35,-1.9,0,2.7,0,30,10,.55);

// Jali lanterns: patterned luminous screens become landmarks in the darker bays.
function luminousJali(x,y,z,rotY=0,scale=1){
  const g=new THREE.Group();g.position.set(x,y,z);g.rotation.y=rotY;scene.add(g);
  const glow=new THREE.MeshBasicMaterial({color:'#d6a45e',transparent:true,opacity:.17,toneMapped:false});
  const panel=new THREE.Mesh(new THREE.PlaneGeometry(2.25*scale,2.8*scale),glow);panel.position.z=-.055;g.add(panel);
  const stone=new THREE.MeshStandardMaterial({color:'#8b6e50',roughness:.9});
  for(let i=-4;i<=4;i++){for(const sign of [-1,1]){const bar=new THREE.Mesh(new THREE.BoxGeometry(.055*scale,3.15*scale,.10*scale),stone);bar.position.x=i*.27*scale;bar.rotation.z=sign*Math.PI/4;g.add(bar);}}
  for(const yy of [-1.52,1.52]){const rail=new THREE.Mesh(new THREE.BoxGeometry(2.65*scale,.14*scale,.16*scale),MAT.sandstoneDark);rail.position.y=yy*scale;g.add(rail);}
  const lamp=new THREE.PointLight('#d69a50',10,4.8,2);lamp.position.set(0,0,-.55);g.add(lamp);
}
luminousJali(-7.70,2.15,5.55,Math.PI/2,.82);luminousJali(7.70,2.15,2.65,-Math.PI/2,.82);
luminousJali(-7.70,2.15,-7.15,Math.PI/2,.82);luminousJali(7.70,2.15,-11.65,-Math.PI/2,.82);

// A singular carved ceiling centerpiece over the mandapa.
const canopy=new THREE.Group();canopy.position.set(0,4.39,0);scene.add(canopy);
for(let ring=0;ring<5;ring++){
  const count=8+ring*4,r=.38+ring*.31;
  for(let i=0;i<count;i++){const a=i*Math.PI*2/count;const petal=new THREE.Mesh(new THREE.OctahedronGeometry(.10+ring*.012,1),ring===1?MAT.brass:MAT.sandstoneLight);petal.position.set(Math.cos(a)*r,0,Math.sin(a)*r);petal.scale.set(.62,1.15,1.5);petal.rotation.y=-a;canopy.add(petal);}
}
const drop=new THREE.Mesh(new THREE.ConeGeometry(.22,.52,16),MAT.brass);drop.position.y=-.27;canopy.add(drop);

// sculptural wayfinding objects change material with each room
box(0, 0.28, 7.4, 1.9, 0.56, 1.4, MAT.plinth1);
box(0, 0.36, -0.7, 2.4, 0.72, 1.05, MAT.plinth2);
box(0, 0.30, -9.4, 1.5, 0.6, 1.5, MAT.plinth3);

// low-cost emissive ceiling strips; different temperatures signal progression
for (const [z,color] of [[9.5,'#f2c999'],[6.3,'#e5a969'],[0.8,'#f4eee5'],[-2.2,'#d9cec7'],[-8.0,'#b9a07c'],[-11.0,'#9ca995']]) {
  const strip = box(0, 4.49, z, 3.4, 0.04, 0.10, new THREE.MeshBasicMaterial({ color }), false);
  strip.material.toneMapped = false;
}

// --- textures / paintings -------------------------------------------------
const manager = new THREE.LoadingManager();
let texturesReady = false;
manager.onProgress = (_, loaded, total) => {
  const pct = Math.min(99, Math.round((loaded / Math.max(total, 1)) * 100));
  ui.loadingNote.textContent = `3D archive ${pct}% ready. You can view the project list now.`;
};
manager.onLoad = () => {
  texturesReady = true;
  ui.enterButton.disabled = false;
  ui.enterLabel.textContent = 'ENTER EXHIBITION';
  ui.loadingNote.textContent = 'Exhibition ready. Or open the index.';
};

const textureLoader = new THREE.TextureLoader(manager);
const projectTextures = new Map();
for (const project of projects) {
  const t = textureLoader.load(project.image);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
  projectTextures.set(project.id, t);
}

function makeLabelTexture(project) {
  const c = document.createElement('canvas');
  c.width = 1024; c.height = 230;
  const x = c.getContext('2d');
  x.fillStyle = '#11130f'; x.fillRect(0, 0, c.width, c.height);
  x.fillStyle = '#c79d73'; x.fillRect(0, 0, 9, c.height);
  x.fillStyle = '#aaa196'; x.font = '30px monospace'; x.fillText(project.index, 44, 74);
  x.fillStyle = '#f0eadf'; x.font = '600 52px Arial'; x.fillText(project.title.toUpperCase(), 145, 82);
  x.fillStyle = '#c8beb0'; x.font = '28px monospace'; x.fillText(project.category, 145, 142);
  x.fillStyle = '#8f877b'; x.font = '24px monospace'; x.fillText('CLICK / TAP TO OPEN', 145, 190);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

const interactables = [];
function addPainting(project, x, z, rotY) {
  const g = new THREE.Group();
  g.position.set(x, 2.2, z);
  g.rotation.y = rotY;
  scene.add(g);

  const frame = new THREE.Mesh(new THREE.BoxGeometry(3.50, 2.30, 0.11), MAT.frame);
  frame.position.z = -0.045; frame.castShadow = true; g.add(frame);

  const art = new THREE.Mesh(
    new THREE.PlaneGeometry(3.16, 1.98),
    new THREE.MeshStandardMaterial({ map: projectTextures.get(project.id), roughness: 0.74 })
  );
  art.position.z = 0.018;
  art.userData = { type: 'project', project };
  g.add(art);
  interactables.push(art);

  const label = new THREE.Mesh(
    new THREE.PlaneGeometry(2.28, 0.51),
    new THREE.MeshBasicMaterial({ map: makeLabelTexture(project), transparent: false, toneMapped: false })
  );
  label.position.set(0, -1.45, 0.025);
  label.userData = { type: 'project', project };
  g.add(label);
  interactables.push(label);
}

addPainting(projects[0], -7.71, 8.1, Math.PI / 2);
addPainting(projects[1], 7.71, 7.15, -Math.PI / 2);
addPainting(projects[2], -7.71, -0.35, Math.PI / 2);
addPainting(projects[3], 7.71, -1.0, -Math.PI / 2);
addPainting(projects[4], -7.71, -9.0, Math.PI / 2);
addPainting(projects[5], 7.71, -9.75, -Math.PI / 2);

function makeContactTexture() {
  const c = document.createElement('canvas'); c.width = 1600; c.height = 850;
  const x = c.getContext('2d');
  x.fillStyle = '#11110f'; x.fillRect(0,0,c.width,c.height);
  x.fillStyle = '#817c72'; x.font = '30px monospace'; x.fillText('ROOM VII / UNASSIGNED', 110, 110);
  x.fillStyle = '#eee9df'; x.font = '700 108px Arial'; x.fillText('YOURS COULD BE', 110, 330); x.fillText('ROOM VII.', 110, 455);
  x.fillStyle = '#c8c1b6'; x.font = '28px monospace'; x.fillText('START A PROJECT  ↗', 110, 625);
  x.fillStyle = '#4a4741'; x.fillRect(110, 654, 360, 2);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
const contactArt = new THREE.Mesh(
  new THREE.PlaneGeometry(7.5, 3.95),
  new THREE.MeshBasicMaterial({ map: makeContactTexture(), toneMapped: false })
);
contactArt.position.set(0, 3.65, -21.02);
contactArt.userData = { type: 'contact' };
scene.add(contactArt); interactables.push(contactArt);

function roomTitleTexture(top, bottom) {
  const c = document.createElement('canvas'); c.width=1100; c.height=220; const x=c.getContext('2d');
  x.fillStyle='#d1c7ba'; x.font='34px monospace'; x.fillText(top,20,62);
  x.fillStyle='#f0eade'; x.font='700 78px Arial'; x.fillText(bottom.toUpperCase(),20,164);
  const t=new THREE.CanvasTexture(c); t.colorSpace=THREE.SRGBColorSpace; return t;
}
for (const [z,top,bottom] of [[12.8,'ROOM I','INTERIORS'],[3.15,'ROOM II','TRANSFORMATIONS'],[-5.85,'ROOM III','OCCASIONS']]) {
  const p=new THREE.Mesh(new THREE.PlaneGeometry(4.4,.88),new THREE.MeshBasicMaterial({map:roomTitleTexture(top,bottom),transparent:true,toneMapped:false}));
  p.position.set(-5.5,3.68,z); p.rotation.y=Math.PI/2; scene.add(p);
}

// --- DOM overlays ---------------------------------------------------------
for (const project of projects) {
  const b = document.createElement('button');
  b.innerHTML = `<span>${project.index}</span><strong>${project.title}</strong><em>${project.category}</em><i>↗</i>`;
  b.addEventListener('click', () => { closeOverlay('archive'); openProject(project); });
  ui.archiveList.appendChild(b);
}

let overlayOpen = false;
function openOverlay(el) {
  overlayOpen = true;
  if (document.pointerLockElement) document.exitPointerLock?.();
  el.classList.add('open'); el.setAttribute('aria-hidden','false');
}
function closeOverlay(which) {
  const map = { project: ui.projectOverlay, archive: ui.archiveOverlay, contact: ui.contactOverlay };
  const el = map[which]; if (!el) return;
  el.classList.remove('open'); el.setAttribute('aria-hidden','true');
  setTimeout(() => { overlayOpen = [...document.querySelectorAll('.overlay')].some(o => o.classList.contains('open')); }, 10);
}
function openProject(project) {
  ui.projectImage.src = project.image;
  ui.projectRoom.textContent = project.room;
  ui.projectNumber.textContent = `${project.index} / 06`;
  ui.projectTitle.textContent = project.title;
  ui.projectLede.textContent = project.blurb;
  ui.projectDetail.textContent = project.detail;
  if (project.href) {
    ui.projectLink.href = project.href;
    ui.projectLink.textContent = project.linkLabel || 'OPEN LIVE PROJECT ↗';
    ui.projectLink.classList.remove('disabled');
  } else {
    ui.projectLink.removeAttribute('href');
    ui.projectLink.textContent = project.linkLabel || 'CONCEPT ARCHIVE / NO PUBLIC LINK';
    ui.projectLink.classList.add('disabled');
  }
  openOverlay(ui.projectOverlay);
}

ui.indexButton.addEventListener('click', () => openOverlay(ui.archiveOverlay));
ui.brandButton.addEventListener('click', () => openOverlay(ui.archiveOverlay));
document.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', () => closeOverlay(b.dataset.close)));
document.addEventListener('keydown', e => {
  if (e.code === 'Escape' && overlayOpen) {
    document.querySelectorAll('.overlay.open').forEach(el => el.classList.remove('open'));
    overlayOpen = false;
  }
});

// --- navigation -----------------------------------------------------------
const keys = Object.create(null);
let entered = false;
let yaw = 0;
let pitch = 0;
let intro = 0;
let introActive = false;
const mobileInput = { forward: 0, strafe: 0, lookDX: 0, lookDY: 0 };
const isFinePointer = matchMedia('(pointer:fine)').matches;

window.addEventListener('keydown', e => { keys[e.code] = true; });
window.addEventListener('keyup', e => { keys[e.code] = false; });
document.addEventListener('mousemove', e => {
  if (!entered || overlayOpen || document.pointerLockElement !== ui.canvas) return;
  yaw -= e.movementX * 0.00165;
  pitch -= e.movementY * 0.00145;
  pitch = THREE.MathUtils.clamp(pitch, -1.08, 1.04);
});

ui.canvas.addEventListener('touchmove', e => { if (entered) e.preventDefault(); }, { passive: false });

ui.canvas.addEventListener('click', e => {
  if (!entered || overlayOpen || !isFinePointer) return;
  if (document.pointerLockElement !== ui.canvas) {
    ui.canvas.requestPointerLock?.();
    return;
  }
  interactAt(window.innerWidth / 2, window.innerHeight / 2);
});

ui.enterButton.addEventListener('click', () => {
  if (!texturesReady || entered) return;
  entered = true;
  intro = 0; introActive = true;
  camera.position.set(0, 1.65, 12.35);
  ui.entry.classList.add('leaving');
  ui.hud.classList.remove('hidden');
  ui.crosshair.classList.remove('hidden');
  ui.firstHint.classList.remove('hidden');
  ui.firstHint.style.animation = 'none';
  requestAnimationFrame(() => { ui.firstHint.style.animation = ''; });
  ui.mobileControls.classList.remove('hidden');
  setTimeout(() => ui.entry.classList.add('gone'), 1000);
});

const blockers = [
  [-8.7,-7.96,-15,14], [7.96,8.7,-15,14], [-8.7,8.7,13.45,14.1], [-8.1,-7.2,-21.6,-14.46], [7.2,8.1,-21.6,-14.46], [-8.1,8.1,-21.6,-21.25],
  [-8.6,-2.72,3.86,4.25], [2.72,8.6,3.86,4.25],
  [-8.6,-2.72,-5.13,-4.75], [2.72,8.6,-5.13,-4.75]
];
function collisionFree(x,z) {
  const r=.30;
  return !blockers.some(([minX,maxX,minZ,maxZ]) => x+r>minX && x-r<maxX && z+r>minZ && z-r<maxZ);
}

// mobile controls
let joyPointer = null, lookPointer = null;
let joyOrigin = {x:0,y:0}, lookLast = {x:0,y:0}, lookMoved = 0;
function resetJoy() {
  mobileInput.forward = 0; mobileInput.strafe = 0;
  ui.knob.style.transform = 'translate(-50%,-50%)';
}
ui.joystick.addEventListener('pointerdown', e => {
  joyPointer = e.pointerId; ui.joystick.setPointerCapture(e.pointerId);
  const r=ui.joystick.getBoundingClientRect(); joyOrigin={x:r.left+r.width/2,y:r.top+r.height/2};
});
ui.joystick.addEventListener('pointermove', e => {
  if(e.pointerId!==joyPointer) return;
  let dx=e.clientX-joyOrigin.x,dy=e.clientY-joyOrigin.y; const max=42,mag=Math.hypot(dx,dy);
  if(mag>max){dx*=max/mag;dy*=max/mag;}
  mobileInput.strafe=dx/max; mobileInput.forward=-dy/max;
  ui.knob.style.transform=`translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px))`;
});
ui.joystick.addEventListener('pointerup',e=>{if(e.pointerId===joyPointer){joyPointer=null;resetJoy();}});
ui.joystick.addEventListener('pointercancel',resetJoy);
ui.lookZone.addEventListener('pointerdown',e=>{
  lookPointer=e.pointerId; lookLast={x:e.clientX,y:e.clientY}; lookMoved=0; ui.lookZone.setPointerCapture(e.pointerId);
});
ui.lookZone.addEventListener('pointermove',e=>{
  if(e.pointerId!==lookPointer)return;
  const dx=e.clientX-lookLast.x,dy=e.clientY-lookLast.y; lookMoved+=Math.hypot(dx,dy);
  mobileInput.lookDX+=dx; mobileInput.lookDY+=dy; lookLast={x:e.clientX,y:e.clientY};
});
ui.lookZone.addEventListener('pointerup',e=>{
  if(e.pointerId!==lookPointer)return;
  if(lookMoved<7) interactAt(e.clientX,e.clientY);
  lookPointer=null;
});

// --- interaction raycasting ---------------------------------------------
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2(0,0);
function hitAt(clientX, clientY) {
  mouse.x = (clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObjects(interactables, false);
  const hit = hits.find(h => h.distance < 5.4);
  return hit?.object || null;
}
function interactAt(clientX,clientY) {
  if(!entered || overlayOpen)return;
  const target=hitAt(clientX,clientY); if(!target)return;
  if(target.userData.type==='project') openProject(target.userData.project);
  if(target.userData.type==='contact') openOverlay(ui.contactOverlay);
}

const interactHint = document.createElement('div');
interactHint.className = 'interact-hint'; interactHint.textContent='VIEW PROJECT  ↗'; document.body.appendChild(interactHint);

// --- animation loop -------------------------------------------------------
let activeRoom = 1;
function updateRoomIndicator(z) {
  const room = z > 4.05 ? 1 : z > -4.95 ? 2 : z > -14.5 ? 3 : 4;
  if (room === activeRoom) return;
  activeRoom = room;
  const meta = room === 1 ? ['ROOM I','INTERIORS','25%'] : room === 2 ? ['ROOM II','TRANSFORMATIONS','50%'] : room === 3 ? ['ROOM III','OCCASIONS','75%'] : ['ROOM VII','UNASSIGNED','100%'];
  ui.roomNumber.textContent = meta[0]; ui.roomName.textContent = meta[1]; ui.roomProgress.style.width = meta[2];
}
const clock = new THREE.Clock();
function animate() {
  const dt = Math.min(clock.getDelta(), .04);
  if (entered && !overlayOpen) {
    if (introActive) {
      intro = Math.min(1, intro + dt * .62);
      const e = 1 - Math.pow(1-intro, 3);
      camera.position.z = THREE.MathUtils.lerp(12.35, 11.2, e);
      if (intro >= 1) introActive = false;
    }

    yaw -= mobileInput.lookDX * .0031;
    pitch -= mobileInput.lookDY * .0027;
    pitch = THREE.MathUtils.clamp(pitch, -1.08, 1.04);
    mobileInput.lookDX=0; mobileInput.lookDY=0;
    camera.rotation.set(pitch,yaw,0,'YXZ');

    if (!introActive) {
      let forward=(keys.KeyW||keys.ArrowUp?1:0)-(keys.KeyS||keys.ArrowDown?1:0)+mobileInput.forward;
      let strafe=(keys.KeyD||keys.ArrowRight?1:0)-(keys.KeyA||keys.ArrowLeft?1:0)+mobileInput.strafe;
      const len=Math.hypot(forward,strafe); if(len>1){forward/=len;strafe/=len;}
      const speed=(keys.ShiftLeft?4.0:2.7)*dt;
      const dx=(-Math.sin(yaw)*forward + Math.cos(yaw)*strafe)*speed;
      const dz=(-Math.cos(yaw)*forward - Math.sin(yaw)*strafe)*speed;
      const nx=camera.position.x+dx,nz=camera.position.z+dz;
      if(collisionFree(nx,camera.position.z))camera.position.x=nx;
      if(collisionFree(camera.position.x,nz))camera.position.z=nz;
      camera.position.y=1.65 + Math.sin(performance.now()*.004)*Math.min(.013,Math.abs(forward+strafe)*.013);
    }

    updateRoomIndicator(camera.position.z);

    const hoverTarget = hitAt(window.innerWidth/2, window.innerHeight/2);
    document.body.classList.toggle('is-targeting', !!hoverTarget);
    interactHint.classList.toggle('show', !!hoverTarget);
    interactHint.textContent = hoverTarget?.userData.type==='contact' ? 'START A PROJECT  ↗' : 'VIEW PROJECT  ↗';
  } else {
    interactHint.classList.remove('show');
  }

  renderer.render(scene,camera);
  requestAnimationFrame(animate);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth/window.innerHeight; camera.updateProjectionMatrix();
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.5)); renderer.setSize(window.innerWidth,window.innerHeight);
});
