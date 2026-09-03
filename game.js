// ==========================================
// NEXUS | SECRET CITY
// Stable Game Engine V2
// ==========================================

let THREE = null;

let scene = null;
let camera = null;
let renderer = null;
let player = null;
let clock = null;

const tg = window.Telegram?.WebApp || null;

if (tg) {
  try {
    tg.ready();
    tg.expand();
  } catch (e) {
    console.warn("Telegram WebApp error:", e);
  }
}

// ==========================================
// TRANSLATIONS
// ==========================================

const TEXT = {
  fa: {
    nex: "NEX",
    energy: "انرژی",
    level: "سطح",
    city: "ارزش شهر",

    operations: "عملیات",
    missions: "ماموریت‌ها",
    market: "بازار",
    ranking: "رتبه‌بندی",
    profile: "پروفایل",

    hq: "مرکز فرماندهی",
    bank: "بانک",
    intelligence: "مرکز اطلاعات",
    marketBuilding: "بازار",

    enter: "ورود",
    close: "بستن",

    operation: "عملیات",
    startOperation: "شروع عملیات",
    operationDescription:
      "هر عملیات انرژی و ریسک مخصوص خودش را دارد. با موفقیت، NEX و XP دریافت می‌کنی.",

    success: "عملیات موفق بود!",
    failed: "عملیات شکست خورد!",
    reward: "پاداش",
    xp: "XP",
    cost: "هزینه",
    risk: "ریسک",
    energyCost: "هزینه انرژی",
    notEnoughEnergy: "انرژی کافی نداری.",
    notEnoughNex: "NEX کافی نداری.",

    missionsTitle: "ماموریت‌های شهر",
    missionsDescription:
      "ماموریت‌ها را انجام بده و پاداش بگیر.",

    missionOperation: "ماموریت عملیات",
    missionOperationDesc:
      "۳ عملیات موفق انجام بده.",
    missionEarn: "ماموریت سرمایه",
    missionEarnDesc:
      "۵۰۰۰ NEX به دست بیاور.",
    missionMove: "ماموریت گشت شهری",
    missionMoveDesc:
      "۱۰ بار در شهر حرکت کن.",

    progress: "پیشرفت",
    claim: "دریافت پاداش",
    claimed: "دریافت شد",
    incomplete: "هنوز کامل نشده.",

    marketTitle: "بازار NEXUS",
    marketDescription:
      "تجهیزات و امکانات شهر را خریداری کن.",

    energyPack: "ذخیره انرژی",
    energyPackDesc:
      "۳۰ واحد انرژی به ذخیره تو اضافه می‌کند.",
    cityUpgrade: "ارتقای شهر",
    cityUpgradeDesc:
      "ارزش شهر را افزایش می‌دهد.",
    intelligenceBoost: "تقویت اطلاعات",
    intelligenceBoostDesc:
      "شانس موفقیت عملیات را افزایش می‌دهد.",

    buy: "خرید",

    bankTitle: "بانک NEXUS",
    bankDescription:
      "مدیریت سرمایه و دارایی‌های شهر.",

    walletBalance: "موجودی NEX",
    cityCapital: "سرمایه شهر",
    depositInfo:
      "بانک فعلاً سیستم داخلی بازی است. سیستم خرید NEX بعداً به کیف پول TON متصل می‌شود.",

    intelligenceTitle: "مرکز اطلاعات",
    intelligenceDescription:
      "اطلاعات محرمانه، تحلیل شهر و عملیات ویژه در این بخش مدیریت می‌شود.",

    rankingTitle: "رتبه‌بندی",
    rankingDescription:
      "رتبه‌بندی آنلاین بازیکنان بعد از اتصال سرور فعال می‌شود.",

    profileTitle: "پروفایل",
    player: "بازیکن",
    statistics: "آمار",
    operationsCompleted: "عملیات موفق",
    missionsCompleted: "ماموریت کامل‌شده",
    moves: "حرکت‌ها",
    items: "تجهیزات",

    levelUp: "افزایش سطح!",
    congratulations:
      "تبریک! سطح تو افزایش پیدا کرد.",

    cityEvent: "رویداد شهر",
    eventBonus:
      "شهر امروز یک پاداش ویژه دریافت کرد!",
    eventEnergy:
      "ذخیره انرژی شهر افزایش یافت.",

    threeError:
      "موتور سه‌بعدی بارگذاری نشد. لطفاً صفحه را دوباره باز کن."
  },

  en: {
    nex: "NEX",
    energy: "Energy",
    level: "Level",
    city: "City Value",

    operations: "Operations",
    missions: "Missions",
    market: "Market",
    ranking: "Ranking",
    profile: "Profile",

    hq: "Headquarters",
    bank: "Bank",
    intelligence: "Intelligence Center",
    marketBuilding: "Market",

    enter: "Enter",
    close: "Close",

    operation: "Operation",
    startOperation: "Start Operation",
    operationDescription:
      "Each operation has its own energy cost and risk. Successful operations reward NEX and XP.",

    success: "Operation successful!",
    failed: "Operation failed!",
    reward: "Reward",
    xp: "XP",
    cost: "Cost",
    risk: "Risk",
    energyCost: "Energy cost",
    notEnoughEnergy: "You don't have enough energy.",
    notEnoughNex: "You don't have enough NEX.",

    missionsTitle: "City Missions",
    missionsDescription:
      "Complete missions and collect rewards.",

    missionOperation: "Operation Mission",
    missionOperationDesc:
      "Complete 3 successful operations.",
    missionEarn: "Capital Mission",
    missionEarnDesc:
      "Earn 5,000 NEX.",
    missionMove: "City Patrol",
    missionMoveDesc:
      "Move around the city 10 times.",

    progress: "Progress",
    claim: "Claim Reward",
    claimed: "Claimed",
    incomplete: "Not completed yet.",

    marketTitle: "NEXUS Market",
    marketDescription:
      "Purchase equipment and city upgrades.",

    energyPack: "Energy Reserve",
    energyPackDesc:
      "Adds 30 energy to your reserve.",
    cityUpgrade: "City Upgrade",
    cityUpgradeDesc:
      "Increases city value.",
    intelligenceBoost: "Intelligence Boost",
    intelligenceBoostDesc:
      "Increases operation success chance.",

    buy: "Buy",

    bankTitle: "NEXUS Bank",
    bankDescription:
      "Manage city capital and assets.",

    walletBalance: "NEX Balance",
    cityCapital: "City Capital",
    depositInfo:
      "The bank is currently an in-game system. TON wallet purchases will be connected later.",

    intelligenceTitle: "Intelligence Center",
    intelligenceDescription:
      "Classified intelligence, city analysis and special operations are managed here.",

    rankingTitle: "Ranking",
    rankingDescription:
      "Online player rankings will become active after server integration.",

    profileTitle: "Profile",
    player: "Player",
    statistics: "Statistics",
    operationsCompleted: "Successful Operations",
    missionsCompleted: "Completed Missions",
    moves: "Moves",
    items: "Equipment",

    levelUp: "Level Up!",
    congratulations:
      "Congratulations! Your level increased.",

    cityEvent: "City Event",
    eventBonus:
      "The city received a special bonus today!",
    eventEnergy:
      "The city's energy reserve increased.",

    threeError:
      "The 3D engine could not be loaded. Please reopen the page."
  }
};

// ==========================================
// PLAYER STATE
// ==========================================

const DEFAULT_STATE = {
  language:
    localStorage.getItem("NEXUS_LANGUAGE") || null,

  nex: 10000,
  energy: 100,

  xp: 0,
  level: 1,

  cityValue: 100000,

  playerX: 0,
  playerZ: 0,

  successfulOperations: 0,
  totalOperations: 0,

  completedMissions: 0,

  moves: 0,

  missionOperation: 0,
  missionEarnStart: 10000,
  missionMove: 0,

  claimedMissions: {},

  items: {
    energyPack: 0,
    cityUpgrade: 0,
    intelligenceBoost: 0
  },

  eventDate: ""
};

let state = loadState();

function loadState() {
  try {
    const saved =
      JSON.parse(
        localStorage.getItem("NEXUS_STATE")
      );

    if (saved) {
      return {
        ...DEFAULT_STATE,
        ...saved,
        items: {
          ...DEFAULT_STATE.items,
          ...(saved.items || {})
        },
        claimedMissions:
          saved.claimedMissions || {}
      };
    }
  } catch (error) {
    console.warn(
      "State load error:",
      error
    );
  }

  return {
    ...DEFAULT_STATE,
    items: {
      ...DEFAULT_STATE.items
    },
    claimedMissions: {}
  };
}

function saveState() {
  try {
    localStorage.setItem(
      "NEXUS_STATE",
      JSON.stringify(state)
    );

    if (state.language) {
      localStorage.setItem(
        "NEXUS_LANGUAGE",
        state.language
      );
    }
  } catch (error) {
    console.warn(
      "State save error:",
      error
    );
  }
}

// ==========================================
// DOM
// ==========================================

const languageScreen =
  document.getElementById(
    "language-screen"
  );

const gameContainer =
  document.getElementById(
    "game-container"
  );

const faButton =
  document.getElementById(
    "fa-button"
  );

const enButton =
  document.getElementById(
    "en-button"
  );

const cityElement =
  document.getElementById(
    "city"
  );

const modal =
  document.getElementById(
    "modal"
  );

const modalTitle =
  document.getElementById(
    "modal-title"
  );

const modalContent =
  document.getElementById(
    "modal-content"
  );

const modalClose =
  document.getElementById(
    "modal-close"
  );

// ==========================================
// TRANSLATION
// ==========================================

function t(key) {
  const lang =
    state.language || "fa";

  return (
    TEXT[lang]?.[key] ??
    TEXT.fa[key] ??
    key
  );
}

// ==========================================
// LANGUAGE
// ==========================================

function setLanguage(language) {
  if (
    language !== "fa" &&
    language !== "en"
  ) {
    language = "fa";
  }

  state.language = language;

  document.documentElement.lang =
    language;

  document.documentElement.dir =
    language === "fa"
      ? "rtl"
      : "ltr";

  saveState();

  if (languageScreen) {
    languageScreen.style.display =
      "none";
  }

  if (gameContainer) {
    gameContainer.style.display =
      "block";

    gameContainer.classList.add(
      "active"
    );
  }

  updateInterface();
  updateHUD();

  start3D();

  console.log(
    "NEXUS LANGUAGE:",
    language
  );
}

if (faButton) {
  faButton.addEventListener(
    "click",
    function () {
      setLanguage("fa");
    }
  );
}

if (enButton) {
  enButton.addEventListener(
    "click",
    function () {
      setLanguage("en");
    }
  );
}

// ==========================================
// INTERFACE
// ==========================================

function updateInterface() {
  const elements = {
    "nex-label": "nex",
    "energy-label": "energy",
    "level-label": "level",
    "city-value-label": "city",

    "nav-operations": "operations",
    "nav-missions": "missions",
    "nav-market": "market",
    "nav-ranking": "ranking",
    "nav-profile": "profile"
  };

  Object.keys(elements).forEach(
    function (id) {
      const element =
        document.getElementById(id);

      if (element) {
        element.textContent =
          t(elements[id]);
      }
    }
  );
}

// ==========================================
// HUD
// ==========================================

function updateHUD() {
  const nex =
    document.getElementById(
      "nex-value"
    );

  const energy =
    document.getElementById(
      "energy-value"
    );

  const level =
    document.getElementById(
      "level-value"
    );

  const city =
    document.getElementById(
      "city-value"
    );

  if (nex) {
    nex.textContent =
      formatNumber(state.nex);
  }

  if (energy) {
    energy.textContent =
      Math.max(
        0,
        Math.floor(state.energy)
      );
  }

  if (level) {
    level.textContent =
      state.level;
  }

  if (city) {
    city.textContent =
      formatNumber(
        state.cityValue
      );
  }
}

function formatNumber(value) {
  return Number(
    value || 0
  ).toLocaleString(
    state.language === "en"
      ? "en-US"
      : "fa-IR"
  );
}

// ==========================================
// MODAL
// ==========================================

function openModal(
  title,
  content
) {
  if (!modal) return;

  if (modalTitle) {
    modalTitle.textContent =
      title;
  }

  if (modalContent) {
    modalContent.innerHTML =
      content;
  }

  modal.classList.add(
    "active"
  );
}

function closeModal() {
  if (modal) {
    modal.classList.remove(
      "active"
    );
  }
}

if (modalClose) {
  modalClose.addEventListener(
    "click",
    closeModal
  );
}

// ==========================================
// ACTION PANEL
// ==========================================

function showAction(
  title,
  description,
  buttonText,
  callback
) {
  const panel =
    document.getElementById(
      "action-panel"
    );

  const titleElement =
    document.getElementById(
      "action-title"
    );

  const descriptionElement =
    document.getElementById(
      "action-description"
    );

  const button =
    document.getElementById(
      "action-button"
    );

  if (!panel) return;

  if (titleElement) {
    titleElement.textContent =
      title;
  }

  if (descriptionElement) {
    descriptionElement.textContent =
      description;
  }

  if (button) {
    button.textContent =
      buttonText;

    button.onclick =
      callback;
  }

  panel.classList.add(
    "active"
  );
}

function hideAction() {
  const panel =
    document.getElementById(
      "action-panel"
    );

  if (panel) {
    panel.classList.remove(
      "active"
    );
  }
}

// ==========================================
// THREE.JS
// ==========================================

async function start3D() {
  if (scene) return;

  try {
    if (!THREE) {
      THREE =
        await import(
          "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js"
        );
    }

    createCity();

  } catch (error) {
    console.error(
      "THREE.JS ERROR:",
      error
    );

    openModal(
      state.language === "en"
        ? "3D Error"
        : "خطای سه‌بعدی",
      `<p>${t("threeError")}</p>`
    );
  }
}

// ==========================================
// CREATE CITY
// ==========================================

function createCity() {
  if (!THREE || !cityElement) {
    return;
  }

  cityElement.innerHTML = "";

  scene =
    new THREE.Scene();

  scene.background =
    new THREE.Color(
      0x05070d
    );

  scene.fog =
    new THREE.Fog(
      0x05070d,
      35,
      180
    );

  camera =
    new THREE.PerspectiveCamera(
      55,
      Math.max(
        cityElement.clientWidth,
        1
      ) /
        Math.max(
          cityElement.clientHeight,
          1
        ),
      0.1,
      500
    );

  camera.position.set(
    0,
    16,
    28
  );

  camera.lookAt(
    0,
    0,
    0
  );

  renderer =
    new THREE.WebGLRenderer({
      antialias: true
    });

  renderer.setPixelRatio(
    Math.min(
      window.devicePixelRatio || 1,
      2
    )
  );

  renderer.setSize(
    cityElement.clientWidth,
    cityElement.clientHeight
  );

  cityElement.appendChild(
    renderer.domElement
  );

  clock =
    new THREE.Clock();

  const ambient =
    new THREE.AmbientLight(
      0x8899bb,
      2
    );

  scene.add(
    ambient
  );

  const moon =
    new THREE.DirectionalLight(
      0x9fb6ff,
      2.5
    );

  moon.position.set(
    30,
    50,
    20
  );

  scene.add(
    moon
  );

  const ground =
    new THREE.Mesh(
      new THREE.PlaneGeometry(
        220,
        220
      ),
      new THREE.MeshStandardMaterial(
        {
          color: 0x10151d,
          roughness: 0.9
        }
      )
    );

  ground.rotation.x =
    -Math.PI / 2;

  scene.add(
    ground
  );

  createRoads();
  createBuildings();
  createPlayer();

  window.addEventListener(
    "resize",
    resizeCity
  );

  animate();

  checkDailyEvent();

  console.log(
    "NEXUS 3D CITY READY"
  );
}

// ==========================================
// ROADS
// ==========================================

function createRoads() {
  const roadMaterial =
    new THREE.MeshStandardMaterial(
      {
        color: 0x181c23,
        roughness: 0.9
      }
    );

  const horizontal =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        220,
        0.15,
        12
      ),
      roadMaterial
    );

  horizontal.position.y =
    0.05;

  scene.add(
    horizontal
  );

  const vertical =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        12,
        0.16,
        220
      ),
      roadMaterial
    );

  vertical.position.y =
    0.06;

  scene.add(
    vertical
  );
}

// ==========================================
// BUILDINGS
// ==========================================

function createBuildings() {
  createBuilding(
    "hq",
    -22,
    -18,
    10,
    24
  );

  createBuilding(
    "bank",
    22,
    -18,
    9,
    19
  );

  createBuilding(
    "intelligence",
    -22,
    18,
    9,
    21
  );

  createBuilding(
    "marketBuilding",
    22,
    18,
    10,
    16
  );

  createBuilding(
    "extra1",
    -43,
    -40,
    8,
    15
  );

  createBuilding(
    "extra2",
    43,
    -40,
    8,
    18
  );

  createBuilding(
    "extra3",
    -43,
    40,
    8,
    13
  );

  createBuilding(
    "extra4",
    43,
    40,
    8,
    17
  );
}

function createBuilding(
  type,
  x,
  z,
  width,
  height
) {
  const building =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        width,
        height,
        width
      ),
      new THREE.MeshStandardMaterial(
        {
          color:
            getBuildingColor(
              type
            ),
          roughness: 0.7,
          metalness: 0.15
        }
      )
    );

  building.position.set(
    x,
    height / 2,
    z
  );

  building.userData.type =
    type;

  scene.add(
    building
  );

  addBuildingWindows(
    x,
    z,
    width,
    height
  );
}

function getBuildingColor(
  type
) {
  if (type === "hq") {
    return 0x294c85;
  }

  if (type === "bank") {
    return 0x40515f;
  }

  if (
    type ===
    "intelligence"
  ) {
    return 0x513a66;
  }

  if (
    type ===
    "marketBuilding"
  ) {
    return 0x70572f;
  }

  return 0x29333d;
}

function addBuildingWindows(
  x,
  z,
  width,
  height
) {
  const material =
    new THREE.MeshBasicMaterial(
      {
        color: 0xffd36a
      }
    );

  const rows =
    Math.max(
      2,
      Math.floor(
        height / 4
      )
    );

  const cols =
    Math.max(
      2,
      Math.floor(
        width / 2
      )
    );

  for (
    let r = 0;
    r < rows;
    r++
  ) {
    for (
      let c = 0;
      c < cols;
      c++
    ) {
      if (
        Math.random() >
        0.7
      ) {
        continue;
      }

      const window =
        new THREE.Mesh(
          new THREE.BoxGeometry(
            0.45,
            0.7,
            0.08
          ),
          material
        );

      window.position.set(
        x -
          width / 2 +
          1 +
          c * 1.5,

        2 +
          r * 3,

        z -
          width / 2 -
          0.06
      );

      scene.add(
        window
      );
    }
  }
}

// ==========================================
// PLAYER
// ==========================================

function createPlayer() {
  player =
    new THREE.Group();

  const body =
    new THREE.Mesh(
      new THREE.CapsuleGeometry(
        0.55,
        1.3,
        4,
        8
      ),
      new THREE.MeshStandardMaterial(
        {
          color: 0x42a5ff
        }
      )
    );

  body.position.y =
    1.25;

  player.add(
    body
  );

  const head =
    new THREE.Mesh(
      new THREE.SphereGeometry(
        0.42,
        16,
        16
      ),
      new THREE.MeshStandardMaterial(
        {
          color: 0xe0b28c
        }
      )
    );

  head.position.y =
    2.25;

  player.add(
    head
  );

  player.position.set(
    state.playerX || 0,
    0,
    state.playerZ || 0
  );

  scene.add(
    player
  );
}

// ==========================================
// MOVEMENT
// ==========================================

document
  .querySelectorAll(
    ".move-button"
  )
  .forEach(
    function (button) {
      button.addEventListener(
        "click",
        function () {
          movePlayer(
            button.dataset.direction
          );
        }
      );
    }
  );

function movePlayer(
  direction
) {
  if (!player) {
    return;
  }

  const speed = 2;

  if (direction === "up") {
    player.position.z -= speed;
  }

  if (direction === "down") {
    player.position.z += speed;
  }

  if (direction === "left") {
    player.position.x -= speed;
  }

  if (direction === "right") {
    player.position.x += speed;
  }

  state.playerX =
    player.position.x;

  state.playerZ =
    player.position.z;

  state.moves += 1;
  state.missionMove += 1;

  saveState();

  updateHUD();

  updateCamera();

  checkMissionProgress();
}

function updateCamera() {
  if (!camera || !player) {
    return;
  }

  camera.position.x =
    player.position.x;

  camera.position.z =
    player.position.z + 28;

  camera.lookAt(
    player.position.x,
    0,
    player.position.z
  );
}

// ==========================================
// CITY CLICK
// ==========================================

function cityClick(event) {
  if (
    !THREE ||
    !renderer ||
    !camera ||
    !scene
  ) {
    return;
  }

  const rect =
    renderer.domElement.getBoundingClientRect();

  const mouse =
    new THREE.Vector2();

  mouse.x =
    ((event.clientX - rect.left) /
      rect.width) *
      2 -
    1;

  mouse.y =
    -(
      (event.clientY - rect.top) /
      rect.height
    ) *
      2 +
    1;

  const raycaster =
    new THREE.Raycaster();

  raycaster.setFromCamera(
    mouse,
    camera
  );

  const objects =
    scene.children.filter(
      function (object) {
        return (
          object.isMesh &&
          object.userData &&
          object.userData.type
        );
      }
    );

  const hits =
    raycaster.intersectObjects(
      objects
    );

  if (!hits.length) {
    return;
  }

  openBuilding(
    hits[0].object.userData.type
  );
}

if (cityElement) {
  cityElement.addEventListener(
    "click",
    cityClick
  );
}

// ==========================================
// BUILDING ACTIONS
// ==========================================

function openBuilding(type) {
  if (type === "hq") {
    openHQ();
    return;
  }

  if (type === "bank") {
    openBank();
    return;
  }

  if (type === "intelligence") {
    openIntelligence();
    return;
  }

  if (type === "marketBuilding") {
    openMarket();
    return;
  }
}

// ==========================================
// OPERATIONS
// ==========================================

const OPERATIONS = [
  {
    id: "scout",
    nameFa: "شناسایی منطقه",
    nameEn: "Area Recon",
    energy: 10,
    minReward: 300,
    maxReward: 700,
    xp: 15,
    risk: 15
  },
  {
    id: "infiltration",
    nameFa: "نفوذ اطلاعاتی",
    nameEn: "Intel Infiltration",
    energy: 18,
    minReward: 700,
    maxReward: 1500,
    xp: 30,
    risk: 30
  },
  {
    id: "blackout",
    nameFa: "عملیات خاموشی",
    nameEn: "Blackout Operation",
    energy: 30,
    minReward: 1500,
    maxReward: 3500,
    xp: 55,
    risk: 45
  }
];

function openHQ() {
  const list =
    OPERATIONS.map(
      function (operation) {
        const name =
          state.language === "en"
            ? operation.nameEn
            : operation.nameFa;

        return `
          <div style="
            border:1px solid rgba(255,255,255,.12);
            padding:12px;
            margin:8px 0;
            border-radius:12px;
          ">
            <strong>${name}</strong>

            <p>
              ${t("energyCost")}:
              ${operation.energy}
              |
              ${t("risk")}:
              ${operation.risk}%
            </p>

            <p>
              ${t("reward")}:
              ${formatNumber(operation.minReward)}
              -
              ${formatNumber(operation.maxReward)}
              NEX
            </p>

            <button
              class="primary-button operation-button"
              data-operation="${operation.id}"
            >
              ${t("startOperation")}
            </button>
          </div>
        `;
      }
    ).join("");

  openModal(
    t("operations"),
    `
      <p>${t("operationDescription")}</p>
      ${list}
    `
  );

  document
    .querySelectorAll(
      ".operation-button"
    )
    .forEach(
      function (button) {
        button.addEventListener(
          "click",
          function () {
            runOperation(
              button.dataset.operation
            );
          }
        );
      }
    );
}

function runOperation(
  operationId
) {
  const operation =
    OPERATIONS.find(
      function (item) {
        return (
          item.id ===
          operationId
        );
      }
    );

  if (!operation) return;

  if (
    state.energy <
    operation.energy
  ) {
    openModal(
      t("operation"),
      `<p>${t(
        "notEnoughEnergy"
      )}</p>`
    );

    return;
  }

  state.energy -=
    operation.energy;

  state.totalOperations +=
    1;

  let successChance =
    100 -
    operation.risk;

  successChance +=
    state.items
      .intelligenceBoost *
      5;

  successChance =
    Math.min(
      95,
      successChance
    );

  const roll =
    Math.random() * 100;

  if (
    roll <=
    successChance
  ) {
    const reward =
      Math.floor(
        operation.minReward +
          Math.random() *
            (
              operation.maxReward -
              operation.minReward +
              1
            )
      );

    state.nex +=
      reward;

    state.xp +=
      operation.xp;

    state.successfulOperations +=
      1;

    state.missionOperation +=
      1;

    checkLevel();
    checkMissionProgress();

    saveState();
    updateHUD();

    openModal(
      t("success"),
      `
        <p>
          ${t("reward")}:
          <strong>
            +${formatNumber(
              reward
            )} NEX
          </strong>
        </p>

        <p>
          +${operation.xp}
          XP
        </p>

        <p>
          ${t("risk")}:
          ${operation.risk}%
        </p>
      `
    );

  } else {
    saveState();
    updateHUD();

    openModal(
      t("failed"),
      `
        <p>
          ${
            state.language === "en"
              ? "The operation failed."
              : "عملیات با شکست مواجه شد."
          }
        </p>

        <p>
          ${t("energyCost")}:
          ${operation.energy}
        </p>

        <p>
          ${
            state.language === "en"
              ? "Try a lower-risk operation."
              : "می‌توانی یک عملیات کم‌ریسک‌تر را امتحان کنی."
          }
        </p>
      `
    );
  }
}

// ==========================================
// MISSIONS
// ==========================================

function getMissions() {
  return [
    {
      id: "operation3",
      title:
        t("missionOperation"),
      description:
        t("missionOperationDesc"),
      current:
        Math.min(
          3,
          state.missionOperation
        ),
      target: 3,
      reward: 2000,
      xp: 50
    },

    {
      id: "earn5000",
      title:
        t("missionEarn"),
      description:
        t("missionEarnDesc"),
      current:
        Math.min(
          5000,
          Math.max(
            0,
            state.nex -
              state.missionEarnStart
          )
        ),
      target: 5000,
      reward: 2500,
      xp: 60
    },

    {
      id: "move10",
      title:
        t("missionMove"),
      description:
        t("missionMoveDesc"),
      current:
        Math.min(
          10,
          state.missionMove
        ),
      target: 10,
      reward: 1500,
      xp: 35
    }
  ];
}

function openMissions() {
  const missions =
    getMissions();

  const html =
    missions.map(
      function (mission) {
        const completed =
          mission.current >=
          mission.target;

        const claimed =
          !!state
            .claimedMissions[
              mission.id
            ];

        const percent =
          Math.min(
            100,
            Math.floor(
              (
                mission.current /
                mission.target
              ) *
                100
            )
          );

        let button = "";

        if (claimed) {
          button = `
            <button
              class="primary-button"
              disabled
            >
              ${t("claimed")}
            </button>
          `;
        } else if (completed) {
          button = `
            <button
              class="primary-button mission-claim"
              data-mission="${mission.id}"
            >
              ${t("claim")}
            </button>
          `;
        } else {
          button = `
            <button
              class="primary-button"
              disabled
            >
              ${t("incomplete")}
            </button>
          `;
        }

        return `
          <div style="
            border:1px solid rgba(255,255,255,.12);
            padding:12px;
            margin:8px 0;
            border-radius:12px;
          ">
            <strong>
              ${mission.title}
            </strong>

            <p>
              ${mission.description}
            </p>

            <p>
              ${t("progress")}:
              ${formatNumber(
                mission.current
              )}
              /
              ${formatNumber(
                mission.target
              )}
            </p>

            <div style="
              width:100%;
              height:7px;
              background:rgba(255,255,255,.12);
              border-radius:10px;
              overflow:hidden;
              margin:8px 0;
            ">
              <div style="
                width:${percent}%;
                height:100%;
                background:#4aa3ff;
              "></div>
            </div>

            <p>
              +${formatNumber(
                mission.reward
              )} NEX
              |
              +${mission.xp} XP
            </p>

            ${button}
          </div>
        `;
      }
    ).join("");

  openModal(
    t("missionsTitle"),
    `
      <p>${t("missionsDescription")}</p>
      ${html}
    `
  );

  document
    .querySelectorAll(
      ".mission-claim"
    )
    .forEach(
      function (button) {
        button.addEventListener(
          "click",
          function () {
            claimMission(
              button.dataset.mission
            );
          }
        );
      }
    );
}

function claimMission(
  missionId
) {
  const missions =
    getMissions();

  const mission =
    missions.find(
      function (item) {
        return (
          item.id ===
          missionId
        );
      }
    );

  if (!mission) return;

  if (
    state.claimedMissions[
      missionId
    ]
  ) {
    return;
  }

  if (
    mission.current <
    mission.target
  ) {
    return;
  }

  state.nex +=
    mission.reward;

  state.xp +=
    mission.xp;

  state.claimedMissions[
    missionId
  ] = true;

  state.completedMissions +=
    1;

  checkLevel();

  saveState();
  updateHUD();

  openModal(
    t("claim"),
    `
      <p>
        +${formatNumber(
          mission.reward
        )} NEX
      </p>

      <p>
        +${mission.xp} XP
      </p>
    `
  );
}

function checkMissionProgress() {
  saveState();
}

// ==========================================
// MARKET
// ==========================================

const MARKET_ITEMS = [
  {
    id: "energyPack",
    title: "energyPack",
    price: 1000,
    description: "energyPackDesc"
  },
  {
    id: "cityUpgrade",
    title: "cityUpgrade",
    price: 5000,
    description: "cityUpgradeDesc"
  },
  {
    id: "intelligenceBoost",
    title: "intelligenceBoost",
    price: 7500,
    description: "intelligenceBoostDesc"
  }
];

function openMarket() {
  const html =
    MARKET_ITEMS.map(
      function (item) {
        const title =
          t(item.title);

        const description =
          t(item.description);

        const owned =
          state.items[item.id] ||
          0;

        return `
          <div style="
            border:1px solid rgba(255,255,255,.12);
            padding:12px;
            margin:8px 0;
            border-radius:12px;
          ">
            <strong>
              ${title}
            </strong>

            <p>
              ${description}
            </p>

            <p>
              ${t("cost")}:
              ${formatNumber(
                item.price
              )}
              NEX
            </p>

            <p>
              ${t("items")}:
              ${owned}
            </p>

            <button
              class="primary-button market-buy"
              data-item="${item.id}"
            >
              ${t("buy")}
            </button>
          </div>
        `;
      }
    ).join("");

  openModal(
    t("marketTitle"),
    `
      <p>${t("marketDescription")}</p>
      ${html}
    `
  );

  document
    .querySelectorAll(
      ".market-buy"
    )
    .forEach(
      function (button) {
        button.addEventListener(
          "click",
          function () {
            buyMarketItem(
              button.dataset.item
            );
          }
        );
      }
    );
}

function buyMarketItem(
  itemId
) {
  const item =
    MARKET_ITEMS.find(
      function (product) {
        return (
          product.id ===
          itemId
        );
      }
    );

  if (!item) return;

  if (
    state.nex <
    item.price
  ) {
    openModal(
      t("marketTitle"),
      `<p>${t(
        "notEnoughNex"
      )}</p>`
    );

    return;
  }

  state.nex -=
    item.price;

  state.items[item.id] =
    (state.items[item.id] || 0) +
    1;

  if (
    itemId ===
    "energyPack"
  ) {
    state.energy =
      Math.min(
        100,
        state.energy + 30
      );
  }

  if (
    itemId ===
    "cityUpgrade"
  ) {
    state.cityValue +=
      10000;
  }

  saveState();
  updateHUD();

  openModal(
    t("marketTitle"),
    `
      <p>
        ${
          state.language === "en"
            ? "Purchase completed."
            : "خرید با موفقیت انجام شد."
        }
      </p>

      <p>
        ${t(item.title)}
      </p>
    `
  );
}

// ==========================================
// BANK
// ==========================================

function openBank() {
  openModal(
    t("bankTitle"),
    `
      <p>
        ${t("walletBalance")}:
        <strong>
          ${formatNumber(
            state.nex
          )}
          NEX
        </strong>
      </p>

      <p>
        ${t("cityCapital")}:
        <strong>
          ${formatNumber(
            state.cityValue
          )}
        </strong>
      </p>

      <hr>

      <p>
        ${t("depositInfo")}
      </p>

      <div style="
        border:1px solid rgba(255,255,255,.12);
        padding:12px;
        border-radius:12px;
        margin-top:10px;
      ">
        <strong>
          ${
            state.language === "en"
              ? "City Development"
              : "توسعه شهر"
          }
        </strong>

        <p>
          ${
            state.language === "en"
              ? "Invest 3,000 NEX and increase city value by 7,500."
              : "۳۰۰۰ NEX سرمایه‌گذاری کن و ۷۵۰۰ به ارزش شهر اضافه کن."
          }
        </p>

        <button
          id="city-invest-button"
          class="primary-button"
        >
          ${
            state.language === "en"
              ? "Invest"
              : "سرمایه‌گذاری"
          }
        </button>
      </div>
    `
  );

  const button =
    document.getElementById(
      "city-invest-button"
    );

  if (button) {
    button.addEventListener(
      "click",
      function () {
        if (
          state.nex <
          3000
        ) {
          openModal(
            t("bankTitle"),
            `<p>${t(
              "notEnoughNex"
            )}</p>`
          );

          return;
        }

        state.nex -=
          3000;

        state.cityValue +=
          7500;

        saveState();
        updateHUD();

        openModal(
          t("bankTitle"),
          `
            <p>
              ${
                state.language === "en"
                  ? "Investment completed."
                  : "سرمایه‌گذاری با موفقیت انجام شد."
              }
            </p>
          `
        );
      }
    );
  }
}

// ==========================================
// INTELLIGENCE
// ==========================================

function openIntelligence() {
  const boost =
    state.items
      .intelligenceBoost;

  openModal(
    t("intelligenceTitle"),
    `
      <p>
        ${t("intelligenceDescription")}
      </p>

      <hr>

      <p>
        ${
          state.language === "en"
            ? "Current intelligence level:"
            : "سطح اطلاعات فعلی:"
        }

        <strong>
          ${1 + boost}
        </strong>
      </p>

      <p>
        ${
          state.language === "en"
            ? "Operation bonus:"
            : "پاداش موفقیت عملیات:"
        }

        <strong>
          +${boost * 5}%
        </strong>
      </p>

      <p>
        ${
          state.language === "en"
            ? "Purchase Intelligence Boost from the Market."
            : "تقویت اطلاعات را می‌توانی از بازار خریداری کنی."
        }
      </p>
    `
  );
}

// ==========================================
// RANKING
// ==========================================

function openRanking() {
  openModal(
    t("rankingTitle"),
    `
      <p>
        ${t("rankingDescription")}
      </p>

      <hr>

      <div style="
        border:1px solid rgba(255,255,255,.12);
        padding:12px;
        border-radius:12px;
      ">
        <strong>
          ${
            state.language === "en"
              ? "Your Local Rank"
              : "رتبه فعلی تو"
          }
        </strong>

        <p>
          Level:
          ${state.level}
        </p>

        <p>
          NEX:
          ${formatNumber(
            state.nex
          )}
        </p>

        <p>
          City Value:
          ${formatNumber(
            state.cityValue
          )}
        </p>
      </div>
    `
  );
}

// ==========================================
// PROFILE
// ==========================================

function openProfile() {
  openModal(
    t("profileTitle"),
    `
      <p>
        ${t("player")}:
        <strong>
          ${
            tg?.initDataUnsafe?.user
              ?.first_name ||
            (
              state.language === "en"
                ? "Guest"
                : "مهمان"
            )
          }
        </strong>
      </p>

      <hr>

      <p>
        ${t("level")}:
        <strong>
          ${state.level}
        </strong>
      </p>

      <p>
        XP:
        <strong>
          ${state.xp}
        </strong>
      </p>

      <p>
        ${t("nex")}:
        <strong>
          ${formatNumber(
            state.nex
          )}
        </strong>
      </p>

      <p>
        ${t("energy")}:
        <strong>
          ${state.energy}
        </strong>
      </p>

      <hr>

      <p>
        ${t("operationsCompleted")}:
        <strong>
          ${state.successfulOperations}
        </strong>
      </p>

      <p>
        ${t("missionsCompleted")}:
        <strong>
          ${state.completedMissions}
        </strong>
      </p>

      <p>
        ${t("moves")}:
        <strong>
          ${state.moves}
        </strong>
      </p>

      <p>
        ${t("items")}:
        <strong>
          ${
            Object.values(
              state.items
            ).reduce(
              (a, b) =>
                a + b,
              0
            )
          }
        </strong>
      </p>
    `
  );
}

// ==========================================
// LEVEL
// ==========================================

function checkLevel() {
  let leveledUp = false;

  while (
    state.xp >=
    state.level * 100
  ) {
    state.xp -=
      state.level * 100;

    state.level +=
      1;

    leveledUp = true;
  }

  if (leveledUp) {
    openModal(
      t("levelUp"),
      `
        <p>
          ${t("congratulations")}
        </p>

        <p>
          ${t("level")}:
          <strong>
            ${state.level}
          </strong>
        </p>
      `
    );
  }
}

// ==========================================
// DAILY CITY EVENT
// ==========================================

function getTodayKey() {
  const now =
    new Date();

  return (
    now.getFullYear() +
    "-" +
    String(
      now.getMonth() + 1
    ).padStart(2, "0") +
    "-" +
    String(
      now.getDate()
    ).padStart(2, "0")
  );
}

function checkDailyEvent() {
  const today =
    getTodayKey();

  if (
    state.eventDate ===
    today
  ) {
    return;
  }

  state.eventDate =
    today;

  const bonus =
    Math.floor(
      300 +
        Math.random() * 700
    );

  state.nex +=
    bonus;

  state.energy =
    Math.min(
      100,
      state.energy + 10
    );

  saveState();
  updateHUD();

  setTimeout(
    function () {
      openModal(
        t("cityEvent"),
        `
          <p>
            ${t("eventBonus")}
          </p>

          <p>
            +${formatNumber(
              bonus
            )} NEX
          </p>

          <p>
            +10 ${t("energy")}
          </p>
        `
      );
    },
    700
  );
}

// ==========================================
// NAVIGATION
// ==========================================

document
  .querySelectorAll(
    ".nav-button"
  )
  .forEach(
    function (button) {
      button.addEventListener(
        "click",
        function () {
          openPage(
            button.dataset.page
          );
        }
      );
    }
  );

function openPage(page) {
  hideAction();

  if (
    page ===
    "operations"
  ) {
    openHQ();
    return;
  }

  if (
    page ===
    "missions"
  ) {
    openMissions();
    return;
  }

  if (
    page ===
    "market"
  ) {
    openMarket();
    return;
  }

  if (
    page ===
    "ranking"
  ) {
    openRanking();
    return;
  }

  if (
    page ===
    "profile"
  ) {
    openProfile();
  }
}

// ==========================================
// RESIZE
// ==========================================

function resizeCity() {
  if (
    !renderer ||
    !camera ||
    !cityElement
  ) {
    return;
  }

  const width =
    Math.max(
      cityElement.clientWidth,
      1
    );

  const height =
    Math.max(
      cityElement.clientHeight,
      1
    );

  camera.aspect =
    width / height;

  camera.updateProjectionMatrix();

  renderer.setSize(
    width,
    height
  );
}

// ==========================================
// ANIMATION
// ==========================================

function animate() {
  requestAnimationFrame(
    animate
  );

  if (
    !renderer ||
    !scene ||
    !camera
  ) {
    return;
  }

  if (player) {
    player.rotation.y +=
      0.003;
  }

  renderer.render(
    scene,
    camera
  );
}

// ==========================================
// START
// ==========================================

function startGame() {
  console.log(
    "NEXUS GAME STARTED"
  );

  updateHUD();

  if (state.language) {
    setLanguage(
      state.language
    );
  } else {
    if (languageScreen) {
      languageScreen.style.display =
        "flex";
    }

    if (gameContainer) {
      gameContainer.style.display =
        "none";
    }
  }
}

startGame();
