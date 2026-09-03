import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

/* =========================================================
   NEXUS | SECRET CITY
   Stable Game Version
   ========================================================= */

const tg = window.Telegram?.WebApp;

if (tg) {
  try {
    tg.ready();
    tg.expand();
  } catch (e) {
    console.log("Telegram initialization skipped.");
  }
}

/* =========================================================
   TRANSLATIONS
   ========================================================= */

const TEXT = {
  fa: {
    chooseLanguage: "زبان خود را انتخاب کنید",
    enterCity: "ورود به شهر",

    cityValue: "ارزش شهر",
    energy: "انرژی",
    level: "سطح",
    xp: "تجربه",
    nex: "NEX",

    operations: "عملیات",
    missions: "مأموریت‌ها",
    market: "بازار",
    ranking: "رتبه‌بندی",
    profile: "پروفایل",

    hq: "ستاد مرکزی",
    bank: "بانک",
    intelligence: "مرکز اطلاعات",
    marketBuilding: "بازار",

    hqDesc: "مرکز فرماندهی شهر.",
    bankDesc: "مرکز مدیریت دارایی‌ها و اقتصاد شهر.",
    intelligenceDesc: "مرکز پرونده‌ها و مأموریت‌های مخفی.",
    marketDesc: "محل خرید تجهیزات و امکانات.",

    close: "بستن",
    execute: "اجرای عملیات",

    operationTitle: "عملیات شناسایی",
    operationDesc: "یک منطقه ناشناخته در حاشیه شهر شناسایی شده است.",

    startMission: "شروع مأموریت",

    reconTitle: "پرونده: منطقه ۷",
    reconDesc:
      "یک پیام رمزگذاری‌شده از منطقه ۷ دریافت شده. باید قبل از ناپدید شدن ردپا، منطقه را بررسی کنی.",

    follow: "تعقیب فرد ناشناس",
    cameras: "بررسی دوربین‌ها",
    agent: "فرستادن مأمور",

    success: "موفقیت",
    failure: "شکست",
    continue: "ادامه",

    noEnergy: "انرژی کافی نداری.",
    noNex: "NEX کافی نداری.",

    missionComplete: "مأموریت با موفقیت تکمیل شد.",
    missionFailed: "مأموریت شکست خورد.",

    comingSoon: "این بخش به‌زودی فعال می‌شود."
  },

  en: {
    chooseLanguage: "Choose your language",
    enterCity: "Enter City",

    cityValue: "City Value",
    energy: "Energy",
    level: "Level",
    xp: "XP",
    nex: "NEX",

    operations: "Operations",
    missions: "Missions",
    market: "Market",
    ranking: "Ranking",
    profile: "Profile",

    hq: "Headquarters",
    bank: "Bank",
    intelligence: "Intelligence Center",
    marketBuilding: "Market",

    hqDesc: "The command center of the city.",
    bankDesc: "Manage city assets and economy.",
    intelligenceDesc: "Secret files and special missions.",
    marketDesc: "Buy equipment and upgrades.",

    close: "Close",
    execute: "Execute",

    operationTitle: "Recon Operation",
    operationDesc: "An unknown area has been detected on the edge of the city.",

    startMission: "Start Mission",

    reconTitle: "Case: Sector 7",
    reconDesc:
      "An encrypted message has arrived from Sector 7. Investigate before the trail disappears.",

    follow: "Follow the stranger",
    cameras: "Check cameras",
    agent: "Send an agent",

    success: "Success",
    failure: "Failure",
    continue: "Continue",

    noEnergy: "Not enough energy.",
    noNex: "Not enough NEX.",

    missionComplete: "Mission completed successfully.",
    missionFailed: "Mission failed.",

    comingSoon: "This section is coming soon."
  }
};

/* =========================================================
   STATE
   ========================================================= */

const defaultState = {
  language: null,
  nex: 10000,
  energy: 100,
  xp: 0,
  level: 1,
  cityValue: 100000
};

let state;

try {
  state = JSON.parse(
    localStorage.getItem("NEXUS_STATE") || "null"
  );

  if (!state) {
    state = { ...defaultState };
  }
} catch (error) {
  state = { ...defaultState };
}

function saveState() {
  try {
    localStorage.setItem(
      "NEXUS_STATE",
      JSON.stringify(state)
    );
  } catch (error) {
    console.log("Save failed.");
  }
}

/* =========================================================
   TRANSLATION
   ========================================================= */

function t(key) {
  const language = state.language || "fa";

  return TEXT[language]?.[key] || key;
}

function setLanguage(language) {
  if (!TEXT[language]) return;

  state.language = language;

  document.documentElement.lang = language;
  document.documentElement.dir =
    language === "fa" ? "rtl" : "ltr";

  saveState();

  const languageScreen = document.getElementById(
    "language-screen"
  );

  const gameContainer = document.getElementById(
    "game-container"
  );

  if (languageScreen) {
    languageScreen.style.display = "none";
  }

  if (gameContainer) {
    gameContainer.style.display = "block";
  }

  updateInterface();
}

window.NEXUS_setLanguage = setLanguage;

/* =========================================================
   DOM HELPERS
   ========================================================= */

function $(id) {
  return document.getElementById(id);
}

function setText(id, text) {
  const element = $(id);

  if (element) {
    element.textContent = text;
  }
}

/* =========================================================
   HUD
   ========================================================= */

function updateHUD() {
  setText(
    "nex-value",
    Number(state.nex).toLocaleString()
  );

  setText(
    "energy-value",
    Math.floor(state.energy).toString()
  );

  setText(
    "xp-value",
    Number(state.xp).toLocaleString()
  );

  setText(
    "level-value",
    Number(state.level).toString()
  );

  setText(
    "city-value",
    Number(state.cityValue).toLocaleString()
  );

  const xpBar = $("xp-bar");

  if (xpBar) {
    const required = state.level * 500;

    const percent = Math.min(
      100,
      Math.max(
        0,
        (state.xp / required) * 100
      )
    );

    xpBar.style.width = percent + "%";
  }
}

function updateInterface() {
  updateHUD();

  setText("city-value-label", t("cityValue"));
  setText("energy-label", t("energy"));
  setText("level-label", t("level"));
  setText("xp-label", t("xp"));

  setText("nav-operations", t("operations"));
  setText("nav-missions", t("missions"));
  setText("nav-market", t("market"));
  setText("nav-ranking", t("ranking"));
  setText("nav-profile", t("profile"));
}

/* =========================================================
   MESSAGE
   ========================================================= */

function showMessage(message) {
  const box = $("message-box");

  if (!box) {
    console.log(message);
    return;
  }

  box.textContent = message;
  box.classList.add("show");

  clearTimeout(window.nexusMessageTimer);

  window.nexusMessageTimer =
    setTimeout(() => {
      box.classList.remove("show");
    }, 2500);
}

/* =========================================================
   MODAL
   ========================================================= */

function closeModal() {
  const modal = $("modal");

  if (modal) {
    modal.classList.remove("active");
  }
}

function openModal(title, html, buttons = []) {
  const modal = $("modal");
  const titleElement = $("modal-title");
  const contentElement = $("modal-content");
  const buttonsElement = $("modal-buttons");

  if (
    !modal ||
    !titleElement ||
    !contentElement ||
    !buttonsElement
  ) {
    console.log(title, html);
    return;
  }

  titleElement.textContent = title;

  contentElement.innerHTML = html;

  buttonsElement.innerHTML = "";

  buttons.forEach((item) => {
    const button =
      document.createElement("button");

    button.className =
      "action-button " +
      (item.className || "");

    button.textContent = item.text;

    button.addEventListener(
      "click",
      item.action
    );

    buttonsElement.appendChild(button);
  });

  modal.classList.add("active");
}

function setupModal() {
  const close = $("modal-close");

  if (close) {
    close.addEventListener(
      "click",
      closeModal
    );
  }

  const modal = $("modal");

  if (modal) {
    modal.addEventListener(
      "click",
      (event) => {
        if (event.target === modal) {
          closeModal();
        }
      }
    );
  }
}

/* =========================================================
   BUILDINGS
   ========================================================= */

function buildingClicked(type) {
  if (type === "hq") {
    openHQ();
  }

  if (type === "bank") {
    openBank();
  }

  if (type === "intelligence") {
    openIntelligence();
  }

  if (type === "market") {
    openMarket();
  }
}

/* =========================================================
   HQ
   ========================================================= */

function openHQ() {
  openModal(
    t("hq"),
    `
      <div class="building-description">
        ${t("hqDesc")}
      </div>

      <div class="stat-card">
        <strong>${t("nex")}</strong>
        <span>${state.nex.toLocaleString()}</span>
      </div>

      <div class="stat-card">
        <strong>${t("energy")}</strong>
        <span>${Math.floor(state.energy)}</span>
      </div>

      <div class="stat-card">
        <strong>${t("xp")}</strong>
        <span>${state.xp}</span>
      </div>
    `,
    [
      {
        text: "🎯 " + t("operations"),
        action: showOperations
      }
    ]
  );
}

/* =========================================================
   OPERATIONS
   ========================================================= */

function showOperations() {
  openModal(
    t("operations"),
    `
      <div class="mission-card">

        <h3>
          🎯 ${t("operationTitle")}
        </h3>

        <p>
          ${t("operationDesc")}
        </p>

        <div class="mission-meta">
          <span>💰 500 NEX</span>
          <span>⚡ 10 ${t("energy")}</span>
          <span>🎁 +1500 NEX</span>
        </div>

      </div>
    `,
    [
      {
        text: t("execute"),
        action: performOperation
      },
      {
        text: t("close"),
        action: closeModal
      }
    ]
  );
}

function performOperation() {
  if (state.energy < 10) {
    showMessage(t("noEnergy"));
    return;
  }

  if (state.nex < 500) {
    showMessage(t("noNex"));
    return;
  }

  state.energy -= 10;
  state.nex -= 500;

  const success =
    Math.random() < 0.85;

  if (success) {
    state.nex += 1500;
    state.xp += 50;
    state.cityValue += 100;

    showMessage(
      state.language === "fa"
        ? "✅ عملیات موفق بود! +1500 NEX"
        : "✅ Operation successful! +1500 NEX"
    );
  } else {
    state.xp += 10;

    showMessage(
      state.language === "fa"
        ? "❌ عملیات شکست خورد."
        : "❌ Operation failed."
    );
  }

  checkLevel();

  saveState();
  updateHUD();

  closeModal();
}

function checkLevel() {
  const required =
    state.level * 500;

  if (state.xp >= required) {
    state.xp -= required;
    state.level += 1;
    state.cityValue += 5000;

    showMessage(
      state.language === "fa"
        ? `🎉 سطح ${state.level} باز شد!`
        : `🎉 Level ${state.level} unlocked!`
    );
  }
}

/* =========================================================
   INTELLIGENCE CENTER
   ========================================================= */

function openIntelligence() {
  openModal(
    t("intelligence"),
    `
      <div class="mission-card">

        <h3>🛰️ ${t("reconTitle")}</h3>

        <p>
          ${t("reconDesc")}
        </p>

        <div class="mission-meta">
          <span>⚡ 15 ${t("energy")}</span>
          <span>💰 +2000 NEX</span>
          <span>⭐ +100 XP</span>
        </div>

        <button
          class="action-button"
          id="start-recon"
        >
          ${t("startMission")}
        </button>

      </div>
    `
  );

  setTimeout(() => {
    const button = $("start-recon");

    if (button) {
      button.addEventListener(
        "click",
        startRecon
      );
    }
  }, 0);
}

/* =========================================================
   RECON MISSION
   ========================================================= */

function startRecon() {
  if (state.energy < 15) {
    showMessage(t("noEnergy"));
    return;
  }

  state.energy -= 15;

  saveState();
  updateHUD();

  openModal(
    t("reconTitle"),
    `
      <div class="story-box">

        <p>
          ${
            state.language === "fa"
              ? "ساعت 02:17 بامداد است. یک پیام رمزگذاری‌شده روی کانال اضطراری ظاهر می‌شود."
              : "It is 02:17 AM. An encrypted message appears on the emergency channel."
          }
        </p>

        <p>
          ${
            state.language === "fa"
              ? "مختصات به یک کوچه تاریک در منطقه ۷ اشاره می‌کند."
              : "The coordinates point to a dark alley in Sector 7."
          }
        </p>

      </div>
    `,
    [
      {
        text: "👁️ " + t("follow"),
        action: () =>
          reconChoice("follow")
      },
      {
        text: "📹 " + t("cameras"),
        action: () =>
          reconChoice("cameras")
      },
      {
        text: "🕵️ " + t("agent"),
        action: () =>
          reconChoice("agent")
      }
    ]
  );
}

function reconChoice(choice) {
  const successRates = {
    follow: 0.75,
    cameras: 0.9,
    agent: 0.95
  };

  const success =
    Math.random() <
    successRates[choice];

  if (success) {
    state.nex += 2000;
    state.xp += 100;
    state.cityValue += 500;

    checkLevel();
    saveState();
    updateHUD();

    openModal(
      "✅ " + t("success"),
      `
        <div class="story-box">

          <p>
            ${
              state.language === "fa"
                ? getSuccessText(choice)
                : getSuccessTextEN(choice)
            }
          </p>

          <div class="reward-box">
            💰 +2000 NEX
            <br>
            ⭐ +100 XP
          </div>

        </div>
      `,
      [
        {
          text: t("continue"),
          action: () => {
            closeModal();

            showMessage(
              t("missionComplete")
            );
          }
        }
      ]
    );
  } else {
    state.xp += 25;

    checkLevel();
    saveState();
    updateHUD();

    openModal(
      "❌ " + t("failure"),
      `
        <div class="story-box">

          <p>
            ${
              state.language === "fa"
                ? "فرد ناشناس متوجه حضور تو شد و در تاریکی ناپدید شد."
                : "The stranger noticed you and disappeared into the darkness."
            }
          </p>

          <div class="reward-box">
            ⭐ +25 XP
          </div>

        </div>
      `,
      [
        {
          text: t("continue"),
          action: () => {
            closeModal();

            showMessage(
              t("missionFailed")
            );
          }
        }
      ]
    );
  }
}

function getSuccessText(choice) {
  if (choice === "follow") {
    return "رد فرد ناشناس را گرفتی و یک کیف حاوی اسناد محرمانه پیدا کردی.";
  }

  if (choice === "cameras") {
    return "تصاویر دوربین مسیر فرار را آشکار کردند و یک پلاک مهم پیدا شد.";
  }

  return "مأمور تو بدون جلب توجه وارد منطقه شد و یک فایل رمزگذاری‌شده پیدا کرد.";
}

function getSuccessTextEN(choice) {
  if (choice === "follow") {
    return "You followed the stranger and found a bag containing classified documents.";
  }

  if (choice === "cameras") {
    return "Camera footage revealed the escape route and an important plate number.";
  }

  return "Your agent entered the area unnoticed and found an encrypted file.";
}

/* =========================================================
   BANK
   ========================================================= */

function openBank() {
  openModal(
    t("bank"),
    `
      <div class="building-description">
        ${t("bankDesc")}
      </div>

      <div class="stat-card">
        <strong>${t("nex")}</strong>
        <span>${state.nex.toLocaleString()}</span>
      </div>

      <div class="info-box">
        ${
          state.language === "fa"
            ? "سیستم اقتصادی پیشرفته بانک در مرحله بعد اضافه می‌شود."
            : "The advanced bank economy will be added in the next stage."
        }
      </div>
    `,
    [
      {
        text: t("close"),
        action: closeModal
      }
    ]
  );
}

/* =========================================================
   MARKET
   ========================================================= */

function openMarket() {
  openModal(
    t("marketBuilding"),
    `
      <div class="building-description">
        ${t("marketDesc")}
      </div>

      <div class="shop-item">

        <div>
          <strong>⚡ Energy Pack</strong>
          <small>+25 Energy</small>
        </div>

        <button
          class="action-button"
          id="buy-energy"
        >
          750 NEX
        </button>

      </div>

      <div class="shop-item">

        <div>
          <strong>🛰️ Intelligence Pass</strong>
          <small>
            ${
              state.language === "fa"
                ? "کارت دسترسی اطلاعاتی"
                : "Intelligence access pass"
            }
          </small>
        </div>

        <button
          class="action-button"
          id="buy-pass"
        >
          2500 NEX
        </button>

      </div>
    `,
    [
      {
        text: t("close"),
        action: closeModal
      }
    ]
  );

  setTimeout(() => {
    const energy = $("buy-energy");
    const pass = $("buy-pass");

    if (energy) {
      energy.addEventListener(
        "click",
        buyEnergy
      );
    }

    if (pass) {
      pass.addEventListener(
        "click",
        buyPass
      );
    }
  }, 0);
}

function buyEnergy() {
  if (state.nex < 750) {
    showMessage(t("noNex"));
    return;
  }

  state.nex -= 750;

  state.energy =
    Math.min(
      100,
      state.energy + 25
    );

  saveState();
  updateHUD();

  closeModal();

  showMessage(
    state.language === "fa"
      ? "⚡ 25 انرژی خریداری شد."
      : "⚡ 25 energy purchased."
  );
}

function buyPass() {
  if (state.nex < 2500) {
    showMessage(t("noNex"));
    return;
  }

  state.nex -= 2500;

  saveState();
  updateHUD();

  closeModal();

  showMessage(
    state.language === "fa"
      ? "🛰️ کارت اطلاعاتی خریداری شد."
      : "🛰️ Intelligence pass purchased."
  );
}

/* =========================================================
   NAVIGATION
   ========================================================= */

function setupNavigation() {
  const operations =
    $("nav-operations");

  const missions =
    $("nav-missions");

  const market =
    $("nav-market");

  const ranking =
    $("nav-ranking");

  const profile =
    $("nav-profile");

  if (operations) {
    operations.addEventListener(
      "click",
      showOperations
    );
  }

  if (missions) {
    missions.addEventListener(
      "click",
      openIntelligence
    );
  }

  if (market) {
    market.addEventListener(
      "click",
      openMarket
    );
  }

  if (ranking) {
    ranking.addEventListener(
      "click",
      () => {
        openModal(
          t("ranking"),
          `
            <div class="empty-state">
              🏆
              <br><br>
              ${t("comingSoon")}
            </div>
          `,
          [
            {
              text: t("close"),
              action: closeModal
            }
          ]
        );
      }
    );
  }

  if (profile) {
    profile.addEventListener(
      "click",
      () => {
        openModal(
          t("profile"),
          `
            <div class="profile-card">

              <h3>👤 NEXUS Agent</h3>

              <p>
                ${t("level")}:
                ${state.level}
              </p>

              <p>
                ${t("xp")}:
                ${state.xp}
              </p>

              <p>
                ${t("nex")}:
                ${state.nex.toLocaleString()}
              </p>

            </div>
          `,
          [
            {
              text: t("close"),
              action: closeModal
            }
          ]
        );
      }
    );
  }
}

/* =========================================================
   THREE.JS
   ========================================================= */

let scene;
let camera;
let renderer;

const buildings = [];

let player;

let raycaster;
let mouse;

function init3D() {
  const canvas =
    $("game-canvas");

  if (!canvas) {
    console.error(
      "NEXUS: game-canvas not found."
    );

    return;
  }

  try {
    scene =
      new THREE.Scene();

    scene.background =
      new THREE.Color(
        0x050914
      );

    camera =
      new THREE.PerspectiveCamera(
        60,
        window.innerWidth /
          window.innerHeight,
        0.1,
        500
      );

    camera.position.set(
      25,
      22,
      28
    );

    renderer =
      new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: false
      });

    renderer.setPixelRatio(
      Math.min(
        window.devicePixelRatio,
        2
      )
    );

    renderer.setSize(
      window.innerWidth,
      window.innerHeight
    );

    renderer.shadowMap.enabled =
      true;

    addLights();

    createGround();

    createRoads();

    createBuildings();

    createPlayer();

    raycaster =
      new THREE.Raycaster();

    mouse =
      new THREE.Vector2();

    canvas.addEventListener(
      "pointerdown",
      onCanvasClick
    );

    window.addEventListener(
      "resize",
      resize3D
    );

    animate();

    console.log(
      "NEXUS 3D initialized."
    );
  } catch (error) {
    console.error(
      "NEXUS 3D error:",
      error
    );

    showMessage(
      "3D initialization error"
    );
  }
}

function addLights() {
  const ambient =
    new THREE.AmbientLight(
      0x8899aa,
      2
    );

  scene.add(ambient);

  const light =
    new THREE.DirectionalLight(
      0xffffff,
      2
    );

  light.position.set(
    20,
    40,
    20
  );

  light.castShadow = true;

  scene.add(light);
}

function createGround() {
  const geometry =
    new THREE.PlaneGeometry(
      120,
      120
    );

  const material =
    new THREE.MeshStandardMaterial({
      color: 0x101827
    });

  const ground =
    new THREE.Mesh(
      geometry,
      material
    );

  ground.rotation.x =
    -Math.PI / 2;

  ground.receiveShadow =
    true;

  scene.add(ground);
}

function createRoads() {
  const material =
    new THREE.MeshStandardMaterial({
      color: 0x202735
    });

  const horizontal =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        100,
        0.15,
        10
      ),
      material
    );

  horizontal.position.y =
    0.05;

  scene.add(horizontal);

  const vertical =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        10,
        0.15,
        100
      ),
      material
    );

  vertical.position.y =
    0.06;

  scene.add(vertical);
}

function createBuildings() {
  addBuilding(
    "hq",
    -20,
    -18,
    10,
    14,
    0x31527f
  );

  addBuilding(
    "bank",
    18,
    -18,
    12,
    16,
    0x41636c
  );

  addBuilding(
    "intelligence",
    -20,
    18,
    12,
    15,
    0x51427c
  );

  addBuilding(
    "market",
    18,
    18,
    13,
    11,
    0x76583c
  );
}

function addBuilding(
  type,
  x,
  z,
  width,
  height,
  color
) {
  const geometry =
    new THREE.BoxGeometry(
      width,
      height,
      width
    );

  const material =
    new THREE.MeshStandardMaterial({
      color: color,
      roughness: 0.65
    });

  const mesh =
    new THREE.Mesh(
      geometry,
      material
    );

  mesh.position.set(
    x,
    height / 2,
    z
  );

  mesh.castShadow = true;
  mesh.receiveShadow = true;

  mesh.userData = {
    type: type,
    interactive: true
  };

  scene.add(mesh);

  buildings.push(mesh);

  const roof =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        width + 0.5,
        0.5,
        width + 0.5
      ),
      new THREE.MeshStandardMaterial({
        color: 0x111827
      })
    );

  roof.position.set(
    x,
    height + 0.25,
    z
  );

  roof.userData = {
    type: type,
    interactive: true
  };

  scene.add(roof);

  buildings.push(roof);
}

function createPlayer() {
  const geometry =
    new THREE.CapsuleGeometry(
      0.7,
      1.4,
      8,
      16
    );

  const material =
    new THREE.MeshStandardMaterial({
      color: 0x42a5f5
    });

  player =
    new THREE.Mesh(
      geometry,
      material
    );

  player.position.set(
    0,
    1.4,
    0
  );

  player.castShadow = true;

  scene.add(player);
}

function onCanvasClick(event) {
  if (
    !renderer ||
    !camera ||
    !raycaster
  ) {
    return;
  }

  const rect =
    renderer.domElement.getBoundingClientRect();

  mouse.x =
    ((event.clientX -
      rect.left) /
      rect.width) *
      2 -
    1;

  mouse.y =
    -(
      (event.clientY -
        rect.top) /
        rect.height
    ) *
      2 +
    1;

  raycaster.setFromCamera(
    mouse,
    camera
  );

  const hits =
    raycaster.intersectObjects(
      buildings
    );

  if (!hits.length) {
    return;
  }

  const type =
    hits[0].object.userData?.type;

  if (type) {
    buildingClicked(type);
  }
}

function animate() {
  requestAnimationFrame(
    animate
  );

  if (
    player &&
    camera
  ) {
    camera.lookAt(
      player.position
    );
  }

  if (
    renderer &&
    scene &&
    camera
  ) {
    renderer.render(
      scene,
      camera
    );
  }
}

function resize3D() {
  if (
    !camera ||
    !renderer
  ) {
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

/* =========================================================
   START GAME
   ========================================================= */

function startGame() {
  console.log(
    "NEXUS starting..."
  );

  setupModal();

  setupNavigation();

  updateInterface();

  const languageScreen =
    $("language-screen");

  const gameContainer =
    $("game-container");

  if (!state.language) {
    if (languageScreen) {
      languageScreen.style.display =
        "flex";
    }

    if (gameContainer) {
      gameContainer.style.display =
        "none";
    }
  } else {
    if (languageScreen) {
      languageScreen.style.display =
        "none";
    }

    if (gameContainer) {
      gameContainer.style.display =
        "block";
    }
  }

  init3D();
}

/* =========================================================
   BOOT
   ========================================================= */

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
