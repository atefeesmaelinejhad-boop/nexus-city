// ==========================================
// NEXUS | SECRET CITY
// Stable Game Engine
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

    operation: "عملیات",
    startOperation: "شروع عملیات",
    operationDescription:
      "برای انجام عملیات ۱۰ واحد انرژی مصرف می‌شود. در صورت موفقیت NEX و XP دریافت می‌کنی.",

    success: "عملیات موفق بود!",
    reward: "پاداش",
    notEnoughEnergy: "انرژی کافی نداری.",

    missionsSoon:
      "ماموریت‌های شهر به‌زودی فعال می‌شوند.",

    marketSoon:
      "بازار NEXUS در حال آماده‌سازی است.",

    rankingSoon:
      "رتبه‌بندی بازیکنان به‌زودی فعال می‌شود.",

    profile: "پروفایل",

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

    operation: "Operation",
    startOperation: "Start Operation",
    operationDescription:
      "An operation costs 10 energy. A successful operation rewards NEX and XP.",

    success: "Operation successful!",
    reward: "Reward",
    notEnoughEnergy: "You don't have enough energy.",

    missionsSoon:
      "City missions are coming soon.",

    marketSoon:
      "The NEXUS market is being prepared.",

    rankingSoon:
      "Player rankings are coming soon.",

    profile: "Profile",

    threeError:
      "The 3D engine could not be loaded. Please reopen the page."
  }
};

// ==========================================
// PLAYER STATE
// ==========================================

const DEFAULT_STATE = {
  language: localStorage.getItem("NEXUS_LANGUAGE") || null,
  nex: 10000,
  energy: 100,
  xp: 0,
  level: 1,
  cityValue: 100000,
  playerX: 0,
  playerZ: 0
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
        ...saved
      };
    }
  } catch (error) {
    console.warn(
      "State load error:",
      error
    );
  }

  return {
    ...DEFAULT_STATE
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
// LANGUAGE SELECTION
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

// ==========================================
// LANGUAGE BUTTONS
// ==========================================

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

    "nav-operations":
      "operations",

    "nav-missions":
      "missions",

    "nav-market":
      "market",

    "nav-ranking":
      "ranking",

    "nav-profile":
      "profile"
  };

  Object.keys(elements).forEach(
    function (id) {
      const element =
        document.getElementById(
          id
        );

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
// THREE.JS LOADER
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
      `<p>${t(
        "threeError"
      )}</p>`
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

  cityElement.innerHTML =
    "";

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

  // LIGHTS

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

  // GROUND

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
            button.dataset
              .direction
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

  if (
    direction === "up"
  ) {
    player.position.z -=
      speed;
  }

  if (
    direction === "down"
  ) {
    player.position.z +=
      speed;
  }

  if (
    direction === "left"
  ) {
    player.position.x -=
      speed;
  }

  if (
    direction === "right"
  ) {
    player.position.x +=
      speed;
  }

  state.playerX =
    player.position.x;

  state.playerZ =
    player.position.z;

  saveState();

  updateCamera();
}

function updateCamera() {
  if (
    !camera ||
    !player
  ) {
    return;
  }

  camera.position.x =
    player.position.x;

  camera.position.z =
    player.position.z +
    28;

  camera.lookAt(
    player.position.x,
    0,
    player.position.z
  );
}

// ==========================================
// CITY CLICK
// ==========================================

const raycaster =
  THREE
    ? new THREE.Raycaster()
    : null;

const pointer =
  new Object();

function cityClick(
  event
) {
  if (
    !THREE ||
    !renderer ||
    !camera ||
    !scene
  ) {
    return;
  }

  const rect =
    renderer.domElement
      .getBoundingClientRect();

  pointer.x =
    ((event.clientX -
      rect.left) /
      rect.width) *
      2 -
    1;

  pointer.y =
    -(
      (event.clientY -
        rect.top) /
      rect.height
    ) *
      2 +
    1;

  const r =
    new THREE.Raycaster();

  const p =
    new THREE.Vector2(
      pointer.x,
      pointer.y
    );

  r.setFromCamera(
    p,
    camera
  );

  const objects =
    scene.children.filter(
      function (
        object
      ) {
        return (
          object.isMesh &&
          object.userData &&
          object.userData.type
        );
      }
    );

  const hits =
    r.intersectObjects(
      objects
    );

  if (!hits.length) {
    return;
  }

  openBuilding(
    hits[0].object
      .userData.type
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

function openBuilding(
  type
) {
  if (type === "hq") {
    openHQ();
    return;
  }

  if (type === "bank") {
    openBank();
    return;
  }

  if (
    type ===
    "intelligence"
  ) {
    openIntelligence();
    return;
  }

  if (
    type ===
    "marketBuilding"
  ) {
    openMarket();
    return;
  }
}

function openHQ() {
  showAction(
    t("hq"),
    t("operationDescription"),
    t("enter"),
    function () {
      openModal(
        t("operation"),
        `
          <p>
            ${t(
              "operationDescription"
            )}
          </p>

          <button
            id="start-operation"
            class="primary-button"
          >
            ${t(
              "startOperation"
            )}
          </button>
        `
      );

      const button =
        document.getElementById(
          "start-operation"
        );

      if (button) {
        button.addEventListener(
          "click",
          runOperation
        );
      }
    }
  );
}

function runOperation() {
  if (
    state.energy <
    10
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
    10;

  const reward =
    Math.floor(
      300 +
        Math.random() *
          700
    );

  const xp =
    20;

  state.nex +=
    reward;

  state.xp +=
    xp;

  checkLevel();

  saveState();
  updateHUD();

  openModal(
    t("success"),
    `
      <p>
        ${t(
          "reward"
        )}:
      </p>

      <p>
        <strong>
          +${formatNumber(
            reward
          )} NEX
        </strong>
      </p>

      <p>
        +${xp} XP
      </p>
    `
  );
}

function openBank() {
  showAction(
    t("bank"),
    state.language ===
      "en"
      ? "Manage your city capital."
      : "سرمایه و دارایی‌های شهر را مدیریت کن.",
    t("enter"),
    function () {
      openModal(
        t("bank"),
        `
          <p>
            ${t(
              "nex"
            )}:
            <strong>
              ${formatNumber(
                state.nex
              )}
            </strong>
          </p>

          <p>
            ${t(
              "city"
            )}:
            <strong>
              ${formatNumber(
                state.cityValue
              )}
            </strong>
          </p>
        `
      );
    }
  );
}

function openIntelligence() {
  showAction(
    t("intelligence"),
    state.language ===
      "en"
      ? "Secret information and special operations."
      : "اطلاعات محرمانه و عملیات ویژه شهر.",
    t("enter"),
    function () {
      openModal(
        t(
          "intelligence"
        ),
        `
          <p>
            ${
              state.language ===
              "en"
                ? "Classified intelligence will appear here."
                : "اطلاعات محرمانه در این بخش نمایش داده خواهد شد."
            }
          </p>
        `
      );
    }
  );
}

function openMarket() {
  showAction(
    t(
      "marketBuilding"
    ),
    state.language ===
      "en"
      ? "Buy equipment for your city."
      : "تجهیزات موردنیاز شهر را خریداری کن.",
    t("enter"),
    function () {
      openModal(
        t("market"),
        `<p>${t(
          "marketSoon"
        )}</p>`
      );
    }
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
            button.dataset
              .page
          );
        }
      );
    }
  );

function openPage(
  page
) {
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
    openModal(
      t("missions"),
      `<p>${t(
        "missionsSoon"
      )}</p>`
    );

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
    openModal(
      t("ranking"),
      `<p>${t(
        "rankingSoon"
      )}</p>`
    );

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
// PROFILE
// ==========================================

function openProfile() {
  openModal(
    t("profile"),
    `
      <p>
        ${t(
          "level"
        )}:
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
        ${t(
          "nex"
        )}:
        <strong>
          ${formatNumber(
            state.nex
          )}
        </strong>
      </p>

      <p>
        ${t(
          "energy"
        )}:
        <strong>
          ${state.energy}
        </strong>
      </p>
    `
  );
}

// ==========================================
// LEVEL
// ==========================================

function checkLevel() {
  const required =
    state.level *
    100;

  if (
    state.xp >=
    required
  ) {
    state.xp -=
      required;

    state.level +=
      1;

    openModal(
      state.language ===
        "en"
        ? "Level Up!"
        : "افزایش سطح!",
      `
        <p>
          ${
            state.language ===
            "en"
              ? "Congratulations! Your level increased."
              : "تبریک! سطح تو افزایش یافت."
          }
        </p>

        <p>
          ${t(
            "level"
          )}:
          <strong>
            ${state.level}
          </strong>
        </p>
      `
    );
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
