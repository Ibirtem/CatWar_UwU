// ==UserScript==
// @name         CatWar UwU
// @namespace    http://tampermonkey.net/
// @version      v2.0.0-09.26
// @description  Визуальное обновление CatWar'а, и не только...
// @author       Ibirtem / Затменная ( https://catwar.net/cat1477928 )
// @copyright    2026, Ibirtem (https://openuserjs.org/users/Ibirtem)
// @supportURL   https://catwar.net/cat1477928
// @homepageURL  https://openuserjs.org/scripts/Ibirtem/CatWar_UwU
// @match        http*://*.catwar.net/*
// @match        http*://*.catwar.su/*
// @updateURL    https://github.com/Ibirtem/CatWar/raw/main/CatWar%20UwU.user.js
// @downloadURL  https://github.com/Ibirtem/CatWar/raw/main/CatWar%20UwU.user.js
// @license      MIT
// @iconURL      https://raw.githubusercontent.com/Ibirtem/CatWar/main/images/partly_sunny_rain.png
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_xmlhttpRequest
// @connect      *
// ==/UserScript==

"use strict"; // Делаю вид что крутой.

// ====================================================================================================================
//   . . . ЕДИНОЕ ХРАНИЛИЩЕ . . .
// ====================================================================================================================

let useUnifiedStorage = false;

(() => {
  if (typeof GM_getValue === "undefined") {
    return;
  }

  try {
    const gmSettingsRaw = GM_getValue("uwu_settings");
    if (gmSettingsRaw) {
      const gmSettings = JSON.parse(gmSettingsRaw);
      useUnifiedStorage = !!gmSettings.unifiedStorage;
      return;
    }
  } catch (e) {
    // Ошибка парсинга GM JSON, продолжаем с localStorage
  }

  try {
    const localSettingsRaw = localStorage.getItem("uwu_settings");
    if (localSettingsRaw) {
      const localSettings = JSON.parse(localSettingsRaw);
      if (localSettings.unifiedStorage) {
        useUnifiedStorage = true;
      }
    }
  } catch (e) {}
})();

const uwuStorage = {
  setItem: (key, value) => {
    const stringValue = JSON.stringify(value);
    if (useUnifiedStorage) {
      GM_setValue(key, stringValue);
    } else {
      localStorage.setItem(key, stringValue);
    }
  },

  getItem: (key) => {
    const rawValue = useUnifiedStorage
      ? GM_getValue(key)
      : localStorage.getItem(key);

    if (rawValue === null || typeof rawValue === "undefined") {
      return null;
    }

    try {
      return JSON.parse(rawValue);
    } catch (e) {
      return rawValue;
    }
  },

  removeItem: (key) => {
    if (useUnifiedStorage) {
      GM_deleteValue(key);
    } else {
      localStorage.removeItem(key);
    }
  },

  migrateAllToGM: () => {
    console.log("UwU | Перенос данных из localStorage в единое хранилище...");
    const keysToMigrate = Object.keys(localStorage);
    for (const key of keysToMigrate) {
      if (key.startsWith("uwu_")) {
        const value = localStorage.getItem(key);
        GM_setValue(key, value);
      }
    }
    console.log("UwU | Перенос завершен.");
  },
};

// ====================================================================================================================
//   . . . DEFAULT НАСТРОЙКИ . . .
// ====================================================================================================================
/**
 * @type {string}
 */
const current_uwu_version =
  typeof GM_info !== "undefined" && GM_info?.script?.version
    ? GM_info.script.version.replace(/^v/i, "")
    : "?.?.?";

// ✨🦐✨🦐✨
const uwuDefaultSettings = {
  weatherEnabled: false,
  weatherDrops: false,
  weatherParticlesAmount: "normal",
  lowPerformanceMode: false,
  minecraftStyle: false,
  alwaysDay: false,
  manualWeatherPanel: false,
  skyInHeader: false,
  auroraPos: "1",
  weatherZIndex: "0",

  backgroundRepeat: false,
  backgroundUser: false,
  backgroundUserImageURL: "",
  gameFieldBackgroundUser: false,
  gameFieldBackgroundUserImageURL: "",
  userTheme: false,
  userThemeKns: false,
  glassStyle: false,
  hideRelativesByDefault: false,
  twoColumnParameters: false,
  automaticActionsRedesign: false,
  commentsAvatars: false,

  chatHeight: "275",
  showChatId: true,
  reverseChat: false,
  newChatInput: false,
  showChatCharCounter: false,
  showChatRanks: false,
  showChatTime: false,
  namesForNotification: "",
  disableCustomChatColors: false,

  redesignCostumsSettings: false,
  profileMenuRedesign: false,
  blogseaRedesign: false,
  blogsRedesign: false,

  showDefectsEnabled: false,
  defectsStyle: "default",
  defectsQuality: "high",

  notificationPM: false,
  notificationPMSound: "notificationSound1",
  notificationPMVolume: 5,
  notificationActionEnd: false,
  notificationActionEndEarly: false,
  notificationActionEndSound: "notificationSound1",
  notificationActionEndVolume: 5,
  notificationInMouth: false,
  notificationInMouthSound: "notificationSound1",
  notificationInMouthVolume: 5,
  notificationInFightMode: false,
  notificationInFightModeSound: "notificationSound1",
  notificationInFightModeVolume: 5,
  notificationBlock: false,
  notificationBlockSound: "notificationBlockSound1",
  notificationBlockVolume: 5,

  showHintWhenToSniff: false,
  duplicateTimeInBrowserTab: false,

  cellsBorders: false,
  cellsBordersThickness: "1",
  cellsBordersColor: "#ffffff",
  cellsNumbers: false,
  fastStyles: false,
  displayParametersPercentages: false,
  compactMouth: false,
  showMoreCatInfo: false,
  showParametersDetails: false,
  showExactSkillsValues: false,

  compactFightLog: false,
  fightTeams: false,
  fightTeamsColors: {
    team1: ["#41cd70", "#cd4141"],
    team2: ["#c968ff", "#cd4141"],
    team3: ["#44bcff", "#cd4141"],
    team4: ["#FFFF00", "#cd4141"],
  },
  fightTeamsPanelHight: "100",

  highlightResources: false,
  highlightResourcesStyle: "background",

  showClock: false,
  clockStyle: "compact",
  clockFontSize: "14",
  clockPosition: "fly",

  showMightHistory: false,

  intervalTimerEnabled: false,
  intervalTimerSound: "notificationSound1",
  intervalTimerVolume: 5,

  describeHuntingSmell: false,
  huntingVirtualJoystick: false,
  sizeHuntingVirtualJoystick: "150",

  climbingPanel: false,
  climbingPanelOrientation: "vertical",
  climbingPanelInputsStyle: "keyboard",
  climbingNotificationsNumbers: false,
  climbingRefreshNotification: false,
  climbingRefreshNotificationSound: "notificationSound1",
  climbingRefreshNotificationVolume: "5",

  cleaningLog: false,
  cleaningLogStyle: "smart",
  cleaningLogShowID: false,
  cleaningLogHeight: "120",

  catchingLog: false,
  catchingLogHeight: "120",

  myNameNotificationSound: "notificationSound2",
  notificationMyNameVolume: "5",

  userQuickLinks: "",
  historyHeight: "215",
  itemListHeight: "180",

  parametersColors: {
    dream: ["#008000", "#008000", "#ff0000", "#ff0000"],
    hunger: ["#008000", "#008000", "#ff0000", "#ff0000"],
    thirst: ["#008000", "#008000", "#ff0000", "#ff0000"],
    need: ["#008000", "#008000", "#ff0000", "#ff0000"],
    health: ["#008000", "#008000", "#ff0000", "#ff0000"],
    clean: ["#008000", "#008000", "#ff0000", "#ff0000"],

    smell: ["#008000", "#008000", "#cccccc", "#cccccc"],
    dig: ["#008000", "#008000", "#cccccc", "#cccccc"],
    swim: ["#008000", "#008000", "#cccccc", "#cccccc"],
    might: ["#008000", "#008000", "#cccccc", "#cccccc"],
    tree: ["#008000", "#008000", "#cccccc", "#cccccc"],
    observ: ["#008000", "#008000", "#cccccc", "#cccccc"],

    other: ["#008000", "#008000", "#cccccc", "#cccccc"],
  },
  parametersBackgroundImage: false,
  parametersUserBackgroundImage: false,
  parametersUserBackgroundImageURL: "",
  parametersTextShadow: false,

  restoreBlogCreation: false,
  moreBBCodes: false,
  commentPreview: false,
  moreCommentButtons: false,
  lsWrapPreview: false,
  calculators: false,
  savingLS: false,

  extendedSettingsPanel: false,
  showUpdateNotification: false,
  showSplashScreens: false,
  extendedHints: true,
  GMbetaTest: false,
  personalCostumes: false,
  showCostumesButtons: false,
  blockItemDrop: false,

  unifiedStorage: false,
};

// ====================================================================================================================
//   . . . ТАРГЕТНЫЕ ССЫЛКИ . . .
// ====================================================================================================================
const targetCW3 = /^https?:\/\/\w?\.?catwar\.(?:net|su)\/cw3(?:\/)?(?:\?.*)?$/;
const targetCW3Hunt =
  /^https?:\/\/\w?\.?catwar\.(?:net|su)\/cw3\/jagd(?:\/)?(?:\?.*)?$/;
const targetCW3Kns =
  /^https?:\/\/(?:\w+\.)?catwar\.(?:net|su)\/cw3\/kns\/?(?:[?#].*)?$/i;

const targetSettings = /^https?:\/\/\w?\.?catwar\.(?:net|su)\/settings/;
const targetMainProfile = /^https?:\/\/\w?\.?catwar\.(?:net|su)\/$/;
const targetProfile = /^https?:\/\/\w?\.?catwar\.(?:net|su)\/cat\d+$/;
const targetLs = /^https?:\/\/\w?\.?catwar\.(?:net|su)\/ls/;
const targetLsNew = /^https?:\/\/\w?\.?catwar\.(?:net|su)\/ls\?new(=.*)?$/;
const targetChats = /^https?:\/\/\w?\.?catwar\.(?:net|su)\/chat/;
const targetBlog =
  /^https?:\/\/\w?\.?catwar\.(?:net|su)\/(?:blog\d+|blogs)(?:$|[/?#])/i;
const targetBlogsCreation =
  /^https?:\/\/\w?\.?catwar\.(?:net|su)\/blogs\?creation/;
const targetSniff =
  /^https?:\/\/\w?\.?catwar\.(?:net|su)\/sniff(?:\d+|)(?:$|[/?#])/i;
const targetSniffCreation =
  /^https?:\/\/\w?\.?catwar\.(?:net|su)\/sniff\?creation/;

const targetClanAutoActions = /^https?:\/\/\w?\.?catwar\.(?:net|su)\/my_clan\/automatic_actions/;
const targetBlogsea = /^https?:\/\/\w?\.?catwar\.(?:net|su)\/blogsea/;

// ====================================================================================================================
//   . . . СТАНДАРТНЫЕ ЦВЕТОВЫЕ ТЕМЫ . . .
// ====================================================================================================================
const defaultThemes = {
  "Тёмная Тема": {
    colors: {
      backgroundColor: "#161616",
      blocksColor: "#242424",
      chatColor: "#242424",
      textColor: "#d5d5d5",
      catTooltipBackground: "#242424",
      fightPanelBackground: "#242424",
      linkColor: "#d5d5d5",
      accentColor1: "#111111",
      accentColor2: "#2e2e2e82",
      accentColor3: "#fc872a",
      moveNameColor: "#d5d5d5",
      moveNameBackground: "#242424",
      climbingPanelBackground: "#242424",
    },
  },
  "Прозрачная Тема": {
    colors: {
      backgroundColor: "#161616",
      blocksColor: "#2b2b2b63",
      chatColor: "#2b2b2b63",
      textColor: "#d5d5d5",
      catTooltipBackground: "#2b2b2b63",
      fightPanelBackground: "#2b2b2b63",
      linkColor: "#d5d5d5",
      accentColor1: "#111111",
      accentColor2: "#2e2e2e82",
      accentColor3: "#fc872a",
      moveNameColor: "#d5d5d5",
      moveNameBackground: "#2b2b2b63",
      climbingPanelBackground: "#2b2b2b63",
    },
  },
};

// ====================================================================================================================
//   . . . МЕНЕДЖЕР ЗВУКОВ . . .
// ====================================================================================================================
/**
 * @typedef {Object} SoundDefinition
 * @property {string} id - Unique identifier for the sound.
 * @property {string} name - Display name for the UI.
 * @property {string} url - Source URL of the audio file.
 * @property {boolean} isCustom - Indicates if the sound is user-defined.
 * @property {HTMLAudioElement|null} audio - Cached Audio instance.
 */

function createSoundManager() {
  /** @type {Map<string, SoundDefinition>} */
  const soundRegistry = new Map();
  let isUserInteracted = false;
  let pendingSounds = [];

  /**
   * Retrieves or initializes an Audio instance for the given sound ID.
   * 
   * @param {string} id - The sound identifier.
   * @returns {HTMLAudioElement|null}
   */
  function getAudioInstance(id) {
    const soundDef = soundRegistry.get(id);
    if (!soundDef) return null;
    
    if (!soundDef.audio) {
      soundDef.audio = new Audio(soundDef.url);
    }
    return soundDef.audio;
  }

  /**
   * Registers a new sound in the manager.
   * 
   * @param {string} id - Unique identifier.
   * @param {string} name - Display name.
   * @param {string} url - URL of the audio file.
   * @param {boolean} [isCustom=false] - Whether it is a user-added sound.
   */
  function registerSound(id, name, url, isCustom = false) {
    soundRegistry.set(id, { id, name, url, isCustom, audio: null });
  }

  /**
   * Removes a sound from the registry by its ID.
   * 
   * @param {string} id - The sound identifier to remove.
   */
  function unregisterSound(id) {
    soundRegistry.delete(id);
  }

  /**
   * Returns a formatted list of all registered sounds for UI dropdowns.
   * 
   * @returns {Array<{id: string, name: string, isCustom: boolean}>}
   */
  function getSoundList() {
    return Array.from(soundRegistry.values()).map(def => ({
      id: def.id,
      name: def.name,
      isCustom: def.isCustom
    }));
  }

  /**
   * Plays the sound with the given ID and volume. Handles browser autoplay policies.
   * 
   * @param {string} id - The sound identifier.
   * @param {number} volume - Volume level (0 to 10).
   * @returns {Promise<void>}
   */
  function playSound(id, volume) {
    return new Promise((resolve, reject) => {
      const audio = getAudioInstance(id);
      if (audio) {
        audio.currentTime = 0;
        audio.volume = Math.max(0, Math.min(1, volume / 10));
        
        audio.play().then(resolve).catch((error) => {
          if (!isUserInteracted) {
            console.warn("UwU | Audio blocked by autoplay policy. Waiting for user interaction.");
            pendingSounds.push({ id, volume, resolve });
          } else {
            console.warn(`UwU | Failed to play sound ${id}:`, error);
            reject(error);
          }
        });
      } else {
        reject(new Error(`UwU | Sound with ID ${id} not found.`));
      }
    });
  }

  function playSoundNow(id, volume, resolve) {
    const audio = getAudioInstance(id);
    if (audio) {
      audio.volume = Math.max(0, Math.min(1, volume / 10));
      audio.play().then(resolve).catch((error) => {
        console.error(`UwU | Failed to play pending sound ${id}:`, error);
        resolve();
      });
    }
  }

  function handleUserInteraction() {
    isUserInteracted = true;

    document.removeEventListener("mousedown", handleUserInteraction);
    document.removeEventListener("touchstart", handleUserInteraction);
    document.removeEventListener("keydown", handleUserInteraction);

    pendingSounds.forEach(({ id, volume, resolve }) => {
      playSoundNow(id, volume, resolve);
    });
    pendingSounds = [];
  }

  document.addEventListener("mousedown", handleUserInteraction);
  document.addEventListener("touchstart", handleUserInteraction);
  document.addEventListener("keydown", handleUserInteraction);

  return {
    registerSound,
    unregisterSound,
    getSoundList,
    playSound,
  };
}

const soundManager = createSoundManager();

// ===================== СПИСОК ДОСТУПНЫХ ЗВУКОВ =====================

soundManager.registerSound(
  "notificationSound1",
  "Звук 1",
  "https://github.com/Ibirtem/CatWar/raw/main/sounds/notification_1.mp3"
);
soundManager.registerSound(
  "notificationSound2",
  "Звук 2",
  "https://github.com/Ibirtem/CatWar/raw/main/sounds/notification_2.mp3"
);
soundManager.registerSound(
  "notificationSound3",
  "Звук 3",
  "https://github.com/Ibirtem/CatWar/raw/main/sounds/notification_3.mp3"
);
soundManager.registerSound(
  "notificationBlockSound1",
  "Блокирование",
  "https://github.com/Ibirtem/CatWar/raw/main/sounds/block_1.mp3"
);

const savedCustomSoundsRaw = uwuStorage.getItem("uwu_customSounds");
const savedCustomSounds = Array.isArray(savedCustomSoundsRaw)
  ? savedCustomSoundsRaw
  : [];

savedCustomSounds
  .filter(
    (sound) =>
      sound &&
      typeof sound.id === "string" &&
      typeof sound.name === "string" &&
      typeof sound.url === "string",
  )
  .forEach((sound) => {
    soundManager.registerSound(sound.id, sound.name, sound.url, true);
  });

// ====================================================================================================================
//   . . . HTML ПАНЕЛЬ НАСТРОЕК . . .
// ====================================================================================================================
const uwusettings =
  /* HTML */
  `
    <div id="uwusettings">
      <div id="uwusettings-header" class="uwu-settings-card uwu-header-card">
        <div class="main-settings-container">
          <h1>Настройки CatWar UwU</h1>
          <div class="link-container" style="display: flex; align-items: center;">
              <button
                type="button"
                id="uwu-version-badge"
                class="uwu-version-badge"
                title="Что нового в версии v${current_uwu_version}?"
              >
                🌿 v${current_uwu_version}
              </button>

              <a
                href="https://vk.com/catwar_uwu"
                target="_blank"
                rel="noopener noreferrer"
                title="ВК Группа по Скрипту/Моду"
                style="margin-right: 10px; text-decoration: none;"
              >
                <img
                  src="https://raw.githubusercontent.com/Ibirtem/CatWar/main/images/VK_logo.png"
                  alt="VK"
                  width="36"
                  height="36"
                />
              </a>
              <a
                href="https://github.com/Ibirtem/CatWar"
                target="_blank"
                rel="noopener noreferrer"
                title="GitHub Репозиторий"
              >
                <img
                  src="https://raw.githubusercontent.com/Ibirtem/CatWar/main/images/icon_github.png"
                  alt="GitHub"
                  width="36"
                  height="36"
                />
              </a>
            </div>
        </div>

        <hr class="uwu-hr" />

        <div id="button-container" class="uwu-header-pills">
          <button id="effects-button" class="active">
            <h2>Природные эффекты <img
                src="https://raw.githubusercontent.com/Ibirtem/CatWar/main/images/partly_sunny_rain.png" width="20"
                height="20" /></h2>
          </button>
          <button id="theme-button">
            <h2>Оформление <img src="https://raw.githubusercontent.com/Ibirtem/CatWar/main/images/sparkles.png" width="20"
                height="20" /></h2>
          </button>
          <button id="utility-button">
            <h2>Инструментарий <img src="https://raw.githubusercontent.com/Ibirtem/CatWar/main/images/flashlight.png"
                width="20" height="20" /></h2>
          </button>
          <button id="modules-button">
            <h2>Надстройки <img src="https://raw.githubusercontent.com/Ibirtem/CatWar/main/images/construction.png"
                width="20" height="20" /></h2>
          </button>
          <button id="personal-costumes-button">
            <h2>Личные костюмы <img
                src="https://raw.githubusercontent.com/Arisamiga/CatWar/refs/heads/Personal-Costumes/images/costumes.png"
                width="20" height="20" /></h2>
          </button>
        </div>
      </div>

      <div id="uwusettings-main">
        <div id="effects-panel">

          <!-- ДИНАМИЧЕСКИЕ ОСАДКИ И СТИЛИЗАЦИЯ ПОЛЯ -->
          <div class="uwu-settings-card">
            <h3 class="uwu-settings-card__title">Динамическая погода и осадки</h3>
            <hr id="uwu-hr" class="uwu-hr">

            <div class="uwu-settings-card__item">
              <p>Включает генерацию динамической погоды в Игровой (дождь, снегопады, северные сияния).</p>
              <div class="uwu-settings-card__row">
                <input type="checkbox" id="weather-enabled" data-setting="weatherEnabled" />
                <label for="weather-enabled">Показывать природные эффекты</label>
              </div>
            </div>

            <div class="uwu-settings-card__item">
              <p>Количество частиц осадков. "Мало частиц" повышает производительность на слабых устройствах.</p>
              <div class="uwu-settings-card__row">
                <label>Интенсивность осадков:</label>
                <div class="custom-select" id="weatherParticlesAmount">
                  <div class="select-selected">Много частиц (Стандарт)</div>
                  <div class="select-items"></div>
                </div>
              </div>
            </div>

            <div class="uwu-settings-card__item">
              <p>Эффекты всплесков и оседания частиц при падении на нижнюю границу экрана.</p>
              <div class="uwu-settings-card__row">
                <input type="checkbox" id="weather-drops" data-setting="weatherDrops" />
                <label for="weather-drops">Эффекты приземления частиц</label>
              </div>
            </div>

            <div class="uwu-settings-card__item">
              <p>Замена стандартных капель и снежинок на пиксельные текстуры.</p>
              <div class="uwu-settings-card__row">
                <input type="checkbox" id="minecraft-style" data-setting="minecraftStyle" />
                <label for="minecraft-style">Minecraft частицы</label>
              </div>
            </div>

            <div class="uwu-settings-card__item">
              <p>Отключает ночное затемнение игрового поля.</p>
              <div class="uwu-settings-card__row">
                <input type="checkbox" id="always-day" data-setting="alwaysDay" />
                <label for="always-day">Всегда день/ярко</label>
              </div>
            </div>

            <div class="uwu-settings-card__item">
              <p>Отображает панель ручного вызова погоды в расширенных настройках (отключает природную генерацию).</p>
              <div class="uwu-settings-card__row">
                <input type="checkbox" id="manual-Weather-Panel" data-setting="manualWeatherPanel" />
                <label for="manual-Weather-Panel">Ручное управление погодой</label>
              </div>
            </div>
          </div>

          <!-- СЕВЕРНОЕ СИЯНИЕ И НЕБО -->
          <div class="uwu-settings-card">
            <h3 class="uwu-settings-card__title">Северное сияние и небо</h3>
            <hr id="uwu-hr" class="uwu-hr">

            <div class="uwu-settings-card__item">
              <p>Позиционирование эффекта Северного Сияния на экране.</p>
              <div class="uwu-settings-card__row">
                <label>Северное Сияние:</label>
                <div class="custom-select" id="auroraPos">
                  <div class="select-selected">Сверху</div>
                  <div class="select-items"></div>
                </div>
              </div>
            </div>

            <div class="uwu-settings-card__item">
              <p>Делает небо шапкой страницы, пряча под Игровую (а также чинит его пропажу при редизайне). На широких
                мониторах может растягиваться.</p>
              <div class="uwu-settings-card__row">
                <input type="checkbox" id="sky-in-the-sky" data-setting="skyInHeader" />
                <label for="sky-in-the-sky">Небо в небе (небо в шапке)</label>
              </div>
            </div>
          </div>

          <!-- Z-INDEX И СЛОИ -->
          <div class="uwu-settings-card">
            <h3 class="uwu-settings-card__title">Слои отображения</h3>
            <hr id="uwu-hr" class="uwu-hr">

            <div class="uwu-settings-card__item">
              <p>Определяет глубину отображения эффектов относительно игровых окон и чата.</p>
              <div class="uwu-settings-card__row">
                <label>Перекрытие элементов:</label>
                <div class="custom-select" id="weatherZIndex">
                  <div class="select-selected">Стандарт</div>
                  <div class="select-items"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id="theme-panel">
          <!-- ПОЛЕ ИГРОВОЙ И ФОНЫ -->
          <div class="uwu-settings-card">
            <h3 class="uwu-settings-card__title">Поле Игровой и фоны</h3>
            <hr class="uwu-hr" />

            <div class="uwu-settings-card__item">
              <p>Заменяет все фоны игровых локаций на статичный фон (рекомендуется 1000х1000 px).</p>
              <div class="uwu-settings-card__row">
                <input type="checkbox" id="game-Field-background-User" data-setting="gameFieldBackgroundUser" />
                <label for="game-Field-background-User">Статичный фон локации:</label>
                <input type="text" id="gameFieldSettingImageURLField" placeholder="Вставьте URL"
                  data-setting="gameFieldBackgroundUserImageURL" />
                <button id="SettingSaveButton1" class="uwu-button install-button">Сохранить</button>
              </div>
            </div>

            <div class="uwu-settings-card__item">
              <p>Отрисовывает границы клеток игрового поля с выбором толщины и цвета.</p>
              <div class="uwu-settings-card__row">
                <input type="checkbox" id="cells-Borders" data-setting="cellsBorders" />
                <label for="cells-Borders">Границы клеток</label>
              </div>
              <div class="uwu-settings-card__row" style="margin-top: 4px;">
                <label>Толщина / яркость:</label>
                <div id="step-slider" style="flex: 0 1 180px;">
                  <input type="range" min="1" max="9" value="1" id="cells-Borders-Thickness" list="ThicknessStep"
                    data-setting="cellsBordersThickness" />
                  <datalist id="ThicknessStep">
                    <option value="1">0.1</option>
                    <option value="5">0.5</option>
                    <option value="9">0.9</option>
                  </datalist>
                </div>
                <label style="margin-left: 10px;">Цвет:</label>
                <div id="cells-borders-color-picker"></div>
              </div>
            </div>

            <div class="uwu-settings-card__item">
              <p>Обозначает клетки игрового поля числовыми индексами.</p>
              <div class="uwu-settings-card__row">
                <input type="checkbox" id="cells-Numbers" data-setting="cellsNumbers" />
                <label for="cells-Numbers">Нумерация клеток</label>
              </div>
            </div>

            <div class="uwu-settings-card__item">
              <p>Ставит на страницу фон, повторяющий локацию Игровой (с размытием и затемнением).</p>
              <div class="uwu-settings-card__row">
                <input type="checkbox" id="background-repeat" data-setting="backgroundRepeat" />
                <label for="background-repeat">Фон страницы из локации</label>
              </div>
            </div>

            <div class="uwu-settings-card__item">
              <p>Устанавливает пользовательское фоновое изображение на всю страницу.</p>
              <div class="uwu-settings-card__row">
                <input type="checkbox" id="background-user" data-setting="backgroundUser" />
                <label for="background-user">Свой фон страницы:</label>
                <input type="text" id="SettingImageURLField" placeholder="Вставьте URL"
                  data-setting="backgroundUserImageURL" />
                <button id="SettingSaveButton1" class="uwu-button install-button">Сохранить</button>
              </div>
            </div>

            <div class="uwu-settings-card__item">
              <p>Панель быстрого переключения полезных визуальных стилей в расширенном меню Игровой.</p>
              <div class="uwu-settings-card__row">
                <input type="checkbox" id="fast-Styles" data-setting="fastStyles" />
                <label for="fast-Styles">Быстрые стили</label>
                <label id="uwu-what-this"
                  title="— Не показывать всплывающее окно 'О коте'&#10;— Скрыть Игровое поле&#10;— Скрыть фон Игрового Поля&#10;— Скрыть Небо&#10;— Всегда день/ярко&#10;— Границы клеток">[?]</label>
              </div>
            </div>
          </div>

          <!-- ДЕФЕКТЫ ПЕРСОНАЖЕЙ -->
          <div class="uwu-settings-card">
            <h3 class="uwu-settings-card__title">Дефекты персонажей</h3>
            <hr class="uwu-hr" />

            <div class="uwu-settings-card__item">
              <p>Отображает визуальные маркеры дефектов (раны, переломы, кашель, грязь и т.д.).</p>
              <div class="uwu-settings-card__row">
                <input type="checkbox" id="show-defects-enabled" data-setting="showDefectsEnabled" />
                <label for="show-defects-enabled">Показывать иконки дефектов</label>
              </div>
            </div>

            <div class="uwu-settings-card__item">
              <p>Стиль отображения иконок дефектов на котах.</p>
              <div class="uwu-settings-card__row">
                <label>Стиль:</label>
                <div class="custom-select" id="defectsStyle">
                  <div class="select-selected">Стандартный</div>
                  <div class="select-items"></div>
                </div>
              </div>
            </div>

            <div class="uwu-settings-card__item">
              <p>Разрешение и четкость текстур дефектов.</p>
              <div class="uwu-settings-card__row">
                <label>Качество текстур:</label>
                <div class="custom-select" id="defectsQuality">
                  <div class="select-selected">Высокое/Новое (200x300)</div>
                  <div class="select-items"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- ТЕМЫ И ЦВЕТА ИГРОВОЙ -->
          <div class="uwu-settings-card">
            <h3 class="uwu-settings-card__title">Темы и цвета Игровой</h3>
            <hr class="uwu-hr" />

            <div class="uwu-settings-card__item">
              <p>Переопределяет цветовую схему игровых блоков, чата, переходов и подсказок.</p>
              <div class="uwu-settings-card__row">
                <input type="checkbox" id="user-theme" data-setting="userTheme" />
                <label for="user-theme">Использовать свои цвета</label>
              </div>
            </div>

            <div class="uwu-settings-card__item">
              <div id="theme-selector" class="uwu-select"
                style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                <label for="theme-select">Текущая тема:</label>
                <select id="theme-select" class="uwu-select-selected" style="margin-top: 0;"></select>
                <button id="addThemeButton" class="uwu-button install-button">Добавить тему</button>
                <button id="removeThemeButton" style="display: none;" class="uwu-button remove-button">Удалить тему</button>
              </div>
            </div>

            <div id="color-picker" style="margin-top: 4px;">
              <div id="theme-pickers-grid" class="gcp-grid"></div>
              <div style="flex: 0 0 100%; margin-top: 14px;">
                <button id="saveThemeButton" class="uwu-button install-button">Сохранить тему</button>
              </div>
            </div>

            <div class="uwu-settings-card__item">
              <p>Распространяет выбранную цветовую тему на страницу Конструктора окрасов (КНС).</p>
              <div class="uwu-settings-card__row">
                <input type="checkbox" id="user-theme-kns" data-setting="userThemeKns" />
                <label for="user-theme-kns">Цвета в конструкторе окрасов</label>
              </div>
            </div>

            <div class="uwu-settings-card__item">
              <p>Добавляет матовое размытие (Backdrop Blur) под основными блоками Игровой.</p>
              <div class="uwu-settings-card__row">
                <input type="checkbox" id="glass-style" data-setting="glassStyle" />
                <label for="glass-style">Эффект стекла (Blur)</label>
              </div>
            </div>
          </div>

          <!-- ШРИФТЫ И ТЕКСТ -->
          <div class="uwu-settings-card">
            <h3 class="uwu-settings-card__title">Шрифты и текст</h3>
            <hr class="uwu-hr" />

            <div class="uwu-settings-card__item">
              <p>Позволяет настроить сторонний шрифт и точные размеры элементов интерфейса.</p>
              <div class="uwu-settings-card__row">
                <input type="checkbox" id="use-User-Fonts" data-setting="useUserFonts" />
                <label for="use-User-Fonts">Включить кастомные шрифты</label>
              </div>
            </div>

            <div class="uwu-settings-card__item">
              <div class="uwu-settings-card__row">
                <label style="min-width: 140px;">Основной шрифт (px):</label>
                <input type="text" id="font-Size-Body" placeholder="14" data-font-size="fontSizeBody"
                  style="width: 80px;" />
              </div>
              <div class="uwu-settings-card__row">
                <label style="min-width: 140px;">Быстрые ссылки (px):</label>
                <input type="text" id="font-Size-Small" placeholder="12" data-font-size="fontSizeSmall"
                  style="width: 80px;" />
              </div>
              <div class="uwu-settings-card__row">
                <label style="min-width: 140px;">Название локации (px):</label>
                <input type="text" id="font-Size-Location" placeholder="14" data-font-size="fontSizeLocation"
                  style="width: 80px;" />
              </div>
            </div>

            <div class="uwu-settings-card__item">
              <p>Название шрифта (загружается с Google Fonts автоматически при наличии кириллицы):</p>
              <div class="uwu-settings-card__row">
                <input type="text" id="font-Family-Body" placeholder="Verdana" data-font-size="fontFamilyBody"
                  style="width: 200px;" />
                <a href="https://fonts.google.com/?lang=ru_Cyrl" target="_blank" rel="noopener noreferrer"
                  style="font-size: 12px; text-decoration: underline;">Каталог шрифтов Google</a>
              </div>
            </div>

            <div class="uwu-settings-card__item">
              <details class="uwu-details-card">
                <summary style="cursor: pointer; font-size: 14px; font-weight: 600; padding: 4px 0;">
                  Размеры шрифтов по громкости сообщений (vlm0 – vlm10)
                </summary>
                <div
                  style="display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 8px; margin-top: 10px;">
                  <div><input type="text" id="vlm0" placeholder="10" data-font-size="vlm0" style="width: 50px;" /> <label
                      for="vlm0">0 (Шёпот)</label></div>
                  <div><input type="text" id="vlm1" placeholder="11" data-font-size="vlm1" style="width: 50px;" /> <label
                      for="vlm1">Громкость 1</label></div>
                  <div><input type="text" id="vlm2" placeholder="11.5" data-font-size="vlm2" style="width: 50px;" /> <label
                      for="vlm2">Громкость 2</label></div>
                  <div><input type="text" id="vlm3" placeholder="12" data-font-size="vlm3" style="width: 50px;" /> <label
                      for="vlm3">Громкость 3</label></div>
                  <div><input type="text" id="vlm4" placeholder="12.5" data-font-size="vlm4" style="width: 50px;" /> <label
                      for="vlm4">Громкость 4</label></div>
                  <div><input type="text" id="vlm5" placeholder="13" data-font-size="vlm5" style="width: 50px;" /> <label
                      for="vlm5">5 (Стандарт)</label></div>
                  <div><input type="text" id="vlm6" placeholder="15" data-font-size="vlm6" style="width: 50px;" /> <label
                      for="vlm6">Громкость 6</label></div>
                  <div><input type="text" id="vlm7" placeholder="17" data-font-size="vlm7" style="width: 50px;" /> <label
                      for="vlm7">Громкость 7</label></div>
                  <div><input type="text" id="vlm8" placeholder="19" data-font-size="vlm8" style="width: 50px;" /> <label
                      for="vlm8">Громкость 8</label></div>
                  <div><input type="text" id="vlm9" placeholder="21" data-font-size="vlm9" style="width: 50px;" /> <label
                      for="vlm9">Громкость 9</label></div>
                  <div><input type="text" id="vlm10" placeholder="23" data-font-size="vlm10" style="width: 50px;" /> <label
                      for="vlm10">10 (Крик)</label></div>
                </div>
              </details>
            </div>
          </div>

          <!-- РЕДИЗАЙН ИГРОВОЙ -->
          <div class="uwu-settings-card">
            <h3 class="uwu-settings-card__title">Редизайн Игровой</h3>
            <hr class="uwu-hr" />

            <div class="uwu-settings-card__item">
              <p>Компактная трёхколоночная сетка интерфейса Игровой с возможностью настройки порядка.</p>
              <div class="uwu-settings-card__row">
                <input type="checkbox" id="custom-layout" data-setting="customLayout" />
                <label for="custom-layout">Компактный редизайн</label>
              </div>
            </div>

            <div id="layout-customizer" style="margin: 8px 0;">
              <div id="layout-preview">
                <div class="column left"></div>
                <div class="column center">
                  <div class="block center-block">Поле Игровой</div>
                </div>
                <div class="column right"></div>
                <ul id="block-list"></ul>
              </div>
              <button id="reset-layout-button" class="uwu-button remove-button">Сбросить макет</button>
            </div>

            <div class="uwu-settings-card__item">
              <div class="uwu-settings-card__row">
                <label style="min-width: 140px;">Высота чата (px):</label>
                <input type="text" id="chat-height" placeholder="275" data-setting="chatHeight" style="width: 90px;" />
              </div>
              <div class="uwu-settings-card__row">
                <label style="min-width: 140px;">Высота истории (px):</label>
                <input type="text" id="history-height" placeholder="215" data-setting="historyHeight"
                  style="width: 90px;" />
              </div>
              <div class="uwu-settings-card__row">
                <label style="min-width: 140px;">Высота рта/вещей (px):</label>
                <input type="text" id="item-list-height" placeholder="180" data-setting="itemListHeight"
                  style="width: 90px;" />
              </div>
            </div>

            <div class="uwu-settings-card__item">
              <p>Разделяет единую таблицу информации на отдельные независимые блоки.</p>
              <div class="uwu-settings-card__row">
                <input type="checkbox" id="slice-info-block" data-setting="sliceInfoBlock" />
                <label for="slice-info-block">Разделить блок Информации</label>
              </div>
            </div>

            <div class="uwu-settings-card__item">
              <p>Компактное отображение шкал потребностей и навыков в две колонки бок о бок.</p>
              <div class="uwu-settings-card__row">
                <input type="checkbox" id="two-column-parameters" data-setting="twoColumnParameters" />
                <label for="two-column-parameters">Компактные параметры и навыки</label>
              </div>
            </div>

            <div class="uwu-settings-card__item">
              <p>Автоматически скрывает блок «Родственные связи» при входе в Игровую.</p>
              <div class="uwu-settings-card__row">
                <input type="checkbox" id="hide-relatives-default" data-setting="hideRelativesByDefault" />
                <label for="hide-relatives-default">Скрывать Родственные связи по умолчанию</label>
              </div>
            </div>

            <div class="uwu-settings-card__item">
              <p>Скругляет углы основных панелей и блоков Игровой.</p>
              <div class="uwu-settings-card__row">
                <input type="checkbox" id="edge-trim-blocks" data-setting="edgeTrimBlocks" />
                <label for="edge-trim-blocks">Скругление блоков</label>
              </div>
            </div>
          </div>

          <!-- РЕДИЗАЙНЫ СТРАНИЦ САЙТА -->
          <div class="uwu-settings-card">
            <h3 class="uwu-settings-card__title">Редизайны страниц сайта</h3>
            <hr class="uwu-hr" />

            <div class="uwu-settings-card__item">
              <p>Добавляет картинки костюмов в списки для удобного поиска. Высоту списков можно растягивать мышкой за уголок
                в нижнем правом краю!</p>
              <div class="uwu-settings-card__row">
                <input type="checkbox" id="redesign-Costums-Settings" data-setting="redesignCostumsSettings" />
                <label for="redesign-Costums-Settings">Редизайн страницы костюмов</label>
              </div>
            </div>

            <div class="uwu-settings-card__item">
              <p>Современные таблицы отчётов автоматических племенных действий.</p>
              <div class="uwu-settings-card__row">
                <input type="checkbox" id="automatic-actions-redesign" data-setting="automaticActionsRedesign" />
                <label for="automatic-actions-redesign">Редизайн племенных отчетов</label>
              </div>
            </div>

            <div class="uwu-settings-card__item">
              <p>Превращает текстовые ссылки меню персонажа (Обучение, Блоги, Настройки) в удобные кнопки.</p>
              <div class="uwu-settings-card__row">
                <input type="checkbox" id="profile-menu-redesign" data-setting="profileMenuRedesign" />
                <label for="profile-menu-redesign">Редизайн меню профиля</label>
              </div>
            </div>

            <div class="uwu-settings-card__item">
              <p>Отображает аватарку кота рядом с его комментарием в блогах и лентах.</p>
              <div class="uwu-settings-card__row">
                <input type="checkbox" id="comments-avatars" data-setting="commentsAvatars" />
                <label for="comments-avatars">Аватарки в комментариях</label>
              </div>
            </div>

            <div class="uwu-settings-card__item">
              <p>Обновленный каталог блогов с кликабельной сортировкой по столбцам таблицы.</p>
              <div class="uwu-settings-card__row">
                <input type="checkbox" id="blogsea-redesign" data-setting="blogseaRedesign" />
                <label for="blogsea-redesign">Редизайн поиска блогов/лент</label>
              </div>
            </div>

            <div class="uwu-settings-card__item">
              <p>Оформление постов и навигации блогов в виде карточек.</p>
              <div class="uwu-settings-card__row">
                <input type="checkbox" id="blogs-redesign" data-setting="blogsRedesign" />
                <label for="blogs-redesign">Редизайн постов в блогах/лентах</label>
              </div>
            </div>
          </div>

          <!-- ЧАТ ИГРОВОЙ -->
          <div class="uwu-settings-card">
            <h3 class="uwu-settings-card__title">Чат Игровой</h3>
            <hr class="uwu-hr" />

            <div class="uwu-settings-card__item">
              <p>Отображает уникальный числовой ID рядом с ником персонажа.</p>
              <div class="uwu-settings-card__row">
                <input type="checkbox" id="show-chat-id" data-setting="showChatId" />
                <label for="show-chat-id">Показывать ID в чате</label>
              </div>
            </div>

            <div class="uwu-settings-card__item">
              <p>Звуковое уведомление при упоминании вашего ника или псевдонимов в чате:</p>
              <div id="myNameNotificationSoundContainer" class="uwu-settings-card__row">
                <div class="custom-select" id="myNameNotificationSound">
                  <div class="select-selected">Выберите звук</div>
                  <div class="select-items"></div>
                </div>
                <div id="notification-volume" style="display: flex; align-items: center; gap: 8px;">
                  <label>Громкость:</label>
                  <input type="range" min="1" max="10" value="5" id="notification-MyName-Volume" list="volumeStep"
                    data-setting="notificationMyNameVolume" style="width: 100px;" />
                  <datalist id="volumeStep">
                    <option value="1">10%</option>
                    <option value="10">100%</option>
                  </datalist>
                </div>
              </div>
            </div>

            <div class="uwu-settings-card__item">
              <p>Псевдонимы и клички для упоминаний (через запятую: Кот, Котик, Мяу):</p>
              <input type="text" id="names-For-Notification" placeholder="Кот, Котик..." data-setting="namesForNotification"
                style="width: 100%; max-width: 380px;" />
            </div>

            <div class="uwu-settings-card__item">
              <p>Инвертирует порядок сообщений (новые снизу) и переносит ввод под чат.</p>
              <div class="uwu-settings-card__row">
                <input type="checkbox" id="reverse-Chat" data-setting="reverseChat" />
                <label for="reverse-Chat">Инверсия чата</label>
              </div>
            </div>

            <div class="uwu-settings-card__item">
              <p>Альтернативное поле ввода с поддержкой растягивания по вертикали.</p>
              <div class="uwu-settings-card__row">
                <input type="checkbox" id="new-chat-input" data-setting="newChatInput" />
                <label for="new-chat-input">Альтернативная строка ввода сообщений</label>
              </div>
            </div>

            <div class="uwu-settings-card__item">
              <p>Индикатор лимита длины текста в строке ввода.</p>
              <div class="uwu-settings-card__row">
                <input type="checkbox" id="show-chat-char-counter" data-setting="showChatCharCounter" />
                <label for="show-chat-char-counter">Показывать счётчик символов в чате</label>
              </div>
            </div>

            <div class="uwu-settings-card__item">
              <p>Отображает должность кота в скобках после его имени.</p>
              <div class="uwu-settings-card__row">
                <input type="checkbox" id="show-chat-ranks" data-setting="showChatRanks" />
                <label for="show-chat-ranks">Показывать должности</label>
              </div>
            </div>

            <div class="uwu-settings-card__item">
              <p>Добавляет штамп времени перед текстом сообщения.</p>
              <div class="uwu-settings-card__row">
                <input type="checkbox" id="show-chat-time" data-setting="showChatTime" />
                <label for="show-chat-time">Показывать время сообщений</label>
              </div>
            </div>

            <div class="uwu-settings-card__item">
              <p>Игнорирует цвета сообщений других игроков, оставляя только их шрифты.</p>
              <div class="uwu-settings-card__row">
                <input type="checkbox" id="disable-custom-chat-colors" data-setting="disableCustomChatColors" />
                <label for="disable-custom-chat-colors">Не красить в кастомные цвета текст чата</label>
              </div>
            </div>
          </div>

          <!-- ПАРАМЕТРЫ И НАВЫКИ -->
          <div class="uwu-settings-card">
            <h3 class="uwu-settings-card__title">Параметры и навыки</h3>
            <hr class="uwu-hr" />

            <div class="uwu-settings-card__item">
              <p>Заменяет стандартные градиенты шкал потребностей и умений на собственные.</p>
              <div class="uwu-settings-card__row">
                <input type="checkbox" id="user-Parameters-Theme" data-setting="userParametersTheme" />
                <label for="user-Parameters-Theme">Использовать своё оформление</label>
              </div>
            </div>

            <div id="parameters-color-settings" class="parameters-color-settings">
              <table class="parameters-color-table">
                <thead>
                  <tr>
                    <th rowspan="2" class="parameters-color-table--header parameters-color-table--name-th">Параметр</th>
                    <th colspan="2" class="parameters-color-table--header parameters-color-table--group-th">Заливка шкалы
                    </th>
                    <th colspan="2" class="parameters-color-table--header">Фон шкалы</th>
                  </tr>
                  <tr>
                    <th class="parameters-color-table--sub-header">От</th>
                    <th class="parameters-color-table--sub-header parameters-color-table--divider-th">До</th>
                    <th class="parameters-color-table--sub-header">От</th>
                    <th class="parameters-color-table--sub-header">До</th>
                  </tr>
                </thead>
                <tbody id="color-settings-body" class="parameters-color-table--body"></tbody>
              </table>
            </div>

            <div class="uwu-settings-card__item">
              <p>Отображает точные числовые значения поверх полосок навыков.</p>
              <div class="uwu-settings-card__row">
                <input type="checkbox" id="show-exact-skills-values" data-setting="showExactSkillsValues" />
                <label for="show-exact-skills-values">Точные значения навыков</label>
              </div>
            </div>

            <div class="uwu-settings-card__item">
              <p>Импорт и экспорт цветовой палитры параметров в формате JSON:</p>
              <div class="uwu-settings-card__row">
                <input type="text" id="param-colors-export-field" placeholder="Экспорт" readonly style="width: 140px;" />
                <input type="text" id="param-colors-import-field" placeholder="Импорт" style="width: 140px;" />
                <button id="param-colors-import-btn" class="uwu-button install-button">Вставить</button>
              </div>
            </div>

            <div class="uwu-settings-card__item">
              <p>Добавляет тень под текст на шкалах для читаемости на светлых темах.</p>
              <div class="uwu-settings-card__row">
                <input type="checkbox" id="parameters-Text-Shadow" data-setting="parametersTextShadow" />
                <label for="parameters-Text-Shadow">Тень текста параметров</label>
              </div>
            </div>

            <div class="uwu-settings-card__item">
              <p>Журнал истории прироста боевых умений (БУ).</p>
              <div class="uwu-settings-card__row">
                <input type="checkbox" id="show-might-history" data-setting="showMightHistory" />
                <label for="show-might-history">История прокачки БУ</label>
              </div>
            </div>

            <div class="uwu-settings-card__item">
              <p>Накладывает текстурный узор поверх шкал параметров.</p>
              <div class="uwu-settings-card__row">
                <input type="checkbox" id="parameters-Background-Image" data-setting="parametersBackgroundImage" />
                <label for="parameters-Background-Image">Стандартный узор</label>
              </div>
            </div>

            <div class="uwu-settings-card__item">
              <p>Накладывает пользовательскую текстуру по прямой ссылке.</p>
              <div class="uwu-settings-card__row">
                <input type="checkbox" id="parameters-User-Background-Image" data-setting="parametersUserBackgroundImage" />
                <label for="parameters-User-Background-Image">Свой узор:</label>
                <input type="text" id="parametersUserBackgroundImageField" placeholder="Вставьте URL"
                  data-setting="parametersUserBackgroundImageURL" />
                <button id="SettingSaveButton1" class="uwu-button install-button">Сохранить</button>
              </div>
            </div>
          </div>
        </div>

        <div id="utility-panel">
          <!-- ПОДСВЕТКА РЕСУРСОВ -->
          <div class="uwu-settings-card">
            <h3 class="uwu-settings-card__title">Подсветка ресурсов</h3>
            <hr class="uwu-hr" />

            <div class="uwu-settings-card__item">
              <p>Подсвечивает клетки с ценными травами, мхом, предметами и паутиной.</p>
              <div class="uwu-settings-card__row">
                <input type="checkbox" id="highlight-Resources" data-setting="highlightResources" />
                <label for="highlight-Resources">Включить подсветку</label>
              </div>
            </div>

            <div class="uwu-settings-card__item">
              <div class="uwu-settings-card__row">
                <label>Стиль подсветки предметов:</label>
                <div class="custom-select" id="highlightResourcesStyle">
                  <div class="select-selected">Выберите стиль подсветки предметов</div>
                  <div class="select-items"></div>
                </div>
                <label id="uwu-what-this"
                  title="Стиль 'Фон' подсвечивает всю клетку и не нагружает Игровую.&#10;Стиль 'Свечение' дублирует содержимое ячейки и стилизует его, что может снижать FPS на слабых устройствах.">[?]</label>
              </div>
            </div>

            <div class="uwu-settings-card__item" style="overflow-x: auto;">
              <table class="uwu-table-highlight-Resources gcp-table">
                <thead>
                  <tr>
                    <th>Название</th>
                    <th>Цвет</th>
                    <th>Подсвечивать?</th>
                  </tr>
                </thead>
                <tbody id="resources-table-body"></tbody>
              </table>
            </div>
          </div>

          <!-- ШАБЛОНЫ СООБЩЕНИЙ -->
          <div class="uwu-settings-card">
            <h3 class="uwu-settings-card__title">Шаблоны сообщений</h3>
            <hr class="uwu-hr" />

            <div class="uwu-settings-card__item">
              <p>Позволяет сохранять заготовки текстов и быстро вставлять их в формы ввода.</p>
              <div class="uwu-settings-card__row">
                <input type="checkbox" id="show-Templates" data-setting="showTemplates" />
                <label for="show-Templates">Отображать панель шаблонов</label>
              </div>
            </div>

            <div class="uwu-settings-card__item" style="overflow-x: auto;">
              <table id="uwu-table-templates" class="gcp-table">
                <thead>
                  <tr>
                    <th>Личные сообщения</th>
                    <th>Чаты</th>
                    <th>Блоги и Лента</th>
                    <th>Комментарии</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="uwu-checkbox-cell">
                      <input type="checkbox" data-setting="templatesInLs" />
                    </td>
                    <td class="uwu-checkbox-cell">
                      <input type="checkbox" data-setting="templatesInChats" />
                    </td>
                    <td class="uwu-checkbox-cell">
                      <input type="checkbox" data-setting="templatesInBlogsAndSniffs" />
                    </td>
                    <td class="uwu-checkbox-cell">
                      <input type="checkbox" data-setting="templatesInComments" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- БОЕВОЙ РЕЖИМ -->
          <div class="uwu-settings-card">
            <h3 class="uwu-settings-card__title">Боевой режим</h3>
            <hr class="uwu-hr" />

            <div class="uwu-settings-card__item">
              <p>Группирует повторяющиеся удары в логе боя и добавляет счётчик (x2, x3...).</p>
              <div class="uwu-settings-card__row">
                <input type="checkbox" id="compact-Fight-Log" data-setting="compactFightLog" />
                <label for="compact-Fight-Log">Компактный боевой лог</label>
              </div>
            </div>

            <div class="uwu-settings-card__item">
              <p>Возможность разделять котов на цветные команды в панели Боевого Режима.</p>
              <div class="uwu-settings-card__row">
                <input type="checkbox" id="Fight-Teams" data-setting="fightTeams" />
                <label for="Fight-Teams">Команды в БР</label>
                <input type="text" id="fightTeamsPanelHightField" placeholder="100" data-setting="fightTeamsPanelHight"
                  style="width: 70px; margin-left: 10px;" />
                <label>px (высота панели)</label>
              </div>
            </div>

            <div class="uwu-settings-card__item">
              <p>Звуковой сигнал при нажатии и отжатии щита блокирования:</p>
              <div id="notificationBlockSoundContainer" class="uwu-settings-card__row">
                <input type="checkbox" id="notification-Block" data-setting="notificationBlock" />
                <label for="notification-Block">Звук блока</label>
                <div class="custom-select" id="notificationBlockSound">
                  <div class="select-selected">Выберите звук</div>
                  <div class="select-items"></div>
                </div>
                <div id="notification-volume" style="display: flex; align-items: center; gap: 8px;">
                  <label>Громкость:</label>
                  <input type="range" min="1" max="10" value="5" id="notificationBlockVolume" list="volumeStep"
                    data-setting="notificationBlockVolume" style="width: 100px;" />
                </div>
                <div id="notificationBlockContainer"></div>
              </div>
            </div>

            <div class="uwu-settings-card__item" style="overflow-x: auto; margin-top: 4px;">
              <table id="colorSettingsTable" class="gcp-table">
                <thead>
                  <tr>
                    <th>Команда</th>
                    <th>Цвет энергии</th>
                    <th>Цвет снесённого</th>
                  </tr>
                </thead>
                <tbody id="fight-teams-table-body"></tbody>
              </table>
            </div>
          </div>

          <!-- ЧАСЫ В ИГРОВОЙ -->
          <div class="uwu-settings-card">
            <h3 class="uwu-settings-card__title">Часы в Игровой</h3>
            <hr class="uwu-hr" />

            <div class="uwu-settings-card__item">
              <p>Отображает часы с синхронизацией точного времени по сети.</p>
              <div class="uwu-settings-card__row">
                <input type="checkbox" id="describe-show-clock" data-setting="showClock" />
                <label for="describe-show-clock">Включить часы</label>
              </div>
            </div>

            <div class="uwu-settings-card__item">
              <div class="uwu-settings-card__row">
                <label style="min-width: 130px;">Стиль часов:</label>
                <div class="custom-select" id="clockStyle">
                  <div class="select-selected">Выберите стиль</div>
                  <div class="select-items"></div>
                </div>
              </div>
              <div class="uwu-settings-card__row">
                <label style="min-width: 130px;">Расположение:</label>
                <div class="custom-select" id="clockPosition">
                  <div class="select-selected">Выберите положение</div>
                  <div class="select-items"></div>
                </div>
              </div>
            </div>

            <div class="uwu-settings-card__item">
              <div class="uwu-settings-card__row">
                <input type="checkbox" id="describe-clock-Moscow-Time" data-setting="clockMoscowTime" />
                <label for="describe-clock-Moscow-Time">Московское время (MSK)</label>
              </div>
            </div>

            <div class="uwu-settings-card__item">
              <div class="uwu-settings-card__row">
                <label style="min-width: 130px;">Размер шрифта (px):</label>
                <input type="text" id="clock-Font-Size" placeholder="14" data-setting="clockFontSize"
                  style="width: 70px;" />
                <button id="resetClockPosition" class="uwu-button remove-button" style="margin-left: 10px;">Сброс позиции
                  часов</button>
              </div>
            </div>
          </div>

          <!-- ТАЙМЕР-НАПОМИНАЛКА -->
          <div class="uwu-settings-card">
            <h3 class="uwu-settings-card__title">Таймер-напоминалка</h3>
            <hr class="uwu-hr" />

            <div class="uwu-settings-card__item">
              <p>Циклический перетаскиваемый таймер в Игровой с подачей звукового сигнала по истечении заданного времени.
              </p>
              <div class="uwu-settings-card__row">
                <input type="checkbox" id="interval-timer-enabled" data-setting="intervalTimerEnabled" />
                <label for="interval-timer-enabled">Включить таймер-напоминалку</label>
              </div>
            </div>

            <div class="uwu-settings-card__item">
              <div id="intervalTimerContainer" class="uwu-settings-card__row">
                <label>Звук таймера:</label>
                <div class="custom-select" id="intervalTimerSound">
                  <div class="select-selected">Выберите звук</div>
                  <div class="select-items"></div>
                </div>
                <div id="notification-volume" style="display: flex; align-items: center; gap: 8px;">
                  <label>Громкость:</label>
                  <input type="range" min="1" max="10" value="5" id="intervalTimerVolume" list="volumeStep"
                    data-setting="intervalTimerVolume" style="width: 100px;" />
                </div>
              </div>
            </div>
          </div>

          <!-- РОТ И ИНВЕНТАРЬ -->
          <div class="uwu-settings-card">
            <h3 class="uwu-settings-card__title">Рот (Инвентарь)</h3>
            <hr class="uwu-hr" />

            <div class="uwu-settings-card__item">
              <p>Добавляет чекбокс для предотвращения случайного опускания выбранного предмета из рта.</p>
              <div class="uwu-settings-card__row">
                <input type="checkbox" id="block-item-drop" data-setting="blockItemDrop" />
                <label for="block-item-drop">Блокировка опускания предмета</label>
              </div>
            </div>
          </div>

          <!-- ОХОТА И ДЖОЙСТИК -->
          <div class="uwu-settings-card">
            <h3 class="uwu-settings-card__title">Охота и джойстик</h3>
            <hr class="uwu-hr" />

            <div class="uwu-settings-card__item">
              <p>Отображает текстовую подсказку (ближе/дальше) и таймер на индикаторе запаха во время охоты.</p>
              <div class="uwu-settings-card__row">
                <input type="checkbox" id="describe-Hunting-Smell" data-setting="describeHuntingSmell" />
                <label for="describe-Hunting-Smell">Подсказки на запахе</label>
              </div>
            </div>

            <div class="uwu-settings-card__item">
              <p>Сенсорный джойстик на экране охоты для удобного перемещения с мобильных устройств.</p>
              <div class="uwu-settings-card__row">
                <input type="checkbox" id="hunting-Virtual-Joystick" data-setting="huntingVirtualJoystick" />
                <label for="hunting-Virtual-Joystick">Виртуальный джойстик</label>
                <input type="text" id="sizeHuntingVirtualJoystickField" placeholder="150"
                  data-setting="sizeHuntingVirtualJoystick" style="width: 70px; margin-left: 10px;" />
                <label>px (диаметр, по умолчанию 150)</label>
              </div>
            </div>
          </div>

          <!-- ИНФОРМАЦИЯ И КАЛЬКУЛЯТОРЫ -->
          <div class="uwu-settings-card">
            <h3 class="uwu-settings-card__title">Информация о котах и профили</h3>
            <hr class="uwu-hr" />

            <div class="uwu-settings-card__item">
              <p>Добавляет кнопку «Подробнее» во всплывающую подсказку «О коте» (дефекты, размер, ID).</p>
              <div class="uwu-settings-card__row">
                <input type="checkbox" id="show-More-Cat-Info" data-setting="showMoreCatInfo" />
                <label for="show-More-Cat-Info">Больше информации во всплывающем окне</label>
              </div>
            </div>

            <div class="uwu-settings-card__item">
              <p>Группирует одинаковые предметы в инвентаре подсказки «О коте» со счётчиком количества.</p>
              <div class="uwu-settings-card__row">
                <input type="checkbox" id="compact-Mouth" data-setting="compactMouth" />
                <label for="compact-Mouth">Компактный инвентарь чужих котов</label>
              </div>
            </div>

            <div class="uwu-settings-card__item">
              <p>Кнопка «Подробнее» над собственными шкалами с расчётом точного времени восстановления потребностей.</p>
              <div class="uwu-settings-card__row">
                <input type="checkbox" id="show-Parameter-Details" data-setting="showParametersDetails" />
                <label for="show-Parameter-Details">Подробная статистика параметров</label>
              </div>
            </div>

            <div class="uwu-settings-card__item">
              <p>Отображает уровень боевых умений (БУ) цифрой в профилях персонажей.</p>
              <div class="uwu-settings-card__row">
                <input type="checkbox" id="more-Profile-Info" data-setting="moreProfileInfo" />
                <label for="more-Profile-Info">БУ цифрой в профиле</label>
              </div>
            </div>

            <div class="uwu-settings-card__item">
              <p>Встраивает интерактивные калькуляторы активности и возраста (лун) в профили кошек.</p>
              <div class="uwu-settings-card__row">
                <input type="checkbox" id="calculators" data-setting="calculators" />
                <label for="calculators">Калькуляторы активности и лун</label>
              </div>
            </div>
          </div>

          <!-- МИННОЕ ПОЛЕ -->
          <div class="uwu-settings-card">
            <h3 class="uwu-settings-card__title">Минное поле</h3>
            <hr class="uwu-hr" />

            <div class="uwu-settings-card__item">
              <p>Интерактивная панель для составления и сохранения карт лазательных локаций (минных полей).</p>
              <div class="uwu-settings-card__row">
                <input type="checkbox" id="climbing-panel" data-setting="climbingPanel" />
                <label for="climbing-panel">Включить окно минного поля</label>
              </div>
            </div>

            <div class="uwu-settings-card__item">
              <p>Управление вкладками и сохраненными таблицами локаций:</p>
              <h4 style="margin: 4px 0;">Вкладки:</h4>
              <div id="uwu-buttonRow1-settings"></div>
              <h4 style="margin: 6px 0 4px;">Локации / Таблицы:</h4>
              <div id="uwu-buttonRow2-settings"></div>
            </div>

            <div class="uwu-settings-card__item">
              <div class="uwu-settings-card__row">
                <label style="min-width: 140px;">Ориентация панели:</label>
                <div class="custom-select" id="climbingPanelOrientation">
                  <div class="select-selected">Вертикальный</div>
                  <div class="select-items"></div>
                </div>
              </div>
              <div class="uwu-settings-card__row">
                <label style="min-width: 140px;">Способ ввода данных:</label>
                <div class="custom-select" id="climbingPanelInputsStyle">
                  <div class="select-selected">Клавиатура</div>
                  <div class="select-items"></div>
                </div>
              </div>
            </div>

            <div class="uwu-settings-card__item">
              <details class="uwu-details-card">
                <summary style="cursor: pointer; font-weight: 600;">⌨ Как ставить отметки с клавиатуры?</summary>
                <div style="font-size: 13px; line-height: 1.5; margin-top: 6px; opacity: 0.85;">
                  • ЛКМ — выбрать клетку.<br>
                  • Цифры от <b>0</b> до <b>7</b> — поставить число мин.<br>
                  • Знак минус ( <b>-</b> ) — красная опасная клетка (мина).<br>
                  • Знак равно ( <b>=</b> ) — яркая клетка (переход, не стирается кнопкой очистки).<br>
                  • Два клика ЛКМ по ячейке — стереть её значение.
                </div>
              </details>
            </div>

            <div class="uwu-settings-card__item">
              <p>Отображает числовую громкость уведомления в чате (количество мин вокруг кота).</p>
              <div class="uwu-settings-card__row">
                <input type="checkbox" id="climbing-Notifications-Numbers" data-setting="climbingNotificationsNumbers" />
                <label for="climbing-Notifications-Numbers">Подписывать числовую громкость в чате</label>
              </div>
            </div>

            <div class="uwu-settings-card__item">
              <p>Звуковое оповещение при обновлении карты опасных клеток:</p>
              <div id="climbingRefreshNotificationSoundContainer" class="uwu-settings-card__row">
                <input type="checkbox" id="climbing-Refresh-Notification" data-setting="climbingRefreshNotification" />
                <label for="climbing-Refresh-Notification">Звук обновления</label>
                <div class="custom-select" id="climbingRefreshNotificationSound">
                  <div class="select-selected">Выберите звук</div>
                  <div class="select-items"></div>
                </div>
                <div id="notification-volume" style="display: flex; align-items: center; gap: 8px;">
                  <label>Громкость:</label>
                  <input type="range" min="1" max="10" value="5" id="climbing-Refresh-Notification-Volume" list="volumeStep"
                    data-setting="climbingRefreshNotificationVolume" style="width: 100px;" />
                </div>
              </div>
            </div>
          </div>

          <!-- ЛОГИ ЧИСТИЛЬЩИКА И ЛОВЛИ -->
          <div class="uwu-settings-card">
            <h3 class="uwu-settings-card__title">Логи чистки и ловли (BETA)</h3>
            <hr class="uwu-hr" />

            <div class="uwu-settings-card__item">
              <p>Журнал чистильщика: автоматическая фиксация проверок сна, поднятий и опусканий котов.</p>
              <div class="uwu-settings-card__row">
                <input type="checkbox" id="cleaning-Log" data-setting="cleaningLog" />
                <label for="cleaning-Log">Включить лог чистильщика</label>
                <div class="custom-select" id="cleaningLogStyle" style="margin-left: 10px;">
                  <div class="select-selected">Умный</div>
                  <div class="select-items"></div>
                </div>
              </div>
              <div class="uwu-settings-card__item">
                <details class="uwu-details-card">
                  <summary style="cursor: pointer; font-weight: 600;">🐾 Как работает лог чистильщика?</summary>
                  <div style="font-size: 13px; line-height: 1.45; margin-top: 6px; opacity: 0.85;">
                    <b>1.</b> Проверьте кота действием («потереться носом», «щекой о щёку», «помурлыкать» или
                    «обнюхать»).<br>
                    <b>2.</b> Если кот спит — смело поднимайте, лог запишет его. Если не спит или вы забыли проверить — лог
                    предупредит об этом.<br>
                    <b>3.</b> Кнопка с корзинкой рядом с очисткой лога удаляет <i>последнего опущенного кота</i> (например,
                    если он проснулся и выпросился гулять).
                  </div>
                </details>
              </div>
              <div class="uwu-settings-card__row" style="margin-top: 4px;">
                <input type="checkbox" id="cleaning-Log-ShowID" data-setting="cleaningLogShowID" />
                <label for="cleaning-Log-ShowID">Записывать ID персонажей</label>
                <input type="text" id="cleaning-Log-Height" placeholder="120" data-setting="cleaningLogHeight"
                  style="width: 70px; margin-left: 10px;" />
                <label>px (высота)</label>
              </div>
            </div>

            <div class="uwu-settings-card__item" style="margin-top: 10px;">
              <p>Журнал ловли: фиксация попыток ныряния и осмотра расщелин с учётом выловленной добычи.</p>
              <div class="uwu-settings-card__row">
                <input type="checkbox" id="catching-Log" data-setting="catchingLog" />
                <label for="catching-Log">Включить лог ловли</label>
                <input type="text" id="catching-Log-Height" placeholder="120" data-setting="catchingLogHeight"
                  style="width: 70px; margin-left: 10px;" />
                <label>px (высота)</label>
              </div>
            </div>

            <div class="uwu-settings-card__item">
              <p>Пользовательские названия предметов по ID (формат: <code>ID=Название</code>, каждое с новой строки):</p>
              <textarea id="catching-log-custom-items" rows="5" placeholder="3966=Рыба&#10;3967=Большая рыба"
                class="uwu-textarea-field"></textarea>
              <div class="uwu-settings-card__row">
                <button id="save-custom-items-btn" class="uwu-button install-button">Сохранить названия</button>
                <input type="text" id="custom-items-export-field" placeholder="Экспорт" readonly style="width: 120px;" />
                <input type="text" id="custom-items-import-field" placeholder="Импорт" style="width: 120px;" />
                <button id="custom-items-import-btn" class="uwu-button install-button">Вставить</button>
              </div>
            </div>
          </div>

          <!-- БЫСТРЫЕ ССЫЛКИ -->
          <div class="uwu-settings-card">
            <h3 class="uwu-settings-card__title">Быстрые ссылки в Игровой</h3>
            <hr class="uwu-hr" />

            <div class="uwu-settings-card__item">
              <p>Закреплённые ссылки в верхней строке навигации Игровой:</p>
              <div class="uwu-settings-card__row">
                <input type="checkbox" id="quick-Link1" data-setting="quickLink1" />
                <label for="quick-Link1">Настройки</label>
                <input type="checkbox" id="quick-Link2" data-setting="quickLink2" style="margin-left: 10px;" />
                <label for="quick-Link2">Памятка</label>
                <input type="checkbox" id="quick-Link3" data-setting="quickLink3" style="margin-left: 10px;" />
                <label for="quick-Link3">Блоги</label>
                <input type="checkbox" id="quick-Link4" data-setting="quickLink4" style="margin-left: 10px;" />
                <label for="quick-Link4">Лента</label>
              </div>
            </div>

            <div class="uwu-settings-card__item">
              <p>Ваши личные ссылки. Вставьте ссылку, пробел и название. Несколько штук пишите через запятую.<br>
                <i>Пример: https://catwar.net/clan Моё-племя, https://мяу Котики</i>
              </p>
              <input type="text" id="users-quick-Links" placeholder="https://... Название" data-setting="userQuickLinks"
                style="width: 100%; max-width: 480px;" />
            </div>
          </div>

          <!-- ЗВУКОВЫЕ УВЕДОМЛЕНИЯ -->
          <div class="uwu-settings-card">
            <h3 class="uwu-settings-card__title">Звуковые уведомления</h3>
            <hr class="uwu-hr" />

            <div class="uwu-settings-card__item" style="overflow-x: auto;">
              <table class="notification-table gcp-table">
                <thead>
                  <tr>
                    <th>Вкл</th>
                    <th>Событие</th>
                    <th>Мелодия</th>
                    <th>Громкость</th>
                    <th>Тест</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="uwu-checkbox-cell">
                      <input type="checkbox" id="notification-PM" data-setting="notificationPM" />
                    </td>
                    <td><label for="notification-PM">Новое личное сообщение (ЛС)</label></td>
                    <td>
                      <div class="custom-select" id="notificationPMSound">
                        <div class="select-selected">Выберите звук</div>
                        <div class="select-items"></div>
                      </div>
                    </td>
                    <td>
                      <input type="range" min="1" max="10" value="5" id="notificationPMVolume" list="volumeStep"
                        data-setting="notificationPMVolume" style="width: 90px;" />
                    </td>
                    <td id="notificationPMContainer"></td>
                  </tr>

                  <tr>
                    <td class="uwu-checkbox-cell">
                      <input type="checkbox" id="notification-Action-End" data-setting="notificationActionEnd" />
                    </td>
                    <td><label for="notification-Action-End">Завершение длительного действия</label></td>
                    <td>
                      <div class="custom-select" id="notificationActionEndSound">
                        <div class="select-selected">Выберите звук</div>
                        <div class="select-items"></div>
                      </div>
                    </td>
                    <td>
                      <input type="range" min="1" max="10" value="5" id="notificationActionEndVolume" list="volumeStep"
                        data-setting="notificationActionEndVolume" style="width: 90px;" />
                    </td>
                    <td id="notificationActionEndContainer"></td>
                  </tr>

                  <tr>
                    <td class="uwu-checkbox-cell">
                      <input type="checkbox" id="notification-Action-End-Early" data-setting="notificationActionEndEarly" />
                    </td>
                    <td colspan="4">
                      <label for="notification-Action-End-Early">Предупреждать заранее (за 3 секунды до конца)</label>
                    </td>
                  </tr>

                  <tr>
                    <td class="uwu-checkbox-cell">
                      <input type="checkbox" id="notification-In-Mouth" data-setting="notificationInMouth" />
                    </td>
                    <td><label for="notification-In-Mouth">Персонажа взяли в рот</label></td>
                    <td>
                      <div class="custom-select" id="notificationInMouthSound">
                        <div class="select-selected">Выберите звук</div>
                        <div class="select-items"></div>
                      </div>
                    </td>
                    <td>
                      <input type="range" min="1" max="10" value="5" id="notificationInMouthVolume" list="volumeStep"
                        data-setting="notificationInMouthVolume" style="width: 90px;" />
                    </td>
                    <td id="notificationInMouthContainer"></td>
                  </tr>

                  <tr>
                    <td class="uwu-checkbox-cell">
                      <input type="checkbox" id="notification-In-Fight-Mode" data-setting="notificationInFightMode" />
                    </td>
                    <td><label for="notification-In-Fight-Mode">Ввели в боевую стойку (Т+2 / Т+3)</label></td>
                    <td>
                      <div class="custom-select" id="notificationInFightModeSound">
                        <div class="select-selected">Выберите звук</div>
                        <div class="select-items"></div>
                      </div>
                    </td>
                    <td>
                      <input type="range" min="1" max="10" value="5" id="notificationInFightModeVolume" list="volumeStep"
                        data-setting="notificationInFightModeVolume" style="width: 90px;" />
                    </td>
                    <td id="notificationInFightModeContainer"></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="uwu-settings-card__item" style="margin-top: 8px;">
              <p>Дублирует таймер и название текущего действия в заголовок браузерной вкладки.</p>
              <div class="uwu-settings-card__row">
                <input type="checkbox" id="duplicate-Time-In-Browser-Tab" data-setting="duplicateTimeInBrowserTab" />
                <label for="duplicate-Time-In-Browser-Tab">Таймер действия на вкладке</label>
              </div>
            </div>

            <div class="uwu-settings-card__item">
              <p>Отображает подсказку времени перезарядки кнопки «Принюхиваться».</p>
              <div class="uwu-settings-card__row">
                <input type="checkbox" id="show-Hint-When-To-Sniff" data-setting="showHintWhenToSniff" />
                <label for="show-Hint-When-To-Sniff">Подсказка: «Когда нюхать?»</label>
              </div>
            </div>
          </div>

          <!-- ОБЩЕНИЕ И ЛИЧНЫЕ СООБЩЕНИЯ -->
          <div class="uwu-settings-card">
            <h3 class="uwu-settings-card__title">Общение и личные сообщения</h3>
            <hr class="uwu-hr" />

            <div class="uwu-settings-card__item">
              <p>Локальное резервное копирование переписок в браузере для чтения офлайн.</p>
              <div class="uwu-settings-card__row">
                <input type="checkbox" id="saving-LS" data-setting="savingLS" />
                <label for="saving-LS">Сохранение личных сообщений (ЛС)</label>
              </div>
            </div>

            <div class="uwu-settings-card__item">
              <div class="uwu-settings-card__row">
                <button id="import-ls-from-other-mods" class="uwu-button install-button">Импортировать ЛС из других
                  модов</button>
                <input type="text" id="ls-export-field" placeholder="Экспорт ЛС" readonly style="width: 140px;" />
                <input type="text" id="ls-import-field" placeholder="Импорт ЛС" style="width: 140px;" />
                <button id="ls-import-btn" class="uwu-button install-button">Вставить</button>
              </div>
            </div>

            <div class="uwu-settings-card__item">
              <p>Автоматическое сохранение черновика при создании блога во избежание потери текста.</p>
              <div class="uwu-settings-card__row">
                <input type="checkbox" id="restore-Blog-Creation" data-setting="restoreBlogCreation" />
                <label for="restore-Blog-Creation">Восстановление черновика блога</label>
              </div>
            </div>

            <div class="uwu-settings-card__item">
              <p>Расширенная панель дополнительных BB-кодов в формах редактирования.</p>
              <div class="uwu-settings-card__row">
                <input type="checkbox" id="more-BB-Codes" data-setting="moreBBCodes" />
                <label for="more-BB-Codes">Дополнительные BB-коды</label>
              </div>
            </div>

            <div class="uwu-settings-card__item">
              <p>Интерактивный предпросмотр отправляемых комментариев в лентах и блогах.</p>
              <div class="uwu-settings-card__row">
                <input type="checkbox" id="comment-Preview" data-setting="commentPreview" />
                <label for="comment-Preview">Предпросмотр комментариев</label>
              </div>
            </div>

            <div class="uwu-settings-card__item">
              <p>Быстрые кнопки ответа и цитирования выделенного фрагмента текста в комментариях.</p>
              <div class="uwu-settings-card__row">
                <input type="checkbox" id="more-Comment-Buttons" data-setting="moreCommentButtons" />
                <label for="more-Comment-Buttons">Кнопки «Ответить» и «Цитировать»</label>
              </div>
            </div>

            <div class="uwu-settings-card__item">
              <p>Оформление предпросмотра письма в стиле входящего сообщения.</p>
              <div class="uwu-settings-card__row">
                <input type="checkbox" id="ls-Wrap-Preview" data-setting="lsWrapPreview" />
                <label for="ls-Wrap-Preview">Наглядный предпросмотр письма</label>
              </div>
            </div>
          </div>
        </div>

        <div id="modules-panel">
          <!-- ОСНОВНЫЕ НАДСТРОЙКИ -->
          <div class="uwu-settings-card">
            <h3 class="uwu-settings-card__title">Основные надстройки</h3>
            <hr class="uwu-hr" />

            <div class="uwu-settings-card__item">
              <p>Отображает круглую плавающую кнопку для открытия панели расширенных настроек в Игровой.</p>
              <div class="uwu-settings-card__row">
                <input type="checkbox" id="extended-settings-Panel" data-setting="extendedSettingsPanel" />
                <label for="extended-settings-Panel">⚙️ Панель расширенных настроек</label>
              </div>
            </div>

            <div class="uwu-settings-card__item">
              <p>Показывает индикатор и плашку в расширенном меню при выходе новой версии CatWar UwU.</p>
              <div class="uwu-settings-card__row">
                <input type="checkbox" id="show-Update-Notification" data-setting="showUpdateNotification" />
                <label for="show-Update-Notification">Уведомлять об обновлениях скрипта</label>
              </div>
            </div>

            <div class="uwu-settings-card__item">
              <p>Отображает случайные приветственные Splash-фразы в расширенном меню Игровой.</p>
              <div class="uwu-settings-card__row">
                <input type="checkbox" id="show-Splash-Screens" data-setting="showSplashScreens" />
                <label for="show-Splash-Screens">Показывать Splash-надписи</label>
              </div>
            </div>

            <div class="uwu-settings-card__item">
              <p>Скрывать или показывать подробные подсказки к настройкам. Привет, я та самая подсказка! Без меня настройки
                выглядят гораздо компактнее.</p>
              <div class="uwu-settings-card__row">
                <input type="checkbox" id="extended-Hints" data-setting="extendedHints" />
                <label for="extended-Hints">Расширенные подсказки</label>
              </div>
            </div>
          </div>

          <!-- СБОРНИК СТИЛЕЙ -->
          <div class="uwu-settings-card">
            <h3 class="uwu-settings-card__title">Сборник стилей</h3>
            <hr class="uwu-hr" />

            <div class="uwu-settings-card__item">
              <p>Онлайн-каталог дополнительных модулей и модификаций интерфейса от разработчика:</p>
            </div>

            <div id="module-info" class="uwu-modules-grid">
              <!-- -->
            </div>
          </div>

          <!-- ПОЛЬЗОВАТЕЛЬСКИЕ ЗВУКИ -->
          <div class="uwu-settings-card">
            <h3 class="uwu-settings-card__title">Пользовательские звуки</h3>
            <hr class="uwu-hr" />

            <div class="uwu-settings-card__item">
              <p>Добавляйте собственные звуки по прямым ссылкам (mp3, ogg, wav) для использования во всех списках
                уведомлений.</p>
              <div id="custom-sounds-container" class="uwu-custom-sounds-box">
                <div id="custom-sounds-list">
                  <!-- -->
                </div>

                <div class="uwu-settings-card__row" style="margin-top: 10px; align-items: stretch;">
                  <input type="text" id="custom-sound-name" placeholder="Название (напр. Мяу)" style="flex: 1 1 120px;" />
                  <input type="text" id="custom-sound-url" placeholder="URL аудиофайла (https://...)"
                    style="flex: 3 1 220px;" />
                  <button id="add-custom-sound-btn" class="uwu-button install-button"
                    style="flex: 1 1 auto; padding: 0 16px; white-space: nowrap;">
                    Добавить звук
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- ЕДИНОЕ ХРАНИЛИЩЕ -->
          <div class="uwu-settings-card">
            <h3 class="uwu-settings-card__title">Единое хранилище (.net & .su)</h3>
            <hr class="uwu-hr" />

            <div class="uwu-settings-card__item">
              <p>Включает синхронизацию настроек, тем и карт минного поля между доменами CatWar (.net и .su).</p>

              <div class="uwu-warning-note">
                <b>ВНИМАНИЕ:</b> При первом включении ваши текущие настройки именно с <u>этого сайта</u> скопируются в общее
                хранилище и станут главными.<br>
                Обязательно включайте эту галочку на том домене (например, catwar.net), настройки которого хотите сохранить!
              </div>

              <div class="uwu-settings-card__row">
                <input type="checkbox" id="unified-storage" data-setting="unifiedStorage" />
                <label for="unified-storage">Использовать единое хранилище (.net & .su)</label>
              </div>
            </div>
          </div>

          <!-- УПРАВЛЕНИЕ ДАННЫМИ -->
          <div class="uwu-settings-card">
            <h3 class="uwu-settings-card__title">Управление данными</h3>
            <hr class="uwu-hr" />

            <div class="uwu-settings-card__item">
              <p>Полный резервный экспорт и импорт всех настроек скрипта/мода в формате JSON:</p>
              <div class="uwu-settings-card__row">
                <input type="text" id="exportSettings" placeholder="Экспорт" readonly style="width: 150px;" />
                <input type="text" id="importSettings" placeholder="Импорт" style="width: 150px;" />
                <button id="importSettingsButton" class="uwu-button install-button">Импортировать</button>
              </div>
            </div>

            <div class="uwu-settings-card__item" style="margin-top: 10px;">
              <p>Удаляет вообще все сохранения и настройки мода UwU (темы, карты минного поля, историю БУ, звуки). В очень
                редких случаях помогает при багах и проблемных проблемах:</p>
              <div class="uwu-settings-card__row">
                <button id="resetAllSaves" class="uwu-button remove-button">Сброс всех сохранений</button>
              </div>
            </div>
          </div>
        </div>

        <div id="personal-costumes-panel">
          <!-- НАСТРОЙКИ И СОХРАНЕНИЕ -->
          <div class="uwu-settings-card">
            <h3 class="uwu-settings-card__title">Личные костюмы</h3>
            <hr class="uwu-hr" />

            <div class="uwu-settings-card__item">
              <p>Здесь вы можете надевать свои уникальные костюмы, которые будут видны вам во время игры (К сожалению,
                только вам...). Костюмы привязываются персонально к каждому вашему котику!</p>
              <div class="uwu-settings-card__row">
                <input type="checkbox" id="personal-costume-panel" data-setting="personalCostumes" />
                <label for="personal-costume-panel">⚙️ Включить персональные костюмы</label>
              </div>
            </div>

            <div class="uwu-settings-card__item">
              <p>Добавляет «Сохранить костюм» в подсказку при наведении на игрока в Игровой.</p>
              <div class="uwu-settings-card__row">
                <input type="checkbox" id="show-costumes" data-setting="showCostumesButtons" />
                <label for="show-costumes">Сохранять костюмы других игроков</label>
              </div>
            </div>
          </div>

          <!-- ПРИМЕРОЧНАЯ -->
          <div class="uwu-settings-card">
            <h3 class="uwu-settings-card__title">Примерочная котика</h3>
            <hr class="uwu-hr" />

            <div class="costume-flex-box disabled">
              <div class="costumeSettings" style="flex: 2; min-width: 260px;">
                <div id="cat-selector-container"
                  style="margin-bottom: 14px; border-bottom: 1px solid var(--ui-line, rgba(255,255,255,0.1)); padding-bottom: 14px;">
                  <label style="font-weight: 600;">Выберите кота:</label>
                  <div style="display: flex; gap: 8px; align-items: center; margin-top: 6px;">
                    <select id="current-cat-select" class="uwu-select-selected" style="width: 100%; margin: 0;"></select>
                    <button id="delete-cat-btn" class="uwu-button remove-button"
                      title="Удалить этого кота из списка скрипта" style="padding: 6px 12px; margin: 0;">
                      🗑️
                    </button>
                  </div>

                  <label style="display: block; margin-top: 12px; font-weight: 600;">Выберите позу для
                    редактирования:</label>
                  <select id="current-pose-select" class="uwu-select-selected"
                    style="width: 100%; margin: 6px 0 0 0;"></select>
                  <div style="font-size: 12px; opacity: 0.7; margin-top: 6px; line-height: 1.4;">
                    🐾 <i>Позы сохраняются сами, когда вы меняете положение (сидит, лежит, стоит) в Игровой.</i>
                  </div>
                </div>

                <div class="uwu-settings-card__item">
                  <h4 style="margin: 0; font-size: 15px;">Загрузить свой костюм:</h4>
                  <p>Выберите PNG-изображение на прозрачном фоне (желательно 200x300 px или соотношение 2:3):</p>

                  <input type="file" id="costume-file" accept="image/png" class="uwu-file-input" />

                  <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px;">
                    <button class="uwu-button install-button" id="changeCostume"
                      style="flex: 1 1 140px; margin: 0; padding: 8px 12px;">
                      Надеть на позу
                    </button>

                    <button class="uwu-button install-button" id="saveCostumeToNewSlot"
                      style="flex: 1 1 140px; margin: 0; padding: 8px 12px;">
                      В библиотеку (+)
                    </button>
                  </div>
                </div>
              </div>

              <div id="cat-preview-wrapper"
                style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; min-width: 160px; padding: 10px; background: rgba(0,0,0,0.15); border: 1px solid var(--ui-line, rgba(255,255,255,0.1)); border-radius: 12px;">
                <div id="cat-image-container"
                  style="width: 100px; height: 150px; position: relative; border: 1px solid rgba(255,255,255,0.25); border-radius: 10px; overflow: hidden; background: rgba(0,0,0,0.2);">
                </div>
                <p id="cat-preview-name" style="margin: 8px 0 6px; font-weight: 700; text-align: center; font-size: 14px;">
                  ...
                </p>

                <a class="uwu-button remove-button" id="removeCostume"
                  style="font-size: 12px; padding: 4px 12px; text-decoration: none; color: inherit; margin: 0; cursor: pointer;"
                  title="Снять текущий костюм с этой позы кота">
                  Снять костюм
                </a>
              </div>
            </div>

            <div id="no-cats-warning" class="uwu-warning-note" style="display: none; text-align: center; margin-top: 14px;">
              <h4 style="margin: 0 0 6px 0; font-size: 16px;">🔍 Котик ещё не обнаружен!</h4>
              <p style="margin: 0; line-height: 1.5;">
                Чтобы скрипт увидел вашего персонажа:<br>
                1. Убедитесь, что галочка «Включить персональные костюмы» стоит.<br>
                2. Зайдите в <a href="/cw3/" target="_blank" style="text-decoration: underline;">Игровую</a> хотя бы один
                раз.<br>
                3. Вернитесь сюда и обновите страничку.
              </p>
            </div>
          </div>

          <!-- БИБЛИОТЕКА -->
          <div class="uwu-settings-card">
            <h3 class="uwu-settings-card__title">Библиотека костюмов</h3>
            <hr class="uwu-hr" />
            <div class="uwu-settings-card__item">
              <p>Сохранённые наряды, которые можно быстро примерить на любую позу любого вашего кота:</p>
            </div>
            <div class="costume-flex-box" id="costume-gallery" style="margin-top: 8px;"></div>
          </div>
        </div>
      </div>
    </div>
  `;
// ====================================================================================================================
//   . . . HTML БЛОК НОВОСТЕЙ . . .
// ====================================================================================================================
const newsPanel =
  /* HTML */
  `
    <div id="uwu-news-modal" class="uwu-modal-overlay" style="display: none;">
      <div class="uwu-modal-card">
        <div class="uwu-modal-header">
          <h3>🌿 Обновление v${current_uwu_version}</h3>
          <button type="button" class="uwu-modal-close" id="uwu-news-modal-close" title="Закрыть (Esc)">✖</button>
        </div>
        <hr class="uwu-hr" />
        <div class="uwu-modal-body">
          <h4>Главное</h4>
          <p>— Теперь Настройки UwU "нативненько" встроены к остальным навигационным кнопкам в общих Настройках!</p>
          <p>— А так же новейшее переоформление Настроек UwU! Надеюсь вам чуточку понравится...</p>
          <p>— Новости и детали обновления теперь в небольшой кнопочке в Навигационной панели UwU.</p>
          <p>— Полный редизайн карточки "Темы и цвета Игровой".</p>
          <p>— Написан свой ColorPicker для крутых фич: поддержка прозрачности, история цветов и легкого встраивания. Теперь никаких левых ссылок на левые сайты! Все старые браузерные пикеры в моде заменены на него!</p>
          <p>— Быстрые ссылки починены и адаптированы под новую шапку Игровой.</p>
          <p>— Переработка чата: В силу кодовых оснований, теперь само понятие "Современный чат" не актуально и удалено, всё работает на нативный чат.</p>
          <p>— Показ ID котов в чате вынесен в отдельную самостоятельную настройку.</p>
          <hr class="uwu-hr" />
          <h4>Внешний вид</h4>
          <p>— Панель БР: вырезаны лишние костыли драга и высоты (Они теперь тоже нативные).</p>
          <p>— Очищены устаревшие пункты в настройках.</p>
          <p>— Удалены все лишние и ненужные темы настроек UwU... Простите, если кто-то пользовался. Но, возможно, в будущем что-то вернётся на кастомайз!</p>
          <hr class="uwu-hr" />
          <h4>Изменения кода</h4>
          <p>— Удален прикол с Отображением душевых котов.</p>
          <p>— Счётчик символов работает и с ванильной строкой.</p>
          <p>— Возвращена подпись громкости уведомлений для Минного поля.</p>
          <p>— Починен звук получения нового ЛС.</p>
          <p>— Звуковое уведомление о Боевой стойке через Vue.</p>
          <p>— "Подробнее о параметрах" теперь читают из Vue.</p>
          <p>— Добавлен Мини генератор погодных частиц. Используется для фона шапки Хедера Настроек UwU.</p>
          <hr class="uwu-hr" />
          <p class="uwu-modal-date">Дата выпуска: ??.??.26</p>
        </div>
      </div>
    </div>
  `;
// ====================================================================================================================
//   . . . HTML ПАНЕЛЬ РАСШИРЕННЫХ НАСТРОЕК . . .
// ====================================================================================================================
const extendedSettingsButton =
  /* HTML */
  `
    <div id="uwu-extended-settings">
      <button type="button" id="extended-settings-button">
        <img
          src="https://raw.githubusercontent.com/Ibirtem/CatWar/main/images/partly_sunny_rain.png"
          alt="Иконка"
          width="36"
          height="36"
        />
      </button>

      <div id="extended-settings-container">
        <div id="splash-screen-panel"></div>
      </div>
    </div>
  `;
// ====================================================================================================================
//   . . . HTML БЛОК РУЧНОГО УПРАВЛЕНИЯ ПОГОДЫ . . .
// ====================================================================================================================
const manualWeatherPanel =
  /* HTML */
  `
<div id="manual-weather-panel">
<p>Изменения, сделанные в этой панели, носят временный характер и не сохраняются.</p>
<h3>Переключить погоду</h3>
<input type="range" min="1" max="3" value="1" class="uwu-range-slider" id="manualWeather" list="WeatherStep">
<datalist id="WeatherStep">
  <img src="https://raw.githubusercontent.com/Ibirtem/CatWar/main/images/sunny.png" width="36" height="36" option
    value="1"></option>
  <img src="https://raw.githubusercontent.com/Ibirtem/CatWar/main/images/rain_cloud.png" width="36" height="36"
    option value="2"></option>
  <img src="https://raw.githubusercontent.com/Ibirtem/CatWar/main/images/snow_cloud.png" width="36" height="36"
    option value="3"></option>
</datalist>
<div id="temperature-container">
  <p id="temperature"
    title="На это умножается скорость частиц и делится их размер. В будущем будет возможность сохранять и изменять это значение под свой вкус.">
    [?] Текущий модификатор: ...уточнение...</p>
</div>

<h3>Северное Сияние</h3>
<div class="button-container-1">
  <button type="button" id="manualAurora-Off" class="uwu-button-round">
    <img src="https://raw.githubusercontent.com/Ibirtem/CatWar/main/images/icons8-nothern-lights-96.png"
      alt="Иконка" width="48" height="48">
  </button>
  <button type="button" id="manualAurora-B" class="uwu-button-round">
    <img src="https://raw.githubusercontent.com/Ibirtem/CatWar/main/images/icons8-nothern-lights-96_blue.png"
      alt="Иконка" width="48" height="48">
  </button>
  <button type="button" id="manualAurora-G" class="uwu-button-round">
    <img src="https://raw.githubusercontent.com/Ibirtem/CatWar/main/images/icons8-nothern-lights-96_green.png"
      alt="Иконка" width="48" height="48">
  </button>
</div>

<h3>Светлячки</h3>
<div class="button-container-2">
  <button type="button" id="manualFirefly-On" class="uwu-button-round">
    <img src="https://raw.githubusercontent.com/Ibirtem/CatWar/main/images/firefly.png" alt="Иконка" width="48"
      height="48" title="Включает/Выключает">
  </button>
</div>

</div>
<div id="aurora-settings-panel">
<p>Изменения, сделанные в этой панели, сохранятся!</p>
<h5>Здесь будет возможность переместить Северное Сияние в реальном времени, исключать локации из генерации погоды,
  либо запрещать
  определённой погоде существовать на выбранной локации. Но это всё пока что лишь мечта...</h5>
</div>
`;
// ====================================================================================================================
//   . . . ГЛАВНЫЙ CSS СТИЛЬ . . .
// ====================================================================================================================
const css_uwu_main = `
:root {
  --uwu-bg-panel: rgba(255, 255, 255, 0.03);
  --uwu-border: rgba(255, 255, 255, 0.1);
  --uwu-hover-light: rgba(255, 255, 255, 0.15);
  --uwu-hover-strong: rgba(255, 255, 255, 0.2);
  --uwu-border-active: rgba(255, 255, 255, 0.3);
  --uwu-hover-max: rgba(255, 255, 255, 0.4);

  --uwu-glass-blur: blur(16px);

  --uwu-btn-install: #78c8ff87;
  --uwu-btn-remove: #ff787887;
  --uwu-tab-active: #abf6ffb0;
  --uwu-table-border: #383838;

  --uwu-gray-bg-05: rgba(0, 0, 0, 0.15);
  --uwu-gray-bg-10: rgba(127, 127, 127, 0.1);
  --uwu-gray-bg-15: rgba(127, 127, 127, 0.15);
  --uwu-gray-bg-20: rgba(127, 127, 127, 0.2);
  --uwu-gray-bg-25: rgba(127, 127, 127, 0.25);
  --uwu-gray-border: rgba(127, 127, 127, 0.2);
  --uwu-gray-border-hover: rgba(127, 127, 127, 0.3);
}

#uwusettings {
  font-family: "Montserrat", sans-serif;
  margin: 0 auto;
  border-radius: 20px;
  border: none;
  background: transparent;
  color: var(--ui-text, #dddddd);
}

/* ===================== CARDS ===================== */
.uwu-settings-card {
  background: var(--ui-fill, rgba(255, 255, 255, 0.03));
  border: 1px solid var(--ui-line, rgba(255, 255, 255, 0.1));
  border-radius: var(--settings-radius, 14px);
  padding: 16px 18px;
  margin-bottom: 14px;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  flex-direction: column;
  gap: 14px;
  box-sizing: border-box;
}

.uwu-settings-card__title {
  margin: 0 0 2px 0;
  font-size: 24px;
  font-weight: 650;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  opacity: 0.85;
  color: var(--ui-text, #ffffff);
}

.uwu-settings-card__item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.uwu-settings-card__item p {
  margin: 0;
  font-size: 13px;
  line-height: 1.4;
  opacity: 0.72;
}

.uwu-settings-card__row {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* ===================== TOGGLE SWITCHES ===================== */
#uwusettings input[type="checkbox"] {
  margin-right: 8px;
  appearance: none;
  -webkit-appearance: none;
  width: 36px;
  height: 20px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  cursor: pointer;
  position: relative;
  transition: background-color 0.2s ease-in-out, border-color 0.2s ease-in-out;
  flex-shrink: 0;
  vertical-align: middle;
  background-color: rgba(255, 255, 255, 0.1);
}

#uwusettings input[type="checkbox"]:checked {
  background-color: var(--ui-accent, #90ff78a8);
  border-color: var(--ui-accent, #90ff78a8);
}

#uwusettings input[type="checkbox"]::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 3px;
  transform: translateY(-50%);
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background-color: #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  transition: left 0.2s ease-in-out;
}

#uwusettings input[type="checkbox"]:checked::before {
  left: calc(100% - 17px);
}

.main-settings-container {
  padding: 10px 15px 10px 15px;
}

#news-panel {
  padding: 5px 15px 15px 15px;
}

#uwu-what-this {
  color: #83e5ff;
  font: caption;
}

.main-settings-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

#uwusettings h1,
#uwusettings h2 {
  font-family: "Montserrat", sans-serif;
  margin-top: 10px;
  margin-bottom: 15px;
  text-align: center;
}

#uwusettings h4 {
  margin-top: 5px;
  margin-left: 5px;
  margin-bottom: 5px;
}

#uwusettings p {
  margin-bottom: 0px;
}

#uwusettings label {
  font-size: 16px;
}

#uwusettings ul {
  font-family: "Montserrat", sans-serif;
  list-style-type: "+ ";
}

.uwu-hr-head {
  border: var(--uwu-border) solid;
  border-radius: 0px;
}

.uwu-hr {
  width: -webkit-fill-available;
  border: var(--uwu-border) solid;
  border-radius: 15px;
}

#uwusettings .parameters-color-table {
  width: 100%;
  max-width: 360px;
  border-collapse: collapse;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  margin: 10px 0;
  box-sizing: border-box;
}

#uwusettings .parameters-color-table thead tr:first-child th {
  background: rgba(255, 255, 255, 0.06);
  color: #ffffff;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 8px 6px;
  border: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  vertical-align: middle;
  text-align: center;
}

#uwusettings .parameters-color-table thead .parameters-color-table--name-th {
  text-align: left;
  padding-left: 12px;
}

#uwusettings .parameters-color-table thead .parameters-color-table--group-th,
#uwusettings .parameters-color-table thead .parameters-color-table--divider-th {
  border-right: 1px solid rgba(255, 255, 255, 0.08);
}

#uwusettings .parameters-color-table--sub-header {
  background: rgba(255, 255, 255, 0.03);
  color: rgba(255, 255, 255, 0.6);
  font-size: 11px;
  font-weight: 500;
  padding: 4px;
  border: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  text-align: center;
}

#uwusettings .parameters-color-table--group {
  padding: 10px 12px 6px;
  text-align: left;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #83e5ff;
  background: rgba(0, 0, 0, 0.25);
  border: none;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}

#uwusettings .parameters-color-table tbody tr {
  border: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  transition: background 0.15s ease;
}

#uwusettings .parameters-color-table tbody tr:hover {
  background: rgba(255, 255, 255, 0.04);
}

#uwusettings .parameters-color-table tbody tr:last-child {
  border-bottom: none;
}

#uwusettings .parameters-color-table td {
  padding: 6px 4px;
  vertical-align: middle;
  border: none !important;
  text-align: center;
}

#uwusettings .parameters-color-table .parameters-color-table--name {
  text-align: left;
  padding-left: 12px !important;
  font-size: 13px;
  font-weight: 500;
  color: #e0e0e0;
  white-space: nowrap;
}

#uwusettings .parameters-color-table td:nth-child(3) {
  border-right: 1px solid rgba(255, 255, 255, 0.08) !important;
}

#uwusettings .parameters-color-table td .gcp-field-swatch {
  width: 26px;
  height: 26px;
  border-radius: 6px;
  margin: 0 auto;
}

/* ===================== SHARED GLASS TABLES STYLING ===================== */
#uwusettings .gcp-table {
  width: 100%;
  max-width: 440px;
  border-collapse: collapse;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  margin: 10px 0;
  box-sizing: border-box;
}

#uwusettings .gcp-table thead th {
  background: rgba(255, 255, 255, 0.06);
  color: #ffffff;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 8px 6px;
  border: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  text-align: center;
}

#uwusettings .gcp-table tbody tr {
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  transition: background 0.15s ease;
}

#uwusettings .gcp-table tbody tr:hover {
  background: rgba(255, 255, 255, 0.04);
}

#uwusettings .gcp-table tbody tr:last-child {
  border-bottom: none;
}

#uwusettings .gcp-table td {
  padding: 6px 8px;
  vertical-align: middle;
  border: none !important;
  text-align: center;
}

#uwusettings .gcp-table td:first-child {
  text-align: left;
  padding-left: 14px;
  font-size: 13px;
  font-weight: 500;
  color: #e0e0e0;
}

#uwusettings .gcp-table td .gcp-field-swatch {
  width: 26px;
  height: 26px;
  border-radius: 6px;
  margin: 0 auto;
}

#colorSettingsTable,
#colorSettingsTable tr,
#colorSettingsTable td {
  border: 1px var(--uwu-table-border) solid;
}

.uwu-table-highlight-Resources,
#uwu-table-templates {
  margin-top: 5px;
}

.uwu-table-highlight-Resources th,
.uwu-table-highlight-Resources td,
#uwu-table-templates th,
#uwu-table-templates td {
  border: 1px solid var(--uwu-table-border);
}

.uwu-color-picker {
  border: none;
  vertical-align: middle;
}

.uwu-checkbox-cell {
  text-align: center;
  vertical-align: middle;
}

#uwusettings .parameters-color-table,
#colorSettingsTable {
  margin-top: 8px;
}

.header-rounded-image {
  background-repeat: repeat;
  background-attachment: fixed;
  border-radius: 20px 20px 0px 0px;
}

.main-rounded-image {
  background-repeat: repeat;
  background-attachment: fixed;
  border-radius: 20px;
}

#button-container-1 {
  display: flex;
  justify-content: space-evenly;
  width: 100%;
}

#button-container button {
  background-color: transparent;
  border: none;

  color: #ffffff57;

  padding: 10px 20px;
  cursor: pointer;
  transition: box-shadow 0.4s ease;
}

#button-container button.active {
  box-shadow: inset 0 -2px 0 0 rgba(255, 255, 255, 0.3);
  transition: box-shadow 0.4s ease;
}

#button-container button.active h2 {
  color: #ffffff;
  transition: color 0.4s ease;
}

#modules-panel {
  display: none;
}

.module-container {
  width: 300px;
  min-height: 150px;
  position: relative;

  box-sizing: border-box;
  margin: 10px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 15px;
  border: 1px solid var(--uwu-border);
  border-radius: 10px;
  background-color: var(--uwu-bg-panel);
}

.module-info {
  flex-grow: 1;
  margin-bottom: 10px;
}

.module-panel {
  display: flex;
  justify-content: space-between;
  align-items: center;

  position: absolute;
  bottom: 10px;
  left: 10px;
  right: 10px;
}

#module-info {
  flex-grow: 1;
  margin-bottom: 10px;

  display: flex;
  flex-wrap: wrap;
  flex-basis: 100%;
}

.module-container label {
  margin-top: 10px;
}

#private-module-input {
  margin: 10px;
}

.module-container button {
  border: 1px solid var(--uwu-border);
  padding: 5px 10px;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin: 5px;
}

.install-button {
  background-color: var(--uwu-btn-install) !important;
}

.remove-button {
  background-color: var(--uwu-btn-remove) !important;
}

#module-info input[type="checkbox"] {
  margin: 10px;
}

#color-picker {
  display: flex;
  flex-wrap: wrap;
}

#color-picker-input {
  flex: 30%;
}

#auroraPanel {
  width: 120px;
}

#weatherZIndexPanel {
  width: 320px;
}

.notification-table {
  border-collapse: collapse;
}

.notification-table td {
  padding: 5px;
  vertical-align: middle;
}

#notification-volume,
#step-slider {
  width: 150px;
}

details {
  margin-top: 5px;
}

#layout-preview button {
  border: 1px solid var(--uwu-border);
  padding: 5px 10px;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin: 5px;
}

#layout-customizer #layout-preview {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

#layout-customizer .column {
  width: 200px;
  border: 1px solid var(--uwu-border);
  border-radius: 10px;
  padding: 5px;
  margin: 0 5px;
}

#layout-customizer .block {
  border-radius: 10px;
  background-color: var(--uwu-bg-panel);
  padding: 5px;
  margin-bottom: 5px;
}

#layout-customizer .center-block {
  height: 100%;
  box-sizing: border-box;

  border-radius: 10px;
  background-color: var(--uwu-bg-panel);
}

#uwu-buttonRow1-settings,
#uwu-buttonRow2-settings {
  display: flex;
  margin-top: 3px;
}

#uwu-buttonRow1-settings button,
#uwu-buttonRow2-settings button {
  border: 1px solid var(--uwu-border);
  padding: 2px 10px;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin: 3px;
  margin-left: 0px;
}

#uwu-buttonRow1-settings > div > button.tab-button.active,
#uwu-buttonRow2-settings > div > button.table-button.active {
  background-color: var(--uwu-tab-active);
}

#uwu-buttonRow1-settings > .tab-container,
#uwu-buttonRow2-settings > .table-container {
  border-radius: 15px;
  background-color: rgba(84, 84, 84, 0.45);
  margin-right: 5px;
  padding-left: 4px;
  padding-right: 2px;
  padding-top: 2px;
  border-bottom-width: 2px;
  padding-bottom: 2px;
}

#uwu-global-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
}

#uwu-main-container {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
  pointer-events: none;
}

.weatherCanvas {
  pointer-events: none;
  position: fixed;
}

#extended-settings-button {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  backdrop-filter: var(--uwu-glass-blur);
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: auto;
  cursor: pointer;

  background-color: var(--uwu-border);
  border: 1px solid var(--uwu-border);
  font-size: 2em;
  font-weight: bold;
  color: #ff00ff;
}

#extended-settings-container {
  z-index: 10;
  font-family: "Montserrat", sans-serif;
  color: white;
  font-size: 15px;
  text-align: center;

  position: fixed;
  bottom: 100px;
  right: 30px;
  width: 400px;
  height: 400px;
  backdrop-filter: var(--uwu-glass-blur);
  border-radius: 10px;
  display: none;
  pointer-events: auto;

  background-color: var(--uwu-bg-panel);
  border: 1px solid var(--uwu-border);

  display: grid;
  place-items: center;
  padding: 15px;
  box-sizing: border-box;
  overflow-y: auto;
}

.extended-settings-block {
  border-radius: 10px;
  background-color: var(--uwu-bg-panel);
  border: 1px solid var(--uwu-border);
  padding: 5px;
  margin-bottom: 8px;
}

#news {
  margin-top: 20px;
}

#manual-weather-panel,
#news,
#news-button {
  width: 100%;
  border-radius: 10px;

  background-color: var(--uwu-bg-panel);
  border: 1px solid var(--uwu-border);

  padding: 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  box-sizing: border-box;
}

#color-picker {
  background-color: var(--uwu-bg-panel);
  border: 1px solid var(--uwu-border);

  margin-top: 10px;
  padding: 15px;
  border-radius: 10px;
}

#news-button,
#news-list {
  font-family: "Montserrat", sans-serif;
  font-size: 15px;
  cursor: pointer;
}

#news-list h3 {
  margin-left: 40px;
}

#news-list p {
  margin-top: 3px;
  margin-bottom: 3px;
  margin-left: 20px;
}

#aurora-settings-panel {
  width: 100%;
  border-radius: 10px;

  background-color: var(--uwu-bg-panel);
  border: 1px solid var(--uwu-border);

  padding: 15px;
  margin-top: 20px;
  box-sizing: border-box;
}

#WeatherStep,
#auroraStep,
#volumeStep,
#ThicknessStep,
.uwu-range-step,
#weatherZIndexStep {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  width: 100%;
}

#extended-settings-container::-webkit-scrollbar {
  width: 10px;
}

#extended-settings-container::-webkit-scrollbar-track {
  background: var(--uwu-border);
  border-radius: 4px;
}

#extended-settings-container::-webkit-scrollbar-thumb {
  background: var(--uwu-border-active);
  border-radius: 4px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  backdrop-filter: var(--uwu-glass-blur);
  -webkit-backdrop-filter: var(--uwu-glass-blur);
  border: 1px solid var(--uwu-border);
  cursor: pointer;
}

#extended-settings-container::-webkit-scrollbar-thumb:hover {
  background: var(--uwu-hover-max);
}

#button-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  width: 100%;
}

.button-container-1 {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.button-container-2 {
  display: flex;
  justify-content: space-evenly;
  width: 100%;
}

.uwu-button-round {
  width: 60px;
  height: 60px;
  cursor: pointer;
  border-radius: 50%;

  background-color: var(--uwu-border);
  border: 1px solid var(--uwu-border);
}

#extended-settings-button:hover,
.uwu-button-round:hover {
  background-color: var(--uwu-hover-light);
}

@property --gradient-angle {
  syntax: "<angle>";
  initial-value: 0deg;
  inherits: false;
}

@keyframes aurora-spin {
  0% {
    --gradient-angle: 0deg;
  }

  100% {
    --gradient-angle: 360deg;
  }
}

@keyframes auroraFadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes auroraFadeOut {
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
}

.firefly {
  position: fixed;
  background-color: rgba(255, 255, 153, 1);
  border-radius: 50%;
  filter: blur(5px);
  pointer-events: none;
  animation: fadeIn 6s ease-in-out;
}

.firefly-glow {
  position: fixed;
  background-color: rgba(255, 255, 153, 0.2);
  border-radius: 50%;
  filter: blur(40px);
  pointer-events: none;
  animation: fadeIn 6s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
}

.firefly-disappearing {
  animation: fadeOut 6s ease-in-out forwards;
}

.custom-select {
  position: relative;
  display: inline-block;
}

.select-selected,
.uwu-select-selected {
  margin-top: 10px;
  width: fit-content;
  border-radius: 10px;
  color: white;
  background-color: #5c5c5c;
  -webkit-backdrop-filter: var(--uwu-glass-blur);
  backdrop-filter: var(--uwu-glass-blur);
  padding: 10px;
  cursor: pointer;
}

.uwu-select-selected {
  width: fit-content;
}

.select-items,
uwu-select-items {
  margin-top: 5px;
  display: none;
  position: absolute;
  border-radius: 10px;
  width: max-content;
  color: white;
  background-color: #5c5c5c;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  -webkit-backdrop-filter: var(--uwu-glass-blur);
  backdrop-filter: var(--uwu-glass-blur);
  z-index: 1;
}

.select-items div {
  padding: 8px 16px;
  cursor: pointer;
}

.select-items div:hover {
  background-color: #757575;
}

.custom-select.active .select-items {
  display: block;
}

#climbingRefreshNotificationSoundContainer button,
#myNameNotificationSoundContainer button {
  border: 1px solid var(--uwu-border);
  padding: 2px 10px;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin: 3px;
  margin-left: 0px;
}

#climbingRefreshNotificationSoundContainer,
#myNameNotificationSoundContainer,
#notificationBlockSoundContainer {
  gap: 5px;
  display: flex;
  align-items: center;
}

.update-notification {
  background-color: rgba(120, 200, 255, 0.41);
  padding: 10px;
  border-radius: 10px;
  margin-bottom: 10px;
}

.new-update::before {
  content: "•";
  color: #78c8ff;
  font-size: 2em;
  position: absolute;
  top: -20px;
  right: -5px;
}

.random-phrase-block {
  margin-bottom: 10px;
  width: 100%;
  border-radius: 10px;

  background-color: var(--uwu-bg-panel);
  border: 1px solid var(--uwu-border);

  box-sizing: border-box;
  padding: 5px;
}

.costume-flex-box {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
  gap: 3rem;
}

.costume-flex-box.disabled {
  opacity: 0.5;
  pointer-events: none;
  cursor: not-allowed;
}

.costume-flex-box div {
  flex: 0;
}

#cat-image {
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-items: flex-end;
  font-weight: bold;
  gap: 0.5rem;
}

#cat-image-container {
  box-shadow: 0px 0px 7px 0px white;
}

#costume-gallery {
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: flex-start;
}

#costume-gallery > div {
  flex: 1;
}

.costume-gallery-box {
  background-color: var(--uwu-bg-panel);
  border: 1px solid var(--uwu-border);
  border-radius: 1rem;
  flex: 0 1 250px;
  max-width: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  box-sizing: border-box;
  position: relative;
}

.costume-slot-delete-button {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
  padding: 4px 8px !important;
  line-height: 1;
  background-color: transparent !important;
}

.save-costume-button {
  margin-top: 10px;
}

.costume-flex-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: flex-start;
  margin-top: 1rem;
}

.costume-flex-item {
  flex: 0 1 calc(33.333% - 1rem);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1rem;
  max-width: 180px;
}

.costume-style {
  width: 100px;
  height: 150px;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-bottom: 0.5rem;
}

.costume-slot {
  width: 100px;
  height: 150px;
  background-position: center;
  background-repeat: no-repeat;
}

.costume-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  align-items: stretch;
}

.uwu-slot-select {
  padding: 8px;
  border: 1px solid var(--uwu-border);
  border-radius: 10px;
  background-color: var(--uwu-bg-panel);
  font-family: "Montserrat", sans-serif;
  font-size: 14px;
  color: black;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

#show-costumes:disabled {
  opacity: 0.5;
  pointer-events: none;
  cursor: not-allowed;
}

.uwu-header-card {
  padding: 16px 20px 14px;
  margin-bottom: 16px;
  gap: 0;
}

.uwu-header-card .main-settings-container {
  padding: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.uwu-header-card .main-settings-container h1 {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.uwu-header-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  width: 100%;
}

.uwu-header-pills button {
  background: transparent;
  border: 1px solid transparent;
  border-radius: 10px;
  padding: 8px 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: rgba(255, 255, 255, 0.6);
}

.uwu-header-pills button h2 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  color: inherit;
}

.uwu-header-pills button:hover {
  background: rgba(255, 255, 255, 0.07);
  color: #ffffff;
}

.uwu-header-pills button.active {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.2);
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.uwu-details-card {
  border: 1px solid var(--ui-line, rgba(255, 255, 255, 0.1));
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.15);
  padding: 8px 12px;
}

#uwusettings input[type="text"] {
  background: rgba(0, 0, 0, 0.25) !important;
  border: 1px solid var(--ui-line, rgba(255, 255, 255, 0.15)) !important;
  color: var(--ui-text, #ffffff) !important;
  border-radius: 8px;
  padding: 6px 10px;
  font-family: inherit;
  font-size: 13px;
  box-sizing: border-box;
}

#uwusettings input[type="text"]:focus {
  border-color: var(--ui-accent, #83e5ff) !important;
  outline: none;
}

#uwusettings .uwu-select-selected {
  background-color: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--ui-line, rgba(255, 255, 255, 0.15));
  border-radius: 8px;
  padding: 6px 10px;
  color: var(--ui-text, #ffffff);
}

#uwusettings-header-glass {
  background: var(--ui-fill, rgba(255, 255, 255, 0.03));
  border: 1px solid var(--ui-line, rgba(255, 255, 255, 0.1));
  border-radius: var(--settings-radius, 14px);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  padding: 12px 16px;
  margin-bottom: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
}

.uwu-textarea-field {
  width: 100%;
  box-sizing: border-box;
  background: rgba(0, 0, 0, 0.25) !important;
  border: 1px solid var(--ui-line, rgba(255, 255, 255, 0.15)) !important;
  color: var(--ui-text, #ffffff) !important;
  border-radius: 8px;
  padding: 8px 10px;
  font-family: inherit;
  font-size: 13px;
  resize: vertical;
  outline: none;
}

.uwu-textarea-field:focus {
  border-color: var(--ui-accent, #83e5ff) !important;
}

#uwusettings .notification-table {
  width: 100%;
  max-width: 100%;
}

#uwusettings .notification-table td {
  padding: 8px 10px;
  vertical-align: middle;
}

.uwu-modules-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
  width: 100%;
  box-sizing: border-box;
}

.uwu-custom-sounds-box {
  background: rgba(0, 0, 0, 0.15);
  border: 1px solid var(--ui-line, rgba(255, 255, 255, 0.1));
  border-radius: 10px;
  padding: 12px;
  box-sizing: border-box;
  margin-top: 6px;
}

.uwu-warning-note {
  margin: 6px 0 10px 0;
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid rgba(255, 193, 7, 0.3);
  background: rgba(255, 193, 7, 0.08);
  color: var(--ui-text, #ffffff);
  font-size: 12px;
  line-height: 1.45;
}

.uwu-file-input {
  width: 100%;
  box-sizing: border-box;
  background: rgba(0, 0, 0, 0.25) !important;
  border: 1px solid var(--ui-line, rgba(255, 255, 255, 0.15)) !important;
  color: var(--ui-text, #ffffff) !important;
  border-radius: 8px;
  padding: 8px 10px;
  cursor: pointer;
  margin-top: 6px;
  font-family: inherit;
  font-size: 13px;
}

.uwu-file-input::file-selector-button {
  background: var(--ui-fill, rgba(255, 255, 255, 0.1));
  border: 1px solid var(--ui-line, rgba(255, 255, 255, 0.2));
  border-radius: 6px;
  color: inherit;
  padding: 4px 10px;
  cursor: pointer;
  margin-right: 10px;
  transition: background-color 0.2s ease;
}

.uwu-file-input::file-selector-button:hover {
  background: rgba(255, 255, 255, 0.2);
}

.costume-gallery-box {
  background: rgba(0, 0, 0, 0.2) !important;
  border: 1px solid var(--ui-line, rgba(255, 255, 255, 0.1)) !important;
  border-radius: 12px !important;
  transition: border-color 0.2s ease, transform 0.2s ease;
}

.costume-gallery-box:hover {
  border-color: rgba(255, 255, 255, 0.3) !important;
}

.uwu-version-badge {
  background: var(--ui-fill, rgba(255, 255, 255, 0.08));
  border: 1px solid var(--ui-line, rgba(255, 255, 255, 0.15));
  border-radius: 999px;
  color: var(--ui-text, #ffffff);
  padding: 6px 14px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  margin-right: 14px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  display: inline-flex;
  align-items: center;
  gap: 6px;
  backdrop-filter: blur(8px);
}

.uwu-version-badge:hover {
  background: rgba(255, 255, 255, 0.18);
  border-color: rgba(255, 255, 255, 0.35);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.uwu-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 100000;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;
  animation: uwuFadeIn 0.2s ease;
}

.uwu-modal-card {
  background: rgba(26, 26, 26, 0.95);
  border: 1px solid var(--ui-line, rgba(255, 255, 255, 0.15));
  border-radius: 16px;
  width: 100%;
  max-width: 580px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
  color: var(--ui-text, #ffffff);
  font-family: "Montserrat", sans-serif;
  overflow: hidden;
  box-sizing: border-box;
}

.uwu-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px 10px;
}

.uwu-modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #83e5ff;
}

.uwu-modal-close {
  background: transparent;
  border: none;
  font-size: 16px;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.6);
  padding: 4px 8px;
  border-radius: 8px;
  transition: all 0.15s ease;
}

.uwu-modal-close:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.uwu-modal-body {
  padding: 0 20px 20px;
  overflow-y: auto;
  font-size: 13px;
  line-height: 1.55;
}

.uwu-modal-body h4 {
  margin: 12px 0 6px;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #ffffff;
  opacity: 0.9;
}

.uwu-modal-body p {
  margin: 4px 0;
  opacity: 0.8;
}

.uwu-modal-date {
  margin-top: 14px !important;
  font-size: 11px;
  opacity: 0.5 !important;
  text-align: right;
}

@keyframes uwuFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.uwu-header-card {
  position: relative !important;
  overflow: hidden !important;
}

.uwu-header-card > * {
  position: relative;
  z-index: 1;
}

.uwu-header-weather-layer {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
  border-radius: inherit;
}

.uwu-header-weather-layer canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: block;
}

.uwu-header-weather-layer .firefly {
  position: absolute !important;
}

.uwu-header-weather-layer .firefly-glow {
  position: absolute !important;
  filter: blur(16px) !important;
}
`;

document.head.insertAdjacentHTML(
  "beforeend",
  `<style id="css-uwu-main">${css_uwu_main}</style>`
);

// ====================================================================================================================
//   . . . топовой шрифт кто не согласен тому в глаз 👅👅👅👅👅👅бе бе бе мяу мяу мяу мяу мяу мяу . . .
// ====================================================================================================================
var link = document.createElement("link");
link.rel = "stylesheet";
link.href = "https://fonts.googleapis.com/css?family=Montserrat";
document.head.appendChild(link);
// TODO - автоматически подкачивать шрифты нужные пользователю по названию в "Название вида шрифта" в Настройках
// ====================================================================================================================
//  . . . СОХРАНЕНИЯ И ЗАГРУЗКА НАСТРОЕК . . .
// ====================================================================================================================
let settings = { ...uwuDefaultSettings };
loadSettings();

function saveSettings() {
  try {
    uwuStorage.setItem("uwu_settings", settings);
  } catch (error) {
    console.error("Не удалось сохранить настройки:", error);
  }
}

function loadSettings() {
  const storedSettings = uwuStorage.getItem("uwu_settings");
  if (storedSettings) {
    try {
      if (typeof storedSettings === "object" && storedSettings !== null) {
        settings = { ...uwuDefaultSettings, ...storedSettings };
      } else {
        throw new Error("Сохраненные настройки не являются объектом.");
      }
    } catch (error) {
      console.error(
        "Ошибка обработки uwu_settings, будут применены настройки по умолчанию.",
        error
      );
      settings = { ...uwuDefaultSettings };
    }
  } else {
    settings = { ...uwuDefaultSettings };
  }
}
// ====================================================================================================================
//   . . . ДИНАМИЧНЫЕ ОБОЗРЕВАТЕЛИ . . .
// ====================================================================================================================
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// Когда нужно вставить прослушку на какой-то элемент, который ещё не успел появиться.
async function setupMutationObserver(
  selector,
  callback,
  options = { attributes: true, attributeFilter: ["style"] },
  maxAttempts = 8,
  delay = 500,
  debounceTime = 100
) {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const element = document.querySelector(selector);
    if (element) {
      const observer = new MutationObserver(debounce(callback, debounceTime));
      observer.observe(element, options);
      // console.log(`Наблюдатель установлен для элемента с селектором "${selector}".`);
      callback();
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
  // console.warn(
  //   `Элемент с селектором "${selector}" не найден после ${maxAttempts} попыток.`
  // );
}

// Когда нужно вставить что-то в какой-то элемент, который ещё не успел появиться.
async function setupSingleCallback(
  selector,
  callback,
  maxAttempts = 8,
  delay = 500
) {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const element = document.querySelector(selector);
    if (element) {
      callback();
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
  // console.warn(
  //   `Элемент с селектором "${selector}" не найден после ${maxAttempts} попыток.`
  // );
}

// ====================================================================================================================
//   . . . VUE  . . .
// ====================================================================================================================

/**
 * Extracts data from the Vue reactive state using a string path.
 * @param {string} path - The dot-separated path to the property (e.g., 'parameter.data').
 * @returns {any|null} The resolved data, or null if the path is invalid or Vue is unavailable.
 */
function getVueData(path) {
  const app = document.getElementById('app');
  if (!app || !app.__vue__) return null;
  return path.split('.').reduce((acc, part) => acc && acc[part], app.__vue__);
}

/**
 * Subscribes to changes in the Vue reactive state with retry logic for initialization.
 * @param {string} path - The dot-separated path to watch (e.g., 'chat.messages').
 * @param {function(any, any): void} callback - The function invoked on data change (newValue, oldValue).
 * @param {Object} [options={ deep: true }] - Vue $watch options (e.g., { deep: true, immediate: true }).
 */
function watchVueData(path, callback, options = { deep: true }) {
    let attempts = 0;
    const tryAttachWatcher = () => {
      const app = document.getElementById("app")?.__vue__;
      if (!app) {
        if (attempts++ < 40) {
          setTimeout(tryAttachWatcher, 250);
        }
        return;
      }
      app.$watch(path, callback, options);
    };

    tryAttachWatcher();
  }

// ====================================================================================================================
//   . . . VUE  . . .
// ====================================================================================================================

/**
 * Изменяет размер изображения до соотношения сторон 2:3.
 * @param {string} dataUrl - Изображение в формате Data URL.
 * @param {number} aspectRatio - Целевое соотношение сторон (ширина / высота).
 * @returns {Promise<string>} - Новый Data URL изображения с измененным размером.
 */
async function resizeImageToAspectRatio(dataUrl, aspectRatio = 2 / 3) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.height = img.height;
        canvas.width = img.height * aspectRatio;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const resizedDataUrl = canvas.toDataURL("image/png");
        resolve(resizedDataUrl);
      } catch (error) {
        reject(error);
      }
    };
    img.onerror = () => {
      reject(
        new Error("Не удалось загрузить изображение для изменения размера.")
      );
    };
    img.src = dataUrl;
  });
}

// ====================================================================================================================
//   . . . COLORPICKER . . .
// ====================================================================================================================

/**
 * Injects self-contained glassmorphism styles for the GlassColorPicker component.
 */
function ensureGcpStyles() {
  if (document.getElementById("gcp-styles")) return;

  const style = document.createElement("style");
  style.id = "gcp-styles";
  style.textContent = `
    /* Popover Window */
    .gcp-popover {
      position: fixed;
      z-index: 10000;
      width: 220px;
      padding: 12px;
      border-radius: 16px;
      background: #ffffff1a;
      backdrop-filter: blur(20px) saturate(160%);
      -webkit-backdrop-filter: blur(20px) saturate(160%);
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 12px 36px rgba(0, 0, 0, 0.4);
      color: #ffffff;
      font-family: inherit;
      user-select: none;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .gcp-sv {
      position: relative;
      width: 100%;
      aspect-ratio: 1 / 1;
      border-radius: 10px;
      cursor: crosshair;
      border: none !important;
      outline: none;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
      overflow: hidden;
    }
    .gcp-sv-handle {
      position: absolute;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: 2px solid #ffffff;
      box-shadow: 0 0 3px rgba(0, 0, 0, 0.8);
      transform: translate(-50%, -50%);
      pointer-events: none;
    }

    .gcp-sliders {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .gcp-slider-track {
      position: relative;
      width: 100%;
      height: 12px;
      display: flex;
      align-items: center;
    }
    .gcp-track-bg {
      position: absolute;
      inset: 0;
      height: 12px;
      border-radius: 6px;
      overflow: hidden;
      box-sizing: border-box;
    }
    .gcp-hue-bg {
      background: linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%);
    }
    .gcp-alpha-bg {
      background: repeating-conic-gradient(rgba(128, 128, 128, 0.4) 0% 25%, transparent 0% 50%) 50% / 6px 6px;
    }
    .gcp-alpha-fill {
      width: 100%;
      height: 100%;
    }

    .gcp-popover input[type="range"] {
      position: absolute;
      top: -4px;
      left: 0;
      width: 100%;
      height: 20px;
      min-height: 20px;
      opacity: 0;
      margin: 0;
      padding: 0;
      cursor: pointer;
      z-index: 3;
    }

    .gcp-slider-thumb {
      position: absolute;
      top: 50%;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: #ffffff;
      border: 2px solid rgba(0, 0, 0, 0.4);
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
      transform: translate(-50%, -50%);
      pointer-events: none;
      z-index: 2;
      box-sizing: border-box;
    }

    /* Footer Controls */
    .gcp-footer {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .gcp-preview-swatch,
    .gcp-field-swatch {
      border: none !important;
      border-radius: 8px;
      background: repeating-conic-gradient(rgba(128, 128, 128, 0.35) 0% 25%, transparent 0% 50%) 50% / 6px 6px;
      box-shadow: 1px 1px 5px 1px rgba(0, 0, 0, 0.35);
      overflow: hidden;
      flex-shrink: 0;
      transition: transform 0.15s ease;
    }
    .gcp-field-swatch:hover {
      transform: scale(1.08);
    }
    .gcp-preview-swatch {
      width: 30px;
      height: 30px;
    }
    .gcp-field-swatch {
      width: 32px;
      height: 32px;
      cursor: pointer;
    }
    .gcp-preview-color,
    .gcp-field-preview {
      width: 100%;
      height: 100%;
    }

    /* EyeDropper Tool Button */
    .gcp-eyedropper-btn {
      width: 30px;
      height: 30px;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.18);
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      flex-shrink: 0;
      transition: background 0.15s ease, transform 0.15s ease;
      padding: 0;
      margin: 0;
    }
    .gcp-eyedropper-btn:hover {
      background: rgba(255, 255, 255, 0.22);
      transform: scale(1.05);
    }

    .gcp-hex-wrap,
    .gcp-field-hex-wrap {
      display: flex;
      align-items: center;
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 8px;
      background: rgba(0, 0, 0, 0.25);
      box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.4);
      padding: 0 8px;
      height: 32px;
      box-sizing: border-box;
      flex: 1;
    }
    .gcp-hash,
    .gcp-field-hash {
      opacity: 0.5;
      font-weight: bold;
      font-size: 13px;
      margin-right: 4px;
      user-select: none;
    }

    .gcp-popover input.gcp-hex-input,
    .gcp-field-row input.gcp-field-hex {
      background: transparent !important;
      background-color: transparent !important;
      border: none !important;
      box-shadow: none !important;
      outline: none !important;
      color: #ffffff !important;
      padding: 0 !important;
      margin: 0 !important;
      min-height: 0 !important;
      height: auto !important;
      font-family: monospace !important;
      font-size: 14px !important;
      width: 100% !important;
      line-height: 1.2 !important;
    }

    /* History Swatches */
    .gcp-history {
      display: flex;
      gap: 6px;
      align-items: center;
      padding-top: 4px;
      border-top: 1px solid rgba(255, 255, 255, 0.12);
    }
    .gcp-history-item {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      border: none !important;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.45);
      cursor: pointer;
      background: repeating-conic-gradient(rgba(128, 128, 128, 0.4) 0% 25%, transparent 0% 50%) 50% / 4px 4px;
      overflow: hidden;
      flex-shrink: 0;
      transition: transform 0.15s ease;
    }
    .gcp-history-item:hover {
      transform: scale(1.2);
    }
    .gcp-history-item-color {
      width: 100%;
      height: 100%;
    }

    /* Settings Page Grid & Flat Form Rows */
    .gcp-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
      gap: 12px 18px;
      width: 100%;
      margin-top: 10px;
    }
    .gcp-field-row {
      display: flex;
      flex-direction: column;
      gap: 6px;
      padding: 0;
      border: none !important;
      background: transparent !important;
      box-sizing: border-box;
    }
    .gcp-field-header {
      font-size: 13px;
      font-weight: 500;
      opacity: 0.9;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .gcp-field-hint {
      color: #83e5ff;
      font-size: 11px;
      cursor: help;
    }
    .gcp-field-controls {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    /* Alignment helper for table cells */
    .parameters-color-table td .gcp-field-swatch {
      margin: 0 auto;
    }
  `;
  document.head.appendChild(style);
}

/**
 * Singleton Popover Window with 2D SV palette, Hue/Alpha tracks, and color history.
 */
class GlassColorPickerPopover {
  static instance = null;

  static getInstance() {
    if (!GlassColorPickerPopover.instance) {
      GlassColorPickerPopover.instance = new GlassColorPickerPopover();
    }
    return GlassColorPickerPopover.instance;
  }

  constructor() {
    ensureGcpStyles();
    this.activePicker = null;
    this.h = 0;
    this.s = 1;
    this.v = 1;
    this.a = 1;
    this.isDraggingSV = false;
    this.history = this.loadHistory();

    this.initDOM();
    this.bindEvents();
  }

  loadHistory() {
    try {
      const stored = localStorage.getItem("gcp_color_history");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  saveHistory(hex) {
    if (!hex || typeof hex !== "string") return;
    this.history = [hex, ...this.history.filter((c) => c !== hex)].slice(0, 8);
    try {
      localStorage.setItem("gcp_color_history", JSON.stringify(this.history));
    } catch {}
    this.renderHistory();
  }

  initDOM() {
    this.el = document.createElement("div");
    this.el.className = "gcp-popover";
    this.el.style.display = "none";

    const hasEyeDropper = typeof window.EyeDropper === "function";
    const eyeDropperBtnHTML = hasEyeDropper
      ? `<button type="button" class="gcp-eyedropper-btn" title="Пипетка (выбрать цвет с экрана)">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m14 7 3 3m-5-1L4 17v3h3l8-8m-2-5 3-3a2.12 2.12 0 1 1 3 3l-3 3"/>
          </svg>
        </button>`
      : "";

    this.el.innerHTML = `
      <div class="gcp-sv">
        <div class="gcp-sv-handle"></div>
      </div>
      <div class="gcp-sliders">
        <div class="gcp-slider-track">
          <div class="gcp-track-bg gcp-hue-bg"></div>
          <input type="range" class="gcp-hue-input" min="0" max="359" value="0">
          <div class="gcp-slider-thumb gcp-hue-thumb"></div>
        </div>
        <div class="gcp-slider-track">
          <div class="gcp-track-bg gcp-alpha-bg">
            <div class="gcp-alpha-fill"></div>
          </div>
          <input type="range" class="gcp-alpha-input" min="0" max="100" value="100">
          <div class="gcp-slider-thumb gcp-alpha-thumb"></div>
        </div>
      </div>
      <div class="gcp-footer">
        <div class="gcp-preview-swatch"><div class="gcp-preview-color"></div></div>
        <div class="gcp-hex-wrap">
          <span class="gcp-hash">#</span>
          <input type="text" class="gcp-hex-input" maxlength="8" spellcheck="false">
        </div>
        ${eyeDropperBtnHTML}
      </div>
      <div class="gcp-history"></div>
    `;

    document.body.appendChild(this.el);

    this.svArea = this.el.querySelector(".gcp-sv");
    this.svHandle = this.el.querySelector(".gcp-sv-handle");
    this.hueInput = this.el.querySelector(".gcp-hue-input");
    this.hueThumb = this.el.querySelector(".gcp-hue-thumb");
    this.alphaInput = this.el.querySelector(".gcp-alpha-input");
    this.alphaThumb = this.el.querySelector(".gcp-alpha-thumb");
    this.alphaFill = this.el.querySelector(".gcp-alpha-fill");
    this.previewColor = this.el.querySelector(".gcp-preview-color");
    this.hexInput = this.el.querySelector(".gcp-hex-input");
    this.historyContainer = this.el.querySelector(".gcp-history");

    this.hexInput.addEventListener("focus", (e) => e.target.select());

    const eyeDropperBtn = this.el.querySelector(".gcp-eyedropper-btn");
    if (eyeDropperBtn) {
      eyeDropperBtn.addEventListener("click", async () => {
        try {
          const eyeDropper = new window.EyeDropper();
          const result = await eyeDropper.open();
          if (result && result.sRGBHex) {
            this.syncFromHex(result.sRGBHex);
            this.notify();
          }
        } catch {}
      });
    }

    this.renderHistory();
  };

  renderHistory() {
    this.historyContainer.innerHTML = "";
    this.history.forEach((hex) => {
      const item = document.createElement("div");
      item.className = "gcp-history-item";
      item.title = hex;
      item.innerHTML = `<div class="gcp-history-item-color" style="background-color: ${hex}"></div>`;
      item.addEventListener("click", () => {
        if (!this.activePicker) return;
        this.activePicker.setValue(hex);
        this.syncFromHex(hex);
      });
      this.historyContainer.appendChild(item);
    });
  }

  bindEvents() {
    const updateSV = (e) => {
      const rect = this.svArea.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
      const y = Math.max(0, Math.min(rect.height, clientY - rect.top));

      this.s = x / rect.width;
      this.v = 1 - y / rect.height;

      this.updateVisuals();
      this.notify();
    };

    this.svArea.addEventListener("mousedown", (e) => {
      this.isDraggingSV = true;
      updateSV(e);
    });
    this.svArea.addEventListener("touchstart", (e) => {
      this.isDraggingSV = true;
      updateSV(e);
    }, { passive: false });

    window.addEventListener("mousemove", (e) => {
      if (this.isDraggingSV) updateSV(e);
    });
    window.addEventListener("touchmove", (e) => {
      if (this.isDraggingSV) updateSV(e);
    }, { passive: false });

    window.addEventListener("mouseup", () => (this.isDraggingSV = false));
    window.addEventListener("touchend", () => (this.isDraggingSV = false));

    this.hueInput.addEventListener("input", (e) => {
      this.h = parseInt(e.target.value, 10);
      this.updateVisuals();
      this.notify();
    });

    this.alphaInput.addEventListener("input", (e) => {
      this.a = parseInt(e.target.value, 10) / 100;
      this.updateVisuals();
      this.notify();
    });

    this.hexInput.addEventListener("input", () => {
      const raw = this.hexInput.value.trim().replace(/^#/, "");
      if (/^[0-9a-fA-F]{3,8}$/.test(raw)) {
        this.syncFromHex("#" + raw);
        this.notify();
      }
    });

    // Close on click outside or Escape
    document.addEventListener("pointerdown", (e) => {
      if (this.isOpen() && !this.el.contains(e.target) && !e.target.closest(".gcp-field-swatch")) {
        this.close();
      }
    });

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isOpen()) {
        this.close();
      }
    });
  }

  syncFromHex(hex) {
    const parsed = GlassColorPicker.parseToRgba(hex);
    const [h, s, v] = GlassColorPicker.rgbToHsv(parsed.r, parsed.g, parsed.b);
    this.h = h;
    this.s = s;
    this.v = v;
    this.a = parsed.a;
    this.updateVisuals();
  }

  updateVisuals() {
    const [r, g, b] = GlassColorPicker.hsvToRgb(this.h, this.s, this.v);
    const hex8 = GlassColorPicker.rgbaToHex(r, g, b, this.a);

    this.svArea.style.background = `linear-gradient(to top, #000000, transparent), linear-gradient(to right, #ffffff, hsl(${this.h}, 100%, 50%))`;
    this.svHandle.style.left = `${this.s * 100}%`;
    this.svHandle.style.top = `${(1 - this.v) * 100}%`;

    const hueRatio = this.h / 359;
    this.hueInput.value = this.h;
    this.hueThumb.style.left = `calc(${hueRatio * 100}% + ${(0.5 - hueRatio) * 16}px)`;

    const alphaPercent = Math.round(this.a * 100);
    const alphaRatio = this.a;
    this.alphaInput.value = alphaPercent;
    this.alphaThumb.style.left = `calc(${alphaRatio * 100}% + ${(0.5 - alphaRatio) * 16}px)`;
    this.alphaFill.style.background = `linear-gradient(to right, transparent, rgb(${r}, ${g}, ${b}))`;

    this.previewColor.style.backgroundColor = `rgba(${r}, ${g}, ${b}, ${this.a})`;
    this.hexInput.value = hex8.replace(/^#/, "");
  };

  notify() {
    if (!this.activePicker) return;
    const [r, g, b] = GlassColorPicker.hsvToRgb(this.h, this.s, this.v);
    const hex = GlassColorPicker.rgbaToHex(r, g, b, this.a);
    this.activePicker.applyFromPopover(hex);
  }

  open(trigger, picker) {
    this.activePicker = picker;
    const currentHex = picker.getValue() || "#161616";
    this.syncFromHex(currentHex);

    this.el.style.display = "flex";

    const rect = trigger.getBoundingClientRect();
    const popoverWidth = 215;
    let left = rect.left;
    let top = rect.bottom + 6;

    if (left + popoverWidth > window.innerWidth - 10) {
      left = window.innerWidth - popoverWidth - 10;
    }
    if (top + 230 > window.innerHeight) {
      top = rect.top - 235;
    }

    this.el.style.left = `${Math.max(10, left)}px`;
    this.el.style.top = `${Math.max(10, top)}px`;
  }

  close() {
    if (this.activePicker) {
      this.saveHistory(this.activePicker.getValue());
    }
    this.el.style.display = "none";
    this.activePicker = null;
  }

  isOpen() {
    return this.el.style.display !== "none";
  }
}

/**
 * Field-level Glass Color Picker Component.
 */
class GlassColorPicker {
  /**
   * @param {HTMLElement} container - DOM mount target.
   * @param {Object} options - Configuration options.
   * @param {string} [options.value=""] - Initial color value.
   * @param {string} [options.label=""] - Field label text.
   * @param {string} [options.hint=""] - Tooltip text.
   * @param {"field"|"swatch"} [options.mode="field"] - Layout mode ("field" with hex input or "swatch" for tables).
   * @param {Function} [options.onChange=null] - Change callback.
   */
  constructor(container, options = {}) {
    ensureGcpStyles();
    this.container = container;
    this.options = Object.assign({ value: "", label: "", hint: "", mode: "field", onChange: null }, options);
    this.value = this.options.value;

    this.initDOM();
    this.setValue(this.value, false);
    this.bindEvents();
  }

  static parseToRgba(val) {
    if (!val || typeof val !== "string" || !val.trim()) return { r: 0, g: 0, b: 0, a: 1, isEmpty: true };
    let str = val.trim().replace(/^#/, "");
    if (str.length === 3) str = str.split("").map((c) => c + c).join("") + "ff";
    else if (str.length === 4) str = str.slice(0, 3).split("").map((c) => c + c).join("") + str[3] + str[3];
    else if (str.length === 6) str += "ff";

    if (str.length !== 8 || !/^[0-9a-fA-F]{8}$/.test(str)) return { r: 0, g: 0, b: 0, a: 1, isEmpty: false };

    return {
      r: parseInt(str.slice(0, 2), 16),
      g: parseInt(str.slice(2, 4), 16),
      b: parseInt(str.slice(4, 6), 16),
      a: parseInt(str.slice(6, 8), 16) / 255,
      isEmpty: false,
    };
  }

  static rgbToHsv(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const d = max - min;
    let h = 0;
    const s = max === 0 ? 0 : d / max;
    const v = max;
    if (max !== min) {
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h *= 60;
    }
    return [Math.round(h), s, v];
  }

  static hsvToRgb(h, s, v) {
    const c = v * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = v - c;
    let r = 0, g = 0, b = 0;
    if (h >= 0 && h < 60) { r = c; g = x; b = 0; }
    else if (h >= 60 && h < 120) { r = x; g = c; b = 0; }
    else if (h >= 120 && h < 180) { r = 0; g = c; b = x; }
    else if (h >= 180 && h < 240) { r = 0; g = x; b = c; }
    else if (h >= 240 && h < 300) { r = x; g = 0; b = c; }
    else if (h >= 300 && h < 360) { r = c; g = 0; b = x; }
    return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
  }

  static rgbaToHex(r, g, b, a = 1) {
    const toHex = (n) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0");
    const hex6 = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    return a < 0.999 ? `${hex6}${toHex(a * 255)}` : hex6;
  }

  initDOM() {
    if (this.options.mode === "swatch") {
      this.root = document.createElement("div");
      this.root.className = "gcp-field-swatch";
      this.root.title = this.options.label || "Выбрать цвет";
      this.root.innerHTML = '<div class="gcp-field-preview"></div>';
      this.swatch = this.root;
      this.preview = this.root.querySelector(".gcp-field-preview");
      this.hexInput = null;
      this.container.appendChild(this.root);
      return;
    }

    this.root = document.createElement("div");
    this.root.className = "gcp-field-row";

    const titleAttr = this.options.hint ? `title="${this.options.hint}"` : "";
    const hintMark = this.options.hint ? ' <span class="gcp-field-hint">[?]</span>' : "";

    this.root.innerHTML = `
      <div class="gcp-field-header">
        <span class="gcp-field-label" ${titleAttr}>${this.options.label}${hintMark}</span>
      </div>
      <div class="gcp-field-controls">
        <div class="gcp-field-swatch" title="Открыть палитру">
          <div class="gcp-field-preview"></div>
        </div>
        <div class="gcp-field-hex-wrap">
          <span class="gcp-field-hash">#</span>
          <input type="text" class="gcp-field-hex" maxlength="8" spellcheck="false" placeholder="RRGGBBAA">
        </div>
      </div>
    `;

    this.swatch = this.root.querySelector(".gcp-field-swatch");
    this.preview = this.root.querySelector(".gcp-field-preview");
    this.hexInput = this.root.querySelector(".gcp-field-hex");

    this.container.appendChild(this.root);
  }

  bindEvents() {
    this.swatch.addEventListener("click", () => {
      GlassColorPickerPopover.getInstance().open(this.swatch, this);
    });

    if (this.hexInput) {
      this.hexInput.addEventListener("focus", (e) => e.target.select());
      this.hexInput.addEventListener("input", () => {
        const raw = this.hexInput.value.trim().replace(/^#/, "");
        if (!raw) {
          this.value = "";
          this.preview.style.backgroundColor = "transparent";
          this.triggerChange();
          return;
        }
        if (/^[0-9a-fA-F]{3,8}$/.test(raw)) {
          const parsed = GlassColorPicker.parseToRgba(raw);
          this.value = GlassColorPicker.rgbaToHex(parsed.r, parsed.g, parsed.b, parsed.a);
          this.preview.style.backgroundColor = this.value;
          this.triggerChange();
        }
      });
    }
  }

  applyFromPopover(hexValue) {
    this.value = hexValue;
    this.preview.style.backgroundColor = hexValue;
    if (this.hexInput) {
      this.hexInput.value = hexValue.replace(/^#/, "");
    }
    this.triggerChange();
  }

  triggerChange() {
    if (typeof this.options.onChange === "function") {
      this.options.onChange(this.value);
    }
  }

  getValue() {
    return this.value;
  }

  setValue(val, trigger = true) {
    this.value = val || "";
    if (!this.value) {
      this.preview.style.backgroundColor = "transparent";
      if (this.hexInput) this.hexInput.value = "";
    } else {
      const parsed = GlassColorPicker.parseToRgba(this.value);
      this.value = GlassColorPicker.rgbaToHex(parsed.r, parsed.g, parsed.b, parsed.a);
      this.preview.style.backgroundColor = this.value;
      if (this.hexInput) this.hexInput.value = this.value.replace(/^#/, "");
    }
    if (trigger) this.triggerChange();
  }
}

// ====================================================================================================================
//   . . . СОХРАНЕНИЕ И РАБОТА С ЦВЕТОВЫМИ ТЕМАМИ . . .
// ====================================================================================================================
function getThemes() {
  const storedThemes = uwuStorage.getItem("uwu_colorThemes");
  const userThemes = storedThemes || {};
  return { ...userThemes, ...defaultThemes };
}

function saveThemes(themes) {
  const themesToSave = Object.keys(themes)
    .filter((themeName) => !isDefaultTheme(themeName))
    .reduce((obj, key) => {
      obj[key] = themes[key];
      return obj;
    }, {});

  uwuStorage.setItem("uwu_colorThemes", themesToSave);
}

function getCurrentThemeName() {
  return uwuStorage.getItem("uwu_currentTheme") || "Тёмная Тема";
}

function setCurrentThemeName(themeName) {
  uwuStorage.setItem("uwu_currentTheme", themeName);
}

function isDefaultTheme(themeName) {
  return Object.keys(defaultThemes).includes(themeName);
}

function updateSaveButtonState() {
  const saveBtn = document.getElementById("saveThemeButton");
  if (saveBtn) {
    saveBtn.disabled = isDefaultTheme(getCurrentThemeName());
  }
}

// ====================================================================================================================
//  . . . ВНЕШНИЙ ВИД ПАНЕЛИ НАСТРОЕК . . .
// ====================================================================================================================
function applyBackgroundImage(element, backgroundImage) {
  element.style.backgroundImage = backgroundImage;
}

/**
 * Integrates the custom UwU settings panel into CatWar's native settings hub.
 *
 * @param {HTMLElement} settingsElement - The root container element (#uwu-settings) of UwU settings.
 * @returns {void}
 */
function setupNativeSettingsIntegration(settingsElement) {
  const nav = document.querySelector(".settings-nav");
  const body = document.querySelector(".settings-body");

  if (!nav || !body) {
    const fallbackContainer =
      document.querySelector("#branch") ||
      document.querySelector("#site_table");
    fallbackContainer?.appendChild(settingsElement);
    return;
  }

  const uwuNavBtn = document.createElement("button");
  uwuNavBtn.type = "button";
  uwuNavBtn.className = "settings-nav-item";
  uwuNavBtn.id = "uwu-settings-nav-item";
  uwuNavBtn.innerHTML = `
    <span aria-hidden="true" class="settings-nav-icon">
      <img src="https://raw.githubusercontent.com/Ibirtem/CatWar/main/images/partly_sunny_rain.png" alt="UwU" class="settings-nav-icon__svg" style="object-fit: contain;">
    </span>
    <span class="settings-nav-label">CatWar UwU</span>
  `;

  let isUwuActive = false;

  /**
   * Activates the UwU tab, highlights the nav button, and hides native Vue setting panels.
   */
  function activateUwuTab() {
    isUwuActive = true;
    nav
      .querySelectorAll(".settings-nav-item")
      .forEach((btn) => btn.classList.remove("active"));
    uwuNavBtn.classList.add("active");

    Array.from(body.children).forEach((child) => {
      if (child !== settingsElement) {
        child.style.display = "none";
      }
    });
    settingsElement.style.display = "block";
  }

  /**
   * Deactivates the UwU tab, restores native Vue panels, and un-highlights the nav button.
   */
  function deactivateUwuTab() {
    if (!isUwuActive) return;
    isUwuActive = false;
    uwuNavBtn.classList.remove("active");
    settingsElement.style.display = "none";

    Array.from(body.children).forEach((child) => {
      if (child !== settingsElement) {
        child.style.display = "";
      }
    });
  }

  uwuNavBtn.addEventListener("click", (e) => {
    e.preventDefault();
    activateUwuTab();
  });

  nav.addEventListener("click", (e) => {
    const nativeBtn = e.target.closest(".settings-nav-item");
    if (nativeBtn && nativeBtn !== uwuNavBtn) {
      deactivateUwuTab();
    }
  });

  settingsElement.style.display = "none";
  nav.appendChild(uwuNavBtn);
  body.appendChild(settingsElement);

  const navObserver = new MutationObserver(() => {
    if (!nav.contains(uwuNavBtn)) {
      nav.appendChild(uwuNavBtn);
    }
  });
  navObserver.observe(nav, { childList: true });

  const bodyObserver = new MutationObserver(() => {
    if (!body.contains(settingsElement)) {
      body.appendChild(settingsElement);
    }
    if (isUwuActive) {
      Array.from(body.children).forEach((child) => {
        if (child !== settingsElement) {
          child.style.display = "none";
        }
      });
    }
  });
  bodyObserver.observe(body, { childList: true });
}

/**
 * Creates the settings container and delegates mounting to the appropriate page structure.
 *
 * @param {string} blockId - Unique ID attribute for the root wrapper.
 * @param {string} content - HTML template payload to inject into the wrapper.
 * @returns {HTMLElement} The mounted settings container element.
 */
function createSettingsBlock(blockId, content) {
  const settingsElement = document.createElement("div");
  settingsElement.id = blockId;
  settingsElement.innerHTML = content;

  if (document.querySelector(".settings-hub")) {
    setupNativeSettingsIntegration(settingsElement);
  } else {
    const siteTable = document.querySelector("#site_table");
    const isMobile = siteTable?.getAttribute("data-mobile") === "0";
    const settingsContainer = isMobile
      ? document.querySelector("#branch")
      : siteTable || document.body;
    settingsContainer?.appendChild(settingsElement);
  }

  return settingsElement;
}

/**
 * Asynchronously preloads an array of image resources.
 *
 * @param {Array<{url: string, image?: HTMLImageElement}>} imageList - Array of objects with image URLs.
 * @returns {Promise<void>} Resolves when all images in the list are fully loaded.
 */
function preloadWeatherImages(imageList) {
  return Promise.all(
    imageList.map(
      (item) =>
        new Promise((resolve) => {
          if (item.image) return resolve();
          const img = new Image();
          img.src = item.url;
          img.onload = () => {
            item.image = img;
            resolve();
          };
          img.onerror = () => resolve();
        })
    )
  );
}

/**
 * Ambient weather background on the settings header card.
 *
 * @param {HTMLElement} headerCard - The header container (#uwusettings-header).
 * @returns {() => void} Teardown callback that stops animation and removes listeners.
 */
function initHeaderWeather(headerCard) {
  if (!headerCard || headerCard.querySelector(".uwu-header-weather-layer")) return () => {};

  const layer = document.createElement("div");
  layer.className = "uwu-header-weather-layer";
  headerCard.prepend(layer);

  // 1. Weather Type
  const allowedWeather = ["rain", "snow", "fireflies"];
  let weatherType = uwuStorage.getItem("uwu_lastActiveWeather");
  if (!allowedWeather.includes(weatherType)) {
    weatherType = allowedWeather[Math.floor(Math.random() * allowedWeather.length)];
  }

  let animationFrameId = null;
  let isRunning = false;
  let isDestroyed = false;
  let hasScattered = false;
  let lastTick = performance.now();

  // 2. Lifecycle Engine
  let tick = () => {};

  const startLoop = () => {
    if (isRunning || isDestroyed) return;
    isRunning = true;
    lastTick = performance.now();
    cancelAnimationFrame(animationFrameId);
    animationFrameId = requestAnimationFrame(tick);
  };

  const stopLoop = () => {
    isRunning = false;
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  };

  // 3. Fireflies
  if (weatherType === "fireflies") {
    const fireflyCount = 4;
    const fireflies = [];

    for (let i = 0; i < fireflyCount; i++) {
      const dot = document.createElement("div");
      dot.className = "firefly";
      const glow = document.createElement("div");
      glow.className = "firefly-glow";

      layer.appendChild(dot);
      layer.appendChild(glow);

      fireflies.push({
        dot,
        glow,
        x: 0,
        y: 0,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 4,
      });
    }

    tick = () => {
      if (!isRunning || isDestroyed) return;

      const width = layer.clientWidth;
      const height = layer.clientHeight;

      fireflies.forEach((f) => {
        f.x += f.vx;
        f.y += f.vy;

        if (f.x < 0 || f.x > width) f.vx *= -1;
        if (f.y < 0 || f.y > height) f.vy *= -1;

        f.dot.style.left = `${f.x}px`;
        f.dot.style.top = `${f.y}px`;
        f.dot.style.width = `${f.size}px`;
        f.dot.style.height = `${f.size}px`;

        f.glow.style.left = `${f.x - f.size * 2}px`;
        f.glow.style.top = `${f.y - f.size * 2}px`;
        f.glow.style.width = `${f.size * 5}px`;
        f.glow.style.height = `${f.size * 5}px`;
      });

      animationFrameId = requestAnimationFrame(tick);
    };

    const scatterFireflies = (w, h) => {
      fireflies.forEach((f) => {
        f.x = Math.random() * w;
        f.y = Math.random() * h;
      });
    };

    const resizeObserver = new ResizeObserver((entries) => {
      if (isDestroyed) return;
      for (const entry of entries) {
        const w = Math.round(entry.contentRect.width);
        const h = Math.round(entry.contentRect.height);

        if (w > 0 && h > 0) {
          if (!hasScattered) {
            scatterFireflies(w, h);
            hasScattered = true;
          }
          if (!document.hidden) startLoop();
        } else {
          stopLoop();
        }
      }
    });
    resizeObserver.observe(layer);

    const onVisibilityChange = () => {
      if (document.hidden) {
        stopLoop();
      } else if (layer.clientWidth > 0 && layer.clientHeight > 0) {
        startLoop();
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      isDestroyed = true;
      stopLoop();
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      layer.remove();
    };
  }

  // 4. Rain & Snow
  const canvas = document.createElement("canvas");
  layer.appendChild(canvas);
  const ctx = canvas.getContext("2d");

  const isPixel = !!settings.minecraftStyle;
  const pixelRainImages = [
    { url: "https://raw.githubusercontent.com/Ibirtem/CatWar/main/images/rain1.png" },
    { url: "https://raw.githubusercontent.com/Ibirtem/CatWar/main/images/rain2.png" },
  ];
  const pixelSnowImages = [
    { url: "https://raw.githubusercontent.com/Ibirtem/CatWar/main/images/snowflake1.png" },
    { url: "https://raw.githubusercontent.com/Ibirtem/CatWar/main/images/snowflake2.png" },
  ];

  if (isPixel) {
    preloadWeatherImages(weatherType === "rain" ? pixelRainImages : pixelSnowImages);
  }

  const particleCount = weatherType === "rain" ? 12 : 9;

  const createParticle = (spawnAcrossFullHeight = false) => {
    const width = canvas.width || layer.clientWidth || 300;
    const height = canvas.height || layer.clientHeight || 120;

    if (weatherType === "rain") {
      return {
        x: Math.random() * width,
        y: spawnAcrossFullHeight ? Math.random() * height : Math.random() * -40 - 10,
        length: Math.random() * 8 + 14,
        radiusX: 1.1,
        speedY: Math.random() * 3 + 7,
        speedX: Math.random() * 0.3 - 0.15,
        size: Math.random() * 10 + 16,
        img: pixelRainImages[Math.floor(Math.random() * pixelRainImages.length)],
      };
    }

    return {
      x: Math.random() * width,
      y: spawnAcrossFullHeight ? Math.random() * height : Math.random() * -30 - 10,
      size: isPixel ? Math.random() * 4 + 8 : Math.random() * 2 + 2,
      speedY: Math.random() * 0.6 + 0.6,
      speedX: (Math.random() - 0.5) * 0.35,
      img: pixelSnowImages[Math.floor(Math.random() * pixelSnowImages.length)],
    };
  };

  let particles = Array.from({ length: particleCount }, () => createParticle(false));

  tick = (now) => {
    if (!isRunning || isDestroyed) return;

    const dt = Math.min((now - lastTick) / 1000, 0.1);
    lastTick = now;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.y += p.speedY * 60 * dt;
      p.x += p.speedX * 60 * dt;

      if (weatherType === "rain") {
        if (isPixel && p.img?.image) {
          const img = p.img.image;
          const scale = p.size / Math.max(img.width, img.height);
          ctx.drawImage(img, p.x, p.y, img.width * scale, img.height * scale);
        } else {
          ctx.beginPath();
          ctx.ellipse(p.x, p.y, p.radiusX, p.length, 0, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(165, 195, 230, 0.45)";
          ctx.fill();
        }

        if (p.y > canvas.height + 25) {
          particles[i] = createParticle(false);
        }
      } else {
        if (isPixel && p.img?.image) {
          const img = p.img.image;
          ctx.drawImage(img, p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
          ctx.fill();
        }

        if (p.y > canvas.height + 15) {
          particles[i] = createParticle(false);
        }
      }
    }

    animationFrameId = requestAnimationFrame(tick);
  };

  const resizeObserver = new ResizeObserver((entries) => {
    if (isDestroyed) return;
    for (const entry of entries) {
      const w = Math.round(entry.contentRect.width);
      const h = Math.round(entry.contentRect.height);

      if (w > 0 && h > 0) {
        canvas.width = w;
        canvas.height = h;

        if (!hasScattered) {
          particles = Array.from({ length: particleCount }, () => createParticle(true));
          hasScattered = true;
        }

        if (!document.hidden) startLoop();
      } else {
        stopLoop();
      }
    }
  });

  resizeObserver.observe(layer);

  const onVisibilityChange = () => {
    if (document.hidden) {
      stopLoop();
    } else if (layer.clientWidth > 0 && layer.clientHeight > 0) {
      startLoop();
    }
  };
  document.addEventListener("visibilitychange", onVisibilityChange);

  return () => {
    isDestroyed = true;
    stopLoop();
    resizeObserver.disconnect();
    document.removeEventListener("visibilitychange", onVisibilityChange);
    layer.remove();
  };
}

// ====================================================================================================================
//  . . . РАБОТА ПАНЕЛИ НАСТРОЕК . . .
// ====================================================================================================================
if (targetSettings.test(window.location.href)) {
  createSettingsBlock("uwu-settings", uwusettings);

  const headerCard = document.getElementById("uwusettings-header");
  if (headerCard) {
    initHeaderWeather(headerCard);
  }

  // ====================================================================================================================
  //  . . . КНОПКА НОВОСТЕЙ . . .
  // ====================================================================================================================
  /**
   * Initializes the changelog modal dialog and binds open/close interactions.
   * @returns {void}
   */
  function initNewsModal() {
    if (document.getElementById("uwu-news-modal")) return;

    document.body.insertAdjacentHTML("beforeend", newsPanel);

    const modal = document.getElementById("uwu-news-modal");
    const openBtn = document.getElementById("uwu-version-badge");
    const closeBtn = document.getElementById("uwu-news-modal-close");

    const openModal = () => {
      modal.style.display = "flex";
    };

    const closeModal = () => {
      modal.style.display = "none";
    };

    openBtn?.addEventListener("click", openModal);
    closeBtn?.addEventListener("click", closeModal);

    modal?.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.style.display === "flex") {
        closeModal();
      }
    });
  }

  initNewsModal();

  // ========================================================
  const paramTableBody = document.getElementById("color-settings-body");
  /** @type {Object<string, GlassColorPicker>} */
  const paramPickers = {};

  const paramsList = [
    { id: "dream", name: "Сон", group: "Параметры" },
    { id: "hunger", name: "Голод" },
    { id: "thirst", name: "Жажда" },
    { id: "need", name: "Нужда" },
    { id: "health", name: "Здоровье" },
    { id: "clean", name: "Чистота" },
    { id: "smell", name: "Запах", group: "Навыки" },
    { id: "dig", name: "Копание" },
    { id: "swim", name: "Плавание" },
    { id: "might", name: "БУ" },
    { id: "tree", name: "Лазание" },
    { id: "observ", name: "Зоркость" },
    { id: "other", name: "Другие", group: "Уникальные навыки" }
  ];

  if (paramTableBody) {
    paramTableBody.innerHTML = "";

    paramsList.forEach((p) => {
      if (p.group) {
        const groupRow = document.createElement("tr");
        groupRow.innerHTML = `<th class="parameters-color-table--group" colspan="5">${p.group}</th>`;
        paramTableBody.appendChild(groupRow);
      }

      const row = document.createElement("tr");
      const nameCell = document.createElement("td");
      nameCell.className = "parameters-color-table--name";
      nameCell.textContent = p.name;
      row.appendChild(nameCell);

      const colorTypes = [
        "Заливка шкалы: от",
        "Заливка шкалы: до",
        "Фон шкалы: от",
        "Фон шкалы: до"
      ];

      for (let i = 0; i < 4; i++) {
        const cell = document.createElement("td");

        paramPickers[`${p.id}_${i}`] = new GlassColorPicker(cell, {
          mode: "swatch",
          label: `${p.name}: ${colorTypes[i]}`,
          onChange: (val) => {
            if (!settings.parametersColors[p.id]) {
              settings.parametersColors[p.id] = ["#008000", "#008000", "#cccccc", "#cccccc"];
            }
            settings.parametersColors[p.id][i] = val;
            saveSettings();
          }
        });

        row.appendChild(cell);
      }

      paramTableBody.appendChild(row);
    });
  }

  // ====================================================================================================================
  //  . . . ЦВЕТ ГРАНИЦ КЛЕТОК . . .
  // ====================================================================================================================
  const cellsBorderContainer = document.getElementById("cells-borders-color-picker");
  if (cellsBorderContainer) {
    if (!settings) loadSettings();

    new GlassColorPicker(cellsBorderContainer, {
      mode: "swatch",
      value: settings?.cellsBordersColor || uwuDefaultSettings.cellsBordersColor || "#ffffff",
      label: "Цвет границы клеток",
      onChange: (val) => {
        if (!settings) settings = { ...uwuDefaultSettings };
        settings.cellsBordersColor = val;
        saveSettings();
      }
    });
  }
  // ========================================================

  loadSettings();

  if (!settings.extendedHints) {
    const uwuHideHints = document.createElement("style");
    uwuHideHints.innerHTML = `
    #uwusettings p {
      display: none;
    }
    `;
    document.head.appendChild(uwuHideHints);
  }

  document
    .querySelectorAll("#uwusettings [data-setting]")
    .forEach((element) => {
      const setting = element.dataset.setting;
      if (element.type === "checkbox") {
        element.checked = settings[setting];
      } else {
        element.value = settings[setting];
      }
    });

  // ====================================================================================================================
  //  . . . ШРИФТ ГРОМКОСТИ ЧАТА . . .
  // ====================================================================================================================
  function saveFontSettings() {
    let fontSize = {};

    document.querySelectorAll("input[data-font-size]").forEach((input) => {
      fontSize[input.dataset.fontSize] = input.value;
    });

    uwuStorage.setItem("uwu_fontSize", fontSize);
  }

  function loadFontSettings() {
    let defaultFontSize = {
      vlm0: "10",
      vlm1: "11",
      vlm2: "11.5",
      vlm3: "12",
      vlm4: "12.5",
      vlm5: "13",
      vlm6: "15",
      vlm7: "17",
      vlm8: "19",
      vlm9: "21",
      vlm10: "23",
      fontSizeBody: "14",
      fontSizeSmall: "12",
      fontSizeLocation: "14",
      fontFamilyBody: "Verdana",
    };

    let fontSize = uwuStorage.getItem("uwu_fontSize") || defaultFontSize;

    document.querySelectorAll("input[data-font-size]").forEach((input) => {
      input.value = fontSize[input.dataset.fontSize] || "";
    });

    saveFontSettings();
  }

  document.querySelectorAll("input[data-font-size]").forEach((input) => {
    input.addEventListener("input", saveFontSettings);
  });

  loadFontSettings();
  // ====================================================================================================================
  //  . . . ПАРАМЕТРЫ КОСТЮМА . . .
  // ====================================================================================================================

  const costumeCheckbox = document.getElementById("personal-costume-panel");
  function updateCostumeFlexBoxState() {
    const costumeFlexBox = document.querySelectorAll(".costume-flex-box");
    const showCostumesCheckbox = document.getElementById("show-costumes");
    if (!costumeFlexBox || !showCostumesCheckbox) return;

    if (costumeCheckbox.checked) {
      costumeFlexBox.forEach((box) => {
        box.classList.remove("disabled");
      });
      showCostumesCheckbox.disabled = false;
    } else {
      costumeFlexBox.forEach((box) => {
        box.classList.add("disabled");
      });
      settings.showCostumesButtons = false;
      showCostumesCheckbox.checked = false;
      showCostumesCheckbox.disabled = true;
    }
  }

  costumeCheckbox.addEventListener("change", updateCostumeFlexBoxState);

  updateCostumeFlexBoxState();

  function applyCostumeFromSlot(slotIndex) {
    let data = uwuStorage.getItem("uwu_personal") || {};

    if (
      !data.costumes ||
      !data.costumes.slots ||
      !data.costumes.slots[slotIndex]
    ) {
      alert("В этом слоте нет костюма.");
      return;
    }

    const costumeImage = data.costumes.slots[slotIndex].base;
    if (!costumeImage) {
      alert("В этом слоте нет изображения костюма.");
      return;
    }

    data.costumes.base = costumeImage;
    uwuStorage.setItem("uwu_personal", data);

    alert("Костюм успешно применен!");
    loadCostume();
  }

  function removeCostumeFromSlot(slotIndex) {
    if (!confirm("Вы уверены, что хотите удалить этот слот с костюмом?")) {
      return;
    }

    let data = uwuStorage.getItem("uwu_personal") || {};

    if (
      data.costumes &&
      data.costumes.slots &&
      data.costumes.slots[slotIndex]
    ) {
      data.costumes.slots.splice(slotIndex, 1);
      data.costumes.slots = data.costumes.slots.filter((slot) => slot);
      uwuStorage.setItem("uwu_personal", data);
      alert("Слот " + (slotIndex + 1) + " успешно удален.");
      loadCostume();
    } else {
      alert("Не удалось найти костюм для удаления.");
    }
  }

  function loadCostume() {
    let data = uwuStorage.getItem("uwu_personal") || {};
    document.getElementById("cat-image-preview")?.remove();

    if (!data || !data.catImg) {
      // Нет данных для костюма или изображение не найдено
      return;
    }

    if (data.costumes && data.costumes.base) {
      const costumeImg = document.getElementById("cat-image-container");
      const imgElement = document.createElement("img");
      imgElement.id = "cat-image-preview";
      imgElement.style.backgroundColor = "transparent";
      imgElement.style.backgroundImage = "url(" + data.costumes.base + ")";
      imgElement.style.backgroundSize = data.catImg.size;
      imgElement.style.position = "absolute";
      imgElement.classList.add("costume-style");
      costumeImg.appendChild(imgElement);
    }

    const galleryArray = document.getElementById("costume-gallery");
    galleryArray.innerHTML = "";

    if (data.costumes && Array.isArray(data.costumes.slots)) {
      data.costumes.slots.forEach((slot, i) => {
        if (!slot) return;

        const boxContainer = document.createElement("div");
        boxContainer.className = "costume-gallery-box";

        const deleteButton = document.createElement("button");
        deleteButton.innerText = "❌";
        deleteButton.classList.add(
          "uwu-button",
          "remove-button",
          "costume-slot-delete-button"
        );
        deleteButton.title = "Удалить слот";
        deleteButton.addEventListener("click", () => removeCostumeFromSlot(i));
        boxContainer.appendChild(deleteButton);

        const slotNumber = document.createElement("div");
        slotNumber.innerText = `${i + 1}.`;
        slotNumber.style.position = "absolute";
        slotNumber.style.top = "10px";
        slotNumber.style.left = "10px";
        boxContainer.appendChild(slotNumber);

        const imageContainer = document.createElement("div");
        imageContainer.style.display = "flex";
        imageContainer.style.justifyContent = "center";

        const imageBox = document.createElement("div");
        imageBox.style.backgroundImage = `url(${data.catImg.src})`;
        imageBox.style.backgroundSize = data.catImg.size;
        imageBox.classList.add("costume-slot");
        imageBox.style.flex = "1";
        imageBox.style.maxWidth = "100px";
        imageContainer.appendChild(imageBox);

        if (slot.base) {
          const costumeBox = document.createElement("div");
          costumeBox.style.backgroundImage = `url(${slot.base})`;
          costumeBox.style.backgroundSize = data.catImg.size;
          costumeBox.classList.add("costume-slot");
          costumeBox.style.position = "absolute";
          costumeBox.id = "costume";
          imageContainer.appendChild(costumeBox);
        }

        const applyButton = document.createElement("button");
        applyButton.classList = "uwu-button install-button";
        applyButton.style.margin = "0.5rem";
        applyButton.innerText = "Применить костюм";
        applyButton.addEventListener("click", () => applyCostumeFromSlot(i));

        boxContainer.appendChild(imageContainer);
        boxContainer.appendChild(applyButton);
        galleryArray.appendChild(boxContainer);
      });
    }

    const addSlotButton = document.createElement("div");
    addSlotButton.className = "costume-gallery-box";
    addSlotButton.style.display = "flex";
    addSlotButton.style.alignItems = "center";
    addSlotButton.style.justifyContent = "center";
    addSlotButton.style.fontSize = "5rem";
    addSlotButton.style.cursor = "pointer";
    addSlotButton.style.minWidth = "150px";
    addSlotButton.style.minHeight = "220px";
    addSlotButton.innerText = "+";
    addSlotButton.title = "Добавить новый костюм из файла";
    addSlotButton.addEventListener("click", () => {
      document.getElementById("costume-file").click();
    });
    galleryArray.appendChild(addSlotButton);
  }

  function readImageFileAsDataURL(inputId, onSuccess, onError) {
    const imgInput = document.getElementById(inputId);
    const file = imgInput.files[0];
    if (!file) {
      alert("Пожалуйста, выберите изображение для костюма.");
      return;
    }
    const reader = new FileReader();
    reader.onerror = function () {
      if (onError) onError("Ошибка при чтении файла. Попробуйте еще раз.");
    };
    reader.onload = function (e) {
      if (!e.target.result.startsWith("data:image/")) {
        if (onError) onError("Пожалуйста, выберите изображение для костюма.");
        return;
      }
      if (onSuccess) onSuccess(e.target.result);
    };
    reader.readAsDataURL(file);
  }

  if (settings.personalCostumes) {
    let rawData = uwuStorage.getItem("uwu_personal") || {};
    let dataChanged = false;

    if (!rawData.cats && rawData.id) {
      rawData.cats = {};
      rawData.cats[rawData.id] = {
        id: rawData.id,
        name: "Мой кот",
        img: rawData.catImg?.src || "",
        size: rawData.catImg?.size || "contain",
        costume: rawData.costumes?.base || "",
      };
      if (rawData.costumes?.slots) rawData.slots = rawData.costumes.slots;
      delete rawData.id;
      delete rawData.catImg;
      delete rawData.costumes;
      dataChanged = true;
    }

    if (!rawData.cats) {
      rawData.cats = {};
      dataChanged = true;
    }
    if (!rawData.slots) {
      rawData.slots = [];
      dataChanged = true;
    }

    Object.keys(rawData.cats).forEach((catId) => {
      let cat = rawData.cats[catId];
      if (!cat.poses) {
        cat.poses = {};
        if (cat.costume && cat.img) {
          const fileName = cat.img.split("/").pop() || "unknown";
          cat.poses[fileName] = cat.costume;
        }
        delete cat.costume;
        dataChanged = true;
      }
    });

    if (dataChanged) uwuStorage.setItem("uwu_personal", rawData);

    let currentEditCatId = null;
    let currentPoseKey = null;

    const catSelect = document.getElementById("current-cat-select");
    const poseSelect = document.getElementById("current-pose-select");
    const warningBox = document.getElementById("no-cats-warning");
    const flexBox = document.querySelector(".costume-flex-box");
    const previewContainer = document.getElementById("cat-image-container");
    const previewName = document.getElementById("cat-preview-name");

    function updateCatSelector() {
      let data = uwuStorage.getItem("uwu_personal") || { cats: {}, slots: [] };
      if (catSelect) catSelect.innerHTML = "";
      const catIds = Object.keys(data.cats);

      if (catIds.length === 0) {
        if (warningBox) warningBox.style.display = "block";
        if (flexBox) flexBox.classList.add("disabled");
        return;
      }

      if (warningBox) warningBox.style.display = "none";
      if (costumeCheckbox.checked && flexBox)
        flexBox.classList.remove("disabled");

      catIds.forEach((id) => {
        const cat = data.cats[id];
        const option = document.createElement("option");
        option.value = id;
        option.textContent = `${cat.name} (ID: ${id})`;
        if (catSelect) catSelect.appendChild(option);
      });

      if (currentEditCatId && data.cats[currentEditCatId]) {
        if (catSelect) catSelect.value = currentEditCatId;
      } else {
        currentEditCatId = catIds[0];
        if (catSelect) catSelect.value = currentEditCatId;
      }

      updatePoseSelector();
    }

    function updatePoseSelector() {
      let data = uwuStorage.getItem("uwu_personal");
      if (!currentEditCatId || !data.cats[currentEditCatId]) return;

      const cat = data.cats[currentEditCatId];
      if (poseSelect) poseSelect.innerHTML = "";

      const poses = Object.keys(cat.poses);

      if (poses.length === 0 && cat.img) {
        const fileName = cat.img.split("/").pop();
        cat.poses[fileName] = "";
        poses.push(fileName);
        uwuStorage.setItem("uwu_personal", data);
      }

      poses.forEach((poseFile, index) => {
        const option = document.createElement("option");
        option.value = poseFile;
        const hasCostume = cat.poses[poseFile] ? "✅" : "❌";
        option.textContent = `${index + 1}. ${poseFile} [${hasCostume}]`;
        if (poseSelect) poseSelect.appendChild(option);
      });

      if (poses.length > 0) {
        currentPoseKey = poses[0];
        if (poseSelect) poseSelect.value = currentPoseKey;
      } else {
        currentPoseKey = null;
      }

      renderPreview();
    }

    function renderPreview() {
      let data = uwuStorage.getItem("uwu_personal");
      if (
        !currentEditCatId ||
        !data.cats[currentEditCatId] ||
        !currentPoseKey
      ) {
        if (previewContainer) previewContainer.innerHTML = "";
        if (previewName) previewName.textContent = "...";
        return;
      }

      const cat = data.cats[currentEditCatId];
      const currentCostume = cat.poses[currentPoseKey];

      if (previewName) previewName.textContent = cat.name;

      if (previewContainer) {
        previewContainer.innerHTML = "";
        previewContainer.style.minWidth = "100px";
        previewContainer.style.minHeight = "150px";
        previewContainer.style.flexShrink = "0";

        if (!cat.img) {
          previewContainer.innerHTML = `
                    <div style="
                        width: 100%; 
                        height: 100%; 
                        display: flex; 
                        align-items: center; 
                        justify-content: center; 
                        text-align: center; 
                        font-size: 0.8em; 
                        color: #ffaaaa; 
                        padding: 5px; 
                        box-sizing: border-box;
                    ">
                        Внешность не загружена.<br>Зайдите в Игровую!
                    </div>
                `;
          return;
        }

        let bgUrl = "";
        if (cat.img.includes(currentPoseKey)) {
          bgUrl = cat.img;
        } else {
          bgUrl = `/cw3/composited/${currentPoseKey}`;
        }

        // 1. Слой кота
        const catImg = document.createElement("div");
        catImg.style.width = "100px";
        catImg.style.height = "150px";
        catImg.style.position = "absolute";
        catImg.style.top = "0";
        catImg.style.left = "0";
        catImg.style.backgroundImage = `url(${bgUrl})`;
        catImg.style.backgroundSize = cat.size || "contain";
        catImg.style.backgroundPosition = "center";
        catImg.style.backgroundRepeat = "no-repeat";
        previewContainer.appendChild(catImg);

        // 2. Слой костюма
        if (currentCostume) {
          const costumeImg = document.createElement("div");
          costumeImg.style.width = "100px";
          costumeImg.style.height = "150px";
          costumeImg.style.position = "absolute";
          costumeImg.style.top = "0";
          costumeImg.style.left = "0";
          costumeImg.style.backgroundImage = `url(${currentCostume})`;
          costumeImg.style.backgroundSize = cat.size || "contain";
          costumeImg.style.backgroundPosition = "center";
          costumeImg.style.backgroundRepeat = "no-repeat";
          previewContainer.appendChild(costumeImg);
        }
      }
      loadGallery();
    }

    function loadGallery() {
      const gallery = document.getElementById("costume-gallery");
      if (!gallery) return;
      gallery.innerHTML = "";

      let data = uwuStorage.getItem("uwu_personal") || { slots: [] };

      const addBtn = document.createElement("div");
      addBtn.className = "costume-gallery-box";
      addBtn.style.justifyContent = "center";
      addBtn.style.cursor = "pointer";
      addBtn.style.minWidth = "140px";
      addBtn.style.minHeight = "230px";
      addBtn.innerHTML =
        "<div style='font-size: 3em;'>+</div><div>Из файла</div>";
      addBtn.addEventListener("click", () =>
        document.getElementById("costume-file").click()
      );
      gallery.appendChild(addBtn);

      data.slots.forEach((slotBase64, index) => {
        const box = document.createElement("div");
        box.className = "costume-gallery-box";
        box.style.minWidth = "140px";

        const slotPreview = document.createElement("div");
        slotPreview.style.width = "100px";
        slotPreview.style.height = "150px";
        slotPreview.style.minWidth = "100px";
        slotPreview.style.minHeight = "150px";
        slotPreview.style.flexShrink = "0";
        slotPreview.style.position = "relative";
        slotPreview.style.border = "1px solid rgba(255,255,255,0.1)";
        slotPreview.style.borderRadius = "5px";

        if (currentEditCatId && data.cats[currentEditCatId] && currentPoseKey) {
          const cat = data.cats[currentEditCatId];
          let bgUrl = cat.img.includes(currentPoseKey)
            ? cat.img
            : `/cw3/composited/${currentPoseKey}`;

          const catLayer = document.createElement("div");
          catLayer.style.position = "absolute";
          catLayer.style.top = "0";
          catLayer.style.left = "0";
          catLayer.style.width = "100%";
          catLayer.style.height = "100%";
          catLayer.style.backgroundImage = `url(${bgUrl})`;
          catLayer.style.backgroundSize = cat.size || "contain";
          catLayer.style.backgroundRepeat = "no-repeat";
          catLayer.style.backgroundPosition = "center";
          slotPreview.appendChild(catLayer);
        }

        const suitDiv = document.createElement("div");
        suitDiv.style.position = "absolute";
        suitDiv.style.top = "0";
        suitDiv.style.left = "0";
        suitDiv.style.width = "100%";
        suitDiv.style.height = "100%";
        suitDiv.style.backgroundImage = `url(${slotBase64})`;
        suitDiv.style.backgroundSize =
          currentEditCatId && data.cats[currentEditCatId]
            ? data.cats[currentEditCatId].size
            : "contain";
        suitDiv.style.backgroundRepeat = "no-repeat";
        suitDiv.style.backgroundPosition = "center";
        slotPreview.appendChild(suitDiv);

        box.appendChild(slotPreview);

        const applyBtn = document.createElement("button");
        applyBtn.className = "uwu-button install-button";
        applyBtn.innerText = "Надеть";
        applyBtn.style.width = "100%";
        applyBtn.style.marginTop = "10px";
        applyBtn.addEventListener("click", () => {
          if (!currentEditCatId || !currentPoseKey)
            return alert("Не выбран кот или поза!");
          let d = uwuStorage.getItem("uwu_personal");
          d.cats[currentEditCatId].poses[currentPoseKey] = slotBase64;
          uwuStorage.setItem("uwu_personal", d);
          updatePoseSelector();
          renderPreview();
        });

        const delBtn = document.createElement("button");
        delBtn.className =
          "costume-slot-delete-button uwu-button remove-button";
        delBtn.innerText = "✖";
        delBtn.title = "Удалить слот";
        delBtn.addEventListener("click", () => {
          if (confirm("Удалить этот костюм из библиотеки?")) {
            let d = uwuStorage.getItem("uwu_personal");
            d.slots.splice(index, 1);
            uwuStorage.setItem("uwu_personal", d);
            loadGallery();
          }
        });

        box.appendChild(applyBtn);
        box.appendChild(delBtn);
        gallery.appendChild(box);
      });
    }

    if (catSelect) {
      catSelect.addEventListener("change", (e) => {
        currentEditCatId = e.target.value;
        updatePoseSelector();
      });
    }

    if (poseSelect) {
      poseSelect.addEventListener("change", (e) => {
        currentPoseKey = e.target.value;
        renderPreview();
      });
    }

    const deleteCatBtn = document.getElementById("delete-cat-btn");
    if (deleteCatBtn) {
      deleteCatBtn.addEventListener("click", () => {
        if (!currentEditCatId) return;
        if (confirm("Удалить этого кота из списка?")) {
          let data = uwuStorage.getItem("uwu_personal");
          delete data.cats[currentEditCatId];
          uwuStorage.setItem("uwu_personal", data);
          currentEditCatId = null;
          updateCatSelector();
        }
      });
    }

    const changeBtn = document.getElementById("changeCostume");
    if (changeBtn) {
      changeBtn.addEventListener("click", () => {
        readImageFileAsDataURL(
          "costume-file",
          async (dataUrl) => {
            if (!currentEditCatId || !currentPoseKey)
              return alert("Сначала выберите кота и позу.");
            try {
              const resized = await resizeImageToAspectRatio(dataUrl);
              let data = uwuStorage.getItem("uwu_personal");
              data.cats[currentEditCatId].poses[currentPoseKey] = resized;
              uwuStorage.setItem("uwu_personal", data);
              updatePoseSelector();
              renderPreview();
              alert("Костюм надет на выбранную позу!");
            } catch (e) {
              console.error(e);
              alert("Ошибка обработки");
            }
          },
          alert
        );
      });
    }

    const removeBtn = document.getElementById("removeCostume");
    if (removeBtn) {
      removeBtn.addEventListener("click", () => {
        if (!currentEditCatId || !currentPoseKey) return;
        let data = uwuStorage.getItem("uwu_personal");
        data.cats[currentEditCatId].poses[currentPoseKey] = "";
        uwuStorage.setItem("uwu_personal", data);
        updatePoseSelector();
        renderPreview();
      });
    }

    const saveSlotBtn = document.getElementById("saveCostumeToNewSlot");
    if (saveSlotBtn) {
      saveSlotBtn.addEventListener("click", () => {
        readImageFileAsDataURL(
          "costume-file",
          async (dataUrl) => {
            try {
              const resized = await resizeImageToAspectRatio(dataUrl);
              let data = uwuStorage.getItem("uwu_personal") || {
                cats: {},
                slots: [],
              };
              if (!data.slots) data.slots = [];
              data.slots.push(resized);
              uwuStorage.setItem("uwu_personal", data);
              loadGallery();
              alert("Костюм сохранен!");
            } catch (e) {
              console.error(e);
              alert("Ошибка");
            }
          },
          alert
        );
      });
    }

    updateCatSelector();
  }

  // ====================================================================================================================
  //  . . . ИМПОРТ ЛС ИЗ ДРУГИХ МОДОВ (ВАРОМОДА) . . .
  // ====================================================================================================================
  function importLsFromVarmod() {
    try {
      const varmodLsRaw = localStorage.getItem("cwmod_ls");
      if (!varmodLsRaw) {
        alert(
          "Сохранённые ЛС из других модов или скриптов не найдены в вашем браузере."
        );
        return;
      }

      const varmodLs = JSON.parse(varmodLsRaw);

      const uwuLs = uwuStorage.getItem("uwu_saved_ls") || {};

      let importedCount = 0;
      let updatedCount = 0;

      for (const lsId in varmodLs) {
        if (uwuLs.hasOwnProperty(lsId)) {
          const varmodDate = new Date(varmodLs[lsId].savedate);
          const uwuDate = new Date(uwuLs[lsId].savedate);
          if (varmodDate > uwuDate) {
            uwuLs[lsId] = varmodLs[lsId];
            updatedCount++;
          }
        } else {
          uwuLs[lsId] = varmodLs[lsId];
          importedCount++;
        }
      }

      uwuStorage.setItem("uwu_saved_ls", uwuLs);
      alert(
        `Импорт успешно завершён!\nНовых переписок импортировано: ${importedCount}\nСуществующих переписок обновлено: ${updatedCount}`
      );
    } catch (error) {
      console.error("UwU | Ошибка при импорте ЛС из других модов:", error);
      alert(
        "Произошла ошибка во время импорта. Возможно, данные других модов повреждены."
      );
    }
  }

  const importLsButton = document.getElementById("import-ls-from-other-mods");
  if (importLsButton) {
    importLsButton.addEventListener("click", importLsFromVarmod);
  }

  /**
   * Настраивает логику для индивидуального импорта/экспорта сохраненных ЛС.
   */
  function setupLsImportExport() {
    const exportField = document.getElementById("ls-export-field");
    const importField = document.getElementById("ls-import-field");
    const importButton = document.getElementById("ls-import-btn");

    if (!exportField || !importField || !importButton) return;

    function updateLsExportField() {
      const savedLs = uwuStorage.getItem("uwu_saved_ls") || {};
      exportField.value = JSON.stringify(savedLs);
    }

    importButton.addEventListener("click", () => {
      const jsonString = importField.value;
      if (!jsonString.trim()) {
        alert("Поле для импорта пустое.");
        return;
      }

      try {
        const importedLs = JSON.parse(jsonString);

        if (typeof importedLs !== "object" || importedLs === null) {
          throw new Error("Импортируемые данные не являются объектом.");
        }

        uwuStorage.setItem("uwu_saved_ls", importedLs);
        alert("Сохранённые ЛС успешно импортированы!");
        importField.value = "";
        updateLsExportField();
      } catch (error) {
        alert(
          "Ошибка! Не удалось импортировать ЛС. Проверьте корректность вставленных данных."
        );
        console.error("UwU | Ошибка импорта ЛС:", error);
      }
    });

    updateLsExportField();
  }

  setupLsImportExport();
  // ====================================================================================================================
  //  . . . ТЕМЫ И ЦВЕТА ИГРОВОЙ . . .
  // ====================================================================================================================
  const pickersGrid = document.getElementById("theme-pickers-grid");
  const saveThemeButton = document.getElementById("saveThemeButton");
  const themeSelect = document.getElementById("theme-select");
  const addThemeButton = document.getElementById("addThemeButton");
  const removeThemeButton = document.getElementById("removeThemeButton");

  let currentThemeName = getCurrentThemeName();
  let allThemes = getThemes();

  const themeConfig = [
    { key: "backgroundColor", label: "Цвет фона страницы" },
    { key: "blocksColor", label: "Основной цвет блоков" },
    { key: "chatColor", label: "Основной цвет чата" },
    { key: "textColor", label: "Цвет текста" },
    { key: "linkColor", label: "Цвет ссылок" },
    { key: "catTooltipBackground", label: "Фон подсказки «О Коте»" },
    { key: "fightPanelBackground", label: "Фон панели Боевого режима" },
    { key: "moveNameColor", label: "Цвет текста перехода" },
    { key: "moveNameBackground", label: "Цвет фона перехода" },
    { key: "climbingPanelBackground", label: "Фон Минного Поля" },
    { key: "accentColor1", label: "Акценты 1", hint: "Кнопки, слайдеры и текст имени в чате" },
    { key: "accentColor2", label: "Акценты 2", hint: "Линии в чате, разделители и ползунок громкости" },
    { key: "accentColor3", label: "Акценты 3", hint: "Цвет уведомлений (ЛС и подсветка упоминания в чате)" },
  ];

  /** @type {Object<string, GlassColorPicker>} */
  const activePickers = {};

  if (pickersGrid) {
    themeConfig.forEach((item) => {
      activePickers[item.key] = new GlassColorPicker(pickersGrid, {
        label: item.label,
        hint: item.hint || "",
        onChange: () => {
          if (isDefaultTheme(currentThemeName)) {
            alert("Вы не можете изменять стандартные темы. Пожалуйста, создайте свою собственную тему.");
            loadThemeToInputs(currentThemeName);
          } else {
            saveThemeFromInputs();
          }
        },
      });
    });
  }

  function loadThemeToInputs(themeName) {
    const currentThemeColors = allThemes[themeName]?.colors || {};
    themeConfig.forEach(({ key }) => {
      activePickers[key]?.setValue(currentThemeColors[key] || "", false);
    });
  }

  function saveThemeFromInputs() {
    const themeData = { colors: {} };
    themeConfig.forEach(({ key }) => {
      themeData.colors[key] = activePickers[key]?.getValue() || "";
    });
    allThemes[currentThemeName] = themeData;
    saveThemes(allThemes);
  }

  function updateThemeSelect() {
    themeSelect.innerHTML = "";
    Object.keys(allThemes).forEach((name) => {
      const option = document.createElement("option");
      option.value = name;
      option.textContent = name;
      themeSelect.appendChild(option);
    });
    themeSelect.value = currentThemeName;
    removeThemeButton.style.display = Object.keys(defaultThemes).includes(currentThemeName) ? "none" : "inline";
  }

  themeSelect.addEventListener("change", (event) => {
    currentThemeName = event.target.value;
    setCurrentThemeName(currentThemeName);
    loadThemeToInputs(currentThemeName);
    updateThemeSelect();
    updateSaveButtonState();
  });

  addThemeButton.addEventListener("click", () => {
    const newThemeName = prompt("Введите название новой темы:");
    if (newThemeName && !allThemes[newThemeName]) {
      allThemes[newThemeName] = { colors: {} };
      saveThemes(allThemes);
      updateThemeSelect();
      themeSelect.value = newThemeName;
      currentThemeName = newThemeName;
      setCurrentThemeName(currentThemeName);
      loadThemeToInputs(currentThemeName);
    }
  });

  removeThemeButton.addEventListener("click", () => {
    if (!Object.keys(defaultThemes).includes(currentThemeName)) {
      delete allThemes[currentThemeName];
      saveThemes(allThemes);
      currentThemeName = "Тёмная Тема";
      setCurrentThemeName(currentThemeName);
      updateThemeSelect();
      loadThemeToInputs(currentThemeName);
    }
  });

  saveThemeButton.addEventListener("click", () => {
    if (isDefaultTheme(currentThemeName)) {
      alert("Вы не можете изменять стандартные темы. Пожалуйста, создайте свою собственную тему.");
    } else {
      saveThemeFromInputs();
    }
  });

  updateThemeSelect();
  loadThemeToInputs(currentThemeName);

  // ====================================================================================================================
  //  . . . РАБОТА ЦВЕТОВ НАВЫКОВ И ПАРАМЕТРОВ . . .
  // ====================================================================================================================
  document
    .querySelectorAll('#parameters-color-settings input[type="color"]')
    .forEach((element) => {
      element.addEventListener("change", () => {
        const paramId = element.dataset.param;
        const colorType = element.dataset.colorType;
        const colorValue = element.value;

        if (!settings.parametersColors[paramId]) {
          settings.parametersColors[paramId] = [];
        }
        const colorIndex =
          colorType === "bar-from"
            ? 0
            : colorType === "bar-to"
            ? 1
            : colorType === "bg-from"
            ? 2
            : 3;
        settings.parametersColors[paramId][colorIndex] = colorValue;

        saveSettings();
      });
    });

  function restoreColorPickers() {
    paramsList.forEach((p) => {
      const colors = settings.parametersColors[p.id] || ["#008000", "#008000", "#cccccc", "#cccccc"];
      for (let i = 0; i < 4; i++) {
        paramPickers[`${p.id}_${i}`]?.setValue(colors[i] || "", false);
      }
    });
  }

  restoreColorPickers();

  function setupParameterColorImportExport() {
    const exportField = document.getElementById("param-colors-export-field");
    const importField = document.getElementById("param-colors-import-field");
    const importButton = document.getElementById("param-colors-import-btn");

    if (!exportField || !importField || !importButton) return;

    function updateParamColorsExportField() {
      try {
        exportField.value = JSON.stringify(settings.parametersColors);
      } catch (error) {
        console.error("Ошибка при обновлении поля экспорта цветов:", error);
        exportField.value = "Ошибка экспорта.";
      }
    }

    importButton.addEventListener("click", () => {
      const jsonString = importField.value;
      if (!jsonString.trim()) {
        alert("Поле для импорта пустое.");
        return;
      }

      try {
        const importedColors = JSON.parse(jsonString);

        if (
          typeof importedColors !== "object" ||
          importedColors === null ||
          !importedColors.dream
        ) {
          throw new Error("Неверный формат данных.");
        }

        settings.parametersColors = importedColors;
        saveSettings();
        restoreColorPickers();
        updateParamColorsExportField();

        alert("Настройки цветов успешно импортированы!");
        importField.value = "";
      } catch (error) {
        alert(
          "Ошибка! Не удалось импортировать настройки. Проверьте корректность вставленных данных."
        );
        console.error("Ошибка импорта цветов параметров:", error);
      }
    });

    updateParamColorsExportField();
  }

  setupParameterColorImportExport();
  // ====================================================================================================================
  //  . . . ПОДСВЕТКА РЕСУРСОВ . . .
  // ====================================================================================================================
  const defaultHighlightResources = [
    { name: "Травы", color: "#90EE90", highlight: false },
    { name: "Мох", color: "#90EE90", highlight: false },
    { name: "Паутина", color: "#90EE90", highlight: false },
    { name: "Пыль", color: "#DDA0DD", highlight: false },
    { name: "Ветки, вьюнки, костоправы", color: "#90EE90", highlight: false },
    { name: "Травящие предметы", color: "#FF0000", highlight: false },
    { name: "Шаманские штучки", color: "#00BFFF", highlight: false },
  ];

  const resourcesTableBody = document.getElementById("resources-table-body");
  /** @type {Object<string, GlassColorPicker>} */
  const resourcePickers = {};

  function saveHighlightSettings() {
    const list = [];
    defaultHighlightResources.forEach((res) => {
      const checkbox = document.querySelector(`.uwu-highlight-checkbox[data-resource="${res.name}"]`);
      list.push({
        name: res.name,
        color: resourcePickers[res.name]?.getValue() || res.color,
        highlight: checkbox ? checkbox.checked : false,
      });
    });
    uwuStorage.setItem("uwu_highlightResources", list);
  }

  function restoreHighlightSettings() {
    const saved = uwuStorage.getItem("uwu_highlightResources") || defaultHighlightResources;
    saved.forEach((res) => {
      resourcePickers[res.name]?.setValue(res.color, false);
      const checkbox = document.querySelector(`.uwu-highlight-checkbox[data-resource="${res.name}"]`);
      if (checkbox) checkbox.checked = !!res.highlight;
    });
  }

  if (resourcesTableBody) {
    resourcesTableBody.innerHTML = "";

    defaultHighlightResources.forEach((res) => {
      const row = document.createElement("tr");

      const nameCell = document.createElement("td");
      nameCell.textContent = res.name;
      row.appendChild(nameCell);

      const pickerCell = document.createElement("td");
      resourcePickers[res.name] = new GlassColorPicker(pickerCell, {
        mode: "swatch",
        value: res.color,
        label: `Цвет ресурса: ${res.name}`,
        onChange: saveHighlightSettings,
      });
      row.appendChild(pickerCell);

      const checkCell = document.createElement("td");
      checkCell.className = "uwu-checkbox-cell";
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "uwu-highlight-checkbox";
      checkbox.dataset.resource = res.name;
      checkbox.addEventListener("change", saveHighlightSettings);
      checkCell.appendChild(checkbox);
      row.appendChild(checkCell);

      resourcesTableBody.appendChild(row);
    });

    restoreHighlightSettings();
  }

  // ====================================================================================================================
  //  . . . ЦВЕТА КОМАНД БОЕВОГО РЕЖИМА . . .
  // ====================================================================================================================
  const fightTeamsTableBody = document.getElementById("fight-teams-table-body");
  /** @type {Object<string, GlassColorPicker>} */
  const teamPickers = {};

  /**
   * Restores stored battle team colors into color picker swatches.
   */
  function restoreColorTeamsPickers() {
    [1, 2, 3, 4].forEach((num) => {
      const teamKey = `team${num}`;
      const colors = settings.fightTeamsColors?.[teamKey] || ["#41cd70", "#cd4141"];
      teamPickers[`${num}_green`]?.setValue(colors[0], false);
      teamPickers[`${num}_red`]?.setValue(colors[1], false);
    });
  }

  if (fightTeamsTableBody) {
    fightTeamsTableBody.innerHTML = "";

    [1, 2, 3, 4].forEach((num) => {
      const row = document.createElement("tr");

      const nameCell = document.createElement("td");
      nameCell.textContent = `Команда ${num}`;
      row.appendChild(nameCell);

      const greenCell = document.createElement("td");
      teamPickers[`${num}_green`] = new GlassColorPicker(greenCell, {
        mode: "swatch",
        value: settings.fightTeamsColors?.[`team${num}`]?.[0] || "#41cd70",
        label: `Команда ${num}: Энергия`,
        onChange: (val) => {
          if (!settings.fightTeamsColors[`team${num}`]) {
            settings.fightTeamsColors[`team${num}`] = ["#41cd70", "#cd4141"];
          }
          settings.fightTeamsColors[`team${num}`][0] = val;
          saveSettings();
        },
      });
      row.appendChild(greenCell);

      const redCell = document.createElement("td");
      teamPickers[`${num}_red`] = new GlassColorPicker(redCell, {
        mode: "swatch",
        value: settings.fightTeamsColors?.[`team${num}`]?.[1] || "#cd4141",
        label: `Команда ${num}: Снесено`,
        onChange: (val) => {
          if (!settings.fightTeamsColors[`team${num}`]) {
            settings.fightTeamsColors[`team${num}`] = ["#41cd70", "#cd4141"];
          }
          settings.fightTeamsColors[`team${num}`][1] = val;
          saveSettings();
        },
      });
      row.appendChild(redCell);

      fightTeamsTableBody.appendChild(row);
    });

    restoreColorTeamsPickers();
  }

  // ====================================================================================================================
  //   . . . СБРОС НАСТРОЕК . . .
  // ====================================================================================================================
  const settingsKeys = [
    "uwu_settings",
    "uwu_version",
    "uwu_layoutSettings",
    "uwu_climbingPanelState",
    "uwu_moduleStates",
    "uwu_fightPanelPosition",
    "uwu_climbingPanelStatus",
    "uwu_privateModules",
    "uwu_colorThemes",
    "uwu_currentTheme",
    "uwu_fontSize",
    "uwu_clock",
    "uwu_templates",
    "uwu_highlightResources",
    "uwu_saved_ls",
    "uwu_activity",
    "uwu_fastStyles",
    "uwu_fastStyles_hideCatTooltip",
    "uwu_fightTeamsCats",
    "uwu_catchingLog_customItems",
    "uwu_customSounds",
  ];

  function resetAllSaves() {
    const confirmReset = confirm(
      "Точно сбросить ВСЕ UwU Настройки? Это удалить абсолютно всё по UwU скрипту/моду, даже ваши карты Минных полей, темы и многое другое!"
    );
    if (confirmReset) {
      settingsKeys.forEach((key) => {
        uwuStorage.removeItem(key);
        console.log(`Удалено ${key}`);
      });
      console.log("Все настройки сброшены");
    } else {
      console.log("Сброс настроек отменен");
    }
  }

  document
    .getElementById("resetAllSaves")
    .addEventListener("click", resetAllSaves);

  // ====================================================================================================================
  //  . . . ЕДИНОЕ ХРАНИЛИЩЕ . . .
  // ====================================================================================================================

  const unifiedStorageCheckbox = document.querySelector(
    '[data-setting="unifiedStorage"]'
  );

  if (
    typeof GM_setValue === "undefined" ||
    typeof GM_getValue === "undefined" ||
    typeof GM_listValues === "undefined" ||
    typeof GM_deleteValue === "undefined"
  ) {
    const container = unifiedStorageCheckbox.parentElement;
    container.innerHTML =
      '<p style="color: #ff7878;"><b>Единое хранилище недоступно.</b><br>Вероятнее всего, ваш менеджер скриптов (например, Tampermonkey) не предоставляет необходимый API для кросс-доменной синхронизации :(</p>';
  } else {
    unifiedStorageCheckbox.addEventListener("change", () => {
      if (unifiedStorageCheckbox.checked) {
        const confirmation = confirm(
          "Вы уверены, что хотите включить единое хранилище?\n\n" +
            "Все ваши текущие настройки и данные с этого сайта будут скопированы в общее хранилище и заменят любые данные, которые могли там быть.\n\n" +
            "Убедитесь, что вы находитесь на сайте (.net или .su) с теми настройками и данными, которые хотите сделать основными."
        );

        if (confirmation) {
          settings.unifiedStorage = true;
          uwuStorage.migrateAllToGM();
          GM_setValue("uwu_settings", JSON.stringify(settings));
          alert(
            "Единое хранилище включено. Настройки и данные с этого сайта были скопированы. Страница будет перезагружена."
          );
          location.reload();
        } else {
          unifiedStorageCheckbox.checked = false;
        }
      } else {
        const confirmation = confirm(
          "Вы уверены, что хотите отключить единое хранилище?\n\n" +
            "Текущие настройки и данные из единого хранилища скопируются в локальное для этого сайта.\n\n" +
            "Скрипт снова будет использовать отдельное хранилище для этого домена (localStorage)."
        );

        if (confirmation) {
          const keysToProcess = GM_listValues();
          keysToProcess.forEach((key) => {
            if (key.startsWith("uwu_")) {
              const value = GM_getValue(key);
              localStorage.setItem(key, value);
            }
          });

          settings.unifiedStorage = false;

          GM_setValue("uwu_settings", JSON.stringify(settings));
          localStorage.setItem("uwu_settings", JSON.stringify(settings));

          alert(
            "Единое хранилище отключено. Ваши настройки и данные были скопированы в локальное хранилище для этого сайта. Страница будет перезагружена."
          );
          location.reload();
        } else {
          unifiedStorageCheckbox.checked = true;
        }
      }
    });
  }

  // ====================================================================================================================
  //  . . . ВЗАИМОИСКЛЮЧАЮЩИЕСЯ ЧЕКБОКСЫ . . .
  // ====================================================================================================================
  const exclusiveCheckboxGroups = [
    ["backgroundRepeat", "backgroundUser"],
    ["parametersBackgroundImage", "parametersUserBackgroundImage"],
  ];

  document
    .querySelectorAll("#uwusettings [data-setting]")
    .forEach((element) => {
      const setting = element.dataset.setting;
      element.addEventListener("change", () => {
        if (element.type === "checkbox") {
          const group = exclusiveCheckboxGroups.find((g) =>
            g.includes(setting)
          );
          if (group) {
            group.forEach((s) => {
              if (s !== setting) {
                settings[s] = false;
                document.querySelector(
                  `#uwusettings [data-setting="${s}"]`
                ).checked = false;
              }
            });
          }
          settings[setting] = element.checked;
        } else {
          settings[setting] = element.value;
        }
        saveSettings();
      });
    });

  // ====================================================================================================================
  //  . . . НАСТРОЙКИ ЛОГА ЛОВЛИ - СВОИ НАЗВАНИЯ ПРЕДМЕТОВ . . .
  // ====================================================================================================================
  function setupCatchingLogCustomItems() {
    const textarea = document.getElementById("catching-log-custom-items");
    const saveBtn = document.getElementById("save-custom-items-btn");
    const exportField = document.getElementById("custom-items-export-field");
    const importField = document.getElementById("custom-items-import-field");
    const importBtn = document.getElementById("custom-items-import-btn");

    if (!textarea || !saveBtn || !exportField || !importField || !importBtn)
      return;

    function parseTextareaToObject(text) {
      const lines = text.split("\n");
      const obj = {};
      lines.forEach((line) => {
        if (line.includes("=")) {
          const parts = line.split("=");
          const id = parts[0].trim();
          const name = parts.slice(1).join("=").trim();
          if (id && name) {
            obj[id] = name;
          }
        }
      });
      return obj;
    }

    function objectToTextarea(obj) {
      return Object.entries(obj)
        .map(([id, name]) => `${id}=${name}`)
        .join("\n");
    }

    function loadAndDisplay() {
      const customItems =
        uwuStorage.getItem("uwu_catchingLog_customItems") || {};
      textarea.value = objectToTextarea(customItems);
      exportField.value = JSON.stringify(customItems);
    }

    saveBtn.addEventListener("click", () => {
      const customItemsObject = parseTextareaToObject(textarea.value);
      uwuStorage.setItem("uwu_catchingLog_customItems", customItemsObject);
      alert("Список названий сохранён!");
      loadAndDisplay();
    });

    importBtn.addEventListener("click", () => {
      const jsonString = importField.value;
      if (!jsonString.trim()) {
        alert("Поле для импорта пустое.");
        return;
      }
      try {
        const importedItems = JSON.parse(jsonString);
        if (typeof importedItems !== "object" || importedItems === null) {
          throw new Error("Неверный формат данных.");
        }
        uwuStorage.setItem("uwu_catchingLog_customItems", importedItems);
        alert("Список названий успешно импортирован!");
        importField.value = "";
        loadAndDisplay();
      } catch (error) {
        alert(
          "Ошибка! Не удалось импортировать список. Проверьте корректность вставленных данных."
        );
        console.error("UwU | Ошибка импорта названий предметов:", error);
      }
    });

    exportField.addEventListener("click", function () {
      this.select();
    });

    loadAndDisplay();
  }

  setupCatchingLogCustomItems();
  // ====================================================================================================================
  //  . . . СОЗДАНИЕ ВЫПАДАЮЩИХ СПИСКОВ . . .
  // ====================================================================================================================
  loadSettings();
  // Звуки звуки звуки, вуху.
  const notificationSounds = soundManager.getSoundList();

  const customSelectsConfig = [
    { id: "climbingRefreshNotificationSound", options: notificationSounds },
    { id: "myNameNotificationSound", options: notificationSounds },
    { id: "notificationPMSound", options: notificationSounds },
    { id: "notificationActionEndSound", options: notificationSounds },
    { id: "notificationInMouthSound", options: notificationSounds },
    { id: "notificationInFightModeSound", options: notificationSounds },
    { id: "notificationBlockSound", options: notificationSounds },
    { id: "intervalTimerSound", options: notificationSounds },
    {
      id: "weatherParticlesAmount",
      options: [
        { id: "normal", name: "Много частиц (Стандарт)" },
        { id: "low", name: "Мало частиц (Производительность)" },
      ]
    },
    {
      id: "auroraPos",
      options: [
        { id: "1", name: "Сверху" },
        { id: "2", name: "Снизу" },
      ]
    },
    {
      id: "weatherZIndex",
      options: [
        { id: "-1", name: "За блоками" },
        { id: "0", name: "Стандарт" },
        { id: "1", name: "Перед блоками" },
      ]
    },
    {
      id: "climbingPanelOrientation",
      options: [
        { id: "vertical", name: "Вертикальный" },
        { id: "horizontal", name: "Горизонтальный" },
      ]
    },
    {
      id: "clockStyle",
      options: [
        { id: "compact", name: "Компактный" },
        { id: "standard", name: "Стандартный" },
        { id: "string", name: "Строчный" },
      ]
    },
    {
      id: "clockPosition",
      options: [
        { id: "fly", name: "Свободно" },
        { id: "tos", name: "В блоке погоды" },
      ]
    },
    {
      id: "highlightResourcesStyle",
      options: [
        { id: "background", name: "Фон / Быстро" },
        { id: "glow", name: "Свечение / Медленно" },
      ]
    },
    {
      id: "cleaningLogStyle",
      options: [
        { id: "smart", name: "Умный" },
      ]
    },
    {
      id: "defectsStyle",
      options: [
        { id: "default", name: "Стандартный" }
      ]
    },
    {
      id: "defectsQuality",
      options: [
        { id: "low", name: "Низкое/Старое (100x150)" },
        { id: "high", name: "Высокое/Новое (200x300)" },
      ]
    },
    {
      id: "climbingPanelInputsStyle",
      options: [
        { id: "keyboard", name: "Клавиатура" },
        { id: "standart", name: "Галочки + Клавиатура" },
      ]
    }
  ];

  customSelectsConfig.forEach(config => createCustomSelect(config.id, config.options));
  // ====================================================================================================================
  //   . . . СОЗДАНИЕ ВЫПАДАЮЩИХ СПИСКОВ . . .
  // ====================================================================================================================
  function createCustomSelect(selectId, options) {
    const selectContainer = document.getElementById(selectId);
    const selectedElement = selectContainer.querySelector(".select-selected");
    const optionsContainer = selectContainer.querySelector(".select-items");

    if (settings && settings[selectId] !== undefined) {
      const selectedOption = options.find(
        (option) => option.id === settings[selectId]
      );
      if (selectedOption) {
        selectedElement.textContent = selectedOption.name;
      }
    }

    options.forEach((option, index) => {
      const optionElement = document.createElement("div");
      optionElement.textContent = option.name;
      optionElement.dataset.id = option.id;

      optionElement.addEventListener("click", () => {
        selectedElement.textContent = option.name;
        settings[selectId] = option.id;
        saveSettings();
        selectContainer.classList.remove("active");
      });

      optionsContainer.appendChild(optionElement);
    });

    selectedElement.addEventListener("click", () => {
      selectContainer.classList.toggle("active");
    });
  }

  // ====================================================================================================================
  //  . . . ПОЛЬЗОВАТЕЛЬСКИЕ ЗВУКИ . . .
  // ====================================================================================================================
  const customSoundsListEl = document.getElementById("custom-sounds-list");
  const addCustomSoundBtn = document.getElementById("add-custom-sound-btn");

  /**
   * Renders the list of custom sounds in the UI.
   */
  function renderCustomSoundsList() {
    if (!customSoundsListEl) return;
    customSoundsListEl.innerHTML = "";
    
    const sounds = uwuStorage.getItem("uwu_customSounds") || [];
    if (sounds.length === 0) {
      customSoundsListEl.innerHTML = "<p style='opacity: 0.5; text-align: center; margin: 0;'>Нет добавленных звуков.</p>";
      return;
    }

    sounds.forEach(sound => {
      const itemEl = document.createElement("div");
      itemEl.style.cssText = "display: flex; justify-content: space-between; align-items: center; padding: 8px; background: rgba(255,255,255,0.05); border-radius: 5px; border: 1px solid rgba(255,255,255,0.1);";
      
      const meta = document.createElement("div");
      meta.style.cssText = "display:flex; flex-direction: column; overflow: hidden; margin-right: 10px; flex: 1;";

      const nameEl = document.createElement("span");
      nameEl.style.cssText = "font-weight: bold; font-size: 14px;";
      nameEl.textContent = sound.name;

      const urlEl = document.createElement("span");
      urlEl.style.cssText = "font-size: 11px; opacity: 0.6; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;";
      urlEl.textContent = sound.url;

      const actions = document.createElement("div");
      actions.style.cssText = "display:flex; gap: 5px; flex-shrink: 0;";

      const playBtn = document.createElement("button");
      playBtn.className = "uwu-button install-button play-custom-sound";
      playBtn.dataset.id = sound.id;
      playBtn.title = "Прослушать";
      playBtn.style.cssText = "margin:0; padding: 4px 10px;";
      playBtn.textContent = "▶";

      const deleteBtn = document.createElement("button");
      deleteBtn.className = "uwu-button remove-button delete-custom-sound";
      deleteBtn.dataset.id = sound.id;
      deleteBtn.title = "Удалить";
      deleteBtn.style.cssText = "margin:0; padding: 4px 10px;";
      deleteBtn.textContent = "✖";

      meta.append(nameEl, urlEl);
      actions.append(playBtn, deleteBtn);
      itemEl.append(meta, actions);
      
      customSoundsListEl.appendChild(itemEl);
    });

    customSoundsListEl.querySelectorAll(".play-custom-sound").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        soundManager.playSound(btn.dataset.id, 5); 
      });
    });

    customSoundsListEl.querySelectorAll(".delete-custom-sound").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        deleteCustomSound(e.currentTarget.dataset.id);
      });
    });
  }

  /**
   * Rebuilds all sound-related custom select dropdowns dynamically.
   */
  function updateAllSoundSelects() {
    const soundSelectIds = [
      "climbingRefreshNotificationSound",
      "myNameNotificationSound",
      "notificationPMSound",
      "notificationActionEndSound",
      "notificationInMouthSound",
      "notificationInFightModeSound",
      "notificationBlockSound",
      "intervalTimerSound"
    ];
    
    const currentSounds = soundManager.getSoundList();

    soundSelectIds.forEach(selectId => {
      const selectContainer = document.getElementById(selectId);
      if (!selectContainer) return;
      
      const optionsContainer = selectContainer.querySelector(".select-items");
      const selectedElement = selectContainer.querySelector(".select-selected");
      if (!optionsContainer || !selectedElement) return;

      optionsContainer.innerHTML = "";
      let foundCurrent = false;

      currentSounds.forEach(option => {
        const optionElement = document.createElement("div");
        optionElement.textContent = option.name;
        optionElement.dataset.id = option.id;

        if (option.id === settings[selectId]) {
          foundCurrent = true;
          selectedElement.textContent = option.name;
        }

        optionElement.addEventListener("click", () => {
          selectedElement.textContent = option.name;
          settings[selectId] = option.id;
          saveSettings();
          selectContainer.classList.remove("active");
        });

        optionsContainer.appendChild(optionElement);
      });

      if (!foundCurrent && currentSounds.length > 0) {
        settings[selectId] = currentSounds[0].id;
        saveSettings();
        selectedElement.textContent = currentSounds[0].name;
      }
    });
  }

  /**
   * Adds a new custom sound from input fields.
   */
  if (addCustomSoundBtn) {
    addCustomSoundBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const nameInput = document.getElementById("custom-sound-name");
      const urlInput = document.getElementById("custom-sound-url");
      const name = nameInput.value.trim();
      const url = urlInput.value.trim();

      if (!name || !url) {
        alert("Пожалуйста, заполните оба поля (Название и URL).");
        return;
      }

      const id = "customSound_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7);
      const newSound = { id, name, url };

      const sounds = uwuStorage.getItem("uwu_customSounds") || [];
      sounds.push(newSound);
      uwuStorage.setItem("uwu_customSounds", sounds);

      soundManager.registerSound(id, name, url, true);
      
      nameInput.value = "";
      urlInput.value = "";

      renderCustomSoundsList();
      updateAllSoundSelects();
    });
  }

  /**
   * Deletes a custom sound by ID.
   */
  function deleteCustomSound(id) {
    if (!confirm("Вы уверены, что хотите удалить этот звук?")) return;

    let sounds = uwuStorage.getItem("uwu_customSounds") || [];
    sounds = sounds.filter(s => s.id !== id);
    uwuStorage.setItem("uwu_customSounds", sounds);

    soundManager.unregisterSound(id);
    renderCustomSoundsList();
    updateAllSoundSelects();
  }

  renderCustomSoundsList();

  // ====================================================================================================================
  //   . . . КНОПКА ТЕСТА ЗВУКОВ . . .
  // ====================================================================================================================
  function addSoundTestButton(
    containerId,
    settingsKeyForSound,
    settingsKeyForVolume
  ) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Контейнер с ID ${containerId} не найден.`);
      return;
    }

    const testButton = document.createElement("button");
    testButton.textContent = "Тест звука";
    testButton.addEventListener("click", () => {
      const selectedSoundId = settings[settingsKeyForSound];
      const volume = settings[settingsKeyForVolume] || 5;
      if (selectedSoundId) {
        soundManager.playSound(selectedSoundId, volume);
      } else {
        console.error(
          `Выбранный звук для контейнера ${containerId} не найден.`
        );
      }
    });

    container.appendChild(testButton);
  }

  [
    ["notificationPMContainer", "notificationPMSound", "notificationPMVolume"],
    ["notificationActionEndContainer", "notificationActionEndSound", "notificationActionEndVolume"],
    ["notificationInMouthContainer", "notificationInMouthSound", "notificationInMouthVolume"],
    ["notificationInFightModeContainer", "notificationInFightModeSound", "notificationInFightModeVolume"],
    ["climbingRefreshNotificationSoundContainer", "climbingRefreshNotificationSound", "climbingRefreshNotificationVolume"],
    ["myNameNotificationSoundContainer", "myNameNotificationSound", "notificationMyNameVolume"],
    ["notificationBlockContainer", "notificationBlockSound", "notificationBlockVolume"],
    ["intervalTimerContainer", "intervalTimerSound", "intervalTimerVolume"]
  ].forEach(args => addSoundTestButton(...args));
  // ====================================================================================================================
  //  . . . СБРОС ПОЗИЦИИ ЧАСИКОВ . . .
  // ====================================================================================================================
  document
    .getElementById("resetClockPosition")
    .addEventListener("click", () => {
      const defaultPosition = { x: 10, y: 10 };
      uwuStorage.setItem("uwu_clock", defaultPosition);
    });
  // ====================================================================================================================
  //  . . . ИМПОРТ / ЭКСПОРТ ВСЕХ НАСТРОЕК . . .
  // ====================================================================================================================
  const settingsAllKeys = [
    "uwu_settings",
    "uwu_version",
    "uwu_layoutSettings",
    "uwu_climbingPanelState",
    "uwu_moduleStates",
    "uwu_fightPanelPosition",
    "uwu_climbingPanelStatus",
    "uwu_privateModules",
    "uwu_colorThemes",
    "uwu_currentTheme",
    "uwu_fontSize",
    "uwu_clock",
    "uwu_templates",
    "uwu_highlightResources",
    "uwu_saved_ls",
    "uwu_activity",
    "uwu_fastStyles",
    "uwu_fightTeamsCats",
    "uwu_mightHistory",
    "uwu_customSounds",
  ];

  const importButton = document.getElementById("importSettingsButton");
  const importSettingsInput = document.getElementById("importSettings");
  const exportSettingsInput = document.getElementById("exportSettings");

  importButton.addEventListener("click", () => {
    const importedSettings = importSettingsInput.value;

    try {
      const parsedSettings = JSON.parse(importedSettings);
      settingsAllKeys.forEach((key) => {
        if (parsedSettings[key] !== undefined) {
          uwuStorage.setItem(key, parsedSettings[key]);
        }
      });
      console.log("Настройки импортированы:", parsedSettings);
    } catch (error) {
      console.error("Ошибка при импорте настроек:", error);
    }
    updateExportField();
  });

  function updateExportField() {
    const settingsObject = getSpecificLocalStorageItems();
    const settingsToExport = JSON.stringify(settingsObject, null, 2);
    exportSettingsInput.value = settingsToExport;
  }

  function getSpecificLocalStorageItems() {
    const items = {};
    settingsAllKeys.forEach((key) => {
      const value = uwuStorage.getItem(key);
      if (value !== null) {
        items[key] = value;
      }
    });
    return items;
  }

  loadSettings();
  updateExportField();
  // ====================================================================================================================
  //  . . . РЕДИЗАЙН НАСТРОЕК КОСТЮМОВ . . .
  // ====================================================================================================================
  if (settings.redesignCostumsSettings) {
    function addStyles() {
      const style = document.createElement("style");
      style.innerHTML =
        // css
        `
        .list-group-item {
            display: grid !important;
            grid-template-columns: auto 1fr;
            grid-template-rows: auto auto;
            align-items: center;
            margin-bottom: 10px;
            width: 280px !important;
        }
        .list-group-item img {
            margin-right: 10px;
            width: 50px;
            height: 80px;
        }
        .costume-image-container {
            grid-column: 1;
            grid-row: 1 / span 2;
            margin-right: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .list-group {
          resize: vertical;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
        }
        .list-group-item span {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
        .costume-id {
            font-weight: bold;
            margin-bottom: 5px;
            grid-column: 2;
            grid-row: 1;
        }
        .costume-text {
            grid-column: 2;
            grid-row: 2;
        }

        .col-3 {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
        }

        .col-3 > button {
          height: 22px;
        }
    `;
      document.head.appendChild(style);
    }

    function addCostumePreview() {
      const items = document.querySelectorAll(".list-group-item");
      items.forEach((item) => {
        const costumeId = item.textContent.trim().split(" ")[0];
        const imageContainer = item.querySelector(".costume-image-container");
        const img = imageContainer ? imageContainer.querySelector("img") : null;

        if (
          !imageContainer ||
          !img ||
          img.getAttribute("data-costume-id") !== costumeId
        ) {
          const imgUrl = `https://catwar.net/cw3/cats/0/costume/${costumeId}.png`;

          if (!imageContainer) {
            const newImageContainer = document.createElement("div");
            newImageContainer.classList.add("costume-image-container");

            const newImg = document.createElement("img");
            newImg.src = imgUrl;
            newImg.alt = `Costume ${costumeId}`;
            newImg.setAttribute("data-costume-id", costumeId);

            newImageContainer.appendChild(newImg);

            item.insertBefore(newImageContainer, item.firstChild);
          } else {
            img.src = imgUrl;
            img.setAttribute("data-costume-id", costumeId);
          }
        }
      });
    }

    addStyles();
    setupMutationObserver(".double-container", addCostumePreview, {
      childList: true,
      subtree: true,
    });
  }
  // ====================================================================================================================
  //  . . . МАКЕТ КАСТОМИЗАЦИИ ИГРОВОЙ . . .
  // ====================================================================================================================
  const blockNames = {
    tr_info: "Информация",
    tr_tos: "Погода",
    tr_chat: "Чат",
    tr_actions: "Действия",
    tr_mouth: "Во рту",
    // 'tr_sky': 'Небо',
  };
  const leftColumn = document.querySelector("#layout-customizer .column.left");
  const rightColumn = document.querySelector(
    "#layout-customizer .column.right"
  );

  function saveLayoutSettings() {
    const leftBlocks = Array.from(leftColumn.querySelectorAll(".block")).map(
      (block) => block.classList[1]
    );
    const rightBlocks = Array.from(rightColumn.querySelectorAll(".block")).map(
      (block) => block.classList[1]
    );

    const layoutSettings = {
      leftBlocks,
      rightBlocks,
    };

    uwuStorage.setItem("uwu_layoutSettings", layoutSettings);
  }

  function createBlockElement(blockId) {
    const blockElement = document.createElement("div");
    blockElement.classList.add("block", blockId);

    const blockName = document.createElement("span");
    blockName.textContent = blockNames[blockId];
    blockElement.appendChild(blockName);

    const controlsWrapper = document.createElement("div");
    controlsWrapper.classList.add("controls");

    if (blockId === "tr_info") {
      const moveInfoButton = document.createElement("button");
      moveInfoButton.textContent = "⏪Переместить⏩";
      moveInfoButton.classList.add("move-info", "install-button");
      moveInfoButton.addEventListener("click", () => {
        swapColumns(blockElement);
        saveLayoutSettings();
      });
      controlsWrapper.appendChild(moveInfoButton);
    } else {
      const moveUpButton = document.createElement("button");
      moveUpButton.textContent = "🔼Вверх";
      moveUpButton.classList.add("move-up", "install-button");
      moveUpButton.addEventListener("click", () => {
        const previousBlock = blockElement.previousElementSibling;
        if (previousBlock) {
          blockElement.parentNode.insertBefore(blockElement, previousBlock);
          saveLayoutSettings();
        }
      });
      controlsWrapper.appendChild(moveUpButton);

      const moveDownButton = document.createElement("button");
      moveDownButton.textContent = "🔽Вниз";
      moveDownButton.classList.add("move-down", "install-button");
      moveDownButton.addEventListener("click", () => {
        const nextBlock = blockElement.nextElementSibling;
        if (nextBlock) {
          blockElement.parentNode.insertBefore(nextBlock, blockElement);
          saveLayoutSettings();
        }
      });
      controlsWrapper.appendChild(moveDownButton);
    }

    blockElement.appendChild(controlsWrapper);
    return blockElement;
  }

  function swapColumns(blockElement) {
    if (blockElement.parentNode === leftColumn) {
      const rightColumnBlocks = Array.from(rightColumn.children);
      rightColumn.innerHTML = "";
      rightColumn.appendChild(blockElement);
      rightColumnBlocks.forEach((block) => leftColumn.appendChild(block));
    } else {
      const leftColumnBlocks = Array.from(leftColumn.children);
      leftColumn.innerHTML = "";
      leftColumn.appendChild(blockElement);
      leftColumnBlocks.forEach((block) => rightColumn.appendChild(block));
    }
    saveLayoutSettings();
  }

  const resetLayoutButton = document.getElementById("reset-layout-button");
  resetLayoutButton.addEventListener("click", () => {
    const confirmReset = confirm(
      "Вы уверены, что хотите сбросить расположение блоков?"
    );
    if (confirmReset) {
      const defaultSettings = getDefaultLayoutSettings();
      uwuStorage.setItem("uwu_layoutSettings", defaultSettings);
      location.reload();
    }
  });

  function getDefaultLayoutSettings() {
    return {
      leftBlocks: ["tr_info"],
      rightBlocks: ["tr_tos", "tr_chat", "tr_actions", "tr_mouth"],
    };
  }

  function loadLayoutSettings() {
    try {
      const savedSettings = uwuStorage.getItem("uwu_layoutSettings");
      if (savedSettings) {
        const { leftBlocks, rightBlocks } = savedSettings;

        leftColumn.innerHTML = "";
        rightColumn.innerHTML = "";

        leftBlocks.forEach((blockId) => {
          const blockElement = createBlockElement(blockId);
          leftColumn.appendChild(blockElement);
        });

        rightBlocks.forEach((blockId) => {
          const blockElement = createBlockElement(blockId);
          rightColumn.appendChild(blockElement);
        });
      } else {
        const defaultSettings = getDefaultLayoutSettings();
        uwuStorage.setItem("uwu_layoutSettings", defaultSettings);

        defaultSettings.leftBlocks.forEach((blockId) => {
          leftColumn.appendChild(createBlockElement(blockId));
        });

        defaultSettings.rightBlocks.forEach((blockId) => {
          rightColumn.appendChild(createBlockElement(blockId));
        });
      }
    } catch (error) {
      console.error("Ошибка при загрузке настроек макета:", error);
    }
  }

  loadLayoutSettings();
  // ====================================================================================================================
  //  . . . РЕДАКТОР ВКЛАДОК И ТАБЛИЦ МИННОГО ПОЛЯ . . .
  // ====================================================================================================================
  // как же я ненавижу минное поле как же я ненавижу минное поле как же я ненавижу минное поле
  const tabManager = {
    tabs: [],
    currentTabIndex: 0,

    createTab(name) {
      const newTab = {
        name: name,
        tables: [],
        currentTableId: 0,
      };

      this.tabs.push(newTab);
      this.render();
      this.switchTab(this.tabs.length - 1);
    },

    createTable(
      tableName = `Локация ${this.tabs[this.currentTabIndex].tables.length + 1}`
    ) {
      const currentTab = this.tabs[this.currentTabIndex];
      currentTab.tables.push({ name: tableName });
      this.saveState();
      this.render();
    },

    removeTable(tableIndex) {
      const currentTab = this.tabs[this.currentTabIndex];
      if (currentTab && currentTab.tables[tableIndex]) {
        currentTab.tables.splice(tableIndex, 1);
        if (currentTab.currentTableId === tableIndex) {
          currentTab.currentTableId = Math.max(
            0,
            currentTab.currentTableId - 1
          );
        }
        this.saveState();
        this.render();
      }
    },

    removeTab(index) {
      this.tabs.splice(index, 1);
      if (index === this.currentTabIndex) {
        this.currentTabIndex = Math.max(0, this.currentTabIndex - 1);
      }
      this.saveState();
      this.render();
    },

    switchTab(index) {
      this.currentTabIndex = index;
      this.render();
    },

    switchTable(tableIndex) {
      const currentTab = this.tabs[this.currentTabIndex];
      if (currentTab) {
        currentTab.currentTableId = tableIndex;
        this.saveState();
        this.render();
      }
    },

    renameTab(index) {
      const newName = prompt(
        "Введите новое имя вкладки:",
        this.tabs[index].name
      );
      if (newName) {
        this.tabs[index].name = newName;
        this.saveState();
        this.render();
      }
    },

    renameTable(tableIndex) {
      const currentTab = this.tabs[this.currentTabIndex];
      if (currentTab) {
        const newName = prompt(
          "Введите новое имя поля:",
          currentTab.tables[tableIndex].name
        );
        if (newName) {
          currentTab.tables[tableIndex].name = newName;
          this.saveState();
          this.render();
        }
      }
    },

    saveState() {
      uwuStorage.setItem("uwu_climbingPanelState", this);
    },

    render() {
      this.renderTabs();
      this.renderTables();
    },

    renderTabs() {
      const tabRow = document.getElementById("uwu-buttonRow1-settings");
      tabRow.innerHTML = "";

      this.tabs.forEach((tab, index) => {
        const tabButton = document.createElement("button");
        tabButton.textContent = tab.name;
        tabButton.classList.add("tab-button");

        if (index === this.currentTabIndex) {
          tabButton.classList.add("active");
        }

        tabButton.addEventListener("click", () => this.switchTab(index));

        const removeButton = document.createElement("button");
        removeButton.textContent = "X";
        removeButton.classList.add("remove-button");

        removeButton.addEventListener("click", () => this.removeTab(index));

        const renameButton = document.createElement("button");
        renameButton.textContent = "✎";
        renameButton.classList.add("rename-button");

        renameButton.addEventListener("click", () => this.renameTab(index));

        const tabContainer = document.createElement("div");
        tabContainer.classList.add("tab-container");
        tabContainer.appendChild(tabButton);
        tabContainer.appendChild(renameButton);
        tabContainer.appendChild(removeButton);

        tabRow.appendChild(tabContainer);
      });

      const addTabButton = document.createElement("button");
      addTabButton.textContent = "+";
      addTabButton.classList.add("add-button");
      addTabButton.addEventListener("click", () => {
        const tabName = prompt("Введите имя вкладки:");
        if (tabName) {
          this.createTab(tabName);
        }
      });
      tabRow.appendChild(addTabButton);
    },

    renderTables() {
      const tableRow = document.getElementById("uwu-buttonRow2-settings");
      tableRow.innerHTML = "";

      const currentTab = this.tabs[this.currentTabIndex];

      if (currentTab) {
        currentTab.tables.forEach((table, index) => {
          const tableButton = document.createElement("button");
          tableButton.textContent = table.name;
          tableButton.classList.add("table-button");

          tableButton.addEventListener("click", () => this.switchTable(index));

          const removeButton = document.createElement("button");
          removeButton.textContent = "X";
          removeButton.classList.add("remove-button");

          removeButton.addEventListener("click", () => this.removeTable(index));

          const renameButton = document.createElement("button");
          renameButton.textContent = "✎";
          renameButton.classList.add("rename-button");

          renameButton.addEventListener("click", () => this.renameTable(index));

          const tableContainer = document.createElement("div");
          tableContainer.classList.add("table-container");
          tableContainer.appendChild(tableButton);
          tableContainer.appendChild(renameButton);
          tableContainer.appendChild(removeButton);

          tableRow.appendChild(tableContainer);
        });

        const addTableButton = document.createElement("button");
        addTableButton.textContent = "+";
        addTableButton.classList.add("add-button");

        addTableButton.addEventListener("click", () => {
          const tableName = prompt("Введите имя поля:");
          if (tableName) {
            this.createTable(tableName);
          }
        });

        tableRow.appendChild(addTableButton);
      }
    },
  };

  const savedState = uwuStorage.getItem("uwu_climbingPanelState");
  if (!savedState) {
    tabManager.createTab("Вкладка 1");
    for (let i = 0; i < 5; i++) {
      tabManager.createTable(`Поле ${i + 1}`);
    }

    tabManager.createTab("Вкладка 2");
    for (let i = 0; i < 5; i++) {
      tabManager.createTable(`Поле ${i + 1}`);
    }

    tabManager.saveState();
  } else {
    const state = savedState;
    Object.assign(tabManager, state);
  }

  tabManager.render();

  /**
   * Добавляет функционал автоматического выделения текста при клике на поля для экспорта.
   */
  function setupExportFieldSelection() {
    const exportFields = document.querySelectorAll(
      "#exportSettings, #param-colors-export-field, #ls-export-field"
    );

    exportFields.forEach((field) => {
      field.addEventListener("click", function () {
        this.select();
      });
    });
  }

  setupExportFieldSelection();
}
// ====================================================================================================================
//  . . . ВКЛАДКИ ГЛАВНЫХ НАСТРОЕК . . .
// ====================================================================================================================
if (targetSettings.test(window.location.href)) {
  const buttonContainer = document.getElementById("button-container");

  buttonContainer.addEventListener("click", (event) => {
    const clickedElement = event.target;
    const clickedButton = clickedElement.closest("button");
    if (!clickedButton) return;

    const panelId = clickedButton.id.replace("button", "panel");
    const targetPanel = document.getElementById(panelId);

    buttonContainer.querySelectorAll("button").forEach((button) => {
      const correspondingPanelId = button.id.replace("button", "panel");
      const correspondingPanel = document.getElementById(correspondingPanelId);

      correspondingPanel.style.display =
        correspondingPanel === targetPanel ? "block" : "none";
      button.classList.toggle("active", button === clickedButton);
    });
  });

  const defaultButton = buttonContainer.querySelector("button");
  const defaultPanelId = defaultButton.id.replace("button", "panel");
  const defaultPanel = document.getElementById(defaultPanelId);

  buttonContainer.querySelectorAll("button").forEach((button) => {
    const correspondingPanelId = button.id.replace("button", "panel");
    const correspondingPanel = document.getElementById(correspondingPanelId);

    if (correspondingPanel !== defaultPanel) {
      correspondingPanel.style.display = "none";
    }
  });

  defaultPanel.style.display = "block";
  defaultButton.classList.add("active");
}
// ====================================================================================================================
//  . . . ОНЛАЙН МАГАЗИН СТИЛЕЙ . . .
// ====================================================================================================================
// буду вечно задаваться вопросом, а зачем я это вообще сделал..................
const moduleStates = {};
const defaultModules = [
  // "style.css",
  // ...
];
const privateModules = {};

function loadModuleStates() {
  const storedModuleStates = uwuStorage.getItem("uwu_moduleStates");
  if (storedModuleStates) {
    Object.assign(moduleStates, storedModuleStates);
  } else {
    for (const moduleName of defaultModules) {
      moduleStates[moduleName] = true;
    }
  }

  const storedPrivateModules = uwuStorage.getItem("uwu_privateModules");
  if (storedPrivateModules) {
    Object.assign(privateModules, storedPrivateModules);
  }
}

async function loadModuleListOnSettings() {
  const url =
    "https://raw.githubusercontent.com/Ibirtem/CatWar/main/modules/modules.txt";

  const targetSettings = /^https:\/\/catwar\.net\/settings/;
  if (!targetSettings.test(window.location.href)) {
    return;
  }

  try {
    const response = await fetch(url);
    const moduleList = await response.text();
    const modules = moduleList.split("\n").filter((line) => line.trim() !== "");

    const moduleInfoContainer = document.getElementById("module-info");

    if (!moduleInfoContainer) {
      console.error("Контейнер модулей не найден!");
      return;
    }

    for (const moduleInfo of modules) {
      const [moduleName, description, version] = moduleInfo.split("|");
      const isOnlineModule = !uwuStorage.getItem(moduleName);
      const moduleContainer = createModuleContainer(
        moduleName,
        description,
        version,
        isOnlineModule
      );
      moduleInfoContainer.appendChild(moduleContainer);

      if (moduleStates[moduleName]) {
        loadModule(moduleName, description, version);
      }
    }

    for (const [moduleName, moduleInfo] of Object.entries(privateModules)) {
      const { description, version } = moduleInfo;
      const isPrivateModule = true;
      const moduleContainer = createModuleContainer(
        moduleName,
        description,
        version,
        false,
        isPrivateModule
      );
      moduleInfoContainer.appendChild(moduleContainer);

      if (moduleStates[moduleName]) {
        loadModule(moduleName, description, version);
      }
    }
  } catch (error) {
    console.error("Ошибка при загрузке списка модулей:", error);
  }
}

async function activateModules() {
  const url =
    "https://raw.githubusercontent.com/Ibirtem/CatWar/main/modules/modules.txt";

  try {
    const response = await fetch(url);
    const moduleList = await response.text();
    const modules = moduleList.split("\n").filter((line) => line.trim() !== "");

    for (const moduleInfo of modules) {
      const [moduleName, description, version] = moduleInfo.split("|");
      const isOnlineModule = !uwuStorage.getItem(moduleName);

      if (moduleStates[moduleName]) {
        loadModule(moduleName, description, version);
      }
    }

    for (const [moduleName, moduleInfo] of Object.entries(privateModules)) {
      const { description, version } = moduleInfo;

      if (moduleStates[moduleName]) {
        loadModule(moduleName, description, version);
      }
    }
  } catch (error) {
    console.error("Ошибка при активации модулей:", error);
  }
}

function createModuleContainer(
  moduleName,
  description,
  version,
  isOnlineModule = false,
  isPrivateModule = false
) {
  const moduleContainer = document.createElement("div");
  moduleContainer.classList.add("module-container");

  const moduleInfo = document.createElement("div");
  moduleInfo.classList.add("module-info");
  moduleInfo.textContent = `${description}`;

  const modulePanel = document.createElement("div");
  modulePanel.classList.add("module-panel");

  const versionInfo = document.createElement("span");
  versionInfo.textContent = `Версия: ${version}`;
  modulePanel.appendChild(versionInfo);

  if (isOnlineModule) {
    const installButton = document.createElement("button");
    installButton.textContent = "Установить";
    installButton.classList.add("install-button");
    installButton.addEventListener("click", () => {
      loadModule(moduleName, description, version);
      moduleContainer.remove();
      createModuleContainer(
        moduleName,
        description,
        version,
        false,
        isPrivateModule
      );
    });
    modulePanel.appendChild(installButton);
  } else {
    const checkboxContainer = document.createElement("div");
    checkboxContainer.classList.add("checkbox-container");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = moduleName;
    checkbox.checked = moduleStates[moduleName] || false;
    checkboxContainer.appendChild(checkbox);

    const removeButton = document.createElement("button");
    removeButton.textContent = "Удалить";
    removeButton.classList.add("remove-button");
    removeButton.addEventListener("click", () => {
      unloadModule(moduleName);
      moduleContainer.remove();
    });
    modulePanel.appendChild(removeButton);

    checkbox.addEventListener("change", () => {
      moduleStates[moduleName] = checkbox.checked;
      uwuStorage.setItem("uwu_moduleStates", moduleStates);

      if (checkbox.checked) {
        loadModule(moduleName, description, version);
      }
    });

    moduleInfo.appendChild(checkboxContainer);
  }

  moduleContainer.appendChild(moduleInfo);
  moduleContainer.appendChild(modulePanel);

  return moduleContainer;
}

async function loadModule(moduleName, description, version) {
  const cachedModule = uwuStorage.getItem(moduleName);

  if (cachedModule) {
    activateModule(cachedModule, moduleName, description, version);
  } else {
    const url = `https://raw.githubusercontent.com/Ibirtem/CatWar/main/modules/${moduleName}`;
    try {
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.text();
        uwuStorage.setItem(moduleName, data);
        activateModule(data, moduleName, description, version);

        moduleStates[moduleName] = true;
        uwuStorage.setItem("uwu_moduleStates", moduleStates);

        createModuleContainer(moduleName, description, version, false);

        loadModuleStates();
        clearModuleInfoContainer();
        loadModuleListOnSettings();
      } else {
        console.error(
          `Ошибка при загрузке модуля "${moduleName}": ${response.status} ${response.statusText}`
        );
      }
    } catch (error) {
      console.error("Ошибка при загрузке модуля:", error);
    }
  }
}

function addStyle(css) {
  const style = document.createElement("style");
  style.appendChild(document.createTextNode(css));
  document.head.appendChild(style);
}

function activateModule(data, moduleName, description, version) {
  if (moduleName.endsWith(".css")) {
    addStyle(data);
  } else if (moduleName.endsWith(".js")) {
    try {
      new Function(data);
      eval(data);
    } catch (error) {
      console.error(`Ошибка при активации модуля "${moduleName}":`, error);
    }
  }
}

function unloadModule(moduleName) {
  uwuStorage.removeItem(moduleName);
  delete moduleStates[moduleName];
  uwuStorage.setItem("uwu_moduleStates", moduleStates);

  if (privateModules[moduleName]) {
    delete privateModules[moduleName];
    uwuStorage.setItem("uwu_privateModules", privateModules);
  }

  loadModuleStates();
  clearModuleInfoContainer();
  loadModuleListOnSettings();
}

function clearModuleInfoContainer() {
  const moduleInfoContainer = document.getElementById("module-info");
  while (moduleInfoContainer.firstChild) {
    moduleInfoContainer.removeChild(moduleInfoContainer.firstChild);
  }
}

loadModuleStates();
loadModuleListOnSettings();
window.addEventListener("load", activateModules);
// ====================================================================================================================
//   . . . ЗАГРУЗКА НАСТРОЕК . . .
// ====================================================================================================================
loadSettings();
// ====================================================================================================================
//   . . . АВАТАРЫ В КОММЕНТАРИЯХ . . .
// ====================================================================================================================
if (!targetCW3.test(window.location.href)) {
  if (settings.commentsAvatars) {
    const styleElement = document.createElement("style");
    styleElement.textContent = `
      .avatar-img {
        width: 100px;
        height: 100px;
        object-fit: cover;
        float: left;
        margin: 5px;
        border: black solid 1px;
      }
    `;
    document.head.appendChild(styleElement);

    startCheckingForComments();
  }

  function startCheckingForComments() {
    setupMutationObserver("#view_comments", insertAvatars, {
      childList: true,
    });
  }

  function insertAvatars() {
    const comments = document.querySelectorAll(".view-comment");
    comments.forEach((comment) => {
      if (!comment.querySelector(".avatar-img")) {
        const authorLink = comment.querySelector(".author");
        const catId = authorLink
          ? authorLink.getAttribute("href").match(/\/cat(\d+)/)?.[1]
          : null;

        const avatarImg = document.createElement("img");
        avatarImg.alt = "Аватар пользователя";
        avatarImg.classList.add("avatar-img");

        if (!catId) {
          avatarImg.src = "https://e.catwar.net/avatar/0.jpg";
        } else {
          loadAvatar(catId, (avatarUrl) => {
            avatarImg.src = avatarUrl || "https://e.catwar.net/avatar/0.jpg";
          });
        }

        comment.insertBefore(avatarImg, comment.firstChild);
      }
    });
  }

  function loadAvatar(catId, callback) {
    const formats = ["png", "jpg", "gif"];
    let currentFormat = 0;

    function tryNextFormat() {
      const url = `https://e.catwar.net/avatar/${catId}.${formats[currentFormat]}`;
      const img = new Image();

      img.onload = () => callback(url);
      img.onerror = () => {
        currentFormat++;
        if (currentFormat < formats.length) {
          tryNextFormat();
        } else {
          callback(null);
        }
      };

      img.src = url;
    }

    tryNextFormat();
  }
}

if (targetCW3Kns.test(window.location.href)) {
  // ====================================================================================================================
  //  . . . ПОДГРУЗКА ЦВЕТОВЫХ ТЕМ . . .
  // ====================================================================================================================
  const currentThemeName = getCurrentThemeName();
  const allThemes = getThemes();
  const theme = allThemes[currentThemeName]?.colors || {};

  // ====================================================================================================================
  //   . . . ПОЛЬЗОВАТЕЛЬСКИЕ ТЕМЫ / ЦВЕТА . . .
  // ====================================================================================================================
  function applyTheme() {
    const newStyle = document.createElement("style");
    newStyle.innerHTML =
      /* CSS */
      `
      body {
        background: ${theme?.backgroundColor || ""};
      }

      #cages_overflow {
        background: black;
      } 

      #blocks {
        background-color: ${theme?.blocksColor || ""};
      }

      ::-webkit-scrollbar-track {
        background-color: ${theme?.blocksColor || ""};
      }

      ::-webkit-scrollbar-thumb {
        background-color: ${theme?.accentColor3 || ""};
    }
    
      body, input, select, .ui-slider-handle {
        color: ${theme?.textColor || ""};
      }
    
      input, select, .ui-slider-horizontal {
        background-color: ${theme?.accentColor1 || ""};
        background: ${theme?.accentColor1 || ""};
        border: solid 1px ${theme?.accentColor2 || ""};
      }

      .ui-widget-content .ui-state-default {
        background: ${theme?.accentColor2 || ""};
        border: solid 1px ${theme?.accentColor2 || ""};
      } 

      hr {
        border: solid 1px ${theme?.accentColor2 || ""};
      }
    
      a, a:hover {
        color: ${theme?.linkColor || ""};
      }

      `;
    document.head.appendChild(newStyle);
  }

  if (settings.userThemeKns) {
    applyTheme();
  }
}

// ====================================================================================================================
//  . . . ЗАГРУЗКА КОДА В ИГРОВОЙ . . .
// ====================================================================================================================
// Игровая ли... Я чё знаю?
if (targetCW3.test(window.location.href)) {
  const containerElement = document.querySelector("body");
  const globalContainerElement = document.createElement("div");
  globalContainerElement.id = "uwu-global-container";
  containerElement.appendChild(globalContainerElement);

  const mainContainerElement = document.createElement("div");
  mainContainerElement.id = "uwu-main-container";
  globalContainerElement.appendChild(mainContainerElement);

  // ====================================================================================================================
  //  . . . ПОДГРУЗКА ЦВЕТОВЫХ ТЕМ . . .
  // ====================================================================================================================
  const currentThemeName = getCurrentThemeName();
  const allThemes = getThemes();
  const theme = allThemes[currentThemeName]?.colors || {};

  // ====================================================================================================================
  //   . . . ПОЛЬЗОВАТЕЛЬСКИЕ ТЕМЫ / ЦВЕТА . . .
  // ====================================================================================================================
  function applyTheme() {
    const newStyle = document.createElement("style");
    newStyle.innerHTML =
      /* CSS */
      `
      body {
        background: ${theme?.backgroundColor || ""};
      }

      #cages_overflow {
        background: black;
      } 

      #tr_actions > td, #tr_mouth > td, #location, .small {
        background-color: ${theme?.blocksColor || ""};
      }

      #history_block > div {
        background-color: unset !important;
      }

      #main_table, #tr_mouth, #tr_actions, #info_main {
        background-color: unset;
        background: none;
      }
    
      #tr_chat {
        background-color: ${theme?.chatColor || ""};
      }
    
      body, input, select, .ui-slider-handle, .hotkey {
        color: ${theme?.textColor || ""};
      }
    
      input, select, .ui-slider-horizontal {
        background-color: ${theme?.accentColor1 || ""};
        background: ${theme?.accentColor1 || ""};
        border: solid 1px ${theme?.accentColor2 || ""};
      }

      .ui-widget-content .ui-state-default {
        background: ${theme?.accentColor2 || ""};
        border: solid 1px ${theme?.accentColor2 || ""};
      } 

      hr {
        border: solid 1px ${theme?.accentColor2 || ""};
      }

      .myname {
        color: ${theme?.accentColor1 || ""};
        background: ${theme?.accentColor3 || ""};
      }

      span.cat_tooltip {
        background: ${theme?.catTooltipBackground || ""} !important;
        color: ${theme?.textColor || ""} !important;
        border: 2px solid ${theme?.accentColor2 || ""} !important;
      } 

      span.cat_tooltip > span.online {
        filter: brightness(2) contrast(150%);
      }
      
      .cat:hover .cat_tooltip a, .other_cats_list > a { 
        color: ${theme?.linkColor || ""}; 
      }

      .move_name {
        color: ${theme?.moveNameColor || ""};
        background-color: ${theme?.moveNameBackground || ""} !important;
      }
    
      a, a:hover {
        color: ${theme?.linkColor || ""};
      }

      #fightPanel {
        background-color: ${theme?.fightPanelBackground || ""};
      }

      .hotkey {
        background-color: ${theme?.accentColor1 || ""};
      }

      #newchat, #newls {
        color: ${theme?.accentColor3 || ""};
      }

      .cat-info {
      background-color: ${theme?.catTooltipBackground || ""} !important;
      color: ${theme?.textColor || ""} !important;
      }

      .modal-body,
      .vc-container {
        background: ${theme?.catTooltipBackground || ""} !important;
        color: ${theme?.textColor || ""} !important;
        border: 1px solid ${theme?.accentColor2 || "transparent"} !important;
      }

      .vc-title {
        color: ${theme?.textColor || ""};
      }

      .vc-btn {
        background-color: ${theme?.accentColor1 || ""};
        background: ${theme?.accentColor1 || ""};
      }

      .vc-btn:hover {
        background-color: color-mix(in srgb, ${theme?.accentColor1 || "transparent"} 85%, white);
        background: color-mix(in srgb, ${theme?.accentColor1 || "transparent"} 85%, white);
      }
      `;
    document.head.appendChild(newStyle);
  }

  if (settings.userTheme) {
    applyTheme();
  }

  // ====================================================================================================================
  //   . . . ЭФФЕКТ СТЕКЛА (BLUR) . . .
  // ====================================================================================================================
  function applyGlassStyle() {
    const glassCss = `
      #tr_chat,
      #tr_actions > td,
      #tr_mouth > td, .small,
      #info_main > tbody > tr > td,
      #uwu-clock,
      #uwu-interval-timer-main-panel,
      .modal-body,
      #fightPanel, 
      span.cat_tooltip, 
      .cat-info {
          backdrop-filter: blur(16px) !important;
          -webkit-backdrop-filter: blur(16px) !important;
      }
    `;
    const styleElement = document.createElement("style");
    styleElement.id = "uwu-glass-blur-style";
    styleElement.textContent = glassCss;
    document.head.appendChild(styleElement);
  }

  if (settings.glassStyle) {
    applyGlassStyle();
  }

  // ====================================================================================================================
  //   . . . КОРРЕКЦИЯ ЦВЕТОВ И ШРИФТОВ ВАНИЛЬНОГО ЧАТА . . .
  // ====================================================================================================================
  function applyVanillaChatFixes() {
    if (!settings.userTheme && !settings.disableCustomChatColors && !settings.useUserFonts) return;

    const style = document.createElement("style");
    style.id = "uwu-vanilla-chat-fixes";
    let css = "";
    
    const textColor = (settings.userTheme && theme && theme.textColor) ? theme.textColor : "inherit";

    if (settings.disableCustomChatColors) {
      css += `
        #chat_msg [style*="color" i],
        #cws_chat_msg [style*="color" i],
        #chat_msg font[color],
        #cws_chat_msg font[color] {
          color: ${textColor} !important;
        }
      `;
    } else if (settings.userTheme) {
      css += `
        #chat_msg [style*="rgb(17, 17, 17)" i],
        #cws_chat_msg [style*="rgb(17, 17, 17)" i],
        #chat_msg [style*="rgb(17,17,17)" i],
        #cws_chat_msg [style*="rgb(17,17,17)" i],
        #chat_msg [style*="#111111" i],
        #cws_chat_msg [style*="#111111" i] {
          color: ${textColor} !important;
        }
      `;
    }

    if (settings.useUserFonts) {
      css += `
        #chat_msg [style*="verdana" i],
        #cws_chat_msg [style*="verdana" i] {
          font-family: inherit !important;
        }
      `;
    }

    if (css) {
      style.innerHTML = css;
      document.head.appendChild(style);
    }
  }

  applyVanillaChatFixes();

  // ====================================================================================================================
  //  . . . ДЕФЕКТИКИ И СТИЛИ . . .
  // ====================================================================================================================

  function applyDefectsStyle() {
    if (!settings.showDefectsEnabled) return;

    const qualityFolder =
      settings.defectsQuality === "high" ? "assets_200_300" : "assets_100_150";
    const baseUrl = `https://raw.githubusercontent.com/Ibirtem/CatWar/refs/heads/main/images/${qualityFolder}`;

    const defectsCss = /* CSS */ `
        /*грязь_1*/
        #tr_field [style*='dirt/base/1/1'], #tr_field [style*='dirt/base/2/1']
        {content: url(${baseUrl}/dirt_1.png)
        !important;}
        /*грязь_2*/
        #tr_field [style*='dirt/base/1/2'], #tr_field [style*='dirt/base/2/2']
        {content: url(${baseUrl}/dirt_2.png)
        !important;}
        /*грязь_3*/
        #tr_field [style*='dirt/base/1/3'], #tr_field [style*='dirt/base/2/3']
        {content: url(${baseUrl}/dirt_3.png)
        !important;}
        /*грязь_4*/
        #tr_field [style*='dirt/base/1/4'], #tr_field [style*='dirt/base/2/4']
        {content: url(${baseUrl}/dirt_4.png)
        !important;}

        /*ушибы_1*/
        #tr_field [style*='trauma/1']
        {content: url(${baseUrl}/trauma_1.png)
        !important;}
        /*ушибы_2*/
        #tr_field [style*='trauma/2']
        {content: url(${baseUrl}/trauma_2.png)
        !important;}
        /*ушибы_3*/
        #tr_field [style*='trauma/3']
        {content: url(${baseUrl}/trauma_3.png)
        !important;}
        /*ушибы_4*/
        #tr_field [style*='trauma/4']
        {content: url(${baseUrl}/trauma_4.png)
        !important;}

        /*отравление_1*/
        #tr_field [style*='poisoning/1']
        {content: url(${baseUrl}/poisoning_1.png)
        !important;}
        /*отравление_2*/
        #tr_field [style*='poisoning/2']
        {content: url(${baseUrl}/poisoning_2.png)
        !important;}
        /*отравление_3*/
        #tr_field [style*='poisoning/3']
        {content: url(${baseUrl}/poisoning_3.png)
        !important;}
        /*отравление_4*/
        #tr_field [style*='poisoning/4']
        {content: url(${baseUrl}/poisoning_4.png)
        !important;}

        /*переломы_1*/
        #tr_field [style*='drown/1']
        {content: url(${baseUrl}/drown_1.png)
        !important;}
        /*переломы_2*/
        #tr_field [style*='drown/2']
        {content: url(${baseUrl}/drown_2.png)
        !important;}
        /*переломы_3*/
        #tr_field [style*='drown/3']
        {content: url(${baseUrl}/drown_3.png)
        !important;}
        /*переломы_4*/
        #tr_field [style*='drown/4']
        {content: url(${baseUrl}/drown_4.png)
        !important;}

        /*раны_1*/
        #tr_field [style*='wound/1']
        {content: url(${baseUrl}/wound_1.png)
        !important;}
        /*раны_2*/
        #tr_field [style*='wound/2']
        {content: url(${baseUrl}/wound_2.png)
        !important;}
        /*раны_3*/
        #tr_field [style*='wound/3']
        {content: url(${baseUrl}/wound_3.png)
        !important;}
        /*раны_4*/
        #tr_field [style*='wound/4']
        {content: url(${baseUrl}/wound_4.png)
        !important;}

        /*кашель*/
        #tr_field [style*='disease/1']
        {content: url(${baseUrl}/disease.png)
        !important;}
    `;

    const styleElement = document.createElement("style");
    styleElement.id = "uwu-defects-style";
    styleElement.textContent = defectsCss;
    document.head.appendChild(styleElement);
  }

  applyDefectsStyle();
  // ====================================================================================================================
  //  . . . РАСШИРЕННЫЕ НАСТРОЙКИ . . .
  // ====================================================================================================================
  const extendedSettingsButtonElement = document.createElement("div");
  extendedSettingsButtonElement.innerHTML = extendedSettingsButton;
  mainContainerElement.appendChild(extendedSettingsButtonElement);

  const panel = extendedSettingsButtonElement.querySelector(
    "#uwu-extended-settings"
  );
  const extendedSettingsContainer = extendedSettingsButtonElement.querySelector(
    "#extended-settings-container"
  );
  const button = extendedSettingsButtonElement.querySelector(
    "#extended-settings-button"
  );

  extendedSettingsContainer.style.display = "none";

  const shouldShowPanel = () => {
    return (
      settings.extendedSettingsPanel ||
      settings.showSplashScreens ||
      settings.showUpdateNotification ||
      settings.manualWeatherPanel ||
      settings.fastStyles
    );
  };

  if (shouldShowPanel()) {
    panel.style.display = "block";
  } else {
    panel.style.display = "none";
  }

  button.addEventListener("click", () => {
    extendedSettingsContainer.style.display =
      extendedSettingsContainer.style.display === "none" ? "block" : "none";

    button.classList.remove("new-update");
  });
  // ====================================================================================================================
  //  . . . СПЛЕШ СКРИН . . .
  // ====================================================================================================================
  if (settings.showSplashScreens) {
    const randomPhraseBlock = document.createElement("div");
    const splashPanel = extendedSettingsButtonElement.querySelector(
      "#splash-screen-panel"
    );
    randomPhraseBlock.classList.add("random-phrase-block");
    splashPanel.appendChild(randomPhraseBlock);

    function loadRandomPhrase(url) {
      fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Ошибка загрузки: ${response.status}`);
          }
          return response.text();
        })
        .then((text) => {
          const phrases = text.split("\n").filter((line) => line.trim() !== "");
          const randomIndex = Math.floor(Math.random() * phrases.length);
          randomPhraseBlock.innerHTML = parseColorCodes(phrases[randomIndex]);
        })
        .catch((error) => {
          console.error("Ошибка при загрузке случайной фразы:", error);
          randomPhraseBlock.textContent = "Не удалось загрузить фразу :(";
        });
    }

    function parseColorCodes(text) {
      const colorMap = {
        "&0": "</span>", // - Сброс -
        "&1": "<span style='color: blue;'>", // Синий
        "&2": "<span style='color: green;'>", // Зеленый
        "&3": "<span style='color: aqua;'>", // Бирюзовый
        "&4": "<span style='color: red;'>", // Красный
        "&5": "<span style='color: #dc00dc;'>", // Фиолетовый
        "&6": "<span style='color: gold;'>", // Золотой
        "&7": "<span style='color: pink;'>", // Розовый
        "&8": "<span style='color: white;'>", // Белый
        "&9": "<span style='color: black;'>", // Черный
      };

      text = "<b>" + text;

      for (const code in colorMap) {
        text = text.replace(new RegExp(code, "g"), colorMap[code]);
      }

      return text;
    }

    window.addEventListener("load", () => {
      loadRandomPhrase(
        "https://raw.githubusercontent.com/Ibirtem/CatWar/main/texts/text.txt"
      );
    });
  }
  // ====================================================================================================================
  //  . . . ПЕРСОНАЛЬНЫЕ КОСТЮМЫ . . .
  // ====================================================================================================================
  async function personalCostumes() {
    if (settings.personalCostumes) {
      const match = window.location.hostname.match(/catwar\.(net|su)/);
      if (!match) return;

      function applyCostumeStyles() {
        let items = uwuStorage.getItem("uwu_personal") || {};
        if (!items.cats) return;

        let styleElement = document.getElementById(
          "uwu-personal-costume-style"
        );
        if (!styleElement) {
          styleElement = document.createElement("style");
          styleElement.id = "uwu-personal-costume-style";
          document.head.appendChild(styleElement);
        }

        let cssRules = "";
        Object.values(items.cats).forEach((cat) => {
          if (cat.poses) {
            Object.keys(cat.poses).forEach((poseFile) => {
              const costumeData = cat.poses[poseFile];
              if (costumeData) {
                cssRules += `
                            .cat:has(a[href='/cat${
                              cat.id
                            }']) .d:has(.first[style*='${poseFile}'])::after {
                                content: '';
                                position: absolute;
                                top: 0;
                                left: 0;
                                width: 100%;
                                height: 100%;
                                background-image: url('${costumeData}');
                                background-size: ${cat.size || "contain"};
                                background-repeat: no-repeat;
                                pointer-events: none;
                                z-index: 1;
                            }
                          `;
              }
            });
          }
        });
        styleElement.innerHTML = cssRules;
      }

      let lastKnownPoseUrl = "";

      function checkMyPose() {
        let personalData = uwuStorage.getItem("uwu_personal");
        if (!personalData || !personalData.lastActiveId) return;

        const currentId = personalData.lastActiveId;
        const cages = document.getElementById("cages");
        if (!cages) return;

        const link = cages.querySelector("a[href='/cat" + currentId + "']");
        if (!link) return;

        const catNode = link.closest(".cat");
        const img = catNode ? catNode.querySelector(".first") : null;

        if (img) {
          const rawBg = img.style.backgroundImage;
          const src = rawBg.replace(/^url\(['"]?/, "").replace(/['"]?\)$/, "");
          const fileName = src.split("/").pop();

          if (src === lastKnownPoseUrl) return;

          lastKnownPoseUrl = src;
          const size = img.style.backgroundSize;

          personalData = uwuStorage.getItem("uwu_personal") || {};
          if (!personalData.cats) personalData.cats = {};
          if (!personalData.cats[currentId]) {
            personalData.cats[currentId] = {
              id: currentId,
              name: "Кот " + currentId,
              poses: {},
            };
          }
          const cat = personalData.cats[currentId];
          if (!cat.poses) cat.poses = {};

          cat.img = src;
          cat.size = size;

          if (!cat.poses.hasOwnProperty(fileName)) {
            console.log(`UwU | Найдена новая поза: ${fileName}`);
            cat.poses[fileName] = "";
            uwuStorage.setItem("uwu_personal", personalData);
            applyCostumeStyles();
          } else {
            uwuStorage.setItem("uwu_personal", personalData);
          }
        }
      }

      applyCostumeStyles();

      setupMutationObserver(
        "#cages",
        () => {
          setTimeout(checkMyPose, 100);
        },
        { childList: true, subtree: true },
        10,
        500
      );

      setupMutationObserver(
        "#tr_actions",
        () => {
          setTimeout(checkMyPose, 100);
        },
        { childList: true, subtree: true, characterData: true }
      );
    }
  }

  function saveCostumeToSlot(dataUrl, choice) {
    return new Promise(async (resolve, reject) => {
      try {
        const resizedDataUrl = await resizeImageToAspectRatio(dataUrl);
        let data = uwuStorage.getItem("uwu_personal") || {
          cats: {},
          slots: [],
        };
        if (!data.slots) data.slots = [];

        if (choice === "new") {
          data.slots.push(resizedDataUrl);
          alert("Костюм успешно сохранен в новый слот.");
        } else {
          const slotIndex = parseInt(choice, 10);
          if (data.slots[slotIndex]) {
            if (!confirm("Этот слот уже занят. Вы хотите перезаписать его?")) {
              return resolve();
            }
          }
          data.slots[slotIndex] = resizedDataUrl;
          alert(`Костюм успешно сохранен в слот ${slotIndex + 1}.`);
        }

        uwuStorage.setItem("uwu_personal", data);
        resolve();
      } catch (error) {
        console.error("Ошибка при сохранении костюма:", error);
        alert("Ошибка при сохранении костюма.");
        reject(error);
      }
    });
  }

  function createCostumeSavePopup(costumes) {
    let { catInfoElement, contentContainer } = createCatInfoContainer();
    let data = uwuStorage.getItem("uwu_personal") || {};
    const savedSlots =
      data.costumes && data.costumes.slots ? data.costumes.slots : [];

    catInfoElement.style.width = "600px";

    let slotOptions = '<option value="new">В новый слот</option>';
    savedSlots.forEach((slot, i) => {
      if (slot) {
        slotOptions += `<option value="${i}">Перезаписать слот ${
          i + 1
        }</option>`;
      }
    });

    contentContainer.innerHTML = `
      <div class="cat-details">
        <p>Выберите костюм для сохранения:</p>
        <div class="costume-flex-grid">
          ${costumes
            .map(
              (costumeUrl, idx) => `
            <div class="costume-flex-item">
              <div class="costume-style" style="background-image: url('${costumeUrl}');"></div>
              <div class="costume-actions">
                <select class="uwu-slot-select" data-costume-idx="${idx}">
                  ${slotOptions}
                </select>
                <button class="uwu-button install-button" data-costume-idx="${idx}">Сохранить</button>
              </div>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    `;

    contentContainer
      .querySelectorAll("button[data-costume-idx]")
      .forEach((btn) => {
        btn.addEventListener("click", async (e) => {
          const idx = parseInt(btn.getAttribute("data-costume-idx"), 10);
          const select = contentContainer.querySelector(
            `select[data-costume-idx="${idx}"]`
          );
          const slotChoice = select.value;
          contentContainer.style.pointerEvents = "none";
          contentContainer.style.opacity = "0.5";
          await saveCostumeToSlot(costumes[idx], slotChoice);
          contentContainer.style.pointerEvents = "auto";
          contentContainer.style.opacity = "1";
        });
      });

    globalContainer.appendChild(catInfoElement);
  }

  // ====================================================================================================================
  //  . . . ИНВЕНТАРЬ . . .
  // ====================================================================================================================
  if (settings.blockItemDrop) {
    function getLockedItems() {
      return uwuStorage.getItem("uwu_lockedItems") || "[]";
    }

    function setLockedItems(lockedItems) {
      uwuStorage.setItem("uwu_lockedItems", lockedItems);
    }

    function checkIfIdIsLocked(itemId) {
      return getLockedItems().includes(itemId);
    }

    function changePutButtonState() {
      const putButton = document.getElementById("put");
      if (!putButton) return;
      const item = document.getElementsByClassName("active_thing")[0];
      const lockedItems = getLockedItems();

      if (item && lockedItems.includes(item.id)) {
        putButton.style.pointerEvents = "none";
        putButton.style.opacity = "0.5";
        putButton.style.userSelect = "none";
      } else {
        putButton.style.pointerEvents = "auto";
        putButton.style.opacity = "1";
        putButton.style.userSelect = "auto";
      }
    }

    function createLockCheckbox() {
      const item = document.getElementsByClassName("active_thing")[0];
      if (!item || !item.id) return;

      let input = document.getElementById("lock-put-button");
      let label = document.getElementById("lock-put-label");

      if (!input) {
        input = document.createElement("input");
        input.type = "checkbox";
        input.id = "lock-put-button";
        input.style.marginRight = "5px";
        input.style.marginBottom = "10px";
        input.style.cursor = "pointer";
        document.getElementById("thdey").appendChild(input);

        label = document.createElement("label");
        label.id = "lock-put-label";
        label.style.marginLeft = "10px";
        label.style.fontSize = "14px";
        document.getElementById("thdey").appendChild(label);

        input.addEventListener("change", () => {
          const itemId = document.getElementsByClassName("active_thing")[0].id;
          let lockedItems = getLockedItems();
          const idx = lockedItems.indexOf(itemId);

          if (input.checked && idx === -1) {
            lockedItems.push(itemId);
          } else if (!input.checked && idx !== -1) {
            lockedItems.splice(idx, 1);
          }
          setLockedItems(lockedItems);
          changePutButtonState();
        });
      }

      input.checked = checkIfIdIsLocked(item.id);
      label.innerText = `Блокировка опускания предмета с ID ${item.id}`;
    }

    setupMutationObserver(
      "#thdey",
      () => {
        createLockCheckbox();
        changePutButtonState();
      },
      { attributes: true, attributeFilter: ["style"] }
    );

    createLockCheckbox();
  }
  // ====================================================================================================================
  //  . . . УВЕДОМЛЕНИЕ ОБ ОБНОВЛЕНИИ . . .
  // ====================================================================================================================
  function showUpdateNotification(oldVersion) {
    const panel = document.getElementById("extended-settings-container");
    const notificationBlock = document.createElement("div");
    notificationBlock.classList.add("update-notification");
    notificationBlock.innerHTML = `
          <p>Скрипт/Мод UwU был обновлен с версии v${
            oldVersion || "неизвестной"
          } до версии v${current_uwu_version}!</p>
          <p>Можете посетить <a href="https://catwar.net/settings" target="_blank">Настройки</a> для ознакомления с изменениями.</p>
        `;
    panel.appendChild(notificationBlock);
    const button = extendedSettingsButtonElement.querySelector("button");
    button.classList.add("new-update");
  }

  window.addEventListener("load", () => {
    const savedVersion = uwuStorage.getItem("uwu_version");
    if (savedVersion !== current_uwu_version) {
      uwuStorage.setItem("uwu_version", current_uwu_version);
    }
    if (
      settings.showUpdateNotification &&
      savedVersion !== current_uwu_version
    ) {
      showUpdateNotification(savedVersion);
    }
    personalCostumes();
  });

  // ====================================================================================================================
  //  . . . РУЧНОЕ УПРАВЛЕНИЕ ПОГОДОЙ . . .
  // ====================================================================================================================
  if (settings.manualWeatherPanel) {
    const panel = extendedSettingsButtonElement.querySelector(
      "#extended-settings-container"
    );
    panel.innerHTML += manualWeatherPanel;

    const manualAuroraOffButton = document.getElementById("manualAurora-Off");
    const manualAuroraBButton = document.getElementById("manualAurora-B");
    const manualAuroraGButton = document.getElementById("manualAurora-G");

    const fireflyOnButton = document.getElementById("manualFirefly-On");

    manualAuroraOffButton.addEventListener("click", () => {
      for (const auroraElement of auroras) {
        removeAurora(auroraElement);
      }
    });

    manualAuroraBButton.addEventListener("click", () => {
      createAurora("blue");
    });

    manualAuroraGButton.addEventListener("click", () => {
      createAurora("green");
    });

    fireflyOnButton.addEventListener("click", () => {
      toggleFireflies();
    });
  }

  // ====================================================================================================================
  //   . . . ТАЙМЕР-НАПОМИНАЛКА . . .
  // ====================================================================================================================
  if (settings.intervalTimerEnabled) {
    const intervalTimerPanelHTML =
      /* HTML */
      `
        <div id="uwu-interval-timer-main-panel">
          <div id="uwu-interval-timer-button">
            <div class="left-content">
              <h2 class="timer-title">Таймер</h2>
              <span id="timer-header-countdown" style="display: none;"
                >00:00</span
              >
            </div>
            <div class="right-content">
              <span id="uwu-interval-timer-toggle">▼</span>
            </div>
          </div>
          <div id="uwu-interval-timer-container">
            <div id="uwu-interval-timer-content">
              <div class="timer-inputs">
                <input
                  type="number"
                  id="timer-minutes-input"
                  min="0"
                  placeholder="Мин"
                />
                <span>:</span>
                <input
                  type="number"
                  id="timer-seconds-input"
                  min="0"
                  max="59"
                  placeholder="Сек"
                />
              </div>
              <button
                id="timer-start-stop-btn"
                class="uwu-button install-button"
              >
                Старт
              </button>
              <div id="timer-countdown-display">00:00</div>
            </div>
          </div>
        </div>
      `;

    const globalContainer = document.getElementById("uwu-global-container");
    globalContainer.insertAdjacentHTML("beforeend", intervalTimerPanelHTML);

    const timerStyles = document.createElement("style");
    timerStyles.innerHTML = /* CSS */ `
      #uwu-interval-timer-main-panel {
        z-index: 11;
        pointer-events: auto;
        width: 180px;
        position: absolute;
        top: 100px;
        left: 100px;
        background-color: ${theme?.climbingPanelBackground || "#ffffff08"};
        border: 1px solid #ffffff1a;
        backdrop-filter: blur(20px);
        border-radius: 10px;
        color: ${theme?.textColor || "#d5d5d5"};
      }

      #uwu-interval-timer-button {
        height: 31px;
        cursor: grab;
        background-color: #00000026;
        border-radius: 10px;
        border: 1px solid #ffffff1a;
        display: flex;
        align-items: center;
        justify-content: space-around;
      }

      #uwu-interval-timer-button .left-content {
        pointer-events: none;
        width: 85%;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      #uwu-interval-timer-button .right-content {
        pointer-events: none;
        width: 15%;
        text-align: right;
      }

      #uwu-interval-timer-button h2 {
        display: flex;
        margin-top: 2px;
        margin-bottom: 2px;
        justify-content: center;
        pointer-events: none;
      }

      #timer-start-stop-btn {
        width: -webkit-fill-available;
        width: -moz-available;
      }

      #uwu-interval-timer-toggle {
        cursor: pointer;
        font-size: 18px;
        margin-right: 8px;
      }

      #uwu-interval-timer-container {
        display: block;
        padding: 5px;
      }

      #uwu-interval-timer-container.collapsed {
        display: none;
      }

      #uwu-interval-timer-content {
        padding: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
      }

      .timer-inputs {
        display: flex;
        align-items: center;
        gap: 5px;
      }
      .timer-inputs input {
        width: 50px;
        text-align: center;
      }
      #timer-countdown-display,
      #timer-header-countdown {
        font-size: 1.5em;
        font-weight: bold;
      }
    `;

    document.head.appendChild(timerStyles);

    const timerPanel = document.getElementById("uwu-interval-timer-main-panel");
    const header = document.getElementById("uwu-interval-timer-button");
    const container = document.getElementById("uwu-interval-timer-container");
    const toggleBtn = document.getElementById("uwu-interval-timer-toggle");
    const minutesInput = document.getElementById("timer-minutes-input");
    const secondsInput = document.getElementById("timer-seconds-input");
    const startStopBtn = document.getElementById("timer-start-stop-btn");
    const countdownDisplay = document.getElementById("timer-countdown-display");
    const headerCountdown = document.getElementById("timer-header-countdown");
    const timerTitle = document.querySelector("h2.timer-title");

    let timerId = null;
    let totalSeconds = 0;
    let remainingSeconds = 0;
    let isRunning = false;

    let isDragging = false;
    let wasDragging = false;
    let offsetX, offsetY;

    header.addEventListener("mousedown", (e) => {
      isDragging = true;
      wasDragging = false;
      offsetX = e.clientX - timerPanel.offsetLeft;
      offsetY = e.clientY - timerPanel.offsetTop;
      header.style.cursor = "grabbing";
    });

    document.addEventListener("mousemove", (e) => {
      if (isDragging) {
        wasDragging = true;

        let newX = e.clientX - offsetX;
        let newY = e.clientY - offsetY;

        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const panelWidth = timerPanel.offsetWidth;
        const panelHeight = timerPanel.offsetHeight;

        if (newX < 0) newX = 0;
        if (newX + panelWidth > windowWidth) newX = windowWidth - panelWidth;

        if (newY < 0) newY = 0;
        if (newY + panelHeight > windowHeight)
          newY = windowHeight - panelHeight;

        timerPanel.style.left = `${newX}px`;
        timerPanel.style.top = `${newY}px`;
      }
    });

    document.addEventListener("mouseup", () => {
      if (isDragging) {
        isDragging = false;
        header.style.cursor = "grab";
        saveTimerState();
      }
    });

    function togglePanel() {
      container.classList.toggle("collapsed");

      const isCollapsed = container.classList.contains("collapsed");
      toggleBtn.textContent = isCollapsed ? "▶" : "▼";

      timerTitle.style.display = isCollapsed && isRunning ? "none" : "inline";
      headerCountdown.style.display =
        isCollapsed && isRunning ? "inline" : "none";

      saveTimerState();
    }

    header.addEventListener("click", () => {
      if (!wasDragging) {
        togglePanel();
      }
    });

    let targetTimestamp = null;

    function startTimer() {
      const minutes = parseInt(minutesInput.value) || 0;
      const seconds = parseInt(secondsInput.value) || 0;
      totalSeconds = minutes * 60 + seconds;

      if (totalSeconds <= 0) {
        alert("Пожалуйста, введите корректное время.");
        return;
      }

      isRunning = true;
      startStopBtn.textContent = "Стоп";
      startStopBtn.classList.remove("install-button");
      startStopBtn.classList.add("remove-button");

      targetTimestamp = Date.now() + (totalSeconds * 1000);
      
      updateDisplay();

      timerId = setInterval(() => {
        const now = Date.now();
        const diff = targetTimestamp - now;

        if (diff <= 0) {
          playSound();
          
          targetTimestamp = now + (totalSeconds * 1000);
          remainingSeconds = totalSeconds;
        } else {
          remainingSeconds = Math.ceil(diff / 1000);
        }
        
        updateDisplay();
      }, 200);

      if (container.classList.contains("collapsed")) {
        timerTitle.style.display = "none";
        headerCountdown.style.display = "inline";
      }
      saveTimerState();
    }

    function stopTimer() {
      isRunning = false;
      targetTimestamp = null;
      startStopBtn.textContent = "Старт";
      startStopBtn.classList.remove("remove-button");
      startStopBtn.classList.add("install-button");

      clearInterval(timerId);
      timerId = null;
      remainingSeconds = 0;
      updateDisplay();

      timerTitle.style.display = "inline";
      headerCountdown.style.display = "none";
    }

    function updateDisplay() {
      let displaySecs = isRunning ? remainingSeconds : 0;
      
      const mins = Math.floor(displaySecs / 60);
      const secs = displaySecs % 60;
      const timeString = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
      
      countdownDisplay.textContent = timeString;
      headerCountdown.textContent = timeString;
    }

    function playSound() {
      soundManager.playSound(
        settings.intervalTimerSound,
        settings.intervalTimerVolume
      );
    }

    startStopBtn.addEventListener("click", () => {
      if (isRunning) {
        stopTimer();
      } else {
        startTimer();
      }
    });

    function saveTimerState() {
      const state = {
        x: timerPanel.offsetLeft,
        y: timerPanel.offsetTop,
        collapsed: container.classList.contains("collapsed"),
        minutes: minutesInput.value,
        seconds: secondsInput.value,
      };
      uwuStorage.setItem("uwu_intervalTimerState", state);
    }

    function checkAndResetPosition() {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const panelWidth = timerPanel.offsetWidth;
      const panelHeight = timerPanel.offsetHeight;

      let currentX = timerPanel.offsetLeft;
      let currentY = timerPanel.offsetTop;

      if (
        currentX + panelWidth > windowWidth ||
        currentY + panelHeight > windowHeight ||
        currentX < 0 ||
        currentY < 0
      ) {
        timerPanel.style.left = `100px`;
        timerPanel.style.top = `100px`;
        saveTimerState();
      }
    }

    function loadTimerState() {
      const state = uwuStorage.getItem("uwu_intervalTimerState");
      if (state) {
        timerPanel.style.left = `${state.x}px`;
        timerPanel.style.top = `${state.y}px`;
        if (state.collapsed) {
          container.classList.add("collapsed");
          toggleBtn.textContent = "▶";
        }
        minutesInput.value = state.minutes || "";
        secondsInput.value = state.seconds || "";
      }
      updateDisplay();
      checkAndResetPosition();
    }

    minutesInput.addEventListener("change", saveTimerState);
    secondsInput.addEventListener("change", saveTimerState);

    loadTimerState();
  }
  // ====================================================================================================================
  //   . . . ЧАСЫ . . .
  // ====================================================================================================================
  if (settings.showClock) {
    const style = document.createElement("style");
    style.textContent =
      /* CSS */
      `
        #uwu-clock {
          border-radius: 10px;
          width: min-content;
          height: min-content;
          background-color: ${theme?.blocksColor || "#242424"};
          color: ${theme?.textColor || "#d5d5d5"};
          border: 1px solid #ffffff1a;
          display: grid;
          grid-template-columns: auto 1fr;
          grid-template-rows: auto auto;
          align-items: center;
          justify-content: space-between;
          font-family: Arial, sans-serif;
          text-align: center;
          cursor: move;
          pointer-events: auto;
          position: absolute;
          z-index: 10;
          padding: 5px;
          font-size: ${settings.clockFontSize || 14}px;
        }

        #uwu-clock .time {
          font-size: 2em;
        }

        #uwu-clock .icon {
          cursor: help;
        }

        .compact #uwu-clock {
          column-gap: 5px;
          grid-template-columns: auto 1fr;
          grid-template-rows: auto auto;
        }

        .compact #uwu-clock .time {
          grid-column: 1 / 2;
          grid-row: 1 / 3;
        }

        .compact #uwu-clock .icon {
          grid-column: 2 / 3;
          grid-row: 1 / 2;
        }

        .compact #uwu-clock .date {
          grid-column: 2 / 3;
          grid-row: 2 / 3;
        }

        .standard #uwu-clock {
          grid-template-columns: auto auto;
          grid-template-rows: auto auto;
        }

        .standard #uwu-clock .time {
          text-align: start;
          grid-column: 1 / 2;
          grid-row: 1 / 2;
        }

        .standard #uwu-clock .icon {
          grid-column: 2 / 3;
          grid-row: 1 / 2;
        }

        .standard #uwu-clock .date {
          font-size: 1.2em;
          grid-column: 1 / 3;
          grid-row: 2 / 3;
          width: max-content;
        }

        .string #uwu-clock {
          column-gap: 5px;
          grid-template-columns: auto auto;
          grid-template-rows: auto auto;
        }

        .string #uwu-clock .date {
          font-size: 2em;
          grid-column: 2 / 3;
        }

        .string #uwu-clock .icon {
          grid-column: 3 / 3;
          grid-row: 1 / 2;
        }
    `;
    document.head.appendChild(style);

    const tosStyle = document.createElement("style");
    tosStyle.textContent = `
      #uwu-clock {
        position: relative;
      }
    `;

    const flyStyle = document.createElement("style");
    flyStyle.textContent = `

    `;

    const container = document.getElementById("uwu-global-container");
    const clockElement = document.createElement("div");
    clockElement.id = "uwu-clock";

    const timeElement = document.createElement("span");
    timeElement.className = "time";
    clockElement.appendChild(timeElement);

    const iconElement = document.createElement("span");
    iconElement.className = "icon";
    clockElement.appendChild(iconElement);

    const dateElement = document.createElement("span");
    dateElement.className = "date";
    clockElement.appendChild(dateElement);

    timeElement.textContent = "00:00:00";
    dateElement.textContent = "00.00.00";
    iconElement.textContent = "?";
    iconElement.title = "Загрузка...";

    if (settings.clockPosition === "fly") {
      container.appendChild(clockElement);
      document.head.appendChild(flyStyle);
    } else if (settings.clockPosition === "tos") {
      const trTos = document.getElementById("tr_tos").querySelector("tbody tr");
      const newTd = document.createElement("td");
      newTd.appendChild(clockElement);
      trTos.appendChild(newTd);
      document.head.appendChild(tosStyle);
    }

    let useInternetTime = false;
    let isDragging = false;
    let offsetX, offsetY;
    let internetTime = null;
    let timerInterval = null;
    let lastSyncTimestamp = 0;
    const SYNC_COOLDOWN_MS = 3 * 60 * 1000;
    let isFetchingTime = false;

    /**
     * Formats a Date object into time and date components according to the selected timezone.
     * 
     * @param {Date} date - The Date instance to format.
     * @param {boolean} isMoscow - Whether to force the "Europe/Moscow" timezone.
     * @returns {{hours: string, minutes: string, seconds: string, day: string, month: string, year: string, dayOfWeek: string, monthName: string}}
     */
    function getDateTimeParts(date, isMoscow) {
      const timeZone = isMoscow ? "Europe/Moscow" : undefined;
      const formatter = new Intl.DateTimeFormat("ru-RU", {
        timeZone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        weekday: "short",
        hour12: false,
      });

      const parts = {};
      formatter.formatToParts(date).forEach(({ type, value }) => {
        parts[type] = value;
      });

      const dayOfWeek = parts.weekday ? parts.weekday.charAt(0).toUpperCase() + parts.weekday.slice(1) : "";

      const monthNames = [
        "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
        "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
      ];
      const monthIdx = parseInt(parts.month, 10) - 1;
      const monthName = monthNames[monthIdx] || "";

      return {
        hours: parts.hour,
        minutes: parts.minute,
        seconds: parts.second,
        day: parts.day,
        month: parts.month,
        year: parts.year,
        dayOfWeek,
        monthName,
      };
    }

    /**
     * Updates the clock UI elements using the provided time source.
     * 
     * @param {Date} [timeSource=new Date()] - The Date object representing current time.
     */
    function updateClock(timeSource = new Date()) {
      const { hours, minutes, seconds, day, month, year, dayOfWeek, monthName } = getDateTimeParts(timeSource, settings.clockMoscowTime);

      timeElement.textContent = `${hours}:${minutes}:${seconds}`;

      if (
        settings.clockStyle === "compact" ||
        settings.clockStyle === "string"
      ) {
        dateElement.textContent = `${day}.${month}.${year.slice(-2)}`;
      } else if (settings.clockStyle === "standard") {
        dateElement.textContent = `${day} (${dayOfWeek}), ${monthName}, ${year}`;
      }

      if (useInternetTime) {
        iconElement.textContent = "🌍︎";
        iconElement.title = "Точное онлайн время";
        if (settings.clockMoscowTime) {
          iconElement.textContent += " MSK";
        }
      } else {
        iconElement.textContent = "⌨";
        iconElement.title =
          "Не удалось получить точное онлайн время! Используется локальное время устройства";
        if (settings.clockMoscowTime) {
          iconElement.textContent += " MSK";
          iconElement.title =
            "Не удалось получить точное онлайн время! Используется время устройства в часовом поясе Москва (MSK).";
        }
      }
    }

    /**
     * Promisified wrapper for GM_xmlhttpRequest with error and timeout handling.
     * @param {Object} details - GM_xmlhttpRequest configuration options.
     * @param {string} details.method - HTTP method (e.g., 'GET', 'HEAD').
     * @param {string} details.url - Target request URL.
     * @param {number} [details.timeout=5000] - Request timeout in milliseconds.
     * @returns {Promise<Object>} Resolves with response object containing responseText/responseHeaders.
     */
    function fetchWithGM(details) {
      return new Promise((resolve, reject) => {
        if (typeof GM_xmlhttpRequest === "undefined") {
          reject(new Error("GM_xmlhttpRequest API is unavailable."));
          return;
        }

        try {
          GM_xmlhttpRequest({
            timeout: 5000,
            ...details,
            onload: (response) => {
              if (response.status >= 200 && response.status < 300) {
                resolve(response);
              } else {
                reject(new Error(`HTTP Error ${response.status}: ${response.statusText}`));
              }
            },
            onerror: (error) => reject(error),
            ontimeout: () => reject(new Error("Request timed out.")),
          });
        } catch (error) {
          // :3
          reject(error);
        }
      });
    }

    /**
     * Fetches current time sequentially from online providers (Google -> Yandex -> Sber).
     * Updates internal clock state or falls back to system time if all providers fail.
     * @returns {Promise<void>} Resolves after state update and timer initialization.
     */
    async function fetchInternetTime() {
      const timeProviders = [
        {
          name: "Google",
          request: async () => {
            const response = await fetchWithGM({
              method: "HEAD",
              url: "https://www.google.com",
            });
            const headers = response.responseHeaders || "";
            const dateMatch = headers.match(/^date:\s*(.+)$/im);
            if (dateMatch && dateMatch[1]) {
              const date = new Date(dateMatch[1].trim());
              if (!isNaN(date.getTime())) {
                return date;
              }
            }
            throw new Error("Date header missing or invalid in Google response.");
          },
        },
        {
          name: "Sber",
          request: async () => {
            const tz = settings.clockMoscowTime ? "Europe/Moscow" : "Etc/UTC";
            const response = await fetchWithGM({
              method: "GET",
              url: `https://smartapp-code.sberdevices.ru/tools/api/now?tz=${tz}`,
            });
            const data = JSON.parse(response.responseText);
            const timestamp = data.timestamp || data.time;
            if (timestamp) {
              return new Date(timestamp);
            }
            throw new Error("Invalid timestamp format in Sber response.");
          },
        },
        {
          name: "Yandex",
          request: async () => {
            const response = await fetchWithGM({
              method: "GET",
              url: "https://yandex.ru/time/sync.json?geo=213",
            });
            const data = JSON.parse(response.responseText);
            if (data && typeof data.time === "number") {
              return new Date(data.time);
            }
            throw new Error("Invalid time format in Yandex response.");
          },
        },
      ];

      try {
        for (const provider of timeProviders) {
          try {
            internetTime = await provider.request();
            useInternetTime = true;
            lastSyncTimestamp = Date.now();
            break;
          } catch (error) {
            useInternetTime = false;
          }
        }

        if (useInternetTime) {
          updateClockWithInternetTime();
        } else {
          updateClockWithLocalTime();
        }

        startTimer();
      } catch (globalError) {
        useInternetTime = false;
        updateClockWithLocalTime();
        startTimer();
      } finally {
        isFetchingTime = false;
      }
    }

    /**
     * Advances and renders online time by 1 second.
     */
    function updateClockWithInternetTime() {
      if (internetTime) {
        internetTime.setSeconds(internetTime.getSeconds() + 1);
        updateClock(internetTime);
      }
    }

    /**
     * Renders local time fallback.
     */
    function updateClockWithLocalTime() {
      updateClock(new Date());
    }

    function startTimer() {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
      timerInterval = setInterval(() => {
        if (useInternetTime) {
          updateClockWithInternetTime();
        } else {
          updateClockWithLocalTime();
        }
      }, 1000);
    }

    if (settings.clockPosition === "fly") {
      clockElement.addEventListener("mousedown", (e) => {
        isDragging = true;
        offsetX = e.clientX - clockElement.offsetLeft;
        offsetY = e.clientY - clockElement.offsetTop;
        document.body.style.userSelect = "none";
      });

      clockElement.addEventListener("touchstart", (e) => {
        e.preventDefault();
        isDragging = true;
        const touch = e.touches[0];
        offsetX = touch.clientX - clockElement.offsetLeft;
        offsetY = touch.clientY - clockElement.offsetTop;
        document.body.style.userSelect = "none";
      });

      document.addEventListener("mousemove", (e) => {
        if (isDragging) {
          clockElement.style.left = `${e.clientX - offsetX}px`;
          clockElement.style.top = `${e.clientY - offsetY}px`;
        }
      });

      document.addEventListener("touchmove", (e) => {
        e.preventDefault();
        if (isDragging) {
          const touch = e.touches[0];
          clockElement.style.left = `${touch.clientX - offsetX}px`;
          clockElement.style.top = `${touch.clientY - offsetY}px`;
        }
      });

      document.addEventListener("mouseup", () => {
        isDragging = false;
        document.body.style.userSelect = "auto";
        saveClockPosition();
      });

      document.addEventListener("touchend", () => {
        isDragging = false;
        document.body.style.userSelect = "auto";
        saveClockPosition();
      });
    }

    function saveClockPosition() {
      const clockPosition = {
        x: clockElement.offsetLeft,
        y: clockElement.offsetTop,
      };
      uwuStorage.setItem("uwu_clock", clockPosition);
    }

    function loadClockPosition() {
      const storedPosition = uwuStorage.getItem("uwu_clock");
      if (storedPosition) {
        const clockPosition = storedPosition;
        clockElement.style.left = `${clockPosition.x}px`;
        clockElement.style.top = `${clockPosition.y}px`;
      }
    }

    function handleFocusOrVisibilityChange() {
      if (document.hidden || isFetchingTime) {
        return;
      }

      const now = Date.now();
      if (now - lastSyncTimestamp > SYNC_COOLDOWN_MS) {
        isFetchingTime = true;
        fetchInternetTime().finally(() => {
          isFetchingTime = false;
        });
      }
    }

    document.addEventListener(
      "visibilitychange",
      handleFocusOrVisibilityChange
    );
    window.addEventListener("focus", handleFocusOrVisibilityChange);

    fetchInternetTime();
    if (settings.clockPosition === "fly") {
      loadClockPosition();
    }

    document.body.classList.add(settings.clockStyle);
  }
  // ====================================================================================================================
  //  . . . ДЕЙСТВИЯ ПРИ НАВОДКЕ НА .cat . . .
  // ====================================================================================================================
  document.addEventListener("mouseover", (event) => {
    const catElement = event.target.closest(".cat");

    if (catElement) {
      const catTooltip = catElement.querySelector(".cat_tooltip");

      if (
        settings.showMoreCatInfo &&
        !catTooltip.querySelector(".more-info-link")
      ) {
        const moreInfoLink = document.createElement("a");
        moreInfoLink.classList.add("more-info-link");
        moreInfoLink.textContent = "Подробнее";
        moreInfoLink.addEventListener("click", () => {
          showCatInfo(catElement);
        });

        const moreInfoContainer = document.createElement("div");
        moreInfoContainer.classList.add("more-info-container");
        moreInfoContainer.appendChild(moreInfoLink);

        const onlineSpan = catTooltip.querySelector("span.online");
        onlineSpan.parentNode.insertBefore(moreInfoContainer, onlineSpan);
      }

      if (settings.compactMouth) {
        compactInventory(catElement);
      }

      if (
        settings.personalCostumes &&
        settings.showCostumesButtons &&
        !catTooltip.querySelector(".save-costume-button")
      ) {
        const costumeDivs = catElement.querySelectorAll(
          "div[data-v-59afe5e8]:not(.first)"
        );

        const matchingCostumes = Array.from(costumeDivs).filter((div) =>
          div.style.backgroundImage
            .slice(5, -2)
            .startsWith("/cw3/cats/0/costume/")
        );

        if (matchingCostumes.length > 0) {
          const saveCostume = document.createElement("button");
          saveCostume.textContent = "Сохранить костюм";
          saveCostume.classList.add("save-costume-button");
          saveCostume.addEventListener("click", () => {
            const costumeImages = matchingCostumes.map((costume) =>
              costume.style.backgroundImage.slice(5, -2)
            );
            createCostumeSavePopup(costumeImages);
          });

          catTooltip.appendChild(saveCostume);
        }
      }
    }
  });
  // ====================================================================================================================
  //  . . . КОМПАКТНЫЙ РОТ АХХАХХА . . .
  // ====================================================================================================================
  function compactInventory(cat) {
    const originalMouth = cat.querySelector(".cat_tooltip .mouth");

    if (originalMouth) {
      const existingSortedMouths = cat.querySelectorAll(".mouth.uwu-sorted");
      existingSortedMouths.forEach((mouth) => mouth.remove());

      const newMouth = document.createElement("ol");
      newMouth.classList.add("mouth", "uwu-sorted");
      originalMouth.parentNode.insertBefore(
        newMouth,
        originalMouth.nextSibling
      );

      originalMouth.style.display = "none";

      const inventory = new Map();
      const cats = [];

      [...originalMouth.querySelectorAll("li img")].forEach((img) => {
        const itemSrc = img.getAttribute("src");
        inventory.set(itemSrc, (inventory.get(itemSrc) || 0) + 1);
      });

      [...originalMouth.querySelectorAll("li")].forEach((item) => {
        if (!item.querySelector("img")) {
          cats.push(item.innerHTML);
        }
      });

      newMouth.innerHTML = "";
      for (const [itemSrc, count] of inventory) {
        const listItem = document.createElement("li");
        const itemImage = document.createElement("img");
        itemImage.setAttribute("src", itemSrc);
        listItem.appendChild(itemImage);

        if (count > 1) {
          const countSpan = document.createElement("span");
          countSpan.textContent = `x${count}`;
          listItem.appendChild(countSpan);
        }

        newMouth.appendChild(listItem);
      }

      cats.forEach((catHtml) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = catHtml;
        newMouth.appendChild(listItem);
      });
    }
  }
  // ====================================================================================================================
  //  . . . ИНФОРМАЦИОННЫЙ КОНТЕЙНЕР . . .
  // ====================================================================================================================
  let globalContainer = document.getElementById("uwu-global-container");
  if (!globalContainer) {
    globalContainer = document.createElement("div");
    globalContainer.id = "uwu-global-container";
    globalContainer.style.display = "none";
    document.body.appendChild(globalContainer);
  }

  function createCatInfoContainer() {
    const catInfoElement = document.createElement("div");
    catInfoElement.classList.add("cat-info");

    const contentContainer = document.createElement("div");
    contentContainer.classList.add("content-container");
    catInfoElement.appendChild(contentContainer);

    const closeButton = document.createElement("button");
    closeButton.textContent = "Закрыть";
    closeButton.classList.add("close-info");
    closeButton.addEventListener("click", () => {
      globalContainer.removeChild(catInfoElement);
    });
    catInfoElement.appendChild(closeButton);

    const css_catDefects = document.createElement("style");
    css_catDefects.innerHTML =
      // css
      `
      .cat-info {
        pointer-events: auto;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 20px;
        border-radius: 5px;
        box-shadow: 0 0 10px #00000033;
        z-index: 5;
        width: 300px;
        text-align: center;
        display: block;
        background-color: white;
        color: black;
      }

      .other-cat-info-container {
      display: grid;
      grid-template-columns: 1fr 2fr;
      }
    
      .close-info-container {
        text-align: right;
      }
    
      .close-info {
        cursor: pointer;
      }
    
      .more-info-container {
        cursor: pointer;
      }

      .parameter-details-container {
        text-align: left;
      }

      .cat-details {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        margin-left: 8px;
        text-align: left;
      }

      .cat-details > p,
      .cat-details > div > p {
        margin-top: 5px;
        margin-bottom: 5px;
        text-align: left;
        width: 100%;
      }

      #uwu-global-container > div.cat-info > div > div > div.cat-details > div {
        margin-top: 8px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        width: 100%;
      }
    `;

    document.head.appendChild(css_catDefects);

    return { catInfoElement, contentContainer };
  }
  // ====================================================================================================================
  //  . . . БОЛЬШЕ ИНФОРМАЦИИ В "О КОТЕ" . . .
  // ====================================================================================================================
  const defectsInfo = {
    wound: {
      name: "Раны",
      states: {
        1: "царапины",
        2: "лёгкие раны",
        3: "глубокие раны",
        4: "смертельные раны",
      },
    },
    poisoning: {
      name: "Отравление",
      states: {
        1: "недомогание",
        2: "лёгкое отравление",
        3: "сильное отравление",
        4: "смертельное отравление",
      },
    },
    drown: {
      name: "Травмы от утопления",
      states: {
        1: "ссадины",
        2: "небольшие кровоподтёки",
        3: "сильные травмы",
        4: "смертельные травмы",
      },
    },
    disease: {
      name: "Болезнь",
      states: {
        1: "кашель",
        2: "кашель",
        3: "кашель",
        4: "кашель",
      },
    },
    trauma: {
      name: "Переломы",
      states: {
        1: "синяки",
        2: "лёгкие ушибы",
        3: "сильные ушибы",
        4: "смертельные ушибы",
      },
    },
    dirt: {
      name: "Грязь",
      states: {
        1: "грязные лапы",
        2: "грязевые пятна",
        3: "клещи",
        4: "блохи",
      },
    },
  };

  function showCatInfo(cat) {
    const catName = cat.querySelector(".cat_tooltip a").textContent;
    const catSize = cat.querySelector(".d .first").style.backgroundSize;
    const catImage = cat
      .querySelector(".d .first")
      .style.backgroundImage.slice(5, -2);

    const defectElements = Array.from(
      cat.querySelectorAll(".d > div:not(.first)")
    );

    const uniqueDefects = new Set();

    const catDefects = defectElements
      .map((element) => {
        const defectUrl = element.style.backgroundImage;

        if (defectUrl.includes("/defects/")) {
          const defectParts = defectUrl.split("/");
          const lastPart = defectParts.pop();
          const defectLevel = parseInt(lastPart.split("/")[0]);
          const defectType = defectParts[5];
          const defectKey = `${defectType}-${defectLevel}`;

          if (!uniqueDefects.has(defectKey)) {
            uniqueDefects.add(defectKey);
            return { type: defectType, level: defectLevel };
          }
        }
        return null;
      })
      .filter(Boolean);

    const catId = cat
      .querySelector(".cat_tooltip a")
      .getAttribute("href")
      .slice(4);

    let { catInfoElement, contentContainer } = createCatInfoContainer();

    contentContainer.innerHTML =
      // html
      `
      <h2>${catName}</h2>
      <div class="other-cat-info-container">
        <div>
          <img src="${catImage}" class="cat-image">
        </div>
        <div class="cat-details">
          <p><strong>ID</strong>: ${catId}</p>
          <p><strong>Размер</strong>: ${catSize}</p>
        </div>
      </div>
    `;

    const defectsContainer = document.createElement("div");
    if (catDefects.length > 0) {
      defectsContainer.innerHTML = "<p>Дефекты:</p>";
      catDefects.forEach((defect) => {
        const defectData = defectsInfo[defect.type];
        if (defectData) {
          const defectState = defectData.states[defect.level] || "";
          const defectLine = document.createElement("p");
          const defectNameSpan = document.createElement("strong");
          defectNameSpan.textContent = defectData.name;
          defectLine.appendChild(defectNameSpan);
          defectLine.insertAdjacentHTML(
            "beforeend",
            ` (${defect.level} стадия, ${defectState})`
          );

          defectsContainer.appendChild(defectLine);
        }
      });
      contentContainer
        .querySelector(".cat-details")
        .appendChild(defectsContainer);
    } else {
      contentContainer.querySelector(".cat-details").innerHTML +=
        "<p><strong>Здоровый</strong></p>";
    }

    globalContainer.appendChild(catInfoElement);
  }
  // ====================================================================================================================
  //  . . . СОБСТВЕННЫЙ ФОН ЛОКАЦИИ ИГРОВОЙ . . .
  // ====================================================================================================================
  if (settings.gameFieldBackgroundUser) {
    const css_gameField = document.createElement("style");
    css_gameField.textContent = `
      #cages_div {
          background-image: url(${settings.gameFieldBackgroundUserImageURL}) !important;
      }
  `;
    document.head.appendChild(css_gameField);
  }
  // ====================================================================================================================
  //  . . . ГРАНИЦЫ ЯЧЕЕК . . . cellsNumbers
  // ====================================================================================================================
  function updateCellsBordersStyle(checked) {
    if (!settings) loadSettings();

    let styleElement = document.getElementById("cellsBordersStyle");
    const thickness = settings?.cellsBordersThickness || settingsMap?.uwu_settings?.cellsBordersThickness || "1";
    const color = settings?.cellsBordersColor || uwuDefaultSettings.cellsBordersColor || "#ffffff";

    const cellsBordersStyle = `
      .cage {
        box-shadow: inset 0 0 0 0.${thickness}px ${color};
      }
    `;

    if (checked) {
      if (!styleElement) {
        styleElement = document.createElement("style");
        styleElement.id = "cellsBordersStyle";
        styleElement.innerHTML = cellsBordersStyle;
        document.head.appendChild(styleElement);
      }
    } else {
      if (styleElement) {
        document.head.removeChild(styleElement);
      }
    }
  }
  // ====================================================================================================================
  //  . . . НУМЕРАЦИЯ ЯЧЕЕК . . .
  // ====================================================================================================================
  if (settings.cellsNumbers) {
    function createCellNumbers(style) {
      let css =
        /* CSS */
        `
        #cages_div { position: relative; }
        #cages > tbody > tr > td { position: relative; }
        #cages > tbody > tr > td::after { 
          content: attr(data-cell-num);
          position: absolute; 
          z-index: 2;
          top: 5px; 
          right: 5px;
          color: ${style.color || "#000"}; 
          opacity: ${style.opacity || 0.4}; 
          font-size: 16px; 
          font-weight: bold;
        }
      `;

      let cagesNums = document.createElement("style");
      cagesNums.id = "cages_nums";
      cagesNums.innerHTML = css;
      document.head.appendChild(cagesNums);

      let table = document.getElementById("cages");
      if (!table) return;
      let rows = table.querySelectorAll("tbody > tr");
      for (let i = 0; i < rows.length; i++) {
        let cells = rows[i].querySelectorAll("td");
        for (let j = 0; j < cells.length; j++) {
          cells[j].setAttribute("data-cell-num", (j + 1).toString());
        }
      }
    }

    createCellNumbers({
      color: "white",
      opacity: 0.8,
    });
  }

  // ====================================================================================================================
  //   . . . ИСТОРИЯ ПРОКАЧКИ БУ . . .
  // ====================================================================================================================
  if (settings.showMightHistory) {
    const updateMightHistory = (newVal) => {
      if (!newVal || !newVal.tooltip) return;
      
      const match = newVal.tooltip.match(/\((\d+)\/([^\)]+)\)/);
      if (!match) return;
      
      const currentVal = parseInt(match[1], 10);
      const currentMaxRaw = match[2].trim();
      const currentMax = isNaN(parseInt(currentMaxRaw, 10)) ? null : parseInt(currentMaxRaw, 10);
      
      const rawHistoryData = uwuStorage.getItem("uwu_mightHistory");
      let historyData = (rawHistoryData && typeof rawHistoryData === "object" && !Array.isArray(rawHistoryData))
          ? rawHistoryData
          : { logs: [] };

      if (!Array.isArray(historyData.logs)) {
        historyData.logs = [];
      }

      if (historyData.lastVal === undefined || historyData.lastVal === null) {
        const now = new Date();
        historyData.lastVal = currentVal;
        historyData.lastMax = currentMax;
        historyData.logs = [{
          val: currentVal,
          max: currentMaxRaw,
          diff: "Старт",
          time: `${String(now.getDate()).padStart(2, '0')}.${String(now.getMonth() + 1).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
        }];
        uwuStorage.setItem("uwu_mightHistory", historyData);
        return;
      }

      if (historyData.lastVal !== currentVal || historyData.lastMax !== currentMax) {
        let diff = 0;
        if (typeof currentMax === 'number' && typeof historyData.lastMax === 'number' && currentMax > historyData.lastMax) {
          diff = (historyData.lastMax - historyData.lastVal) + currentVal;
        } else {
          diff = currentVal - historyData.lastVal;
        }

        if (diff !== 0 && !isNaN(diff)) {
          const now = new Date();
          historyData.logs.unshift({
            val: currentVal,
            max: currentMaxRaw,
            diff: diff > 0 ? `+${diff}` : diff,
            time: `${String(now.getDate()).padStart(2, '0')}.${String(now.getMonth() + 1).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
          });

          if (historyData.logs.length > 100) historyData.logs.pop();

          historyData.lastVal = currentVal;
          historyData.lastMax = currentMax;
          uwuStorage.setItem("uwu_mightHistory", historyData);
        }
      }
    };

    const showMightHistoryModal = () => {
      let { catInfoElement, contentContainer } = createCatInfoContainer();
      
      const rawHistoryData = uwuStorage.getItem("uwu_mightHistory");
      const logs = (rawHistoryData && Array.isArray(rawHistoryData.logs)) ? rawHistoryData.logs : [];
      
      catInfoElement.style.width = "350px";
      contentContainer.style.paddingBottom = "10px";

      const escape = (str) => {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
      };

      contentContainer.innerHTML = `
        <h2 style="letter-spacing: 2px; margin-bottom: 15px;">ИСТОРИЯ БУ</h2>
        <div style="max-height: 400px; overflow-y: auto; border-radius: 5px; background: rgba(0,0,0,0.1); border: 1px solid rgba(255,255,255,0.05);">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <thead>
              <tr style="border-bottom: 2px solid #ffffff1a; opacity: 0.7; position: sticky; top: 0; background: #222; z-index: 1;">
                <th style="padding: 8px;">Дата</th><th style="padding: 8px;">БУ/Макс</th><th style="padding: 8px;">Прирост</th>
              </tr>
            </thead>
            <tbody>
              ${logs.length ? logs.map(l => `
                <tr style="border-bottom: 1px solid #ffffff05;">
                  <td style="padding: 6px; opacity: 0.8;">${escape(l.time)}</td>
                  <td style="padding: 6px;"><b>${escape(l.val)}</b><small>/${escape(l.max)}</small></td>
                  <td style="padding: 6px; color: ${l.diff.toString().includes('+') ? '#41cd70' : (l.diff === 'Старт' ? '#83e5ff' : '#cd4141')}; font-weight: bold;">${escape(l.diff)}</td>
                </tr>
              `).join('') : '<tr><td colspan="3" style="padding: 20px; opacity: 0.5; text-align: center;">Истории пока нет...</td></tr>'}
            </tbody>
          </table>
        </div>
        <div style="margin-top: 20px; display: flex; justify-content: center; width: 100%;">
             ${logs.length ? '<button type="button" class="uwu-reset-might-btn uwu-button remove-button" style="padding: 5px 15px; font-size: 12px; cursor: pointer;">Очистить историю</button>' : ''}
        </div>
      `;

      const resetBtn = contentContainer.querySelector('.uwu-reset-might-btn');
      if (resetBtn) {
        resetBtn.addEventListener('click', (e) => {
          if (confirm("Удалить все записи? Текущие значения станут новой точкой отсчета.")) {
            const currentData = getVueData('parameter.data.might');
            const match = currentData?.tooltip?.match(/\((\d+)\/([^\)]+)\)/);
            
            if (match) {
              const cVal = parseInt(match[1], 10);
              const cMaxRaw = match[2].trim();
              const cMax = isNaN(parseInt(cMaxRaw, 10)) ? null : parseInt(cMaxRaw, 10);
              const now = new Date();

              uwuStorage.setItem("uwu_mightHistory", { 
                lastVal: cVal, 
                lastMax: cMax, 
                logs: [{
                  val: cVal, max: cMaxRaw, diff: "Старт",
                  time: `${String(now.getDate()).padStart(2, '0')}.${String(now.getMonth() + 1).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
                }] 
              });
            } else {
              uwuStorage.removeItem("uwu_mightHistory");
            }
            if (globalContainer.contains(catInfoElement)) globalContainer.removeChild(catInfoElement);
          }
        });
      }

      globalContainer.appendChild(catInfoElement);
    };

    setupSingleCallback("#parameters_skills_block", () => {
      const parent = document.getElementById('parameters_skills_block');
      if (!parent || document.getElementById('uwu-open-might-history')) return;

      const btnLink = document.createElement('div');
      btnLink.style.cssText = 'text-align: center; margin-top: 5px;';
      btnLink.innerHTML = `<a href="#" id="uwu-open-might-history" style="font-size: 11px; opacity: 0.6; text-decoration: underline; color: inherit;">История прокачки БУ</a>`;
      parent.appendChild(btnLink);

      document.getElementById('uwu-open-might-history').onclick = (e) => {
        e.preventDefault();
        showMightHistoryModal();
      };
    });

    watchVueData('parameter.data.might', (newVal) => {
      updateMightHistory(newVal);
    }, { deep: true, immediate: true });
  }

  // ====================================================================================================================
  //   . . . ПОДРОБНЕЕ О ПАРАМЕТРАХ (И НАВЫКОВ?) . . .
  // ====================================================================================================================
  function createMoreInfoButton() {
    const parametersBlock = document.getElementById("parameters_skills_block");

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("button-container");
    buttonContainer.style.paddingBottom = "5px";

    const moreInfoLink = document.createElement("a");
    moreInfoLink.href = "#";
    moreInfoLink.textContent = "Подробнее";
    moreInfoLink.classList.add("more-info-link");
    moreInfoLink.addEventListener("click", (event) => {
      event.preventDefault();
      showParameterDetails();
    });

    buttonContainer.appendChild(moreInfoLink);

    parametersBlock.insertBefore(buttonContainer, parametersBlock.firstChild);
  }

  const maxWidthPx = 150;

  /**
   * Calculates and displays a modal dialog with precise parameter percentages and estimated recovery timers.
   * Pulls live data directly from the reactive Vue state.
   */
  function showParameterDetails() {
    const paramData = getVueData("parameter.data") || {};

    const parametersConfig = [
      {
        id: "dream",
        name: "Бодрость",
        formula: (percentageLoss) => {
          if (percentageLoss <= 0) return 0;
          let totalTime = 0;
          for (let i = 1; i <= percentageLoss; i++) {
            if (i <= 2) {
              totalTime += 20;
            } else if (i % 2 !== 0) {
              totalTime += 40;
            } else {
              totalTime += 20;
            }
          }
          return totalTime;
        },
      },
      {
        id: "hunger",
        name: "Голод",
        formula: (percentageLoss) => Math.ceil((percentageLoss / 100) * 9) * 15,
      },
      { id: "thirst", name: "Жажда", timePerPercent: 90 },
      { id: "need", name: "Нужда", timePerPercent: 45 },
      { id: "health", name: "Здоровье" },
      {
        id: "clean",
        name: "Чистота",
        formula: (percentageLoss) => percentageLoss * 100,
      },
    ];

    let { catInfoElement, contentContainer } = createCatInfoContainer();
    contentContainer.classList.add("parameter-details-container");

    parametersConfig.forEach(({ id, name, formula, timePerPercent }) => {
      const rawParam = paramData[id];
      let percentage = 0;

      if (rawParam && typeof rawParam.barWidth === "number") {
        percentage = rawParam.barWidth;
      } else {
        // Fallback to DOM if Vue state is unavailable
        const el = document.getElementById(id);
        const text = el?.querySelector(".bar-data")?.textContent || "";
        const match = text.match(/(\d+)%/);
        percentage = match ? parseInt(match[1], 10) : 0;
      }

      const effectivePercentage = ["hunger", "thirst", "need"].includes(id)
        ? 100 - percentage
        : percentage;
      const reversePercentage = 100 - effectivePercentage;

      let timeInfo = "";
      let totalTimeSeconds;

      if (formula) {
        totalTimeSeconds = formula(reversePercentage);
      } else if (timePerPercent) {
        totalTimeSeconds = reversePercentage * timePerPercent;
      }

      if (totalTimeSeconds !== undefined && reversePercentage > 0) {
        const hours = Math.floor(totalTimeSeconds / 3600);
        const minutes = Math.floor((totalTimeSeconds % 3600) / 60);
        const seconds = Math.ceil(totalTimeSeconds % 60);

        if (hours > 0) {
          timeInfo = ` (> ${hours} ч ${minutes} мин)`;
        } else if (minutes > 0) {
          timeInfo = ` (${minutes} мин ${seconds} сек)`;
        } else {
          timeInfo = ` (${seconds} сек)`;
        }
      }

      const detailLine = document.createElement("p");
      detailLine.innerHTML = `<strong>${name}:</strong> <span style="color: #00cc00;">${effectivePercentage}%</span> / <span style="color: red;">${reversePercentage}%</span>`;
      detailLine.style.marginBottom = "0";
      contentContainer.appendChild(detailLine);

      if (timeInfo) {
        const detailLineTime = document.createElement("p");
        detailLineTime.innerHTML = `≈${timeInfo}`;
        detailLineTime.style.marginTop = "0";
        contentContainer.appendChild(detailLineTime);
      }
    });

    globalContainer.appendChild(catInfoElement);
  }

  if (settings.showParametersDetails) {
    setupSingleCallback("#parameters_skills_block", createMoreInfoButton);
  }

  // ====================================================================================================================
  //   . . . ТОЧНЫЕ ЗНАЧЕНИЯ НАВЫКОВ . . .
  // ====================================================================================================================
  if (settings.showExactSkillsValues) {
    const updateExactSkills = () => {
      const paramData = getVueData('parameter.data');
      if (!paramData) return;

      const skills = ['smell', 'dig', 'swim', 'might', 'tree', 'observ', 'heal', 'power', 'pet_faith'];

      skills.forEach(skillId => {
        const skillInfo = paramData[skillId];
        if (skillInfo && skillInfo.tooltip && !skillInfo.isHidden) {
          const skillElement = document.getElementById(skillId);
          if (skillElement) {
            const bar = skillElement.querySelector('.bar');
            if (bar) {
              let barData = bar.querySelector('.bar-data') || (() => {
                const el = document.createElement('div');
                el.className = 'bar-data';
                bar.appendChild(el);
                return el;
              })();

              const match = skillInfo.tooltip.match(/\((.*?)\)/);
              const newValue = match ? match[1] : skillInfo.tooltip;

              if (barData.textContent !== newValue) {
                barData.textContent = newValue;
              }
            }
          }
        }
      });
    };

    watchVueData('parameter.data', updateExactSkills, { deep: true, immediate: true });

    const css_skillsBarData = document.createElement("style");
    css_skillsBarData.innerHTML = `
      .skill .bar {
        position: relative;
      }
      .skill .bar-data {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        text-align: center;
        font-size: 10px;
        color: white;
        pointer-events: none;
        line-height: 15px;
        z-index: 2;
      }
    `;
    document.head.appendChild(css_skillsBarData);
  }
  // ====================================================================================================================
  //   . . . ЧИСЛОВАЯ ГРОМКОСТЬ УВЕДОМЛЕНИЙ . . .
  // ====================================================================================================================
  if (settings.climbingNotificationsNumbers) {
    function addClimbingNotificationsStyles() {
      const styles = Array.from(
        { length: 11 },
        (_, i) => `
          .vlm${i} > .nick[style*="italic"]:after,
          .vlm${i} > .nick.is-notification:after {
            content: " [${i}]";
          }
        `
      ).join("");

      const styleElement = document.createElement("style");
      styleElement.textContent = styles;
      document.head.appendChild(styleElement);
    }

    addClimbingNotificationsStyles();
  }
  // ====================================================================================================================
  //   . . . ЗВУКОВОЕ УВЕДОМЛЕНИЕ ПРИ ОБНОВЛЕНИИ КЛЕТОК . . .
  // ====================================================================================================================
  // TODO - debounceTimer, если не сработает решение со сравнением историй. P.S. Вроде работает.
  if (settings.climbingRefreshNotification) {
    function handleClimbingRefresh() {
      const refreshRegex = /Услышала? оглушительн/;
      let previousHistory = "";

      const updateHistory = () => {
        const istElement = document.getElementById("ist");
        const currentHistory = istElement.innerHTML;

        if (currentHistory !== previousHistory) {
          previousHistory = currentHistory;

          const entries = currentHistory.split(".");
          const lastEntry = entries[entries.length - 2];

          if (lastEntry !== undefined && refreshRegex.test(lastEntry)) {
            const lastPlayedEntry = entries[entries.length - 3];

            if (!lastPlayedEntry || !refreshRegex.test(lastPlayedEntry)) {
              soundManager.playSound(
                settings.climbingRefreshNotificationSound,
                settings.climbingRefreshNotificationVolume
              );
            }
          }
        }
      };

      const historyBlock = document.getElementById("history_block");
      const observer = new MutationObserver(() => {
        updateHistory();
      });

      const config = {
        childList: true,
        subtree: true,
        characterData: true,
      };
      observer.observe(historyBlock, config);
    }

    handleClimbingRefresh();
  }
  // ====================================================================================================================
  //   . . . МИННОЕ ПОЛЕ . . .
  // ====================================================================================================================
  // Вторая по ненависти работа с кодами. Но уже к самому себе а не к сайту.........
  // чат уже ничего не перебьёт....... наверно????????????
  // TODO - Переписать всё это мессиво к чертям, это кошмар какой-то. Как оно вообще ещё работает?????? Что я употреблял?????????????????????
  if (settings.climbingPanel) {
    let isDragging = false;
    let initialX;
    let initialY;
    let currentX;
    let currentY;
    let wasDragging = false;

    function saveClimbingPanelStatus() {
      const status = {
        x: currentX,
        y: currentY,
        isOpen: climbingPanelContainer.classList.contains("open"),
        isChecked: transferCheckbox.checked,
        currentTabIndex: tabManager.currentTabIndex,
        currentTableId: tabManager.currentTableId,
      };
      uwuStorage.setItem("uwu_climbingPanelStatus", status);
    }

    function loadClimbingPanelStatus() {
      const savedStatus = uwuStorage.getItem("uwu_climbingPanelStatus");
      const arrow = document.getElementById("uwu-arrow");

      if (savedStatus) {
        const status = savedStatus;

        currentX = status.x;
        currentY = status.y;

        climbingPanelContainer.classList.toggle("open", status.isOpen);

        if (status.isOpen) {
          arrow.textContent = "▼";
        } else {
          arrow.textContent = "▶";
        }

        transferCheckbox.checked = status.isChecked;

        tabManager.currentTabIndex = status.currentTabIndex;
        if (
          status.currentTableId !== null &&
          tabManager.tabs[status.currentTabIndex].tables[status.currentTableId]
        ) {
          tabManager.currentTableId = status.currentTableId;
        }

        tabManager.render();

        if (status.isChecked) {
          transferColors();
        }
      } else {
        tabManager.render();
        arrow.textContent = "▶";
      }

      checkAndResetPanelPosition();
    }

    function updateCell(cell, value) {
      cell.dataset.value = value || "";
      cell.textContent = value === "mine" || value === "transit" ? "" : value;
      switch (value) {
        case "mine":
          cell.style.backgroundColor = "#5b000073";
          break;
        case "transit":
          cell.style.backgroundColor = "#ffffff87";
          break;
        default:
          cell.style.backgroundColor = "";
      }
    }

    function transferColors() {
      const transferCheckbox = document.getElementById("uwu-transferCheckbox");
      let styleTag = document.getElementById(
        "uwu-climbing-panel-dynamic-styles"
      );

      if (!styleTag) {
        styleTag = document.createElement("style");
        styleTag.id = "uwu-climbing-panel-dynamic-styles";
        document.head.appendChild(styleTag);
      }

      if (!transferCheckbox.checked) {
        styleTag.innerHTML = "";
        return;
      }

      const climbingPanelCells = Array.from(
        document.querySelectorAll("#uwu-climbingPanel td")
      );

      let newCssRules = "";
      const numCols = 10;

      climbingPanelCells.forEach((cell, i) => {
        const color = getComputedStyle(cell).backgroundColor;
        if (color && color !== "rgba(0, 0, 0, 0)" && color !== "transparent") {
          const rowIndex = Math.floor(i / numCols) + 1;
          const colIndex = (i % numCols) + 1;
          newCssRules += `#cages > tbody > tr:nth-of-type(${rowIndex}) > td:nth-of-type(${colIndex})::before { background-color: ${color}; }\n`;
        }
      });

      styleTag.innerHTML = newCssRules;
    }

    function clearColors() {
      const styleTag = document.getElementById(
        "uwu-climbing-panel-dynamic-styles"
      );
      if (styleTag) {
        styleTag.innerHTML = "";
      }
    }

    let lastClickedCell = null;

    function handleCellClick(event) {
      const cell = event.target.closest("td");
      if (!cell || !cell.closest("#uwu-climbingPanel")) return;

      if (settings.climbingPanelInputsStyle === "standart") {
        updateCell(cell, activeInputValue);
        saveTableData(tabManager.currentTableId);
        transferColors();
      } else {
        if (lastClickedCell === cell) {
          updateCell(cell, "");
          saveTableData(tabManager.currentTableId);
          transferColors();
          lastClickedCell = null;
        } else {
          lastClickedCell = cell;
        }
      }
    }

    function handleKeyDown(event) {
      const keyPressed = event.key;
      const activeElement = document.activeElement;

      if (
        activeElement &&
        activeElement.tagName === "TD" &&
        activeElement.closest("#uwu-climbingPanel")
      ) {
        switch (keyPressed) {
          case "0":
          case "1":
          case "2":
          case "3":
          case "4":
          case "5":
          case "6":
          case "7":
            updateCell(activeElement, keyPressed);
            break;
          case "-":
            updateCell(activeElement, "mine");
            break;
          case "=":
            updateCell(activeElement, "transit");
            break;
          default:
            return;
        }

        saveTableData(tabManager.currentTableId);
        transferColors();
      }
    }

    function handleTransferCheckboxChange(event) {
      event.target.checked ? transferColors() : clearColors();
      saveClimbingPanelStatus();
    }

    let activeInputValue = "0";

    const uwuClimbingPanelContainer =
      /* HTML */
      `
        <div id="uwu-climbingMainPanel">
          <div id="uwu-climbingPanelButton">
            <div class="left-content">
              <h2>Минное поле</h2>
            </div>
            <div class="right-content">
              <span id="uwu-arrow">▶</span>
            </div>
          </div>
          <div id="uwu-climbingPanelContainer">
            <div id="uwu-climbingPanelContent">
              <div id="uwu-buttonContainer">
                <div id="uwu-inputButtons" style="display: none;">
                  <button value="0">0</button>
                  <button value="1">1</button>
                  <button value="2">2</button>
                  <button value="3">3</button>
                  <button value="4">4</button>
                  <button value="5">5</button>
                  <button value="6">6</button>
                  <button value="7">7</button>
                  <button value="transit">Переход</button>
                  <button value="mine">Мина</button>
                  <button value="">Очистить</button>
                </div>
                <h3>Вкладка</h3>
                <div id="uwu-buttonRow1"></div>
                <hr id="uwu-hr" />
                <h3>Локация</h3>
                <div id="uwu-buttonRow2"></div>
              </div>
              <div id="uwu-functionButtonsContainer">
                <input type="checkbox" id="uwu-transferCheckbox" />
                <label for="uwu-transferCheckbox"
                  >Перенос на Игровое поле</label
                >
              </div>
              <div id="uwu-tableContainer"></div>
            </div>
          </div>
        </div>
      `;

    function createClimbingPanel() {
      const globalContainer = document.getElementById("uwu-global-container");
      globalContainer.insertAdjacentHTML(
        "beforeend",
        uwuClimbingPanelContainer
      );

      const transferCheckbox = document.getElementById("uwu-transferCheckbox");

      if (settings.climbingPanelInputsStyle === "standart") {
        setupInputButtons();
      }

      document.addEventListener("keydown", handleKeyDown);
      transferCheckbox.addEventListener("change", handleTransferCheckboxChange);
    }

    function setupInputButtons() {
      const inputButtonsContainer = document.getElementById("uwu-inputButtons");
      inputButtonsContainer.style.display = "flex";
      inputButtonsContainer.style.flexWrap = "wrap";

      const inputButtons = inputButtonsContainer.querySelectorAll("button");
      inputButtons.forEach((button) => {
        button.addEventListener("click", () => {
          activeInputValue = button.value;
          updateInputButtonsStyle();
        });
      });
      updateInputButtonsStyle();
    }

    function updateInputButtonsStyle() {
      const inputButtons = document.querySelectorAll(
        "#uwu-inputButtons button"
      );
      inputButtons.forEach((button) => {
        button.classList.toggle("active", button.value === activeInputValue);
      });
    }

    function saveTableData(tableIndex) {
      const climbingPanel = document.getElementById("uwu-climbingPanel");
      if (!climbingPanel) return;

      const tableData = getTableData(climbingPanel.id);
      const currentTab = tabManager.tabs[tabManager.currentTabIndex];
      currentTab.tables[tableIndex] = {
        name: currentTab.tables[tableIndex].name,
        data: tableData,
      };
      tabManager.saveState();
    }

    function clearTable() {
      const climbingPanel = document.getElementById("uwu-climbingPanel");
      if (!climbingPanel) return;

      const cells = Array.from(climbingPanel.querySelectorAll("td"));
      cells.forEach((cell) => {
        if (cell.dataset.value !== "transit") {
          updateCell(cell, "");
        }
      });

      const currentTab = tabManager.tabs[tabManager.currentTabIndex];
      currentTab.tables[tabManager.currentTableId] = {
        name: currentTab.tables[tabManager.currentTableId].name,
        data: getTableData(climbingPanel.id),
      };
      tabManager.saveState();
      transferColors();
    }

    const tabManager = {
      tabs: [],
      currentTabIndex: 0,
      currentTableId: 0,

      createTab(name) {
        const newTab = {
          name: name,
          tables: [],
        };

        this.tabs.push(newTab);
        this.render();
        this.switchTab(this.tabs.length - 1);
      },

      switchTab(index) {
        this.currentTabIndex = index;
        const currentTab = this.tabs[this.currentTabIndex];
        this.currentTableId =
          currentTab && currentTab.tables.length > 0 ? 0 : null;

        if (currentTab && currentTab.tables.length === 0) {
          this.renderNoTableMessage();
        } else {
          this.render();
        }

        transferColors();
        saveClimbingPanelStatus();
      },

      switchTable(tableIndex) {
        this.currentTableId = tableIndex;
        this.render();
        transferColors();
        saveClimbingPanelStatus();
      },

      saveState() {
        uwuStorage.setItem("uwu_climbingPanelState", this);
      },

      render() {
        this.renderTabs();
        this.renderTables();
        if (this.currentTableId !== null) {
          this.renderTable(this.currentTableId);
        }
      },

      renderTabs() {
        const tabRow = document.getElementById("uwu-buttonRow1");
        tabRow.innerHTML = "";

        this.tabs.forEach((tab, index) => {
          const tabButton = document.createElement("button");
          tabButton.textContent = tab.name;
          tabButton.classList.add("tab-button");

          if (index === this.currentTabIndex) {
            tabButton.classList.add("active");
          }

          tabButton.addEventListener("click", () => this.switchTab(index));

          const tabContainer = document.createElement("div");
          tabContainer.classList.add("tab-container");
          tabContainer.appendChild(tabButton);

          tabRow.appendChild(tabContainer);
        });
      },

      renderTables() {
        const tableRow = document.getElementById("uwu-buttonRow2");
        tableRow.innerHTML = "";

        const currentTab = this.tabs[this.currentTabIndex];
        if (currentTab) {
          currentTab.tables.forEach((table, index) => {
            const tableButton = document.createElement("button");
            tableButton.textContent = table.name || `Локация ${index + 1}`;
            tableButton.classList.add("table-button");

            if (index === this.currentTableId) {
              tableButton.classList.add("active");
            }

            tableButton.addEventListener("click", () =>
              this.switchTable(index)
            );

            const tableContainer = document.createElement("div");
            tableContainer.classList.add("table-container");
            tableContainer.appendChild(tableButton);

            tableRow.appendChild(tableContainer);
          });
        }
      },

      renderTable(tableIndex) {
        const tableContainer = document.getElementById("uwu-tableContainer");
        tableContainer.innerHTML = "";

        const currentTab = this.tabs[this.currentTabIndex];
        const climbingPanel = document.createElement("table");
        climbingPanel.id = "uwu-climbingPanel";

        for (let i = 0; i < 6; i++) {
          const row = document.createElement("tr");
          for (let j = 0; j < 10; j++) {
            const cell = document.createElement("td");
            cell.setAttribute("tabindex", "0");
            cell.addEventListener("click", handleCellClick);
            row.appendChild(cell);
          }
          climbingPanel.appendChild(row);
        }

        const tableData = currentTab.tables[tableIndex]?.data;

        if (tableData) {
          tableData.forEach((rowData, i) => {
            rowData.forEach((cellData, j) => {
              updateCell(climbingPanel.rows[i].cells[j], cellData.value);
            });
          });
        }

        tableContainer.appendChild(climbingPanel);

        const clearButton = document.createElement("button");
        clearButton.textContent = "Очистить всё поле/таблицу";
        clearButton.id = "button-clear-table";
        clearButton.addEventListener("click", clearTable);
        tableContainer.appendChild(clearButton);
      },

      renderNoTableMessage() {
        const tableContainer = document.getElementById("uwu-tableContainer");
        tableContainer.innerHTML = "";

        const message = document.createElement("div");
        message.textContent = "Добавьте поле/таблицу в настройках";
        message.style.textAlign = "center";
        message.style.marginTop = "20px";
        tableContainer.appendChild(message);

        this.renderTabs();
        this.renderTables();
      },
    };

    function loadSavedState() {
      const savedState = uwuStorage.getItem("uwu_climbingPanelState");
      if (savedState) {
        const state = savedState;
        Object.assign(tabManager, state);
        tabManager.currentTabIndex = 0;

        const currentTab = tabManager.tabs[tabManager.currentTabIndex];
        if (currentTab && currentTab.tables.length > 0) {
          if (tabManager.currentTableId >= currentTab.tables.length) {
            tabManager.currentTableId = 0;
          }
        } else {
          tabManager.currentTableId = null;
        }
      }
    }

    loadSavedState();
    createClimbingPanel();
    tabManager.render();

    function getTableData(tableId) {
      const table = document.getElementById(tableId);
      if (!table) {
        console.error(`Таблица с id ${tableId} не найдена`);
        return [];
      }

      const tableData = [];

      for (let i = 0; i < table.rows.length; i++) {
        const rowData = [];
        for (let j = 0; j < table.rows[i].cells.length; j++) {
          const cell = table.rows[i].cells[j];
          rowData.push({
            value: cell.dataset.value || "",
          });
        }
        tableData.push(rowData);
      }

      return tableData;
    }

    // ===================== ПЕРЕТАСКИВАНИЕ =====================

    const climbingMainPanel = document.getElementById("uwu-climbingMainPanel");
    const climbingPanelButton = document.getElementById(
      "uwu-climbingPanelButton"
    );
    const climbingPanelContainer = document.getElementById(
      "uwu-climbingPanelContainer"
    );
    const transferCheckbox = document.getElementById("uwu-transferCheckbox");

    let touchStartTime;
    let touchStartX;
    let touchStartY;
    const CLICK_THRESHOLD = 200;
    const MOVE_THRESHOLD = 10;

    function handleTouchStart(e) {
      touchStartTime = Date.now();
      const touch = e.touches[0];
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
      dragStart(e);
    }

    function handleTouchEnd(e) {
      dragEnd(e);

      // Проверяем, был ли это клик
      const touchEndTime = Date.now();
      const touchDuration = touchEndTime - touchStartTime;

      if (e.changedTouches && e.changedTouches[0]) {
        const touch = e.changedTouches[0];
        const moveDistance = Math.sqrt(
          Math.pow(touch.clientX - touchStartX, 2) +
            Math.pow(touch.clientY - touchStartY, 2)
        );

        if (
          touchDuration < CLICK_THRESHOLD &&
          moveDistance < MOVE_THRESHOLD &&
          !wasDragging
        ) {
          togglePanelContainer(e);
        }
      }
    }

    function dragStart(e) {
      const touch = e.touches ? e.touches[0] : e;

      const savedStatus = uwuStorage.getItem("uwu_climbingPanelStatus");
      initialX =
        touch.clientX -
        (savedStatus ? savedStatus.x : climbingMainPanel.offsetLeft);
      initialY =
        touch.clientY -
        (savedStatus ? savedStatus.y : climbingMainPanel.offsetTop);

      if (e.target === climbingPanelButton) {
        isDragging = true;
        wasDragging = false;
      }

      if (e.type === "touchstart") {
        e.preventDefault();
      }
    }

    function drag(e) {
      if (isDragging) {
        const touch = e.touches ? e.touches[0] : e;

        currentX = touch.clientX - initialX;
        currentY = touch.clientY - initialY;

        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const panelWidth = climbingMainPanel.offsetWidth;
        const panelHeight = climbingMainPanel.offsetHeight;

        const maxX = windowWidth - panelWidth;
        currentX = Math.max(0, Math.min(currentX, maxX));

        const maxY = windowHeight - panelHeight;
        currentY = Math.max(0, Math.min(currentY, maxY));

        setPosition(currentX, currentY, climbingMainPanel);

        wasDragging = true;

        e.preventDefault();
      }
    }

    function dragEnd(e) {
      if (isDragging) {
        saveClimbingPanelStatus();
      }
      isDragging = false;
    }

    function setPosition(x, y, el) {
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
    }

    function togglePanelContainer(e) {
      if (!wasDragging) {
        const arrow = document.getElementById("uwu-arrow");
        climbingPanelContainer.classList.toggle("open");
        saveClimbingPanelStatus();

        if (climbingPanelContainer.classList.contains("open")) {
          arrow.textContent = "▼";
        } else {
          arrow.textContent = "▶";
        }
      }
      wasDragging = false;
    }

    function checkAndResetPanelPosition() {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const panelWidth = climbingMainPanel.offsetWidth;
      const panelHeight = climbingMainPanel.offsetHeight;

      const savedStatus = uwuStorage.getItem("uwu_climbingPanelStatus");

      if (savedStatus) {
        currentX = savedStatus.x;
        currentY = savedStatus.y;
      } else {
        currentX = 0;
        currentY = 0;
      }

      if (
        currentX + panelWidth > windowWidth ||
        currentY + panelHeight > windowHeight
      ) {
        currentX = 0;
        currentY = 0;
        saveClimbingPanelStatus();
      }

      setPosition(currentX, currentY, climbingMainPanel);
    }

    climbingPanelButton.addEventListener("mousedown", dragStart);
    document.addEventListener("mouseup", dragEnd);
    document.addEventListener("mousemove", drag);
    climbingPanelButton.addEventListener("click", togglePanelContainer);

    climbingPanelButton.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    document.addEventListener("touchend", handleTouchEnd);
    document.addEventListener("touchmove", drag, { passive: false });

    setTimeout(loadClimbingPanelStatus, 10);

    const climbingPanelContent = document.getElementById(
      "uwu-climbingPanelContent"
    );
    const buttonContainer = document.getElementById("uwu-buttonContainer");
    const inputButtonsContainer = document.getElementById("uwu-inputButtons");
    const buttonRow1 = document.getElementById("uwu-buttonRow1");
    const buttonRow2 = document.getElementById("uwu-buttonRow2");
    const functionButtonsContainer = document.getElementById(
      "uwu-functionButtonsContainer"
    );
    const tableContainer = document.getElementById("uwu-tableContainer");
    const clearTableButton = document.getElementById("button-clear-table");

    if (
      settings.climbingPanelOrientation === "horizontal" &&
      settings.climbingPanelInputsStyle === "standart"
    ) {
      climbingMainPanel.classList.add("horizontal-keyboard");
      climbingPanelContent.classList.add("horizontal-keyboard");
      buttonContainer.classList.add("horizontal-keyboard");
      inputButtonsContainer.classList.add("horizontal-keyboard");
      buttonRow1.classList.add("horizontal-keyboard");
      buttonRow2.classList.add("horizontal-keyboard");
      functionButtonsContainer.classList.add("horizontal-keyboard");
      tableContainer.classList.add("horizontal-keyboard");
      clearTableButton.classList.add("horizontal-keyboard");
    }

    const uwuClimbingPanel = document.createElement("style");
    uwuClimbingPanel.innerHTML =
      /* CSS */
      `
      #cages > tbody > tr > td.cage {
        position: relative;
      }

      #cages > tbody > tr > td.cage::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 0;
      }

      #uwu-climbingPanelContainer {
        background-color: "";
        display: none;
        padding: 5px;
      }
      
      #uwu-climbingPanelContainer.open {
        display: block;
      }

      #uwu-climbingMainPanel {
        z-index: 2;
        pointer-events: auto;
        width: 260px;
        position: absolute;
        background-color: ${theme?.climbingPanelBackground || "#ffffff08"};
        border: 1px solid #ffffff1a;
        backdrop-filter: blur(20px);
        border-radius: 10px;
      }

      #uwu-climbingPanelButton .left-content {
        pointer-events: none;
        width: 90%;
      }

      #uwu-climbingPanelButton .right-content {
        pointer-events: none;
        width: 10%;
        text-align: right;
      }

      #uwu-arrow {
        font-size: 18px;
        margin-right: 8px;
      }

      #uwu-inputButtons button.active {
        background-color: #abf6ffb0;
      }

      #uwu-climbingPanelButton {
        cursor: grab;
        background-color: #00000026;
        border-radius: 10px;
        border: 1px solid #ffffff1a;
        display: flex;
        align-items: center;
        justify-content: space-around;
      }

      #uwu-climbingPanelButton h2 {
        display: flex;
        margin-top: 2px;
        margin-bottom: 2px;
        justify-content: center;
        pointer-events: none;
      }

      #uwu-climbingPanel {
        font-size: 24px;
        border-collapse: collapse;
        width: 250px;
        height: 190px;;
        background-color: #ffffff1a;
        border: 2px solid black;
        table-layout: fixed;
      }
    
      #uwu-climbingPanel > tr > td {
        height: calc(100% / 6);
        width: calc(100% / 10);
        aspect-ratio: 1;
        padding: 0;
        border: 1px solid black;
        text-align: center;
        cursor: pointer;
        pointer-events: auto;
        position: relative;
      }

      @media (max-width: 500px) {
        #uwu-climbingPanel {
          font-size: 20px;
        }
      }
      
      @media (max-width: 400px) {
        #uwu-climbingPanel {
          font-size: 16px;
        }
      }

      #uwu-climbingPanelContainer h3 {
        margin-top: 5px;
        margin-bottom: 5px;
      }

      #uwu-functionButtonsContainer {
        height: 25px;
      }

      #uwu-climbingPanel > tr > td:focus {
        outline: 2px solid white;
      }

      #uwu-climbingPanel > tr > td:not(:empty) {
        background-color: #cccccc4d;
      }

      #uwu-transferCheckbox, #uwu-transferValuesCheckbox {
      pointer-events: auto;
      cursor: pointer;
      }

      #uwu-buttonRow1,
      #uwu-buttonRow2 {
        display: flex;
        flex-wrap: wrap;
      }

      #uwu-climbingPanel > tab-container, #uwu-climbingPanel > table-container {
        display: inline-block;
        margin-right: 10px;
      }
    
      #uwu-climbingPanelContainer button {
        background-color: #ffffff4d;
        border: 1px solid rgba(255, 255, 255, 0.1);
        padding: 2px 10px;
        border-radius: 10px;
        cursor: pointer;
        transition: background-color 0.3s ease;
        margin: 3px;
        margin-left: 0px;
      }

      #uwu-buttonRow1 > div > button.tab-button.active,
      #uwu-buttonRow2 > div > button.table-button.active {
        background-color: #abf6ffb0;
      }

      #button-clear-table {
        margin-top: 5px !important;
        width: 100%;
        border-radius: 5px !important;
      }
    `;
    document.head.appendChild(uwuClimbingPanel);

    const uwuClimbingPanelHorizontal = document.createElement("style");
    uwuClimbingPanelHorizontal.innerHTML =
      /* CSS */
      `
    #uwu-climbingMainPanel {
      width: 390px !important;
    }

    #uwu-climbingPanelContent {
      display: grid;
      grid-template-columns: 1fr 2fr;
      grid-template-rows: auto 1fr;
      height: calc(100% - 40px);
    }
    
    #uwu-buttonContainer {
      overflow-y: auto;
      grid-column: 1 / 2;
      grid-row: 1 / 3;
    }
    
    #uwu-functionButtonsContainer {
      grid-column: 2 / 3;
      grid-row: 1 / 2;
    }
    
    #uwu-tableContainer {
      grid-column: 2 / 3;
      grid-row: 2 / 3;
      overflow: auto;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
    }

    /* Стили для горизонтальной ориентации с кнопочным вводом */
    #uwu-climbingMainPanel.horizontal-keyboard {
      width: 420px !important;
    }

    #uwu-climbingPanelContent.horizontal-keyboard {
      display: grid;
      grid-template-columns: 1fr 2fr;
      grid-template-rows: auto 1fr;
      max-height: 250px;
    }

    #uwu-buttonContainer.horizontal-keyboard {
      grid-column: 1 / 2;
      grid-row: 1 / 3;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
    }

    #uwu-inputButtons.horizontal-keyboard {
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 10px;
    }

    #uwu-buttonRow2.horizontal-keyboard {
        margin-top: 10px;
    }

    #uwu-functionButtonsContainer.horizontal-keyboard {
      grid-column: 2 / 3;
      grid-row: 1 / 2;
      align-self: start;
    }

    #uwu-buttonRow1.horizontal-keyboard {
      grid-column: 2 / 3;
      grid-row: 1 / 2;
      margin-bottom: 10px;
    }

    #uwu-tableContainer.horizontal-keyboard {
      grid-column: 2 / 3;
      grid-row: 2 / 3;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      overflow: hidden;
    }
    `;

    if (settings.climbingPanelOrientation === "horizontal") {
      document.head.appendChild(uwuClimbingPanelHorizontal);
    }
  }
  // ====================================================================================================================
  //   . . . БЫСТРЫЕ СТИЛИ . . .
  // ====================================================================================================================
  const settingsContainer = document.getElementById(
    "extended-settings-container"
  );
  if (!settingsContainer) {
    console.error("Контейнер #extended-settings-container не найден");
    return;
  }

  const sharedFastStyleCallback = function (checked) {
    const styleId = "uwu-fast-style-" + this.key;
    if (checked) {
      if (!document.getElementById(styleId)) {
        const style = document.createElement("style");
        style.id = styleId;
        style.innerHTML = this.style;
        document.head.appendChild(style);
      }
    } else {
      const existingStyle = document.getElementById(styleId);
      if (existingStyle) {
        document.head.removeChild(existingStyle);
      }
    }
  };

  const checkboxes = [
    {
      label: "Не показывать всплывающее окно 'О коте'",
      key: "hideCatTooltip",
      storageKey: "uwu_fastStyles",
      style: ".cat_tooltip { display: none !important; }",
      callback: sharedFastStyleCallback,
    },
    {
      label: "Скрыть Игровое поле",
      key: "hideGameField",
      storageKey: "uwu_fastStyles",
      style: "#cages_overflow { visibility: hidden !important; }",
      callback: sharedFastStyleCallback,
    },
    {
      label: "Скрыть фон Игрового Поля",
      key: "hideGameFieldBackground",
      storageKey: "uwu_fastStyles",
      style: "#cages_div { background-image: none !important; }",
      callback: sharedFastStyleCallback,
    },
    {
      label: "Скрыть Небо",
      key: "hideSky",
      storageKey: "uwu_fastStyles",
      style: "#tr_sky { display: none !important; }",
      callback: sharedFastStyleCallback,
    },
    {
      label: "Всегда день/ярко",
      key: "alwaysDay",
      storageKey: "uwu_settings",
      callback: function (checked) {
        updateAlwaysDayStyle(checked);
      },
    },
    {
      label: "Границы клеток",
      key: "cellsBorders",
      storageKey: "uwu_settings",
      callback: function (checked) {
        updateCellsBordersStyle(checked);
      },
    },
    {
      label: "Непрозрачные коты",
      key: "opaqueCats",
      storageKey: "uwu_fastStyles",
      style: ".cat > div { opacity: 1 !important; }",
      callback: sharedFastStyleCallback,
    },
  ];

  const loadSettings = (storageKey) => {
    const savedSettings = uwuStorage.getItem(storageKey);
    return savedSettings ? savedSettings : {};
  };

  const saveSettings = (storageKey, settings) => {
    uwuStorage.setItem(storageKey, settings);
  };

  const settingsMap = {
    uwu_fastStyles: loadSettings("uwu_fastStyles"),
    uwu_settings: loadSettings("uwu_settings"),
  };

  const applyStyles = () => {
    checkboxes.forEach((checkbox) => {
      if (settingsMap[checkbox.storageKey][checkbox.key] === true) {
        checkbox.callback.call(checkbox, true);
      }
    });
  };

  if (settings.fastStyles) {
    const settingsDiv = document.createElement("div");
    settingsDiv.id = "fast-Styles-container";
    settingsDiv.classList.add("extended-settings-block");

    checkboxes.forEach((checkbox) => {
      const label = document.createElement("div");
      const input = document.createElement("input");
      input.type = "checkbox";
      input.name = checkbox.key;

      const storedValue = settingsMap[checkbox.storageKey][checkbox.key];
      if (storedValue === true) {
        input.checked = true;
        checkbox.callback.call(checkbox, true);
      }

      input.addEventListener("change", function () {
        settingsMap[checkbox.storageKey][checkbox.key] = this.checked;
        saveSettings(checkbox.storageKey, settingsMap[checkbox.storageKey]);
        checkbox.callback.call(checkbox, this.checked);
      });

      label.appendChild(input);
      label.appendChild(document.createTextNode(checkbox.label));
      settingsDiv.appendChild(label);
    });

    settingsContainer.appendChild(settingsDiv);

    const style = document.createElement("style");
    style.innerHTML = `
      .extended-settings-block {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
      }
      .extended-settings-block div {
        display: flex;
       align-items: center;
      }
    `;
    document.head.appendChild(style);
  } else {
    applyStyles();
  }
  // ====================================================================================================================
  //   . . . БЫСТРЫЕ ССЫЛКИ В ИГРОВОЙ . . .
  // ====================================================================================================================
  /**
   * Injects configured default and custom quick links into the native navigation bar.
   *
   * @returns {void}
   */
  function setupQuickLinks() {
    const navElement = document.querySelector(".game-topbar-nav");
    if (!navElement || navElement.querySelector(".uwu-quick-link")) return;

    const quickLinksConfig = {
      quickLink1: { href: "/settings", text: "Настройки" },
      quickLink2: { href: "/ls?id=0", text: "Памятка" },
      quickLink3: { href: "/blogs", text: "Блоги" },
      quickLink4: { href: "/sniff", text: "Лента" },
    };

    const linksToAppend = [];

    Object.entries(quickLinksConfig).forEach(([key, link]) => {
      if (settings[key]) {
        linksToAppend.push(link);
      }
    });

    if (settings.userQuickLinks) {
      settings.userQuickLinks
        .split(",")
        .map((entry) => entry.trim())
        .filter(Boolean)
        .forEach((userLink) => {
          const [href, ...labelParts] = userLink.split(" ");
          const text = labelParts.join(" ").trim();
          if (href && text) {
            linksToAppend.push({ href, text });
          }
        });
    }

    linksToAppend.forEach(({ href, text }) => {
      const linkEl = document.createElement("a");
      linkEl.href = href;
      linkEl.textContent = text;
      linkEl.classList.add("uwu-quick-link");
      navElement.appendChild(linkEl);
    });
  }

  setupSingleCallback(".game-topbar-nav", setupQuickLinks);
  // ====================================================================================================================
  //  . . . ПОДСВЕТКА РЕСУРСОВ . . .
  // ====================================================================================================================
  if (settings.highlightResources) {
    function hexToRGBA(hex, alpha) {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    const ITEM_MAP = {
      Травы: [
        "13",
        "15",
        "17",
        "19",
        "21",
        "23",
        "25",
        "26",
        "106",
        "108",
        "109",
        "110",
        "111",
        "112",
        "115",
        "116",
        "119",
        "655",
        "2613",
        "2614",
      ],
      Мох: ["75", "78", "95"],
      Паутина: ["20"],
      Пыль: ["94", "385", "386", "387", "388", "389", "390", "391", "392"],
      "Ветки, вьюнки, костоправы": ["565", "566", "562", "563", "3993"],
      "Травящие предметы": [
        "985",
        "986",
        "987",
        "988",
        "989",
        "44",
        "180",
        "77",
        "7801",
        "7802",
        "7803",
        "7804",
        "7805",
        "7806",
      ],
      "Шаманские штучки": [
        "120",
        "121",
        "122",
        "123",
        "124",
        "125",
        "128",
        "129",
        "130",
        "131",
        "132",
      ],
    };

    function generateHighlightStyles(cageItem) {
      const savedSettings = uwuStorage.getItem("uwu_highlightResources");
      if (!savedSettings) return;

      const uwu_highlightResources = savedSettings;

      if (settings.highlightResourcesStyle === "background") {
        const styleElement =
          document.getElementById("resourcesStyle") ||
          document.createElement("style");
        styleElement.id = "resourcesStyle";
        styleElement.textContent = "";

        uwu_highlightResources.forEach((resource) => {
          if (resource.highlight) {
            const rgbaColor = hexToRGBA(resource.color, 0.4);
            let cssRules = "";

            const items = ITEM_MAP[resource.name];
            if (!items) {
              console.warn("Неизвестный ресурс:", resource.name);
              return;
            }

            items.forEach((itemName) => {
              cssRules += `
                .cage_items[style*='things/${itemName}.png'] {
                  background-color: ${rgbaColor} !important;
                }`;
            });

            if (cssRules) {
              styleElement.textContent += cssRules;
            }
          }
        });

        document.head.appendChild(styleElement);
      } else if (settings.highlightResourcesStyle === "glow") {
        const style = cageItem.getAttribute("style");
        if (!style) return;

        const oldHighlights = cageItem.querySelectorAll(
          "style.uwu_itemHighlight"
        );
        oldHighlights.forEach((oldHighlight) => oldHighlight.remove());

        cageItem.style.position = "relative";

        uwu_highlightResources.forEach((resource) => {
          if (resource.highlight) {
            const rgbaColor = hexToRGBA(resource.color, 1);
            let highlightedItems = [];

            const items = ITEM_MAP[resource.name];
            if (!items) {
              console.warn("Неизвестный ресурс:", resource.name);
              return;
            }

            items.forEach((itemName) => {
              const backgroundImages =
                style.match(
                  /url\("things\/(.*?)\.png"\) (\d+)% (\d+)% no-repeat/g
                ) || [];

              backgroundImages.forEach((backgroundImage) => {
                if (backgroundImage.includes(`things/${itemName}.png`)) {
                  const positionMatch = backgroundImage.match(
                    /(url\("things\/(.*?)\.png"\)) (\d+)% (\d+)% no-repeat/
                  );
                  const imageUrl = positionMatch ? positionMatch[1] : "";
                  const positionX = positionMatch ? positionMatch[3] : "0";
                  const positionY = positionMatch ? positionMatch[4] : "0";

                  highlightedItems.push(
                    `${imageUrl} ${positionX}% ${positionY}% no-repeat`
                  );
                }
              });
            });

            if (highlightedItems.length > 0) {
              const styleBody = `
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                background: ${highlightedItems.join(", ")};
                filter: drop-shadow(0 0 8px ${rgbaColor}) drop-shadow(0 0 8px ${rgbaColor});
              `;

              const styleElement = document.createElement("style");
              styleElement.classList.add("uwu_itemHighlight");
              styleElement.textContent = `
                .cage_items[style*='${style}']::before {
                  ${styleBody}
                }
              `;
              cageItem.appendChild(styleElement);
            }
          }
        });
      }
    }

    function setupMutationObserver(targetNode, callback, config) {
      const observer = new MutationObserver((mutationsList, observer) => {
        for (let mutation of mutationsList) {
          if (
            mutation.type === "attributes" &&
            mutation.attributeName === "style"
          ) {
            callback(targetNode);
          }
        }
      });

      observer.observe(targetNode, config);
    }

    document.querySelectorAll(".cage_items").forEach((cageItem) => {
      generateHighlightStyles(cageItem);
      setupMutationObserver(cageItem, generateHighlightStyles, {
        attributes: true,
        childList: true,
        subtree: true,
      });
    });
  }
  // ====================================================================================================================
  //   . . . ПОЛЬЗОВАТЕЛЬКИЙ ФОН . . .
  // ====================================================================================================================
  const cagesDiv = document.querySelector("#cages_div");

  function createBackgroundDiv() {
    const backgroundDiv = document.createElement("div");
    backgroundDiv.style.position = "fixed";
    backgroundDiv.style.top = "-1%";
    backgroundDiv.style.left = "-1%";
    backgroundDiv.style.width = "102%";
    backgroundDiv.style.height = "102%";
    backgroundDiv.style.zIndex = "-2";
    backgroundDiv.style.overflow = "hidden";
    return backgroundDiv;
  }

  function updateBackgroundImage(backgroundDiv, imageUrl) {
    if (imageUrl) {
      backgroundDiv.style.backgroundImage = `url(${imageUrl})`;
      backgroundDiv.style.backgroundSize = "cover";
      backgroundDiv.style.backgroundPosition = "center";
      backgroundDiv.style.backgroundRepeat = "no-repeat";
    } else {
      backgroundDiv.style.backgroundImage = "none";
    }
  }

  if (settings.backgroundRepeat) {
    const backgroundDiv = createBackgroundDiv();

    backgroundDiv.style.filter = "blur(16px)";
    backgroundDiv.style.backgroundBlendMode = "overlay";
    backgroundDiv.style.backgroundColor = "rgba(0, 0, 0, 0.5)";

    const backgroundImageStyle =
      window.getComputedStyle(cagesDiv).backgroundImage;
    const url = backgroundImageStyle.match(/url\("?(.+?)"?\)/);
    const backgroundImageUrl = url ? url[1] : null;

    updateBackgroundImage(backgroundDiv, backgroundImageUrl);
    globalContainerElement.appendChild(backgroundDiv);

    setupMutationObserver(
      "#cages_div",
      () => {
        const backgroundImageStyle =
          window.getComputedStyle(cagesDiv).backgroundImage;
        const url = backgroundImageStyle.match(/url\("?(.+?)"?\)/);
        const backgroundImageUrl = url ? url[1] : null;
        updateBackgroundImage(backgroundDiv, backgroundImageUrl);
      },
      { attributes: true, attributeFilter: ["style"] },
      8,
      500,
      10
    );
  }

  if (settings.backgroundUser) {
    const backgroundDiv = createBackgroundDiv();
    updateBackgroundImage(backgroundDiv, settings.backgroundUserImageURL);
    globalContainerElement.appendChild(backgroundDiv);
  }
  // ====================================================================================================================
  //   . . . ПОЛЬЗОВАТЕЛЬСКИЕ ЦВЕТА НАВЫКОВ И ПАРАМЕТРОВ . . .
  // ====================================================================================================================
  const defaultBackgroundImageUrl =
    "https://raw.githubusercontent.com/Ibirtem/CatWar/main/images/parametersBackgroundImageURL.png";

  function generateParameterStyles() {
    let cssStyles = "";

    const otherColors = settings.parametersColors.other || [
      "#cccccc",
      "#cccccc",
      "#cccccc",
      "#cccccc",
    ];
    const otherFirstCellBackground = `linear-gradient(to right, ${otherColors[0]}, ${otherColors[1]})`;
    const otherLastCellBackground = `linear-gradient(to right, ${otherColors[2]}, ${otherColors[3]})`;

    cssStyles += `#parameters_skills_block .bar-fill { background: ${otherFirstCellBackground}; }\n`;
    cssStyles += `#parameters_skills_block .bar { background: ${otherLastCellBackground}; }\n`;

    const backgroundImageURL = settings.parametersUserBackgroundImage
      ? settings.parametersUserBackgroundImageURL
      : defaultBackgroundImageUrl;
    const useBackgroundImage =
      settings.parametersBackgroundImage ||
      settings.parametersUserBackgroundImage;

    for (const paramId in settings.parametersColors) {
      if (paramId === "other") continue;

      const colors = settings.parametersColors[paramId] || [
        "#cccccc",
        "#cccccc",
        "#cccccc",
        "#cccccc",
      ];

      const firstCellBackground = useBackgroundImage
        ? `url(${backgroundImageURL}), linear-gradient(to right, ${colors[0]}, ${colors[1]})`
        : `linear-gradient(to right, ${colors[0]}, ${colors[1]})`;
      const lastCellBackground = useBackgroundImage
        ? `url(${backgroundImageURL}), linear-gradient(to right, ${colors[2]}, ${colors[3]})`
        : `linear-gradient(to right, ${colors[2]}, ${colors[3]})`;

      cssStyles += `#${paramId} .bar-fill { background: ${firstCellBackground} !important; }\n`;
      cssStyles += `#${paramId} .bar { background: ${lastCellBackground} !important; }\n`;
    }

    return cssStyles;
  }

  function applyParameterColors() {
    const existingStyleTag = document.getElementById("custom-parameter-styles");
    if (existingStyleTag) {
      existingStyleTag.remove();
    }

    const cssStyles = generateParameterStyles();

    const styleTag = document.createElement("style");
    styleTag.id = "custom-parameter-styles";
    styleTag.innerHTML = cssStyles;
    document.head.appendChild(styleTag);
  }

  if (settings.userParametersTheme) {
    applyParameterColors();
  }

  function applyParametersTextShadow() {
    if (settings.parametersTextShadow) {
      const styleTag = document.createElement("style");
      styleTag.id = "uwu-parameters-text-shadow-style";
      styleTag.innerHTML = `#parameters_skills_block .bar-data { text-shadow: 1px 1px 2px black; }\n`;
      document.head.appendChild(styleTag);
    }
  }

  applyParametersTextShadow();
  // ====================================================================================================================
  //   . . . ПОЛЬЗОВАТЕЛЬСКИЙ ШРИФТ . . .
  // ====================================================================================================================
  let fontSize = uwuStorage.getItem("uwu_fontSize");

  function applyFonts() {
    const fontFamily = fontSize?.fontFamilyBody;
    if (fontFamily) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = `https://fonts.googleapis.com/css?family=${encodeURIComponent(
        fontFamily
      )}`;
      document.head.appendChild(link);
    }

    const newFontStyle = document.createElement("style");
    newFontStyle.innerHTML = `
          body {
              font-size: ${fontSize?.fontSizeBody}px;
              font-family: ${
                fontFamily ? `'${fontFamily}', sans-serif` : "sans-serif"
              };
          }
  
          .small {
              font-size: ${fontSize?.fontSizeSmall}px;
          }
  
          #location {
              font-size: ${fontSize?.fontSizeLocation}px !important;
          }
  
          .vlm0 {
              font-size: ${fontSize?.vlm0}px;
          }
  
          .vlm1 {
              font-size: ${fontSize?.vlm1}px;
          }
  
          .vlm2 {
              font-size: ${fontSize?.vlm2}px;
          }
  
          .vlm3 {
              font-size: ${fontSize?.vlm3}px;
          }
  
          .vlm4 {
              font-size: ${fontSize?.vlm4}px;
          }
  
          .vlm5 {
              font-size: ${fontSize?.vlm5}px;
          }
  
          .vlm6 {
              font-size: ${fontSize?.vlm6}px;
          }
  
          .vlm7 {
              font-size: ${fontSize?.vlm7}px;
          }
  
          .vlm8 {
              font-size: ${fontSize?.vlm8}px;
          }
  
          .vlm9 {
              font-size: ${fontSize?.vlm9}px;
          }
  
          .vlm10 {
              font-size: ${fontSize?.vlm10}px;
          }
      `;
    document.head.appendChild(newFontStyle);
  }

  if (settings.useUserFonts) {
    applyFonts();
  }
  // ====================================================================================================================
  //   . . . СКРЫТИЕ РОДСТВЕННЫХ СВЯЗЕЙ . . .
  // ====================================================================================================================
  if (settings.hideRelativesByDefault) {
    setupSingleCallback("#relatives_block", () => {
      const relativesBlock = document.getElementById("relatives_block");
      if (relativesBlock) {
        relativesBlock.style.display = "none";
      }
    });
  }
  // ====================================================================================================================
  //   . . . РЕДИЗАЙН ИГРОВОЙ . . .
  // ====================================================================================================================
  if (settings.customLayout) {
    // ==================================================================
    function applyLayoutSettings() {
      const savedSettings = uwuStorage.getItem("uwu_layoutSettings");
      if (savedSettings) {
        const { leftBlocks, rightBlocks } = savedSettings;

        const mainTable = document.getElementById("main_table");
        const tbody = mainTable.getElementsByTagName("tbody")[0];
        const blocks = Array.from(tbody.children);

        resetBlockStyles(tbody);

        const gridAreaTemplate = generateGridTemplate(leftBlocks, rightBlocks);

        // console.log(gridAreaTemplate);

        tbody.style.display = "grid";
        tbody.style.gridTemplateAreas = gridAreaTemplate;
        tbody.style.gridTemplateColumns = "1fr auto 1fr";
        tbody.style.gridTemplateRows = generateGridRowStyles(
          leftBlocks,
          rightBlocks
        );

        blocks.forEach((block) => {
          if (block.id) {
            block.style.gridArea = block.id;
          }
        });
      }
    }

    function generateGridRowStyles(leftBlocks, rightBlocks) {
      const numRows = Math.max(leftBlocks.length, rightBlocks.length);
      let rowStyles = [];

      for (let i = 0; i < numRows; i++) {
        let rowHeight = "auto";
        rowStyles.push(rowHeight);
      }

      const rowStylesString = rowStyles.join(" ");
      return rowStylesString;
    }

    function generateGridTemplate(leftBlocks, rightBlocks) {
      const numRows = Math.max(leftBlocks.length, rightBlocks.length);
      let template = "";
      let lastLeftBlockId = "";
      let lastRightBlockId = "";
      let isFirstRow = true;

      for (let i = 0; i < numRows; i++) {
        const leftBlockId = leftBlocks[i] || lastLeftBlockId;
        const rightBlockId = rightBlocks[i] || lastRightBlockId;

        if (isFirstRow) {
          template += `"${leftBlockId} tr_field ${rightBlockId}" `;
          isFirstRow = false;
        } else {
          template += `"${
            leftBlockId === lastLeftBlockId ? "." : leftBlockId
          } . ${rightBlockId === lastRightBlockId ? "." : rightBlockId}" `;
        }

        if (leftBlockId) {
          lastLeftBlockId = leftBlockId;
        }
        if (rightBlockId) {
          lastRightBlockId = rightBlockId;
        }
      }

      return template;
    }

    function resetBlockStyles(parent) {
      const blocks = parent.querySelectorAll("tr > *");
      blocks.forEach((block) => {
        block.style.gridArea = "";
      });
    }

    // Больше фикс стилей.
    const fixStyle = document.createElement("style");
    fixStyle.innerHTML =
      /* CSS */
      `
      #main_table {
        width: 100%;
        max-width: unset;
        height: 100%;

        background: none;
        border-spacing: 0px !important;
        margin-top: 0px !important;
      }

      #app > br {
        display: none;
      }

      #app {
        width: 100%;
        height: 100%;
        display: flex !important;
        flex-direction: column;
        gap: 5px;
      }
      
      #chat_msg, #cws_chat_msg {
        height: ${settings.chatHeight}px;
        width: auto;
      }

      #history_block > div { 
        visibility: hidden; 
      }

      #history_block {
        display: block;
        height: ${settings.historyHeight}px; 
        overflow-y: auto;
        resize: vertical;
      }

      #family { 
        display: block;
        overflow-y: auto;
        resize: vertical;
      }

      .infos {
        width: auto;
      }

      #cages_overflow {
        background: black;
      }

      .chat_text {
        width: auto !important;
        overflow-wrap: anywhere;
      }

      #chat_form {
        margin: unset;
        margin: 5px;
      }

      #volume {
        margin: 5px;
      }

      #app > p:last-of-type {
        position: fixed;
        bottom: 0px;
        margin: 8px;
      }

      h2 {
        margin-top: 5px;
        margin-bottom: 10px;
      }

      #itemList {
        overflow-y: auto;
        max-height: ${settings.itemListHeight || 180}px;
        display: flex;
        flex-wrap: wrap;
      }

      .game-topbar {
        max-width: 100% !important;
      }

      body {
        overflow-y: scroll;
      }

      #tr_chat, #tr_actions > td, #tr_mouth > td, #location, .small, #info_main > tbody > tr > td {
        padding: 5px !important;
      }

      #tr_chat > td {
        display: contents;
      }

      #chat_msg, #cws_chat_msg {
        height: ${theme?.chatHeight}px;
        resize: vertical;
      }

      #tr_field, #tr_info {
        height: 10px;
      }

      #newchat, #newls {
        background-color: transparent;
      }

      .other_cats_list {
        display: none;
      }

      #deys {
        width: auto !important;
      }
      
      #block_deys {
        flex-wrap: wrap;
        justify-content: space-between;
      }

      #deys_mit {
        width: min-content !important;
      }
      
      #mit { 
        width: auto !important;
      }
    `;
    document.head.appendChild(fixStyle);
    applyLayoutSettings();

    const paragraph = document.querySelector("#app > p > b");
    paragraph.textContent = "ТБ:";

    function applyLayoutSettingsForInfoMain() {
      const infoMainTable = document.getElementById("info_main");
      if (!infoMainTable) {
        return;
      }

      const tableRow = infoMainTable.querySelector("tr");
      if (!tableRow) {
        return;
      }

      const tds = tableRow.getElementsByTagName("td");
      if (tds.length < 3) {
        return;
      }

      for (const td of tds) {
        td.style.gridArea = "";
      }

      tableRow.style.display = "grid";
      // хахахах поглядите на смешного строчного
      tableRow.style.gridTemplateAreas = `"parameter"
                                          "history"
                                          "family"`;

      tds[0].style.gridArea = "family";
      tds[1].style.gridArea = "history";
      tds[2].style.gridArea = "parameter";
    }

    applyLayoutSettingsForInfoMain();
  }

  // ====================================================================================================================
  //   . . . ПОДСКАЗЫВАТЬ ОСТАВШЕЕСЯ ВРЕМЯ ДО НЮХА . . .
  // ====================================================================================================================
  if (settings.showHintWhenToSniff) {
    let smellTimerInterval = null;
    let visualTimerStartTime = null;
    let visualInitialTimerValue = 0;

    const sniffCheckpointKey = "uwu_sniffCheckpoint";
    const visualTimerStateKey = "uwu_sniffVisualTimerState";

    const smellCooldowns = {
      0: 3600,
      1: 3600,
      2: 3600,
      3: 3600,
      4: 1800,
      5: 1200,
      6: 900,
      7: 720,
      8: 600,
      9: 0,
    };

    function formatTime(seconds) {
      if (seconds <= 0) return "";
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const remainingSeconds = Math.ceil(seconds % 60);
      return `${hours ? `${hours} ч ` : ""}${
        minutes ? `${minutes} мин ` : ""
      }${remainingSeconds} с`;
    }

    function updateVisualTimerDisplay() {
      const timerElement = document.getElementById("uwu_sniff_timer");
      if (!timerElement || visualTimerStartTime === null) return;

      const currentTime = Date.now();
      const elapsedTime = (currentTime - visualTimerStartTime) / 1000;
      let remainingTime = visualInitialTimerValue - elapsedTime;

      if (remainingTime <= 0) {
        stopVisualTimer();
        timerElement.textContent = "";
      } else {
        timerElement.setAttribute("value", Math.ceil(remainingTime));
        timerElement.textContent = ` | Нюх через: ${formatTime(remainingTime)}`;
        saveVisualTimerState();
      }
    }

    function stopVisualTimer() {
      if (smellTimerInterval) {
        clearInterval(smellTimerInterval);
        smellTimerInterval = null;
      }
      visualTimerStartTime = null;
      visualInitialTimerValue = 0;
      uwuStorage.removeItem(visualTimerStateKey);
      uwuStorage.removeItem(sniffCheckpointKey);

      const timerElement = document.getElementById("uwu_sniff_timer");
      if (timerElement) {
        timerElement.setAttribute("value", "0");
        timerElement.textContent = "";
      }
    }

    function saveVisualTimerState() {
      if (visualTimerStartTime !== null && visualInitialTimerValue > 0) {
        const remainingTime =
          visualInitialTimerValue - (Date.now() - visualTimerStartTime) / 1000;
        if (remainingTime > 0) {
          const timerState = {
            startTime: visualTimerStartTime,
            initialValue: visualInitialTimerValue,
          };
          uwuStorage.setItem(visualTimerStateKey, timerState);
        } else {
          uwuStorage.removeItem(visualTimerStateKey);
        }
      } else {
        uwuStorage.removeItem(visualTimerStateKey);
      }
    }

    function tryRestoreTimerFromCheckpointOrState() {
      if (visualTimerStartTime !== null) {
        return;
      }

      const checkpointTimestampStr = uwuStorage.getItem(sniffCheckpointKey);
      if (checkpointTimestampStr) {
        const checkpointTimestamp = parseInt(checkpointTimestampStr, 10);
        if (!isNaN(checkpointTimestamp)) {
          const smellLevelElement = document.querySelector("#smell .level");
          if (smellLevelElement) {
            const smellLevel = parseInt(smellLevelElement.textContent, 10);
            if (smellCooldowns.hasOwnProperty(smellLevel)) {
              const totalCooldownSeconds = smellCooldowns[smellLevel];
              if (totalCooldownSeconds > 0) {
                const elapsedTimeSeconds =
                  (Date.now() - checkpointTimestamp) / 1000;
                const remainingTimeSeconds =
                  totalCooldownSeconds - elapsedTimeSeconds;

                if (remainingTimeSeconds > 0) {
                  visualInitialTimerValue = remainingTimeSeconds;
                  visualTimerStartTime = Date.now();
                  if (smellTimerInterval) clearInterval(smellTimerInterval);
                  updateVisualTimerDisplay();
                  smellTimerInterval = setInterval(
                    updateVisualTimerDisplay,
                    1000
                  );
                  saveVisualTimerState();
                  return;
                } else {
                  stopVisualTimer();
                  return;
                }
              } else {
                stopVisualTimer();
                return;
              }
            }
          }
        } else {
          uwuStorage.removeItem(sniffCheckpointKey);
        }
      }

      const savedVisualStateStr = uwuStorage.getItem(visualTimerStateKey);
      if (savedVisualStateStr) {
        try {
          const savedVisualState = savedVisualStateStr;
          const elapsedTimeSinceSave =
            (Date.now() - savedVisualState.startTime) / 1000;
          const remainingTimeFromSave =
            savedVisualState.initialValue - elapsedTimeSinceSave;

          if (remainingTimeFromSave > 0) {
            visualTimerStartTime = savedVisualState.startTime;
            visualInitialTimerValue = savedVisualState.initialValue;
            if (smellTimerInterval) clearInterval(smellTimerInterval);
            updateVisualTimerDisplay();
            smellTimerInterval = setInterval(updateVisualTimerDisplay, 1000);
            return;
          } else {
            uwuStorage.removeItem(visualTimerStateKey);
          }
        } catch (e) {
          console.error(
            "Ошибка разбора сохраненного состояния визуального таймера:",
            e
          );
          uwuStorage.removeItem(visualTimerStateKey);
        }
      }
    }

    function handleBlockMessChange() {
      const blockMess = document.getElementById("block_mess");
      if (blockMess && blockMess.textContent.includes("Принюхиваться")) {
        stopVisualTimer();
        uwuStorage.setItem(sniffCheckpointKey, Date.now().toString());
      }
    }

    function checkActionAvailability() {
      const trActions = document.getElementById("tr_actions");
      if (!trActions) return;
      const sniffActionLink = trActions.querySelector('a[data-id="13"]');

      if (sniffActionLink) {
        stopVisualTimer();
      } else {
        tryRestoreTimerFromCheckpointOrState();
      }
    }

    function handleErrorChange() {
      const errorElement = document.getElementById("error");
      if (!errorElement || !errorElement.textContent) return;

      const htmlContent = errorElement.innerHTML;
      const smellCooldownMatch = htmlContent.match(
        /Следующее обнюхивание будет доступно через (.*?)(\.|<br|$)/
      );
      const cooldownExpiredMatch = htmlContent.includes("Час уже прошёл");

      if (smellCooldownMatch) {
        const timeString = smellCooldownMatch[1];
        let totalSeconds = 0;
        const minutesMatch = timeString.match(/(\d+)\s*мин/);
        const secondsMatch = timeString.match(/(\d+)\s*с/);

        if (minutesMatch) totalSeconds += parseInt(minutesMatch[1], 10) * 60;
        if (secondsMatch) totalSeconds += parseInt(secondsMatch[1], 10);

        stopVisualTimer();

        if (totalSeconds > 0) {
          visualInitialTimerValue = totalSeconds;
          visualTimerStartTime = Date.now();

          if (smellTimerInterval) clearInterval(smellTimerInterval);
          updateVisualTimerDisplay();
          smellTimerInterval = setInterval(updateVisualTimerDisplay, 1000);
          saveVisualTimerState();
        }
      } else if (cooldownExpiredMatch) {
        stopVisualTimer();
      }
    }

    function createTimerElement() {
      const smallElement = document.querySelector(".small");
      if (smallElement && !document.getElementById("uwu_sniff_timer")) {
        smallElement.insertAdjacentHTML(
          "beforeend",
          '<span id="uwu_sniff_timer" value="0"></span>'
        );
      }
    }

    setupSingleCallback(".small", createTimerElement);

    setupMutationObserver(
      "#tr_actions",
      checkActionAvailability,
      {
        childList: true,
        subtree: true,
      },
      8,
      500
    );

    setupMutationObserver(
      "#block_mess",
      handleBlockMessChange,
      {
        childList: true,
        subtree: true,
        characterData: true,
      },
      8,
      500
    );

    setupMutationObserver(
      "#error",
      handleErrorChange,
      {
        childList: true,
        subtree: true,
        characterData: true,
      },
      8,
      500
    );
  }

  // ====================================================================================================================
  //   . . . КОМПАКТНЫЕ ПАРАМЕТРЫ И НАВЫКИ (В ДВЕ КОЛОНКИ) . . .
  // ====================================================================================================================
  if (settings.twoColumnParameters) {
    const twoColumnParamStyle = document.createElement("style");
    twoColumnParamStyle.id = "uwu-two-column-parameters-style";
    twoColumnParamStyle.innerHTML = /* CSS */ `
      #parameters_skills_block {
          column-count: 2;
          column-gap: 15px;
      }

      #parameters_skills_block > * {
          break-inside: avoid;
          page-break-inside: avoid;
      }

      #parameters_skills_block > div:not(.parameter):not(.skill) {
          column-span: all;
          -webkit-column-span: all;
          width: 100%;
          margin-bottom: 5px;
      }

      #parameters_skills_block > h3:nth-of-type(3) {
          break-before: column;
          -webkit-column-break-before: always;
      }

      #parameters_skills_block > h3 {
          text-align: center;
          margin-top: 5px;
          margin-bottom: 5px;
      }
    `;
    document.head.appendChild(twoColumnParamStyle);
  }

  // ====================================================================================================================
  //   . . . ЛОГ ЧИСТИЛЬЩИКОВ . . .
  // ====================================================================================================================
  if (settings.cleaningLog) {
    let logStates = uwuStorage.getItem("uwu_logStates") || {
      cleaning: false,
      catching: false,
    };

    let lastDroppedCatInfo = null;

    function saveLogStates() {
      uwuStorage.setItem("uwu_logStates", logStates);
    }

    const relevantActions = [
      { regex: /Потёрлись носом о нос с/, type: "check" },
      { regex: /Потёрлись щекой о щёку/, type: "check" },
      { regex: /Помурлыкал(а)? вместе с/, type: "check" },
      { regex: /Обнюхал(а)? /, type: "check" },
      { regex: /Поднял(а)? /, type: "pickup" },
      { regex: /Опустил(а)? на землю /, type: "putdown" },
    ];

    let cleaningLogBuffer = "";
    let catNamesAndIds = [];

    /**
     * Updates the cleaner log based on new history data.
     *
     * @param {string} newHistory - The new full history string retrieved from Vue.
     */
    function cleaningLogUpdate(newHistory) {
      const historyBlock = document.querySelector("#history");
      if (!historyBlock) return;

      const locationSpan = historyBlock.querySelector("#location");
      const currentLocation = locationSpan
        ? locationSpan.textContent.trim()
        : "";

      if (currentLocation === "[ Загружается… ]") {
        return;
      }

      let cleaningLogBlock = historyBlock.querySelector("#uwu-cleaningLog");
      if (!cleaningLogBlock) {
        createCleaningLogBlock(historyBlock);
        cleaningLogBlock = historyBlock.querySelector("#uwu-cleaningLog");
      }

      const actions = newHistory
        .split(".")
        .map((action) => action.trim())
        .filter((action) => action);

      const lastAction = actions[actions.length - 1];

      const cleaningLogContent = cleaningLogBlock.querySelector(
        "#uwu-cleaningLog-content",
      );

      if (lastAction) {
        if (settings.cleaningLogStyle === "smart") {
          processSmartAction(lastAction, currentLocation, cleaningLogContent);
        } else {
          processStandardAction(
            lastAction,
            currentLocation,
            cleaningLogContent,
          );
        }

        let storageKey;
        switch (settings.cleaningLogStyle) {
          case "smart":
            storageKey = "uwu_cleaningLogSmart";
            break;
          default:
            storageKey = "uwu_cleaningLogStandard";
            break;
        }

        uwuStorage.setItem(storageKey, {
          log: cleaningLogBuffer,
          catNamesAndIds,
          counters: {
            pickup: parseInt(
              document.getElementById("uwu-cleaningLog-counter-pickup")
                .textContent,
            ),
            putdown: parseInt(
              document.getElementById("uwu-cleaningLog-counter-putdown")
                .textContent,
            ),
          },
        });
        cleaningLogContent.innerHTML = addCatLinksToLog(
          cleaningLogBuffer,
          catNamesAndIds,
        );
      }
    }

    function createCleaningLogBlock(historyBlock) {
      const cleaningLogTemplate =
        /* HTML */
        `
          <div id="uwu-cleaningLog">
            <h2>
              <a href="#" id="uwu-cleaningLog-toggle" class="toggle"
                >Лог чистильщика</a
              >
            </h2>
            <div id="uwu-cleaningLog-content-wrapper">
              <div id="uwu-cleaningLog-content"></div>
              <div id="uwu-cleaningLog-counters">
                <span
                  >Успешно поднятых:
                  <span id="uwu-cleaningLog-counter-pickup">0</span></span
                >
                <span
                  >Опущенных:
                  <span id="uwu-cleaningLog-counter-putdown">0</span></span
                >
              </div>
              <div id="uwu-cleaningLog-actions">
                <a href="#" id="uwu-cleaningLog-clear">Очистить лог</a>
                <a
                  href="#"
                  id="uwu-cleaningLog-delete-last"
                  class="disabled"
                  title="Удалить последнего опущенного персонажа"
                >
                  <img
                    src="https://raw.githubusercontent.com/Ibirtem/CatWar/main/images/wastebasket.png"
                    alt="Удалить"
                    style="width: 18px; height: 18px; vertical-align: middle;"
                  />
                </a>
              </div>
            </div>
          </div>
        `;

      historyBlock.insertAdjacentHTML("beforeend", cleaningLogTemplate);

      const hr = document.createElement("hr");
      historyBlock.insertBefore(
        hr,
        historyBlock.querySelector("#uwu-cleaningLog"),
      );

      const cleaningLogContent = historyBlock.querySelector(
        "#uwu-cleaningLog-content",
      );

      const savedLog = uwuStorage.getItem("uwu_cleaningLogSmart");

      if (savedLog) {
        const savedData = savedLog;
        cleaningLogBuffer = savedData.log;
        catNamesAndIds = savedData.catNamesAndIds;
        if (savedData.counters) {
          document.getElementById(
            "uwu-cleaningLog-counter-pickup",
          ).textContent = savedData.counters.pickup;
          document.getElementById(
            "uwu-cleaningLog-counter-putdown",
          ).textContent = savedData.counters.putdown;
        }
        cleaningLogContent.innerHTML = addCatLinksToLog(
          cleaningLogBuffer,
          catNamesAndIds,
        );
      }

      const clearButton = historyBlock.querySelector("#uwu-cleaningLog-clear");
      clearButton.addEventListener("click", (e) => {
        e.preventDefault();
        if (confirm("Вы уверены, что хотите очистить лог чистильщика?")) {
          cleaningLogBuffer = "";
          catNamesAndIds = [];
          document.getElementById(
            "uwu-cleaningLog-counter-pickup",
          ).textContent = "0";
          document.getElementById(
            "uwu-cleaningLog-counter-putdown",
          ).textContent = "0";
          cleaningLogContent.innerHTML = "";
          uwuStorage.removeItem("uwu_cleaningLogSmart");

          lastDroppedCatInfo = null;
          document
            .getElementById("uwu-cleaningLog-delete-last")
            ?.classList.add("disabled");
        }
      });

      const deleteLastButton = historyBlock.querySelector(
        "#uwu-cleaningLog-delete-last",
      );
      deleteLastButton.addEventListener("click", (e) => {
        e.preventDefault();
        if (!deleteLastButton.classList.contains("disabled")) {
          deleteLastDroppedEntry();
        }
      });

      const toggleButton = historyBlock.querySelector(
        "#uwu-cleaningLog-toggle",
      );
      const contentWrapper = historyBlock.querySelector(
        "#uwu-cleaningLog-content-wrapper",
      );

      if (logStates.cleaning) {
        contentWrapper.style.display = "none";
      }

      toggleButton.addEventListener("click", (e) => {
        e.preventDefault();
        logStates.cleaning = !logStates.cleaning;
        contentWrapper.style.display = logStates.cleaning ? "none" : "block";
        saveLogStates();
      });
    }

    function addCatLinksToLog(log, catNamesAndIds) {
      let logWithLinks = log;
      const nameToIdMap = new Map(
        catNamesAndIds.map((cat) => [cat.name, cat.id])
      );

      logWithLinks = logWithLinks.replace(/\[([^\]]+)\]/g, (match, content) => {
        const names = content.split(", ");
        const linkedNames = names.map((nameWithId) => {
          const name = nameWithId.split(" ")[0];
          const id = nameToIdMap.get(name);
          if (id) {
            return nameWithId.replace(
              name,
              `<a href="/cat${id}" target="_blank">${name}</a>`
            );
          }
          return nameWithId;
        });
        return `[${linkedNames.join(", ")}]`;
      });
      return logWithLinks;
    }

    function extractCatId(action) {
      const match = action.match(/<a href="\/cat(\d+)">/);
      return match ? match[1] : null;
    }

    function checkCatStatus(catId) {
      const catTooltip = document
        .querySelector(`#cages > tbody .cat_tooltip a[href="/cat${catId}"]`)
        ?.closest(".cat_tooltip");
      if (catTooltip) {
        const statusSpan = catTooltip.querySelector(".online");
        if (statusSpan) {
          const fontTag = statusSpan.querySelector("font");
          if (fontTag) {
            const color = fontTag.getAttribute("color")?.toUpperCase();
            if (color === "#006400" || color === "#333333") return false;
            if (color === "#A52A2A") return true;
          }
          
          const statusText = statusSpan.textContent
            .replace(/[\[\]]/g, "")
            .trim();
          const validStatuses = [
            "Спит",
            "На удалении",
            "Заблокирована",
            "Заблокирован",
          ];
          return validStatuses.includes(statusText);
        }
      }
      return false;
    }

    function processStandardAction(action, location, cleaningLogContent) {
      for (const relevantAction of relevantActions) {
        if (relevantAction.regex.test(action)) {
          const catNameMatch = action.match(/<a href="\/cat\d+">([^<]+)<\/a>/);
          if (!catNameMatch) {
            console.error("Не удалось извлечь имя кота из действия:", action);
            return;
          }
          const catName = catNameMatch[1];
          const catId = extractCatId(action);
          const actionText = action.replace(
            /<a href="\/cat\d+">([^<]+)<\/a>/,
            `[${catName}${settings.cleaningLogShowID ? ` ${catId}` : ""}]`
          );
          if (relevantAction.type === "action") {
            cleaningLogBuffer += `${actionText} на локации "${location}". `;
          } else {
            const status = checkCatStatus(catId) ? "" : "Кот не спит. ";
            cleaningLogBuffer += `Проверен [${catName}${
              settings.cleaningLogShowID ? ` ${catId}` : ""
            }] на локации "${location}". ${status}`;
          }
          if (!catNamesAndIds.some((cat) => cat.id === catId)) {
            catNamesAndIds.push({ name: catName, id: catId });
          }
          cleaningLogContent.innerHTML = addCatLinksToLog(
            cleaningLogBuffer,
            catNamesAndIds
          );
          return;
        }
      }
    }

    function processSmartAction(action, location, cleaningLogContent) {
      let matched = false;

      for (const relevantAction of relevantActions) {
        if (relevantAction.regex.test(action)) {
          matched = true;
          const catNameMatch = action.match(/<a href="\/cat\d+">([^<]+)<\/a>/);
          if (!catNameMatch) {
            console.error("Не удалось извлечь имя кота из действия:", action);
            return;
          }
          const catName = catNameMatch[1];
          const catId = extractCatId(action);
          const logLines = cleaningLogBuffer
            .split(".")
            .map((line) => line.trim())
            .filter((line) => line);

          switch (relevantAction.type) {
            case "check":
              processCheckAction(logLines, catName, catId, location);
              break;

            case "putdown":
              processPutdownAction(logLines, catName, catId, location);
              break;

            case "pickup":
              processPickupAction(logLines, catName, catId, location);
              break;
          }

          cleaningLogBuffer =
            logLines.join(". ") + (logLines.length > 0 ? "." : "");
          if (!catNamesAndIds.some((cat) => cat.id === catId)) {
            catNamesAndIds.push({ name: catName, id: catId });
          }
          cleaningLogContent.innerHTML = addCatLinksToLog(
            cleaningLogBuffer,
            catNamesAndIds
          );
          return;
        }
      }

      if (!matched) {
        const logLines = cleaningLogBuffer
          .split(".")
          .map((line) => line.trim())
          .filter((line) => line);
        processUnmatchedAction(logLines, cleaningLogContent, action);
        cleaningLogBuffer =
          logLines.join(". ") + (logLines.length > 0 ? "." : "");
        cleaningLogContent.innerHTML = addCatLinksToLog(
          cleaningLogBuffer,
          catNamesAndIds
        );
      }

      return null;
    }

    function deleteLastDroppedEntry() {
      if (!lastDroppedCatInfo) return;

      const { catName, catId } = lastDroppedCatInfo;
      const catIdentifier = `${catName}${
        settings.cleaningLogShowID ? ` ${catId}` : ""
      }`;

      let logLines = cleaningLogBuffer
        .split(".")
        .map((line) => line.trim())
        .filter(Boolean);

      let putdownRemoved = false;
      let pickupRemoved = false;

      for (let i = logLines.length - 1; i >= 0; i--) {
        let line = logLines[i];
        if (line.startsWith("Опущен") && line.includes(catIdentifier)) {
          const match = line.match(/\[([^\]]+)\]/);
          if (match) {
            let catsInGroup = match[1].split(",").map((c) => c.trim());
            if (catsInGroup.length > 1) {
              catsInGroup = catsInGroup.filter((c) => c !== catIdentifier);
              logLines[i] = line.replace(
                /\[([^\]]+)\]/,
                `[${catsInGroup.join(", ")}]`
              );
            } else {
              logLines.splice(i, 1);
            }
            putdownRemoved = true;
            break;
          }
        }
      }

      if (putdownRemoved) {
        for (let i = logLines.length - 1; i >= 0; i--) {
          let line = logLines[i];
          if (
            line.startsWith("Проверен и поднят") &&
            line.includes(catIdentifier)
          ) {
            const match = line.match(/\[([^\]]+)\]/);
            if (match) {
              let catsInGroup = match[1].split(",").map((c) => c.trim());
              if (catsInGroup.length > 1) {
                catsInGroup = catsInGroup.filter((c) => c !== catIdentifier);
                logLines[i] = line.replace(
                  /\[([^\]]+)\]/,
                  `[${catsInGroup.join(", ")}]`
                );
              } else {
                logLines.splice(i, 1);
              }
              pickupRemoved = true;
              break;
            }
          }
        }
      }

      if (putdownRemoved && pickupRemoved) {
        cleaningLogBuffer =
          logLines.join(". ") + (logLines.length > 0 ? "." : "");

        const pickupCounter = document.getElementById(
          "uwu-cleaningLog-counter-pickup"
        );
        const putdownCounter = document.getElementById(
          "uwu-cleaningLog-counter-putdown"
        );
        pickupCounter.textContent = parseInt(pickupCounter.textContent) - 1;
        putdownCounter.textContent = parseInt(putdownCounter.textContent) - 1;

        const cleaningLogContent = document.getElementById(
          "uwu-cleaningLog-content"
        );
        cleaningLogContent.innerHTML = addCatLinksToLog(
          cleaningLogBuffer,
          catNamesAndIds
        );

        uwuStorage.setItem("uwu_cleaningLogSmart", {
          log: cleaningLogBuffer,
          catNamesAndIds,
          counters: {
            pickup: parseInt(pickupCounter.textContent),
            putdown: parseInt(putdownCounter.textContent),
          },
        });
      } else {
        console.warn("UwU | Не удалось найти парные записи для удаления.");
      }

      lastDroppedCatInfo = null;
      document
        .getElementById("uwu-cleaningLog-delete-last")
        ?.classList.add("disabled");
    }

    function processCheckAction(logLines, catName, catId, location) {
      const lastLogIndex = logLines.length - 1;
      const isCatSleeping = checkCatStatus(catId);

      if (
        lastLogIndex >= 0 &&
        (logLines[lastLogIndex].includes("Проверен [") ||
          logLines[lastLogIndex].includes("Кот не спит") ||
          logLines[lastLogIndex].includes("Вы забыли проверить кота"))
      ) {
        logLines.splice(lastLogIndex, 1);
      }

      if (isCatSleeping) {
        logLines.push(
          `Проверен [${catName}${
            settings.cleaningLogShowID ? ` ${catId}` : ""
          }] на локации "${location}"`
        );
      } else {
        logLines.push(
          `Кот не спит [${catName}${
            settings.cleaningLogShowID ? ` ${catId}` : ""
          }]`
        );
      }
      if (!catNamesAndIds.some((cat) => cat.id === catId)) {
        catNamesAndIds.push({ name: catName, id: catId });
      }
      lastDroppedCatInfo = null;
      document
        .getElementById("uwu-cleaningLog-delete-last")
        ?.classList.add("disabled");
    }

    function processPutdownAction(logLines, catName, catId, location) {
      const catPattern = new RegExp(
        `\\[${catName}${settings.cleaningLogShowID ? ` ${catId}` : ""}\\]`
      );

      // 1. Ищем последнее и предпоследнее предложения.
      const lastSentenceIndex = logLines.length - 1;
      const penultimateSentenceIndex = lastSentenceIndex - 1;

      // 2. Проверяем последнее предложение на наличие "Опущен" без текущего имени кота.
      const lastSentence = logLines[lastSentenceIndex];

      if (
        lastSentence.includes(`на локации "${location}"`) &&
        lastSentence.includes("Опущен")
      ) {
        const catNamesMatch = lastSentence.match(/\[([^\]]+)\]/);
        if (catNamesMatch) {
          const catNames = catNamesMatch[1]
            .split(",")
            .map((name) => name.trim());
          const currentCatNameWithId = `${catName}${
            settings.cleaningLogShowID ? ` ${catId}` : ""
          }`;
          if (catNames.includes(currentCatNameWithId)) {
            return;
          }
        }
      }

      // 3. Если есть, добавляем имя текущего кота к этому предложению.
      if (
        lastSentence.includes(`на локации "${location}"`) &&
        lastSentence.includes("Опущен") &&
        !catPattern.test(lastSentence)
      ) {
        logLines[lastSentenceIndex] = lastSentence.replace(
          /]/,
          `, ${catName}${settings.cleaningLogShowID ? ` ${catId}` : ""}]`
        );
      } else {
        // 4. Если нет, добавляем новое предложение с "Опущен".
        logLines.push(
          `Опущен [${catName}${
            settings.cleaningLogShowID ? ` ${catId}` : ""
          }] на локации "${location}"`
        );
      }
      if (!catNamesAndIds.some((cat) => cat.id === catId)) {
        catNamesAndIds.push({ name: catName, id: catId });
      }

      const putdownCounter = document.getElementById(
        "uwu-cleaningLog-counter-putdown"
      );
      putdownCounter.textContent = parseInt(putdownCounter.textContent) + 1;
      lastDroppedCatInfo = { catName, catId };
      document
        .getElementById("uwu-cleaningLog-delete-last")
        ?.classList.remove("disabled");
    }

    function processPickupAction(logLines, catName, catId, location) {
      const catIdentifier = `[${catName}${settings.cleaningLogShowID ? ` ${catId}` : ""}]`;
      const catPattern = new RegExp(
        `\\[${catName}${settings.cleaningLogShowID ? ` ${catId}` : ""}\\]`
      );

      // 1. Ищем последнее и предпоследнее предложения.
      const lastSentenceIndex = logLines.length - 1;
      const penultimateSentenceIndex = lastSentenceIndex - 1;

      // 2. Проверяем последнее предложение на "Проверен и поднят" с именем кота.
      const lastSentence = logLines[lastSentenceIndex] || "";
      if (
        lastSentence.includes(`на локации "${location}"`) &&
        lastSentence.includes("Проверен и поднят") &&
        catPattern.test(lastSentence)
      ) {
        return;
      }

      // 3. Проверяем последнее предложение на "Проверен" с именем кота.
      let lastSentenceChecked = false;
      if (
        lastSentence.includes("Проверен") &&
        lastSentence.includes(catIdentifier) &&
        lastSentence.includes(`на локации "${location}"`)
      ) {
        lastSentenceChecked = true;
      }

      // 4. Если последнее предложение - "Проверен", проверяем предпоследнее на "Проверен и поднят".
      if (lastSentenceChecked) {
        if (
          penultimateSentenceIndex >= 0 &&
          logLines[penultimateSentenceIndex].includes("Проверен и поднят") &&
          logLines[penultimateSentenceIndex].includes(
            `на локации "${location}"`
          ) &&
          !logLines[penultimateSentenceIndex].includes(catIdentifier)
        ) {
          const currentCatMatch =
            lastSentence.match(/\[(.*?)\]/);
          if (currentCatMatch) {
            // Добавляем имя текущего кота к предпоследнему предложению.
            const existingCatsMatch =
              logLines[penultimateSentenceIndex].match(/\[(.*?)\]/);
            if (existingCatsMatch) {
              const existingCats = existingCatsMatch[1];
              const newCatString = existingCats.trim()
                ? `${existingCats}, ${catName}${
                    settings.cleaningLogShowID ? ` ${catId}` : ""
                  }`
                : `${catName}${settings.cleaningLogShowID ? ` ${catId}` : ""}`;
              logLines[penultimateSentenceIndex] = logLines[
                penultimateSentenceIndex
              ].replace(/\[(.*?)\]/, `[${newCatString}]`);
            }

            // Удаляем последнее предложение.
            logLines.splice(lastSentenceIndex, 1);
          }
        } else {
          // 5. Создаем новое предложение "Проверен и поднят".
          logLines[lastSentenceIndex] = lastSentence.replace(
            "Проверен",
            "Проверен и поднят"
          );
        }

        // Увеличиваем счетчик только если кот был успешно проверен и поднят
        const pickupCounter = document.getElementById(
          "uwu-cleaningLog-counter-pickup"
        );
        pickupCounter.textContent = parseInt(pickupCounter.textContent) + 1;

      } else {
        // 6. Если "Проверен" с именем кота нет.
        const forgotText = `Вы забыли проверить кота ${catIdentifier}`;

        if (lastSentence.includes("Кот не спит") && lastSentence.includes(catIdentifier)) {
          logLines[lastSentenceIndex] = forgotText;
        } else if (!lastSentence.includes(forgotText)) {
          logLines.push(forgotText);
        }
      }
      
      if (!catNamesAndIds.some((cat) => cat.id === catId)) {
        catNamesAndIds.push({ name: catName, id: catId });
      }

      lastDroppedCatInfo = null;
      document
        .getElementById("uwu-cleaningLog-delete-last")
        ?.classList.add("disabled");
    }

    function processUnmatchedAction(logLines, cleaningLogContent, action) {
      const lastLogIndex = logLines.length - 1;

      const isCancelAction = /Отменил(а)? /.test(action);

      if (
        lastLogIndex >= 0 &&
        logLines[lastLogIndex].includes("Проверен [") &&
        !isCancelAction
      ) {
        logLines.splice(lastLogIndex, 1);
        cleaningLogBuffer =
          logLines.join(". ") + (logLines.length > 0 ? "." : "");
        cleaningLogContent.innerHTML = addCatLinksToLog(
          cleaningLogBuffer,
          catNamesAndIds
        );
      }
      lastDroppedCatInfo = null;
      document
        .getElementById("uwu-cleaningLog-delete-last")
        ?.classList.add("disabled");
    }

    setupSingleCallback("#history", () => {
      const historyBlock = document.querySelector("#history");
      if (historyBlock && !document.getElementById("uwu-cleaningLog")) {
        createCleaningLogBlock(historyBlock);
      }

      watchVueData('cat.history', (newHistory) => {
        if (newHistory) {
          cleaningLogUpdate(newHistory);
        }
      }, { deep: false, immediate: true });
    });

    const cleaningLogStyle = document.createElement("style");
    cleaningLogStyle.innerHTML = `
          #uwu-cleaningLog-content {
            height: ${settings.cleaningLogHeight || 120}px;
            overflow-y: auto;
            resize: vertical;
          }
          #uwu-cleaningLog-actions {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 5px;
          }
          #uwu-cleaningLog-delete-last.disabled {
            pointer-events: none;
            opacity: 0.5;
            cursor: not-allowed;
          }
          `;
    document.head.appendChild(cleaningLogStyle);
  }
  // ====================================================================================================================
  //   . . . ЛОГ ЛОВЛИ . . .
  // ====================================================================================================================
  if (settings.catchingLog) {
    let logStates = uwuStorage.getItem("uwu_logStates") || {
      cleaning: false,
      catching: false,
    };
    function saveLogStates() {
      uwuStorage.setItem("uwu_logStates", logStates);
    }

    let isWaitingForItem = false;
    let mouthSnapshot = new Set();

    const stopWordsRegex = /Отменил|Отменила|Пошла|Пошёл|Поднял|Подняла/;

    let catchingState = {
      isWaiting: false, // Находимся ли мы в процессе ожидания результата?
      actionType: null, // Тип действия (diving, crevice)
      actionVerb: null, // Глагол действия (Нырнул, Осмотрела)
      foundItem: null, // Информация о найденном, но не подтвержденном предмете
      historyGaveClear: false, // Дала ли история "зеленый свет"?
      attemptCounted: false, // Гарант, что попытка засчитана только один раз
      lastLoggedItemInCycle: null,
      catchLoggedThisCycle: false,
    };

    function resetCatchingState() {
      catchingState.isWaiting = false;
      catchingState.actionType = null;
      catchingState.actionVerb = null;
      catchingState.foundItem = null;
      catchingState.historyGaveClear = false;
      catchingState.attemptCounted = false;
      catchingState.lastLoggedItemInCycle = null;
      catchingState.catchLoggedThisCycle = false;
      isWaitingForItem = false;
    }

    function logFoundItem(itemId) {
      const logData = uwuStorage.getItem("uwu_catchingLogData") || [];
      const lastSession =
        logData.length > 0 ? logData[logData.length - 1] : null;

      if (lastSession && lastSession.type === catchingState.actionType) {
        const catchTime = new Date().toLocaleTimeString("ru-RU", {
          hour: "2-digit",
          minute: "2-digit",
        });
        const newCatch = {
          itemId: itemId,
          time: catchTime,
        };
        lastSession.summary.unshift(newCatch);
        uwuStorage.setItem("uwu_catchingLogData", logData);
        renderCatchingLog(logData);
        return newCatch;
      }
      return null;
    }

    function undoLastCatch() {
      if (!catchingState.lastLoggedItemInCycle) return;

      const { itemId, time } = catchingState.lastLoggedItemInCycle;
      const logData = uwuStorage.getItem("uwu_catchingLogData") || [];
      const lastSession =
        logData.length > 0 ? logData[logData.length - 1] : null;

      if (lastSession && lastSession.type === catchingState.actionType) {
        const indexToRemove = lastSession.summary.findIndex(
          (c) => c.itemId === itemId && c.time === time
        );

        if (indexToRemove > -1) {
          lastSession.summary.splice(indexToRemove, 1);
          uwuStorage.setItem("uwu_catchingLogData", logData);
          renderCatchingLog(logData);
        }
      }
    }

    const activityTypes = {
      diving: {
        triggers: ["Нырнул.", "Нырнула."],
        type: "diving",
        title: "Ныряние",
        verb: { male: "Выловил", female: "Выловила" },
        style: {
          backgroundColor: "rgba(173, 216, 230, 0.1)",
          border: "1px solid rgba(173, 216, 230, 0.4)",
        },
      },
      crevice: {
        triggers: ["Осмотрел расщелину.", "Осмотрела расщелину."],
        type: "crevice",
        title: "Осмотр",
        verb: { male: "Нашёл", female: "Нашла" },
        style: {
          backgroundColor: "rgba(144, 238, 144, 0.1)",
          border: "1px solid rgba(144, 238, 144, 0.4)",
        },
      },
      hollow: {
        triggers: ["Осмотрел дупло.", "Осмотрела дупло."],
        type: "hollow",
        title: "Осмотр",
        verb: { male: "Нашёл", female: "Нашла" },
        style: {
          backgroundColor: "rgba(144, 238, 144, 0.1)",
          border: "1px solid rgba(144, 238, 144, 0.4)",
        },
      },
    };

    const itemNamesById = {
      20: "Паутина",
      21: "Целебная водоросль",
      75: "Мох",
      76: "Водный мох",
      110: "Мед",
      417: "Камень 2х местный",
      418: "Камень 3х местный",
      565: "Крепкая ветка",
      566: "Вьюнок",
      1034: "Маленький камушек",
      2072: "Гнездо",
      2073: "Гнездо",
      2074: "Яйцо",
      2075: "Черное перо",
      2076: "Коричневое перо",
      2077: "Голубое перо",
      3956: "Рак",
      3958: "Рак",
      3960: "Рак",
      3962: "Краснобрюхая жерлянка",
      3965: "Карась",
      3966: "Рыба",
      3967: "Рыба",
      3968: "Рыба",
      3969: "Рыба",
      3970: "Рыба",
      3971: "Речной угорь",
      3973: "Речной угорь",
      3993: "Плотная водоросль",
      3994: "Ракушка (+20)",
      3995: "Ракушка (+30)",
      3997: "Ракушка (сон)",
      3998: "Ракушка (+15)",
      3999: "Ракушка (+28)",
      4001: "Коралл",
      4002: "Коралл",
      4004: "Водоросоль",
      4005: "Водоросоль",
      4006: "Водоросоль",
      4008: "Комок",
      4009: "Комок",
      8021: "Тонколапый паук",
      8022: "Светлый паук",
      8023: "Бурый паук",
      8024: "Тёмный паук",
      8042: "Мышь",
      8043: "Упитанная мышь",
    };

    let customItemNames = null;

    function getItemNameById(itemId) {
      if (customItemNames === null) {
        customItemNames =
          uwuStorage.getItem("uwu_catchingLog_customItems") || {};
      }

      if (customItemNames.hasOwnProperty(itemId)) {
        return customItemNames[itemId];
      }

      if (itemNamesById.hasOwnProperty(itemId)) {
        return itemNamesById[itemId];
      }

      return null;
    }

    function getActivityType(actionText) {
      for (const key in activityTypes) {
        if (activityTypes[key].triggers.includes(actionText)) {
          return activityTypes[key];
        }
      }
      return null;
    }

    function renderCatchingLog(logData) {
      const contentDiv = document.getElementById("uwu-catchingLog-content");
      if (!contentDiv) return;
      contentDiv.innerHTML = "";

      logData.forEach((session) => {
        const activityConfig = activityTypes[session.type];
        if (!activityConfig) return;

        const card = document.createElement("div");
        card.className = "uwu-catching-session";
        card.style.backgroundColor = activityConfig.style.backgroundColor;
        card.style.border = activityConfig.style.border;
        card.style.borderRadius = "5px";
        card.style.padding = "5px";
        card.style.marginBottom = "5px";

        const startTime = new Date(session.startTime).toLocaleTimeString(
          "ru-RU",
          { hour: "2-digit", minute: "2-digit" }
        );
        const lastTime = new Date(session.lastActionTime).toLocaleTimeString(
          "ru-RU",
          { hour: "2-digit", minute: "2-digit" }
        );

        const verb =
          session.actionVerb === activityConfig.triggers[1]
            ? activityConfig.verb.female
            : activityConfig.verb.male;
        const emptyMessageVerb = verb.toLowerCase();

        let summaryHtml = "";
        if (session.summary.length > 0) {
          summaryHtml = "<ul style='margin: 0; padding-left: 20px;'>";
          session.summary.forEach((catchInfo) => {
            const itemName = getItemNameById(catchInfo.itemId);
            const itemDisplayName = itemName ? `${itemName} ` : "";
            summaryHtml += `<li>${itemDisplayName}ID ${catchInfo.itemId} в ${catchInfo.time}</li>`;
          });
          summaryHtml += "</ul>";
        } else {
          summaryHtml = `<p style='margin: 2px 0; font-style: italic;'>Пока что ничего не ${emptyMessageVerb} :(</p>`;
        }

        card.innerHTML = `
        <p style="margin: 2px 0;"><strong>${activityConfig.title}. Время с ${startTime} до ${lastTime}.</strong></p>
        <p style="margin: 2px 0;"><strong>Всего попыток:</strong> ${session.totalDives}</p>
        ${summaryHtml}
      `;
        contentDiv.prepend(card);
      });
    }

    function handleMouthChange(mutationsList) {
      if (!catchingState.isWaiting) return;

      for (const mutation of mutationsList) {
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
          for (const node of mutation.addedNodes) {
            if (node.nodeType === 1 && node.id && !mouthSnapshot.has(node.id)) {
              const img = node.querySelector("img");
              if (img && img.src) {
                const itemIdMatch = img.src.match(/things\/(\d+)\.png/);
                if (itemIdMatch) {
                  const itemId = itemIdMatch[1];
                  catchingState.foundItem = itemId;
                  return;
                }
              }
            }
          }
        }
      }
    }

    function catchingLogUpdate() {
      const ist = document.getElementById("ist");
      if (!ist) return;

      const actions = ist.innerText
        .split(".")
        .map((s) => s.trim() + ".")
        .filter((s) => s.length > 2);
      if (actions.length === 0) return;

      const lastAction = actions[actions.length - 1];
      const activityConfig = getActivityType(lastAction);

      const stopWordsRegex = /Отменил|Отменила|Пошла|Пошёл|Положил|Положила/;
      const pickupWordsRegex = /Поднял|Подняла/;

      if (activityConfig) {
        const logData = uwuStorage.getItem("uwu_catchingLogData") || [];
        let lastSession =
          logData.length > 0 ? logData[logData.length - 1] : null;
        const currentTime = Date.now();
        const twoHours = 2 * 60 * 60 * 1000;

        const isContinuingSession =
          lastSession &&
          lastSession.type === activityConfig.type &&
          currentTime - lastSession.lastActionTime < twoHours;

        if (!isContinuingSession) {
          const newSession = {
            type: activityConfig.type,
            startTime: currentTime,
            lastActionTime: currentTime,
            actionVerb: lastAction,
            totalDives: 0,
            summary: [],
          };
          logData.push(newSession);
          uwuStorage.setItem("uwu_catchingLogData", logData);
          renderCatchingLog(logData);
        }

        resetCatchingState();
        catchingState.isWaiting = true;
        catchingState.actionType = activityConfig.type;
        catchingState.actionVerb = lastAction;

        mouthSnapshot.clear();
        const itemsInMouth = document.querySelectorAll("#itemList > div");
        itemsInMouth.forEach((item) => {
          if (item.id) {
            mouthSnapshot.add(item.id);
          }
        });
        return;
      }

      if (!catchingState.isWaiting) return;

      if (pickupWordsRegex.test(lastAction)) {
        if (!catchingState.catchLoggedThisCycle) {
          undoLastCatch();
        }
        resetCatchingState();
        return;
      }

      if (stopWordsRegex.test(lastAction)) {
        if (
          !/Отменил|Отменила/.test(lastAction) &&
          !catchingState.attemptCounted
        ) {
          const logData = uwuStorage.getItem("uwu_catchingLogData") || [];
          let lastSession =
            logData.length > 0 ? logData[logData.length - 1] : null;
          if (lastSession && lastSession.type === catchingState.actionType) {
            lastSession.totalDives++;
            lastSession.lastActionTime = Date.now();
            uwuStorage.setItem("uwu_catchingLogData", logData);
            renderCatchingLog(logData);
          }
        }
        resetCatchingState();
        return;
      }

      if (!catchingState.attemptCounted) {
        const logData = uwuStorage.getItem("uwu_catchingLogData") || [];
        let lastSession =
          logData.length > 0 ? logData[logData.length - 1] : null;
        if (lastSession && lastSession.type === catchingState.actionType) {
          lastSession.totalDives++;
          lastSession.lastActionTime = Date.now();
          uwuStorage.setItem("uwu_catchingLogData", logData);
          renderCatchingLog(logData);
        }
        catchingState.attemptCounted = true;
      }

      if (catchingState.foundItem) {
        const loggedItem = logFoundItem(catchingState.foundItem);
        if (loggedItem) {
          catchingState.lastLoggedItemInCycle = loggedItem;
          catchingState.catchLoggedThisCycle = true;
        }
        catchingState.foundItem = null;
      }
    }

    function createCatchingLogBlock() {
      const historyContainer = document.getElementById("history");
      if (!historyContainer || document.getElementById("uwu-catchingLog"))
        return;

      const logContainerHTML =
        /* HTML */
        `
          <div id="uwu-catchingLog">
            <h2>
              <a href="#" id="uwu-catchingLog-toggle" class="toggle"
                >Лог ловли</a
              >
            </h2>
            <div id="uwu-catchingLog-content-wrapper">
              <div id="uwu-catchingLog-content"></div>
              <a href="#" id="uwu-catchingLog-clear">Очистить лог</a>
            </div>
          </div>
        `;

      const hr = document.createElement("hr");
      historyContainer.appendChild(hr);
      historyContainer.insertAdjacentHTML("beforeend", logContainerHTML);

      const contentDiv = document.getElementById("uwu-catchingLog-content");
      contentDiv.style.height = settings.catchingLogHeight
        ? `${settings.catchingLogHeight}px`
        : "120px";
      contentDiv.style.overflowY = "auto";
      contentDiv.style.resize = "vertical";

      const clearButton = document.getElementById("uwu-catchingLog-clear");
      clearButton.addEventListener("click", (e) => {
        e.preventDefault();
        if (confirm("Вы уверены, что хотите очистить лог ловли?")) {
          uwuStorage.removeItem("uwu_catchingLogData");
          renderCatchingLog([]);
        }
      });

      const toggleButton = document.getElementById("uwu-catchingLog-toggle");
      const contentWrapper = document.getElementById(
        "uwu-catchingLog-content-wrapper"
      );

      if (logStates.catching) {
        contentWrapper.style.display = "none";
      }

      toggleButton.addEventListener("click", (e) => {
        e.preventDefault();
        logStates.catching = !logStates.catching;
        contentWrapper.style.display = logStates.catching ? "none" : "block";
        saveLogStates();
      });

      const logData = uwuStorage.getItem("uwu_catchingLogData") || [];
      renderCatchingLog(logData);
    }

    setupSingleCallback("#history", createCatchingLogBlock);

    const mouthObserver = new MutationObserver(handleMouthChange);
    setupSingleCallback("#itemList", () => {
      mouthObserver.observe(document.getElementById("itemList"), {
        childList: true,
      });
    });

    setupMutationObserver("#history_block", catchingLogUpdate, {
      childList: true,
      subtree: true,
    });
  }
  // ====================================================================================================================
  //   . . . ЗВУКОВЫЕ УВЕДОМЛЕНИЯ . . .
  // ====================================================================================================================
  // мяу мяу мяу мяу мяу мяу мяу мяу мяу мяу мяу мяу
  // ====================================================================================================================
  //   . . . ЛИЧНЫЕ СООБЩЕНИЯ . . .
  // ====================================================================================================================
  /**
   * Observes the private message navigation link for the unread message counter badge.
   * Triggers an audio alert when the unread count increases.
   */
  function initPmNotification() {
    const lsLink = document.querySelector(".game-topbar-nav a[href='/ls']");
    if (!lsLink) return;

    let previousCount = 0;

    const existingBadge = lsLink.querySelector("#newls");
    if (existingBadge) {
      previousCount = parseInt(existingBadge.textContent.replace(/\D/g, ""), 10) || 0;
    }

    const observer = new MutationObserver(() => {
      const badge = lsLink.querySelector("#newls");
      const currentCount = badge ? parseInt(badge.textContent.replace(/\D/g, ""), 10) || 0 : 0;

      if (currentCount > previousCount) {
        soundManager.playSound(
          settings.notificationPMSound,
          settings.notificationPMVolume
        );
      }
      previousCount = currentCount;
    });

    observer.observe(lsLink, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  }

  if (settings.notificationPM) {
    setupSingleCallback(".game-topbar-nav a[href='/ls']", initPmNotification);
  }

  // ====================================================================================================================
  //   . . . УПРАВЛЕНИЕ ДЕЙСТВИЯМИ, ТАЙМЕРАМИ И УВЕДОМЛЕНИЯМИ . . .
  // ====================================================================================================================

  /**
   * @class ActionState
   * @description Parses and normalizes raw action strings from Vue. 
   */
  const ActionState = {
    isActive: false,
    isPickedUp: false,
    actionName: "",
    timeString: "",
    totalSeconds: 0,
    pickerName: "",

    parse(actionMess, actionMessTemplate) {
      this.isActive = false;
      this.isPickedUp = false;
      this.actionName = "";
      this.timeString = "";
      this.totalSeconds = 0;
      this.pickerName = "";

      if (!actionMess) return;

      try {
        if (actionMess.includes("держит вас во рту")) {
          this.isPickedUp = true;
          const match = actionMess.match(/^(.+?)\s+держит/);
          if (match) this.pickerName = match[1];
          return;
        }

        this.isActive = true;
        
        const timeMatch = actionMess.match(/(?:(\d+)\s*ч\s*)?(?:(\d+)\s*мин\s*)?(\d+)\s*с/);
        if (timeMatch) {
          const h = parseInt(timeMatch[1] || 0, 10);
          const m = parseInt(timeMatch[2] || 0, 10);
          const s = parseInt(timeMatch[3] || 0, 10);
          this.totalSeconds = h * 3600 + m * 60 + s;
          this.timeString = timeMatch[0].trim();
        }

        if (actionMessTemplate && actionMessTemplate.includes("&&")) {
          let cleanAction = actionMessTemplate.replace("&&", "").trim();
          if (cleanAction.endsWith('.')) cleanAction = cleanAction.slice(0, -1).trim();
          this.actionName = cleanAction;
        } else {
          const actionTextMatch = actionMess.match(/^(.+?)\s+(\d+\s*(?:ч\s*)?\d+\s*мин\s*\d+\s*с|\d+\s*мин\s*\d+\s*с|\d+\s*с)\.\s*(Отменить)?$/);
          this.actionName = actionTextMatch ? actionTextMatch[1].trim() : actionMess;
        }
      } catch (error) {
        console.error("UwU | ActionState parse error:", error);
      }
    }
  };

  /**
   * @class BrowserTabManager
   * @description Synchronizes the browser tab title with the current in-game action state.
   */
  const BrowserTabManager = {
    baseTitle: "Игровая / CatWar",
    
    update() {
      if (!settings.duplicateTimeInBrowserTab) return;

      try {
        if (!ActionState.isActive && !ActionState.isPickedUp) {
          if (document.title !== this.baseTitle) {
            document.title = this.baseTitle;
          }
          return;
        }

        if (ActionState.isPickedUp) {
          document.title = `Поднят. Во рту | ${ActionState.pickerName}`;
          return;
        }

        if (ActionState.isActive) {
          document.title = `${ActionState.timeString} | ${ActionState.actionName}`;
        }
      } catch (error) {
        console.error("UwU | BrowserTabManager update error:", error);
      }
    }
  };

  /**
   * @class ActionSoundManager
   * @description Handles audio alerts for action completion. 
   */
  const ActionSoundManager = {
    actionStartTime: null,
    earlyNotified: false,
    wasActive: false,

    update() {
      if (!settings.notificationActionEnd && !settings.notificationActionEndEarly) return;

      try {
        const isCurrentlyActive = ActionState.isActive;
        const secs = ActionState.totalSeconds;

        if (isCurrentlyActive && !this.wasActive) {
          this.actionStartTime = Date.now();
          this.earlyNotified = false;
          this.wasActive = true;
        }

        if (isCurrentlyActive && settings.notificationActionEndEarly && !this.earlyNotified) {
          if (secs <= 3 && secs > 0) {
            soundManager.playSound(settings.notificationActionEndSound, settings.notificationActionEndVolume);
            this.earlyNotified = true;
          }
        }

        if (!isCurrentlyActive && this.wasActive) {
          const actionEndTime = Date.now();
          const actionDuration = this.actionStartTime ? (actionEndTime - this.actionStartTime) : 0;

          if (actionDuration >= 6000 && !this.earlyNotified && settings.notificationActionEnd) {
            soundManager.playSound(settings.notificationActionEndSound, settings.notificationActionEndVolume);
          }

          this.actionStartTime = null;
          this.earlyNotified = false;
          this.wasActive = false;
        }
      } catch (error) {
        console.error("UwU | ActionSoundManager update error:", error);
        this.wasActive = false; 
      }
    }
  };

  /**
   * @class InMouthSoundManager
   * @description Triggers a specific audio alert when the player is grabbed by another character.
   */
  const InMouthSoundManager = {
    wasPickedUp: false,

    update() {
      if (!settings.notificationInMouth) return;

      try {
        const isCurrentlyPickedUp = ActionState.isPickedUp;

        if (isCurrentlyPickedUp && !this.wasPickedUp) {
          soundManager.playSound(settings.notificationInMouthSound, settings.notificationInMouthVolume);
        }

        this.wasPickedUp = isCurrentlyPickedUp;
      } catch (error) {
        console.error("UwU | InMouthSoundManager update error:", error);
      }
    }
  };

  /**
   * @class MainActionObserver
   * @description The single subscriber to the Vue reactivity system. 
   * Broadcasts state changes to all managers safely.
   */
  const MainActionObserver = {
    init() {
      watchVueData('cat.actionMess', (newMess) => {
        try {
          const template = getVueData('cat.actionMessTemplate') || "";
          
          ActionState.parse(newMess, template);

          BrowserTabManager.update();
          ActionSoundManager.update();
          InMouthSoundManager.update();
        } catch (error) {
          console.error("UwU | MainActionObserver watcher error:", error);
        }
      }, { deep: false, immediate: true }); 
    }
  };

  MainActionObserver.init();

  // ====================================================================================================================
  //   . . . ВВЕЛИ В БОЕВУЮ СТОЙКУ . . .
  // ====================================================================================================================
  /**
   * Observes history updates to detect incoming attacks.
   */
  function initFightModeNotification() {
    const attackRegex = /в боевую стойку, поскольку на меня напал/;

    watchVueData(
      "cat.history",
      (newHistory, oldHistory) => {
        if (typeof newHistory !== "string" || !oldHistory || typeof oldHistory !== "string") {
          return;
        }

        if (newHistory === oldHistory) return;

        let addedChunk = "";

        if (newHistory.startsWith(oldHistory)) {
          addedChunk = newHistory.slice(oldHistory.length);
        } else {
          const sentences = newHistory.trim().split(".").filter(Boolean);
          addedChunk = sentences.length > 0 ? sentences[sentences.length - 1] : "";
        }

        if (attackRegex.test(addedChunk)) {
          soundManager.playSound(
            settings.notificationInFightModeSound,
            settings.notificationInFightModeVolume
          );
        }
      },
      { deep: false, immediate: false }
    );
  }

  if (settings.notificationInFightMode) {
    initFightModeNotification();
  }

  // ====================================================================================================================
  // мяу мяу мяу мяу мяу мяу мяу мяу мяу мяу мяу мяу
  // ====================================================================================================================
  //   . . . УЛУЧШЕНИЯ НАТИВНОГО ЧАТА . . .
  // ====================================================================================================================

  /**
   * Manages native chat enhancements: injects timestamps, ranks, IDs,
   * highlights mentions, audio alerts and maybe more idk.
   */
  function initChatEnhancements() {
    const chatMsg = document.getElementById("chat_msg");
    if (!chatMsg) return;

    const chatRanksCache = new Map();
    const chatMsgMeta = new Map();

    // Message metadata from Vue
    watchVueData(
      "chat.messages",
      (messages) => {
        if (!Array.isArray(messages)) return;
        messages.forEach((msg) => {
          if (msg && msg.id) {
            chatMsgMeta.set(String(msg.id), msg);
          }
        });
      },
      { deep: true, immediate: true }
    );

    /**
     * Safely escapes special regular expression characters in a string.
     *
     * @param {string} string - The input text to escape.
     * @returns {string} Escaped string safe for RegExp constructor.
     */
    function escapeRegExp(string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }

    /**
     * Asynchronously fetches and sets the cat's rank inside the message element.
     *
     * @param {string} catId - Target cat profile ID.
     * @param {HTMLElement} rankElement - Container where the rank should be injected.
     */
    function updateChatRankAsync(catId, rankElement) {
      if (!rankElement || !catId || catId === ". . .") return;

      if (chatRanksCache.has(catId)) {
        rankElement.innerHTML = chatRanksCache.get(catId);
        return;
      }

      setTimeout(() => {
        try {
          const profileLink = document.querySelector(`.cat_tooltip a[href="/cat${catId}"]`);
          if (profileLink) {
            const tooltip = profileLink.closest(".cat_tooltip");
            const rankNode = tooltip?.querySelector("small > i");
            const rankText = rankNode?.textContent?.trim();

            if (rankText) {
              const rankHtml = ` <small><i>(${rankText})</i></small>`;
              chatRanksCache.set(catId, rankHtml);
              rankElement.innerHTML = rankHtml;
              return;
            }
          }
        } catch (err) {
          console.error(`UwU | Rank resolution error for cat ${catId}:`, err);
        }
      }, 150);
    }

    /**
     * Processes message node and injects configured enhancements.
     *
     * @param {HTMLElement} msgNode - The root message element (usually a <span> wrapping the <table>).
     * @param {boolean} [allowSound=true] - Whether to allow sound notifications (false during initial load).
     */
    function enhanceMessage(msgNode, allowSound = true) {
      if (msgNode.dataset.uwuEnhanced) return;
      msgNode.dataset.uwuEnhanced = "true";

      const chatText = msgNode.querySelector(".chat_text");
      const nickEl = msgNode.querySelector(".nick");
      const reportLink = msgNode.querySelector(".msg_report");
      const profileLink = msgNode.querySelector('.profile_actions_cell a[href^="/cat"]');

      if (!chatText || !nickEl) return;

      const msgId = reportLink?.dataset?.id;
      const catId = profileLink ? profileLink.getAttribute("href").replace("/cat", "") : null;
      const textSpan = chatText.querySelector("span:not(.uwu-chat-time)");

      // 1. Notification for climbing numbers integration
      const meta = msgId ? chatMsgMeta.get(String(msgId)) : null;
      const isNotification =
        meta?.textTransformation === "italic" ||
        (textSpan && textSpan.textContent.trim().startsWith("[") && textSpan.textContent.trim().endsWith("]"));

      if (isNotification) {
        nickEl.classList.add("is-notification");
      }

      // 2. Time
      if (settings.showChatTime) {
        let timeStr = "";
        if (meta && meta.time) {
          const d = new Date(meta.time * 1000);
          timeStr = `[${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}] `;
        } else {
          const now = new Date();
          timeStr = `[${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}] `;
        }

        const timeSpan = document.createElement("span");
        timeSpan.className = "uwu-chat-time";
        timeSpan.textContent = timeStr;
        chatText.prepend(timeSpan);
      }

      // 3. Cat ID
      if (settings.showChatId && catId) {
        const idSpan = document.createElement("i");
        idSpan.className = "uwu-chat-id";
        idSpan.textContent = ` [${catId}]`;
        nickEl.after(idSpan);
      }

      // 4. Ranks
      if (settings.showChatRanks && catId) {
        const rankSpan = document.createElement("span");
        rankSpan.className = "uwu-chat-rank";
        nickEl.after(rankSpan);
        updateChatRankAsync(catId, rankSpan);
      }

      // 5. Custom mention highlighting & Sound trigger
      let isMentioned = false;

      if (textSpan && settings.namesForNotification) {
        const rawText = textSpan.innerHTML;
        const names = settings.namesForNotification
          .split(",")
          .map((n) => n.trim())
          .filter(Boolean);

        let replacedText = rawText;
        names.forEach((name) => {
          const safePattern = escapeRegExp(name);
          const regex = new RegExp(`(^|\\s|[.,!?])(${safePattern})(?=$|\\s|[.,!?])`, "gi");
          if (regex.test(replacedText)) {
            isMentioned = true;
            replacedText = replacedText.replace(regex, `$1<span class="myname">$2</span>`);
          }
        });

        if (isMentioned) {
          textSpan.innerHTML = replacedText;
        }
      }

      if (!isMentioned && chatText.querySelector(".myname")) {
        isMentioned = true;
      }

      if (isMentioned && allowSound) {
        soundManager.playSound(
          settings.myNameNotificationSound,
          settings.notificationMyNameVolume
        );
      }
    }

    // Observe native insertions into #chat_msg
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            if (node.querySelector?.(".chat_text")) {
              enhanceMessage(node, true);
            } else if (node.classList?.contains("chat_text")) {
              const parentMsg = node.closest("span") || node;
              enhanceMessage(parentMsg, true);
            }
          }
        });
      });
    });

    observer.observe(chatMsg, { childList: true, subtree: true });

    chatMsg.querySelectorAll(".chat_text").forEach((el) => {
      const parent = el.closest("span") || el;
      enhanceMessage(parent, false);
    });
  }

  setupSingleCallback("#chat_msg", initChatEnhancements);

  // Styles
  const chatEnhanceStyles = document.createElement("style");
  chatEnhanceStyles.id = "uwu-chat-enhancements";
  chatEnhanceStyles.innerHTML = `
    #chat_msg {
      height: ${settings.chatHeight || 275}px;
      resize: vertical;
      overflow-y: auto;
      ${settings.reverseChat ? "display: flex !important; flex-direction: column-reverse !important;" : ""}
    }
    .uwu-chat-time {
      opacity: 0.5;
      font-size: 0.85em;
      margin-right: 4px;
      font-family: monospace;
    }
    .uwu-chat-id {
      opacity: 0.6;
      font-size: 0.85em;
    }
  `;
  document.head.appendChild(chatEnhanceStyles);

  // ====================================================================================================================
  //   . . . НОВЫЙ ВВОД ЧАТА . . .
  // ====================================================================================================================
  const chatForm = document.getElementById("chat_form");
  const trChatTd = document.querySelector("#tr_chat > td");

  function updateChatFormPosition() {
    if (settings.reverseChat && chatForm && trChatTd) {
      trChatTd.appendChild(chatForm);
    } else if (chatForm && trChatTd) {
      trChatTd.prepend(chatForm);
    }
  }
  updateChatFormPosition();

  if (settings.newChatInput) {
    const txtSpan = document.getElementById("txt");

    if (txtSpan) {
      const originalInput = txtSpan.querySelector("input#text");
      let textarea = document.createElement("textarea");
      textarea.id = "text";
      textarea.maxLength = 255;
      textarea.className = "ui-input";
      textarea.style.height = "auto";
      textarea.style.width = "100%";
      textarea.style.resize = "vertical";
      textarea.value = originalInput ? originalInput.value : "";

      if (originalInput) {
        originalInput.style.display = "none";
        originalInput.id = "text-original";
        txtSpan.insertBefore(textarea, originalInput);
      }

      textarea.addEventListener("input", () => {
        if (originalInput) {
          originalInput.value = textarea.value;
          originalInput.dispatchEvent(new Event("input", { bubbles: true }));
        }
      });

      watchVueData("chat.text", (newVal) => {
        if (typeof newVal === "string" && textarea.value !== newVal) {
          textarea.value = newVal;
          textarea.dispatchEvent(new Event("input", { bubbles: true }));
        }
      });

      textarea.addEventListener("keydown", function (event) {
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();
          if (originalInput) {
            originalInput.value = textarea.value;
            originalInput.dispatchEvent(new Event("input", { bubbles: true }));
          }
          const sendButton = document.getElementById("msg_send");
          sendButton?.click();
        }
      });
    }
  }

  // ====================================================================================================================
  //   . . . СЧЁТЧИК СИМВОЛОВ В ЧАТЕ . . .
  // ====================================================================================================================

  /**
   * Injects character counter into the chat input form.
   */
  function setupCharCounter() {
    if (!settings.showChatCharCounter) return;

    const chatForm = document.getElementById("chat_form");
    if (!chatForm || document.getElementById("uwu-char-counter")) return;

    const volumeLabel = chatForm.querySelector("b");
    if (!volumeLabel) return;

    const counterElement = document.createElement("span");
    counterElement.id = "uwu-char-counter";
    counterElement.style.margin = "0 8px";
    counterElement.style.opacity = "0.75";
    counterElement.style.fontSize = "12px";

    volumeLabel.parentNode.insertBefore(counterElement, volumeLabel);
    volumeLabel.parentNode.insertBefore(document.createTextNode(" | "), volumeLabel);

    /**
     * Updates the counter display. Wow so smart.
     */
    function updateCounter() {
      const inputField = chatForm.querySelector("textarea#text, input#text");
      if (!inputField) return;

      const currentLength = inputField.value.length;
      const maxLength = inputField.maxLength > 0 ? inputField.maxLength : 255;
      counterElement.textContent = `${currentLength}/${maxLength}`;
    }

    chatForm.addEventListener("input", (e) => {
      if (e.target && (e.target.id === "text" || e.target.id === "text-hide")) {
        updateCounter();
      }
    });

    updateCounter();
  }

  setupSingleCallback("#chat_form", setupCharCounter);
  // ====================================================================================================================
  //   . . . РЕДИЗАЙНЫ + + ЗАКРУГЛЕНИЕ БЛОКОВ . . .
  // ====================================================================================================================
  const sliceInfoStyle = document.createElement("style");

  if (settings.sliceInfoBlock) {
    sliceInfoStyle.innerHTML = `
      #info_main > tbody > tr > td {
        background-color: ${theme?.blocksColor || ""};
        margin-bottom: 5px;
      }
    `;
    document.head.appendChild(sliceInfoStyle);
  } else {
    sliceInfoStyle.innerHTML = `
      #tr_info > td {
        background-color: ${theme?.blocksColor || ""};
      }
    `;
    document.head.appendChild(sliceInfoStyle);
  }

  const edgeTrimBlocksStyle = document.createElement("style");
  if (settings.edgeTrimBlocks) {
    edgeTrimBlocksStyle.innerHTML =
      // css
      `
    #info_main > tbody > tr > td {
      width: fit-content;
      border-radius: 10px;
      margin-bottom: 10px;
    }
    
    #info_main,
    #tos,
    #cages_overflow,
    #cages_div {
      border-radius: 10px;
    }
    
    #main_table > tbody > #tr_actions,
    #main_table > tbody > #tr_mouth,
    #main_table > tbody > #tr_chat,
    #main_table > tbody > #tr_tos,
    #main_table > tbody > #tr_info {
      margin: 0px 10px 10px 10px;
    }
    
    #tr_chat,
    #tr_actions > td,
    #tr_mouth > td,
    #location,
    #tr_info > td {
      border-radius: 10px;
    }

    .small {
      border-top-left-radius: 0px;
      border-top-right-radius: 0px;
      border-bottom-right-radius: 10px;
      border-bottom-left-radius: 10px;
    }
    `;
    document.head.appendChild(edgeTrimBlocksStyle);
  }

  // ====================================================================================================================
  //  . . . ЗВУК БЛОКИРОВАНИЯ / ОТЖАТИЯ . . .
  // ====================================================================================================================
  /**
   * Observes the combat block toggle icon (#block) and triggers audio alerts on state change.
   */
  function initBlockNotification() {
    const blockElement = document.getElementById("block");
    if (!blockElement) return;

    let lastSrc = blockElement.getAttribute("src");

    const blockObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "attributes" && mutation.attributeName === "src") {
          const currentSrc = blockElement.getAttribute("src");
          if (currentSrc !== lastSrc) {
            lastSrc = currentSrc;
            soundManager.playSound(
              settings.notificationBlockSound,
              settings.notificationBlockVolume
            );
          }
        }
      }
    });

    blockObserver.observe(blockElement, {
      attributes: true,
      attributeFilter: ["src"]
    });
  }

  if (settings.notificationBlock) {
    setupSingleCallback("#block", initBlockNotification);
  }

  // ====================================================================================================================
  //  . . . КОМАНДЫ В БОЕВОМ РЕЖИМЕ . . .
  // ====================================================================================================================
  /**
   * Integrates team color management and cage arrow coloring into battle panel.
   */
  function initFightTeams() {
    const fightPanel = document.getElementById("fightPanel");
    if (!fightPanel || document.getElementById("updateTableButton")) return;

    const colors = settings.fightTeamsColors;
    const uwu_fightTeamsCats = uwuStorage.getItem("uwu_fightTeamsCats") || {};
    const resizeHandle = document.getElementById("fight_panel_resize");

    fightPanel.style.setProperty("min-height", "fit-content", "important");

    const button = document.createElement("button");
    button.id = "updateTableButton";
    button.className = "ui-btn";
    button.style.cssText = "width: 100%; box-sizing: border-box; margin: 4px 0 12px 0; flex-shrink: 0;";
    button.textContent = "Обновить команды";

    if (resizeHandle) {
      resizeHandle.before(button);
    } else {
      fightPanel.appendChild(button);
    }

    button.onclick = () => {
      if (!document.getElementById("uwu-team-settings")) {
        createTeamTable();
      }
      updateTeamTable();
    };

    function createTeamTable() {
      const tableContainer = document.createElement("div");
      tableContainer.id = "uwu-team-settings";
      tableContainer.style.cssText = `
        height: ${settings.fightTeamsPanelHight || 100}px;
        box-sizing: border-box;
        overflow-y: auto;
        overflow-x: hidden;
        resize: vertical;
        margin-bottom: 6px;
        flex-shrink: 0;
      `;
      tableContainer.innerHTML = `
        <table id="uwu-team-settings-table" style="width: 100%; border-collapse: collapse; font-size: 12px;">
          <thead>
            <tr style="background: rgba(0,0,0,0.2);">
              <th style="border: 1px solid rgba(255,255,255,0.1); padding: 4px;">Имя</th>
              <th style="border: 1px solid rgba(255,255,255,0.1); padding: 4px;">Команда</th>
            </tr>
          </thead>
          <tbody id="teamTableBody"></tbody>
        </table>
      `;
      button.before(tableContainer);
    }

    function updateTeamTable() {
      const tbody = document.getElementById("teamTableBody");
      if (!tbody) return;
      tbody.innerHTML = "";
      const cages = document.querySelectorAll("#cages .cage");

      cages.forEach((cage) => {
        const catName = cage.querySelector(".cat_tooltip a")?.textContent;
        const arrow = cage.querySelector(
          ".arrow.arrow-paws, .arrow.arrow-claws, .arrow.arrow-teeth"
        );

        if (catName && arrow) {
          const arrowId = arrow.id;
          const savedTeam = uwu_fightTeamsCats[arrowId];

          const buttonsHTML = Object.keys(colors)
            .map((team) => {
              const isSelected = savedTeam === team ? "selected" : "";
              return `
                <button 
                  class="team-color-button ${isSelected}"
                  data-arrow-id="${arrowId}"
                  data-team="${team}"
                  style="
                    background-color: ${colors[team][0]}; 
                    flex: 1; 
                    height: 18px; 
                    border: 1px solid #333; 
                    padding: 0; 
                    margin: 0; 
                    cursor: pointer;
                    box-sizing: border-box;
                  "
                ></button>
              `;
            })
            .join("");

          const rowHTML = `
            <tr>
              <td style="border: 1px solid rgba(255,255,255,0.1); padding: 4px; vertical-align: middle;">${catName}</td>
              <td style="
                  border: 1px solid rgba(255,255,255,0.1); 
                  padding: 4px; 
                  display: flex; 
                  justify-content: space-between; 
                  gap: 4px;
                  align-items: center;
              ">
                ${buttonsHTML}
              </td>
            </tr>
          `;
          tbody.insertAdjacentHTML("beforeend", rowHTML);

          if (savedTeam) {
            applyTeamColors(arrowId, savedTeam);
          }
        }
      });

      const teamColorButtons = document.querySelectorAll(".team-color-button");
      teamColorButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
          const arrowId = btn.getAttribute("data-arrow-id");
          const team = btn.getAttribute("data-team");
          applyTeamColors(arrowId, team);
        });
      });
    }

    function applyTeamColors(arrowId, team) {
      let styleElement = document.getElementById(`team-color-${arrowId}`);
      if (!styleElement) {
        styleElement = document.createElement("style");
        styleElement.id = `team-color-${arrowId}`;
        document.head.appendChild(styleElement);
      }
      styleElement.textContent = `
        #${arrowId} .arrow_green { background-color: ${colors[team][0]} !important; }
        #${arrowId} .arrow_red { background-color: ${colors[team][1]} !important; }
      `;

      uwu_fightTeamsCats[arrowId] = team;
      uwuStorage.setItem("uwu_fightTeamsCats", uwu_fightTeamsCats);
    }
  }

  if (settings.fightTeams) {
    setupSingleCallback("#fightPanel", initFightTeams);
  }

  // ====================================================================================================================
  //   . . . КОМПАКТНЫЙ ЛОГ БОЕВОГО РЕЖИМА . . .
  // ====================================================================================================================

  /**
   * Compacts consecutive identical fight log actions into a single row with an incremental counter.
   */
  function initCompactFightLog() {
    const fightLog = document.getElementById("fightLog");
    if (!fightLog) return;

    fightLog.style.display = "none";

    let compactedFightLog = document.getElementById("uwu-Compacted-Fight-Log");
    if (!compactedFightLog) {
      compactedFightLog = document.createElement("div");
      compactedFightLog.id = "uwu-Compacted-Fight-Log";
      fightLog.parentNode.insertBefore(compactedFightLog, fightLog);
    }

    /**
     * Drains all queued raw entries from the native log into the compacted log view.
     */
    function drainLogQueue() {
      const entries = Array.from(fightLog.childNodes).filter(
        (entry) => entry.tagName === "SPAN"
      );
      if (entries.length === 0) return;

      entries.forEach((entry) => {
        const text = entry.textContent.trim();
        const match = text.match(/^(.*) x(\d+)$/);
        const originalText = match ? match[1] : text;
        const count = match ? parseInt(match[2], 10) : 1;

        const latestEntry = compactedFightLog.firstElementChild;
        const latestTextSpan = latestEntry?.querySelector(".text");

        if (latestTextSpan && latestTextSpan.textContent.trim() === originalText) {
          const countLabel = latestEntry.querySelector(".count");
          const existingCount = parseInt(
            countLabel.textContent.match(/x(\d+)$/)[1],
            10
          );
          countLabel.textContent = ` x${existingCount + count}`;
        } else {
          const row = document.createElement("div");
          row.className = entry.className;
          row.innerHTML = `<span class="text">${originalText}</span><label class="count"> x${count}</label>`;
          compactedFightLog.insertAdjacentElement("afterbegin", row);
        }

        entry.remove();
      });
    }

    const observer = new MutationObserver(drainLogQueue);
    observer.observe(fightLog, { childList: true });
    drainLogQueue();
  }

  if (settings.compactFightLog) {
    setupSingleCallback("#fightLog", initCompactFightLog);

    const compactLogStyle = document.createElement("style");
    compactLogStyle.id = "uwu-compact-fight-log-style";
    compactLogStyle.innerHTML = `
      #uwu-Compacted-Fight-Log {
        flex: 1 1 auto;
        min-height: 70px;
        overflow-y: auto;
        margin: 4px;
        box-sizing: border-box;
        overflow-wrap: anywhere;
        word-break: break-word;
        white-space: normal;
        padding: 2px;
      }
      #uwu-Compacted-Fight-Log > div {
        width: 100%;
        box-sizing: border-box;
        margin-bottom: 2px;
      }
    `;
    document.head.appendChild(compactLogStyle);
  }

  // ====================================================================================================================
  //   . . . ВСЕГДА ДЕНЬ В ИГРОВОЙ . . .
  // ====================================================================================================================
  // Вот бы всё писалось так кратко и легко...........
  function updateAlwaysDayStyle(checked) {
    const alwaysDayStyle = `
      #cages_div {
        opacity: 1 !important;
      }   
    `;

    const styles = document.head.querySelectorAll("style");
    let styleFound = false;

    styles.forEach((style) => {
      if (style.innerHTML === alwaysDayStyle) {
        if (!checked) {
          document.head.removeChild(style);
        }
        styleFound = true;
      }
    });

    if (checked && !styleFound) {
      const alwaysDay = document.createElement("style");
      alwaysDay.innerHTML = alwaysDayStyle;
      document.head.appendChild(alwaysDay);
    }
  }
  // ====================================================================================================================
  //   . . . НЕБО - ШАПКА . . .
  // ====================================================================================================================
  if (settings.skyInHeader) {
    function getSkyUrl() {
      const skyElement = document.querySelector("#sky");
      if (skyElement) {
        const skyStyle = skyElement.getAttribute("style");
        const match = skyStyle.match(/url\((.*?)\)/);
        if (match) {
          return match[1].trim();
        } else {
          console.log("Не удалось найти URL изображения неба");
        }
      }
      return "";
    }

    const skyDiv = document.createElement("div");
    skyDiv.id = "skyDuplicate";

    const globalContainerElement = document.getElementById(
      "uwu-global-container"
    );
    globalContainerElement.appendChild(skyDiv);

    const skyStyle = document.createElement("style");
    skyStyle.innerHTML = `
      #skyDuplicate {
        height: 15%;
        width: 100%;
        mask-image: linear-gradient(to bottom, 
          rgba(0, 0, 0, 1), 
          rgba(0, 0, 0, 0.40) 50%,
          rgba(0, 0, 0, 0)
        );
        top: 0;
        left: 0;
        z-index: -1;
        position: absolute;
        background-size: cover;
      }
    `;
    document.head.appendChild(skyStyle);

    const originalSkyStyle = document.createElement("style");
    originalSkyStyle.innerHTML = `
      #tr_sky {
        display: none;
      }
    `;
    document.head.appendChild(originalSkyStyle);

    function updateSkyImage() {
      const skyUrl = getSkyUrl();
      if (skyUrl) {
        skyDiv.style.backgroundImage = `url(${skyUrl})`;
      }
    }

    updateSkyImage();

    setupMutationObserver(
      "#sky",
      updateSkyImage,
      { attributes: true, attributeFilter: ["style"] },
      8,
      500,
      10
    );
  }
  // ====================================================================================================================
  //   . . . ОПРЕДЕЛЕНИЕ ПОГОДЫ В ИГРОВОЙ . . . 🛠️
  // ====================================================================================================================
  let currentWeather = "null";
  let currentHour = "null";
  let currentSeason = "null";
  let currentTemperature = "null";
  let temperatureDescription = "null";
  // ахахаха глянье на этих незнающих
  let weatherModifier = 1;

  if (settings.manualWeatherPanel) {
    const manualWeatherSlider = document.getElementById("manualWeather");

    manualWeatherSlider.addEventListener("change", () => {
      const selectedWeather = manualWeatherSlider.value;

      if (selectedWeather === "1") {
        currentWeather = "clear";
      } else if (selectedWeather === "2") {
        if (settings.minecraftStyle) {
          currentWeather = "pixelRain";
        } else {
          currentWeather = "rain";
        }
      } else if (selectedWeather === "3") {
        if (settings.minecraftStyle) {
          currentWeather = "pixelSnow";
        } else {
          currentWeather = "snow";
        }
      }
    });
  }

  function getSkyType() {
    const skyElement = document.querySelector("#sky");
    if (!skyElement) {
      currentWeather = "unknown";
      return;
    }
    const skyStyle = skyElement.getAttribute("style");

    if (settings.weatherEnabled) {
      const match = skyStyle.match(/\/(\d+)\.png/);
      if (match) {
        const skyNumber = parseInt(match[1], 10);

        switch (skyNumber) {
          case 2:
          case 4:
            currentWeather = settings.minecraftStyle ? "pixelRain" : "rain";
            uwuStorage.setItem("uwu_lastActiveWeather", "rain");
            break;
          case 7:
          case 8:
            currentWeather = settings.minecraftStyle ? "pixelSnow" : "snow";
            uwuStorage.setItem("uwu_lastActiveWeather", "snow");
            break;
          case 22:
            currentWeather = "northernLights";
            break;
          default:
            currentWeather = "clear";
        }
      } else {
        currentWeather = "unknown";
      }
    }
  }

  function getTime() {
    const timeElement = document.querySelector("#hour");
    if (!timeElement) {
      currentHour = "unknown";
      return;
    }
    const hourImg = timeElement.querySelector("img");

    if (!hourImg) {
      currentHour = "unknown";
      return;
    }

    const hourTime = hourImg.getAttribute("src");

    if (!hourTime) {
      currentHour = "unknown";
      return;
    }

    if (settings.weatherEnabled) {
      const match = hourTime.match(/(\d+)\.png$/);
      if (match) {
        const hourNumber = parseInt(match[1]);

        if (hourNumber >= 6 && hourNumber <= 12) {
          currentHour = "morning";
        } else if (hourNumber >= 13 && hourNumber <= 18) {
          currentHour = "day";
        } else if (hourNumber >= 19 && hourNumber <= 21) {
          currentHour = "evening";
        } else {
          currentHour = "night";
        }
      } else {
        currentHour = "unknown";
      }
    }
  }

  function getSeason() {
    const seasonElement = document.querySelector("img[src*='symbole/season']");
    if (!seasonElement) {
      currentSeason = "unknown";
      return;
    }

    const seasonSrc = seasonElement.getAttribute("src");
    if (!seasonSrc) {
      currentSeason = "unknown";
      return;
    }

    const match = seasonSrc.match(/season(\d+)\.png/);
    if (match) {
      const seasonNumber = parseInt(match[1]);
      switch (seasonNumber) {
        case 0:
          currentSeason = "winter";
          break;
        case 1:
          currentSeason = "spring";
          break;
        case 2:
          currentSeason = "summer";
          break;
        case 3:
          currentSeason = "autumn";
          break;
        default:
          currentSeason = "unknown";
      }
    } else {
      currentSeason = "unknown";
    }
  }

  function getTemperature() {
    const temperatureElement = document.querySelector("#tos");
    const temperatureElementHTML = temperatureElement.outerHTML;
    const backgroundValue = /background:\s*([a-zA-Z0-9#()]+);/.exec(
      temperatureElementHTML
    );

    if (backgroundValue && backgroundValue.length > 1) {
      const foundBackground = backgroundValue[1];

      const temperatureRanges = [
        {
          description: "Очень холодно",
          temperature: -3,
          colors: [
            "#94BDD2",
            "#9DC5D8",
            "#B2D8E5",
            "#C3E8EF",
            "#AED4E2",
            "#AAD1E0",
            "#A5CDDD",
          ],
        },
        {
          description: "Холодно",
          temperature: -2,
          colors: [
            "#7FAAC5",
            "#76A2C0",
            "#6A96B8",
            "#6593B6",
            "#618FB3",
            "#7BA6C3",
          ],
        },
        {
          description: "Прохладно",
          temperature: -1,
          colors: [
            "#3B6C9B",
            "#4C7BA6",
            "#5887AE",
            "#5D8BB0",
            "#4777A3",
            "#366899",
            "#3F709E",
            "#4374A1",
            "#5483AB",
          ],
        },
        {
          description: "Тепло",
          temperature: 1,
          colors: ["#FCBD8E", "#F8A37A", "#F79E77", "#FDC291", "#FCB88A"],
        },
        {
          description: "Жарковато",
          temperature: 2,
          colors: [
            "#F79973",
            "#F6946F",
            "#F58F6B",
            "#F28060",
            "#F38563",
            "#F17A5C",
            "#EF6B50",
            "#F07054",
          ],
        },
        {
          description: "Жарко",
          temperature: 3,
          colors: [
            "#EE664D",
            "#ED6149",
            "#EB5741",
            "#EB523D",
            "#E73D2E",
            "#E6382A",
          ],
        },
        {
          description: "Засуха",
          temperature: 4,
          colors: ["#DF0A08", "#E3241B", "#E4291F", "#E52E22", "#E63326"],
        },
      ];

      let foundTemperature = null;

      for (const range of temperatureRanges) {
        if (range.colors.includes(foundBackground)) {
          foundTemperature = range;
          break;
        }
      }

      if (foundTemperature) {
        currentTemperature = foundTemperature.temperature;
        temperatureDescription = foundTemperature.description;
      } else {
        currentTemperature = 1;
        temperatureDescription =
          "Неизвестная температура. Разработчик скорее всего уже в курсе и в скором времени выпустит правку.";
        console.warn("Неизвестная температура:", foundBackground);
      }

      switch (currentTemperature) {
        case 1:
        case -1:
          weatherModifier = 2;
          break;
        case 2:
        case -2:
          weatherModifier = 1.5;
          break;
        case 3:
        case -3:
          weatherModifier = 1;
          break;
        default:
          weatherModifier = 1;
      }

      // console.log("Температура:", currentTemperature);

      const temperatureDisplayElement = document.getElementById("temperature");
      if (temperatureDisplayElement) {
        temperatureDisplayElement.innerHTML = `[?] Текущий модификатор: ${weatherModifier} (${temperatureDescription})`;
      }
    } else {
      // console.log("...я временно потерял бекграунд температуры🌡️...");
    }
  }
  // ====================================================================================================================
  if (!settings.manualWeatherPanel) {
    setupMutationObserver("#sky", getSkyType);

    setupSingleCallback("#hour", getTime);
    setupMutationObserver(
      "#hour",
      getTime,
      {
        attributes: true,
        attributeFilter: ["src"],
        subtree: true,
      },
      8,
      500,
      20
    );

    setupMutationObserver("img[src*='symbole/season']", getSeason, {
      attributes: true,
      attributeFilter: ["src"],
    });
  }

  setupMutationObserver("#tos", getTemperature, {
    attributes: true,
    subtree: true,
  });
  // ====================================================================================================================
  //   . . . ПОДГОТОВКА КОНТЕЙНЕРОВ / ИЗОБРАЖЕНИЙ . . . 🖼️
  // ====================================================================================================================
  const weatherContainer = document.getElementById("uwu-main-container");
  const weatherCanvas = document.createElement("canvas");
  weatherCanvas.classList.add("weatherCanvas");
  weatherCanvas.style.zIndex = settings.weatherZIndex;
  weatherContainer.appendChild(weatherCanvas);
  const weatherCtx = weatherCanvas.getContext("2d");

  function resizeCanvasElement() {
    weatherCanvas.width = weatherCanvas.parentNode.offsetWidth;
    weatherCanvas.height = weatherCanvas.parentNode.offsetHeight;
  }

  window.addEventListener("resize", resizeCanvasElement);
  resizeCanvasElement();

  const images = {
    pixelSnow: [
      {
        url: "https://raw.githubusercontent.com/Ibirtem/CatWar/main/images/snowflake1.png",
      },
      {
        url: "https://raw.githubusercontent.com/Ibirtem/CatWar/main/images/snowflake2.png",
      },
    ],
    pixelRain: [
      {
        url: "https://raw.githubusercontent.com/Ibirtem/CatWar/main/images/rain1.png",
      },
      {
        url: "https://raw.githubusercontent.com/Ibirtem/CatWar/main/images/rain2.png",
      },
    ],
    pixelSplash: [
      {
        url: "https://raw.githubusercontent.com/Ibirtem/CatWar/main/images/splash_0.png",
      },
      {
        url: "https://raw.githubusercontent.com/Ibirtem/CatWar/main/images/splash_1.png",
      },
    ],
  };

  async function loadImages(type) {
    const imagesForType = images[type];
    if (!imagesForType) {
      console.error(`Чё ета...?: ${type}`);
      return;
    }

    const promises = [];

    for (const image of imagesForType) {
      promises.push(
        new Promise((resolve, reject) => {
          const img = new Image();
          img.src = image.url;
          img.onload = function () {
            image.image = this;
            resolve();
          };
          img.onerror = function () {
            console.error(`Чёта не скачалось: ${image.url}`);
            reject();
          };
        })
      );
    }

    await Promise.all(promises);
  }
  loadImages("pixelSnow");
  loadImages("pixelRain");
  loadImages("pixelSplash");

  const { raindrops } = generateRain();
  const { snowflakes } = generateSnowflakes();
  const { pixelRaindrops } = generatePixelRain();
  const { pixelSnowflakes } = generatePixelSnow();

  // ====================================================================================================================
  //   . . . РЕЖИМ НИЗКОЙ ПРОИЗВОДИТЕЛЬНОСТИ . . .
  // ====================================================================================================================
  // Может быть уже даже готовка к динамичному количеству частиц.
  var rainNumParticles = 10;
  var snowTimerValue = 120;
  var desiredNumberOfFireflies = 10;

  function setWeatherPerformanceMode() {
    const isLow = settings.weatherParticlesAmount === "low";
    
    rainNumParticles = isLow ? 4 : 10;
    snowTimerValue = isLow ? 240 : 120;
    desiredNumberOfFireflies = isLow ? 6 : 10;

    return { rainNumParticles, snowTimerValue, desiredNumberOfFireflies };
  }

  setWeatherPerformanceMode();
  // ====================================================================================================================
  //   . . . ДОЖДЬ . . . 🌧️
  // ====================================================================================================================
  function generateRain() {
    const raindrops = [];

    setInterval(() => {
      if (currentWeather === "rain") {
        for (let i = 0; i < rainNumParticles; i++) {
          const raindrop = generateRaindrop();
          if (raindrop) {
            raindrops.push(raindrop);
          }
        }
      }
    }, 80);

    function generateRaindrop() {
      if (document.hidden) {
        return;
      }
      const x = Math.random() * weatherCanvas.width;
      const y = Math.random() * -100;
      const length = (Math.random() * 20 + 40) / weatherModifier;
      const width = (Math.random() * 1 + 1) / weatherModifier;
      const ySpeed = length * 0.2 * weatherModifier;
      const xSpeed = Math.random() * 1;

      return { x, y, length, width, ySpeed, xSpeed };
    }

    return { raindrops };
  }

  function drawRaindrop(raindrop) {
    weatherCtx.beginPath();
    weatherCtx.ellipse(
      raindrop.x,
      raindrop.y,
      raindrop.width,
      raindrop.length,
      0,
      Math.PI,
      2 * Math.PI
    );
    weatherCtx.fillStyle = "rgba(150, 150, 150, 0.4)";
    weatherCtx.fill();
  }
  // ====================================================================================================================
  //   . . . СНЕГ . . . 🌨️
  // ====================================================================================================================
  function generateSnowflakes() {
    const snowflakes = [];
    const snowTimerValue = setWeatherPerformanceMode().snowTimerValue;

    setInterval(() => {
      if (currentWeather === "snow") {
        for (let i = 0; i < 1; i++) {
          const snowflake = generateSnowflake();
          if (snowflake) {
            snowflakes.push(snowflake);
          }
        }
      }
    }, snowTimerValue);

    function generateSnowflake() {
      if (document.hidden) {
        return;
      }
      const y = Math.random() * -100;
      const x = Math.random() * weatherCanvas.width;
      const size = (Math.random() * 5 + 2) / weatherModifier;
      const ySpeed = size * 0.1 * weatherModifier;
      const xSpeed = (Math.random() - Math.random()) * 0.2;
      const opacity = 1;

      return { x, y, size, ySpeed, xSpeed, opacity };
    }

    return { snowflakes };
  }

  function drawSnowflake(x, y, size) {
    weatherCtx.beginPath();
    weatherCtx.ellipse(x, y, size, size, 0, 0, 2 * Math.PI);
    weatherCtx.fillStyle = "white";
    weatherCtx.fill();
  }
  // ====================================================================================================================
  //   . . . ПИКСЕЛЬНЫЙ ДОЖДЬ . . . 🌧️
  // ====================================================================================================================
  function generatePixelRain() {
    const pixelRaindrops = [];

    setInterval(() => {
      if (currentWeather === "pixelRain") {
        for (let i = 0; i < rainNumParticles; i++) {
          const pixelRaindrop = generatePixelRaindrop();
          if (pixelRaindrop) {
            pixelRaindrops.push(pixelRaindrop);
          }
        }
      }
    }, 80);

    function generatePixelRaindrop() {
      if (document.hidden) {
        return;
      }
      const x = Math.random() * weatherCanvas.width;
      const y = Math.random() * -100;
      const size = (Math.random() * 26 + 26) / Math.pow(weatherModifier, 0.5);
      const ySpeed = size * 0.2 * Math.pow(weatherModifier, 0.5);
      const xSpeed = Math.random() * 0.2 - 0.1;
      const imageData =
        images.pixelRain[Math.floor(Math.random() * images.pixelRain.length)];
      const image = imageData.image;

      return { x, y, size, ySpeed, xSpeed, image };
    }

    return { pixelRaindrops };
  }

  function drawPixelRaindrop(pixelRaindrop) {
    const imageWidth = pixelRaindrop.image.width;
    const imageHeight = pixelRaindrop.image.height;
    const scaleFactor = pixelRaindrop.size / Math.max(imageWidth, imageHeight);

    weatherCtx.drawImage(
      pixelRaindrop.image,
      pixelRaindrop.x,
      pixelRaindrop.y,
      imageWidth * scaleFactor,
      imageHeight * scaleFactor
    );
  }
  // ====================================================================================================================
  //   . . . ПИКСЕЛЬНЫЙ СНЕГ . . . 🌨️
  // ====================================================================================================================
  function generatePixelSnow() {
    const pixelSnowflakes = [];
    const snowTimerValue = setWeatherPerformanceMode().snowTimerValue;

    setInterval(() => {
      if (currentWeather === "pixelSnow") {
        for (let i = 0; i < 1; i++) {
          const pixelSnowflake = generatePixelSnowflake();
          if (pixelSnowflake) {
            pixelSnowflakes.push(pixelSnowflake);
          }
        }
      }
    }, snowTimerValue);

    function generatePixelSnowflake() {
      if (document.hidden) {
        return;
      }
      const y = Math.random() * -100;
      const x = Math.random() * weatherCanvas.width;
      const size = (Math.random() * 8 + 8) / Math.pow(weatherModifier, 0.8); // TODO - Протестить, сильно ли влияет Math.pow на производительность или нет
      const ySpeed = size * 0.1 * Math.pow(weatherModifier, 0.8) - 0.6;
      const xSpeed = (Math.random() - Math.random()) * 0.2;
      const imageData =
        images.pixelSnow[Math.floor(Math.random() * images.pixelSnow.length)];
      const image = imageData.image;
      const opacity = 1;

      return { x, y, size, ySpeed, xSpeed, image, opacity };
    }

    return { pixelSnowflakes };
  }

  function drawPixelSnowflake(x, y, size, image) {
    weatherCtx.drawImage(image, x - size / 2, y - size / 2, size, size);
  }
  // ====================================================================================================================
  //   . . . АНИМАЦИЯ ПОГОДЫ / ЧАСТИЦ . . .
  // ====================================================================================================================
  let lastTime = 0;

  function animateWeather() {
    const currentTime = performance.now();
    const deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;

    const baseSpeedMultiplier = 140;

    weatherCtx.clearRect(0, 0, weatherCanvas.width, weatherCanvas.height);

    if (raindrops.length > 0) {
      for (const raindrop of raindrops) {
        raindrop.y += raindrop.ySpeed * baseSpeedMultiplier * deltaTime;
        raindrop.x += raindrop.xSpeed * baseSpeedMultiplier * deltaTime;
        drawRaindrop(raindrop);
      }
    }

    if (snowflakes.length > 0) {
      for (const snowflake of snowflakes) {
        snowflake.y += snowflake.ySpeed * baseSpeedMultiplier * deltaTime;
        snowflake.x += snowflake.xSpeed * baseSpeedMultiplier * deltaTime;
        drawSnowflake(snowflake.x, snowflake.y, snowflake.size);
      }
    }

    if (pixelSnowflakes.length > 0) {
      for (const pixelSnowflake of pixelSnowflakes) {
        pixelSnowflake.y +=
          pixelSnowflake.ySpeed * baseSpeedMultiplier * deltaTime;
        pixelSnowflake.x +=
          pixelSnowflake.xSpeed * baseSpeedMultiplier * deltaTime;
        drawPixelSnowflake(
          pixelSnowflake.x,
          pixelSnowflake.y,
          pixelSnowflake.size,
          pixelSnowflake.image
        );
      }
    }

    if (pixelRaindrops.length > 0) {
      for (const pixelRaindrop of pixelRaindrops) {
        pixelRaindrop.y +=
          pixelRaindrop.ySpeed * baseSpeedMultiplier * deltaTime;
        pixelRaindrop.x +=
          pixelRaindrop.xSpeed * baseSpeedMultiplier * deltaTime;
        drawPixelRaindrop(pixelRaindrop);
      }
    }

    requestAnimationFrame(animateWeather);
  }

  if (settings.weatherEnabled || settings.manualWeatherPanel) {
    animateWeather();
  }
  // ====================================================================================================================
  //   . . . СЕВЕРНОЕ СИЯНИЕ . . . 🌟
  // ====================================================================================================================
  const auroraColors = {
    green: {
      1: "#aaff9d",
      2: "#00faa0",
      3: "#00ff62",
    },
    blue: {
      1: "#9DF5ED",
      2: "#82BBF5",
      3: "#725DFA",
    },
  };
  const auroras = [];

  function removeAurora(auroraElement) {
    auroraElement.style.animation = "auroraFadeOut 6s ease-in-out";

    setTimeout(() => {
      if (weatherContainer.contains(auroraElement)) {
        weatherContainer.removeChild(auroraElement);
        const index = auroras.indexOf(auroraElement);
        if (index > -1) {
          auroras.splice(index, 1);
        }
      } else {
        console.warn(
          "Element to be removed is not a child of weatherContainer."
        );
      }
    }, 6000);
  }

  function createAurora(color) {
    for (const auroraElement of auroras) {
      removeAurora(auroraElement);
    }

    const newAurora = document.createElement("div");

    newAurora.style.cssText = `
    transform: translate(0, 60%);
    z-index: -1;
    position: fixed;
    left: 0;
    width: 100%;
    height: 30%;
    filter: blur(4rem);
    animation: aurora-spin 15s linear infinite, auroraFadeIn 6s ease-in-out;
    background: conic-gradient(from var(--gradient-angle),
    ${auroraColors[color][1]},
    ${auroraColors[color][2]},
    ${auroraColors[color][3]},
    ${auroraColors[color][2]},
    ${auroraColors[color][1]});
    `;

    if (settings.auroraPos === "1") {
      newAurora.style.top = "-30%";
    } else if (settings.auroraPos === "2") {
      newAurora.style.bottom = "0";
    }

    weatherContainer.appendChild(newAurora);
    auroras.push(newAurora);
  }

  function toggleAurora() {
    if (settings.manualWeatherPanel) return;

    const isAuroraConditionMet =
      currentWeather === "northernLights" ||
      (currentWeather === "clear" &&
        currentHour === "night" &&
        (currentSeason === "autumn" || currentSeason === "winter"));

    if (isAuroraConditionMet) {
      if (auroras.length === 0) {
        const auroraColor = Math.random() > 0.5 ? "green" : "blue";
        createAurora(auroraColor);
      }
    } else {
      auroras.forEach(removeAurora);
    }
  }

  setInterval(() => {
    toggleAurora();
    if (!settings.manualWeatherPanel) {
      generateFirefliesNaturally();
    }
  }, 2000);
  // ====================================================================================================================
  //   . . . СВЕТЛЯЧКИ . . . 🪲
  // ====================================================================================================================
  const fireflies = [];
  const glowSizeMultiplier = 12;

  function generateFirefly() {
    const x = Math.random() * weatherCanvas.width;
    const y = Math.random() * weatherCanvas.height;
    const size = Math.random() * 5 + 10;
    const xSpeed = (Math.random() - 0.5) * 0.5;
    const ySpeed = (Math.random() - 0.5) * 0.5;

    const firefly = document.createElement("div");
    firefly.className = "firefly";
    firefly.style.left = x + "px";
    firefly.style.top = y + "px";
    firefly.style.width = size + "px";
    firefly.style.height = size + "px";

    const glow = document.createElement("div");
    glow.className = "firefly-glow";
    glow.style.left = x + "px";
    glow.style.top = y + "px";
    glow.style.width = size * glowSizeMultiplier + "px";
    glow.style.height = size * glowSizeMultiplier + "px";

    return { element: firefly, glowElement: glow, x, y, size, xSpeed, ySpeed };
  }

  function createNewFirefliesIfNeeded() {
    const missingFireflies = desiredNumberOfFireflies - fireflies.length;

    for (let i = 0; i < missingFireflies; i++) {
      const newFirefly = generateFirefly();
      fireflies.push(newFirefly);
      weatherContainer.appendChild(newFirefly.element);
      weatherContainer.appendChild(newFirefly.glowElement);
    }
  }

  function removeFireflies() {
    for (const firefly of fireflies) {
      weatherContainer.removeChild(firefly.element);
      weatherContainer.removeChild(firefly.glowElement);
    }
    fireflies.length = 0;
  }

  function toggleFireflies() {
    if (settings.manualWeatherPanel) {
      if (fireflies.length === 0) {
        for (let i = 0; i < desiredNumberOfFireflies; i++) {
          fireflies.push(generateFirefly());
          weatherContainer.appendChild(fireflies[i].element);
          weatherContainer.appendChild(fireflies[i].glowElement);
        }
      } else {
        for (const firefly of fireflies) {
          firefly.element.classList.add("firefly-disappearing");
          firefly.glowElement.classList.add("firefly-disappearing");
        }
        setTimeout(() => {
          removeFireflies();
        }, 6000);
      }
    }
  }

  function generateFirefliesNaturally() {
    if (
      currentWeather === "clear" &&
      currentHour === "night" &&
      currentSeason === "summer"
    ) {
      uwuStorage.setItem("uwu_lastActiveWeather", "fireflies");
      if (fireflies.length === 0) {
        for (let i = 0; i < desiredNumberOfFireflies; i++) {
          fireflies.push(generateFirefly());
          weatherContainer.appendChild(fireflies[i].element);
          weatherContainer.appendChild(fireflies[i].glowElement);
        }
      }
    } else {
      for (const firefly of fireflies) {
        firefly.element.classList.add("firefly-disappearing");
        firefly.glowElement.classList.add("firefly-disappearing");
      }
      setTimeout(() => {
        removeFireflies();
      }, 6000);
    }
  }

  function animateFireflies() {
    for (let i = fireflies.length - 1; i >= 0; i--) {
      const firefly = fireflies[i];
      firefly.x += firefly.xSpeed;
      firefly.y += firefly.ySpeed;

      if (firefly.x < 0 || firefly.x + firefly.size > weatherCanvas.width) {
        firefly.xSpeed *= -1;
      }
      if (firefly.y < 0 || firefly.y + firefly.size > weatherCanvas.height) {
        firefly.ySpeed *= -1;
      }

      firefly.element.style.left = firefly.x + "px";
      firefly.element.style.top = firefly.y + "px";

      firefly.glowElement.style.left =
        firefly.x - (firefly.size * glowSizeMultiplier) / 2 + "px";
      firefly.glowElement.style.top =
        firefly.y - (firefly.size * glowSizeMultiplier) / 2 + "px";

      createNewFirefliesIfNeeded();
    }

    requestAnimationFrame(animateFireflies);
  }

  if (settings.weatherEnabled || settings.manualWeatherPanel) {
    animateFireflies();
  }
  // ====================================================================================================================
  //   . . . ПРИЗЕМЛЕНИЕ ЧАСТИЦ . . . ☔
  // ====================================================================================================================
  const landedSnowflakes = [];
  const landedPixelSnowflakes = [];
  const splashes = [];
  const pixelSplashes = [];

  switch (true) {
    case settings.manualWeatherPanel && !settings.weatherDrops:
    case settings.weatherEnabled && !settings.weatherDrops:
      setInterval(() => {
        checkElements(raindrops, weatherContainer);
        checkElements(snowflakes, weatherContainer);
        checkElements(pixelSnowflakes, weatherContainer);
        checkElements(pixelRaindrops, weatherContainer);
      }, 120);
      break;

    case settings.manualWeatherPanel && settings.weatherDrops:
    case settings.weatherEnabled && settings.weatherDrops:
      animateLanding();
      break;

    default:
      break;
  }

  function checkElements(elements, container) {
    for (let i = elements.length - 1; i >= 0; i--) {
      const element = elements[i];

      if (
        element &&
        (element.y >= container.offsetHeight ||
          element.x >= container.offsetWidth ||
          element.x <= 0)
      ) {
        elements.splice(i, 1);
      }
    }
    // console.log(`Количество элементов: ${elements.length}`)
  }

  function animateLanding() {
    for (let i = snowflakes.length - 1; i >= 0; i--) {
      const snowflake = snowflakes[i];
      if (snowflake.y >= weatherCanvas.height - snowflake.size) {
        snowflakes.splice(i, 1);
        landedSnowflakes.push(snowflake);
      }
    }
    for (let i = pixelSnowflakes.length - 1; i >= 0; i--) {
      const pixelSnowflake = pixelSnowflakes[i];
      if (pixelSnowflake.y >= weatherCanvas.height - pixelSnowflake.size) {
        pixelSnowflakes.splice(i, 1);
        landedPixelSnowflakes.push(pixelSnowflake);
      }
    }
    for (let i = landedSnowflakes.length - 1; i >= 0; i--) {
      const snowflake = landedSnowflakes[i];
      snowflake.opacity -= 0.001;
      if (snowflake.opacity <= 0) {
        landedSnowflakes.splice(i, 1);
      }
    }
    for (const snowflake of landedSnowflakes) {
      weatherCtx.globalAlpha = snowflake.opacity;
      drawSnowflake(snowflake.x, snowflake.y, snowflake.size);
    }

    for (let i = landedPixelSnowflakes.length - 1; i >= 0; i--) {
      const pixelSnowflake = landedPixelSnowflakes[i];
      pixelSnowflake.opacity -= 0.001;

      if (pixelSnowflake.opacity <= 0) {
        landedPixelSnowflakes.splice(i, 1);
      }
    }
    for (const pixelSnowflake of landedPixelSnowflakes) {
      weatherCtx.globalAlpha = pixelSnowflake.opacity;
      drawPixelSnowflake(
        pixelSnowflake.x,
        pixelSnowflake.y,
        pixelSnowflake.size,
        pixelSnowflake.image
      );
    }

    for (let i = raindrops.length - 1; i >= 0; i--) {
      const raindrop = raindrops[i];
      if (raindrop.y >= weatherCanvas.height - raindrop.length) {
        raindrops.splice(i, 1);
        splashes.push(generateSplash(raindrop.x, weatherCanvas.height));
      }
    }

    for (let i = pixelRaindrops.length - 1; i >= 0; i--) {
      const pixelRaindrop = pixelRaindrops[i];
      if (pixelRaindrop.y >= weatherCanvas.height - pixelRaindrop.size) {
        pixelRaindrops.splice(i, 1);
        pixelSplashes.push(
          generateSplash(pixelRaindrop.x, weatherCanvas.height - 24)
        );
      }
    }

    for (const splash of splashes) {
      splash.x += splash.xSpeed;
      splash.y += splash.ySpeed;
      splash.ySpeed += 0.1;

      weatherCtx.beginPath();
      weatherCtx.arc(
        splash.x,
        splash.y,
        splash.size / 1.2 / weatherModifier,
        0,
        Math.PI * 2
      );
      weatherCtx.fillStyle = "rgba(150, 150, 150, 0.4)";
      weatherCtx.fill();
    }

    for (const pixelSplash of pixelSplashes) {
      pixelSplash.x += pixelSplash.xSpeed;
      pixelSplash.y += pixelSplash.ySpeed;
      pixelSplash.ySpeed += 0.1;
      weatherCtx.drawImage(
        pixelSplash.image,
        pixelSplash.x,
        pixelSplash.y,
        pixelSplash.size * weatherModifier * 2,
        pixelSplash.size * weatherModifier * 2
      );
    }

    checkSplashes();
    checkPixelSplashes();
    weatherCtx.globalAlpha = 1;
    requestAnimationFrame(animateLanding);
  }

  function generateSplash(x, y) {
    const size = Math.random() * 5 + 2;
    const xSpeed = (Math.random() - 0.5) * 2;
    const ySpeed = -Math.random() * 2 - 1;
    const imageData =
      images.pixelSplash[Math.floor(Math.random() * images.pixelSplash.length)];
    const image = imageData.image;

    return { x, y, size, xSpeed, ySpeed, image };
  }

  function checkSplashes() {
    for (let i = splashes.length - 1; i >= 0; i--) {
      const splash = splashes[i];
      if (
        splash.y >= weatherCanvas.height ||
        splash.x >= weatherCanvas.width ||
        splash.x <= 0
      ) {
        splashes.splice(i, 1);
      }
    }
    // console.log(`Количество сплешев: ${splashes.length}`)
  }
  function checkPixelSplashes() {
    for (let i = pixelSplashes.length - 1; i >= 0; i--) {
      const pixelSplash = pixelSplashes[i];
      if (
        pixelSplash.y >= weatherCanvas.height ||
        pixelSplash.x >= weatherCanvas.width ||
        pixelSplash.x <= 0
      ) {
        pixelSplashes.splice(i, 1);
      }
    }
  }
  // ====================================================================================================================
} // Конец грандиозного, но и начало чево то нового... Зогдачно......
// ====================================================================================================================
// 🦐✨🦐✨🦐✨🦐✨🦐✨🦐✨🦐✨🦐✨🦐✨🦐✨🦐✨🦐✨🦐✨🦐✨🦐✨🦐✨🦐✨🦐✨🦐✨🦐✨🦐✨🦐✨🦐✨
// ====================================================================================================================
//   . . . ТАРГЕТИНГ ОКНА ОХОТЫ И ПОДГОТОВКА КОНТЕЙНЕРОВ . . .
// ====================================================================================================================
if (targetCW3Hunt.test(window.location.href)) {
  amogusSus();
  const containerElement = document.querySelector("body");
  const globalContainerElement = document.createElement("div");
  globalContainerElement.id = "uwu-main-container";
  containerElement.appendChild(globalContainerElement);
  // ====================================================================================================================
  //   . . . ПОДПИСЫВАТЬ ЗАПАХ . . .
  // ====================================================================================================================
  if (settings.describeHuntingSmell) {
    const smellElement = document.getElementById("smell");
    let smellText = null;
    let smellTimer = null;
    let previousRed = null;
    let seconds = 0;

    function updateHintText(currentRed) {
      if (currentRed === 0) {
        smellText.textContent = "Потерян";
      } else if (previousRed !== null) {
        if (currentRed > previousRed) {
          smellText.textContent = "Ближе";
        } else if (currentRed < previousRed) {
          smellText.textContent = "Дальше";
        }
      } else {
        smellText.textContent = " ";
      }
      previousRed = currentRed;
    }

    function updateTimer() {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      smellTimer.textContent = `${String(minutes).padStart(2, "0")}:${String(
        remainingSeconds
      ).padStart(2, "0")}`;
      seconds++;
    }

    function handleSmellChange() {
      const style = window.getComputedStyle(smellElement);
      const currentColor = style.backgroundColor;

      if (
        currentColor !== "rgba(0, 0, 0, 0)" &&
        currentColor !== "transparent"
      ) {
        if (!smellText) {
          smellText = document.createElement("div");
          smellText.id = "smellText";
          smellTimer = document.createElement("div");
          smellTimer.id = "smellTimer";
          document.body.appendChild(smellText);
          document.body.appendChild(smellTimer);

          intervalId = setInterval(updateTimer, 1000);
        }

        const currentRed = parseInt(
          currentColor.slice(
            currentColor.indexOf("(") + 1,
            currentColor.indexOf(",")
          )
        );
        updateHintText(currentRed);
      }
    }

    new MutationObserver(handleSmellChange).observe(smellElement, {
      attributes: true,
      attributeFilter: ["style"],
    });

    const describeHuntingSmell = document.createElement("style");
    describeHuntingSmell.innerHTML = /* CSS */ `
  #smellText {
    font-size: 20px;
    background: white;
    color: black;
    text-align: center;
    width: 100px;
    position: absolute;
    z-index: 3;
    bottom: 60px;
  }
  
  #smellTimer {
    font-size: 18px;
    background: white;
    color: black;
    text-align: center;
    width: 100px;
    position: absolute;
    z-index: 3;
    bottom: 40px; 
  }
  `;
    document.head.appendChild(describeHuntingSmell);
  }
  // ====================================================================================================================
  //   . . . ВИРТУАЛЬНЫЙ ДЖОЙСТИК . . .
  // ====================================================================================================================
  // Работаем с сайтовым обработчиком нажатий: "//e.catwar.net/js/key.js?268881668"
  if (settings.huntingVirtualJoystick) {
    function createJoystick() {
      const joystickHTML = `
        <div id="joystick-container">
          <div id="joystick-base">
            <div id="joystick-head"></div>
          </div>
        </div>
      `;

      const uwuContainer = document.getElementById("uwu-main-container");
      uwuContainer.insertAdjacentHTML("beforeend", joystickHTML);

      const css =
        /* CSS */
        `
        #nav_buttons_wrapper {
          display: none;
        }
  
        #joystick-container {
          pointer-events: auto;
          position: fixed;
          bottom: 20px;
          right: 20px;
          width: ${settings.sizeHuntingVirtualJoystick}px; 
          height: ${settings.sizeHuntingVirtualJoystick}px;
          z-index: 10; 
        }
  
        #joystick-base {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background-color: rgba(128, 128, 128, 0.5);
          position: relative;
        }
  
        #joystick-head {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: ${settings.sizeHuntingVirtualJoystick / 2}px;
          height: ${settings.sizeHuntingVirtualJoystick / 2}px;
          border-radius: 50%;
          background-color: #808080;
          touch-action: none; 
        }
      `;
      const style = document.createElement("style");
      style.innerHTML = css;
      document.head.appendChild(style);

      const joystickContainer = document.getElementById("joystick-container");
      const joystickHead = document.getElementById("joystick-head");
      const baseRadius = joystickContainer.offsetWidth / 2;
      let activeTouchId = null;
      let currentActiveKey = null;
      let keys = {};

      function handleTouchStart(event) {
        if (activeTouchId === null) {
          const touch = event.touches[0];
          activeTouchId = touch.identifier;
          updateJoystickPosition(touch.clientX, touch.clientY);
        }
      }

      function handleTouchMove(event) {
        event.preventDefault();
        for (let i = 0; i < event.touches.length; i++) {
          const touch = event.touches[i];
          if (touch.identifier === activeTouchId) {
            updateJoystickPosition(touch.clientX, touch.clientY);
            break;
          }
        }
      }

      function handleTouchEnd(event) {
        activeTouchId = null;
        resetJoystick();
        if (currentActiveKey) {
          simulateKeyRelease(currentActiveKey);
          currentActiveKey = null;
        }
      }

      function updateJoystickPosition(x, y) {
        const containerRect = joystickContainer.getBoundingClientRect();
        const deltaX = x - (containerRect.left + baseRadius);
        const deltaY = y - (containerRect.top + baseRadius);
        const angle = Math.atan2(deltaY, deltaX);
        const distance = Math.min(Math.hypot(deltaX, deltaY), baseRadius * 0.8);

        joystickHead.style.left = `${
          baseRadius + distance * Math.cos(angle)
        }px`;
        joystickHead.style.top = `${baseRadius + distance * Math.sin(angle)}px`;

        const threshold = 0.3;
        let newActiveKey = null;

        if (distance > baseRadius * threshold) {
          if (angle >= -Math.PI * 0.125 && angle < Math.PI * 0.125)
            newActiveKey = "d";
          else if (angle >= Math.PI * 0.125 && angle < Math.PI * 0.375)
            newActiveKey = "x";
          else if (angle >= Math.PI * 0.375 && angle < Math.PI * 0.625)
            newActiveKey = "s";
          else if (angle >= Math.PI * 0.625 && angle < Math.PI * 0.875)
            newActiveKey = "z";
          else if (angle >= Math.PI * 0.875 || angle < -Math.PI * 0.875)
            newActiveKey = "a";
          else if (angle >= -Math.PI * 0.875 && angle < -Math.PI * 0.625)
            newActiveKey = "q";
          else if (angle >= -Math.PI * 0.625 && angle < -Math.PI * 0.375)
            newActiveKey = "w";
          else if (angle >= -Math.PI * 0.375 && angle < -Math.PI * 0.125)
            newActiveKey = "e";
        }

        if (newActiveKey !== currentActiveKey) {
          if (currentActiveKey) {
            simulateKeyRelease(currentActiveKey);
          }
          if (newActiveKey) {
            simulateKeyPress(newActiveKey);
          }
          currentActiveKey = newActiveKey;
        }
      }

      function resetJoystick() {
        joystickHead.style.left = "50%";
        joystickHead.style.top = "50%";
      }

      // Оставим на будущее, вдруг пригодится.
      function releaseAllKeys() {
        for (const key in keys) {
          if (keys[key]) {
            simulateKeyRelease(key);
            keys[key] = false;
          }
        }
      }

      function simulateKeyPress(key) {
        const keyCode = Key.dict[key];
        if (keyCode && !Key.keys.includes(keyCode)) {
          Key.push(keyCode);
          const mockEvent = createMockEvent(keyCode);
          Key.keydown(mockEvent);
        }
      }

      function simulateKeyRelease(key) {
        const keyCode = Key.dict[key];
        if (keyCode) {
          const mockEvent = createMockEvent(keyCode);
          Key.keyup(mockEvent);
          const index = Key.keys.indexOf(keyCode);
          if (index > -1) {
            Key.keys.splice(index, 1);
          }
        }
      }

      function createMockEvent(keyCode) {
        return {
          keyCode: keyCode,
          ctrlKey: false,
          shiftKey: false,
          altKey: false,
          preventDefault: () => {},
          repeat: false,
        };
      }

      joystickContainer.addEventListener("touchstart", handleTouchStart);
      joystickContainer.addEventListener("touchmove", handleTouchMove);
      joystickContainer.addEventListener("touchend", handleTouchEnd);
      joystickContainer.addEventListener("touchcancel", handleTouchEnd);

      window.addEventListener("blur", function () {
        if (currentActiveKey) {
          simulateKeyRelease(currentActiveKey);
          currentActiveKey = null;
        }
        resetJoystick();
      });
    }

    createJoystick();
  }
  // ====================================================================================================================
}
// ====================================================================================================================
function amogusSus() {
  console.log("⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣤⣤⣤⣤⣤⣤⣤⣤⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀ ");
  console.log("⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⣿⡿⠛⠉⠙⠛⠛⠛⠛⠻⢿⣿⣷⣤⡀⠀⠀⠀⠀⠀ ");
  console.log("⠀⠀⠀⠀⠀⠀⠀⠀⣼⣿⠋⠀⠀⠀⠀⠀⠀⠀⢀⣀⣀⠀⠈⢻⣿⣿⡄⠀⠀⠀⠀ ");
  console.log("⠀⠀⠀⠀⠀⠀⠀⣸⣿⡏⠀⠀⠀⣠⣶⣾⣿⣿⣿⠿⠿⠿⢿⣿⣿⣿⣄⠀⠀⠀ ");
  console.log("⠀⠀⠀⠀⠀⠀⠀⣿⣿⠁⠀⠀⢰⣿⣿⣯⠁⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⢿⣷⡄⠀ ");
  console.log("⠀⠀⣀⣤⣴⣶⣶⣿⡟⠀⠀⢸⣿⣿⣿⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣷⠀ ");
  console.log("⠀⢰⣿⡟⠋⠉⣹⣿⡇⠀⠀⠘⣿⣿⣿⣿⣷⣦⣤⣤⣤⣶⣶⣶⣶⣿⣿⣿⠀ ");
  console.log("⠀⢸⣿⡇⠀⠀⣿⣿⡇⠀⠀⠀⠀⠹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠃⠀ ");
  console.log("⠀⣸⣿⡇⠀⠀⣿⣿⡇⠀⠀⠀⠀⠀⠉⠻⠿⣿⣿⣿⣿⡿⠿⠿⠛⢻⣿⡇⠀⠀ ");
  console.log("⠀⣿⣿⠁⠀⠀⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣧⠀⠀ ");
  console.log("⠀⣿⣿⠀⠀⠀⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⠀⠀ ");
  console.log("⠀⣿⣿⠀⠀⠀⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⠀⠀ ");
  console.log("⠀⢿⣿⡆⠀⠀⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⡇⠀⠀ ");
  console.log("⠀⠸⣿⣧⡀⠀⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⠃⠀⠀ ");
  console.log("⠀⠀⠛⢿⣿⣿⣿⣿⣇⠀⠀⠀⠀⣰⣿⣿⣷⣶⣶⣶⣶⠶⠀⠀⢠⣿⣿⠀⠀⠀ ");
  console.log("⠀⠀⠀⠀⠀⠀⠀⣿⣿⠀⠀⠀⠀⠀⣿⣿⡇⠀⣽⣿⡏⠁⠀⠀⠀⢸⣿⡇⠀⠀⠀ ");
  console.log("⠀⠀⠀⠀⠀⠀⠀⣿⣿⠀⠀⠀⠀⠀⣿⣿⡇⠀⢹⣿⡆⠀⠀⠀⠀⣸⣿⠇⠀⠀⠀ ");
  console.log("⠀⠀⠀⠀⠀⠀⠀⢿⣿⣦⣄⣀⣠⣴⣿⣿⠁⠀⠈⠻⣿⣿⣿⣿⡿⠏⠀⠀⠀⠀ ");
  console.log("⠀⠀⠀⠀⠀⠀⠀⠈⠛⠻⠿⠿⠿⠿⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀");
}
// ====================================================================================================================
//   . . . ТАРГЕТИНГ БЛОГОВОЙ СТРАНИЦЫ . . .
// ====================================================================================================================
if (targetBlogsCreation.test(window.location.href)) {
  // ====================================================================================================================
  //   . . . ВОССТАНОВЛЕНИЕ БЛОГОВОГО ТЕКСТА . . .
  // ====================================================================================================================
  if (settings.restoreBlogCreation) {
    const textarea = document.getElementById("creation-text");

    function saveTextToStorage(text) {
      uwuStorage.setItem("uwu_blogCreation", text);
    }

    function restoreTextFromStorage() {
      const savedText = uwuStorage.getItem("uwu_blogCreation");
      if (savedText && !textarea.value) {
        textarea.value = savedText;
      }
    }

    textarea.addEventListener("input", () => {
      saveTextToStorage(textarea.value);
    });

    window.addEventListener("beforeunload", () => {
      saveTextToStorage(textarea.value);
    });

    restoreTextFromStorage();
  }
}

// ====================================================================================================================
//   . . . КНОПКИ BB-КОДОВ . . .
// ====================================================================================================================
if (settings.moreBBCodes) {
  function addBBCodeButtons() {
    const bbCodeContainers = document.querySelectorAll(".bbcode");

    const commonButtonsHTML =
      // html
      `
      <button class="bbcode" title="Абзац" data-code="p">p</button>
      <button class="bbcode" title="Перенос" data-code="br" data-parameter="0">br</button>
      <button class="bbcode" title="Таблица" data-code="table">table</button>
      <button class="bbcode" title="Строка таблицы" data-code="tr">tr</button>
      <button class="bbcode" title="Ячейка таблицы" data-code="td">td</button>
      <button class="bbcode" title="Нумерованный список" data-code="ol">ol</button>
      <button class="bbcode" title="Маркированный список" data-code="ul">ul</button>
      <button class="bbcode" title="Строка списка" data-code="li">li</button>
    `;

    const overblockButtonHTML = `
      <button class="bbcode" title="Раскрывающийся блок" data-code="overblock" data-parameter="1" data-text="Введите название раскрывающегося блока (то же, что и у заголовка, который раскрывает этот блок):">overblock</button>
    `;

    bbCodeContainers.forEach((bbCode) => {
      const container = bbCode.parentElement;
      if (!container) return;

      if (!container.querySelector('.bbcode[data-code="p"]')) {
        container.insertAdjacentHTML("beforeend", commonButtonsHTML);
      }

      const blockElement = container.querySelector('[data-code="block"]');
      if (
        blockElement &&
        !container.querySelector('.bbcode[data-code="overblock"]')
      ) {
        blockElement.insertAdjacentHTML("afterend", overblockButtonHTML);
      }
    });
  }

  setupSingleCallback(".bbcode", addBBCodeButtons);
}
// ====================================================================================================================
//   . . . ПРОФИЛЬ ИГРОКА . . .
// ====================================================================================================================
if (targetMainProfile.test(window.location.href)) {
  const idVal = document.getElementById("id_val");
  if (idVal) {
    const currentId = idVal.innerText.trim();
    let data = uwuStorage.getItem("uwu_personal") || {};

    if (!data.cats) data.cats = {};
    if (!data.slots) data.slots = [];

    data.lastActiveId = currentId;

    if (!data.cats[currentId]) {
      data.cats[currentId] = {
        id: currentId,
        name: "Кот " + currentId,
        img: "",
        size: "",
        costume: "",
      };
    }

    uwuStorage.setItem("uwu_personal", data);
    // console.log(
    //   `UwU | Профиль: ID игрока [${currentId}] сохранён как активный.`
    // );
  }
  // --------------------------------------------------------

  if (settings.calculators) {
    setupSingleCallback("#info", setupActivityCalc);
    setupSingleCallback("#info", moonCalculator);
  }

  // ====================================================================================================================
  //   . . . РЕДИЗАЙН ССЫЛОК МЕНЮ ПРОФИЛЯ . . .
  // ====================================================================================================================
  if (settings.profileMenuRedesign) {
    function applyProfileMenuRedesign() {
      const profileLinksLayout = "column"; // "column" или "row"
      
      const profileLinksStyle = document.createElement("style");
      profileLinksStyle.innerHTML = /* CSS */ `
          #education-show,
          #education-show ~ a {
              display: ${profileLinksLayout === "column" ? "flex" : "inline-flex"};
              align-items: center;
              width: ${profileLinksLayout === "column" ? "fit-content" : "auto"};
              background-color: rgba(0, 0, 0, 0.2);
              border: 1px solid rgba(255, 255, 255, 0.1);
              color: #d5d5d5 !important;
              padding: 4px 8px;
              border-radius: 8px;
              margin: ${profileLinksLayout === "column" ? "0 0 8px 0" : "4px 6px 4px 0"};
              text-decoration: none !important;
              font-family: "Montserrat", sans-serif;
              font-size: 13px;
              transition: background-color 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
          }

          #education-show:hover,
          #education-show ~ a:hover {
              background-color: rgba(255, 255, 255, 0.1);
              border-color: rgba(255, 255, 255, 0.3);
              transform: ${profileLinksLayout === "column" ? "translateX(4px)" : "translateY(-2px)"};
          }

          #education-show::before { content: "🎓"; margin-right: 8px; font-size: 1.1em; }
          a[href="fae"]::before { content: "⚔️"; margin-right: 8px; font-size: 1.1em; }
          a[href="myblogs"]::before { content: "📝"; margin-right: 8px; font-size: 1.1em; }
          a[href="tags"]::before { content: "🏷️"; margin-right: 8px; font-size: 1.1em; }
          a[href="achievements"]::before { content: "🏆"; margin-right: 8px; font-size: 1.1em; }
          a[href="log_tb"]::before { content: "🌑"; margin-right: 8px; font-size: 1.1em; }
          a[href="activity_shop"]::before { content: "🛒"; margin-right: 8px; font-size: 1.1em; }
          a[href="settings"]::before { content: "⚙️"; margin-right: 8px; font-size: 1.1em; }
          a[href="my_clan"]::before { content: "🌲"; margin-right: 8px; font-size: 1.1em; }
          a[href="rabbit"]::before { content: "🐇"; margin-right: 8px; font-size: 1.1em; }

          .uwu-unknown-link::before {
              content: "✨"; 
              margin-right: 8px; 
              font-size: 1.1em;
          }

          .uwu-new-link::after {
              content: "NEW";
              font-size: 9px;
              background-color: #cd4141; 
              color: white;
              padding: 2px 5px;
              border-radius: 4px;
              margin-left: 8px;
              font-weight: bold;
              letter-spacing: 0.5px;
          }

          #education-show + br,
          #education-show ~ a + br {
              display: none;
          }
      `;
      document.head.appendChild(profileLinksStyle);

      const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000;
      const knownLinks =[
        "fae", "myblogs", "tags", "achievements", 
        "log_tb", "activity_shop", "settings", "my_clan", "rabbit"
      ];
      
      let trackedLinks = uwuStorage.getItem("uwu_profileLinksTracker") || {};
      let isStorageUpdated = false;

      const linkElements = document.querySelectorAll('#education-show ~ a');
      
      linkElements.forEach(link => {
        const href = link.getAttribute("href");
        
        if (href && !knownLinks.includes(href)) {
          link.classList.add("uwu-unknown-link");
          
          if (!trackedLinks[href]) {
            trackedLinks[href] = Date.now();
            isStorageUpdated = true;
          }
          
          const linkAgeMs = Date.now() - trackedLinks[href];
          if (linkAgeMs <= TWO_DAYS_MS) {
            link.classList.add("uwu-new-link");
          }
        }
      });

      if (isStorageUpdated) {
        uwuStorage.setItem("uwu_profileLinksTracker", trackedLinks);
      }
    }

    setupSingleCallback("#education-show", applyProfileMenuRedesign);
  }
}
// ====================================================================================================================
//   . . . ПРОФИЛЯ ДРУГИХ ПОЛЬЗОВАТЕЛЕЙ . . .
// ====================================================================================================================
if (targetProfile.test(window.location.href)) {
  // ====================================================================================================================
  //   . . . БУ И ПРОЧЕЕ . . .
  // ====================================================================================================================
  if (settings.moreProfileInfo) {
    setupSingleCallback("tr:has(img[src='img/icon_kraft.png'])", addKraftLevel);

    function addKraftLevel() {
      const kraftLevels = {
        блоха: 0,
        котёночек: 1,
        задира: 2,
        "гроза детской": 3,
        "страх барсуков": 4,
        "победитель псов": 5,
        "защитник племени": 6,
        "великий воин": 7,
        "достоин Львиного племени": 8,
        идеальная: 9,
      };

      const kraftRow = document.querySelector(
        'tr:has(img[src="img/icon_kraft.png"])'
      );
      const kraftTextElement = kraftRow.querySelector("b");
      const kraftText = kraftTextElement.textContent.trim();
      const kraftLevel = kraftLevels[kraftText];
      if (kraftLevel !== undefined) {
        kraftTextElement.textContent = `${kraftText} (${kraftLevel})`;
      }
    }
  }

  if (settings.calculators) {
    setupSingleCallback("#info", moonCalculator);
  }
}

// ===================================================================================================================
// Калькуляторы возраста/лун и активности частично под авторством "CatWar Mod (Варомод) от Хвойницы"
// ====================================================================================================================
//   . . . КАЛЬКУЛЯТОР ВОЗРАСТА / ЛУН . . .
// ====================================================================================================================
function uwuDeclOfNum(number, titles) {
  if (!Number.isInteger(number)) {
    return titles[1]; 
  }
  const cases = [2, 0, 1, 1, 1, 2];
  const intNumber = Math.floor(Math.abs(number));
  return titles[
    intNumber % 100 > 4 && intNumber % 100 < 20
      ? 2
      : cases[intNumber % 10 < 5 ? intNumber % 10 : 5]
  ];
}

function moonCalculator() {
  const months = [
    "января",
    "февраля",
    "марта",
    "апреля",
    "мая",
    "июня",
    "июля",
    "августа",
    "сентября",
    "октября",
    "ноября",
    "декабря",
  ];

  const catTimeStart = 1200000000000;

  const infoElement = document.getElementById("info");
  if (!infoElement) return;

  const style = document.createElement("style");
  style.textContent = `
    .calculator-error { color: darkred; }
    .hidden { display: none; }
    .calculator-style { max-width: 400px; margin: 5px; padding: 5px; border-radius: 10px; background: #ffffff08; }
  `;
  document.head.appendChild(style);

  let calculatorAgeElement = document.getElementById("calculator-age");
  if (!calculatorAgeElement) {
    infoElement.insertAdjacentHTML(
      "afterend",
      `<div id="calculator-age" class="calculator-style hidden"></div>`
    );
    calculatorAgeElement = document.getElementById("calculator-age");
  }

  const infoObserver = new MutationObserver((mutations) => {
    mutations.forEach(() => {
      if (!infoElement.textContent.match("Дата")) {
        calculatorAgeElement.classList.add("hidden");
        return;
      }

      const dateMatch = infoElement.textContent.match(/\d{4}-\d\d-\d\d \d\d:\d\d/);
      if (!dateMatch) {
        calculatorAgeElement.classList.add("hidden");
        return;
      }

      calculatorAgeElement.classList.remove("hidden");

      const birthDateString = infoElement.textContent
        .match(/\d{4}-\d\d-\d\d \d\d:\d\d/)[0]
        .replace(" ", "T");
      const nowDateString = formatDate(new Date());

      const ageMoons = getMoonsFromElement("age_icon");
      const age2Moons = getMoonsFromElement("age2_icon");

      const avatarElement = document.querySelector('img[src^="/avatar/"]');
      const sex = avatarElement ? avatarElement.style.borderColor : null;
      const isRegistrationDate = /регистрац/.test(infoElement.textContent);
      const moonsNow = age2Moons
        ? isRegistrationDate
          ? ageMoons
          : age2Moons
        : ageMoons;

      const bornWord = getBornWord(sex, isRegistrationDate);
      const catTimeString = formatCatTime(
        Date.parse(birthDateString),
        moonsNow
      );

      calculatorAgeElement.innerHTML = `
        <p><b>Калькулятор возраста</b></p>
        <label>Дата и время: <input type="datetime-local" id="calculator-date" min="${birthDateString}" value="${nowDateString}" max="9999-12-31T23:59"></label> <span id="calculator-error-date" class="calculator-error"></span>
        <br><label>Возраст: <input type="number" id="calculator-moons" min="0" step="0.1" value="${moonsNow}" style="width: 60px"></label> <span id="moon-word"></span> <span id="calculator-error-moons" class="calculator-error"></span>
        <br>${bornWord} ${catTimeString} по кошачьему времени.
        <br><br>
      `;

      updateMoonWord(moonsNow);

      const calculatorDateElement = document.getElementById("calculator-date");
      const calculatorMoonsElement =
        document.getElementById("calculator-moons");

      calculatorDateElement.addEventListener("input", function () {
        handleDateInput.call(this, birthDateString);
      });

      calculatorMoonsElement.addEventListener("input", function () {
        handleMoonsInput.call(this, birthDateString);
      });
    });
  });

  infoObserver.observe(infoElement, { childList: true });

  function getMoonsFromElement(iconId) {
    const iconElement = document.querySelector(`img[id="${iconId}"]`);
    if (!iconElement) return 0;
    const ageElement = iconElement
      .closest("tr")
      .querySelector("td:nth-child(2) b");
    return parseFloat(ageElement.textContent);
  }

  function getBornWord(sex, isRegistrationDate) {
    const sexWords = {
      pink: ["Зарегистрировалась", "Родилась"],
      blue: ["Зарегистрировался", "Родился"],
      default: ["Зарегистрировалось", "Родилось"],
    };
    return isRegistrationDate
      ? sexWords[sex]
        ? sexWords[sex][0]
        : sexWords.default[0]
      : sexWords[sex]
      ? sexWords[sex][1]
      : sexWords.default[1];
  }

  function formatDate(date) {
    const pad = (num) => String(num).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
      date.getDate()
    )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  function formatCatTime(birthTimestamp, moons) {
    const daysToAdd = moons * 4;
    const targetDate = new Date(
      birthTimestamp + daysToAdd * 24 * 60 * 60 * 1000
    );
    const ms = birthTimestamp - catTimeStart;
    let time = Math.round((ms / 1000) * 7);
    const secInYear = 12 * 28 * 24 * 60 * 60;
    const secInMonth = 28 * 24 * 60 * 60;
    const year = Math.floor(time / secInYear);
    time -= year * secInYear;
    const month = Math.floor(time / secInMonth);
    time -= month * secInMonth;
    const day = Math.floor(time / (24 * 60 * 60)) + 1;
    time -= (day - 1) * 24 * 60 * 60;
    const hour = Math.floor(time / (60 * 60));
    time -= hour * 60 * 60;
    const minute = Math.floor(time / 60);
    const pad = (num) => String(num).padStart(2, "0");
    return `${day} ${months[month]} ${year} года в ${pad(hour)}:${pad(minute)}`;
  }

  function handleDateInput(birthDateString) {
    const dateString = this.value;
    const date = Date.parse(dateString);
    const errorDateElement = document.getElementById("calculator-error-date");
    errorDateElement.textContent = "";

    if (isNaN(date) || date < Date.parse(birthDateString)) {
      errorDateElement.textContent = "Ошибка!";
      return;
    }

    const moons = getMoonsFromDate(birthDateString, dateString);
    const calcMoonsElement = document.getElementById("calculator-moons");
    if (calcMoonsElement) {
      calcMoonsElement.value = moons;
      updateMoonWord(moons);
      const catTimeString = formatCatTime(Date.parse(birthDateString), moons);
      document.querySelector(
        "br"
      ).nextSibling.textContent = `${catTimeString} по кошачьему времени.`;
    }
    updateMoonWord(moons);
  }

  function handleMoonsInput(birthDateString) {
    const moons = Number(this.value);
    const errorMoonsElement = document.getElementById("calculator-error-moons");
    errorMoonsElement.textContent = "";

    if (moons < 0 || isNaN(moons)) {
      errorMoonsElement.textContent = "Ошибка!";
      return;
    }

    const calcDateElement = document.getElementById("calculator-date");
    if (calcDateElement) {
      calcDateElement.value = getDateStringFromMoons(birthDateString, moons);
      updateMoonWord(moons);
      const catTimeString = formatCatTime(Date.parse(birthDateString), moons);
      document.querySelector(
        "br"
      ).nextSibling.textContent = `${catTimeString} по кошачьему времени.`;
    }
    updateMoonWord(moons);
  }

  function getMoonsFromDate(birthDateString, dateString) {
    const birthday = Date.parse(birthDateString);
    const date = Date.parse(dateString);
    const moons =
      Math.floor(((date - birthday) / (1000 * 60 * 60 * 24 * 4)) * 10) / 10;
    return moons;
  }

  function getDateStringFromMoons(birthDateString, moons) {
    const birthday = Date.parse(birthDateString);
    const age = Math.round(moons * 4 * 24 * 60 * 60 * 1000);
    return formatDate(new Date(birthday + age));
  }

  function updateMoonWord(moons) {
    const integerMoons = Math.floor(moons);
    document.getElementById("moon-word").textContent = uwuDeclOfNum(integerMoons, [
      "луна",
      "луны",
      "лун",
    ]);
  }
}
// ====================================================================================================================
//   . . . КАЛЬКУЛЯТОР АКТИВНОСТИ . . .
// ====================================================================================================================
// TODO - Переписать, сделать рефакторинг и как-то объединить и упростить код с калькулятором выше.
function setupActivityCalc() {
  const catId = document.getElementById("id_val").textContent;

  const DAILY_ACTIVITY_DECREASE = 4;
  const HOURLY_ACTIVITY_DECREASE_DIVISOR = 6;

  const activityStages = [
    { name: "пустое место", fromZero: -5000 },
    { name: "подлежащий удалению", fromZero: -5000 },
    { name: "покинувший игру", fromZero: -2000 },
    { name: "забывший про игру", fromZero: -1000 },
    { name: "забытый кот", fromZero: -750 },
    { name: "ужаснейшая", fromZero: -500 },
    { name: "ужасная", fromZero: -300 },
    { name: "ухудшающаяся", fromZero: -150 },
    { name: "отрицательная", fromZero: -50 },
    { name: "переходная", fromZero: -5 },
    { name: "положительная", fromZero: 5 },
    { name: "улучшающаяся", fromZero: 50 },
    { name: "замечательная", fromZero: 150 },
    { name: "переход 2 мин 15 с", fromZero: 225 },
    { name: "замечательнейшая", fromZero: 300 },
    { name: "переход 2 мин", fromZero: 450 },
    { name: "любимый кот", fromZero: 500 },
    { name: "переход 1 мин 45 с", fromZero: 675 },
    { name: "легенда сайта", fromZero: 750 },
    { name: "переход 1 мин 30 с", fromZero: 900 },
    { name: "ходячий миф", fromZero: 1000 },
    { name: "переход 1 мин 15 с", fromZero: 1125 },
    { name: "переход 1 мин", fromZero: 1350 },
    { name: "переход 45 c", fromZero: 1575 },
    { name: "император Игровой", fromZero: 2000 },
    { name: "частичка Игровой", fromZero: 5000 },
    { name: "хранитель Игровой", fromZero: 20000 },
    { name: "идеальная", fromZero: 75000 },
    { name: "сверхидеальная", fromZero: 150000 },
  ];

  const months = [
    "января",
    "февраля",
    "марта",
    "апреля",
    "мая",
    "июня",
    "июля",
    "августа",
    "сентября",
    "октября",
    "ноября",
    "декабря",
  ];

  const activitySettings = uwuStorage.getItem("uwu_activity") || {};

  if (!activitySettings[catId]) {
    activitySettings[catId] = { hours: 24, opened: false };
  }

  if (activitySettings[catId].actgoal) {
    activityStages.forEach(function (stage, index) {
      if (index && Number(activitySettings[catId].actgoal) === stage.fromZero) {
        activitySettings[catId].goal = index;
        delete activitySettings[catId].actgoal;
      }
    });
  }

  function calculateActivityLength(days) {
    const minus = activitySettings[catId].minus || 0;
    if (days <= 14) return 150 - minus;
    else if (days >= 1575) return 45 - minus;
    else return Math.ceil(150 - days / 15) - minus;
  }

  function calculateRemainingTime(currentActivity, goal, hoursPerDay) {
    if (currentActivity >= goal) {
      return { actions: 0, time: "0 с", date: "уже достигнута" };
    }

    const secondsPerDay = convertTime("h s", hoursPerDay);
    if (calculateActivityLength(currentActivity) * 4 + 1 > secondsPerDay) {
      return { actions: "∞", time: "∞", date: "никогда" };
    }

    const actionsWithoutDecrease = goal - currentActivity;
    let days = 0;
    let secondsToday = 0;

    while (currentActivity < goal) {
      secondsToday = 0;
      while (secondsToday < secondsPerDay) {
        currentActivity++;
        secondsToday += calculateActivityLength(currentActivity);
        if (currentActivity >= goal) break;
      }
      if (currentActivity >= goal) break;
      days++;
      currentActivity -= DAILY_ACTIVITY_DECREASE;
    }

    const actionsDecrease = Math.floor(
      days * DAILY_ACTIVITY_DECREASE + convertTime("s h", secondsToday) / HOURLY_ACTIVITY_DECREASE_DIVISOR
    );
    const totalTime = secondsPerDay * days + secondsToday;

    const now = new Date();
    const tomorrow = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1
    );
    const secondsToTomorrow = convertTime("ms s", tomorrow - now);
    if (days === 0 && secondsToday > secondsToTomorrow) days++;

    const targetDate = new Date(Date.now() + convertTime("d ms", days));

    return {
      actions: actionsWithoutDecrease + actionsDecrease,
      time: secondsToTime(totalTime),
      date:
        targetDate.getDate() +
        " " +
        months[targetDate.getMonth()] +
        " " +
        targetDate.getFullYear(),
    };
  }

  function updateGoalProgress() {
    if (progress.stage === activityStages.length - 1) {
      document.getElementById("goal-progress").style.display = "none";
      return;
    }
    const goalIndex = Number(document.getElementById("activity-list").value);
    const result = calculateRemainingTime(
      progress.doneFromZero,
      activityStages[goalIndex].fromZero,
      activitySettings[catId].hours
    );
    document.querySelector("#goal-progress > ul").innerHTML = `
      <li>${result.actions} ${uwuDeclOfNum(result.actions, [
      "переход",
      "перехода",
      "переходов",
    ])} (${result.time})</li>
      <li>будет достигнута ${result.date}</li>
    `;
  }

  const actNameEl = document.querySelector("#act_name b");
  if (!actNameEl) return;
  
  const activity = actNameEl.textContent.toLowerCase().split(" (");
  const progress = {};

  const currentStage = activityStages.find(
    (stage) => stage.name.toLowerCase() === activity[0].trim()
  );

  if (currentStage) {
    progress.doneFromZero =
      currentStage.fromZero + Number(activity[1].split("/")[0]);
    progress.stage = activityStages.indexOf(currentStage);
  } else {
    console.warn("UwU | Неизвестная стадия активности:", activity[0]);
    return;
  }

  const activityInfoHTML =
    // html
    `
      <details id="calculator-activity" class="calculator-style">
        <summary id="open-calculator"><b>Калькулятор активности</b></summary>
        <div id="calculator-content" style="margin-top: 10px;">
          <p id="congratulations" style="display:none"></p>
          <div id="activity-length"><b>Переход</b>: ${secondsToTime(
            calculateActivityLength(progress.doneFromZero)
          )}</div>
          <div>Мой переход изменён на <input id="minus" type="number" value="${
            activitySettings[catId].minus || 0
          }" min="-60" max="10" step="1" style="width: 50px;"> <span id="minus-word"></span></nobr></div>
          <div>Я качаю активность <input id="hours-per-day" type="number" step="0.25" min="0" max="24" value="${
            activitySettings[catId].hours
          }" style="width: 60px"> <span id="hour-word"></span> в сутки</div>
          <div id="goal-progress">
            <b>Цель: <select style="display: inline" id="activity-list"></select></b>:
            <ul style="margin: 0.5em"></ul>
          </div>
          <div id="to-fall-container" style="display: none;">Переход начнёт падать <span id="to-fall"></span></div>
        </div>
      </details>
    `;

  document
    .getElementById("info")
    .insertAdjacentHTML("afterend", activityInfoHTML);

  if (activitySettings[catId].opened) {
    document.getElementById("calculator-activity").open = true;
  }

  for (let i = progress.stage + 1; i < activityStages.length; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = activityStages[i].name;
    document.getElementById("activity-list").appendChild(option);
  }

  function showCongratulations() {
    const activityList = document.getElementById("activity-list");
    const nextGoalName = activityList.options[activityList.selectedIndex].text;

    document.getElementById("congratulations").innerHTML =
      /* HTML */
      `
        Цель
        <b>«${activityStages[activitySettings[catId].goal].name}»</b>
        достигнута!
        <br />
        Ваша новая цель: <b>«${nextGoalName}»</b>
        <center><img src="/img/stickers/systempaw3/6.png" /></center>
        <input id="congratulations-button" type="button" value="Скрыть" />
        <br /><input id="never-show-congratulations" type="checkbox" /> Больше
        не поздравлять на этом персонаже
      `;

    document.getElementById("congratulations").style.display = "block";
    document
      .getElementById("congratulations-button")
      .addEventListener("click", function () {
        document.getElementById("congratulations").style.display = "none";
        activitySettings[catId].goal = Number(
          document.getElementById("activity-list").value
        );
        activitySettings[catId].noGrats = document.getElementById(
          "never-show-congratulations"
        ).checked;
        saveData(activitySettings);
      });
  }

  if (
    activitySettings[catId].goal > progress.stage ||
    activitySettings[catId].noGrats
  ) {
    const goalOption = document.querySelector(
      `#activity-list > [value="${activitySettings[catId].goal}"]`
    );
    if (goalOption) {
      goalOption.selected = true;
    }
  } else if (activitySettings[catId].goal) {
    showCongratulations();
  }

  if (activitySettings[catId].minus) {
    document.getElementById("minus").value = activitySettings[catId].minus;
  }

  const hours = activitySettings[catId].hours;
  const minusValue = activitySettings[catId].minus || 0;

  updateHourWord(hours);
  updateGoalProgress();
  updateMinusWord(minusValue);

  if (calculateActivityLength(progress.doneFromZero) !== 45) {
    document.getElementById("to-fall-container").style.display = "none";
  } else {
    const timeFall = new Date(
      Date.now() + (progress.doneFromZero - 1575) * 5 * 3600000
    );
    document.getElementById("to-fall").innerHTML =
      timeFall.getDate() +
      " " +
      months[timeFall.getMonth()] +
      " " +
      timeFall.getFullYear();
    document.getElementById("to-fall-container").style.display = "block";
  }

  document.getElementById("minus").addEventListener("change", function () {
    activitySettings[catId].minus = this.value;
    saveData(activitySettings);
    updateGoalProgress();
    document.getElementById(
      "activity-length"
    ).innerHTML = `<b>Переход</b>: ${secondsToTime(
      calculateActivityLength(progress.doneFromZero)
    )}`;
    updateMinusWord(this.value);
  });

  document
    .getElementById("activity-list")
    .addEventListener("change", function () {
      activitySettings[catId].goal = Number(this.value);
      saveData(activitySettings);
      updateGoalProgress();
    });

  document
    .getElementById("hours-per-day")
    .addEventListener("input", function () {
      const hours = Number(this.value);
      if (hours < 0 || hours > 24 || !Number.isInteger(hours * 1000)) {
        this.value = activitySettings[catId].hours;
        return;
      }
      activitySettings[catId].hours = hours;
      saveData(activitySettings);
      updateHourWord(hours);
      updateGoalProgress();
    });

  document
    .getElementById("open-calculator")
    .addEventListener("click", function () {
      activitySettings[catId].opened = !document.getElementById(
        "calculator-activity"
      ).open;
      saveData(activitySettings);
    });

  function saveData(data) {
    uwuStorage.setItem("uwu_activity", data);
  }

  function convertTime(from, value) {
    const factors = {
      ms: 1,
      s: 1000,
      m: 60000,
      h: 3600000,
      d: 86400000,
    };
    const [fromUnit, toUnit] = from.split(" ");
    return (value * factors[fromUnit]) / factors[toUnit];
  }

  function secondsToTime(seconds) {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    let result = "";
    if (days > 0) result += `${days} д `;
    if (hours > 0) result += `${hours} ч `;
    if (minutes > 0) result += `${minutes} мин `;
    if (secs > 0 || result === "") result += `${secs} с`;
    return result.trim();
  }

  function updateHourWord(hours) {
    document.getElementById("hour-word").textContent = uwuDeclOfNum(
      hours,
      ["час", "часа", "часов"]
    );
  }

  function updateMinusWord(minusValue) {
    document.getElementById("minus-word").textContent = uwuDeclOfNum(
      minusValue,
      ["секунду", "секунды", "секунд"]
    );
  }
}
// ====================================================================================================================
//   . . . ПИСЬМА . . .
// ====================================================================================================================
if (targetLs.test(window.location.href)) {
  if (settings.lsWrapPreview) {
    setupMutationObserver("#main", setupPreviewButton, {
      childList: true,
      subtree: true,
    });
  }
}
// ====================================================================================================================
//   . . . БЛОГИ . . .
// ====================================================================================================================
if (targetBlog.test(window.location.href)) {
  if (settings.commentPreview) {
    setupMutationObserver("#site_table", addCommentPreview);
  }

  if (settings.moreCommentButtons) {
    setupMutationObserver("#view_comments", addCommentButtons, {
      childList: true,
      subtree: true,
    });
    setupSingleCallback("#view_comments", handleCommentActions);
  }
}

// ====================================================================================================================
//   . . . ЛЕНТА . . .
// ====================================================================================================================
if (targetSniff.test(window.location.href)) {
  if (settings.commentPreview) {
    setupMutationObserver("#site_table", addCommentPreview);
  }

  if (settings.moreCommentButtons) {
    setupMutationObserver("#view_comments", addCommentButtons, {
      childList: true,
      subtree: true,
    });
    setupSingleCallback("#view_comments", handleCommentActions);
  }
}

// ====================================================================================================================
//   . . . ПРЕДПРОСМОТР КОММЕНТАРИЯ . . .
// ====================================================================================================================

let sharedPreviewSocket = null;
let sharedPreviewTimeout = null;
let sharedPreviewCallback = null;

/**
 * Returns a single instance of the socket, creating it on the first call.
 */
function getPreviewSocket() {
  if (!sharedPreviewSocket && typeof io !== "undefined") {
    sharedPreviewSocket = io(window.location.origin, {
      path: "/ws/blogs/socket.io",
      reconnectionDelay: 10000,
      reconnectionDelayMax: 20000,
    });

    sharedPreviewSocket.on("creation preview", (data) => {
      if (sharedPreviewTimeout) {
        clearTimeout(sharedPreviewTimeout);
        sharedPreviewTimeout = null;
      }

      let htmlResult = data;
      if (typeof data === "string") {
        try {
          const parsed = JSON.parse(data);
          if (typeof parsed === "string") {
            htmlResult = parsed;
          } else if (parsed && parsed.text !== undefined) {
            htmlResult = parsed.text;
          }
        } catch (e) {}
      } else if (data && typeof data === "object") {
        htmlResult = data.text !== undefined ? data.text : data;
      }

      if (sharedPreviewCallback) {
        sharedPreviewCallback(htmlResult);
      }
    });
  }
  return sharedPreviewSocket;
}

function addCommentPreview() {
  const form = document.querySelector("#send_comment_form");
  if (!form || document.getElementById("comment-preview")) return;

  const lastParagraph = form.querySelector("p:last-child");
  lastParagraph.insertAdjacentHTML(
    "afterbegin",
    `<input type="button" id="comment-preview" value="Предпросмотр"> `,
  );

  form.insertAdjacentHTML(
    "afterend",
    `
    <p id="comment-preview-hide" style="display: none; margin: 0.5em 0;"><a href="#">Скрыть предпросмотр</a></p>
    <div id="comment-preview-div" style="display: none;"></div>
    `,
  );

  const previewButton = document.getElementById("comment-preview");
  const hideParagraph = document.getElementById("comment-preview-hide");
  const previewDiv = document.getElementById("comment-preview-div");

  function showResult(html) {
    previewDiv.innerHTML = html || "Пустое сообщение";
    previewDiv.style.display = "block";
    hideParagraph.style.display = "block";
    previewButton.disabled = false;
    previewButton.value = "Предпросмотр";
  }

  /**
   * Fallback to the cat profile REST API if the blog socket is unavailable.
   */
  async function fetchFallback(text) {
    try {
      const response = await fetch("/rest/site/bbCodeConvert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        body: JSON.stringify({ text: text }),
      });
      const raw = await response.text();
      let html = raw;

      try {
        const json = JSON.parse(raw);
        if (typeof json === "string") {
          html = json;
        } else if (json && json.text !== undefined) {
          html = json.text;
        }
      } catch (e) {}

      showResult(html);
    } catch (err) {
      showResult(
        `<span style="color:#cd4141">Ошибка: сервер не ответил на запрос предпросмотра.</span>`,
      );
    }
  }

  previewButton.addEventListener("click", function () {
    const commentText = document.getElementById("comment").value;
    if (!commentText.trim()) return;

    previewButton.disabled = true;
    previewButton.value = "Загрузка...";

    sharedPreviewCallback = showResult;

    const ws = getPreviewSocket();

    if (ws && ws.connected) {
      ws.emit("creation preview", commentText);

      if (sharedPreviewTimeout) clearTimeout(sharedPreviewTimeout);
      sharedPreviewTimeout = setTimeout(() => fetchFallback(commentText), 3000);
    } else {
      fetchFallback(commentText);
    }
  });

  form
    .querySelector('[type="submit"]')
    .addEventListener("click", hideCommentPreview);

  hideParagraph.addEventListener("click", (e) => {
    e.preventDefault();
    hideCommentPreview();
  });

  function hideCommentPreview() {
    hideParagraph.style.display = "none";
    previewDiv.innerHTML = "";
    previewDiv.style.display = "none";
    previewButton.disabled = false;
    previewButton.value = "Предпросмотр";
  }
}

// ====================================================================================================================
//   . . . КНОПКИ ОТВЕТИТЬ И ЦИТИРОВАТЬ . . .
// ====================================================================================================================
function addCommentButtons() {
  const comments = document.querySelectorAll("#view_comments .view-comment");
  comments.forEach((comment) => {
    if (!comment.querySelector(".comment-answer-buttons")) {
      comment.insertAdjacentHTML(
        "beforeend", // html
        `
              <p class="comment-answer-buttons">
                  <a class="comment-answer" href="#">Ответить</a>
                  <span class="comment-cite-wrap"> | <a class="comment-cite" href="#">Цитировать</a></span>
              </p>
          `
      );
    }
  });
}

function getCommentInfo(comment) {
  const commentId = comment.getAttribute("data-id");
  const commentNum = comment.querySelector(".num").textContent;
  const authorLink = comment.querySelector(".comment-info a.author");
  const authorSpan = comment.querySelector(".comment-info span[data-id]");
  const authorName = authorLink
    ? authorLink.textContent
    : authorSpan
    ? authorSpan.textContent
    : "...";
  const authorProfile = authorLink
    ? authorLink.getAttribute("href").replace("/cat", "")
    : null;
  const commentText = comment.querySelector(".comment-text .parsed").innerText;
  const commentInfo = comment.querySelector(".comment-info");
  const commentTime = commentInfo.innerHTML
    .split("</b>")[1]
    .split(" @")[0]
    .trim();

  return {
    commentId,
    commentNum,
    authorName,
    authorProfile,
    commentText,
    commentTime,
  };
}

function handleAnswerAction(commentInfo) {
  const textarea = document.getElementById("comment");
  const currentText = textarea.value;
  const newText = commentInfo.authorProfile
    ? `[link${commentInfo.authorProfile}] (#${commentInfo.commentNum}), `
    : `[b][code]${commentInfo.authorName}[/code][/b] (#${commentInfo.commentNum}), `;

  textarea.value = currentText + newText;
}

function handleCiteAction(commentInfo) {
  const selectedText = window.getSelection().toString().trim();
  const quoteText = selectedText ? selectedText : commentInfo.commentText;
  const profileLink = commentInfo.authorProfile
    ? `[link${commentInfo.authorProfile}]`
    : commentInfo.authorName;

  const quote = `[table][tr][td][size=10][i]Цитата:[/i] [b]#${commentInfo.commentNum}[/b] ${commentInfo.commentTime} @ ${profileLink}[/size][/td][/tr][tr][td][table=0][tr][td]  [/td][td]${quoteText}[/td][/tr][/table][/td][/tr][/table]`;

  const textarea = document.getElementById("comment");
  const currentText = textarea.value;
  textarea.value = currentText + quote;
}

function handleCommentActions() {
  const viewComments = document.getElementById("view_comments");

  viewComments.addEventListener("click", function (event) {
    const target = event.target;
    const actionMap = {
      "comment-answer": handleAnswerAction,
      "comment-cite": handleCiteAction,
    };

    for (const className in actionMap) {
      if (target.classList.contains(className)) {
        event.preventDefault();
        const comment = target.closest(".view-comment");
        const commentInfo = getCommentInfo(comment);
        actionMap[className](commentInfo);
        break;
      }
    }
  });
}

// ====================================================================================================================
//   . . . КРАСИВЫЙ ПРЕДПРОСМОТР ПИСЬМА . . .
// ====================================================================================================================
function setupPreviewButton() {
  const previewButton = document.getElementById("preview");
  if (previewButton) {
    previewButton.addEventListener("click", wrapPreviewInTable);
  }
}

function wrapPreviewInTable() {
  const previewDiv = document.getElementById("preview_div");
  if (!previewDiv) return;

  const mainElement = document.getElementById("main");
  const senderId = mainElement.getAttribute("data-id");
  const senderLogin = mainElement.getAttribute("data-login");
  const subject = document.getElementById("subject").value;
  const currentDate = new Date().toLocaleString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const newTable = document.createElement("table");
  newTable.border = "1";
  newTable.style.width = "90%";
  newTable.style.maxWidth = "500px";

  newTable.innerHTML =
    // html
    `
      <tbody>
          <tr><td id="preview-subject" colspan="2">${subject}</td></tr>
          <tr>
              <td valign="top" id="msg_info">
                  Отправитель: <span id="preview-sender"><a href="cat${senderId}">${senderLogin}</a></span>
                  <br>${currentDate}
                  <br>Переписка: <u><big><b>+</b></big></u> …
              </td>
              <td id="preview-text">${previewDiv.outerHTML}</td>
          </tr>
      </tbody>
  `;

  const existingTable = document.querySelector("table");
  if (existingTable) {
    existingTable.parentNode.replaceChild(newTable, existingTable);
  } else {
    previewDiv.parentNode.insertBefore(newTable, previewDiv);
    previewDiv.style.display = "none";
  }
}

// ====================================================================================================================
//   . . . ШАБЛОНЫ . . .
// ====================================================================================================================
function initializeTemplates() {
  if (!settings.showTemplates) return;

  const templateContainer =
    /* HTML */
    `
      <div id="uwu-templates">
        <h2>ШАБЛОНЫ</h2>
        <div id="uwu-templates-list"></div>
        <div class="button-container">
          <button id="create-template-button" class="uwu-button install-button">
            Создать шаблон ✎
          </button>
        </div>
      </div>
    `;

  const templateItem =
    /* HTML */
    `
      <div class="uwu-template-item">
        <div class="template-name-container">
          <span class="template-name"></span>
          <button
            class="rename-button uwu-button install-button"
            title="Переименовать шаблон"
          >
            ✎
          </button>
        </div>
        <div class="template-actions-container">
          <button
            class="update-button uwu-button install-button"
            title="Обновить шаблон"
          >
            ↻
          </button>
          <button
            class="remove-button uwu-button install-button"
            title="Удалить шаблон"
          >
            X
          </button>
        </div>
      </div>
    `;

  const cssStyles =
    /* CSS */
    `
      #uwu-templates {
        font-family: Montserrat;
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 20px;
        background-color: #242424;
        margin-bottom: 5px;
        margin-top: 5px;
        color: #d5d5d5;
      }
      
      #uwu-templates > h2 {
        font-size: 2em;
        text-align: center;
        margin-top: 10px;
        margin-bottom: 10px;
        letter-spacing: 20px;
      }

      #uwu-templates-list {
        max-height: 220px;
        overflow-x: auto;
        border-radius: 20px;
        background-color: #2e2e2e;
      }

      .uwu-template-item {
        padding-left: 10px;
        padding-right: 10px;
        padding-top: 5px;
        padding-bottom: 5px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      #uwu-templates > div.button-container {
        display: flex;
        justify-content: flex-end;
        padding-left: 10px;
        padding-right: 4px;
        padding-top: 5px;
        padding-bottom: 5px;
      }

      .template-name {
        cursor: pointer;
        text-decoration: underline;
      }

      .uwu-button {
        background-color: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.1);
        padding: 5px 10px;
        border-radius: 20px;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }
      
      .uwu-button:hover {
        background-color: rgba(255, 255, 255, 0.2);
      }
  `;

  document.head.insertAdjacentHTML("beforeend", `<style>${cssStyles}</style>`);

  function setupTemplates(
    targetElementId,
    contentElementId,
    subjectElementId = null,
    pageType
  ) {
    const targetElement = document.getElementById(targetElementId);
    if (!targetElement) return;

    if (!document.getElementById("uwu-templates")) {
      if (targetElementId === "mess_form") {
        targetElement.insertAdjacentHTML("beforeend", templateContainer);
      } else if (targetElementId === "send_comment_form") {
        targetElement.insertAdjacentHTML("afterend", templateContainer);
      } else {
        targetElement.insertAdjacentHTML("afterbegin", templateContainer);
      }
    }

    const templatesList = document.getElementById("uwu-templates-list");
    const createButton = document.getElementById("create-template-button");

    createButton.addEventListener("click", (event) => {
      event.preventDefault();
      createTemplate(contentElementId, subjectElementId, pageType);
    });

    function createTemplate(contentElementId, subjectElementId, pageType) {
      const templateName = prompt("Введите название шаблона:");
      if (templateName) {
        const template = {
          name: templateName,
          content:
            document.getElementById(contentElementId).innerText ||
            document.getElementById(contentElementId).value,
          subject: subjectElementId
            ? document.getElementById(subjectElementId).value || ""
            : "",
          pageType: pageType,
        };
        saveTemplate(template);
        renderTemplates(pageType);
      }
    }

    function saveTemplate(template) {
      if (!uwuStorage.getItem("uwu_templates")) {
        uwuStorage.setItem("uwu_templates", []);
      }
      const templates = uwuStorage.getItem("uwu_templates");
      templates.push(template);
      uwuStorage.setItem("uwu_templates", templates);
    }

    function renderTemplates(pageType) {
      const templates = uwuStorage.getItem("uwu_templates") || [];
      templatesList.innerHTML = "";

      templates.forEach((template, index) => {
        if (template.pageType === pageType) {
          const templateItemHTML = document.createElement("div");
          templateItemHTML.innerHTML = templateItem;
          const templateItemElement = templateItemHTML.children[0];

          const templateName =
            templateItemElement.querySelector(".template-name");
          templateName.textContent = template.name;
          templateName.addEventListener("click", () => {
            if (document.getElementById(contentElementId).tagName === "DIV") {
              document.getElementById(contentElementId).innerText =
                template.content;
            } else {
              document.getElementById(contentElementId).value =
                template.content;
            }
            if (subjectElementId) {
              document.getElementById(subjectElementId).value =
                template.subject || "";
            }
          });

          const renameButton =
            templateItemElement.querySelector(".rename-button");
          renameButton.addEventListener("click", () => renameTemplate(index));

          const updateButton =
            templateItemElement.querySelector(".update-button");
          updateButton.addEventListener("click", () =>
            updateTemplate(index, contentElementId, subjectElementId)
          );

          const removeButton =
            templateItemElement.querySelector(".remove-button");
          removeButton.addEventListener("click", () => removeTemplate(index));

          templatesList.appendChild(templateItemElement);
        }
      });
    }

    function renameTemplate(index) {
      const newName = prompt("Введите новое название шаблона:");
      if (newName) {
        const templates = uwuStorage.getItem("uwu_templates");
        templates[index].name = newName;
        uwuStorage.setItem("uwu_templates", templates);
        renderTemplates(pageType);
      }
    }

    function updateTemplate(index, contentElementId, subjectElementId) {
      const templates = uwuStorage.getItem("uwu_templates");
      if (document.getElementById(contentElementId).tagName === "DIV") {
        templates[index].content =
          document.getElementById(contentElementId).innerText;
      } else {
        templates[index].content =
          document.getElementById(contentElementId).value;
      }
      if (subjectElementId) {
        templates[index].subject =
          document.getElementById(subjectElementId).value || "";
      }
      uwuStorage.setItem("uwu_templates", templates);
      renderTemplates(pageType);
    }

    function removeTemplate(index) {
      const confirmation = confirm(
        "Вы уверены, что хотите удалить этот шаблон?"
      );
      if (confirmation) {
        const templates = uwuStorage.getItem("uwu_templates");
        templates.splice(index, 1);
        uwuStorage.setItem("uwu_templates", templates);
        renderTemplates(pageType);
      }
    }

    renderTemplates(pageType);
  }

  function checkUrlAndSetup() {
    // 1. Личные сообщения
    if (targetLsNew.test(window.location.href) && settings.templatesInLs) {
      setupSingleCallback("#write_form", () =>
        setupTemplates("write_div", "text", "subject", "ls")
      );
    }
    
    // 2. Создание Блогов и Лент
    if (
      (targetBlogsCreation.test(window.location.href) ||
        targetSniffCreation.test(window.location.href)) &&
      settings.templatesInBlogsAndSniffs
    ) {
      setupSingleCallback(".creation_form", () =>
        setupTemplates(
          "creation_form",
          "creation-text",
          "creation-title",
          "blogsAndSniffs"
        )
      );
    }
    
    // 3. Комментарии в Блогах и Лентах
    if (
      (targetBlog.test(window.location.href) ||
        targetSniff.test(window.location.href)) &&
      settings.templatesInComments &&
      !targetBlogsCreation.test(window.location.href) &&
      !targetSniffCreation.test(window.location.href)
    ) {
      setupSingleCallback("#send_comment_form", () =>
        setupTemplates("send_comment_form", "comment", null, "comments")
      );
    }

    // 4. Чаты Игровой
    if (
      targetChats.test(window.location.href) &&
      settings.templatesInChats
    ) {
      setupSingleCallback("#mess_form", () =>
        setupTemplates("mess_form", "mess", null, "chat")
      );
    }
  }

  setupMutationObserver("#main", checkUrlAndSetup, {
    childList: true,
    attributes: true,
  });

  setupMutationObserver("#branch", checkUrlAndSetup, {
    childList: true,
  });
}

initializeTemplates();

// ====================================================================================================================
//   . . . СОХРАНЕНИЕ ЛИЧНЫХ СООБЩЕНИЙ . . .
// ====================================================================================================================
if (targetLs.test(window.location.href) && settings.savingLS) {

  /**
   * Отображает сохраненное сообщение в контейнере.
   * @param {string} lsId - ID сообщения для отображения.
   */
  function displaySavedMessage(lsId) {
    const container = document.getElementById("uwu-saved-ls-container");
    if (!container) return;

    const savedLs = uwuStorage.getItem("uwu_saved_ls") || {};
    const ls = savedLs[lsId];

    if (!ls) {
      container.innerHTML =
        "<h3>Ошибка: Сохранённое сообщение не найдено.</h3><p><a href='#' id='uwu-back-to-saved-list'>Назад к списку</a></p>";
      document
        .getElementById("uwu-back-to-saved-list")
        .addEventListener("click", showSavedMessagesInterface);
      return;
    }

    const typeLabel = ls.type === 0 ? "Отправитель" : "Получатель";
    const catLink = `<a href="/cat${ls.catId}" id="msg_login">${ls.catName}</a>`;

    const messageHTML = `
      <p><a href="#" id="uwu-back-to-saved-list">← Назад к сохранённым</a></p>
      <table id="msg_table" border="1">
        <tbody>
          <tr>
            <td colspan="2"><span id="msg_subject">${ls.subject}</span></td>
          </tr>
          <tr>
            <td valign="top" id="msg_info">
              ${typeLabel}: ${catLink}<br>
              ${ls.date}<br>
              <i>(сохранённая оффлайн-копия)</i>
            </td>
            <td><div class="parsed">${ls.text}</div></td>
          </tr>
        </tbody>
      </table>
    `;

    container.innerHTML = messageHTML;
    document
      .getElementById("uwu-back-to-saved-list")
      .addEventListener("click", showSavedMessagesInterface);
  }

  /**
   * Удаляет сохраненное ЛС из localStorage по его ID.
   * @param {number} lsId - ID личного сообщения для удаления.
   * @param {boolean} silent - Если true, не показывать alert.
   */
  function deleteSavedLS(lsId, silent = false) {
    try {
      const savedLs = uwuStorage.getItem("uwu_saved_ls") || {};
      if (savedLs.hasOwnProperty(lsId)) {
        delete savedLs[lsId];
        uwuStorage.setItem("uwu_saved_ls", savedLs);
        if (!silent) {
          alert("Сохранённая переписка удалена.");
        }
        if (window.location.search.includes(`?id=${lsId}`)) {
          addSaveButtonsToMessagePage();
        }
        updateSavedLsCount();
      }
    } catch (error) {
      console.error("UwU | Ошибка при удалении ЛС:", error);
      if (!silent) {
        alert("Произошла ошибка при удалении переписки.");
      }
    }
  }

  /**
   * Сохраняет текущее открытое ЛС в uwuStorage.
   */
  function saveCurrentLS() {
    try {
      const mainDiv = document.getElementById("main");
      const lsId = parseInt(window.location.href.split("=")[1], 10);
      if (isNaN(lsId)) return;

      const savedLs = uwuStorage.getItem("uwu_saved_ls") || {};

      const ls = {};
      ls.subject = document.getElementById("msg_subject").textContent;
      ls.text = document.querySelector(".parsed").innerHTML;

      const msgInfo = document.getElementById("msg_info");
      const dateMatch = msgInfo.innerHTML.match(
        /\d{1,2} [а-я]+ \d{4} в \d{2}:\d{2}/
      );
      ls.date = dateMatch ? dateMatch[0] : new Date().toLocaleString();

      ls.catId = parseInt(
        document
          .getElementById("msg_login")
          .getAttribute("href")
          .match(/\d+/)[0],
        10
      );
      ls.catName = document.getElementById("msg_login").textContent;
      ls.myId = mainDiv.dataset.id;
      ls.myName = mainDiv.dataset.login;
      ls.type = /Отправитель:/.test(msgInfo.innerHTML) ? 0 : 1;

      const now = new Date();
      ls.savedate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(now.getDate()).padStart(2, "0")} ${String(
        now.getHours()
      ).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(
        now.getSeconds()
      ).padStart(2, "0")}`;

      savedLs[lsId] = ls;
      uwuStorage.setItem("uwu_saved_ls", savedLs);

      alert("Переписка успешно сохранена!");
      addSaveButtonsToMessagePage();
      updateSavedLsCount();
    } catch (error) {
      console.error("UwU | Ошибка при сохранении ЛС:", error);
      alert("Произошла ошибка при сохранении переписки.");
    }
  }

  /**
   * Добавляет кнопки управления сохранением на страницу просмотра ЛС.
   */
  function addSaveButtonsToMessagePage() {
    const subjectSpan = document.getElementById("msg_subject");
    if (!subjectSpan) return;

    const subjectTd = subjectSpan.closest("td");
    if (!subjectTd) return;

    const oldButtons = document.getElementById("uwu-ls-buttons");
    if (oldButtons) oldButtons.remove();

    const lsId = parseInt(window.location.href.split("=")[1], 10);
    const savedLs = uwuStorage.getItem("uwu_saved_ls") || {};
    const isSaved = savedLs.hasOwnProperty(lsId);

    const buttonsContainer = document.createElement("span");
    buttonsContainer.id = "uwu-ls-buttons";
    buttonsContainer.style.float = "right";
    buttonsContainer.style.display = "inline-block";

    const saveButton = document.createElement("input");
    saveButton.type = "button";
    saveButton.value = isSaved ? "Обновить" : "Сохранить";
    saveButton.className = "uwu-button install-button";
    saveButton.style.marginLeft = "5px";
    saveButton.onclick = saveCurrentLS;

    buttonsContainer.appendChild(saveButton);

    if (isSaved) {
      const deleteButton = document.createElement("input");
      deleteButton.type = "button";
      deleteButton.value = "Удалить";
      deleteButton.className = "uwu-button remove-button";
      deleteButton.style.marginLeft = "5px";
      deleteButton.onclick = () => deleteSavedLS(lsId);
      buttonsContainer.appendChild(deleteButton);

      const savedDate = document.createElement("i");
      savedDate.textContent = `Сохранено: ${savedLs[lsId].savedate}`;
      savedDate.style.marginRight = "10px";
      buttonsContainer.prepend(savedDate);
    }

    subjectTd.appendChild(buttonsContainer);
  }

  /**
   * Обновляет счетчик сохраненных сообщений во вкладке.
   */
  function updateSavedLsCount() {
    const counter = document.getElementById("uwu-saved-ls-count");
    if (!counter) return;
    const savedLs = uwuStorage.getItem("uwu_saved_ls") || {};
    counter.textContent = Object.keys(savedLs).length;
  }

  /**
   * Отображает интерфейс с сохраненными сообщениями.
   */
  function showSavedMessagesInterface(event) {
    if (event) event.preventDefault();
    console.log("UwU | Открываю вкладку сохранённых ЛС.");

    document.getElementById("main").style.display = "none";
    document
      .querySelectorAll("#links a")
      .forEach((a) => a.classList.remove("active"));
    document.getElementById("uwu-saved-ls-tab").classList.add("active");

    let container = document.getElementById("uwu-saved-ls-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "uwu-saved-ls-container";
      document.getElementById("main").after(container);
    }
    container.style.display = "block";
    renderSavedMessagesList(container);
  }

  /**
   * Скрывает интерфейс сохраненных сообщений и показывает стандартный.
   */
  function hideSavedMessagesInterface() {
    const container = document.getElementById("uwu-saved-ls-container");
    if (container) container.style.display = "none";
    document.getElementById("main").style.display = "block";
    document.getElementById("uwu-saved-ls-tab")?.classList.remove("active");
  }

  /**
   * Внедряет CSS-стили для интерфейса сохранения ЛС.
   */
  function injectLSSyles() {
    if (document.getElementById("uwu-ls-styles")) return;

    const css =
      /* CSS */
      `
       #uwu-saved-ls-tab {
        padding: 2px 8px;
        border-radius: 10px;
        background-color: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        transition: background-color 0.3s ease;
        text-decoration: none !important;
      }
      #uwu-saved-ls-tab:hover, #uwu-saved-ls-tab.active {
        background-color: rgba(255, 255, 255, 0.2);
      }

      #uwu-saved-ls-container .messList {
        table-layout: fixed;
        width: 100%;
      }
      
      #uwu-saved-ls-container .messList a {
        color: #0000cd;
      }
      
      #uwu-saved-ls-container .messList th:nth-child(1) { width: 50%; }
      #uwu-saved-ls-container .messList th:nth-child(2) { width: 25%; }
      #uwu-saved-ls-container .messList th:nth-child(3) { width: 20%; }
      #uwu-saved-ls-container .messList th:nth-child(4) { width: 5%; }

      #uwu-saved-ls-container .delete-saved-ls {
        padding: 1px 7px;
      }
    `;
    const styleElement = document.createElement("style");
    styleElement.id = "uwu-ls-styles";
    styleElement.textContent = css;
    document.head.appendChild(styleElement);
  }

  /**
   * Отрисовывает список сохраненных сообщений в указанном контейнере.
   * @param {HTMLElement} container - Элемент для отрисовки.
   */
  function renderSavedMessagesList(container) {
    const savedLsRaw = uwuStorage.getItem("uwu_saved_ls");
    const savedLs = savedLsRaw || {};
    const keys = Object.keys(savedLs);

    const storageSize = savedLsRaw
      ? (new TextEncoder().encode(savedLsRaw).length / 1024 / 1024).toFixed(2)
      : 0;

    if (keys.length === 0) {
      container.innerHTML = "<h3>У вас нет сохранённых сообщений.</h3>";
      return;
    }

    let inboxHTML = "";
    let outboxHTML = "";

    keys.sort(
      (a, b) => new Date(savedLs[b].savedate) - new Date(savedLs[a].savedate)
    );

    keys.forEach((key) => {
      const ls = savedLs[key];
      const rowHTML =
        /* HTML */
        `
          <tr class="msg_read">
            <td>
              <a href="#" class="uwu-saved-msg-open" data-id="${key}"
                >${ls.subject}</a
              >
            </td>
            <td><a href="/cat${ls.catId}">${ls.catName}</a></td>
            <td>${ls.savedate}</td>
            <td>
              <input
                type="button"
                value="X"
                class="uwu-button remove-button delete-saved-ls"
                data-id="${key}"
                title="Удалить"
              />
            </td>
          </tr>
        `;
      if (ls.type === 0) {
        inboxHTML += rowHTML;
      } else {
        outboxHTML += rowHTML;
      }
    });

    container.innerHTML =
      /* HTML */
      `
        <p style="text-align: center; color: #888;">
          Использовано примерно ${storageSize} из 5.00 МБ дискового
          пространства.
        </p>
        <h2>Входящие</h2>
        <table class="messList">
          <tbody>
            <tr>
              <th>Тема</th>
              <th>Отправитель</th>
              <th>Дата сохранения</th>
              <th></th>
            </tr>
            ${inboxHTML}
          </tbody>
        </table>
        <br />
        <h2>Отправленные</h2>
        <table class="messList">
          <tbody>
            <tr>
              <th>Тема</th>
              <th>Получатель</th>
              <th>Дата сохранения</th>
              <th></th>
            </tr>
            ${outboxHTML}
          </tbody>
        </table>
      `;

    container.querySelectorAll(".delete-saved-ls").forEach((button) => {
      button.addEventListener("click", (e) => {
        const lsId = e.target.dataset.id;
        if (
          confirm(
            "Вы уверены, что хотите удалить эту переписку из сохранённых?"
          )
        ) {
          deleteSavedLS(lsId, true);
          renderSavedMessagesList(container);
        }
      });
    });

    container.querySelectorAll(".uwu-saved-msg-open").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const lsId = e.target.dataset.id;
        displaySavedMessage(lsId);
      });
    });
  }

  /**
   * Добавляет вкладку "Сохранённые" в меню ЛС.
   */
  function addSavedMessagesTab() {
    const linksContainer = document.getElementById("links");
    if (!linksContainer || document.getElementById("uwu-saved-ls-tab")) return;

    linksContainer.insertAdjacentHTML(
      "beforeend",
      ` | <a href="#" id="uwu-saved-ls-tab">Сохранённые (<span id="uwu-saved-ls-count">0</span>)</a>`
    );

    const savedTab = document.getElementById("uwu-saved-ls-tab");
    savedTab.addEventListener("click", showSavedMessagesInterface);

    linksContainer.querySelectorAll("a:not(#uwu-saved-ls-tab)").forEach((a) => {
      a.addEventListener("click", () => {
        if (!a.href.includes("ls?id=")) {
          hideSavedMessagesInterface();
        }
      });
    });

    updateSavedLsCount();
  }

  /**
   * Функция-обработчик, которая определяет, что делать на странице ЛС.
   */
  function initializeLSPageLogic() {
    injectLSSyles();

    if (
      window.location.search.includes("?id=") &&
      document.getElementById("msg_table")
    ) {
      // console.log("UwU | Обнаружена страница сообщения. Встраиваю кнопки...");
      addSaveButtonsToMessagePage();
      hideSavedMessagesInterface();
    } else {
      // console.log("UwU | Обнаружена главная страница ЛС. Встраиваю вкладку...");
      addSavedMessagesTab();
    }
  }

  setupMutationObserver("#main", initializeLSPageLogic, { childList: true });
}

// ====================================================================================================================
//   . . . РЕДИЗАЙН АВТОМАТИЧЕСКИХ ПЛЕМЕННЫХ ДЕЙСТВИЙ . . .
// ====================================================================================================================
if (targetClanAutoActions.test(window.location.href) && settings.automaticActionsRedesign) {
  function applyAutoActionsRedesign() {
    const style = document.createElement("style");
    style.id = "uwu-aa-redesign";
    style.innerHTML = /* CSS */ `
      .aa-page {
          font-family: "Montserrat", sans-serif;
      }

      .aa-controls {
          gap: 10px 15px !important;
      }
      .aa-field {
          display: block !important;
      }
      .aa-field span {
          display: block;
          margin-bottom: 3px;
      }

      .aa-report-detail {
          background: rgba(0, 0, 0, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.05) !important;
          border-radius: 10px;
          padding: 10px 15px !important;
      }

      .aa-report-detail > p:first-of-type {
          background: rgba(0, 0, 0, 0.2);
          padding: 10px 15px !important;
          border-radius: 8px;
          line-height: 1.6;
          font-size: 13px;
          column-count: 2;
          column-gap: 20px;
          border-left: 2px solid rgba(255, 255, 255, 0.2);
      }
      
      .aa-report-detail > p:first-of-type b {
          color: rgba(255, 255, 255, 0.45);
          font-weight: normal;
          margin-right: 4px;
      }

      .aa-table {
          border: none !important;
          width: 100%;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 8px;
          overflow: hidden;
          margin-bottom: 10px !important;
      }
      .aa-table th, .aa-table td {
          border: none !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
          padding: 4px 8px !important;
          vertical-align: middle !important;
          font-size: 13px;
      }
      .aa-table th {
          background: rgba(255, 255, 255, 0.05);
          text-transform: uppercase;
          font-size: 11px;
          letter-spacing: 0.5px;
          color: rgba(255, 255, 255, 0.5);
      }
      .aa-table tr:last-child td {
          border-bottom: none !important;
      }
      .aa-table tr:hover td {
          background: rgba(255, 255, 255, 0.05);
      }

      .aa-field select, .aa-field input[type="text"], .aa-event-controls select {
          background-color: rgba(0, 0, 0, 0.4) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          color: #d5d5d5;
          padding: 4px 8px !important;
          border-radius: 6px;
          outline: none;
          font-size: 13px;
          transition: border-color 0.2s;
      }
      .aa-field select:focus, .aa-field input[type="text"]:focus, .aa-event-controls select:focus {
          border-color: rgba(255, 255, 255, 0.3) !important;
      }

      .aa-actions input[type="submit"], .aa-event-controls input[type="submit"] {
          background-color: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 4px 12px !important;
          border-radius: 10px;
          font-size: 13px;
          color: #d5d5d5;
          cursor: pointer;
          transition: background-color 0.2s ease;
      }
      .aa-actions input[type="submit"]:hover, .aa-event-controls input[type="submit"]:hover {
          background-color: rgba(255, 255, 255, 0.15);
      }

      .aa-report-link, .aa-report-close {
          color: #83e5ff;
          text-decoration: none;
          transition: opacity 0.2s;
          font-weight: bold;
      }
      .aa-report-link:hover, .aa-report-close:hover {
          opacity: 0.8;
          text-decoration: underline;
      }
      
      .aa-pages a, .aa-pages span {
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 5px;
          background: rgba(0, 0, 0, 0.2);
          padding: 2px 6px !important;
          font-size: 12px;
      }
      .aa-pages .is-current {
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
      }
    `;
    document.head.appendChild(style);
  }

  applyAutoActionsRedesign();
}

// ====================================================================================================================
//   . . . РЕДИЗАЙН ПОИСКА БЛОГОВ И СОРТИРОВКА . . .
// ====================================================================================================================
if (targetBlogsea.test(window.location.href) && settings.blogseaRedesign) {
  const style = document.createElement("style");
  style.id = "uwu-blogsea-redesign";
  style.innerHTML = /* CSS */ `
      #branch {
          font-family: "Montserrat", sans-serif;
      }
      .blogsea-table {
          border: none !important;
          width: 100%;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 8px;
          overflow: hidden;
          margin-bottom: 10px !important;
          border-spacing: 0;
      }
      .blogsea-table th, .blogsea-table td {
          border: none !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
          padding: 4px 8px !important;
          vertical-align: middle !important;
          font-size: 13px;
      }
      .blogsea-table th {
          background: rgba(255, 255, 255, 0.05);
          text-transform: uppercase;
          font-size: 11px;
          letter-spacing: 0.5px;
          color: rgba(255, 255, 255, 0.5);
          cursor: pointer;
          user-select: none;
          transition: background 0.2s;
      }
      .blogsea-table th:hover {
          background: rgba(255, 255, 255, 0.1);
      }
      .blogsea-table tr:last-child td {
          border-bottom: none !important;
      }
      .blogsea-table tr:hover td {
          background: rgba(255, 255, 255, 0.05);
      }
      .blogsea-table a {
          text-decoration: none;
          transition: opacity 0.2s;
      }
      .blogsea-table a:hover {
          opacity: 0.8;
          text-decoration: underline;
      }
      .sort-arrow {
          display: inline-block;
          width: 14px;
          text-align: center;
          margin-left: 4px;
      }
    `;
  document.head.appendChild(style);

  function applyBlogseaRedesign() {
    const table = document.querySelector("#branch > table");
    
    if (!table || table.classList.contains("blogsea-table")) return;

    const tbody = table.querySelector("tbody");
    if (!tbody) return;

    const headerRow = tbody.querySelector("tr");
    if (!headerRow) return;

    const firstCell = headerRow.querySelector("td");
    if (!firstCell || !firstCell.textContent.includes("Название")) return;

    table.classList.add("blogsea-table");
    table.removeAttribute("border");

    const headerCells = Array.from(headerRow.children);
    const thead = document.createElement("thead");
    const newHeaderRow = document.createElement("tr");

    const columns = [
      { index: 0, type: 'string' },
      { index: 1, type: 'date' },
      { index: 2, type: 'string' }
    ];

    let sortState = { column: -1, asc: true };

    headerCells.forEach((td, index) => {
      const th = document.createElement("th");
      th.innerHTML = td.textContent.replace(/\u00A0/g, ' ').trim() + ' <span class="sort-arrow">↕</span>';
      
      th.addEventListener("click", () => {
        const isAscending = sortState.column === index ? !sortState.asc : true;
        sortState = { column: index, asc: isAscending };
        
        Array.from(newHeaderRow.children).forEach((h, i) => {
          const arrow = h.querySelector('.sort-arrow');
          if (arrow) {
            if (i === index) {
              arrow.textContent = isAscending ? '↓' : '↑';
            } else {
              arrow.textContent = '↕';
            }
          }
        });

        sortTable(index, isAscending, columns[index].type);
      });
      newHeaderRow.appendChild(th);
    });

    thead.appendChild(newHeaderRow);
    table.insertBefore(thead, tbody);
    headerRow.remove();

    function sortTable(columnIndex, asc, type) {
      const rows = Array.from(tbody.querySelectorAll("tr"));
      
      rows.sort((a, b) => {
        const aCell = a.children[columnIndex].textContent.trim();
        const bCell = b.children[columnIndex].textContent.trim();

        if (type === 'date') {
          const aDate = parseRussianDate(aCell);
          const bDate = parseRussianDate(bCell);
          return asc ? aDate - bDate : bDate - aDate;
        } else {
          return asc ? aCell.localeCompare(bCell) : bCell.localeCompare(aCell);
        }
      });

      rows.forEach(row => tbody.appendChild(row));
    }
  }

  function parseRussianDate(dateString) {
      const months = {
        "января": 0, "февраля": 1, "марта": 2, "апреля": 3, "мая": 4, "июня": 5,
        "июля": 6, "августа": 7, "сентября": 8, "октября": 9, "ноября": 10, "декабря": 11
      };
      
      const parts = dateString.replace(/\u00A0/g, ' ').replace(' в ', ' ').trim().split(/\s+/);
      if (parts.length < 3) return 0;

      let day = parseInt(parts[0], 10);
      let month = months[parts[1]] || 0;
      let year = new Date().getFullYear();
      let timePart = "";

      if (parts.length >= 4 && !parts[2].includes(':')) {
        year = parseInt(parts[2], 10);
        timePart = parts[3];
      } else if (parts.length >= 3) {
        timePart = parts[2];
      }

      let hours = 0, minutes = 0;
      if (timePart && timePart.includes(':')) {
        const timeSplit = timePart.split(':');
        hours = parseInt(timeSplit[0], 10);
        minutes = parseInt(timeSplit[1], 10);
      }

      const parsedDate = new Date(year, month, day, hours, minutes);
      
      if (parsedDate.getTime() > Date.now() + 30 * 24 * 60 * 60 * 1000) {
        parsedDate.setFullYear(year - 1);
      }

      return parsedDate.getTime();
    }

  setupMutationObserver("#branch", applyBlogseaRedesign, { childList: true, subtree: true });
}

// ====================================================================================================================
//   . . . РЕДИЗАЙН БЛОГОВ И ЛЕНТЫ . . .
// ====================================================================================================================
if ((targetBlog.test(window.location.href) || targetSniff.test(window.location.href)) && settings.blogsRedesign) {
  function applyBlogsNavRedesign() {
    const pageFormDiv = document.querySelector('#page_form > div');
    if (!pageFormDiv || pageFormDiv.querySelector('.uwu-blogs-header-wrapper')) return;

    const urlParams = new URLSearchParams(window.location.search);
    let currentPage = parseInt(urlParams.get('page')) || 1;

    const headerWrapper = document.createElement('div');
    headerWrapper.className = 'uwu-blogs-header-wrapper';

    const topRow = document.createElement('div');
    topRow.className = 'uwu-header-top-row';

    const pagContainer = document.createElement('div');
    pagContainer.className = 'uwu-pagination-container';

    const actionContainer = document.createElement('div');
    actionContainer.className = 'uwu-action-container';

    const filterContainer = document.createElement('div');
    filterContainer.className = 'uwu-filter-container';

    const prevSpan = document.getElementById('prev_page_span');
    const nextSpan = document.getElementById('next_page_span');
    const prevLink = document.getElementById('prev_page');
    const nextLink = document.getElementById('next_page');
    
    const pageLabel = document.createElement('div');
    pageLabel.className = 'uwu-page-label';
    pageLabel.textContent = `Страница ${currentPage}`;

    if (prevLink) {
        prevLink.innerHTML = '← Назад';
        prevLink.addEventListener('click', () => {
            currentPage = Math.max(1, currentPage - 1);
            pageLabel.textContent = `Страница ${currentPage}`;
        });
    }
    if (nextLink) {
        nextLink.innerHTML = 'Вперёд →';
        nextLink.addEventListener('click', () => {
            currentPage++;
            pageLabel.textContent = `Страница ${currentPage}`;
        });
    }

    if (prevSpan) pagContainer.appendChild(prevSpan);
    pagContainer.appendChild(pageLabel);
    if (nextSpan) pagContainer.appendChild(nextSpan);

    const anchors = Array.from(pageFormDiv.querySelectorAll('a'));
    anchors.forEach(a => {
        if (a.id === 'prev_page' || a.id === 'next_page') return; 
        
        if (a.textContent.includes('Создать')) {
            a.innerHTML = '✍️ Создать';
            actionContainer.appendChild(a);
        } else if (a.textContent.includes('Поиск')) {
            a.innerHTML = '🔍 Поиск';
            filterContainer.appendChild(a);
        } else {
            filterContainer.appendChild(a);
        }
    });

    const notApproved = document.getElementById('notApproved');
    if (notApproved) {
        filterContainer.appendChild(notApproved);
    }

    pageFormDiv.innerHTML = '';
    
    topRow.appendChild(pagContainer);
    if (actionContainer.childNodes.length > 0) {
        topRow.appendChild(actionContainer);
    }
    
    headerWrapper.appendChild(topRow);
    if (filterContainer.childNodes.length > 0) {
        headerWrapper.appendChild(filterContainer);
    }

    pageFormDiv.appendChild(headerWrapper);

    if (!document.getElementById('uwu-blogs-redesign-styles')) {
        const style = document.createElement("style");
        style.id = "uwu-blogs-redesign-styles";
        style.innerHTML = /* CSS */`
            .uwu-blogs-header-wrapper {
                display: flex;
                flex-direction: column;
                gap: 12px;
                margin-bottom: 20px;
            }

            .uwu-header-top-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                flex-wrap: wrap;
                gap: 10px;
            }

            .uwu-pagination-container {
                display: flex;
                align-items: center;
                background: rgba(127, 127, 127, 0.15);
                border: 1px solid rgba(127, 127, 127, 0.2);
                border-radius: 12px;
                padding: 4px;
            }

            #prev_page_span, #next_page_span, #notApproved {
                font-size: 0 !important;
                color: transparent !important;
                display: inline-flex !important;
                align-items: center;
            }

            .uwu-page-label {
                opacity: 0.8;
                font-weight: 600;
                padding: 0 15px;
                user-select: none;
            }

            #prev_page, #next_page {
                background: rgba(127, 127, 127, 0.1);
                padding: 6px 14px;
                border-radius: 8px;
                text-decoration: none !important;
                font-size: 13px !important;
                font-weight: normal !important;
                transition: background-color 0.2s ease, transform 0.2s ease;
            }

            #prev_page:hover, #next_page:hover {
                background: rgba(127, 127, 127, 0.25);
                transform: translateY(-1px);
            }

            .uwu-action-container a {
                display: inline-flex;
                background: rgba(127, 127, 127, 0.2);
                border: 1px solid rgba(127, 127, 127, 0.3);
                padding: 8px 16px;
                border-radius: 12px;
                text-decoration: none;
                font-weight: 600;
                transition: all 0.2s ease;
            }

            .uwu-action-container a:hover {
                background: rgba(127, 127, 127, 0.3);
                transform: translateY(-2px);
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            }

            .uwu-filter-container {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                background: rgba(127, 127, 127, 0.1);
                padding: 10px;
                border-radius: 12px;
                border: 1px solid rgba(127, 127, 127, 0.2);
            }

            .uwu-filter-container a {
                background: rgba(127, 127, 127, 0.1);
                border: 1px solid rgba(127, 127, 127, 0.15);
                padding: 6px 12px;
                border-radius: 8px;
                text-decoration: none;
                transition: all 0.2s ease;
            }

            .uwu-filter-container a:hover, 
            .uwu-filter-container a.active {
                background: rgba(127, 127, 127, 0.25);
                border-color: rgba(127, 127, 127, 0.3);
            }
            
            .blog, .comment {
                background: rgba(127, 127, 127, 0.08);
                border: 1px solid rgba(127, 127, 127, 0.2);
                border-radius: 12px;
                padding: 16px;
                margin-bottom: 16px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
                transition: transform 0.2s ease, border-color 0.2s ease;
                position: relative;
            }

            .blog:hover, .comment:hover {
                border-color: rgba(127, 127, 127, 0.3);
            }

            .blog-title, .comment-title {
                font-size: 17px;
                font-weight: 600;
                margin: 0 0 6px 0 !important;
                line-height: 1.3;
            }

            .comment-title {
                font-size: 14px;
                padding-right: 60px;
            }

            .blog-title a, .comment-title a {
                text-decoration: none !important;
                transition: opacity 0.2s ease;
            }

            .blog-title a:hover, .comment-title a:hover {
                opacity: 0.7;
            }

            .blog-info, .comment-info {
                font-size: 11px;
                opacity: 0.6;
                margin: 0 0 12px 0 !important;
                padding-bottom: 12px;
                border-bottom: 1px solid rgba(127, 127, 127, 0.2);
            }

            .blog-info a, .comment-info a {
                font-weight: 500;
                text-decoration: none;
            }

            .blog-info a:hover, .comment-info a:hover {
                opacity: 0.8;
                text-decoration: underline;
            }

            .blog-tags {
                font-size: 11px;
                margin-bottom: 12px !important;
                display: flex;
                flex-wrap: wrap;
                gap: 6px;
                align-items: center;
            }

            .blog-tags .tag {
                background: rgba(127, 127, 127, 0.15);
                padding: 4px 8px;
                border-radius: 6px;
                color: inherit !important;
                text-decoration: none !important;
                border: 1px solid transparent;
                transition: all 0.2s ease;
            }

            .blog-tags .tag:hover {
                background: rgba(127, 127, 127, 0.25);
                border-color: rgba(127, 127, 127, 0.3);
            }

            .blog > hr.line, .comment > hr.line {
                display: none !important;
            }

            .blog-read {
                margin-top: 12px !important;
            }
            
            .blog-read a {
                display: inline-block;
                font-weight: 600;
                color: inherit !important;
                background: rgba(127, 127, 127, 0.15);
                padding: 6px 12px;
                border-radius: 8px;
                text-decoration: none !important;
                transition: background 0.2s ease;
            }

            .blog-read a:hover {
                background: rgba(127, 127, 127, 0.25);
            }
            
            .comment p:has(> .comment-delete) {
                margin: 0;
            }

            .comment-delete {
                position: absolute;
                top: 16px;
                right: 16px;
                font-size: 11px;
                color: inherit !important;
                background: rgba(127, 127, 127, 0.1);
                border: 1px solid rgba(127, 127, 127, 0.2);
                padding: 4px 8px;
                border-radius: 6px;
                text-decoration: none !important;
                opacity: 0.5;
                transition: all 0.2s ease;
            }
            
            .comment:hover .comment-delete {
                opacity: 0.8;
            }
            
            .comment-delete:hover {
                background: rgba(255, 100, 100, 0.2);
                border-color: rgba(255, 100, 100, 0.4);
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
    }
  }

  setupMutationObserver("#blog-links", applyBlogsNavRedesign, { childList: true, subtree: true });
}