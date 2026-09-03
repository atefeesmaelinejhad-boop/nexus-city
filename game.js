// NEXUS | Secret City
// Stable Game Engine
// Three.js is loaded dynamically so language buttons always work.

let THREE = null;
let scene = null;
let camera = null;
let renderer = null;
let player = null;
let animationId = null;

const tg = window.Telegram?.WebApp || null;

if (tg) {
  try {
    tg.ready();
    tg.expand();
  } catch (e) {
    console.warn("Telegram WebApp init failed:", e);
  }
}

// ===============================
// TRANSLATIONS
// ===============================

const translations = {
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

    welcomeTitle: "به NEXUS خوش آمدی",
    welcomeText: "شهر مخفی تو از همین‌جا شروع می‌شود.",

    hqDescription:
      "مرکز اصلی مدیریت شهر. عملیات خود را از اینجا آغاز کن.",

    bankDescription:
      "بانک شهر برای مدیریت سرمایه و دارایی‌های تو.",

    intelligenceDescription:
      "اطلاعات محرمانه شهر و عملیات ویژه در این مرکز قرار دارد.",

    marketDescription:
      "خرید تجهیزات و آیتم‌های موردنیاز شهر.",

    operationTitle: "عملیات",
    operationDescription:
      "برای انجام عملیات به انرژی نیاز داری. موفقیت عملیات به تو NEX و XP می‌دهد.",

    startOperation: "شروع عملیات",

    notEnoughEnergy: "انرژی کافی نیست.",
    operationSuccess: "عملیات با موفقیت انجام شد!",
    operationReward: "پاداش:",

    missionTitle: "ماموریت‌ها",
    missionText: "ماموریت‌های جدید به‌زودی فعال می‌شوند.",

    marketTitle: "بازار",
    marketText: "بازار NEXUS در حال توسعه است.",

    rankingTitle: "رتبه‌بندی",
    rankingText: "جدول رتبه‌بندی بازیکنان به‌زودی فعال می‌شود.",

    profileTitle: "پروفایل",
    profileText: "اطلاعات بازیکن",

    levelUp: "تبریک! سطح تو افزایش یافت.",

    threeErrorTitle: "خطای موتور سه‌بعدی",
    threeErrorText:
      "بخش بازی بارگذاری شد، اما موتور سه‌بعدی در دسترس نیست. صفحه را یک‌بار دوباره باز کن."
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

    welcomeTitle: "Welcome to NEXUS",
    welcomeText: "Your secret city starts here.",

    hqDescription:
      "The main command center of your city. Start your operations here.",

    bankDescription:
      "Manage your city's capital and assets.",

    intelligenceDescription:
      "Secret information and special operations are handled here.",

    marketDescription:
      "Buy equipment and items for your city.",

    operationTitle: "Operation",
    operationDescription:
      "Operations require energy. Successful operations reward you with NEX and XP.",

    startOperation: "Start Operation",

    notEnoughEnergy: "Not enough energy.",
    operationSuccess: "Operation completed successfully!",
    operationReward: "Reward:",

    missionTitle: "Missions",
    missionText: "New missions are coming soon.",

    marketTitle: "Market",
    marketText: "The NEXUS market is under development.",

    rankingTitle: "Ranking",
    rankingText: "Player rankings are coming soon.",

    profileTitle: "Profile",
    profileText: "Player information",

    levelUp: "Congratulations! Your level increased.",

    threeErrorTitle: "3D Engine Error",
    threeErrorText:
      "The game loaded, but the 3D engine is unavailable. Reopen the page once."
  }
};

// ===============================
// STATE
// ===============================

const defaultState = {
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
    const saved = JSON.parse(localStorage.getItem("NEXUS_STATE"));

    if (saved && typeof saved === "object") {
      return {
        ...defaultState,
        ...saved
      };
    }
  } catch (error) {
    console.warn("Could not load saved state:", error);
  }

  return { ...defaultState };
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
    console.warn("Could not save state:", error);
  }
}

// ===============================
// DOM
// ===============================

const languageScreen =
  document.getElementById("language-screen");

const gameContainer =
  document.getElementById("game-container");

const faButton =
  document.getElementById("fa-button");

const enButton =
  document.getElementById("en-button");

const modal =
  document.getElementById("modal");

const modalTitle =
  document.getElementById("modal-title");

const modalContent =
  document.getElementById("modal-content");

const modalClose =
  document.getElementById("modal-close");

// ===============================
// TRANSLATION HELPER
// ===============================

function t(key) {
  const lang = state.language || "fa";

  return (
    translations[lang]?.[key] ??
    translations.fa[key] ??
    key
  );
}

// ===============================
// LANGUAGE
// ===============================

function setLanguage(language) {
  if (language !== "fa" && language !== "en") {
    language = "fa";
  }

  state.language = language;

  document.documentElement.lang = language;
  document.documentElement.dir =
    language === "fa" ? "rtl" : "ltr";

  saveState();

  if (languageScreen) {
    languageScreen.style.display = "none";
  }

  if (gameContainer) {
    gameContainer.classList.add("active");
    gameContainer.style.display = "block";
  }

  updateText();
  updateHUD();

  // Start 3D only after language selection.
  init3D();

  console.log("NEXUS LANGUAGE:", language);
}

// IMPORTANT:
// These listeners are attached BEFORE Three.js is loaded.

if (faButton) {
  faButton.addEventListener("click", function () {
    setLanguage("fa");
  });
}

if (enButton) {
  enButton.addEventListener("click", function () {
    setLanguage("en");
  });
}

// ===============================
// TEXT UPDATE
// ===============================

function updateText() {
  const map = {
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

  Object.entries(map).forEach(([id, key]) => {
    const element = document.getElementById(id);

    if (element) {
      element.textContent = t(key);
    }
  });
}

// ===============================
// HUD
// ===============================

function updateHUD() {
  const nex = document.getElementById("nex-value");
  const energy = document.getElementById("energy-value");
  const level = document.getElementById("level-value");
  const city = document.getElementById("city-value");

  if (nex) {
    nex.textContent = formatNumber(state.nex);
  }

  if (energy) {
    energy.textContent = Math.max(
      0,
      Math.floor(state.energy)
    );
  }

  if (level) {
    level.textContent = state.level;
  }

  if (city) {
    city.textContent = formatNumber(state.cityValue);
  }
}

function formatNumber(number) {
  return Number(number || 0).toLocaleString(
    state.language === "en" ? "en-US" : "fa-IR"
  );
}

// ===============================
// MODAL
// ===============================

function openModal(title, content) {
  if (!modal) return;

  if (modalTitle) {
    modalTitle.textContent = title;
  }

  if (modalContent) {
    modalContent.innerHTML = content;
  }

  modal.classList.add("active");
}

function closeModal() {
  if (modal) {
    modal.classList.remove("active");
  }
}

if (modalClose) {
  modalClose.addEventListener(
    "click",
    closeModal
  );
}

// ===============================
// ACTION PANEL
// ===============================

function showActionPanel(
  title,
  description,
  actionText,
  actionFunction
) {
  const panel =
    document.getElementById("action-panel");

  const titleElement =
    document.getElementById("action-title");

  const descriptionElement =
    document.getElementById("action-description");

  const button =
    document.getElementById("action-button");

  if (!panel) return;

  if (titleElement) {
    titleElement.textContent = title;
  }

  if (descriptionElement) {
    descriptionElement.textContent =
      description;
  }

  if (button) {
    button.textContent = actionText;

    button.onclick = function () {
      actionFunction?.();
    };
  }

  panel.classList.add("active");
}

function hideActionPanel() {
  const panel =
    document.getElementById("action-panel");

  if (panel) {
    panel.classList.remove("active");
  }
}

// ===============================
// 3D ENGINE
// ===============================

async function init3D() {
  if (scene) {
    return;
  }

  try {
    THREE = await import(
      "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js"
    );

    createScene();
  } catch (error) {
    console.error(
      "THREE.JS LOAD ERROR:",
      error
    );

    showThreeError();
  }
}

function showThreeError() {
  openModal(
    t("threeErrorTitle"),
    `<p>${t("threeErrorText")}</p>`
  );
}

function createScene() {
  if (!THREE) return;

  const cityElement =
    document.getElementById("city");

  if (!cityElement) {
    console.error("City container not found.");
    return;
  }

  cityElement.innerHTML = "";

  scene = new THREE.Scene();

  scene.background =
    new THREE.Color(0x05070d);

  scene.fog =
    new THREE.Fog(0x05070d, 35, 180);

  camera =
    new THREE.PerspectiveCamera(
      55,
      cityElement.clientWidth /
        Math.max(cityElement.clientHeight, 1),
      0.1,
      500
    );

  camera.position.set(
    0,
    15,
    25
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
    Math.min(window.devicePixelRatio || 1, 2)
  );

  renderer.setSize(
    cityElement.clientWidth,
    cityElement.clientHeight
  );

  cityElement.appendChild(
    renderer.domElement
  );

  // Lighting
  const ambient =
    new THREE.AmbientLight(
      0x667799,
      1.8
    );

  scene.add(ambient);

  const moonLight =
    new THREE.DirectionalLight(
      0x99aaff,
      2.5
    );

  moonLight.position.set(
    20,
    40,
    10
  );

  scene.add(moonLight);

  // Ground
  const groundGeometry =
    new THREE.PlaneGeometry(
      220,
      220
    );

  const groundMaterial =
    new THREE.MeshStandardMaterial({
      color: 0x10151d,
      roughness: 0.9
    });

  const ground =
    new THREE.Mesh(
      groundGeometry,
      groundMaterial
    );

  ground.rotation.x =
    -Math.PI / 2;

  ground.position.y = -0.05;

  scene.add(ground);

  createRoads();
  createBuildings();
  createPlayer();

  window.addEventListener(
    "resize",
    resize3D
  );

  animate();

  console.log(
    "NEXUS 3D CITY INITIALIZED"
  );
}

// ===============================
// ROADS
// ===============================

function createRoads() {
  const roadMaterial =
    new THREE.MeshStandardMaterial({
      color: 0x171b22,
      roughness: 0.85
    });

  const road1 =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        220,
        0.15,
        12
      ),
      roadMaterial
    );

  road1.position.y = 0.02;

  scene.add(road1);

  const road2 =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        12,
        0.16,
        220
      ),
      roadMaterial
    );

  road2.position.y = 0.03;

  scene.add(road2);

  // Road lines
  const lineMaterial =
    new THREE.MeshBasicMaterial({
      color: 0x555555
    });

  for (
    let x = -100;
    x <= 100;
    x += 10
  ) {
    const line =
      new THREE.Mesh(
        new THREE.BoxGeometry(
          5,
          0.03,
          0.15
        ),
        lineMaterial
      );

    line.position.set(
      x,
      0.12,
      0
    );

    scene.add(line);
  }
}

// ===============================
// BUILDINGS
// ===============================

function createBuildings() {
  createBuilding(
    "hq",
    -22,
    -18,
    9,
    24
  );

  createBuilding(
    "bank",
    22,
    -18,
    8,
    19
  );

  createBuilding(
    "intelligence",
    -22,
    18,
    8,
    20
  );

  createBuilding(
    "marketBuilding",
    22,
    18,
    10,
    15
  );

  // Extra city buildings
  createBuilding(
    "building5",
    -42,
    -38,
    7,
    14
  );

  createBuilding(
    "building6",
    42,
    -38,
    7,
    17
  );

  createBuilding(
    "building7",
    -42,
    38,
    7,
    12
  );

  createBuilding(
    "building8",
    42,
    38,
    7,
    18
  );
}

function createBuilding(
  type,
  x,
  z,
  size,
  height
) {
  const geometry =
    new THREE.BoxGeometry(
      size,
      height,
      size
    );

  const material =
    new THREE.MeshStandardMaterial({
      color: getBuildingColor(type),
      roughness: 0.7,
      metalness: 0.15
    });

  const building =
    new THREE.Mesh(
      geometry,
      material
    );

  building.position.set(
    x,
    height / 2,
    z
  );

  building.userData.type =
    type;

  scene.add(building);

  // Windows
  addWindows(
    x,
    z,
    size,
    height
  );

  return building;
}

function getBuildingColor(type) {
  switch (type) {
    case "hq":
      return 0x273f72;

    case "bank":
      return 0x394a58;

    case "intelligence":
      return 0x402d52;

    case "marketBuilding":
      return 0x59472a;

    default:
      return 0x26303a;
  }
}

function addWindows(
  x,
  z,
  size,
  height
) {
  const windowMaterial =
    new THREE.MeshBasicMaterial({
      color: 0xffd36a
    });

  const rows =
    Math.max(
      2,
      Math.floor(height / 4)
    );

  const cols =
    Math.max(
      2,
      Math.floor(size / 2)
    );

  for (
    let row = 0;
    row < rows;
    row++
  ) {
    for (
      let col = 0;
      col < cols;
      col++
    ) {
      if (
        Math.random() > 0.72
      ) {
        continue;
      }

      const window =
        new THREE.Mesh(
          new THREE.BoxGeometry(
            0.5,
            0.7,
            0.08
          ),
          windowMaterial
        );

      window.position.set(
        x -
          size / 2 +
          1 +
          col * 1.5,
        2 +
          row * 3,
        z -
          size / 2 -
          0.05
      );

      scene.add(window);
    }
  }
}

// ===============================
// PLAYER
// ===============================

function createPlayer() {
  const group =
    new THREE.Group();

  const body =
    new THREE.Mesh(
      new THREE.CapsuleGeometry(
        0.55,
        1.3,
        4,
        8
      ),
      new THREE.MeshStandardMaterial({
        color: 0x42a5ff
      })
    );

  body.position.y =
    1.25;

  group.add(body);

  const head =
    new THREE.Mesh(
      new THREE.SphereGeometry(
        0.42,
        16,
        16
      ),
      new THREE.MeshStandardMaterial({
        color: 0xe0b28c
      })
    );

  head.position.y =
    2.25;

  group.add(head);

  group.position.set(
    state.playerX || 0,
    0,
    state.playerZ || 0
  );

  player = group;

  scene.add(player);
}

// ===============================
// MOVEMENT
// ===============================

document
  .querySelectorAll(".move-button")
  .forEach((button) => {
    button.addEventListener(
      "click",
      () => {
        movePlayer(
          button.dataset.direction
        );
      }
    );
  });

function movePlayer(direction) {
  if (!player) return;

  const speed = 2;

  switch (direction) {
    case "up":
      player.position.z -= speed;
      break;

    case "down":
      player.position.z += speed;
      break;

    case "left":
      player.position.x -= speed;
      break;

    case "right":
      player.position.x += speed;
      break;
  }

  state.playerX =
    player.position.x;

  state.playerZ =
    player.position.z;

  saveState();

  camera.position.x =
    player.position.x;

  camera.position.z =
    player.position.z + 25;

  camera.lookAt(
    player.position.x,
    0,
    player.position.z
  );
}

// ===============================
// BUILDING INTERACTION
// ===============================

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
    ((event.clientX - rect.left) /
      rect.width) *
      2 -
    1;

  pointer.y =
    -(
      (event.clientY - rect.top) /
      rect.height
    ) *
      2 +
    1;

  raycaster.setFromCamera(
    pointer,
    camera
  );

  const objects =
    scene.children.filter(
      (object) =>
        object.isMesh &&
        object.userData.type
    );

  const hits =
    raycaster.intersectObjects(
      objects
    );

  if (!hits.length) {
    return;
  }

  const type =
    hits[0].object.userData.type;

  openBuilding(type);
}

function openBuilding(type) {
  switch (type) {
    case "hq":
      openHQ();
      break;

    case "bank":
      openBank();
      break;

    case "intelligence":
      openIntelligence();
      break;

    case "marketBuilding":
      openMarket();
      break;

    default:
      openModal(
        state.language === "en"
          ? "Building"
          : "ساختمان",
        state.language === "en"
          ? "This building is not active yet."
          : "این ساختمان هنوز فعال نیست."
      );
  }
}

if (
  document.getElementById("city")
) {
  document
    .getElementById("city")
    .addEventListener(
      "click",
      handleCityClick
    );
}

// ===============================
// HQ
// ===============================

function openHQ() {
  showActionPanel(
    t("hq"),
    t("hqDescription"),
    t("enter"),
    () => {
      openModal(
        t("operationTitle"),
        `
          <p>${t(
            "operationDescription"
          )}</p>

          <button
            id="operation-start"
            class="primary-button"
          >
            ${t("startOperation")}
          </button>
        `
      );

      const button =
        document.getElementById(
          "operation-start"
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
  if (state.energy < 10) {
    openModal(
      t("operationTitle"),
      `<p>${t(
        "notEnoughEnergy"
      )}</p>`
    );

    return;
  }

  state.energy -= 10;

  const reward =
    Math.floor(
      300 +
        Math.random() * 700
    );

  const xpReward = 20;

  state.nex += reward;
  state.xp += xpReward;

  checkLevel();

  saveState();
  updateHUD();

  openModal(
    t("operationSuccess"),
    `
      <p>${t(
        "operationReward"
      )}</p>

      <p>
        <strong>
          +${formatNumber(
            reward
          )} NEX
        </strong>
      </p>

      <p>
        +${xpReward} XP
      </p>
    `
  );
}

// ===============================
// BANK
// ===============================

function openBank() {
  showActionPanel(
    t("bank"),
    t("bankDescription"),
    t("enter"),
    () => {
      openModal(
        t("bank"),
        `
          <p>
            ${t("nex")}:
            <strong>
              ${formatNumber(
                state.nex
              )}
            </strong>
          </p>

          <p>
            ${t("city")}:
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

// ===============================
// INTELLIGENCE
// ===============================

function openIntelligence() {
  showActionPanel(
    t("intelligence"),
    t("intelligenceDescription"),
    t("enter"),
    () => {
      openModal(
        t("intelligence"),
        `
          <p>
            ${
              state.language === "en"
                ? "Classified city intelligence will appear here."
                : "اطلاعات محرمانه شهر در این بخش نمایش داده خواهد شد."
            }
          </p>
        `
      );
    }
  );
}

// ===============================
// MARKET
// ===============================

function openMarket() {
  showActionPanel(
    t("marketBuilding"),
    t("marketDescription"),
    t("enter"),
    () => {
      openModal(
        t("marketTitle"),
        `<p>${t(
          "marketText"
        )}</p>`
      );
    }
  );
}

// ===============================
// NAVIGATION
// ===============================

document
  .querySelectorAll(".nav-button")
  .forEach((button) => {
    button.addEventListener(
      "click",
      () => {
        openPage(
          button.dataset.page
        );
      }
    );
  });

function openPage(page) {
  hideActionPanel();

  switch (page) {
    case "operations":
      openHQ();
      break;

    case "missions":
      openModal(
        t("missionTitle"),
        `<p>${t(
          "missionText"
        )}</p>`
      );
      break;

    case "market":
      openMarket();
      break;

    case "ranking":
      openModal(
        t("rankingTitle"),
        `<p>${t(
          "rankingText"
        )}</p>`
      );
      break;

    case "profile":
      openProfile();
      break;
  }
}

// ===============================
// PROFILE
// ===============================

function openProfile() {
  openModal(
    t("profileTitle"),
    `
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
    `
  );
}

// ===============================
// LEVEL
// ===============================

function checkLevel() {
  const required =
    state.level * 100;

  if (
    state.xp >= required
  ) {
    state.xp -= required;
    state.level += 1;

    openModal(
      t("levelUp"),
      `
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

// ===============================
// RESIZE
// ===============================

function resize3D() {
  if (
    !renderer ||
    !camera
  ) {
    return;
  }

  const cityElement =
    document.getElementById("city");

  if (!cityElement) {
    return;
  }

  const width =
    cityElement.clientWidth;

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

// ===============================
// ANIMATION
// ===============================

function animate() {
  if (!renderer || !scene || !camera) {
    return;
  }

  animationId =
    requestAnimationFrame(
      animate
    );

  if (player) {
    player.rotation.y +=
      0.002;
  }

  renderer.render(
    scene,
    camera
  );
}

// ===============================
// START
// ===============================

function startGame() {
  console.log(
    "NEXUS GAME.JS STARTED"
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
      gameContainer.classList.remove(
        "active"
      );
      gameContainer.style.display =
        "none";
    }
  }
}

if (
  document.readyState ===
  "loading"
) {
  document.addEventListener(
    "DOMContentLoaded",
    startGame
  );
} else {
  startGame();
}
