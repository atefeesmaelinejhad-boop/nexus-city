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
  energy: Number(localStorage.getItem("nexus_energy") || 100),
  xp: Number(localStorage.getItem("nexus_xp") || 0),
  level: Number(localStorage.getItem("nexus_level") || 1),
  cityValue: Number(localStorage.getItem("nexus_city_value") || 1000),
  cityLevel: Number(localStorage.getItem("nexus_city_level") || 1),
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
    interact: "تعامل",
    close: "بستن",

    welcome: "به شهر مخفی خوش آمدی",
    welcomeText: "شهر را کاوش کن، ساختمان‌ها را فعال کن و NEX به دست بیاور.",

    hqText: "مرکز اصلی مدیریت شهر.",
    bankText: "مدیریت سرمایه و درآمد شهر.",
    intelligenceText: "اطلاعات، مأموریت‌ها و عملیات ویژه.",
    marketText: "خرید تجهیزات و آیتم‌های شهری.",

    comingSoon: "این بخش به‌زودی فعال می‌شود.",
    energyEmpty: "انرژی کافی نیست.",
    operationReward: "عملیات با موفقیت انجام شد!",
    operationCost: "هزینه عملیات",

    daily: "پاداش روزانه",
    dailyText: "پاداش روزانه آماده دریافت است.",

    save: "ذخیره"
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
    interact: "Interact",
    close: "Close",

    welcome: "Welcome to the Secret City",
    welcomeText: "Explore the city, activate buildings and earn NEX.",

    hqText: "The main management center of the city.",
    bankText: "Manage city capital and income.",
    intelligenceText: "Information, missions and special operations.",
    marketText: "Buy equipment and city items.",

    comingSoon: "This section is coming soon.",
    energyEmpty: "Not enough energy.",
    operationReward: "Operation completed successfully!",
    operationCost: "Operation cost",

    daily: "Daily Reward",
    dailyText: "Your daily reward is ready to claim.",

    save: "Save"
  }
};

/* =========================
   HELPERS
========================= */

function t(key) {
  const lang = state.language || "fa";
  return translations[lang]?.[key] || key;
}

function saveState() {
  localStorage.setItem("nexus_language", state.language || "fa");
  localStorage.setItem("nexus_nex", state.nex);
  localStorage.setItem("nexus_energy", state.energy);
  localStorage.setItem("nexus_xp", state.xp);
  localStorage.setItem("nexus_level", state.level);
  localStorage.setItem("nexus_city_value", state.cityValue);
  localStorage.setItem("nexus_city_level", state.cityLevel);
}

function $(id) {
  return document.getElementById(id);
}

/* =========================
   LANGUAGE
========================= */

function setLanguage(lang) {
  state.language = lang;
  saveState();

  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "fa" ? "rtl" : "ltr";

  updateInterface();

  const languageScreen = $("language-screen");

  if (languageScreen) {
    languageScreen.classList.add("hidden");
  }

  const loading = $("loading");

  if (loading) {
    setTimeout(() => {
      loading.classList.add("hidden");
    }, 300);
  }
}

function updateInterface() {
  const elements = document.querySelectorAll("[data-i18n]");

  elements.forEach((element) => {
    const key = element.dataset.i18n;
    element.textContent = t(key);
  });

  updateHUD();
}

/* =========================
   HUD
========================= */

function updateHUD() {
  const nex = $("nex-value");
  const energy = $("energy-value");
  const level = $("level-value");
  const xp = $("xp-value");
  const cityValue = $("city-value");

  if (nex) nex.textContent = state.nex.toLocaleString();
  if (energy) energy.textContent = state.energy;
  if (level) level.textContent = state.level;
  if (xp) xp.textContent = state.xp;
  if (cityValue) cityValue.textContent = state.cityValue.toLocaleString();
}

/* =========================
   THREE.JS SCENE
========================= */

let scene;
let camera;
let renderer;
let controls;
let player;

const buildings = [];

function init3D() {
  const container = $("game-container");

  if (!container) return;

  scene = new THREE.Scene();

  scene.background = new THREE.Color(0x05070d);
  scene.fog = new THREE.Fog(0x05070d, 25, 90);

  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    200
  );

  camera.position.set(10, 10, 14);

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  renderer.setSize(
    container.clientWidth || window.innerWidth,
    container.clientHeight || window.innerHeight
  );

  renderer.shadowMap.enabled = true;

  container.innerHTML = "";
  container.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);

  controls.enableDamping = true;
  controls.enablePan = false;

  controls.minDistance = 6;
  controls.maxDistance = 30;

  controls.maxPolarAngle = Math.PI / 2.05;

  /* LIGHT */

  const ambient = new THREE.AmbientLight(0x8899bb, 1.3);
  scene.add(ambient);

  const moonLight = new THREE.DirectionalLight(0xaabbff, 2);
  moonLight.position.set(-15, 25, 10);
  moonLight.castShadow = true;

  scene.add(moonLight);

  /* GROUND */

  const groundGeometry = new THREE.PlaneGeometry(100, 100);

  const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0x10151d,
    roughness: 0.9,
    metalness: 0.1
  });

  const ground = new THREE.Mesh(
    groundGeometry,
    groundMaterial
  );

  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;

  scene.add(ground);

  /* ROADS */

  createRoad(0, 0, 5, 100);
  createRoad(0, 0, 100, 5);

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

  /* PLAYER */

  createPlayer();

  window.addEventListener("resize", resize3D);

  renderer.domElement.addEventListener(
    "pointerdown",
    handleSceneClick
  );

  animate();
}

function createRoad(x, z, width, depth) {
  const geometry = new THREE.BoxGeometry(
    width,
    0.05,
    depth
  );

  const material = new THREE.MeshStandardMaterial({
    color: 0x181c22,
    roughness: 1
  });

  const road = new THREE.Mesh(
    geometry,
    material
  );

  road.position.set(x, 0.025, z);

  scene.add(road);
}

function createBuilding(
  type,
  x,
  z,
  width,
  height,
  color
) {
  const geometry = new THREE.BoxGeometry(
    width,
    height,
    width
  );

  const material = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.55,
    metalness: 0.25
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

  building.castShadow = true;
  building.receiveShadow = true;

  building.userData.type = type;

  scene.add(building);

  buildings.push(building);

  /* ROOF */

  const roofGeometry = new THREE.BoxGeometry(
    width + 0.4,
    0.3,
    width + 0.4
  );

  const roofMaterial = new THREE.MeshStandardMaterial({
    color: 0x080b11,
    metalness: 0.5
  });

  const roof = new THREE.Mesh(
    roofGeometry,
    roofMaterial
  );

  roof.position.set(
    x,
    height + 0.15,
    z
  );

  roof.userData.type = type;

  scene.add(roof);

  buildings.push(roof);

  /* WINDOWS */

  for (let y = 1.5; y < height - 0.5; y += 1.5) {
    createWindow(x, y, z - width / 2 - 0.03);
    createWindow(x, y, z + width / 2 + 0.03);
  }
}

function createWindow(x, y, z) {
  const geometry = new THREE.BoxGeometry(
    0.65,
    0.55,
    0.08
  );

  const material = new THREE.MeshStandardMaterial({
    color: 0xd9c77a,
    emissive: 0x4b3f14,
    emissiveIntensity: 0.8
  });

  const windowMesh = new THREE.Mesh(
    geometry,
    material
  );

  windowMesh.position.set(x, y, z);

  scene.add(windowMesh);
}

function createPlayer() {
  const group = new THREE.Group();

  const bodyGeometry = new THREE.CapsuleGeometry(
    0.45,
    0.8,
    6,
    12
  );

  const bodyMaterial = new THREE.MeshStandardMaterial({
    color: 0xeeeeee,
    roughness: 0.4
  });

  const body = new THREE.Mesh(
    bodyGeometry,
    bodyMaterial
  );

  body.castShadow = true;

  group.add(body);

  const light = new THREE.PointLight(
    0x7ab8ff,
    2,
    8
  );

  light.position.y = 1.5;

  group.add(light);

  group.position.set(0, 0.9, 0);

  scene.add(group);

  player = group;
}

function resize3D() {
  if (!renderer || !camera) return;

  const container = $("game-container");

  const width =
    container?.clientWidth || window.innerWidth;

  const height =
    container?.clientHeight || window.innerHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
}

/* =========================
   BUILDING INTERACTION
========================= */

function handleSceneClick(event) {
  if (!camera || !renderer) return;

  const rect =
    renderer.domElement.getBoundingClientRect();

  const mouse = new THREE.Vector2();

  mouse.x =
    ((event.clientX - rect.left) / rect.width) * 2 - 1;

  mouse.y =
    -((event.clientY - rect.top) / rect.height) * 2 + 1;

  const raycaster = new THREE.Raycaster();

  raycaster.setFromCamera(mouse, camera);

  const hits = raycaster.intersectObjects(
    buildings,
    false
  );

  if (!hits.length) return;

  const type = hits[0].object.userData.type;

  if (type) {
    openBuilding(type);
  }
}

/* =========================
   BUILDING PANEL
========================= */

function openBuilding(type) {
  state.selectedBuilding = type;

  const title = $( "panel-title" );
  const text = $( "panel-text" );
  const panel = $( "action-panel" );

  if (!panel) return;

  const titleMap = {
    hq: "hq",
    bank: "bank",
    intelligence: "intelligence",
    market: "market"
  };

  const textMap = {
    hq: "hqText",
    bank: "bankText",
    intelligence: "intelligenceText",
    market: "marketText"
  };

  if (title) {
    title.textContent = t(titleMap[type]);
  }

  if (text) {
    text.textContent = t(textMap[type]);
  }

  panel.classList.remove("hidden");
}

/* =========================
   MOVEMENT
========================= */

function movePlayer(dx, dz) {
  if (!player) return;

  const speed = 0.6;

  player.position.x += dx * speed;
  player.position.z += dz * speed;

  player.position.x = THREE.MathUtils.clamp(
    player.position.x,
    -18,
    18
  );

  player.position.z = THREE.MathUtils.clamp(
    player.position.z,
    -18,
    18
  );

  state.energy = Math.max(
    0,
    state.energy - 1
  );

  saveState();
  updateHUD();
}

function setupMovement() {
  const buttons = {
    up: [0, -1],
    down: [0, 1],
    left: [-1, 0],
    right: [1, 0]
  };

  Object.entries(buttons).forEach(
    ([id, direction]) => {
      const button = $(`move-${id}`);

      if (!button) return;

      button.addEventListener("click", () => {
        movePlayer(
          direction[0],
          direction[1]
        );
      });
    }
  );

  window.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp" || event.key === "w") {
      movePlayer(0, -1);
    }

    if (event.key === "ArrowDown" || event.key === "s") {
      movePlayer(0, 1);
    }

    if (event.key === "ArrowLeft" || event.key === "a") {
      movePlayer(-1, 0);
    }

    if (event.key === "ArrowRight" || event.key === "d") {
      movePlayer(1, 0);
    }
  });
}

/* =========================
   GAME ACTIONS
========================= */

function performOperation() {
  const cost = 500;
  const reward = 1500;
  const xpReward = 50;

  if (state.energy < 10) {
    showMessage(t("energyEmpty"));
    return;
  }

  if (state.nex < cost) {
    showMessage(
      `${t("operationCost")}: ${cost.toLocaleString()} NEX`
    );

    return;
  }

  state.nex -= cost;
  state.nex += reward;

  state.energy -= 10;
  state.xp += xpReward;
  state.cityValue += 100;

  checkLevel();

  saveState();
  updateHUD();

  showMessage(t("operationReward"));
}

function checkLevel() {
  const requiredXP =
    state.level * 500;

  if (state.xp >= requiredXP) {
    state.xp -= requiredXP;
    state.level += 1;
    state.cityLevel += 1;
  }
}

/* =========================
   NAVIGATION
========================= */

function setupNavigation() {
  const navButtons =
    document.querySelectorAll("[data-nav]");

  navButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const section = button.dataset.nav;

      openNavigation(section);
    });
  });
}

function openNavigation(section) {
  const modal = $("modal");
  const modalTitle = $("modal-title");
  const modalText = $("modal-text");

  if (!modal) return;

  const names = {
    operations: "operations",
    missions: "missions",
    market: "marketNav",
    ranking: "ranking",
    profile: "profile"
  };

  if (modalTitle) {
    modalTitle.textContent =
      t(names[section] || section);
  }

  if (modalText) {
    modalText.textContent =
      t("comingSoon");
  }

  modal.classList.remove("hidden");
}

/* =========================
   MODALS
========================= */

function showMessage(message) {
  const modal = $("modal");
  const title = $("modal-title");
  const text = $("modal-text");

  if (!modal) return;

  if (title) {
    title.textContent = "NEXUS";
  }

  if (text) {
    text.textContent = message;
  }

  modal.classList.remove("hidden");
}

function setupModals() {
  const closeModal = $("close-modal");

  if (closeModal) {
    closeModal.addEventListener(
      "click",
      () => {
        $("modal")?.classList.add("hidden");
      }
    );
  }

  const closePanel = $("close-panel");

  if (closePanel) {
    closePanel.addEventListener(
      "click",
      () => {
        $("action-panel")?.classList.add("hidden");
      }
    );
  }

  const operationButton =
    $("operation-button");

  if (operationButton) {
    operationButton.addEventListener(
      "click",
      performOperation
    );
  }
}

/* =========================
   DAILY REWARD
========================= */

function checkDailyReward() {
  const lastReward =
    localStorage.getItem(
      "nexus_last_daily_reward"
    );

  const today =
    new Date().toISOString().slice(0, 10);

  if (lastReward !== today) {
    state.nex += 1000;

    localStorage.setItem(
      "nexus_last_daily_reward",
      today
    );

    saveState();
    updateHUD();
  }
}

/* =========================
   ANIMATION
========================= */

function animate() {
  requestAnimationFrame(animate);

  if (controls) {
    controls.update();
  }

  if (player) {
    player.rotation.y += 0.005;
  }

  if (renderer && scene && camera) {
    renderer.render(scene, camera);
  }
}

/* =========================
   START GAME
========================= */

function startGame() {
  setupMovement();
  setupNavigation();
  setupModals();

  updateInterface();

  if (!state.language) {
    const languageScreen =
      $("language-screen");

    languageScreen?.classList.remove(
      "hidden"
    );
  }

  checkDailyReward();

  init3D();

  setTimeout(() => {
    $("loading")?.classList.add("hidden");
  }, 1200);
}

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    startGame
  );
} else {
  startGame();
}
