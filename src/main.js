import * as THREE from 'three';
import './style.css';

const projects = [
  {
    id: 'pakeezah', index: '01', title: 'Pakeezah Atelier', category: 'INTERIOR / PORTFOLIO', room: 'ROOM I — INTERIORS', image: '/art/pakeezah.jpg',
    blurb: 'A quiet portfolio that moves from design intent to the reality of the site.',
    detail: 'Editorial pacing, site-to-finish storytelling and a WhatsApp-first enquiry path.',
    href: 'https://pakeezahatelier.vercel.app/'
  },
  {
    id: 'trove', index: '02', title: 'The Design Trove', category: 'INTERIOR / CONCEPT', room: 'ROOM I — INTERIORS', image: '/art/trove.jpg',
    blurb: 'A concept built around the distance between a brief and a finished home.',
    detail: 'Horizontal moments, restrained transitions and a project-led narrative.',
    href: 'https://thedesigntrove.vercel.app/'
  },
  {
    id: 'regnant', index: '03', title: 'Regnant', category: 'INTERIOR / BEFORE → AFTER', room: 'ROOM II — TRANSFORMATIONS', image: '/art/regnant.jpg',
    blurb: 'A visual before-and-after portfolio for showing execution, not just outcomes.',
    detail: 'Construction-to-finished comparisons, project captions and a concise brief flow.',
    href: 'https://regnant-beta.vercel.app/'
  },
  {
    id: 'still', index: '04', title: 'Still Skincare', category: 'BEAUTY / CONCEPT', room: 'ROOM II — TRANSFORMATIONS', image: '/art/still.jpg',
    blurb: 'A skincare story built around one idea: lock the age you are in.',
    detail: 'A scroll-led brand journey from concern → science → treatment → consultation.',
    href: 'https://stillskincare.vercel.app/'
  },
  {
    id: 'everafter', index: '05', title: 'Ever After', category: 'WEDDING / EDITORIAL', room: 'ROOM III — OCCASIONS', image: '/art/everafter.jpg',
    blurb: 'An editorial wedding experience designed to feel closer to a magazine than a template.',
    detail: 'Deep tones, full-frame imagery and a clear route from atmosphere to enquiry.',
    href: ''
  },
  {
    id: 'archive35', index: '06', title: '35mm Archive', category: 'EXPERIMENTAL / CAMERA', room: 'ROOM III — OCCASIONS', image: '/art/archive35.jpg',
    blurb: 'A tactile film-camera experiment built as a digital object rather than a normal page.',
    detail: 'Tape, contact sheets, film-strip movement and a physical-feeling visual system.',
    href: ''
  }
];

const ui = {
  canvas: document.querySelector('#gallery'),
  entry: document.querySelector('#entry'),
  enterButton: document.querySelector('#enterButton'),
  enterLabel: document.querySelector('#enterLabel'),
  hud: document.querySelector('#hud'),
  crosshair: document.querySelector('#crosshair'),
  desktopHint: document.querySelector('#desktopHint'),
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
const renderer = new THREE.WebGLRenderer({ canvas: ui.canvas, antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.65));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.18;
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
scene.background = new THREE.Color('#bdb6a8');
scene.fog = new THREE.Fog('#bdb6a8', 16, 34);

const camera = new THREE.PerspectiveCamera(62, window.innerWidth / window.innerHeight, 0.1, 55);
camera.position.set(0, 1.65, 11.2);
camera.rotation.order = 'YXZ';

scene.add(new THREE.HemisphereLight('#e6ded0', '#756f66', 1.65));
const sun = new THREE.DirectionalLight('#fff0d2', 2.7);
sun.position.set(5.5, 11, 8);
sun.castShadow = true;
sun.shadow.mapSize.set(1024, 1024);
sun.shadow.camera.left = -12;
sun.shadow.camera.right = 12;
sun.shadow.camera.top = 18;
sun.shadow.camera.bottom = -18;
scene.add(sun);

function addPointLight(x, z, intensity = 24) {
  const l = new THREE.PointLight('#ffddb0', intensity, 9, 2);
  l.position.set(x, 3.85, z);
  scene.add(l);
}
addPointLight(-5.7, 8.2, 20);
addPointLight(5.7, 6.6, 19);
addPointLight(-5.7, -0.7, 18);
addPointLight(5.7, -1.2, 17);
addPointLight(-5.7, -9.0, 18);
addPointLight(5.7, -9.8, 18);

const MAT = {
  wall: new THREE.MeshStandardMaterial({ color: '#e5dfd4', roughness: 0.92 }),
  floor: new THREE.MeshStandardMaterial({ color: '#aaa295', roughness: 0.89 }),
  ceiling: new THREE.MeshStandardMaterial({ color: '#d8d2c7', roughness: 1, side: THREE.DoubleSide }),
  frame: new THREE.MeshStandardMaterial({ color: '#141310', roughness: 0.52 }),
  plinth: new THREE.MeshStandardMaterial({ color: '#c1b9ad', roughness: 0.82 }),
  dark: new THREE.MeshStandardMaterial({ color: '#11110f', roughness: 0.86 })
};

function box(x, y, z, sx, sy, sz, material = MAT.wall, cast = true) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz), material);
  m.position.set(x, y, z);
  m.castShadow = cast;
  m.receiveShadow = true;
  scene.add(m);
  return m;
}

// floor / ceiling / outer shell
box(0, -0.08, -0.5, 17, 0.16, 29, MAT.floor, false);
box(0, 4.61, -0.5, 17, 0.12, 29, MAT.ceiling, false);
box(-8.25, 2.25, -0.5, 0.5, 4.5, 29);
box(8.25, 2.25, -0.5, 0.5, 4.5, 29);
box(0, 2.25, 13.72, 17, 4.5, 0.5);
box(-5.4, 2.25, -14.72, 5.8, 4.5, 0.5);
box(5.4, 2.25, -14.72, 5.8, 4.5, 0.5);

// partitions with central openings
for (const z of [4.05, -4.95]) {
  box(-5.55, 2.25, z, 5.4, 4.5, 0.35);
  box(5.55, 2.25, z, 5.4, 4.5, 0.35);
}

// sculptural objects / wayfinding
box(0, 0.28, 7.4, 1.9, 0.56, 1.4, MAT.plinth);
box(0, 0.36, -0.7, 2.4, 0.72, 1.05, MAT.plinth);
box(0, 0.30, -9.4, 1.5, 0.6, 1.5, MAT.plinth);

// ceiling light strips
for (const z of [9.5, 6.3, 0.8, -2.2, -8.0, -11.0]) {
  const strip = box(0, 4.49, z, 3.4, 0.04, 0.10, new THREE.MeshBasicMaterial({ color: '#fff4df' }), false);
  strip.material.toneMapped = false;
}

// --- textures / paintings -------------------------------------------------
const manager = new THREE.LoadingManager();
let texturesReady = false;
manager.onProgress = (_, loaded, total) => {
  const pct = Math.min(99, Math.round((loaded / Math.max(total, 1)) * 100));
  ui.enterLabel.textContent = `LOADING ${String(pct).padStart(2, '0')}%`;
};
manager.onLoad = () => {
  texturesReady = true;
  ui.enterButton.disabled = false;
  ui.enterLabel.textContent = 'ENTER GALLERY';
};

const textureLoader = new THREE.TextureLoader(manager);
const projectTextures = new Map();
for (const project of projects) {
  const t = textureLoader.load(project.image);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = renderer.capabilities.getMaxAnisotropy();
  projectTextures.set(project.id, t);
}

function makeLabelTexture(project) {
  const c = document.createElement('canvas');
  c.width = 1024; c.height = 230;
  const x = c.getContext('2d');
  x.fillStyle = '#eee9df'; x.fillRect(0, 0, c.width, c.height);
  x.fillStyle = '#151411'; x.fillRect(0, 0, 9, c.height);
  x.fillStyle = '#4d4941'; x.font = '30px monospace'; x.fillText(project.index, 44, 74);
  x.fillStyle = '#12110f'; x.font = '600 52px Arial'; x.fillText(project.title.toUpperCase(), 145, 82);
  x.fillStyle = '#625e56'; x.font = '28px monospace'; x.fillText(project.category, 145, 142);
  x.fillStyle = '#918b80'; x.font = '24px monospace'; x.fillText('CLICK / TAP TO OPEN', 145, 190);
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
  x.fillStyle = '#817c72'; x.font = '30px monospace'; x.fillText('END OF ARCHIVE', 110, 110);
  x.fillStyle = '#eee9df'; x.font = '500 94px Georgia'; x.fillText('Have something', 110, 330); x.fillText('worth building?', 110, 440);
  x.fillStyle = '#c8c1b6'; x.font = '28px monospace'; x.fillText('START A PROJECT  ↗', 110, 625);
  x.fillStyle = '#4a4741'; x.fillRect(110, 654, 360, 2);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
const contactArt = new THREE.Mesh(
  new THREE.PlaneGeometry(7.5, 3.95),
  new THREE.MeshBasicMaterial({ map: makeContactTexture(), toneMapped: false })
);
contactArt.position.set(0, 2.25, -14.42);
contactArt.userData = { type: 'contact' };
scene.add(contactArt); interactables.push(contactArt);

function roomTitleTexture(top, bottom) {
  const c = document.createElement('canvas'); c.width=1100; c.height=220; const x=c.getContext('2d');
  x.fillStyle='#211f1b'; x.font='34px monospace'; x.fillText(top,20,62);
  x.fillStyle='#211f1b'; x.font='italic 88px Georgia'; x.fillText(bottom,20,164);
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
    ui.projectLink.textContent = 'OPEN LIVE PROJECT ↗';
    ui.projectLink.classList.remove('disabled');
  } else {
    ui.projectLink.removeAttribute('href');
    ui.projectLink.textContent = 'CONCEPT ARCHIVE / NO PUBLIC LINK';
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
  ui.desktopHint.classList.remove('hidden');
  ui.mobileControls.classList.remove('hidden');
  setTimeout(() => ui.entry.classList.add('gone'), 1000);
});

const blockers = [
  [-8.7,-7.96,-15,14], [7.96,8.7,-15,14], [-8.7,8.7,13.45,14.1], [-8.7,8.7,-15.1,-14.46],
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
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.65)); renderer.setSize(window.innerWidth,window.innerHeight);
});
