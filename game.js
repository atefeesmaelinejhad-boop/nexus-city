// ============================================================
// NEXUS | SECRET CITY
// FULL FRONTEND GAME ENGINE
// ============================================================

"use strict";

// ============================================================
// GLOBALS
// ============================================================

let THREE = null;

let scene = null;
let camera = null;
let renderer = null;
let clock = null;

let player = null;
let playerGroup = null;

let raycaster = null;
let pointer = null;

let cityObjects = [];
let movingCars = [];
let streetLights = [];
let particles = [];

let animationStarted = false;
let gameStarted = false;
let threeReady = false;

let cameraYaw = 0.65;
let cameraPitch = 0.48;
let cameraDistance = 18;

let draggingCamera = false;
let lastPointerX = 0;
let lastPointerY = 0;

let operationRunning = false;
let operationTimer = null;
let operationData = null;

let eventTimer = null;
let saveTimer = null;

const tg = window.Telegram?.WebApp || null;

const WALLET_ADDRESS =
  "UQA_xHIFxQ-tb30nyE5NOhWZVybAYgvm6pTBq4y2CvORBVRl";

const BOT_USERNAME = "NexusSecretBot";

const MANIFEST_URL =
  "https://atefeesmaelinejhad-boop.github.io/nexus-city/tonconnect-manifest.json";

const GAME_URL =
  "https://atefeesmaelinejhad-boop.github.io/nexus-city/";


// ============================================================
// TELEGRAM
// ============================================================

if (tg) {
  try {
    tg.ready();
    tg.expand();
  } catch (error) {
    console.warn("Telegram WebApp:", error);
  }
}


// ============================================================
// TRANSLATIONS
// ============================================================

const TEXT = {

  fa: {

    nex: "NEX",
    energy: "انرژی",
    level: "سطح",
    city: "ارزش شهر",

    operations: "عملیات",
    missions: "مأموریت‌ها",
    market: "بازار",
    ranking: "رتبه‌بندی",
    profile: "پروفایل",

    headquarters: "مرکز فرماندهی",
    bank: "بانک مرکزی",
    intelligence: "مرکز اطلاعات",
    marketBuilding: "بازار شهر",

    move: "حرکت",
    close: "بستن",
    back: "بازگشت",

    operation: "عملیات",
    start: "شروع عملیات",
    cancel: "انصراف",

    safe: "مسیر امن",
    balanced: "مسیر متعادل",
    risky: "مسیر سریع",

    success: "موفقیت",
    failure: "شکست",

    reward: "پاداش",
    xp: "XP",
    risk: "ریسک",
    cost: "هزینه",

    missionsTitle: "مأموریت‌ها",
    marketTitle: "بازار مخفی",
    bankTitle: "بانک مرکزی",
    intelligenceTitle: "مرکز اطلاعات",
    rankingTitle: "رتبه‌بندی شهرها",
    profileTitle: "پروفایل",

    buy: "خرید",
    claim: "دریافت",
    claimed: "دریافت شد",
    locked: "قفل",
    available: "آماده",

    energyPack: "بسته انرژی",
    intelligenceBoost: "تقویت اطلاعات",
    cityUpgrade: "ارتقای شهر",
    operationGear: "تجهیزات عملیات",

    wallet: "کیف پول TON",
    walletAddress: "آدرس کیف پول",
    connectWallet: "اتصال کیف پول",
    disconnectWallet: "قطع اتصال",
    buyNex: "خرید NEX",

    referral: "دعوت دوستان",
    referralLink: "لینک دعوت",
    copy: "کپی",
    share: "اشتراک‌گذاری",
    referralCount: "تعداد دعوت",
    referralEarned: "NEX دریافتی از دعوت",

    dailyReward: "پاداش روزانه",
    collect: "دریافت پاداش",

    cityLevel: "سطح شهر",
    treasury: "خزانه شهر",
    invest: "سرمایه‌گذاری",
    withdraw: "برداشت",

    balance: "موجودی",
    score: "امتیاز",

    event: "رویداد شهری",
    eventReward: "پاداش رویداد",

    operationBriefing: "اطلاعات عملیات",
    preparing: "آماده‌سازی",
    infiltration: "نفوذ",
    extraction: "خروج",
    completed: "عملیات تکمیل شد",

    route: "انتخاب مسیر",
    chooseRoute: "مسیر عملیات را انتخاب کن",

    insufficientEnergy: "انرژی کافی نیست.",
    insufficientNex: "NEX کافی نیست.",

    copied: "کپی شد.",
    walletCopied: "آدرس کیف پول کپی شد.",
    referralCopied: "لینک دعوت کپی شد.",

    payment: "پرداخت",
    paymentPending: "تراکنش ارسال شد و در انتظار تأیید شبکه است.",
    paymentStarted: "کیف پول برای پرداخت آماده شد.",
    paymentFailed: "پرداخت انجام نشد.",
    connectFirst: "ابتدا کیف پول TON را متصل کن.",

    paymentSecurity:
      "پس از پرداخت، اعتبار NEX فقط بعد از تأیید تراکنش توسط سرور به حساب اضافه می‌شود.",

    package10: "۱۰٬۰۰۰ NEX",
    package50: "۵۰٬۰۰۰ NEX",
    package150: "۱۵۰٬۰۰۰ NEX",
    package500: "۵۰۰٬۰۰۰ NEX",

    ton05: "۰٫۵ TON",
    ton2: "۲ TON",
    ton5: "۵ TON",
    ton15: "۱۵ TON",

    player: "بازیکن",

    operationScout: "شناسایی منطقه",
    operationInfiltration: "نفوذ به منطقه",
    operationBlackout: "خاموشی شهری",
    operationHeist: "سرقت اطلاعات",

    operationScoutDesc:
      "یک منطقه ناشناخته را بررسی کن و اطلاعات ارزشمند به دست بیاور.",

    operationInfiltrationDesc:
      "وارد منطقه تحت حفاظت شو و اطلاعات محرمانه را استخراج کن.",

    operationBlackoutDesc:
      "شبکه انرژی یک منطقه را برای مدت کوتاه مختل کن.",

    operationHeistDesc:
      "به مرکز اطلاعات نفوذ کن و داده‌های بسیار ارزشمند را خارج کن.",

    missionOperations:
      "۳ عملیات موفق انجام بده",

    missionEarn:
      "۵٬۰۰۰ NEX به دست بیاور",

    missionMove:
      "۱۰ بار در شهر حرکت کن",

    missionBuy:
      "یک وسیله از بازار خریداری کن",

    missionReferral:
      "یک دوست را به شهر دعوت کن",

    missionDaily:
      "پاداش روزانه را دریافت کن",

    eventNight:
      "شب طلایی شهر آغاز شد! پاداش عملیات افزایش یافته است.",

    eventAlert:
      "هشدار امنیتی! ریسک عملیات افزایش یافته است.",

    eventCalm:
      "شهر آرام است. انرژی عملیات کاهش یافته است.",

    noEvent:
      "فعلاً رویداد خاصی در شهر وجود ندارد.",

    profileStats: "آمار بازیکن",
    totalOperations: "کل عملیات",
    successfulOperations: "عملیات موفق",
    failedOperations: "عملیات ناموفق",
    totalEarned: "کل درآمد",

    rank1: "فرمانده سایه",
    rank2: "نفوذگر",
    rank3: "استراتژیست",
    rank4: "اپراتور",
    rank5: "تازه‌وارد",

    cityName: "NEXUS CITY",

    welcome:
      "به شهر مخفی NEXUS خوش آمدی.",

    tapBuilding:
      "روی ساختمان‌ها بزن تا وارد بخش‌های مختلف شهر شوی.",

    loading:
      "در حال ورود به شهر...",

    ready:
      "شهر آماده است.",

    dailyAlready:
      "پاداش امروز قبلاً دریافت شده است.",

    dailyReceived:
      "پاداش روزانه دریافت شد.",

    purchaseSuccess:
      "خرید با موفقیت انجام شد.",

    investmentSuccess:
      "سرمایه‌گذاری انجام شد.",

    upgradeSuccess:
      "شهر ارتقا پیدا کرد.",

    operationSuccess:
      "عملیات با موفقیت به پایان رسید.",

    operationFailure:
      "عملیات شکست خورد، اما تجربه کسب کردی.",

    routeSafeDesc:
      "ریسک کمتر، زمان بیشتر و پاداش متعادل.",

    routeBalancedDesc:
      "تعادل میان سرعت، ریسک و پاداش.",

    routeRiskyDesc:
      "سریع‌تر، خطرناک‌تر و پاداش بیشتر.",

    operationProgress:
      "پیشرفت عملیات",

    phase1:
      "در حال بررسی محیط...",

    phase2:
      "در حال عبور از منطقه امنیتی...",

    phase3:
      "در حال خروج با اطلاعات...",

    nothing:
      "چیزی برای نمایش وجود ندارد.",

    language: "زبان",

    persian: "فارسی",
    english: "English"
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

    headquarters: "Headquarters",
    bank: "Central Bank",
    intelligence: "Intelligence Center",
    marketBuilding: "City Market",

    move: "Move",
    close: "Close",
    back: "Back",

    operation: "Operation",
    start: "Start Operation",
    cancel: "Cancel",

    safe: "Safe Route",
    balanced: "Balanced Route",
    risky: "Fast Route",

    success: "Success",
    failure: "Failure",

    reward: "Reward",
    xp: "XP",
    risk: "Risk",
    cost: "Cost",

    missionsTitle: "Missions",
    marketTitle: "Black Market",
    bankTitle: "Central Bank",
    intelligenceTitle: "Intelligence Center",
    rankingTitle: "City Ranking",
    profileTitle: "Profile",

    buy: "Buy",
    claim: "Claim",
    claimed: "Claimed",
    locked: "Locked",
    available: "Available",

    energyPack: "Energy Pack",
    intelligenceBoost: "Intelligence Boost",
    cityUpgrade: "City Upgrade",
    operationGear: "Operation Gear",

    wallet: "TON Wallet",
    walletAddress: "Wallet Address",
    connectWallet: "Connect Wallet",
    disconnectWallet: "Disconnect Wallet",
    buyNex: "Buy NEX",

    referral: "Invite Friends",
    referralLink: "Referral Link",
    copy: "Copy",
    share: "Share",
    referralCount: "Referrals",
    referralEarned: "Referral NEX",

    dailyReward: "Daily Reward",
    collect: "Collect Reward",

    cityLevel: "City Level",
    treasury: "City Treasury",
    invest: "Invest",
    withdraw: "Withdraw",

    balance: "Balance",
    score: "Score",

    event: "City Event",
    eventReward: "Event Reward",

    operationBriefing: "Operation Briefing",
    preparing: "Preparing",
    infiltration: "Infiltration",
    extraction: "Extraction",
    completed: "Operation Completed",

    route: "Choose Route",
    chooseRoute: "Choose your operation route",

    insufficientEnergy: "Not enough energy.",
    insufficientNex: "Not enough NEX.",

    copied: "Copied.",
    walletCopied: "Wallet address copied.",
    referralCopied: "Referral link copied.",

    payment: "Payment",
    paymentPending: "Transaction sent and waiting for network confirmation.",
    paymentStarted: "Wallet is ready for payment.",
    paymentFailed: "Payment failed.",
    connectFirst: "Connect your TON wallet first.",

    paymentSecurity:
      "NEX credit is added only after the transaction is verified by the server.",

    package10: "10,000 NEX",
    package50: "50,000 NEX",
    package150: "150,000 NEX",
    package500: "500,000 NEX",

    ton05: "0.5 TON",
    ton2: "2 TON",
    ton5: "5 TON",
    ton15: "15 TON",

    player: "Player",

    operationScout: "Area Recon",
    operationInfiltration: "Infiltration",
    operationBlackout: "City Blackout",
    operationHeist: "Data Heist",

    operationScoutDesc:
      "Recon an unknown area and recover valuable intelligence.",

    operationInfiltrationDesc:
      "Enter a protected zone and extract classified information.",

    operationBlackoutDesc:
      "Temporarily disrupt the energy network of a district.",

    operationHeistDesc:
      "Break into the intelligence center and extract high-value data.",

    missionOperations:
      "Complete 3 successful operations",

    missionEarn:
      "Earn 5,000 NEX",

    missionMove:
      "Move around the city 10 times",

    missionBuy:
      "Buy one market item",

    missionReferral:
      "Invite one friend",

    missionDaily:
      "Collect the daily reward",

    eventNight:
      "Golden Night has started! Operation rewards are increased.",

    eventAlert:
      "Security Alert! Operation risk has increased.",

    eventCalm:
      "The city is calm. Operation energy costs are reduced.",

    noEvent:
      "No special city event is active.",

    profileStats: "Player Statistics",
    totalOperations: "Total Operations",
    successfulOperations: "Successful",
    failedOperations: "Failed",
    totalEarned: "Total Earned",

    rank1: "Shadow Commander",
    rank2: "Infiltrator",
    rank3: "Strategist",
    rank4: "Operator",
    rank5: "Rookie",

    cityName: "NEXUS CITY",

    welcome:
      "Welcome to the hidden city of NEXUS.",

    tapBuilding:
      "Tap buildings to enter different city systems.",

    loading:
      "Entering the city...",

    ready:
      "City ready.",

    dailyAlready:
      "Today's reward has already been collected.",

    dailyReceived:
      "Daily reward received.",

    purchaseSuccess:
      "Purchase completed.",

    investmentSuccess:
      "Investment completed.",

    upgradeSuccess:
      "City upgraded.",

    operationSuccess:
      "Operation completed successfully.",

    operationFailure:
      "Operation failed, but you gained experience.",

    routeSafeDesc:
      "Lower risk, slower execution and balanced reward.",

    routeBalancedDesc:
      "Balanced speed, risk and reward.",

    routeRiskyDesc:
      "Faster, riskier and higher reward.",

    operationProgress:
      "Operation Progress",

    phase1:
      "Scanning the environment...",

    phase2:
      "Crossing the security zone...",

    phase3:
      "Extracting with the intel...",

    nothing:
      "Nothing to display.",

    language: "Language",

    persian: "فارسی",
    english: "English"
  }
};


// ============================================================
// DEFAULT STATE
// ============================================================

const DEFAULT_STATE = {

  language: "fa",

  nex: 10000,
  energy: 100,

  xp: 0,
  level: 1,

  cityValue: 100000,
  cityLevel: 1,
  treasury: 0,

  intelligence: 1,
  gear: 1,

  player: {
    x: 0,
    y: 0,
    z: 8
  },

  stats: {
    operations: 0,
    successful: 0,
    failed: 0,
    totalEarned: 0,
    moves: 0
  },

  missions: {
    operations: 0,
    earned: 0,
    moves: 0,
    purchases: 0,
    referrals: 0,
    daily: 0
  },

  items: {
    energyPacks: 0,
    intelligenceBoosts: 0,
    gear: 1
  },

  referrals: {
    count: 0,
    earned: 0
  },

  incomingReferral: "",

  dailyDate: "",

  lastEvent: "",

  pendingPayments: [],

  event: {
    type: "none",
    expires: 0
  }
};


// ============================================================
// STATE
// ============================================================

let state = loadState();

function loadState() {

  try {

    const saved =
      JSON.parse(localStorage.getItem("NEXUS_STATE_V3"));

    if (!saved) {
      return JSON.parse(JSON.stringify(DEFAULT_STATE));
    }

    const merged =
      JSON.parse(JSON.stringify(DEFAULT_STATE));

    Object.assign(merged, saved);

    merged.player =
      Object.assign({}, DEFAULT_STATE.player, saved.player || {});

    merged.stats =
      Object.assign({}, DEFAULT_STATE.stats, saved.stats || {});

    merged.missions =
      Object.assign({}, DEFAULT_STATE.missions, saved.missions || {});

    merged.items =
      Object.assign({}, DEFAULT_STATE.items, saved.items || {});

    merged.referrals =
      Object.assign({}, DEFAULT_STATE.referrals, saved.referrals || {});

    merged.event =
      Object.assign({}, DEFAULT_STATE.event, saved.event || {});

    return merged;

  } catch (error) {

    console.warn("State load failed:", error);

    return JSON.parse(JSON.stringify(DEFAULT_STATE));
  }
}


function saveState() {

  try {

    localStorage.setItem(
      "NEXUS_STATE_V3",
      JSON.stringify(state)
    );

  } catch (error) {

    console.warn("State save failed:", error);
  }
}


// ============================================================
// DOM
// ============================================================

const $ = (id) => document.getElementById(id);

const languageScreen = $("language-screen");
const gameContainer = $("game-container");

const faButton = $("fa-button");
const enButton = $("en-button");

const nexValue = $("nex-value");
const energyValue = $("energy-value");
const levelValue = $("level-value");
const cityValue = $("city-value");

const nexLabel = $("nex-label");
const energyLabel = $("energy-label");
const levelLabel = $("level-label");
const cityValueLabel = $("city-value-label");

const actionPanel = $("action-panel");
const actionTitle = $("action-title");
const actionDescription = $("action-description");
const actionButton = $("action-button");

const modal = $("modal");
const modalTitle = $("modal-title");
const modalContent = $("modal-content");
const modalClose = $("modal-close");


// ============================================================
// TRANSLATION
// ============================================================

function t(key) {

  return TEXT[state.language]?.[key] ||
         TEXT.fa[key] ||
         key;
}


// ============================================================
// NUMBER FORMAT
// ============================================================

function formatNumber(value) {

  return new Intl.NumberFormat(
    state.language === "fa" ? "fa-IR" : "en-US"
  ).format(Math.floor(value || 0));
}


// ============================================================
// LANGUAGE
// ============================================================

function setLanguage(language) {

  if (language !== "fa" && language !== "en") {
    language = "fa";
  }

  state.language = language;

  document.documentElement.lang = language;
  document.documentElement.dir =
    language === "fa" ? "rtl" : "ltr";

  if (faButton) {
    faButton.classList.toggle("active", language === "fa");
  }

  if (enButton) {
    enButton.classList.toggle("active", language === "en");
  }

  updateInterface();
  saveState();
}


if (faButton) {
  faButton.addEventListener("click", () => {
    setLanguage("fa");
    startGame();
  });
}

if (enButton) {
  enButton.addEventListener("click", () => {
    setLanguage("en");
    startGame();
  });
}


// ============================================================
// HUD
// ============================================================

function updateHUD() {

  if (nexValue) {
    nexValue.textContent = formatNumber(state.nex);
  }

  if (energyValue) {
    energyValue.textContent =
      `${formatNumber(state.energy)}/100`;
  }

  if (levelValue) {
    levelValue.textContent =
      formatNumber(state.level);
  }

  if (cityValue) {
    cityValue.textContent =
      formatNumber(state.cityValue);
  }

  if (nexLabel) {
    nexLabel.textContent = t("nex");
  }

  if (energyLabel) {
    energyLabel.textContent = t("energy");
  }

  if (levelLabel) {
    levelLabel.textContent = t("level");
  }

  if (cityValueLabel) {
    cityValueLabel.textContent = t("city");
  }
}


function updateInterface() {

  updateHUD();

  document.querySelectorAll(".nav-button").forEach(button => {

    const page = button.dataset.page;

    const label =
      button.querySelector(".nav-label");

    if (!label) return;

    const map = {
      operations: "operations",
      missions: "missions",
      market: "market",
      ranking: "ranking",
      profile: "profile"
    };

    label.textContent =
      t(map[page] || page);
  });
}


// ============================================================
// MODAL
// ============================================================

function openModal(title, content, options = {}) {

  if (!modal || !modalTitle || !modalContent) {
    return;
  }

  modalTitle.textContent = title;
  modalContent.innerHTML = content;

  modal.classList.add("show");

  if (options.onOpen) {
    setTimeout(options.onOpen, 0);
  }
}


function closeModal() {

  if (!modal) return;

  modal.classList.remove("show");
}


if (modalClose) {
  modalClose.addEventListener("click", closeModal);
}

if (modal) {

  modal.addEventListener("click", event => {

    if (event.target === modal) {
      closeModal();
    }
  });
}


// ============================================================
// TOAST
// ============================================================

function toast(message) {

  const old = document.querySelector(".nexus-toast");

  if (old) old.remove();

  const element =
    document.createElement("div");

  element.className = "nexus-toast";

  element.textContent = message;

  Object.assign(element.style, {

    position: "fixed",
    left: "50%",
    bottom: "110px",
    transform: "translateX(-50%)",
    zIndex: "99999",
    background: "rgba(8,12,25,.94)",
    color: "#fff",
    border: "1px solid rgba(0,220,255,.55)",
    borderRadius: "14px",
    padding: "12px 18px",
    fontSize: "14px",
    boxShadow: "0 8px 30px rgba(0,0,0,.45)",
    backdropFilter: "blur(12px)",
    maxWidth: "85%",
    textAlign: "center"
  });

  document.body.appendChild(element);

  setTimeout(() => {

    element.style.opacity = "0";
    element.style.transition = "opacity .3s";

    setTimeout(() => element.remove(), 350);

  }, 2200);
}


// ============================================================
// EXTRA UI STYLE
// ============================================================

function installGameStyles() {

  if (document.getElementById("nexus-runtime-style")) {
    return;
  }

  const style =
    document.createElement("style");

  style.id = "nexus-runtime-style";

  style.textContent = `

    .nexus-toast {
      transition: opacity .3s ease;
    }

    .nexus-section {
      padding: 4px;
    }

    .nexus-card {
      background:
        linear-gradient(
          145deg,
          rgba(22,29,54,.94),
          rgba(7,11,25,.94)
        );
      border: 1px solid rgba(95,130,255,.24);
      border-radius: 18px;
      padding: 15px;
      margin-bottom: 11px;
      box-shadow:
        0 10px 30px rgba(0,0,0,.24),
        inset 0 1px 0 rgba(255,255,255,.04);
    }

    .nexus-card h3 {
      margin: 0 0 8px;
      font-size: 16px;
    }

    .nexus-muted {
      opacity: .72;
      font-size: 13px;
      line-height: 1.65;
    }

    .nexus-row {
      display: flex;
      gap: 9px;
      align-items: center;
      justify-content: space-between;
    }

    .nexus-grid {
      display: grid;
      grid-template-columns: repeat(2,minmax(0,1fr));
      gap: 10px;
    }

    .nexus-button {
      width: 100%;
      border: 0;
      border-radius: 13px;
      padding: 11px 12px;
      margin-top: 9px;
      color: white;
      background:
        linear-gradient(135deg,#465cff,#8a3ffc);
      font-weight: 700;
      cursor: pointer;
    }

    .nexus-button.alt {
      background:
        linear-gradient(135deg,#008ca8,#1e6ce0);
    }

    .nexus-button.green {
      background:
        linear-gradient(135deg,#087f62,#12b886);
    }

    .nexus-button.red {
      background:
        linear-gradient(135deg,#8b2547,#d63d64);
    }

    .nexus-button:disabled {
      opacity: .4;
      cursor: not-allowed;
    }

    .nexus-stat {
      text-align: center;
      background: rgba(255,255,255,.045);
      border-radius: 13px;
      padding: 11px;
    }

    .nexus-stat strong {
      display: block;
      font-size: 18px;
      margin-top: 4px;
    }

    .nexus-progress {
      height: 8px;
      border-radius: 20px;
      background: rgba(255,255,255,.08);
      overflow: hidden;
      margin-top: 9px;
    }

    .nexus-progress > div {
      height: 100%;
      background:
        linear-gradient(90deg,#00d4ff,#805cff);
      border-radius: inherit;
      transition: width .35s;
    }

    .nexus-wallet {
      word-break: break-all;
      font-family: monospace;
      font-size: 11px;
      opacity: .75;
      background: rgba(0,0,0,.22);
      border-radius: 10px;
      padding: 10px;
      margin-top: 8px;
    }

    .nexus-price {
      font-size: 12px;
      opacity: .7;
      margin-top: 4px;
    }

    .nexus-icon {
      font-size: 25px;
    }

    .nexus-operation {
      position: relative;
      overflow: hidden;
    }

    .nexus-operation::after {
      content: "";
      position: absolute;
      inset: 0;
      pointer-events: none;
      background:
        linear-gradient(
          120deg,
          transparent,
          rgba(0,220,255,.04),
          transparent
        );
    }

    .nexus-pill {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 20px;
      background: rgba(255,255,255,.07);
      font-size: 11px;
      margin: 3px;
    }

    .nexus-danger {
      color: #ff7893;
    }

    .nexus-good {
      color: #42e6a4;
    }

    .nexus-blue {
      color: #5edbff;
    }

    .route-button {
      text-align: right;
      cursor: pointer;
    }

    .route-button:hover {
      border-color: rgba(0,220,255,.6);
    }

    @media(max-width:420px) {

      .nexus-grid {
        grid-template-columns: 1fr;
      }

    }
  `;

  document.head.appendChild(style);
}


// ============================================================
// ACTION PANEL
// ============================================================

function showAction(title, description, buttonText, callback) {

  if (!actionPanel) return;

  actionTitle.textContent = title;
  actionDescription.textContent = description;
  actionButton.textContent = buttonText;

  actionPanel.style.display = "block";

  actionButton.onclick = callback;
}


function hideAction() {

  if (actionPanel) {
    actionPanel.style.display = "none";
  }
}


// ============================================================
// THREE.JS
// ============================================================

async function loadThree() {

  if (THREE) {
    return THREE;
  }

  try {

    THREE =
      await import(
        "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js"
      );

    return THREE;

  } catch (error) {

    console.error("Three.js failed:", error);

    toast(
      state.language === "fa"
        ? "لود موتور سه‌بعدی انجام نشد."
        : "3D engine could not load."
    );

    throw error;
  }
}


// ============================================================
// SCENE
// ============================================================

async function start3D() {

  if (threeReady) {
    return;
  }

  await loadThree();

  const cityElement =
    $("city");

  if (!cityElement) {
    throw new Error("City container not found.");
  }

  scene =
    new THREE.Scene();

  scene.background =
    new THREE.Color(0x050816);

  scene.fog =
    new THREE.FogExp2(
      0x050816,
      0.018
    );


  camera =
    new THREE.PerspectiveCamera(
      58,
      cityElement.clientWidth /
      Math.max(cityElement.clientHeight, 1),
      0.1,
      700
    );


  camera.position.set(
    15,
    13,
    17
  );


  renderer =
    new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: "high-performance"
    });


  renderer.setPixelRatio(
    Math.min(window.devicePixelRatio || 1, 1.7)
  );

  renderer.setSize(
    cityElement.clientWidth || window.innerWidth,
    cityElement.clientHeight || window.innerHeight
  );

  renderer.shadowMap.enabled = true;

  renderer.shadowMap.type =
    THREE.PCFSoftShadowMap;

  renderer.outputColorSpace =
    THREE.SRGBColorSpace;

  renderer.toneMapping =
    THREE.ACESFilmicToneMapping;

  renderer.toneMappingExposure = 1.15;


  cityElement.innerHTML = "";

  cityElement.appendChild(
    renderer.domElement
  );


  clock =
    new THREE.Clock();

  raycaster =
    new THREE.Raycaster();

  pointer =
    new THREE.Vector2();


  createWorld();

  bind3DEvents();

  threeReady = true;

  if (!animationStarted) {
    animationStarted = true;
    animate();
  }
}


// ============================================================
// WORLD
// ============================================================

function createWorld() {

  createLights();
  createSkyParticles();
  createGround();
  createRoads();
  createBuildings();
  createStreetLights();
  createCars();
  createPlayer();
}


// ============================================================
// LIGHTS
// ============================================================

function createLights() {

  const ambient =
    new THREE.HemisphereLight(
      0x6688ff,
      0x080914,
      1.5
    );

  scene.add(ambient);


  const moon =
    new THREE.DirectionalLight(
      0x9eb8ff,
      2.0
    );

  moon.position.set(
    -60,
    100,
    -30
  );

  moon.castShadow = true;

  moon.shadow.mapSize.width = 1024;
  moon.shadow.mapSize.height = 1024;

  moon.shadow.camera.left = -100;
  moon.shadow.camera.right = 100;
  moon.shadow.camera.top = 100;
  moon.shadow.camera.bottom = -100;

  scene.add(moon);


  const neon1 =
    new THREE.PointLight(
      0x00d9ff,
      35,
      90,
      2
    );

  neon1.position.set(
    -35,
    10,
    20
  );

  scene.add(neon1);


  const neon2 =
    new THREE.PointLight(
      0xa45cff,
      40,
      100,
      2
    );

  neon2.position.set(
    35,
    12,
    -25
  );

  scene.add(neon2);
}


// ============================================================
// GROUND
// ============================================================

function createGround() {

  const groundGeometry =
    new THREE.PlaneGeometry(
      260,
      260
    );

  const groundMaterial =
    new THREE.MeshStandardMaterial({
      color: 0x07101c,
      roughness: .82,
      metalness: .18
    });

  const ground =
    new THREE.Mesh(
      groundGeometry,
      groundMaterial
    );

  ground.rotation.x =
    -Math.PI / 2;

  ground.receiveShadow = true;

  scene.add(ground);


  const grid =
    new THREE.GridHelper(
      260,
      65,
      0x12314e,
      0x0b1b30
    );

  grid.position.y = .012;

  grid.material.transparent = true;
  grid.material.opacity = .3;

  scene.add(grid);
}


// ============================================================
// ROADS
// ============================================================

function createRoads() {

  const roadMaterial =
    new THREE.MeshStandardMaterial({
      color: 0x101827,
      roughness: .7,
      metalness: .35
    });


  const road1 =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        18,
        .08,
        260
      ),
      roadMaterial
    );

  road1.position.y = .04;

  scene.add(road1);


  const road2 =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        260,
        .08,
        18
      ),
      roadMaterial
    );

  road2.position.y = .045;

  scene.add(road2);


  const lineMaterial =
    new THREE.MeshBasicMaterial({
      color: 0x53dfff
    });


  for (let i = -120; i <= 120; i += 12) {

    const line =
      new THREE.Mesh(
        new THREE.BoxGeometry(
          .12,
          .1,
          5
        ),
        lineMaterial
      );

    line.position.set(
      0,
      .11,
      i
    );

    scene.add(line);
  }


  for (let i = -120; i <= 120; i += 12) {

    const line =
      new THREE.Mesh(
        new THREE.BoxGeometry(
          5,
          .1,
          .12
        ),
        lineMaterial
      );

    line.position.set(
      i,
      .11,
      0
    );

    scene.add(line);
  }
}


// ============================================================
// BUILDINGS
// ============================================================

const BUILDINGS = [

  {
    id: "hq",
    name: "headquarters",
    x: -30,
    z: -30,
    w: 15,
    d: 15,
    h: 30,
    color: 0x315cff,
    glow: 0x3c8cff
  },

  {
    id: "bank",
    name: "bank",
    x: 30,
    z: -30,
    w: 17,
    d: 17,
    h: 24,
    color: 0x13a77a,
    glow: 0x22e3ae
  },

  {
    id: "intel",
    name: "intelligence",
    x: -30,
    z: 30,
    w: 16,
    d: 16,
    h: 27,
    color: 0x9b43ff,
    glow: 0xc76bff
  },

  {
    id: "market",
    name: "marketBuilding",
    x: 30,
    z: 30,
    w: 18,
    d: 18,
    h: 21,
    color: 0xff6d31,
    glow: 0xffad52
  },

  {
    id: "tower1",
    name: "tower",
    x: -55,
    z: -8,
    w: 10,
    d: 10,
    h: 39,
    color: 0x244a74,
    glow: 0x27cfff
  },

  {
    id: "tower2",
    name: "tower",
    x: 55,
    z: 10,
    w: 11,
    d: 11,
    h: 44,
    color: 0x512b78,
    glow: 0xc15cff
  },

  {
    id: "tower3",
    name: "tower",
    x: -8,
    z: 58,
    w: 12,
    d: 12,
    h: 34,
    color: 0x215d63,
    glow: 0x3dfff0
  },

  {
    id: "tower4",
    name: "tower",
    x: 10,
    z: -58,
    w: 12,
    d: 12,
    h: 37,
    color: 0x70402b,
    glow: 0xff9b4b
  }
];


function createBuildings() {

  cityObjects = [];

  BUILDINGS.forEach(data => {

    const building =
      createBuilding(data);

    cityObjects.push(building);

    scene.add(building);
  });
}


function createBuilding(data) {

  const group =
    new THREE.Group();

  group.position.set(
    data.x,
    0,
    data.z
  );

  group.userData = {
    buildingId: data.id,
    buildingName: data.name
  };


  const body =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        data.w,
        data.h,
        data.d
      ),
      new THREE.MeshStandardMaterial({
        color: data.color,
        roughness: .48,
        metalness: .38
      })
    );

  body.position.y =
    data.h / 2;

  body.castShadow = true;
  body.receiveShadow = true;

  body.userData =
    group.userData;

  group.add(body);


  const roof =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        data.w * .88,
        .7,
        data.d * .88
      ),
      new THREE.MeshStandardMaterial({
        color: data.glow,
        emissive: data.glow,
        emissiveIntensity: .6
      })
    );

  roof.position.y =
    data.h + .35;

  roof.userData =
    group.userData;

  group.add(roof);


  addBuildingWindows(
    group,
    data
  );


  const ring =
    new THREE.Mesh(
      new THREE.TorusGeometry(
        Math.max(data.w, data.d) * .58,
        .08,
        8,
        32
      ),
      new THREE.MeshBasicMaterial({
        color: data.glow
      })
    );

  ring.rotation.x =
    Math.PI / 2;

  ring.position.y =
    data.h + 1.2;

  ring.userData =
    group.userData;

  group.add(ring);


  const beacon =
    new THREE.Mesh(
      new THREE.SphereGeometry(
        .28,
        12,
        12
      ),
      new THREE.MeshBasicMaterial({
        color: data.glow
      })
    );

  beacon.position.y =
    data.h + 2;

  beacon.userData =
    group.userData;

  group.add(beacon);


  return group;
}


// ============================================================
// WINDOWS
// ============================================================

function addBuildingWindows(
  group,
  data
) {

  const windowMaterial =
    new THREE.MeshBasicMaterial({
      color: 0x8deaff
    });


  const floors =
    Math.max(
      3,
      Math.floor(data.h / 4)
    );


  for (
    let floor = 1;
    floor < floors;
    floor++
  ) {

    const y =
      floor * 4;


    const countX =
      Math.max(
        2,
        Math.floor(data.w / 3)
      );


    for (
      let i = 0;
      i < countX;
      i++
    ) {

      const x =
        -data.w / 2 +
        1.5 +
        i * (
          (data.w - 3) /
          Math.max(countX - 1, 1)
        );


      const front =
        new THREE.Mesh(
          new THREE.BoxGeometry(
            .9,
            1.25,
            .08
          ),
          windowMaterial
        );

      front.position.set(
        x,
        y,
        data.d / 2 + .05
      );

      front.userData =
        group.userData;

      group.add(front);


      const back =
        front.clone();

      back.position.z =
        -data.d / 2 - .05;

      group.add(back);
    }
  }
}


// ============================================================
// STREET LIGHTS
// ============================================================

function createStreetLights() {

  const poleMaterial =
    new THREE.MeshStandardMaterial({
      color: 0x1c2533,
      metalness: .7,
      roughness: .3
    });

  const bulbMaterial =
    new THREE.MeshBasicMaterial({
      color: 0x8beaff
    });


  const positions = [];

  for (let z = -110; z <= 110; z += 22) {

    positions.push(
      [-11, z],
      [11, z],
      [z, -11],
      [z, 11]
    );
  }


  positions.forEach(([x, z]) => {

    const group =
      new THREE.Group();

    group.position.set(
      x,
      0,
      z
    );


    const pole =
      new THREE.Mesh(
        new THREE.CylinderGeometry(
          .09,
          .13,
          5,
          8
        ),
        poleMaterial
      );

    pole.position.y = 2.5;

    group.add(pole);


    const bulb =
      new THREE.Mesh(
        new THREE.SphereGeometry(
          .22,
          8,
          8
        ),
        bulbMaterial
      );

    bulb.position.y = 5.1;

    group.add(bulb);


    const light =
      new THREE.PointLight(
        0x4edbff,
        5,
        15
      );

    light.position.y = 5;

    group.add(light);

    streetLights.push(light);

    scene.add(group);
  });
}


// ============================================================
// CARS
// ============================================================

function createCars() {

  const colors = [
    0x26d9ff,
    0xff3d68,
    0xffb52d,
    0x7e63ff,
    0x42e6a4
  ];


  for (
    let i = 0;
    i < 12;
    i++
  ) {

    const group =
      new THREE.Group();

    const horizontal =
      i % 2 === 0;

    const body =
      new THREE.Mesh(
        new THREE.BoxGeometry(
          horizontal ? 2.8 : 1.5,
          .65,
          horizontal ? 1.5 : 2.8
        ),
        new THREE.MeshStandardMaterial({
          color: colors[i % colors.length],
          emissive:
            colors[i % colors.length],
          emissiveIntensity: .12,
          metalness: .65,
          roughness: .28
        })
      );

    body.position.y = .55;

    body.castShadow = true;

    group.add(body);


    const cabin =
      new THREE.Mesh(
        new THREE.BoxGeometry(
          horizontal ? 1.35 : .9,
          .45,
          horizontal ? .9 : 1.35
        ),
        new THREE.MeshStandardMaterial({
          color: 0x111b2b,
          metalness: .6,
          roughness: .2
        })
      );

    cabin.position.y = .98;

    group.add(cabin);


    const lightColor =
      horizontal
        ? 0x4beaff
        : 0xff4d70;


    const lamp =
      new THREE.PointLight(
        lightColor,
        3,
        9
      );

    lamp.position.y = .7;

    group.add(lamp);


    if (horizontal) {

      group.position.set(
        -120 + i * 17,
        0,
        i % 4 === 0 ? -4 : 4
      );

    } else {

      group.position.set(
        i % 4 === 0 ? -4 : 4,
        0,
        -120 + i * 17
      );
    }


    group.userData = {
      horizontal,
      speed:
        .04 +
        Math.random() * .035,
      direction:
        horizontal
          ? 1
          : 1
    };


    movingCars.push(group);

    scene.add(group);
  }
}


// ============================================================
// PARTICLES / SKY
// ============================================================

function createSkyParticles() {

  const count = 550;

  const geometry =
    new THREE.BufferGeometry();

  const positions =
    new Float32Array(
      count * 3
    );


  for (
    let i = 0;
    i < count;
    i++
  ) {

    positions[i * 3] =
      (Math.random() - .5) * 250;

    positions[i * 3 + 1] =
      15 +
      Math.random() * 90;

    positions[i * 3 + 2] =
      (Math.random() - .5) * 250;
  }


  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(
      positions,
      3
    )
  );


  const material =
    new THREE.PointsMaterial({
      color: 0x7ccfff,
      size: .35,
      transparent: true,
      opacity: .7
    });


  const stars =
    new THREE.Points(
      geometry,
      material
    );

  scene.add(stars);

  particles.push(stars);
}


// ============================================================
// PLAYER
// ============================================================

function createPlayer() {

  playerGroup =
    new THREE.Group();

  playerGroup.position.set(
    state.player.x,
    state.player.y,
    state.player.z
  );


  const bodyMaterial =
    new THREE.MeshStandardMaterial({
      color: 0x151b2e,
      roughness: .4,
      metalness: .35
    });


  const jacketMaterial =
    new THREE.MeshStandardMaterial({
      color: 0x315cff,
      emissive: 0x0d2c8e,
      emissiveIntensity: .35,
      roughness: .35,
      metalness: .3
    });


  const skinMaterial =
    new THREE.MeshStandardMaterial({
      color: 0xc78c6b,
      roughness: .7
    });


  const body =
    new THREE.Mesh(
      new THREE.CapsuleGeometry(
        .62,
        1.25,
        6,
        12
      ),
      jacketMaterial
    );

  body.position.y = 1.25;

  body.castShadow = true;

  playerGroup.add(body);


  const head =
    new THREE.Mesh(
      new THREE.SphereGeometry(
        .46,
        16,
        16
      ),
      skinMaterial
    );

  head.position.y = 2.35;

  head.castShadow = true;

  playerGroup.add(head);


  const visor =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        .55,
        .15,
        .08
      ),
      new THREE.MeshBasicMaterial({
        color: 0x65eaff
      })
    );

  visor.position.set(
    0,
    2.4,
    .42
  );

  playerGroup.add(visor);


  const backpack =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        .7,
        .9,
        .35
      ),
      bodyMaterial
    );

  backpack.position.set(
    0,
    1.35,
    -.5
  );

  playerGroup.add(backpack);


  const ring =
    new THREE.Mesh(
      new THREE.TorusGeometry(
        .9,
        .055,
        8,
        40
      ),
      new THREE.MeshBasicMaterial({
        color: 0x00dcff
      })
    );

  ring.rotation.x =
    Math.PI / 2;

  ring.position.y = .08;

  playerGroup.add(ring);


  const glow =
    new THREE.PointLight(
      0x00d9ff,
      5,
      9
    );

  glow.position.y = 1.3;

  playerGroup.add(glow);


  scene.add(playerGroup);

  player =
    playerGroup;
}


// ============================================================
// 3D EVENTS
// ============================================================

function bind3DEvents() {

  const element =
    renderer.domElement;


  element.addEventListener(
    "pointerdown",
    onPointerDown,
    { passive: true }
  );


  element.addEventListener(
    "pointermove",
    onPointerMove,
    { passive: true }
  );


  element.addEventListener(
    "pointerup",
    onPointerUp,
    { passive: true }
  );


  element.addEventListener(
    "pointercancel",
    onPointerUp,
    { passive: true }
  );


  element.addEventListener(
    "click",
    onCityClick
  );
}


function onPointerDown(event) {

  draggingCamera = true;

  lastPointerX = event.clientX;
  lastPointerY = event.clientY;
}


function onPointerMove(event) {

  if (!draggingCamera) return;

  const dx =
    event.clientX - lastPointerX;

  const dy =
    event.clientY - lastPointerY;


  cameraYaw -= dx * .006;

  cameraPitch += dy * .004;


  cameraPitch =
    Math.max(
      .25,
      Math.min(
        .95,
        cameraPitch
      )
    );


  lastPointerX =
    event.clientX;

  lastPointerY =
    event.clientY;
}


function onPointerUp() {

  draggingCamera = false;
}


// ============================================================
// CITY CLICK
// ============================================================

function onCityClick(event) {

  if (!renderer || !camera) return;

  const rect =
    renderer.domElement.getBoundingClientRect();


  pointer.x =
    ((event.clientX - rect.left) /
      rect.width) * 2 - 1;

  pointer.y =
    -((event.clientY - rect.top) /
      rect.height) * 2 + 1;


  raycaster.setFromCamera(
    pointer,
    camera
  );


  const objects = [];

  cityObjects.forEach(group => {

    group.traverse(child => {

      if (child.isMesh) {
        objects.push(child);
      }

    });
  });


  const hits =
    raycaster.intersectObjects(
      objects,
      true
    );


  if (!hits.length) return;


  const object =
    hits[0].object;


  const data =
    object.userData;


  if (!data?.buildingId) return;


  openBuilding(
    data.buildingId
  );
}


// ============================================================
// BUILDING INTERACTIONS
// ============================================================

function openBuilding(id) {

  hideAction();


  if (id === "hq") {
    openOperations();
    return;
  }

  if (id === "bank") {
    openBank();
    return;
  }

  if (id === "intel") {
    openIntelligence();
    return;
  }

  if (id === "market") {
    openMarket();
    return;
  }


  openModal(
    t("cityName"),
    `
      <div class="nexus-card">
        <h3>${t("event")}</h3>
        <p class="nexus-muted">
          ${t("tapBuilding")}
        </p>
      </div>
    `
  );
}


// ============================================================
// OPERATIONS
// ============================================================

const OPERATIONS = [

  {
    id: "scout",
    title: "operationScout",
    description: "operationScoutDesc",
    energy: 10,
    rewardMin: 300,
    rewardMax: 700,
    xp: 15,
    risk: 15
  },

  {
    id: "infiltration",
    title: "operationInfiltration",
    description: "operationInfiltrationDesc",
    energy: 18,
    rewardMin: 700,
    rewardMax: 1500,
    xp: 30,
    risk: 30
  },

  {
    id: "blackout",
    title: "operationBlackout",
    description: "operationBlackoutDesc",
    energy: 30,
    rewardMin: 1500,
    rewardMax: 3500,
    xp: 55,
    risk: 45
  },

  {
    id: "heist",
    title: "operationHeist",
    description: "operationHeistDesc",
    energy: 42,
    rewardMin: 3000,
    rewardMax: 6500,
    xp: 80,
    risk: 60
  }
];


function openOperations() {

  let html =
    `<div class="nexus-section">`;


  html += `
    <div class="nexus-card">
      <h3>🎯 ${t("operation")}</h3>
      <div class="nexus-muted">
        ${t("chooseRoute")}
      </div>
    </div>
  `;


  OPERATIONS.forEach(operation => {

    const risk =
      Math.max(
        5,
        operation.risk -
        state.intelligence * 3 -
        state.gear * 2
      );


    html += `
      <div class="nexus-card nexus-operation">

        <div class="nexus-row">

          <div>
            <div class="nexus-icon">🎯</div>
          </div>

          <div style="flex:1">

            <h3>
              ${t(operation.title)}
            </h3>

            <div class="nexus-muted">
              ${t(operation.description)}
            </div>

          </div>

        </div>


        <div style="margin-top:10px">

          <span class="nexus-pill">
            ⚡ ${operation.energy}
          </span>

          <span class="nexus-pill">
            💰 ${formatNumber(operation.rewardMin)}
            -
            ${formatNumber(operation.rewardMax)}
          </span>

          <span class="nexus-pill">
            🎖 ${operation.xp} XP
          </span>

          <span class="nexus-pill nexus-danger">
            ⚠ ${risk}%
          </span>

        </div>


        <button
          class="nexus-button"
          onclick="NEXUS_openOperation('${operation.id}')"
        >
          ${t("start")}
        </button>

      </div>
    `;
  });


  html += `</div>`;


  openModal(
    t("operations"),
    html
  );
}


window.NEXUS_openOperation =
  function(id) {

    const operation =
      OPERATIONS.find(
        item => item.id === id
      );

    if (!operation) return;


    if (state.energy < operation.energy) {

      toast(t("insufficientEnergy"));

      return;
    }


    let html = `

      <div class="nexus-card">

        <h3>
          🎯 ${t(operation.title)}
        </h3>

        <p class="nexus-muted">
          ${t(operation.description)}
        </p>

        <div class="nexus-row">

          <span>
            ⚡ ${operation.energy}
          </span>

          <span>
            🎖 ${operation.xp} XP
          </span>

        </div>

      </div>


      <div class="nexus-card">

        <h3>
          ${t("route")}
        </h3>

        <div
          class="nexus-card route-button"
          onclick="NEXUS_beginOperation('${operation.id}','safe')"
        >
          🛡️ <strong>${t("safe")}</strong>
          <div class="nexus-muted">
            ${t("routeSafeDesc")}
          </div>
        </div>


        <div
          class="nexus-card route-button"
          onclick="NEXUS_beginOperation('${operation.id}','balanced')"
        >
          ⚖️ <strong>${t("balanced")}</strong>
          <div class="nexus-muted">
            ${t("routeBalancedDesc")}
          </div>
        </div>


        <div
          class="nexus-card route-button"
          onclick="NEXUS_beginOperation('${operation.id}','risky')"
        >
          ⚡ <strong>${t("risky")}</strong>
          <div class="nexus-muted">
            ${t("routeRiskyDesc")}
          </div>
        </div>

      </div>
    `;


    openModal(
      t("operationBriefing"),
      html
    );
  };


// ============================================================
// OPERATION ENGINE
// ============================================================

window.NEXUS_beginOperation =
  function(
    operationId,
    route
  ) {

    if (operationRunning) {
      return;
    }


    const operation =
      OPERATIONS.find(
        item => item.id === operationId
      );


    if (!operation) return;


    if (state.energy < operation.energy) {

      toast(t("insufficientEnergy"));

      return;
    }


    state.energy -=
      operation.energy;


    state.stats.operations++;

    operationRunning = true;

    operationData = {
      operation,
      route,
      phase: 0,
      progress: 0
    };


    saveState();

    runOperationPhase();
  };


function runOperationPhase() {

  if (!operationData) return;


  const {
    operation,
    route
  } = operationData;


  const phases = [
    t("phase1"),
    t("phase2"),
    t("phase3")
  ];


  operationData.phase = 0;

  operationData.progress = 0;


  openModal(
    t("operationProgress"),
    `
      <div class="nexus-card">

        <h3>
          🎯 ${t(operation.title)}
        </h3>

        <p id="operation-phase">
          ${phases[0]}
        </p>

        <div class="nexus-progress">
          <div
            id="operation-progress"
            style="width:0%"
          ></div>
        </div>

        <div
          id="operation-percent"
          style="text-align:center;margin-top:8px"
        >
          0%
        </div>

      </div>
    `
  );


  const duration =
    route === "safe"
      ? 1350
      : route === "balanced"
        ? 1050
        : 800;


  let start =
    performance.now();


  function tick(now) {

    if (!operationRunning) {
      return;
    }


    const elapsed =
      now - start;


    const total =
      duration * 3;


    const percent =
      Math.min(
        100,
        (elapsed / total) * 100
      );


    const phase =
      Math.min(
        2,
        Math.floor(
          percent / 33.34
        )
      );


    const phaseText =
      document.getElementById(
        "operation-phase"
      );


    const progress =
      document.getElementById(
        "operation-progress"
      );


    const percentText =
      document.getElementById(
        "operation-percent"
      );


    if (phaseText) {
      phaseText.textContent =
        phases[phase];
    }


    if (progress) {
      progress.style.width =
        `${percent}%`;
    }


    if (percentText) {
      percentText.textContent =
        `${Math.floor(percent)}%`;
    }


    if (percent >= 100) {

      finishOperation();

      return;
    }


    requestAnimationFrame(tick);
  }


  requestAnimationFrame(tick);
}


function finishOperation() {

  if (!operationData) return;


  const {
    operation,
    route
  } = operationData;


  let risk =
    operation.risk;


  if (route === "safe") {
    risk -= 15;
  }

  if (route === "risky") {
    risk += 12;
  }


  risk -=
    state.intelligence * 4;

  risk -=
    state.gear * 2;


  if (state.event.type === "alert") {
    risk += 12;
  }

  if (state.event.type === "golden") {
    risk -= 5;
  }

  if (state.event.type === "calm") {
    risk -= 5;
  }


  risk =
    Math.max(
      3,
      Math.min(
        85,
        risk
      )
    );


  const roll =
    Math.random() * 100;


  const success =
    roll >= risk;


  const baseReward =
    randomInt(
      operation.rewardMin,
      operation.rewardMax
    );


  let reward =
    baseReward;


  if (route === "safe") {
    reward =
      Math.floor(reward * .88);
  }

  if (route === "risky") {
    reward =
      Math.floor(reward * 1.22);
  }


  if (state.event.type === "golden") {
    reward =
      Math.floor(reward * 1.35);
  }


  let earnedXP =
    operation.xp;


  if (!success) {

    earnedXP =
      Math.floor(
        earnedXP * .45
      );

    state.stats.failed++;

    state.missions.moves =
      state.missions.moves;

    addXP(earnedXP);


    operationRunning = false;

    operationData = null;

    saveState();


    openModal(
      t("failure"),
      `
        <div class="nexus-card">

          <div style="font-size:42px;text-align:center">
            ⚠️
          </div>

          <h3 style="text-align:center">
            ${t("operationFailure")}
          </h3>

          <div class="nexus-stat">
            <span>${t("risk")}</span>
            <strong>${risk}%</strong>
          </div>

          <div class="nexus-stat" style="margin-top:8px">
            <span>${t("xp")}</span>
            <strong>+${earnedXP}</strong>
          </div>

        </div>
      `
    );

    updateHUD();

    return;
  }


  state.stats.successful++;

  state.stats.totalEarned +=
    reward;

  state.nex +=
    reward;


  addXP(
    earnedXP
  );


  state.missions.operations++;

  state.missions.earned +=
    reward;


  operationRunning = false;

  operationData = null;

  saveState();


  openModal(
    t("success"),
    `
      <div class="nexus-card">

        <div style="font-size:48px;text-align:center">
          🏆
        </div>

        <h3 style="text-align:center">
          ${t("operationSuccess")}
        </h3>

        <div class="nexus-grid">

          <div class="nexus-stat">
            <span>💰 ${t("reward")}</span>
            <strong>
              +${formatNumber(reward)}
            </strong>
          </div>

          <div class="nexus-stat">
            <span>🎖 ${t("xp")}</span>
            <strong>
              +${earnedXP}
            </strong>
          </div>

        </div>

        <div class="nexus-card" style="margin-top:10px">

          <div>
            ${t("route")}
          </div>

          <strong>
            ${
              route === "safe"
                ? t("safe")
                : route === "balanced"
                  ? t("balanced")
                  : t("risky")
            }
          </strong>

        </div>

      </div>
    `
  );


  updateHUD();
}


// ============================================================
// RANDOM
// ============================================================

function randomInt(min, max) {

  return Math.floor(
    Math.random() *
      (max - min + 1)
  ) + min;
}


// ============================================================
// XP / LEVEL
// ============================================================

function xpRequired() {

  return (
    100 +
    (state.level - 1) * 75
  );
}


function addXP(amount) {

  state.xp += amount;


  while (
    state.xp >= xpRequired()
  ) {

    state.xp -=
      xpRequired();

    state.level++;

    state.energy =
      Math.min(
        100,
        state.energy + 20
      );

    state.cityValue +=
      state.level * 2500;

    toast(
      state.language === "fa"
        ? `🎉 سطح ${state.level} شدی!`
        : `🎉 You reached level ${state.level}!`
    );
  }


  saveState();

  updateHUD();
}


// ============================================================
// MISSIONS
// ============================================================

const MISSION_DATA = [

  {
    id: "operations",
    title: "missionOperations",
    reward: 2500,
    target: 3
  },

  {
    id: "earned",
    title: "missionEarn",
    reward: 3000,
    target: 5000
  },

  {
    id: "moves",
    title: "missionMove",
    reward: 1200,
    target: 10
  },

  {
    id: "purchases",
    title: "missionBuy",
    reward: 1500,
    target: 1
  },

  {
    id: "referrals",
    title: "missionReferral",
    reward: 2500,
    target: 1
  },

  {
    id: "daily",
    title: "missionDaily",
    reward: 1000,
    target: 1
  }
];


function openMissions() {

  let html =
    `<div class="nexus-section">`;


  MISSION_DATA.forEach(mission => {

    const progress =
      Number(
        state.missions[mission.id] || 0
      );


    const percent =
      Math.min(
        100,
        (progress / mission.target) * 100
      );


    const completed =
      progress >= mission.target;


    const claimedKey =
      `mission_${mission.id}_claimed`;


    const claimed =
      localStorage.getItem(
        claimedKey
      ) === "1";


    html += `

      <div class="nexus-card">

        <div class="nexus-row">

          <div style="flex:1">

            <h3>
              🧩 ${t(mission.title)}
            </h3>

            <div class="nexus-muted">
              ${formatNumber(progress)}
              /
              ${formatNumber(mission.target)}
            </div>

          </div>

          <div>
            💰
            ${formatNumber(mission.reward)}
          </div>

        </div>


        <div class="nexus-progress">
          <div
            style="width:${percent}%"
          ></div>
        </div>


        <button
          class="nexus-button green"
          ${
            !completed || claimed
              ? "disabled"
              : ""
          }
          onclick="
            NEXUS_claimMission('${mission.id}')
          "
        >
          ${
            claimed
              ? t("claimed")
              : completed
                ? t("claim")
                : `${Math.floor(percent)}%`
          }
        </button>

      </div>
    `;
  });


  html += `</div>`;


  openModal(
    t("missionsTitle"),
    html
  );
}


window.NEXUS_claimMission =
  function(id) {

    const mission =
      MISSION_DATA.find(
        item => item.id === id
      );

    if (!mission) return;


    const progress =
      Number(
        state.missions[id] || 0
      );


    if (progress < mission.target) {
      return;
    }


    const key =
      `mission_${id}_claimed`;


    if (
      localStorage.getItem(key) === "1"
    ) {
      return;
    }


    state.nex +=
      mission.reward;


    localStorage.setItem(
      key,
      "1"
    );


    saveState();

    updateHUD();

    toast(
      `+${formatNumber(mission.reward)} NEX`
    );

    openMissions();
  };


// ============================================================
// MARKET
// ============================================================

const MARKET_ITEMS = [

  {
    id: "energy",
    icon: "⚡",
    title: "energyPack",
    description:
      "انرژی شهر را بازیابی کن.",
    cost: 800,
    effect: "energy"
  },

  {
    id: "intel",
    icon: "🧠",
    title: "intelligenceBoost",
    description:
      "سطح اطلاعات را افزایش بده.",
    cost: 2500,
    effect: "intel"
  },

  {
    id: "upgrade",
    icon: "🏙️",
    title: "cityUpgrade",
    description:
      "ارزش و سطح شهر را افزایش بده.",
    cost: 5000,
    effect: "city"
  },

  {
    id: "gear",
    icon: "🎒",
    title: "operationGear",
    description:
      "تجهیزات بهتر برای کاهش ریسک عملیات.",
    cost: 3500,
    effect: "gear"
  }
];


function openMarket() {

  let html =
    `<div class="nexus-grid">`;


  MARKET_ITEMS.forEach(item => {

    html += `

      <div class="nexus-card">

        <div class="nexus-icon">
          ${item.icon}
        </div>

        <h3>
          ${t(item.title)}
        </h3>

        <div class="nexus-muted">
          ${item.description}
        </div>

        <div style="margin-top:8px">
          💰 ${formatNumber(item.cost)} NEX
        </div>

        <button
          class="nexus-button"
          onclick="
            NEXUS_buyMarket('${item.id}')
          "
        >
          ${t("buy")}
        </button>

      </div>
    `;
  });


  html += `</div>`;


  openModal(
    t("marketTitle"),
    html
  );
}


window.NEXUS_buyMarket =
  function(id) {

    const item =
      MARKET_ITEMS.find(
        x => x.id === id
      );

    if (!item) return;


    if (state.nex < item.cost) {

      toast(
        t("insufficientNex")
      );

      return;
    }


    state.nex -=
      item.cost;


    state.missions.purchases++;


    if (item.effect === "energy") {

      state.energy =
        Math.min(
          100,
          state.energy + 45
        );

      state.items.energyPacks++;
    }


    if (item.effect === "intel") {

      state.intelligence =
        Math.min(
          10,
          state.intelligence + 1
        );

      state.items.intelligenceBoosts++;
    }


    if (item.effect === "city") {

      state.cityLevel++;

      state.cityValue +=
        10000 +
        state.cityLevel * 2500;
    }


    if (item.effect === "gear") {

      state.gear =
        Math.min(
          10,
          state.gear + 1
        );

      state.items.gear =
        state.gear;
    }


    saveState();

    updateHUD();

    toast(
      t("purchaseSuccess")
    );

    openMarket();
  };


// ============================================================
// BANK
// ============================================================

function openBank() {

  const investmentCost =
    2500 +
    state.cityLevel * 1500;


  const html = `

    <div class="nexus-card">

      <h3>
        🏦 ${t("bankTitle")}
      </h3>

      <div class="nexus-grid">

        <div class="nexus-stat">
          <span>${t("treasury")}</span>
          <strong>
            ${formatNumber(state.treasury)}
          </strong>
        </div>

        <div class="nexus-stat">
          <span>${t("cityLevel")}</span>
          <strong>
            ${formatNumber(state.cityLevel)}
          </strong>
        </div>

      </div>

      <button
        class="nexus-button green"
        onclick="
          NEXUS_investCity(${investmentCost})
        "
      >
        ${t("invest")}
        ·
        ${formatNumber(investmentCost)} NEX
      </button>

    </div>


    <div class="nexus-card">

      <h3>
        💎 ${t("buyNex")}
      </h3>

      <p class="nexus-muted">
        ${t("paymentSecurity")}
      </p>

      ${paymentPackage(
        "10000",
        "package10",
        "ton05"
      )}

      ${paymentPackage(
        "50000",
        "package50",
        "ton2"
      )}

      ${paymentPackage(
        "150000",
        "package150",
        "ton5"
      )}

      ${paymentPackage(
        "500000",
        "package500",
        "ton15"
      )}

    </div>


    <div class="nexus-card">

      <h3>
        🔐 ${t("wallet")}
      </h3>

      <div class="nexus-muted">
        ${t("walletAddress")}
      </div>

      <div class="nexus-wallet">
        ${WALLET_ADDRESS}
      </div>

      <button
        class="nexus-button alt"
        onclick="
          NEXUS_copyWallet()
        "
      >
        📋 ${t("copy")}
      </button>

      <button
        class="nexus-button"
        id="ton-connect-button"
        onclick="
          NEXUS_connectTON()
        "
      >
        🔗 ${t("connectWallet")}
      </button>

      <div
        id="ton-wallet-status"
        class="nexus-muted"
        style="margin-top:8px"
      >
      </div>

    </div>
  `;


  openModal(
    t("bankTitle"),
    html
  );

  setTimeout(
    initializeTonConnectUI,
    150
  );
}


function paymentPackage(
  amount,
  packageName,
  tonName
) {

  return `

    <div class="nexus-card">

      <div class="nexus-row">

        <div>
          <strong>
            ${t(packageName)}
          </strong>

          <div class="nexus-price">
            ${t(tonName)}
          </div>
        </div>

        <div>
          💎
        </div>

      </div>

      <button
        class="nexus-button"
        onclick="
          NEXUS_payTON(
            ${amount},
            '${tonName}'
          )
        "
      >
        ${t("payment")}
      </button>

    </div>
  `;
}


window.NEXUS_investCity =
  function(cost) {

    if (state.nex < cost) {

      toast(
        t("insufficientNex")
      );

      return;
    }


    state.nex -= cost;

    state.treasury += cost;

    state.cityValue +=
      Math.floor(
        cost * 1.8
      );


    saveState();

    updateHUD();

    toast(
      t("investmentSuccess")
    );

    openBank();
  };


// ============================================================
// TON CONNECT
// ============================================================

let tonConnectUI = null;
let tonConnectLoaded = false;


async function loadTonConnect() {

  if (
    window.TonConnectUI
  ) {
    tonConnectLoaded = true;
    return true;
  }


  if (tonConnectLoaded) {
    return true;
  }


  return new Promise(resolve => {

    const existing =
      document.getElementById(
        "tonconnect-script"
      );


    if (existing) {

      existing.addEventListener(
        "load",
        () => {
          tonConnectLoaded = true;
          resolve(true);
        }
      );

      existing.addEventListener(
        "error",
        () => resolve(false)
      );

      return;
    }


    const script =
      document.createElement("script");


    script.id =
      "tonconnect-script";


    script.src =
      "https://unpkg.com/@tonconnect/ui@2.0.9/dist/tonconnect-ui.min.js";


    script.async = true;


    script.onload = () => {

      tonConnectLoaded = true;

      resolve(true);
    };


    script.onerror = () => {

      console.warn(
        "TON Connect UI failed to load."
      );

      resolve(false);
    };


    document.head.appendChild(
      script
    );
  });
}


async function initializeTonConnectUI() {

  const status =
    document.getElementById(
      "ton-wallet-status"
    );


  try {

    const loaded =
      await loadTonConnect();


    if (!loaded) {

      if (status) {
        status.textContent =
          t("connectWallet");
      }

      return;
    }


    if (
      !window.TonConnectUI
    ) {

      return;
    }


    if (!tonConnectUI) {

      tonConnectUI =
        new window.TonConnectUI({

          manifestUrl:
            MANIFEST_URL,

          buttonRootId:
            "ton-connect-button"
        });


      tonConnectUI.onStatusChange(
        wallet => {

          updateTonStatus(
            wallet
          );
        }
      );
    }


    const wallet =
      tonConnectUI.wallet;


    updateTonStatus(
      wallet
    );


  } catch (error) {

    console.warn(
      "TON initialization:",
      error
    );
  }
}


function updateTonStatus(wallet) {

  const status =
    document.getElementById(
      "ton-wallet-status"
    );


  if (!status) return;


  if (!wallet) {

    status.textContent =
      t("connectWallet");

    return;
  }


  const address =
    wallet.account?.address ||
    "";


  if (!address) {
    return;
  }


  status.innerHTML =
    `
      <span class="nexus-good">
        ✓ ${t("available")}
      </span>
      <br>
      <span>
        ${address.slice(0, 12)}
        ...
        ${address.slice(-8)}
      </span>
    `;
}


window.NEXUS_connectTON =
  async function() {

    try {

      if (!tonConnectUI) {

        await initializeTonConnectUI();
      }


      if (!tonConnectUI) {

        toast(
          state.language === "fa"
            ? "اتصال TON Connect در این دستگاه در دسترس نیست."
            : "TON Connect is unavailable on this device."
        );

        return;
      }


      if (tonConnectUI.wallet) {

        try {
          await tonConnectUI.disconnect();
        } catch (error) {
          console.warn(error);
        }

        return;
      }


      await tonConnectUI.openModal();

    } catch (error) {

      console.error(
        "TON connection:",
        error
      );

      toast(
        t("paymentFailed")
      );
    }
  };


// ============================================================
// TON PAYMENT
// ============================================================

window.NEXUS_payTON =
  async function(
    nexAmount,
    tonLabel
  ) {

    try {

      if (!tonConnectUI) {

        await initializeTonConnectUI();
      }


      if (!tonConnectUI) {

        toast(
          t("connectFirst")
        );

        return;
      }


      if (!tonConnectUI.wallet) {

        await tonConnectUI.openModal();

        toast(
          t("connectFirst")
        );

        return;
      }


      const nanotons =
        tonToNano(
          tonLabel
        );


      if (!nanotons) {

        toast(
          t("paymentFailed")
        );

        return;
      }


      const transaction = {

        validUntil:
          Math.floor(
            Date.now() / 1000
          ) + 600,

        messages: [

          {
            address:
              WALLET_ADDRESS,

            amount:
              nanotons
          }

        ]
      };


      const result =
        await tonConnectUI.sendTransaction(
          transaction
        );


      const payment = {

        id:
          `${Date.now()}_${Math.random()
            .toString(36)
            .slice(2)}`,

        nex:
          nexAmount,

        ton:
          tonLabel,

        createdAt:
          Date.now(),

        status:
          "pending",

        result:
          result
      };


      state.pendingPayments.push(
        payment
      );


      saveState();


      openModal(
        t("payment"),
        `
          <div class="nexus-card">

            <div
              style="
                font-size:48px;
                text-align:center
              "
            >
              ⏳
            </div>

            <h3
              style="text-align:center"
            >
              ${t("paymentPending")}
            </h3>

            <p class="nexus-muted">
              ${t("paymentSecurity")}
            </p>

            <div class="nexus-stat">
              <span>NEX</span>
              <strong>
                ${formatNumber(nexAmount)}
              </strong>
            </div>

            <div
              class="nexus-stat"
              style="margin-top:8px"
            >
              <span>TON</span>
              <strong>
                ${tonLabel}
              </strong>
            </div>

          </div>
        `
      );


    } catch (error) {

      console.error(
        "TON payment:",
        error
      );

      toast(
        t("paymentFailed")
      );
    }
  };


function tonToNano(label) {

  const normalized =
    String(label)
      .replace(",", ".")
      .replace("TON", "")
      .trim();


  const value =
    parseFloat(
      normalized
    );


  if (
    !Number.isFinite(value) ||
    value <= 0
  ) {
    return null;
  }


  return String(
    Math.floor(
      value * 1000000000
    )
  );
}


// ============================================================
// WALLET COPY
// ============================================================

window.NEXUS_copyWallet =
  async function() {

    try {

      await navigator.clipboard.writeText(
        WALLET_ADDRESS
      );

      toast(
        t("walletCopied")
      );

    } catch (error) {

      fallbackCopy(
        WALLET_ADDRESS
      );
    }
  };


function fallbackCopy(text) {

  const textarea =
    document.createElement(
      "textarea"
    );

  textarea.value =
    text;

  textarea.style.position =
    "fixed";

  textarea.style.opacity =
    "0";

  document.body.appendChild(
    textarea
  );

  textarea.select();

  document.execCommand(
    "copy"
  );

  textarea.remove();

  toast(
    t("copied")
  );
}


// ============================================================
// REFERRAL
// ============================================================

function getTelegramUserId() {

  return (
    tg?.initDataUnsafe?.user?.id ||
    ""
  );
}


function getStartParam() {

  return (
    tg?.initDataUnsafe?.start_param ||
    new URLSearchParams(
      window.location.search
    ).get("startapp") ||
    ""
  );
}


function initializeReferral() {

  const startParam =
    getStartParam();


  if (
    startParam &&
    startParam.startsWith("ref_")
  ) {

    state.incomingReferral =
      startParam.substring(4);

    saveState();
  }
}


function getReferralLink() {

  const userId =
    getTelegramUserId();


  if (userId) {

    return (
      `https://t.me/${BOT_USERNAME}` +
      `?startapp=ref_${userId}`
    );
  }


  const localId =
    getLocalPlayerId();


  return (
    `https://t.me/${BOT_USERNAME}` +
    `?startapp=ref_${localId}`
  );
}


function getLocalPlayerId() {

  let id =
    localStorage.getItem(
      "NEXUS_PLAYER_ID"
    );


  if (!id) {

    id =
      "player_" +
      Date.now().toString(36) +
      "_" +
      Math.random()
        .toString(36)
        .substring(2, 8);


    localStorage.setItem(
      "NEXUS_PLAYER_ID",
      id
    );
  }


  return id;
}


window.NEXUS_copyReferral =
  async function() {

    const link =
      getReferralLink();


    try {

      await navigator.clipboard.writeText(
        link
      );

      toast(
        t("referralCopied")
      );

    } catch (error) {

      fallbackCopy(
        link
      );
    }
  };


window.NEXUS_shareReferral =
  async function() {

    const link =
      getReferralLink();


    const text =
      state.language === "fa"
        ? "به NEXUS CITY بیا و شهر خودت را بساز 🎮🌃"
        : "Join NEXUS CITY and build your secret city 🎮🌃";


    if (
      navigator.share
    ) {

      try {

        await navigator.share({
          title: "NEXUS | Secret City",
          text,
          url: link
        });

        return;

      } catch (error) {
        console.warn(error);
      }
    }


    fallbackCopy(
      link
    );
  };


// ============================================================
// REFERRAL SCREEN
// ============================================================

function referralHTML() {

  const link =
    getReferralLink();


  return `

    <div class="nexus-card">

      <h3>
        👥 ${t("referral")}
      </h3>

      <p class="nexus-muted">
        ${
          state.language === "fa"
            ? "لینک اختصاصی خودت را برای دوستانت بفرست."
            : "Share your personal invitation link with friends."
        }
      </p>


      <div class="nexus-wallet">
        ${link}
      </div>


      <button
        class="nexus-button alt"
        onclick="NEXUS_copyReferral()"
      >
        📋 ${t("copy")}
      </button>


      <button
        class="nexus-button"
        onclick="NEXUS_shareReferral()"
      >
        📤 ${t("share")}
      </button>

    </div>


    <div class="nexus-grid">

      <div class="nexus-stat">

        <span>
          ${t("referralCount")}
        </span>

        <strong>
          ${formatNumber(
            state.referrals.count
          )}
        </strong>

      </div>


      <div class="nexus-stat">

        <span>
          ${t("referralEarned")}
        </span>

        <strong>
          ${formatNumber(
            state.referrals.earned
          )}
        </strong>

      </div>

    </div>


    ${
      state.incomingReferral
        ? `
          <div class="nexus-card">

            <h3>🎫 Referral</h3>

            <div class="nexus-muted">
              ${
                state.language === "fa"
                  ? "کد دعوت دریافت شد."
                  : "An invitation code was received."
              }
            </div>

            <div class="nexus-wallet">
              ${state.incomingReferral}
            </div>

          </div>
        `
        : ""
    }

  `;
}


// ============================================================
// DAILY REWARD
// ============================================================

function todayKey() {

  const date =
    new Date();

  return [
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate()
  ].join("-");
}


function claimDailyReward() {

  const today =
    todayKey();


  if (
    state.dailyDate === today
  ) {

    toast(
      t("dailyAlready")
    );

    return;
  }


  const nexReward =
    500 +
    state.level * 100;


  const energyReward =
    15;


  state.nex +=
    nexReward;


  state.energy =
    Math.min(
      100,
      state.energy + energyReward
    );


  state.dailyDate =
    today;


  state.missions.daily =
    1;


  saveState();

  updateHUD();


  openModal(
    t("dailyReward"),
    `
      <div class="nexus-card">

        <div
          style="
            font-size:50px;
            text-align:center
          "
        >
          🎁
        </div>

        <h3 style="text-align:center">
          ${t("dailyReceived")}
        </h3>

        <div class="nexus-grid">

          <div class="nexus-stat">
            <span>NEX</span>
            <strong>
              +${formatNumber(nexReward)}
            </strong>
          </div>

          <div class="nexus-stat">
            <span>${t("energy")}</span>
            <strong>
              +${energyReward}
            </strong>
          </div>

        </div>

      </div>
    `
  );
}


// ============================================================
// INTELLIGENCE
// ============================================================

function openIntelligence() {

  const riskReduction =
    state.intelligence * 4;


  const html = `

    <div class="nexus-card">

      <h3>
        🧠 ${t("intelligenceTitle")}
      </h3>

      <div class="nexus-grid">

        <div class="nexus-stat">

          <span>
            ${t("level")}
          </span>

          <strong>
            ${state.intelligence}
          </strong>

        </div>


        <div class="nexus-stat">

          <span>
            ${t("risk")}
          </span>

          <strong>
            -${riskReduction}%
          </strong>

        </div>

      </div>

    </div>


    <div class="nexus-card">

      <h3>
        🔎 ${t("event")}
      </h3>

      <p class="nexus-muted">
        ${getEventText()}
      </p>

    </div>


    <div class="nexus-card">

      <h3>
        🎒 ${t("operationGear")}
      </h3>

      <div class="nexus-muted">
        ${state.gear}/10
      </div>

      <div class="nexus-progress">

        <div
          style="
            width:${state.gear * 10}%
          "
        ></div>

      </div>

    </div>
  `;


  openModal(
    t("intelligenceTitle"),
    html
  );
}


// ============================================================
// RANKING
// ============================================================

function openRanking() {

  const score =
    calculateScore();


  const ranking =
    [

      {
        name: t("rank1"),
        score:
          95000 +
          state.level * 300
      },

      {
        name: t("rank2"),
        score:
          72000 +
          state.level * 200
      },

      {
        name: t("rank3"),
        score:
          54000 +
          state.level * 150
      },

      {
        name: t("player"),
        score
      },

      {
        name: t("rank4"),
        score:
          29000
      },

      {
        name: t("rank5"),
        score:
          12000
      }

    ]
      .sort(
        (a, b) =>
          b.score - a.score
      );


  let html =
    `<div class="nexus-section">`;


  ranking.forEach(
    (item, index) => {

      html += `

        <div class="nexus-card">

          <div class="nexus-row">

            <div>

              <strong>
                #${index + 1}
              </strong>

              &nbsp;

              ${item.name}

            </div>

            <strong>
              ${formatNumber(item.score)}
            </strong>

          </div>

        </div>
      `;
    }
  );


  html += `</div>`;


  openModal(
    t("rankingTitle"),
    html
  );
}


function calculateScore() {

  return (
    state.nex +
    state.cityValue / 5 +
    state.level * 1000 +
    state.stats.successful * 500
  );
}


// ============================================================
// PROFILE
// ============================================================

function openProfile() {

  const score =
    calculateScore();


  const html = `

    <div class="nexus-card">

      <h3>
        👤 ${t("profileTitle")}
      </h3>

      <div class="nexus-grid">

        <div class="nexus-stat">
          <span>${t("level")}</span>
          <strong>${state.level}</strong>
        </div>

        <div class="nexus-stat">
          <span>${t("score")}</span>
          <strong>${formatNumber(score)}</strong>
        </div>

        <div class="nexus-stat">
          <span>${t("cityLevel")}</span>
          <strong>${state.cityLevel}</strong>
        </div>

        <div class="nexus-stat">
          <span>${t("energy")}</span>
          <strong>${state.energy}</strong>
        </div>

      </div>

    </div>


    <div class="nexus-card">

      <h3>
        📊 ${t("profileStats")}
      </h3>

      <div class="nexus-row">
        <span>${t("totalOperations")}</span>
        <strong>
          ${formatNumber(
            state.stats.operations
          )}
        </strong>
      </div>

      <div class="nexus-row">
        <span>${t("successfulOperations")}</span>
        <strong>
          ${formatNumber(
            state.stats.successful
          )}
        </strong>
      </div>

      <div class="nexus-row">
        <span>${t("failedOperations")}</span>
        <strong>
          ${formatNumber(
            state.stats.failed
          )}
        </strong>
      </div>

      <div class="nexus-row">
        <span>${t("totalEarned")}</span>
        <strong>
          ${formatNumber(
            state.stats.totalEarned
          )}
        </strong>
      </div>

    </div>


    <div class="nexus-card">

      <h3>
        🎁 ${t("dailyReward")}
      </h3>

      <button
        class="nexus-button green"
        onclick="NEXUS_claimDaily()"
      >
        ${t("collect")}
      </button>

    </div>


    ${referralHTML()}


    <div class="nexus-card">

      <h3>
        🌐 ${t("language")}
      </h3>

      <div class="nexus-grid">

        <button
          class="nexus-button"
          onclick="
            NEXUS_changeLanguage('fa')
          "
        >
          🇮🇷 ${t("persian")}
        </button>

        <button
          class="nexus-button alt"
          onclick="
            NEXUS_changeLanguage('en')
          "
        >
          🇬🇧 ${t("english")}
        </button>

      </div>

    </div>
  `;


  openModal(
    t("profileTitle"),
    html
  );
}


window.NEXUS_changeLanguage =
  function(language) {

    setLanguage(
      language
    );

    openProfile();
  };


window.NEXUS_claimDaily =
  function() {

    claimDailyReward();
  };


// ============================================================
// EVENTS
// ============================================================

function getEventText() {

  if (
    state.event.expires &&
    Date.now() >
      state.event.expires
  ) {

    state.event.type =
      "none";

    state.event.expires =
      0;
  }


  if (
    state.event.type ===
    "golden"
  ) {

    return t("eventNight");
  }


  if (
    state.event.type ===
    "alert"
  ) {

    return t("eventAlert");
  }


  if (
    state.event.type ===
    "calm"
  ) {

    return t("eventCalm");
  }


  return t("noEvent");
}


function createCityEvent() {

  const roll =
    Math.random();


  if (roll < .34) {

    state.event.type =
      "golden";

  } else if (roll < .67) {

    state.event.type =
      "alert";

  } else {

    state.event.type =
      "calm";
  }


  state.event.expires =
    Date.now() +
    5 * 60 * 1000;


  state.lastEvent =
    state.event.type;


  saveState();
}


function startEventLoop() {

  if (eventTimer) {
    clearInterval(eventTimer);
  }


  createCityEvent();


  eventTimer =
    setInterval(
      () => {

        createCityEvent();

        toast(
          getEventText()
        );

      },
      5 * 60 * 1000
    );
}


// ============================================================
// NAVIGATION
// ============================================================

function navigate(page) {

  switch (page) {

    case "operations":
      openOperations();
      break;

    case "missions":
      openMissions();
      break;

    case "market":
      openMarket();
      break;

    case "ranking":
      openRanking();
      break;

    case "profile":
      openProfile();
      break;

    default:
      break;
  }
}


document
  .querySelectorAll(".nav-button")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        navigate(
          button.dataset.page
        );

      }
    );
  });


// ============================================================
// MOVEMENT
// ============================================================

function movePlayer(
  direction
) {

  if (!player) return;


  const step =
    .8;


  if (direction === "up") {
    player.position.z -= step;
  }

  if (direction === "down") {
    player.position.z += step;
  }

  if (direction === "left") {
    player.position.x -= step;
  }

  if (direction === "right") {
    player.position.x += step;
  }


  player.position.x =
    Math.max(
      -112,
      Math.min(
        112,
        player.position.x
      )
    );


  player.position.z =
    Math.max(
      -112,
      Math.min(
        112,
        player.position.z
      )
    );


  state.player.x =
    player.position.x;

  state.player.z =
    player.position.z;


  state.missions.moves++;

  state.stats.moves++;


  saveState();
}


document
  .querySelectorAll(".move-button")
  .forEach(button => {

    const direction =
      button.dataset.direction;


    const move =
      () =>
        movePlayer(
          direction
        );


    button.addEventListener(
      "click",
      move
    );


    button.addEventListener(
      "touchstart",
      event => {

        event.preventDefault();

        move();

      },
      {
        passive: false
      }
    );
  });


// ============================================================
// KEYBOARD
// ============================================================

document.addEventListener(
  "keydown",
  event => {

    const key =
      event.key.toLowerCase();


    if (
      key === "w" ||
      key === "arrowup"
    ) {

      movePlayer("up");
    }


    if (
      key === "s" ||
      key === "arrowdown"
    ) {

      movePlayer("down");
    }


    if (
      key === "a" ||
      key === "arrowleft"
    ) {

      movePlayer("left");
    }


    if (
      key === "d" ||
      key === "arrowright"
    ) {

      movePlayer("right");
    }
  }
);


// ============================================================
// CAMERA
// ============================================================

function updateCamera() {

  if (!player || !camera) {
    return;
  }


  const target =
    new THREE.Vector3(
      player.position.x,
      player.position.y + 1.3,
      player.position.z
    );


  const horizontal =
    Math.cos(
      cameraPitch
    ) * cameraDistance;


  const vertical =
    Math.sin(
      cameraPitch
    ) * cameraDistance;


  const desired =
    new THREE.Vector3(

      target.x +
        Math.sin(cameraYaw) *
        horizontal,

      target.y +
        vertical,

      target.z +
        Math.cos(cameraYaw) *
        horizontal
    );


  camera.position.lerp(
    desired,
    .075
  );


  camera.lookAt(
    target
  );
}


// ============================================================
// ANIMATION
// ============================================================

function animate() {

  requestAnimationFrame(
    animate
  );


  if (!renderer || !scene || !camera) {
    return;
  }


  const delta =
    clock?.getDelta() || .016;


  const elapsed =
    clock?.elapsedTime || 0;


  movingCars.forEach(
    car => {

      if (
        car.userData.horizontal
      ) {

        car.position.x +=
          car.userData.speed * 25 *
          delta;


        if (
          car.position.x > 125
        ) {
          car.position.x = -125;
        }

      } else {

        car.position.z +=
          car.userData.speed * 25 *
          delta;


        if (
          car.position.z > 125
        ) {
          car.position.z = -125;
        }
      }
    }
  );


  streetLights.forEach(
    (light, index) => {

      light.intensity =
        4.5 +
        Math.sin(
          elapsed * 2 +
          index
        ) * .7;
    }
  );


  particles.forEach(
    particle => {

      particle.rotation.y +=
        delta * .006;

      particle.rotation.x +=
        delta * .002;
    }
  );


  if (player) {

    player.rotation.y +=
      Math.sin(elapsed * 2) *
      delta *
      .02;
  }


  updateCamera();

  renderer.render(
    scene,
    camera
  );
}


// ============================================================
// RESIZE
// ============================================================

window.addEventListener(
  "resize",
  () => {

    if (!renderer || !camera) {
      return;
    }


    const cityElement =
      $("city");


    if (!cityElement) return;


    const width =
      cityElement.clientWidth ||
      window.innerWidth;


    const height =
      cityElement.clientHeight ||
      window.innerHeight;


    camera.aspect =
      width / Math.max(height, 1);


    camera.updateProjectionMatrix();


    renderer.setSize(
      width,
      height
    );
  }
);


// ============================================================
// AUTO ENERGY RECOVERY
// ============================================================

function startEnergyRecovery() {

  setInterval(
    () => {

      if (
        state.energy < 100
      ) {

        state.energy =
          Math.min(
            100,
            state.energy + 1
          );

        saveState();

        updateHUD();
      }

    },
    60000
  );
}


// ============================================================
// DAILY INITIALIZATION
// ============================================================

function initializeDailyState() {

  const today =
    todayKey();


  if (
    state.dailyDate !== today
  ) {

    state.missions.daily =
      0;
  }
}


// ============================================================
// SAVE LOOP
// ============================================================

function startSaveLoop() {

  if (saveTimer) {
    clearInterval(saveTimer);
  }


  saveTimer =
    setInterval(
      saveState,
      10000
    );
}


// ============================================================
// START GAME
// ============================================================

async function startGame() {

  if (gameStarted) {
    return;
  }


  gameStarted = true;


  installGameStyles();

  initializeReferral();

  initializeDailyState();

  setLanguage(
    state.language
  );


  if (languageScreen) {
    languageScreen.style.display =
      "none";
  }


  if (gameContainer) {
    gameContainer.style.display =
      "block";
  }


  try {

    await start3D();

    toast(
      t("ready")
    );

  } catch (error) {

    console.error(
      "Game start error:",
      error
    );

    toast(
      t("loading")
    );
  }


  startEventLoop();

  startEnergyRecovery();

  startSaveLoop();

  updateHUD();
}


// ============================================================
// INITIAL STATE
// ============================================================

installGameStyles();

updateInterface();


// ============================================================
// OPTIONAL AUTO START
// ============================================================

if (
  localStorage.getItem(
    "NEXUS_LANGUAGE_SELECTED"
  ) === "1"
) {

  setTimeout(
    startGame,
    50
  );
}


// ============================================================
// LANGUAGE SELECTION MEMORY
// ============================================================

if (faButton) {

  faButton.addEventListener(
    "click",
    () => {

      localStorage.setItem(
        "NEXUS_LANGUAGE_SELECTED",
        "1"
      );

    }
  );
}


if (enButton) {

  enButton.addEventListener(
    "click",
    () => {

      localStorage.setItem(
        "NEXUS_LANGUAGE_SELECTED",
        "1"
      );

    }
  );
}


// ============================================================
// INITIAL HUD
// ============================================================

updateHUD();


// ============================================================
// END
// ============================================================
