import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const tg = window.Telegram?.WebApp;

if (tg) {
  tg.ready();
  tg.expand();
}

/* =========================
   GAME STATE
========================= */

const state = {
  language: localStorage.getItem("nexus_language") || null,

  nex: Number(localStorage.getItem("nexus_nex") || 10000),

  energy: Number(
    localStorage.getItem("nexus_energy") || 100
  ),

  xp: Number(
    localStorage.getItem("nexus_xp") || 0
  ),

  level: Number(
    localStorage.getItem("nexus_level") || 1
  ),

  cityValue: Number(
    localStorage.getItem("nexus_city_value") || 1000
  ),

  cityLevel: Number(
    localStorage.getItem("nexus_city_level") || 1
  ),

  selectedBuilding: null
};

/* =========================
   TRANSLATIONS
========================= */

const translations = {

  fa: {

    title: "NEXUS",
    subtitle: "شهر مخفی",

    chooseLanguage: "زبان را انتخاب کنید",
    persian: "فارسی",
    english: "English",

    nex: "NEX",
    energy: "انرژی",
    level: "سطح",
    xp: "تجربه",
    cityValue: "ارزش شهر",

    hq: "مرکز فرماندهی",
    bank: "بانک",
    intelligence: "مرکز اطلاعات",
    market: "بازار",

    operations: "عملیات",
    missions: "ماموریت‌ها",
    marketNav: "بازار",
    ranking: "رتبه‌بندی",
    profile: "پروفایل",

    move: "حرکت",
    interact: "ورود",
    close: "بستن",

    welcome: "به شهر مخفی خوش آمدی",

    welcomeText:
      "شهر را کاوش کن، ساختمان‌ها را فعال کن و NEX به دست بیاور.",

    hqText:
      "مرکز اصلی مدیریت شهر و آغاز عملیات.",

    bankText:
      "مدیریت سرمایه، سپرده‌ها و درآمد شهر.",

    intelligenceText:
      "مرکز اطلاعات، مأموریت‌ها و عملیات ویژه.",

    marketText:
      "خرید تجهیزات و آیتم‌های مورد نیاز شهر.",

    enterBuilding:
      "ورود به ساختمان",

    buildingOperations:
      "عملیات موجود",

    operationOne:
      "عملیات شناسایی",

    operationOneText:
      "یک مأموریت کم‌ریسک برای افزایش XP و درآمد.",

    cost:
      "هزینه",

    reward:
      "پاداش",

    risk:
      "ریسک",

    low:
      "کم",

    medium:
      "متوسط",

    high:
      "زیاد",

    execute:
      "اجرای عملیات",

    comingSoon:
      "این بخش در مرحله بعدی توسعه فعال می‌شود.",

    energyEmpty:
      "انرژی کافی نیست.",

    nexEmpty:
      "NEX کافی نیست.",

    operationSuccess:
      "عملیات با موفقیت انجام شد.",

    operationFailed:
      "عملیات شکست خورد.",

    daily:
      "پاداش روزانه",

    dailyText:
      "پاداش روزانه آماده دریافت است."
  },

  en: {

    title: "NEXUS",
    subtitle: "Secret City",

    chooseLanguage: "Choose your language",
    persian: "فارسی",
    english: "English",

    nex: "NEX",
    energy: "Energy",
    level: "Level",
    xp: "XP",
    cityValue: "City Value",

    hq: "Headquarters",
    bank: "Bank",
    intelligence: "Intelligence Center",
    market: "Market",

    operations: "Operations",
    missions: "Missions",
    marketNav: "Market",
    ranking: "Ranking",
    profile: "Profile",

    move: "Move",
    interact: "Enter",
    close: "Close",

    welcome: "Welcome to the Secret City",

    welcomeText:
      "Explore the city, activate buildings and earn NEX.",

    hqText:
      "The main city management center and operation hub.",

    bankText:
      "Manage capital, deposits and city income.",

    intelligenceText:
      "Information, missions and special operations.",

    marketText:
      "Purchase equipment and useful city items.",

    enterBuilding:
      "Enter Building",

    buildingOperations:
      "Available Operations",

    operationOne:
      "Recon Operation",

    operationOneText:
      "A low-risk operation for earning XP and income.",

    cost:
      "Cost",

    reward:
      "Reward",

    risk:
      "Risk",

    low:
      "Low",

    medium:
      "Medium",

    high:
      "High",

    execute:
      "Execute Operation",

    comingSoon:
      "This section will be activated in the next development stage.",

    energyEmpty:
      "Not enough energy.",

    nexEmpty:
      "Not enough NEX.",

    operationSuccess:
      "Operation completed successfully.",

    operationFailed:
      "Operation failed.",

    daily:
      "Daily Reward",

    dailyText:
      "Your daily reward is ready."
  }
};

/* =========================
   HELPERS
========================= */

function $(id) {
  return document.getElementById(id);
}

function t(key) {

  const lang =
    state.language || "fa";

  return (
    translations[lang]?.[key] ||
    translations.fa[key] ||
    key
  );
}

function saveState() {

  localStorage.setItem(
    "nexus_language",
    state.language || "fa"
  );

  localStorage.setItem(
    "nexus_nex",
    state.nex
  );

  localStorage.setItem(
    "nexus_energy",
    state.energy
  );

  localStorage.setItem(
    "nexus_xp",
    state.xp
  );

  localStorage.setItem(
    "nexus_level",
    state.level
  );

  localStorage.setItem(
    "nexus_city_value",
    state.cityValue
  );

  localStorage.setItem(
    "nexus_city_level",
    state.cityLevel
  );
}

/* =========================
   LANGUAGE
========================= */

function setLanguage(lang) {

  state.language = lang;

  saveState();

  document.documentElement.lang =
    lang;

  document.documentElement.dir =
    lang === "fa"
      ? "rtl"
      : "ltr";

  updateInterface();

  const screen =
    $("language-screen");

  if (screen) {
    screen.classList.add("hidden");
  }
}

window.NEXUS_setLanguage =
  setLanguage;

/* =========================
   INTERFACE
========================= */

function updateInterface() {

  document
    .querySelectorAll("[data-i18n]")
    .forEach((element) => {

      const key =
        element.dataset.i18n;

      element.textContent =
        t(key);
    });

  updateHUD();
}

/* =========================
   HUD
========================= */

function updateHUD() {

  const nex =
    $("nex-value");

  const energy =
    $("energy-value");

  const level =
    $("level-value");

  const xp =
    $("xp-value");

  const city =
    $("city-value");

  if (nex) {
    nex.textContent =
      state.nex.toLocaleString();
  }

  if (energy) {
    energy.textContent =
      state.energy;
  }

  if (level) {
    level.textContent =
      state.level;
  }

  if (xp) {
    xp.textContent =
      state.xp;
  }

  if (city) {
    city.textContent =
      state.cityValue.toLocaleString();
  }
}

/* =========================
   THREE.JS
========================= */

let scene;
let camera;
let renderer;
let controls;
let player;

const buildings = [];

/* =========================
   INIT
========================= */

function init3D() {

  const container =
    $("game-container");

  if (!container) {
    return;
  }

  scene =
    new THREE.Scene();

  scene.background =
    new THREE.Color(0x05070d);

  scene.fog =
    new THREE.Fog(
      0x05070d,
      25,
      90
    );

  camera =
    new THREE.PerspectiveCamera(
      60,
      window.innerWidth /
        window.innerHeight,
      0.1,
      200
    );

  camera.position.set(
    12,
    11,
    15
  );

  renderer =
    new THREE.WebGLRenderer({
      antialias: true
    });

  renderer.setPixelRatio(
    Math.min(
      window.devicePixelRatio,
      2
    )
  );

  renderer.setSize(
    container.clientWidth ||
      window.innerWidth,

    container.clientHeight ||
      window.innerHeight
  );

  renderer.shadowMap.enabled =
    true;

  container.innerHTML = "";

  container.appendChild(
    renderer.domElement
  );

  controls =
    new OrbitControls(
      camera,
      renderer.domElement
    );

  controls.enableDamping =
    true;

  controls.enablePan =
    false;

  controls.minDistance =
    6;

  controls.maxDistance =
    35;

  controls.maxPolarAngle =
    Math.PI / 2.05;

  /* LIGHT */

  const ambient =
    new THREE.AmbientLight(
      0x8fa3c5,
      1.5
    );

  scene.add(ambient);

  const moon =
    new THREE.DirectionalLight(
      0xa9bbff,
      2.5
    );

  moon.position.set(
    -20,
    30,
    15
  );

  moon.castShadow =
    true;

  scene.add(moon);

  /* GROUND */

  const ground =
    new THREE.Mesh(

      new THREE.PlaneGeometry(
        100,
        100
      ),

      new THREE.MeshStandardMaterial({
        color: 0x10151d,
        roughness: 0.9
      })

    );

  ground.rotation.x =
    -Math.PI / 2;

  ground.receiveShadow =
    true;

  scene.add(ground);

  /* ROADS */

  createRoad(
    0,
    0,
    5,
    100
  );

  createRoad(
    0,
    0,
    100,
    5
  );

  /* BUILDINGS */

  createBuilding(
    "hq",
    -10,
    -8,
    5,
    9,
    0x173a5e
  );

  createBuilding(
    "bank",
    9,
    -8,
    5,
    7,
    0x254d3c
  );

  createBuilding(
    "intelligence",
    -10,
    9,
    5,
    8,
    0x422d58
  );

  createBuilding(
    "market",
    9,
    9,
    5,
    6,
    0x6a4825
  );

  createPlayer();

  window.addEventListener(
    "resize",
    resize3D
  );

  renderer.domElement.addEventListener(
    "pointerdown",
    handleSceneClick
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

  const road =
    new THREE.Mesh(

      new THREE.BoxGeometry(
        width,
        0.05,
        depth
      ),

      new THREE.MeshStandardMaterial({
        color: 0x181c22,
        roughness: 1
      })

    );

  road.position.set(
    x,
    0.025,
    z
  );

  scene.add(road);
}

/* =========================
   BUILDING
========================= */

function createBuilding(
  type,
  x,
  z,
  width,
  height,
  color
) {

  const building =
    new THREE.Mesh(

      new THREE.BoxGeometry(
        width,
        height,
        width
      ),

      new THREE.MeshStandardMaterial({
        color,
        roughness: 0.55,
        metalness: 0.25
      })

    );

  building.position.set(
    x,
    height / 2,
    z
  );

  building.castShadow =
    true;

  building.receiveShadow =
    true;

  building.userData = {
    type,
    interactive: true
  };

  scene.add(building);

  buildings.push(building);

  /* ROOF */

  const roof =
    new THREE.Mesh(

      new THREE.BoxGeometry(
        width + 0.4,
        0.3,
        width + 0.4
      ),

      new THREE.MeshStandardMaterial({
        color: 0x080b11,
        metalness: 0.5
      })

    );

  roof.position.set(
    x,
    height + 0.15,
    z
  );

  roof.userData = {
    type,
    interactive: true
  };

  scene.add(roof);

  buildings.push(roof);

  /* WINDOWS */

  for (
    let y = 1.5;
    y < height - 0.5;
    y += 1.5
  ) {

    createWindow(
      x,
      y,
      z - width / 2 - 0.04
    );

    createWindow(
      x,
      y,
      z + width / 2 + 0.04
    );
  }
}

function createWindow(
  x,
  y,
  z
) {

  const windowMesh =
    new THREE.Mesh(

      new THREE.BoxGeometry(
        0.65,
        0.55,
        0.08
      ),

      new THREE.MeshStandardMaterial({
        color: 0xd9c77a,
        emissive: 0x4b3f14,
        emissiveIntensity: 0.8
      })

    );

  windowMesh.position.set(
    x,
    y,
    z
  );

  scene.add(windowMesh);
}

/* =========================
   PLAYER
========================= */

function createPlayer() {

  player =
    new THREE.Group();

  const body =
    new THREE.Mesh(

      new THREE.CapsuleGeometry(
        0.45,
        0.8,
        6,
        12
      ),

      new THREE.MeshStandardMaterial({
        color: 0xeeeeee,
        roughness: 0.4
      })

    );

  body.castShadow =
    true;

  player.add(body);

  const light =
    new THREE.PointLight(
      0x7ab8ff,
      2,
      8
    );

  light.position.y =
    1.5;

  player.add(light);

  player.position.set(
    0,
    0.9,
    0
  );

  scene.add(player);
}

/* =========================
   RESIZE
========================= */

function resize3D() {

  if (
    !renderer ||
    !camera
  ) {
    return;
  }

  const container =
    $("game-container");

  const width =
    container?.clientWidth ||
    window.innerWidth;

  const height =
    container?.clientHeight ||
    window.innerHeight;

  camera.aspect =
    width / height;

  camera.updateProjectionMatrix();

  renderer.setSize(
    width,
    height
  );
}

/* =========================
   BUILDING CLICK
========================= */

function handleSceneClick(
  event
) {

  if (
    !camera ||
    !renderer
  ) {
    return;
  }

  const rect =
    renderer.domElement
      .getBoundingClientRect();

  const mouse =
    new THREE.Vector2();

  mouse.x =
    (
      (event.clientX -
        rect.left) /
      rect.width
    ) * 2 - 1;

  mouse.y =
    -(
      (event.clientY -
        rect.top) /
      rect.height
    ) * 2 + 1;

  const raycaster =
    new THREE.Raycaster();

  raycaster.setFromCamera(
    mouse,
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

  const type =
    hits[0].object.userData.type;

  if (type) {
    openBuilding(type);
  }
}

/* =========================
   BUILDING ENTRY
========================= */

function openBuilding(
  type
) {

  state.selectedBuilding =
    type;

  const title =
    $("panel-title");

  const text =
    $("panel-text");

  const panel =
    $("action-panel");

  if (!panel) {
    return;
  }

  const titleKey = {

    hq: "hq",
    bank: "bank",
    intelligence: "intelligence",
    market: "market"

  }[type];

  const textKey = {

    hq: "hqText",
    bank: "bankText",
    intelligence: "intelligenceText",
    market: "marketText"

  }[type];

  if (title) {
    title.textContent =
      t(titleKey);
  }

  if (text) {
    text.textContent =
      t(textKey);
  }

  panel.classList.remove(
    "hidden"
  );

  updateBuildingAction(
    type
  );
}

/* =========================
   BUILDING ACTION
========================= */

function updateBuildingAction(
  type
) {

  const operationButton =
    $("operation-button");

  if (!operationButton) {
    return;
  }

  if (type === "hq") {

    operationButton.innerHTML =
      `⚡ ${t("operations")}`;

    operationButton.onclick =
      showOperations;

    return;
  }

  if (type === "intelligence") {

    operationButton.innerHTML =
      `🎯 ${t("missions")}`;

    operationButton.onclick =
      showMissions;

    return;
  }

  if (type === "bank") {

    operationButton.innerHTML =
      `🏦 ${t("bank")}`;

    operationButton.onclick =
      showBank;

    return;
  }

  if (type === "market") {

    operationButton.innerHTML =
      `🏪 ${t("marketNav")}`;

    operationButton.onclick =
      showMarket;

    return;
  }
}

/* =========================
   OPERATIONS
========================= */

function showOperations() {

  const modal =
    $("modal");

  const title =
    $("modal-title");

  const text =
    $("modal-text");

  if (!modal) {
    return;
  }

  if (title) {
    title.textContent =
      t("buildingOperations");
  }

  if (text) {

    text.innerHTML = `

      <strong>
        ${t("operationOne")}
      </strong>

      <br><br>

      ${t("operationOneText")}

      <br><br>

      ${t("cost")}: 500 NEX

      <br>

      ${t("reward")}: 1,500 NEX + 50 XP

      <br>

      ${t("risk")}: ${t("low")}

      <br><br>

      <button
        id="execute-operation"
        style="
          width:100%;
          padding:12px;
          border:0;
          border-radius:12px;
          font-weight:800;
          cursor:pointer;
        "
      >
        ⚡ ${t("execute")}
      </button>

    `;

    setTimeout(() => {

      const button =
        $("execute-operation");

      if (button) {

        button.onclick =
          performOperation;

      }

    }, 0);
  }

  modal.classList.remove(
    "hidden"
  );
}

/* =========================
   OPERATION RESULT
========================= */

function performOperation() {

  const cost =
    500;

  const reward =
    1500;

  const xpReward =
    50;

  if (
    state.energy < 10
  ) {

    showMessage(
      t("energyEmpty")
    );

    return;
  }

  if (
    state.nex < cost
  ) {

    showMessage(
      t("nexEmpty")
    );

    return;
  }

  state.nex -= cost;

  state.energy -= 10;

  const success =
    Math.random() < 0.85;

  if (success) {

    state.nex += reward;

    state.xp += xpReward;

    state.cityValue +=
      100;

    checkLevel();

    saveState();

    updateHUD();

    showMessage(
      t("operationSuccess")
    );

  } else {

    state.xp += 10;

    checkLevel();

    saveState();

    updateHUD();

    showMessage(
      t("operationFailed")
    );
  }
}

/* =========================
   OTHER BUILDINGS
========================= */

function showMissions() {

  showMessage(
    `${t("missions")}\n\n${t("comingSoon")}`
  );
}

function showBank() {

  showMessage(
    `${t("bank")}\n\n${t("comingSoon")}`
  );
}

function showMarket() {

  showMessage(
    `${t("marketNav")}\n\n${t("comingSoon")}`
  );
}

/* =========================
   MOVEMENT
========================= */

function movePlayer(
  dx,
  dz
) {

  if (!player) {
    return;
  }

  if (state.energy <= 0) {

    showMessage(
      t("energyEmpty")
    );

    return;
  }

  const speed =
    0.6;

  player.position.x +=
    dx * speed;

  player.position.z +=
    dz * speed;

  player.position.x =
    THREE.MathUtils.clamp(
      player.position.x,
      -18,
      18
    );

  player.position.z =
    THREE.MathUtils.clamp(
      player.position.z,
      -18,
      18
    );

  state.energy =
    Math.max(
      0,
      state.energy - 1
    );

  saveState();

  updateHUD();
}

function setupMovement() {

  const directions = {

    up: [0, -1],

    down: [0, 1],

    left: [-1, 0],

    right: [1, 0]

  };

  Object.entries(
    directions
  ).forEach(
    ([id, direction]) => {

      const button =
        $(`move-${id}`);

      if (!button) {
        return;
      }

      button.addEventListener(
        "click",
        () => {

          movePlayer(
            direction[0],
            direction[1]
          );

        }
      );
    }
  );

  window.addEventListener(
    "keydown",
    (event) => {

      if (
        event.key ===
          "ArrowUp" ||
        event.key === "w"
      ) {
        movePlayer(0, -1);
      }

      if (
        event.key ===
          "ArrowDown" ||
        event.key === "s"
      ) {
        movePlayer(0, 1);
      }

      if (
        event.key ===
          "ArrowLeft" ||
        event.key === "a"
      ) {
        movePlayer(-1, 0);
      }

      if (
        event.key ===
          "ArrowRight" ||
        event.key === "d"
      ) {
        movePlayer(1, 0);
      }

    }
  );
}

/* =========================
   NAVIGATION
========================= */

function setupNavigation() {

  document
    .querySelectorAll("[data-nav]")
    .forEach((button) => {

      button.addEventListener(
        "click",
        () => {

          openNavigation(
            button.dataset.nav
          );

        }
      );

    });
}

function openNavigation(
  section
) {

  const modal =
    $("modal");

  const title =
    $("modal-title");

  const text =
    $("modal-text");

  if (!modal) {
    return;
  }

  const names = {

    operations:
      "operations",

    missions:
      "missions",

    market:
      "marketNav",

    ranking:
      "ranking",

    profile:
      "profile"

  };

  if (title) {

    title.textContent =
      t(
        names[section] ||
        section
      );

  }

  if (text) {

    text.textContent =
      t("comingSoon");

  }

  modal.classList.remove(
    "hidden"
  );
}

/* =========================
   MODALS
========================= */

function showMessage(
  message
) {

  const modal =
    $("modal");

  const title =
    $("modal-title");

  const text =
    $("modal-text");

  if (!modal) {
    return;
  }

  if (title) {
    title.textContent =
      "NEXUS";
  }

  if (text) {
    text.textContent =
      message;
  }

  modal.classList.remove(
    "hidden"
  );
}

function setupModals() {

  const closeModal =
    $("close-modal");

  if (closeModal) {

    closeModal.onclick =
      () => {

        $("modal")
          ?.classList
          .add("hidden");

      };

  }

  const closePanel =
    $("close-panel");

  if (closePanel) {

    closePanel.onclick =
      () => {

        $("action-panel")
          ?.classList
          .add("hidden");

      };

  }
}

/* =========================
   DAILY REWARD
========================= */

function checkDailyReward() {

  const today =
    new Date()
      .toISOString()
      .slice(0, 10);

  const last =
    localStorage.getItem(
      "nexus_last_daily_reward"
    );

  if (last !== today) {

    state.nex +=
      1000;

    localStorage.setItem(
      "nexus_last_daily_reward",
      today
    );

    saveState();

    updateHUD();
  }
}

/* =========================
   LEVEL
========================= */

function checkLevel() {

  const requiredXP =
    state.level * 500;

  if (
    state.xp >= requiredXP
  ) {

    state.xp -=
      requiredXP;

    state.level +=
      1;

    state.cityLevel +=
      1;

    state.cityValue +=
      500;
  }
}

/* =========================
   ANIMATION
========================= */

function animate() {

  requestAnimationFrame(
    animate
  );

  if (controls) {
    controls.update();
  }

  if (player) {
    player.rotation.y +=
      0.005;
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

/* =========================
   START
========================= */

function startGame() {

  setupMovement();

  setupNavigation();

  setupModals();

  updateInterface();

  if (!state.language) {

    $("language-screen")
      ?.classList
      .remove("hidden");

  }

  checkDailyReward();

  init3D();

  setTimeout(
    () => {

      $("loading")
        ?.classList
        .add("hidden");

    },
    1200
  );
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
