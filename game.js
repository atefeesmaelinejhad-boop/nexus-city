import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

/* =========================
   TELEGRAM
========================= */

const tg = window.Telegram?.WebApp || null;

if (tg) {
  tg.ready();
  tg.expand();
}


/* =========================
   LANGUAGE
========================= */

const translations = {
  fa: {
    energy: "انرژی",
    level: "سطح",
    cityValue: "ارزش شهر",
    operations: "عملیات",
    missions: "ماموریت",
    market: "بازار",
    ranking: "رتبه‌بندی",
    profile: "پروفایل",
    enter: "ورود",
    operation: "عملیات",
    mission: "ماموریت",
    marketTitle: "بازار",
    rankingTitle: "رتبه‌بندی",
    profileTitle: "پروفایل",
    noEnergy: "انرژی کافی نیست.",
    noNex: "NEX کافی نیست."
  },

  en: {
    energy: "Energy",
    level: "Level",
    cityValue: "City Value",
    operations: "Operations",
    missions: "Missions",
    market: "Market",
    ranking: "Ranking",
    profile: "Profile",
    enter: "Enter",
    operation: "Operation",
    mission: "Mission",
    marketTitle: "Market",
    rankingTitle: "Ranking",
    profileTitle: "Profile",
    noEnergy: "Not enough energy.",
    noNex: "Not enough NEX."
  }
};


/* =========================
   GAME STATE
========================= */

const defaultState = {
  language: localStorage.getItem("NEXUS_LANGUAGE") || null,
  nex: 10000,
  energy: 100,
  xp: 0,
  level: 1,
  cityValue: 100000
};

let state = loadState();

function loadState() {
  try {
    const saved = localStorage.getItem("NEXUS_STATE");

    if (!saved) {
      return { ...defaultState };
    }

    return {
      ...defaultState,
      ...JSON.parse(saved)
    };

  } catch (error) {
    console.error(error);
    return { ...defaultState };
  }
}

function saveState() {
  localStorage.setItem("NEXUS_STATE", JSON.stringify(state));

  if (state.language) {
    localStorage.setItem("NEXUS_LANGUAGE", state.language);
  }
}


/* =========================
   DOM
========================= */

const languageScreen = document.getElementById("language-screen");
const gameContainer = document.getElementById("game-container");

const faButton = document.getElementById("fa-button");
const enButton = document.getElementById("en-button");

const nexValue = document.getElementById("nex-value");
const energyValue = document.getElementById("energy-value");
const levelValue = document.getElementById("level-value");
const cityValue = document.getElementById("city-value");

const nexLabel = document.getElementById("nex-label");
const energyLabel = document.getElementById("energy-label");
const levelLabel = document.getElementById("level-label");
const cityValueLabel = document.getElementById("city-value-label");

const navOperations = document.getElementById("nav-operations");
const navMissions = document.getElementById("nav-missions");
const navMarket = document.getElementById("nav-market");
const navRanking = document.getElementById("nav-ranking");
const navProfile = document.getElementById("nav-profile");

const actionPanel = document.getElementById("action-panel");
const actionTitle = document.getElementById("action-title");
const actionDescription = document.getElementById("action-description");
const actionButton = document.getElementById("action-button");

const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal-title");
const modalContent = document.getElementById("modal-content");
const modalClose = document.getElementById("modal-close");


/* =========================
   LANGUAGE FUNCTIONS
========================= */

function setLanguage(language) {

  if (!translations[language]) {
    language = "fa";
  }

  state.language = language;

  document.documentElement.lang = language;
  document.documentElement.dir = language === "fa" ? "rtl" : "ltr";

  const t = translations[language];

  nexLabel.textContent = "NEX";
  energyLabel.textContent = t.energy;
  levelLabel.textContent = t.level;
  cityValueLabel.textContent = t.cityValue;

  navOperations.textContent = t.operations;
  navMissions.textContent = t.missions;
  navMarket.textContent = t.market;
  navRanking.textContent = t.ranking;
  navProfile.textContent = t.profile;

  languageScreen.style.display = "none";
  gameContainer.classList.add("active");

  saveState();
  updateHUD();

  if (!scene) {
    init3D();
  }
}


/* =========================
   LANGUAGE BUTTONS
========================= */

faButton.addEventListener("click", () => {
  setLanguage("fa");
});

enButton.addEventListener("click", () => {
  setLanguage("en");
});


/* =========================
   HUD
========================= */

function updateHUD() {

  nexValue.textContent = Number(state.nex).toLocaleString(
    state.language === "en" ? "en-US" : "fa-IR"
  );

  energyValue.textContent = Math.floor(state.energy);

  levelValue.textContent = state.level;

  cityValue.textContent = Number(state.cityValue).toLocaleString(
    state.language === "en" ? "en-US" : "fa-IR"
  );
}


/* =========================
   MODAL
========================= */

function openModal(title, html) {

  modalTitle.textContent = title;
  modalContent.innerHTML = html;

  modal.classList.add("active");
}

function closeModal() {
  modal.classList.remove("active");
}

modalClose.addEventListener("click", closeModal);

modal.addEventListener("click", (event) => {

  if (event.target === modal) {
    closeModal();
  }

});


/* =========================
   BUILDINGS
========================= */

const buildings = [];

function createBuilding(name, x, z, width, height, depth, type) {

  const geometry = new THREE.BoxGeometry(
    width,
    height,
    depth
  );

  const material = new THREE.MeshStandardMaterial({
    color:
      type === "hq" ? 0x164b65 :
      type === "bank" ? 0x244b38 :
      type === "intel" ? 0x3d275a :
      0x604526,
    roughness: 0.72,
    metalness: 0.15
  });

  const building = new THREE.Mesh(
    geometry,
    material
  );

  building.position.set(
    x,
    height / 2,
    z
  );

  building.userData = {
    name,
    type
  };

  scene.add(building);
  buildings.push(building);


  /* WINDOWS */

  const windowMaterial = new THREE.MeshBasicMaterial({
    color: 0x8fe9ff
  });

  const rows = Math.max(2, Math.floor(height / 2.5));
  const cols = Math.max(2, Math.floor(width / 2.5));

  for (let row = 0; row < rows; row++) {

    for (let col = 0; col < cols; col++) {

      const windowGeometry =
        new THREE.BoxGeometry(
          0.45,
          0.55,
          0.06
        );

      const windowMesh =
        new THREE.Mesh(
          windowGeometry,
          windowMaterial
        );

      const wx =
        x - width / 2 +
        1 +
        col * ((width - 2) / Math.max(1, cols - 1));

      const wy =
        1.2 +
        row * 2;

      windowMesh.position.set(
        wx,
        wy,
        z - depth / 2 - 0.04
      );

      scene.add(windowMesh);
    }
  }

  return building;
}


/* =========================
   THREE.JS VARIABLES
========================= */

let scene = null;
let camera = null;
let renderer = null;

let player = null;

let animationFrame = null;

const clock = new THREE.Clock();

const keys = {
  up: false,
  down: false,
  left: false,
  right: false
};


/* =========================
   3D INITIALIZATION
========================= */

function init3D() {

  if (scene) {
    return;
  }

  const cityElement = document.getElementById("city");

  if (!cityElement) {
    console.error("City container not found.");
    return;
  }


  /* SCENE */

  scene = new THREE.Scene();

  scene.background = new THREE.Color(0x050a14);

  scene.fog = new THREE.Fog(
    0x050a14,
    35,
    120
  );


  /* CAMERA */

  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    500
  );

  camera.position.set(
    18,
    20,
    25
  );


  /* RENDERER */

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    powerPreference: "high-performance"
  });

  renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 1.5)
  );

  renderer.setSize(
    window.innerWidth,
    window.innerHeight
  );

  cityElement.innerHTML = "";
  cityElement.appendChild(renderer.domElement);


  /* LIGHTS */

  const ambientLight =
    new THREE.AmbientLight(
      0x9fb7d4,
      1.7
    );

  scene.add(ambientLight);

  const moonLight =
    new THREE.DirectionalLight(
      0xaacbff,
      2.0
    );

  moonLight.position.set(
    -30,
    50,
    20
  );

  scene.add(moonLight);


  /* GROUND */

  const groundGeometry =
    new THREE.PlaneGeometry(
      140,
      140
    );

  const groundMaterial =
    new THREE.MeshStandardMaterial({
      color: 0x101722,
      roughness: 0.95
    });

  const ground =
    new THREE.Mesh(
      groundGeometry,
      groundMaterial
    );

  ground.rotation.x = -Math.PI / 2;

  scene.add(ground);


  /* ROADS */

  createRoad(
    0,
    0,
    140,
    7,
    0
  );

  createRoad(
    0,
    0,
    7,
    140,
    0
  );


  /* BUILDINGS */

  createBuilding(
    "HQ",
    -18,
    -18,
    10,
    12,
    10,
    "hq"
  );

  createBuilding(
    "BANK",
    18,
    -18,
    11,
    17,
    10,
    "bank"
  );

  createBuilding(
    "INTELLIGENCE",
    -18,
    18,
    12,
    15,
    11,
    "intel"
  );

  createBuilding(
    "MARKET",
    18,
    18,
    12,
    9,
    12,
    "market"
  );


  /* PLAYER */

  const playerGeometry =
    new THREE.CapsuleGeometry(
      0.65,
      1.3,
      6,
      12
    );

  const playerMaterial =
    new THREE.MeshStandardMaterial({
      color: 0x55d6ff,
      roughness: 0.4,
      metalness: 0.35
    });

  player =
    new THREE.Mesh(
      playerGeometry,
      playerMaterial
    );

  player.position.set(
    0,
    1.2,
    0
  );

  scene.add(player);


  /* PLAYER LIGHT */

  const playerLight =
    new THREE.PointLight(
      0x55d6ff,
      3,
      12
    );

  playerLight.position.set(
    0,
    3,
    0
  );

  player.add(playerLight);


  /* RESIZE */

  window.addEventListener(
    "resize",
    onResize
  );


  /* MOVEMENT */

  setupMovement();


  /* CLICK */

  renderer.domElement.addEventListener(
    "pointerdown",
    handleCityClick
  );


  animate();
}


/* =========================
   ROAD
========================= */

function createRoad(
  x,
  z,
  width,
  depth
) {

  const geometry =
    new THREE.BoxGeometry(
      width,
      0.12,
      depth
    );

  const material =
    new THREE.MeshStandardMaterial({
      color: 0x202732,
      roughness: 0.95
    });

  const road =
    new THREE.Mesh(
      geometry,
      material
    );

  road.position.set(
    x,
    0.06,
    z
  );

  scene.add(road);
}


/* =========================
   MOVEMENT
========================= */

function setupMovement() {

  document.querySelectorAll(
    ".move-button"
  ).forEach(button => {

    const direction =
      button.dataset.direction;

    button.addEventListener(
      "pointerdown",
      event => {
        event.preventDefault();
        movePlayer(direction);
      }
    );

  });


  window.addEventListener(
    "keydown",
    event => {

      if (event.key === "ArrowUp" || event.key === "w") {
        keys.up = true;
      }

      if (event.key === "ArrowDown" || event.key === "s") {
        keys.down = true;
      }

      if (event.key === "ArrowLeft" || event.key === "a") {
        keys.left = true;
      }

      if (event.key === "ArrowRight" || event.key === "d") {
        keys.right = true;
      }

    }
  );


  window.addEventListener(
    "keyup",
    event => {

      if (event.key === "ArrowUp" || event.key === "w") {
        keys.up = false;
      }

      if (event.key === "ArrowDown" || event.key === "s") {
        keys.down = false;
      }

      if (event.key === "ArrowLeft" || event.key === "a") {
        keys.left = false;
      }

      if (event.key === "ArrowRight" || event.key === "d") {
        keys.right = false;
      }

    }
  );
}


function movePlayer(direction) {

  if (!player) {
    return;
  }

  const distance = 1.4;

  if (direction === "up") {
    player.position.z -= distance;
  }

  if (direction === "down") {
    player.position.z += distance;
  }

  if (direction === "left") {
    player.position.x -= distance;
  }

  if (direction === "right") {
    player.position.x += distance;
  }

  player.position.x =
    THREE.MathUtils.clamp(
      player.position.x,
      -55,
      55
    );

  player.position.z =
    THREE.MathUtils.clamp(
      player.position.z,
      -55,
      55
    );
}


/* =========================
   ANIMATION
========================= */

function animate() {

  animationFrame =
    requestAnimationFrame(
      animate
    );

  const delta =
    Math.min(
      clock.getDelta(),
      0.05
    );

  if (player) {

    const speed = 8 * delta;

    if (keys.up) {
      player.position.z -= speed;
    }

    if (keys.down) {
      player.position.z += speed;
    }

    if (keys.left) {
      player.position.x -= speed;
    }

    if (keys.right) {
      player.position.x += speed;
    }

    player.position.x =
      THREE.MathUtils.clamp(
        player.position.x,
        -55,
        55
      );

    player.position.z =
      THREE.MathUtils.clamp(
        player.position.z,
        -55,
        55
      );


    /* CAMERA FOLLOW */

    const targetCamera =
      new THREE.Vector3(
        player.position.x + 18,
        18,
        player.position.z + 23
      );

    camera.position.lerp(
      targetCamera,
      0.06
    );

    camera.lookAt(
      player.position.x,
      0,
      player.position.z
    );
  }

  renderer.render(
    scene,
    camera
  );
}


/* =========================
   RESIZE
========================= */

function onResize() {

  if (!camera || !renderer) {
    return;
  }

  camera.aspect =
    window.innerWidth /
    window.innerHeight;

  camera.updateProjectionMatrix();

  renderer.setSize(
    window.innerWidth,
    window.innerHeight
  );
}


/* =========================
   BUILDING CLICK
========================= */

const raycaster =
  new THREE.Raycaster();

const pointer =
  new THREE.Vector2();

function handleCityClick(event) {

  if (!renderer || !camera) {
    return;
  }

  const rect =
    renderer.domElement.getBoundingClientRect();

  pointer.x =
    ((event.clientX - rect.left) / rect.width) * 2 - 1;

  pointer.y =
    -((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(
    pointer,
    camera
  );

  const hits =
    raycaster.intersectObjects(
      buildings,
      false
    );

  if (!hits.length) {
    return;
  }

  const building =
    hits[0].object;

  showBuilding(
    building.userData.type
  );
}


/* =========================
   BUILDING PANELS
========================= */

function showBuilding(type) {

  if (type === "hq") {
    showHQ();
    return;
  }

  if (type === "bank") {
    showBank();
    return;
  }

  if (type === "intel") {
    showIntelligence();
    return;
  }

  if (type === "market") {
    showMarket();
    return;
  }
}


/* =========================
   HQ
========================= */

function showHQ() {

  const fa =
    state.language === "fa";

  openModal(
    fa ? "🏢 مرکز فرماندهی" : "🏢 Headquarters",

    fa
      ? `
        <p>مرکز فرماندهی شهر تحت کنترل توست.</p>
        <button class="modal-option" id="start-operation">
          🎯 شروع عملیات
        </button>
      `
      : `
        <p>The headquarters is under your control.</p>
        <button class="modal-option" id="start-operation">
          🎯 Start Operation
        </button>
      `
  );

  document
    .getElementById("start-operation")
    ?.addEventListener(
      "click",
      startOperation
    );
}


/* =========================
   OPERATION
========================= */

function startOperation() {

  const fa =
    state.language === "fa";

  if (state.energy < 10) {
    openModal(
      fa ? "انرژی کافی نیست" : "Not enough energy",
      `<p>${translations[state.language].noEnergy}</p>`
    );
    return;
  }

  if (state.nex < 500) {
    openModal(
      fa ? "NEX کافی نیست" : "Not enough NEX",
      `<p>${translations[state.language].noNex}</p>`
    );
    return;
  }

  state.energy -= 10;
  state.nex -= 500;

  const success =
    Math.random() < 0.85;

  if (success) {

    state.nex += 1500;
    state.xp += 50;

    checkLevel();

    saveState();
    updateHUD();

    openModal(
      fa ? "✅ عملیات موفق" : "✅ Operation Successful",
      fa
        ? `
          <p>عملیات با موفقیت انجام شد.</p>
          <p>پاداش: <b>+1500 NEX</b></p>
          <p>XP: <b>+50</b></p>
        `
        : `
          <p>The operation was successful.</p>
          <p>Reward: <b>+1500 NEX</b></p>
          <p>XP: <b>+50</b></p>
        `
    );

  } else {

    state.xp += 15;

    saveState();
    updateHUD();

    openModal(
      fa ? "❌ عملیات شکست خورد" : "❌ Operation Failed",
      fa
        ? `<p>اطلاعات لو رفت و عملیات نیمه‌کاره ماند.</p>`
        : `<p>The operation failed and had to be aborted.</p>`
    );
  }
}


/* =========================
   INTELLIGENCE
========================= */

function showIntelligence() {

  const fa =
    state.language === "fa";

  openModal(
    fa ? "🕵️ مرکز اطلاعات" : "🕵️ Intelligence Center",

    fa
      ? `
        <p><b>پرونده: بخش ۷</b></p>
        <p>یک فرد ناشناس نیمه‌شب وارد منطقه ممنوعه شده است.</p>
        <p>تصمیم تو چیست؟</p>

        <button class="modal-option" id="choice1">
          👤 تعقیب فرد ناشناس
        </button>

        <button class="modal-option" id="choice2">
          📹 بررسی دوربین‌ها
        </button>

        <button class="modal-option" id="choice3">
          🕶️ اعزام مأمور مخفی
        </button>
      `
      : `
        <p><b>Case: Sector 7</b></p>
        <p>An unknown person entered the restricted sector at midnight.</p>
        <p>What do you do?</p>

        <button class="modal-option" id="choice1">
          👤 Follow the stranger
        </button>

        <button class="modal-option" id="choice2">
          📹 Check the cameras
        </button>

        <button class="modal-option" id="choice3">
          🕶️ Send a covert agent
        </button>
      `
  );

  document
    .getElementById("choice1")
    ?.addEventListener(
      "click",
      () => resolveMission(0.75)
    );

  document
    .getElementById("choice2")
    ?.addEventListener(
      "click",
      () => resolveMission(0.90)
    );

  document
    .getElementById("choice3")
    ?.addEventListener(
      "click",
      () => resolveMission(0.95)
    );
}


function resolveMission(chance) {

  const fa =
    state.language === "fa";

  const success =
    Math.random() < chance;

  if (success) {

    state.nex += 2000;
    state.xp += 100;
    state.cityValue += 500;

    checkLevel();
    saveState();
    updateHUD();

    openModal(
      fa ? "🎯 پرونده حل شد" : "🎯 Case Solved",

      fa
        ? `
          <p>رد فرد ناشناس را پیدا کردی.</p>
          <p>پاداش: <b>+2000 NEX</b></p>
          <p>XP: <b>+100</b></p>
        `
        : `
          <p>You successfully solved the case.</p>
          <p>Reward: <b>+2000 NEX</b></p>
          <p>XP: <b>+100</b></p>
        `
    );

  } else {

    state.xp += 25;

    saveState();
    updateHUD();

    openModal(
      fa ? "⚠️ سرنخ از دست رفت" : "⚠️ Lead Lost",

      fa
        ? `<p>رد فرد ناشناس را گم کردی، اما اطلاعات جدیدی به دست آمد.</p>`
        : `<p>The target escaped, but you gained new intelligence.</p>`
    );
  }
}


/* =========================
   BANK
========================= */

function showBank() {

  const fa =
    state.language === "fa";

  openModal(
    fa ? "🏦 بانک شهر" : "🏦 City Bank",

    fa
      ? `
        <p>دارایی فعلی شهروند:</p>
        <h2>${state.nex.toLocaleString()} NEX</h2>
        <p>سیستم مالی پیشرفته در مراحل بعدی فعال می‌شود.</p>
      `
      : `
        <p>Your current balance:</p>
        <h2>${state.nex.toLocaleString()} NEX</h2>
        <p>Advanced financial systems will be unlocked later.</p>
      `
  );
}


/* =========================
   MARKET
========================= */

function showMarket() {

  const fa =
    state.language === "fa";

  openModal(
    fa ? "🛒 بازار شهر" : "🛒 City Market",

    fa
      ? `
        <p>آیتم‌های قابل خرید:</p>

        <button class="modal-option" id="energy-pack">
          ⚡ بسته انرژی +25 | 750 NEX
        </button>

        <button class="modal-option" id="intel-pass">
          🕵️ کارت اطلاعات | 2500 NEX
        </button>
      `
      : `
        <p>Available items:</p>

        <button class="modal-option" id="energy-pack">
          ⚡ Energy +25 | 750 NEX
        </button>

        <button class="modal-option" id="intel-pass">
          🕵️ Intelligence Pass | 2500 NEX
        </button>
      `
  );

  document
    .getElementById("energy-pack")
    ?.addEventListener(
      "click",
      buyEnergy
    );

  document
    .getElementById("intel-pass")
    ?.addEventListener(
      "click",
      buyIntelPass
    );
}


function buyEnergy() {

  const fa =
    state.language === "fa";

  if (state.nex < 750) {

    openModal(
      fa ? "NEX کافی نیست" : "Not enough NEX",
      `<p>${translations[state.language].noNex}</p>`
    );

    return;
  }

  state.nex -= 750;
  state.energy = Math.min(
    100,
    state.energy + 25
  );

  saveState();
  updateHUD();

  openModal(
    fa ? "⚡ خرید موفق" : "⚡ Purchase Complete",
    fa
      ? "<p>۲۵ واحد انرژی دریافت کردی.</p>"
      : "<p>You received 25 energy.</p>"
  );
}


function buyIntelPass() {

  const fa =
    state.language === "fa";

  if (state.nex < 2500) {

    openModal(
      fa ? "NEX کافی نیست" : "Not enough NEX",
      `<p>${translations[state.language].noNex}</p>`
    );

    return;
  }

  state.nex -= 2500;

  saveState();
  updateHUD();

  openModal(
    fa ? "🕵️ خرید موفق" : "🕵️ Purchase Complete",
    fa
      ? "<p>کارت اطلاعات فعال شد.</p>"
      : "<p>Intelligence Pass activated.</p>"
  );
}


/* =========================
   LEVEL
========================= */

function checkLevel() {

  const required =
    state.level * 500;

  if (state.xp >= required) {

    state.xp -= required;
    state.level += 1;

    const fa =
      state.language === "fa";

    setTimeout(() => {

      openModal(
        fa ? "🎉 ارتقای سطح" : "🎉 Level Up",

        fa
          ? `<p>تبریک! سطح تو به <b>${state.level}</b> رسید.</p>`
          : `<p>Congratulations! You reached level <b>${state.level}</b>.</p>`
      );

    }, 100);
  }
}


/* =========================
   BOTTOM NAVIGATION
========================= */

document
  .querySelectorAll(".nav-button")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        document
          .querySelectorAll(".nav-button")
          .forEach(btn =>
            btn.classList.remove("active")
          );

        button.classList.add("active");

        const page =
          button.dataset.page;

        if (page === "operations") {
          showHQ();
        }

        if (page === "missions") {
          showIntelligence();
        }

        if (page === "market") {
          showMarket();
        }

        if (page === "ranking") {
          showRanking();
        }

        if (page === "profile") {
          showProfile();
        }

      }
    );

  });


/* =========================
   RANKING
========================= */

function showRanking() {

  const fa =
    state.language === "fa";

  openModal(
    fa ? "🏆 رتبه‌بندی" : "🏆 Ranking",

    fa
      ? `
        <p>رتبه فعلی تو:</p>
        <h2>Agent #001</h2>
        <p>سیستم رتبه‌بندی آنلاین در مرحله بعد فعال می‌شود.</p>
      `
      : `
        <p>Your current rank:</p>
        <h2>Agent #001</h2>
        <p>Online ranking will be activated later.</p>
      `
  );
}


/* =========================
   PROFILE
========================= */

function showProfile() {

  const fa =
    state.language === "fa";

  openModal(
    fa ? "👤 پروفایل" : "👤 Profile",

    fa
      ? `
        <p>سطح: <b>${state.level}</b></p>
        <p>XP: <b>${state.xp}</b></p>
        <p>NEX: <b>${state.nex.toLocaleString()}</b></p>
        <p>ارزش شهر: <b>${state.cityValue.toLocaleString()}</b></p>

        <button class="modal-option" id="change-language">
          🌐 تغییر زبان
        </button>
      `
      : `
        <p>Level: <b>${state.level}</b></p>
        <p>XP: <b>${state.xp}</b></p>
        <p>NEX: <b>${state.nex.toLocaleString()}</b></p>
        <p>City Value: <b>${state.cityValue.toLocaleString()}</b></p>

        <button class="modal-option" id="change-language">
          🌐 Change Language
        </button>
      `
  );

  document
    .getElementById("change-language")
    ?.addEventListener(
      "click",
      () => {

        closeModal();

        languageScreen.style.display =
          "flex";

      }
    );
}


/* =========================
   START
========================= */

function startGame() {

  try {

    updateHUD();

    if (state.language) {

      setLanguage(
        state.language
      );

    } else {

      languageScreen.style.display =
        "flex";

      gameContainer.classList.remove(
        "active"
      );

    }

  } catch (error) {

    console.error(
      "NEXUS START ERROR:",
      error
    );

    languageScreen.style.display =
      "flex";

    gameContainer.classList.remove(
      "active"
    );
  }
}


/* =========================
   START AFTER DOM
========================= */

if (
  document.readyState === "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    startGame
  );

} else {

  startGame();

}
