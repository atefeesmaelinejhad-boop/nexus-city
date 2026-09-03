import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

/* =========================================================
   NEXUS | SECRET CITY
   Game Engine
   ========================================================= */

const tg = window.Telegram?.WebApp;

if (tg) {
  try {
    tg.ready();
    tg.expand();
  } catch (e) {
    console.warn("Telegram WebApp init:", e);
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

    hqDesc: "مرکز فرماندهی شهر و محل انجام عملیات.",
    bankDesc: "مدیریت دارایی‌ها و اقتصاد شهر.",
    intelligenceDesc: "اینجا پرونده‌های مخفی و مأموریت‌های ویژه پیدا می‌شوند.",
    marketDesc: "بازار شهر برای خرید تجهیزات و امکانات.",

    enter: "ورود",
    close: "بستن",
    back: "بازگشت",

    startMission: "شروع مأموریت",
    continueMission: "ادامه مأموریت",
    completed: "تکمیل شد",

    cost: "هزینه",
    reward: "پاداش",
    risk: "ریسک",

    low: "کم",
    medium: "متوسط",
    high: "زیاد",

    noEnergy: "انرژی کافی نداری.",
    noNex: "NEX کافی نداری.",
    missionStarted: "مأموریت آغاز شد.",
    missionComplete: "مأموریت با موفقیت تکمیل شد.",
    missionFailed: "مأموریت شکست خورد.",
    dailyReward: "پاداش روزانه دریافت شد: 1000 NEX",

    comingSoon: "این بخش به‌زودی فعال می‌شود.",

    reconTitle: "شناسایی منطقه ۷",
    reconDesc:
      "یک پیام رمزگذاری‌شده از منطقه ۷ دریافت شده. کسی نمی‌داند فرستنده کیست. باید قبل از اینکه ردپا از بین برود، منطقه را بررسی کنی.",

    shadowTitle: "پرونده: سایه",
    shadowDesc:
      "دوربین‌های شهر یک فرد ناشناس را ثبت کرده‌اند. او چند بار در اطراف بانک دیده شده و هر بار قبل از رسیدن نیروهای امنیتی ناپدید شده است.",

    blackoutTitle: "هشدار: خاموشی",
    blackoutDesc:
      "بخشی از شهر ناگهان خاموش شده. سیستم امنیتی مرکز اطلاعات نیز از کار افتاده است.",

    clueTitle: "سرنخ جدید",
    clueDesc:
      "یک فایل رمزگذاری‌شده پیدا کردی. برای باز کردن آن باید تصمیم بگیری از کدام مسیر استفاده کنی.",

    follow: "تعقیب فرد ناشناس",
    cameras: "بررسی دوربین‌ها",
    agent: "فرستادن مأمور",
    wait: "صبر کردن",

    hack: "نفوذ به سیستم",
    investigateBank: "بررسی بانک",
    callSecurity: "تماس با امنیت",

    openFile: "باز کردن فایل",
    destroyFile: "حذف فایل",

    success: "موفقیت",
    failure: "شکست",
    continue: "ادامه",

    rewardText: "پاداش",
    energyText: "انرژی",
    nexText: "NEX",
    xpText: "XP",

    daily: "پاداش روزانه"
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

    hqDesc: "The command center of the city and the place for operations.",
    bankDesc: "Manage your assets and city economy.",
    intelligenceDesc: "Secret files and special missions are discovered here.",
    marketDesc: "Buy equipment and city upgrades.",

    enter: "Enter",
    close: "Close",
    back: "Back",

    startMission: "Start Mission",
    continueMission: "Continue Mission",
    completed: "Completed",

    cost: "Cost",
    reward: "Reward",
    risk: "Risk",

    low: "Low",
    medium: "Medium",
    high: "High",

    noEnergy: "Not enough energy.",
    noNex: "Not enough NEX.",
    missionStarted: "Mission started.",
    missionComplete: "Mission completed successfully.",
    missionFailed: "Mission failed.",
    dailyReward: "Daily reward received: 1000 NEX",

    comingSoon: "This section is coming soon.",

    reconTitle: "Sector 7 Recon",
    reconDesc:
      "An encrypted message has arrived from Sector 7. Nobody knows who sent it. Investigate the area before the trail disappears.",

    shadowTitle: "Case: The Shadow",
    shadowDesc:
      "City cameras recorded an unknown person. They have been seen near the bank several times and disappear before security arrives.",

    blackoutTitle: "Alert: Blackout",
    blackoutDesc:
      "Part of the city has suddenly gone dark. The intelligence center security system is offline.",

    clueTitle: "New Clue",
    clueDesc:
      "You found an encrypted file. To open it, you must choose which route to take.",

    follow: "Follow the stranger",
    cameras: "Check the cameras",
    agent: "Send an agent",
    wait: "Wait",

    hack: "Hack the system",
    investigateBank: "Investigate the bank",
    callSecurity: "Call security",

    openFile: "Open the file",
    destroyFile: "Delete the file",

    success: "Success",
    failure: "Failure",
    continue: "Continue",

    rewardText: "Reward",
    energyText: "Energy",
    nexText: "NEX",
    xpText: "XP",

    daily: "Daily Reward"
  }
};

/* =========================================================
   GAME STATE
   ========================================================= */

const DEFAULT_STATE = {
  language: null,
  nex: 10000,
  energy: 100,
  xp: 0,
  level: 1,
  cityValue: 100000,
  cityLevel: 1,

  dailyClaimed: null,

  missions: {
    recon: "available",
    shadow: "locked",
    blackout: "locked"
  },

  missionProgress: {
    recon: 0,
    shadow: 0,
    blackout: 0
  },

  completedMissions: [],

  inventory: []
};

let state = loadState();

function loadState() {
  try {
    const saved = localStorage.getItem("NEXUS_STATE");

    if (saved) {
      return {
        ...DEFAULT_STATE,
        ...JSON.parse(saved),
        missions: {
          ...DEFAULT_STATE.missions,
          ...(JSON.parse(saved).missions || {})
        },
        missionProgress: {
          ...DEFAULT_STATE.missionProgress,
          ...(JSON.parse(saved).missionProgress || {})
        }
      };
    }
  } catch (error) {
    console.warn("Could not load state:", error);
  }

  return structuredClone(DEFAULT_STATE);
}

function saveState() {
  try {
    localStorage.setItem("NEXUS_STATE", JSON.stringify(state));
  } catch (error) {
    console.warn("Could not save state:", error);
  }
}

/* =========================================================
   HELPERS
   ========================================================= */

function t(key) {
  return TEXT[state.language || "fa"][key] || key;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function addXP(amount) {
  state.xp += amount;

  const required = state.level * 500;

  if (state.xp >= required) {
    state.xp -= required;
    state.level += 1;
    state.cityLevel += 1;
    state.cityValue += 5000;

    showMessage(
      state.language === "fa"
        ? `🎉 سطح جدید! سطح ${state.level}`
        : `🎉 Level up! Level ${state.level}`
    );
  }
}

/* =========================================================
   DOM
   ========================================================= */

const $ = (id) => document.getElementById(id);

function setText(id, value) {
  const el = $(id);
  if (el) el.textContent = value;
}

function showElement(id) {
  const el = $(id);
  if (el) el.style.display = "";
}

function hideElement(id) {
  const el = $(id);
  if (el) el.style.display = "none";
}

/* =========================================================
   LANGUAGE
   ========================================================= */

function setLanguage(language) {
  if (!TEXT[language]) return;

  state.language = language;
  saveState();

  document.documentElement.lang = language;
  document.documentElement.dir = language === "fa" ? "rtl" : "ltr";

  updateInterface();

  const screen = $("language-screen");

  if (screen) {
    screen.style.display = "none";
  }

  const game = $("game-container");

  if (game) {
    game.style.display = "block";
  }
}

window.NEXUS_setLanguage = setLanguage;

/* =========================================================
   INTERFACE
   ========================================================= */

function updateInterface() {
  updateHUD();
  updateStaticTexts();
}

function updateHUD() {
  setText("nex-value", state.nex.toLocaleString());
  setText("energy-value", state.energy.toLocaleString());
  setText("xp-value", state.xp.toLocaleString());
  setText("level-value", state.level.toString());
  setText("city-value", state.cityValue.toLocaleString());

  const xpBar = $("xp-bar");

  if (xpBar) {
    const required = state.level * 500;
    const percent = clamp((state.xp / required) * 100, 0, 100);
    xpBar.style.width = `${percent}%`;
  }
}

function updateStaticTexts() {
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

  clearTimeout(showMessage.timer);

  showMessage.timer = setTimeout(() => {
    box.classList.remove("show");
  }, 3000);
}

/* =========================================================
   MODAL
   ========================================================= */

function openModal(title, content, buttons = []) {
  const modal = $("modal");
  const modalTitle = $("modal-title");
  const modalContent = $("modal-content");
  const modalButtons = $("modal-buttons");

  if (!modal || !modalTitle || !modalContent || !modalButtons) return;

  modalTitle.textContent = title;
  modalContent.innerHTML = content;
  modalButtons.innerHTML = "";

  buttons.forEach((button) => {
    const btn = document.createElement("button");

    btn.className = `action-button ${button.className || ""}`;
    btn.textContent = button.text;

    btn.addEventListener("click", () => {
      if (button.action) button.action();
    });

    modalButtons.appendChild(btn);
  });

  modal.classList.add("active");
}

function closeModal() {
  const modal = $("modal");

  if (modal) {
    modal.classList.remove("active");
  }
}

function setupModals() {
  const close = $("modal-close");

  if (close) {
    close.addEventListener("click", closeModal);
  }

  const modal = $("modal");

  if (modal) {
    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        closeModal();
      }
    });
  }
}

/* =========================================================
   BUILDINGS
   ========================================================= */

function openBuilding(type) {
  if (type === "hq") {
    openHQ();
    return;
  }

  if (type === "intelligence") {
    openIntelligence();
    return;
  }

  if (type === "bank") {
    openBank();
    return;
  }

  if (type === "market") {
    openMarket();
    return;
  }
}

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
        <span>${state.energy}</span>
      </div>

      <div class="stat-card">
        <strong>${t("xp")}</strong>
        <span>${state.xp}</span>
      </div>
    `,
    [
      {
        text: `🎯 ${t("operations")}`,
        action: () => showOperations()
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
        <h3>🎯 ${state.language === "fa" ? "عملیات شناسایی" : "Recon Operation"}</h3>

        <p>
          ${
            state.language === "fa"
              ? "یک منطقه ناشناخته در حاشیه شهر شناسایی شده است."
              : "An unknown area has been detected on the edge of the city."
          }
        </p>

        <div class="mission-meta">
          <span>💰 500 NEX</span>
          <span>⚡ 10 ${t("energy")}</span>
          <span>🎁 1500 NEX</span>
        </div>
      </div>
    `,
    [
      {
        text: state.language === "fa" ? "اجرای عملیات" : "Execute",
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

  const success = Math.random() < 0.85;

  if (success) {
    state.nex += 1500;
    state.cityValue += 100;
    addXP(50);

    saveState();
    updateHUD();

    showMessage(
      state.language === "fa"
        ? "✅ عملیات موفق بود! +1500 NEX و +50 XP"
        : "✅ Operation successful! +1500 NEX and +50 XP"
    );
  } else {
    addXP(10);

    saveState();
    updateHUD();

    showMessage(
      state.language === "fa"
        ? "❌ عملیات شکست خورد، اما +10 XP گرفتی."
        : "❌ Operation failed, but you gained +10 XP."
    );
  }

  closeModal();
}

/* =========================================================
   INTELLIGENCE CENTER
   ========================================================= */

function openIntelligence() {
  const available = [];

  if (state.missions.recon === "available") {
    available.push(`
      <div class="mission-card">
        <h3>🛰️ ${t("reconTitle")}</h3>
        <p>${t("reconDesc")}</p>

        <div class="mission-meta">
          <span>⚡ 15</span>
          <span>💰 +2000 NEX</span>
          <span>⭐ +100 XP</span>
        </div>

        <button class="action-button" id="start-recon">
          ${t("startMission")}
        </button>
      </div>
    `);
  }

  if (state.missions.shadow === "available") {
    available.push(`
      <div class="mission-card">
        <h3>🌑 ${t("shadowTitle")}</h3>
        <p>${t("shadowDesc")}</p>

        <div class="mission-meta">
          <span>⚡ 20</span>
          <span>💰 +4000 NEX</span>
          <span>⭐ +200 XP</span>
        </div>

        <button class="action-button" id="start-shadow">
          ${t("startMission")}
        </button>
      </div>
    `);
  }

  if (state.missions.blackout === "available") {
    available.push(`
      <div class="mission-card">
        <h3>⚠️ ${t("blackoutTitle")}</h3>
        <p>${t("blackoutDesc")}</p>

        <div class="mission-meta">
          <span>⚡ 25</span>
          <span>💰 +6000 NEX</span>
          <span>⭐ +300 XP</span>
        </div>

        <button class="action-button" id="start-blackout">
          ${t("startMission")}
        </button>
      </div>
    `);
  }

  if (!available.length) {
    available.push(`
      <div class="empty-state">
        🔒
        <br>
        ${
          state.language === "fa"
            ? "فعلاً پرونده جدیدی برای تو باز نشده."
            : "No new files are available for you yet."
        }
      </div>
    `);
  }

  openModal(t("intelligence"), available.join(""));

  setTimeout(() => {
    const recon = $("start-recon");
    const shadow = $("start-shadow");
    const blackout = $("start-blackout");

    if (recon) recon.onclick = () => startMission("recon");
    if (shadow) shadow.onclick = () => startMission("shadow");
    if (blackout) blackout.onclick = () => startMission("blackout");
  }, 0);
}

/* =========================================================
   MISSION ENGINE
   ========================================================= */

function startMission(id) {
  if (id === "recon") {
    startRecon();
    return;
  }

  if (id === "shadow") {
    startShadow();
    return;
  }

  if (id === "blackout") {
    startBlackout();
  }
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
  state.missions.recon = "active";
  state.missionProgress.recon = 1;

  saveState();
  updateHUD();

  reconStepOne();
}

function reconStepOne() {
  openModal(
    t("reconTitle"),
    `
      <div class="story-box">
        <p>
          ${
            state.language === "fa"
              ? "ساعت 02:17 بامداد است. یک پیام رمزگذاری‌شده روی کانال اضطراری ظاهر می‌شود."
              : "It is 02:17 AM. An encrypted message suddenly appears on the emergency channel."
          }
        </p>

        <p>
          ${
            state.language === "fa"
              ? "مختصات مربوط به یک کوچه تاریک در منطقه ۷ است."
              : "The coordinates point to a dark alley in Sector 7."
          }
        </p>
      </div>
    `,
    [
      {
        text: `👁️ ${t("follow")}`,
        action: () => reconChoice("follow")
      },
      {
        text: `📹 ${t("cameras")}`,
        action: () => reconChoice("cameras")
      },
      {
        text: `🕵️ ${t("agent")}`,
        action: () => reconChoice("agent")
      }
    ]
  );
}

function reconChoice(choice) {
  state.missionProgress.recon = 2;

  if (choice === "follow") {
    const success = Math.random() < 0.75;

    if (success) {
      reconSuccess(
        state.language === "fa"
          ? "رد فرد ناشناس را گرفتی و یک کیف حاوی اسناد محرمانه پیدا کردی."
          : "You followed the stranger and found a bag containing classified documents."
      );
    } else {
      reconFailure(
        state.language === "fa"
          ? "فرد ناشناس متوجه حضور تو شد و در تاریکی ناپدید شد."
          : "The stranger noticed you and disappeared into the darkness."
      );
    }

    return;
  }

  if (choice === "cameras") {
    openModal(
      t("clueTitle"),
      `
        <div class="story-box">
          ${
            state.language === "fa"
              ? "در یکی از فریم‌ها پلاک یک خودرو را پیدا می‌کنی. خودرو چند دقیقه بعد در نزدیکی بانک دیده شده است."
              : "You find a vehicle plate number in one frame. The vehicle was later seen near the bank."
          }
        </div>
      `,
      [
        {
          text: `🏦 ${t("investigateBank")}`,
          action: () => {
            reconSuccess(
              state.language === "fa"
                ? "بررسی اطلاعات بانک یک سرنخ مهم در اختیار تو گذاشت."
                : "Investigating the bank provided an important clue."
            );
          }
        },
        {
          text: `📡 ${t("callSecurity")}`,
          action: () => {
            reconSuccess(
              state.language === "fa"
                ? "امنیت شهر خودرو را شناسایی کرد و پرونده با موفقیت بسته شد."
                : "City security identified the vehicle and the case was successfully closed."
            );
          }
        }
      ]
    );

    return;
  }

  if (choice === "agent") {
    const success = Math.random() < 0.9;

    if (success) {
      reconSuccess(
        state.language === "fa"
          ? "مأمور تو بدون جلب توجه وارد منطقه شد و یک فایل رمزگذاری‌شده پیدا کرد."
          : "Your agent entered the area unnoticed and found an encrypted file."
      );
    } else {
      reconFailure(
        state.language === "fa"
          ? "مأمور قبل از رسیدن به محل شناسایی شد."
          : "The agent was detected before reaching the location."
      );
    }
  }
}

function reconSuccess(message) {
  state.nex += 2000;
  state.cityValue += 500;
  addXP(100);

  state.missions.recon = "completed";

  if (!state.completedMissions.includes("recon")) {
    state.completedMissions.push("recon");
  }

  state.missions.shadow = "available";

  saveState();
  updateHUD();

  openModal(
    `✅ ${t("success")}`,
    `
      <div class="story-box success-box">
        <p>${message}</p>

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
          showMessage(t("missionComplete"));
        }
      }
    ]
  );
}

function reconFailure(message) {
  addXP(25);

  state.missions.recon = "completed";

  if (!state.completedMissions.includes("recon")) {
    state.completedMissions.push("recon");
  }

  state.missions.shadow = "available";

  saveState();
  updateHUD();

  openModal(
    `❌ ${t("failure")}`,
    `
      <div class="story-box">
        <p>${message}</p>

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
          showMessage(t("missionFailed"));
        }
      }
    ]
  );
}

/* =========================================================
   SHADOW MISSION
   ========================================================= */

function startShadow() {
  if (state.energy < 20) {
    showMessage(t("noEnergy"));
    return;
  }

  state.energy -= 20;
  state.missions.shadow = "active";
  state.missionProgress.shadow = 1;

  saveState();
  updateHUD();

  openModal(
    t("shadowTitle"),
    `
      <div class="story-box">
        <p>${t("shadowDesc")}</p>

        <p>
          ${
            state.language === "fa"
              ? "سه انتخاب داری. هرکدام ممکن است مسیر پرونده را تغییر دهد."
              : "You have three choices. Each one may change the outcome of the case."
          }
        </p>
      </div>
    `,
    [
      {
        text: `🏦 ${t("investigateBank")}`,
        action: () => shadowChoice("bank")
      },
      {
        text: `📹 ${t("cameras")}`,
        action: () => shadowChoice("cameras")
      },
      {
        text: `⏳ ${t("wait")}`,
        action: () => shadowChoice("wait")
      }
    ]
  );
}

function shadowChoice(choice) {
  state.missionProgress.shadow = 2;

  if (choice === "bank") {
    const success = Math.random() < 0.7;

    if (success) {
      finishShadow(
        true,
        state.language === "fa"
          ? "در سوابق بانک یک حساب جعلی پیدا کردی که مستقیماً به فرد ناشناس مرتبط بود."
          : "You found a fake bank account directly connected to the stranger."
      );
    } else {
      finishShadow(
        false,
        state.language === "fa"
          ? "پرونده‌های بانک پاک شده بودند. فقط یک سرنخ کوچک باقی مانده است."
          : "The bank records had been wiped. Only a small clue remained."
      );
    }

    return;
  }

  if (choice === "cameras") {
    const success = Math.random() < 0.85;

    if (success) {
      finishShadow(
        true,
        state.language === "fa"
          ? "تصاویر دوربین مسیر فرار را آشکار کردند."
          : "The camera footage revealed the escape route."
      );
    } else {
      finishShadow(
        false,
        state.language === "fa"
          ? "سیستم دوربین درست در لحظه مهم از کار افتاد."
          : "The camera system failed at the critical moment."
      );
    }

    return;
  }

  finishShadow(
    false,
    state.language === "fa"
      ? "تصمیم گرفتی صبر کنی. فرد ناشناس ناپدید شد، اما شاید بعداً دوباره ظاهر شود."
      : "You decided to wait. The stranger disappeared, but may return later."
  );
}

function finishShadow(success, message) {
  if (success) {
    state.nex += 4000;
    state.cityValue += 1000;
    addXP(200);
  } else {
    addXP(50);
  }

  state.missions.shadow = "completed";

  if (!state.completedMissions.includes("shadow")) {
    state.completedMissions.push("shadow");
  }

  state.missions.blackout = "available";

  saveState();
  updateHUD();

  openModal(
    success ? `✅ ${t("success")}` : `⚠️ ${t("failure")}`,
    `
      <div class="story-box">
        <p>${message}</p>

        <div class="reward-box">
          ${
            success
              ? "💰 +4000 NEX<br>⭐ +200 XP"
              : "⭐ +50 XP"
          }
        </div>
      </div>
    `,
    [
      {
        text: t("continue"),
        action: () => {
          closeModal();
          showMessage(
            success ? t("missionComplete") : t("missionFailed")
          );
        }
      }
    ]
  );
}

/* =========================================================
   BLACKOUT MISSION
   ========================================================= */

function startBlackout() {
  if (state.energy < 25) {
    showMessage(t("noEnergy"));
    return;
  }

  state.energy -= 25;
  state.missions.blackout = "active";
  state.missionProgress.blackout = 1;

  saveState();
  updateHUD();

  openModal(
    t("blackoutTitle"),
    `
      <div class="story-box">
        <p>${t("blackoutDesc")}</p>

        <p>
          ${
            state.language === "fa"
              ? "روی صفحه یک فایل ناشناس ظاهر شده. نام فایل: NEXUS_07."
              : "An unknown file appears on the screen. File name: NEXUS_07."
          }
        </p>
      </div>
    `,
    [
      {
        text: `💻 ${t("hack")}`,
        action: () => blackoutChoice("hack")
      },
      {
        text: `🗑️ ${t("destroyFile")}`,
        action: () => blackoutChoice("destroy")
      }
    ]
  );
}

function blackoutChoice(choice) {
  if (choice === "hack") {
    const success = Math.random() < 0.65;

    if (success) {
      finishBlackout(
        true,
        state.language === "fa"
          ? "موفق شدی وارد سیستم شوی. چیزی که پیدا کردی، از تمام پرونده‌های قبلی عجیب‌تر است."
          : "You breached the system. What you found was stranger than all previous files."
      );
    } else {
      finishBlackout(
        false,
        state.language === "fa"
          ? "سیستم دفاعی فعال شد و دسترسی تو قطع شد."
          : "The defense system activated and your access was cut."
      );
    }

    return;
  }

  finishBlackout(
    false,
    state.language === "fa"
      ? "فایل را حذف کردی. شهر امن‌تر شد، اما شاید مهم‌ترین سرنخ را از دست دادی."
      : "You destroyed the file. The city is safer, but you may have lost the most important clue."
  );
}

function finishBlackout(success, message) {
  if (success) {
    state.nex += 6000;
    state.cityValue += 2500;
    addXP(300);
  } else {
    addXP(75);
  }

  state.missions.blackout = "completed";

  if (!state.completedMissions.includes("blackout")) {
    state.completedMissions.push("blackout");
  }

  saveState();
  updateHUD();

  openModal(
    success ? `🏆 ${t("success")}` : `❌ ${t("failure")}`,
    `
      <div class="story-box">
        <p>${message}</p>

        <div class="reward-box">
          ${
            success
              ? "💰 +6000 NEX<br>⭐ +300 XP"
              : "⭐ +75 XP"
          }
        </div>
      </div>
    `,
    [
      {
        text: t("continue"),
        action: () => {
          closeModal();
          showMessage(
            success ? t("missionComplete") : t("missionFailed")
          );
        }
      }
    ]
  );
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

      <div class="bank-balance">
        <div>
          <span>${t("nex")}</span>
          <strong>${state.nex.toLocaleString()}</strong>
        </div>
      </div>

      <div class="info-box">
        ${
          state.language === "fa"
            ? "سیستم اقتصادی پیشرفته بانک در مرحله بعد فعال می‌شود."
            : "The advanced bank economy system will be activated in the next stage."
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

        <button class="action-button" id="buy-energy">
          750 NEX
        </button>
      </div>

      <div class="shop-item">
        <div>
          <strong>🛰️ Intelligence Pass</strong>
          <small>
            ${
              state.language === "fa"
                ? "دسترسی به پرونده‌های ویژه"
                : "Access special files"
            }
          </small>
        </div>

        <button class="action-button" id="buy-pass">
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
      energy.onclick = buyEnergy;
    }

    if (pass) {
      pass.onclick = buyIntelligencePass;
    }
  }, 0);
}

function buyEnergy() {
  if (state.nex < 750) {
    showMessage(t("noNex"));
    return;
  }

  state.nex -= 750;
  state.energy = clamp(state.energy + 25, 0, 100);

  saveState();
  updateHUD();

  showMessage(
    state.language === "fa"
      ? "⚡ 25 انرژی خریداری شد."
      : "⚡ 25 energy purchased."
  );

  closeModal();
}

function buyIntelligencePass() {
  if (state.nex < 2500) {
    showMessage(t("noNex"));
    return;
  }

  state.nex -= 2500;

  if (!state.inventory.includes("intelligence_pass")) {
    state.inventory.push("intelligence_pass");
  }

  saveState();
  updateHUD();

  showMessage(
    state.language === "fa"
      ? "🛰️ کارت دسترسی اطلاعاتی خریداری شد."
      : "🛰️ Intelligence access pass purchased."
  );

  closeModal();
}

/* =========================================================
   NAVIGATION
   ========================================================= */

function setupNavigation() {
  const operations = $("nav-operations");
  const missions = $("nav-missions");
  const market = $("nav-market");
  const ranking = $("nav-ranking");
  const profile = $("nav-profile");

  if (operations) {
    operations.onclick = showOperations;
  }

  if (missions) {
    missions.onclick = openIntelligence;
  }

  if (market) {
    market.onclick = openMarket;
  }

  if (ranking) {
    ranking.onclick = () => {
      openModal(
        t("ranking"),
        `
          <div class="empty-state">
            🏆
            <br>
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
    };
  }

  if (profile) {
    profile.onclick = () => {
      openModal(
        t("profile"),
        `
          <div class="profile-card">
            <h3>👤 NEXUS Agent</h3>

            <p>${t("level")}: ${state.level}</p>
            <p>${t("xp")}: ${state.xp}</p>
            <p>${t("nex")}: ${state.nex.toLocaleString()}</p>
            <p>
              ${
                state.language === "fa"
                  ? "مأموریت‌های تکمیل‌شده"
                  : "Completed missions"
              }:
              ${state.completedMissions.length}
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
    };
  }
}

/* =========================================================
   MOVEMENT
   ========================================================= */

let player = null;
let keys = {};

function setupMovement() {
  document.addEventListener("keydown", (event) => {
    keys[event.key.toLowerCase()] = true;
  });

  document.addEventListener("keyup", (event) => {
    keys[event.key.toLowerCase()] = false;
  });

  const buttons = {
    up: "w",
    down: "s",
    left: "a",
    right: "d"
  };

  Object.entries(buttons).forEach(([id, key]) => {
    const button = $(id);

    if (!button) return;

    button.addEventListener("pointerdown", () => {
      keys[key] = true;
    });

    button.addEventListener("pointerup", () => {
      keys[key] = false;
    });

    button.addEventListener("pointercancel", () => {
      keys[key] = false;
    });

    button.addEventListener("pointerleave", () => {
      keys[key] = false;
    });
  });
}

/* =========================================================
   THREE.JS CITY
   ========================================================= */

let scene;
let camera;
let renderer;
let raycaster;
let mouse;

const buildings = [];

function init3D() {
  const canvas = $("game-canvas");

  if (!canvas) {
    console.warn("game-canvas not found.");
    return;
  }

  scene = new THREE.Scene();

  scene.background = new THREE.Color(0x050914);

  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  camera.position.set(22, 20, 25);

  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  renderer.shadowMap.enabled = true;

  const ambient = new THREE.AmbientLight(0x778899, 2);
  scene.add(ambient);

  const moon = new THREE.DirectionalLight(0xffffff, 2);
  moon.position.set(20, 40, 10);
  moon.castShadow = true;
  scene.add(moon);

  createGround();
  createRoads();
  createBuildings();
  createPlayer();

  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  canvas.addEventListener("pointerdown", onCanvasPointer);

  window.addEventListener("resize", onResize);

  animate();
}

function createGround() {
  const geometry = new THREE.PlaneGeometry(120, 120);

  const material = new THREE.MeshStandardMaterial({
    color: 0x101827,
    roughness: 0.9
  });

  const ground = new THREE.Mesh(geometry, material);

  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;

  scene.add(ground);
}

function createRoads() {
  const material = new THREE.MeshStandardMaterial({
    color: 0x202735,
    roughness: 0.8
  });

  const horizontal = new THREE.Mesh(
    new THREE.BoxGeometry(100, 0.15, 10),
    material
  );

  horizontal.position.y = 0.05;

  scene.add(horizontal);

  const vertical = new THREE.Mesh(
    new THREE.BoxGeometry(10, 0.15, 100),
    material
  );

  vertical.position.y = 0.06;

  scene.add(vertical);
}

function createBuildings() {
  createBuilding(
    "hq",
    -20,
    -18,
    10,
    14,
    0x304c78
  );

  createBuilding(
    "bank",
    18,
    -18,
    12,
    16,
    0x405c65
  );

  createBuilding(
    "intelligence",
    -20,
    18,
    12,
    15,
    0x443a70
  );

  createBuilding(
    "market",
    18,
    18,
    13,
    11,
    0x68513a
  );
}

function createBuilding(type, x, z, width, height, color) {
  const geometry = new THREE.BoxGeometry(
    width,
    height,
    width
  );

  const material = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.65,
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

  building.castShadow = true;
  building.receiveShadow = true;

  building.userData = {
    type,
    interactive: true
  };

  scene.add(building);
  buildings.push(building);

  createBuildingRoof(building, width, height);
}

function createBuildingRoof(building, width, height) {
  const roof = new THREE.Mesh(
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
    building.position.x,
    height + 0.25,
    building.position.z
  );

  roof.userData = building.userData;

  scene.add(roof);
}

function createPlayer() {
  const body = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.8, 1.5, 8, 16),
    new THREE.MeshStandardMaterial({
      color: 0x42a5f5,
      roughness: 0.5
    })
  );

  body.position.set(0, 1.5, 0);
  body.castShadow = true;

  scene.add(body);

  player = body;
}

function onCanvasPointer(event) {
  if (!raycaster || !camera || !renderer) return;

  const rect = renderer.domElement.getBoundingClientRect();

  mouse.x =
    ((event.clientX - rect.left) / rect.width) * 2 - 1;

  mouse.y =
    -((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(
    buildings,
    false
  );

  if (!intersects.length) return;

  const building = intersects[0].object;

  if (building.userData?.interactive) {
    openBuilding(building.userData.type);
  }
}

function movePlayer() {
  if (!player) return;

  const speed = 0.18;

  let moved = false;

  if (keys.w || keys.arrowup) {
    player.position.z -= speed;
    moved = true;
  }

  if (keys.s || keys.arrowdown) {
    player.position.z += speed;
    moved = true;
  }

  if (keys.a || keys.arrowleft) {
    player.position.x -= speed;
    moved = true;
  }

  if (keys.d || keys.arrowright) {
    player.position.x += speed;
    moved = true;
  }

  player.position.x = clamp(
    player.position.x,
    -48,
    48
  );

  player.position.z = clamp(
    player.position.z,
    -48,
    48
  );

  if (moved) {
    state.energy = clamp(
      state.energy - 0.002,
      0,
      100
    );

    updateHUD();
  }
}

function updateCamera() {
  if (!player || !camera) return;

  const targetX = player.position.x + 22;
  const targetY = player.position.y + 20;
  const targetZ = player.position.z + 25;

  camera.position.lerp(
    new THREE.Vector3(
      targetX,
      targetY,
      targetZ
    ),
    0.03
  );

  camera.lookAt(player.position);
}

function animate() {
  requestAnimationFrame(animate);

  movePlayer();
  updateCamera();

  if (renderer && scene && camera) {
    renderer.render(scene, camera);
  }
}

function onResize() {
  if (!camera || !renderer) return;

  camera.aspect =
    window.innerWidth / window.innerHeight;

  camera.updateProjectionMatrix();

  renderer.setSize(
    window.innerWidth,
    window.innerHeight
  );
}

/* =========================================================
   DAILY REWARD
   ========================================================= */

function checkDailyReward() {
  const today = new Date()
    .toISOString()
    .slice(0, 10);

  if (state.dailyClaimed !== today) {
    state.dailyClaimed = today;
    state.nex += 1000;

    saveState();
    updateHUD();

    setTimeout(() => {
      showMessage(`🎁 ${t("dailyReward")}`);
    }, 1200);
  }
}

/* =========================================================
   START
   ========================================================= */

function startGame() {
  setupModals();
  setupNavigation();
  setupMovement();

  updateInterface();

  if (!state.language) {
    const languageScreen = $("language-screen");

    if (languageScreen) {
      languageScreen.style.display = "flex";
    }

    const game = $("game-container");

    if (game) {
      game.style.display = "none";
    }
  } else {
    setLanguage(state.language);
  }

  checkDailyReward();

  init3D();
}

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    startGame
  );
} else {
  startGame();
}
