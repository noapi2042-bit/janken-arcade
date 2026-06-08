const hands = {
  rock: { label: "グー", symbol: "●", image: "assets/images/janken_gu.png", beats: "scissors" },
  scissors: { label: "チョキ", symbol: "✌", image: "assets/images/janken_choki.png", beats: "paper" },
  paper: { label: "パー", symbol: "▰", image: "assets/images/janken_pa.png", beats: "rock" },
};

const characterImages = {
  normal: "assets/images/character_normal.png",
  win: "assets/images/character_win.png",
  lose: "assets/images/character_lose.png",
  draw: "assets/images/character_draw.png",
  happy: "assets/images/character_happy.png",
  smug: "assets/images/character_smug.png",
  worried: "assets/images/character_worried.png",
  panic: "assets/images/character_panic.png",
  excited: "assets/images/character_excited.png",
  shocked: "assets/images/character_shocked.png",
};

const sceneImages = {
  intro: "assets/images/scene_intro.png",
  playerWin: "assets/images/scene_player_win.png",
  playerLose: "assets/images/scene_player_lose.png",
};

const DEBUG_MODE = new URLSearchParams(window.location.search).has("debug");
const MATCH_POINT = 10;
const CONTINUE_SECONDS = 10;
const DRAW_WARNING_COUNT = 5;
const CHANCE_DRAW_COUNT = 10;
const FINAL_DRAW_COUNT = 15;
const CHANCE_MESSAGES = ["チャンスタイム！", "勝敗2倍だよ！", "次は2点だよ！", "ここが勝負！"];
const INTRO_LINES = ["よろしくね！", "勝負しよ♪", "準備はいい？", "はじめるよ！", "本気でいくよ♪"];
const CHANCE_ENTRY_LINES = ["チャンスタイム！", "勝敗2倍だよ！", "次は2点だよ！", "ここが勝負！"];
const DRAW_WARNING_LINES = ["なんか続いてるね…？", "空気が変わったかも…", "そろそろ動くかも？"];
const FINAL_JANKEN_ENTRY_LINES = ["ファイナルじゃんけん！", "次に勝った方が勝ち！", "ここで全部決まるよ！"];
const FINAL_JANKEN_IDLE_LINES = ["次で決まるよ…！", "勝った方が勝ち！", "最後の勝負だよ！"];
const PSYCH_EVENT_CHANCE = 0.12;
const HAND_NAMES = {
  rock: "グー",
  scissors: "チョキ",
  paper: "パー",
};
const SCENE_INTRO_LINES = [
  "来てくれてありがとう。今日は一緒にじゃんけん勝負、楽しもうね！",
  "準備はいい？ それじゃあ、楽しく勝負しよっか！",
  "よろしくね。手加減なしだけど、楽しくいこうね！",
  "じゃんけん勝負、はじめるよ。最後まで楽しんでね！",
];
const SCENE_PLAYER_WIN_LINES = [
  "すごいね、あなたの勝ちだよ。楽しかったから、また勝負してね！",
  "まけちゃった…。でもすごく楽しかったよ。また遊びに来てね。",
  "あなたの勝ちだね。次はもっと強くなって待ってるね！",
  "くやしいけど、楽しかったよ。よかったら、また勝負しよ？",
];
const SCENE_PLAYER_LOSE_LINES = [
  "ここまで遊んでくれてありがとう。もう一回だけ、勝負してみる？",
  "おつかれさま。あと少しだったね。よかったら、また挑戦してね。",
  "最後まで遊んでくれてうれしいよ。また一緒に勝負しようね。",
  "また来てくれたらうれしいな。次の勝負、待ってるね。",
];

const dialogue = {
  final: {
    idle: FINAL_JANKEN_IDLE_LINES,
    cpuWin: ["決着だよ！", "最後は私の勝ち！", "ファイナル取ったよ！"],
    cpuLose: ["決まったね！", "あなたの勝ちだよ！", "最後の一手、すごい！"],
    draw: ["まだ決まらない！", "もう一回、勝負！", "最後まで分からないね！"],
    image: "excited",
  },
  even: {
    idle: ["いい勝負だね！", "次はどうくる？", "まだまだ！"],
    cpuWin: ["やったー！", "私の勝ち！", "当たった！"],
    cpuLose: ["まけたー！", "くやしい！", "次は負けないよ！"],
    draw: ["あいこだね！", "もう一回！", "気が合うね！"],
    image: "normal",
  },
  playerLeadSmall: {
    idle: ["まずいかも...", "追いつけるよね？", "次こそ！"],
    cpuWin: ["よし、まだいける！", "追い上げるよ！", "ふう、助かった！"],
    cpuLose: ["うう、強いね", "取られちゃった", "焦ってきた..."],
    draw: ["助かった...", "もう一回！", "慎重に..."],
    image: "worried",
  },
  playerLeadBig: {
    idle: ["追いつけるかな", "次は勝ちたい！", "ピンチだよ..."],
    cpuWin: ["やっと取れた！", "まだ終わらない！", "反撃だよ！"],
    cpuLose: ["まけたー！", "どうしよう...", "あとがないよ..."],
    draw: ["ドキドキ...", "まだ続くの？", "ギリギリ..."],
    image: "panic",
  },
  cpuLeadSmall: {
    idle: ["いい感じかも♪", "いけるかな？", "余裕あるよ！"],
    cpuWin: ["リードだよ！", "読めてるよ！", "この調子！"],
    cpuLose: ["油断したかも", "むむ、やるね！", "まだ平気！"],
    draw: ["惜しい！", "もう一回！", "次で決めるよ！"],
    image: "happy",
  },
  cpuLeadBig: {
    idle: ["勝てそう♪", "私、強いかも！", "決めちゃうよ！"],
    cpuWin: ["また勝ち♪", "調子いいよ！", "どうかな？"],
    cpuLose: ["今のは油断！", "まだ余裕だよ！", "びっくりした..."],
    draw: ["粘るねえ！", "次は私かな？", "楽しいね♪"],
    image: "smug",
  },
  chance: {
    idle: CHANCE_MESSAGES,
    cpuWin: ["2点もらうね！", "チャンス成功！", "私の2点！"],
    cpuLose: ["2点は痛い！", "取られたー！", "やられたー！"],
    draw: ["まだまだ！", "熱いね！", "次が勝負だよ！"],
    image: "excited",
  },
};

const endgameLines = ["もうすぐ決まる...", "ここが山場！", "気を抜けないよ！"];

const state = {
  started: false,
  busy: false,
  ended: false,
  win: 0,
  lose: 0,
  draw: 0,
  chance: false,
  drawWarningShown: false,
  finalJanken: false,
  psychEvent: null,
  nextCallMode: "normal",
  countdownTimer: null,
  chanceMessageTimer: null,
  chanceMessageIndex: 0,
  debugForceNextResult: null,
  debugPanelVisible: false,
  debugSoundTaps: [],
  lastLine: "",
  flowId: 0,
};

const cabinet = document.querySelector(".cabinet");
const startButton = document.querySelector("#startButton");
const choiceButtons = document.querySelectorAll(".choice");
const message = document.querySelector("#message");
const playerHand = document.querySelector("#playerHand");
const cpuHand = document.querySelector("#cpuHand");
const resultLabel = document.querySelector("#resultLabel");
const endOverlay = document.querySelector("#endOverlay");
const finalTitle = document.querySelector("#finalTitle");
const finalMessage = document.querySelector("#finalMessage");
const retryButton = document.querySelector("#retryButton");
const muteButton = document.querySelector("#muteButton");
const countdown = document.querySelector("#countdown");
const sceneOverlay = document.querySelector("#sceneOverlay");
const sceneIllustration = document.querySelector("#sceneIllustration");
const sceneCharacterImage = document.querySelector("#sceneCharacterImage");
const sceneCharacterFallback = document.querySelector("#sceneCharacterFallback");
const sceneMessage = document.querySelector("#sceneMessage");
const winCount = document.querySelector("#winCount");
const loseCount = document.querySelector("#loseCount");
const drawCount = document.querySelector("#drawCount");
const characterFrame = document.querySelector(".character-frame");
const characterImage = document.querySelector("#characterImage");
const characterFallback = document.querySelector("#characterFallback");

const AudioManager = (() => {
  const storageKey = "jankenRetroMuted";
  const bgmPaths = {
    normal: "assets/sounds/bgm_loop.mp3",
    chance: "assets/sounds/bgm_chance.mp3",
    final: "assets/sounds/bgm_final.mp3",
  };
  const bgmVolumes = {
    normal: 0.25,
    chance: 0.3,
    final: 0.32,
  };
  let context = null;
  let normalBgm = null;
  let chanceBgm = null;
  let finalBgm = null;
  let finalBgmFailed = false;
  let currentBgmMode = null;
  let muted = false;

  function initAudio() {
    try {
      if (typeof window === "undefined") {
        return;
      }

      muted = window.localStorage.getItem(storageKey) === "true";

      if (!normalBgm) {
        normalBgm = createBgm("normal");
      }

      if (!chanceBgm) {
        chanceBgm = createBgm("chance");
      }

      if (!finalBgm) {
        finalBgm = createBgm("final");
      }

      if (!context) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          context = new AudioContext();
        }
      }
    } catch (error) {
      context = null;
    }
  }

  function createBgm(mode) {
    const audio = new Audio(bgmPaths[mode]);
    audio.loop = true;
    audio.volume = bgmVolumes[mode];
    audio.preload = "none";
    audio.addEventListener(
      "error",
      () => {
        if (mode === "final") {
          console.warn("Final BGM not found: assets/sounds/bgm_final.mp3");
          finalBgmFailed = true;
          if (currentBgmMode === "final") {
            currentBgmMode = null;
            switchBgm("chance");
          }
        }
      },
      { once: true }
    );
    return audio;
  }

  function normalizeBgmMode(mode) {
    if (mode === "final") {
      return finalBgmFailed ? "chance" : "final";
    }

    return mode === "chance" ? "chance" : "normal";
  }

  function bgmForMode(mode) {
    if (mode === "final") {
      return finalBgmFailed ? chanceBgm : finalBgm;
    }

    if (mode === "chance") {
      return chanceBgm;
    }

    return normalBgm;
  }

  function resumeContext() {
    try {
      initAudio();
      if (context && context.state === "suspended") {
        context.resume().catch(() => {});
      }
    } catch (error) {
      // Audio is optional.
    }
  }

  function playBgm(mode = "normal") {
    try {
      initAudio();
      const bgm = bgmForMode(mode);
      if (muted || !bgm) {
        return;
      }

      currentBgmMode = normalizeBgmMode(mode);
      bgm.volume = bgmVolumes[currentBgmMode];
      bgm.play().catch(() => {
        if (currentBgmMode === "final") {
          console.warn("Final BGM not found: assets/sounds/bgm_final.mp3");
          finalBgmFailed = true;
          currentBgmMode = null;
          switchBgm("chance");
        }
      });
    } catch (error) {
      // Missing BGM files must not stop the game.
    }
  }

  function switchBgm(mode = "normal") {
    try {
      const nextMode = normalizeBgmMode(mode);
      initAudio();

      if (currentBgmMode === nextMode) {
        playBgm(nextMode);
        return;
      }

      const current = bgmForMode(currentBgmMode);
      if (current) {
        current.pause();
        current.currentTime = 0;
      }

      currentBgmMode = nextMode;
      playBgm(nextMode);
    } catch (error) {
      // BGM switching is optional.
    }
  }

  function stopBgm() {
    try {
      [normalBgm, chanceBgm, finalBgm].forEach((bgm) => {
        if (!bgm) {
          return;
        }

        bgm.pause();
        bgm.currentTime = 0;
      });
      currentBgmMode = null;
    } catch (error) {
      // Audio is optional.
    }
  }

  function tone(frequency, start, duration, options = {}) {
    if (!context) {
      return;
    }

    const now = context.currentTime;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const volume = options.volume ?? 0.42;

    oscillator.type = options.type || "square";
    oscillator.frequency.setValueAtTime(frequency, now + start);
    if (options.to) {
      oscillator.frequency.exponentialRampToValueAtTime(options.to, now + start + duration);
    }

    gain.gain.setValueAtTime(0.0001, now + start);
    gain.gain.exponentialRampToValueAtTime(volume, now + start + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + start + duration);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(now + start);
    oscillator.stop(now + start + duration + 0.025);
  }

  function playSound(type) {
    try {
      if (muted) {
        return;
      }

      resumeContext();
      if (!context) {
        return;
      }

      const patterns = {
        start: [[520, 0, 0.08], [780, 0.08, 0.1], [1040, 0.18, 0.12]],
        select: [[880, 0, 0.055]],
        reveal: [[180, 0, 0.075, { to: 95, volume: 0.55 }], [520, 0.02, 0.08, { volume: 0.25 }]],
        win: [[560, 0, 0.08], [760, 0.08, 0.08], [1020, 0.16, 0.16, { volume: 0.5 }]],
        lose: [[180, 0, 0.14, { to: 95, volume: 0.46, type: "sawtooth" }], [120, 0.15, 0.12, { volume: 0.36 }]],
        draw: [[420, 0, 0.08], [420, 0.11, 0.08, { volume: 0.34 }]],
        chance: [[520, 0, 0.06], [760, 0.07, 0.06], [1040, 0.14, 0.1], [1320, 0.25, 0.18, { volume: 0.5 }]],
        youwin: [[660, 0, 0.1], [880, 0.11, 0.1], [1320, 0.22, 0.25, { volume: 0.52 }]],
        continue: [[330, 0, 0.09], [440, 0.12, 0.09], [330, 0.24, 0.13, { volume: 0.46 }]],
        gameover: [[240, 0, 0.16, { to: 150, type: "sawtooth" }], [160, 0.18, 0.24, { to: 80, volume: 0.42, type: "sawtooth" }]],
        blackout: [[90, 0, 0.06, { to: 50, volume: 0.5 }]],
      };

      (patterns[type] || []).forEach(([frequency, start, duration, options]) => {
        tone(frequency, start, duration, options);
      });
    } catch (error) {
      // Sound effects are optional.
    }
  }

  function setMuted(value) {
    muted = Boolean(value);
    try {
      window.localStorage.setItem(storageKey, String(muted));
    } catch (error) {
      // Storage is optional.
    }

    if (muted) {
      stopBgm();
    } else {
      resumeContext();
      if (state.started && !state.ended) {
        playBgm(state.finalJanken ? "final" : state.chance ? "chance" : "normal");
      }
    }

    updateMuteButton();
  }

  function toggleMute() {
    setMuted(!muted);
  }

  function updateMuteButton() {
    if (!muteButton) {
      return;
    }

    muteButton.textContent = muted ? "SOUND OFF" : "SOUND ON";
    muteButton.setAttribute("aria-pressed", String(muted));
  }

  return {
    initAudio,
    playBgm,
    switchBgm,
    stopBgm,
    playSound,
    setMuted,
    toggleMute,
    updateMuteButton,
  };
})();

function wait(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function setButtonsEnabled(enabled) {
  choiceButtons.forEach((button) => {
    button.disabled = !enabled;
  });
}

function toggleDebugMode(force) {
  const shouldShow = typeof force === "boolean" ? force : !state.debugPanelVisible;
  state.debugPanelVisible = shouldShow;
  cabinet.classList.toggle("is-debug", shouldShow);

  if (shouldShow) {
    createDebugPanel();
  }

  const panel = document.querySelector("#debugPanel");
  if (panel) {
    panel.hidden = !shouldShow;
  }
}

function createDebugPanel() {
  if (document.querySelector("#debugPanel")) {
    return;
  }

  const panel = document.createElement("div");
  panel.id = "debugPanel";
  panel.className = "debug-panel";
  panel.setAttribute("aria-label", "Debug panel");

  const title = document.createElement("strong");
  title.textContent = "DEBUG";
  panel.append(title);

  [
    ["DRAW 4", () => debugSetDraw(4)],
    ["DRAW 9", () => debugSetDraw(9)],
    ["DRAW 14", () => debugSetDraw(14)],
    ["FORCE WARNING", debugForceWarning],
    ["FORCE CHANCE", debugForceChance],
    ["FORCE FINAL", debugForceFinal],
    ["NEXT PLAYER WIN", () => debugForceNextResult("win")],
    ["NEXT CPU WIN", () => debugForceNextResult("lose")],
    ["RESET DEBUG", debugReset],
  ].forEach(([label, handler]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = label;
    button.addEventListener("click", handler);
    panel.append(button);
  });

  document.body.append(panel);
}

function debugSetDraw(value) {
  state.draw = value;
  state.drawWarningShown = value >= DRAW_WARNING_COUNT;
  updateScore();
  showMessage(`DEBUG DRAW ${value}`);
}

function debugForceWarning() {
  state.draw = Math.max(state.draw, DRAW_WARNING_COUNT);
  state.drawWarningShown = true;
  updateScore();
  setCharacter("worried");
  showMessage(randomLine(DRAW_WARNING_LINES), "is-result is-draw player-draw is-draw-warning");
}

function debugForceChance() {
  state.draw = Math.max(state.draw, CHANCE_DRAW_COUNT);
  state.drawWarningShown = true;
  setChanceMode(true);
  updateScore();
  setCharacter("excited");
  AudioManager.switchBgm("chance");
  showMessage(randomLine(CHANCE_ENTRY_LINES), "is-result is-draw player-draw is-chance-entry");
}

function debugForceFinal() {
  state.draw = Math.max(state.draw, FINAL_DRAW_COUNT);
  state.drawWarningShown = true;
  setChanceMode(true);
  setFinalJankenMode(true);
  updateScore();
  setCharacter("excited");
  AudioManager.switchBgm("final");
  showMessage(randomLine(FINAL_JANKEN_ENTRY_LINES), "is-result is-draw player-draw is-final-entry");
}

function debugForceNextResult(result) {
  state.debugForceNextResult = result;
  showMessage(result === "win" ? "DEBUG NEXT WIN" : "DEBUG NEXT LOSE");
}

function debugReset() {
  state.debugForceNextResult = null;
  resetScore();
  resetRoundView();
  if (state.started && !state.ended) {
    AudioManager.switchBgm("normal");
    showMessage("DEBUG RESET");
    setButtonsEnabled(!state.busy);
  } else {
    showMessage("");
  }
}

function trackDebugToggleTap() {
  const now = Date.now();
  state.debugSoundTaps = state.debugSoundTaps.filter((time) => now - time < 1800);
  state.debugSoundTaps.push(now);

  if (state.debugSoundTaps.length >= 5) {
    state.debugSoundTaps = [];
    toggleDebugMode();
    return true;
  }

  return false;
}

function setSelectedButton(hand) {
  choiceButtons.forEach((button) => {
    button.classList.toggle("is-selected", button.dataset.hand === hand);
  });
}

function updateScore() {
  winCount.textContent = state.win;
  loseCount.textContent = state.lose;
  drawCount.textContent = state.draw;
}

function setChanceMode(enabled) {
  state.chance = enabled;
  cabinet.classList.toggle("is-chance", enabled);

  if (!enabled) {
    stopChanceMessages();
  }
}

function setFinalJankenMode(enabled) {
  state.finalJanken = enabled;
  cabinet.classList.toggle("is-final-janken", enabled);
}

function setStageMood(mood) {
  cabinet.classList.remove(
    "is-calling",
    "is-result",
    "is-win",
    "is-lose",
    "is-draw",
    "player-win",
    "player-lose",
    "player-draw",
    "is-double",
    "is-chance-entry",
    "is-draw-warning",
    "is-final-entry"
  );

  if (mood) {
    cabinet.classList.add(...mood.split(" "));
  }
}

function scoreMood() {
  const diff = state.win - state.lose;

  if (state.finalJanken) {
    return "final";
  }

  if (state.chance) {
    return "chance";
  }

  if (diff >= 4) {
    return "playerLeadBig";
  }

  if (diff >= 2) {
    return "playerLeadSmall";
  }

  if (diff <= -4) {
    return "cpuLeadBig";
  }

  if (diff <= -2) {
    return "cpuLeadSmall";
  }

  return "even";
}

function currentDialogue() {
  return dialogue[scoreMood()] || dialogue.even;
}

function randomLine(lines) {
  const cleanLines = lines.filter((line) => line && line.trim());

  if (!cleanLines.length) {
    return "いくよ！";
  }

  const candidates = cleanLines.length > 1 ? cleanLines.filter((line) => line !== state.lastLine) : cleanLines;
  const line = candidates[Math.floor(Math.random() * candidates.length)];
  state.lastLine = line;
  return line;
}

function lineFor(scene) {
  const set = currentDialogue();
  const lines = [...(set[scene] || dialogue.even[scene] || [])];

  if ((state.win >= 8 || state.lose >= 8) && scene === "idle") {
    lines.push(...endgameLines);
  }

  return randomLine(lines);
}

function handName(handKey) {
  return HAND_NAMES[handKey] || hands[handKey]?.label || "?";
}

function psychEventLine(event) {
  if (!event) {
    return "";
  }

  if (event.type === "predict") {
    return randomLine([
      `次は${handName(event.cpuHand)}でいくよ！`,
      `${handName(event.cpuHand)}を出すかも？`,
      `私の次の手は${handName(event.cpuHand)}！`,
    ]);
  }

  return randomLine([
    `${handName(event.requestedHand)}を出してほしいな♪`,
    `次は${handName(event.requestedHand)}で来て？`,
    `${handName(event.requestedHand)}、見たいな♪`,
  ]);
}

function maybeStartPsychEvent() {
  if (!state.started || state.busy || state.ended || state.finalJanken || state.psychEvent) {
    return false;
  }

  if (Math.random() >= PSYCH_EVENT_CHANCE) {
    return false;
  }

  const type = Math.random() < 0.5 ? "predict" : "request";
  const cpuHand = randomCpuHand();
  const requestedHand = randomCpuHand();
  state.psychEvent = { type, cpuHand, requestedHand };

  setCharacter(type === "predict" ? "smug" : "happy");
  showMessage(psychEventLine(state.psychEvent));
  return true;
}

function showNextInputPrompt() {
  if (maybeStartPsychEvent()) {
    return;
  }

  if (state.chance) {
    startChanceMessages();
  } else {
    showMessage(lineFor("idle"));
  }
}

function updateCharacterByScore() {
  setCharacter(currentDialogue().image || "normal");
}

function showMessage(text, mood) {
  message.textContent = text || "いくよ！";
  setStageMood(mood);

  if (mood === "is-calling") {
    message.style.animation = "none";
    message.offsetHeight;
    message.style.animation = "";
  }
}

function stopChanceMessages() {
  if (state.chanceMessageTimer) {
    window.clearInterval(state.chanceMessageTimer);
    state.chanceMessageTimer = null;
  }
}

async function showIntroThenReady() {
  state.busy = true;
  stopChanceMessages();
  setButtonsEnabled(false);
  resetRoundView();
  await showIllustrationScene("intro", randomLine(SCENE_INTRO_LINES), 3500, "happy");

  if (!state.started || state.ended) {
    return;
  }

  state.busy = false;
  updateCharacterByScore();
  if (maybeStartPsychEvent()) {
    setButtonsEnabled(true);
    return;
  }
  showMessage("えらべ！");
  setButtonsEnabled(true);
}

function startChanceMessages() {
  if ((!state.chance && !state.finalJanken) || state.busy || state.ended || !state.started) {
    return;
  }

  stopChanceMessages();
  if (state.finalJanken) {
    showMessage(randomLine(FINAL_JANKEN_IDLE_LINES));
  } else {
    state.chanceMessageIndex %= CHANCE_MESSAGES.length;
    showMessage(lineFor("idle"));
  }

  state.chanceMessageTimer = window.setInterval(() => {
    if ((!state.chance && !state.finalJanken) || state.busy || state.ended || !state.started) {
      stopChanceMessages();
      return;
    }

    if (state.finalJanken) {
      showMessage(randomLine(FINAL_JANKEN_IDLE_LINES));
    } else {
      state.chanceMessageIndex = (state.chanceMessageIndex + 1) % CHANCE_MESSAGES.length;
      showMessage(lineFor("idle"));
    }
  }, 2000);
}

async function showFinalJankenEntry() {
  state.busy = true;
  setButtonsEnabled(false);
  stopChanceMessages();
  setSelectedButton();

  setCharacter("excited");
  AudioManager.playSound("chance");
  AudioManager.switchBgm("final");
  showMessage("ファイナルじゃんけん！", "is-result is-draw player-draw is-final-entry");
  await wait(760);

  if (!state.started || state.ended || !state.finalJanken) {
    return;
  }

  showMessage("次に勝った方が勝ち！", "is-result is-final-entry");
  await wait(760);

  if (!state.started || state.ended || !state.finalJanken) {
    return;
  }

  setCharacter("excited");
  renderHand(playerHand, null);
  renderHand(cpuHand, null);
  setResultLabel();
  showMessage("えらべ！");
  state.busy = false;
  setButtonsEnabled(true);
}

function setResultLabel(result, bonus = 1, isFinal = false) {
  resultLabel.classList.remove("is-visible", "is-win", "is-lose", "is-draw", "is-double", "is-final");

  if (!result) {
    resultLabel.textContent = "";
    return;
  }

  const label = result.toUpperCase();
  const showDouble = !isFinal && bonus > 1 && result !== "draw";

  if (isFinal && result !== "draw") {
    resultLabel.textContent = `FINAL ${label}`;
  } else if (showDouble) {
    resultLabel.textContent = `${label} +2`;
  } else {
    resultLabel.textContent = label;
  }

  resultLabel.classList.add("is-visible", `is-${result}`);

  if (isFinal && result !== "draw") {
    resultLabel.classList.add("is-final");
  } else if (showDouble) {
    resultLabel.classList.add("is-double");
  }
}

function setCharacter(mood) {
  const characterMood = mood || "normal";
  characterFrame.dataset.mood = characterImages[characterMood] ? characterMood : "normal";
  characterImage.src = characterImages[characterMood] || characterImages.normal;
  characterImage.hidden = false;
  characterFallback.hidden = true;
}

function setSceneCharacter(mood) {
  sceneOverlay.classList.remove("has-illustration");
  sceneIllustration.hidden = true;
  sceneCharacterImage.src = characterImages[mood] || characterImages.normal;
  sceneCharacterImage.hidden = false;
  sceneCharacterFallback.hidden = true;
}

function useFallbackCharacter() {
  characterFrame.dataset.mood = "fallback";
  characterImage.hidden = true;
  characterFallback.hidden = false;
}

function useFallbackSceneCharacter() {
  sceneCharacterImage.hidden = true;
  sceneCharacterFallback.hidden = false;
}

function fallbackSceneIllustration() {
  const mood = sceneOverlay.dataset.fallbackMood || "normal";
  sceneOverlay.classList.remove("has-illustration");
  sceneIllustration.hidden = true;
  setSceneCharacter(mood);
}

function setSceneIllustration(sceneType, fallbackMood = "normal") {
  const src = sceneImages[sceneType];
  sceneOverlay.dataset.fallbackMood = fallbackMood;

  if (!src) {
    fallbackSceneIllustration();
    return;
  }

  sceneOverlay.classList.add("has-illustration");
  sceneIllustration.src = src;
  sceneIllustration.hidden = false;
  sceneCharacterImage.hidden = true;
  sceneCharacterFallback.hidden = true;
}

async function showCharacterScene(mood, text, duration = 2200) {
  stopChanceMessages();
  setButtonsEnabled(false);
  setSceneCharacter(mood);
  sceneMessage.textContent = text || "またね！";
  sceneOverlay.hidden = false;
  cabinet.classList.add("is-scene");

  await wait(duration);

  sceneOverlay.hidden = true;
  cabinet.classList.remove("is-scene");
}

async function showIllustrationScene(sceneType, text, duration = 3500, fallbackMood = "normal") {
  stopChanceMessages();
  setButtonsEnabled(false);
  setSceneIllustration(sceneType, fallbackMood);
  sceneMessage.textContent = text || "";
  sceneOverlay.hidden = false;
  cabinet.classList.add("is-scene", `scene-${sceneType}`);

  await wait(duration);

  sceneOverlay.hidden = true;
  sceneOverlay.classList.remove("has-illustration");
  sceneIllustration.hidden = true;
  cabinet.classList.remove("is-scene", `scene-${sceneType}`);
}

function renderHand(target, handKey) {
  const hand = hands[handKey];
  target.classList.remove("has-hand-image", "is-hand-pop");
  target.replaceChildren();

  if (!hand) {
    target.textContent = "?";
    return;
  }

  const image = document.createElement("img");
  image.src = hand.image;
  image.alt = hand.label;
  image.className = "hand-result-image";
  image.addEventListener(
    "error",
    () => {
      target.classList.remove("has-hand-image", "is-hand-pop");
      target.textContent = hand.symbol;
    },
    { once: true }
  );
  image.addEventListener(
    "animationend",
    () => {
      target.classList.remove("is-hand-pop");
    },
    { once: true }
  );
  target.classList.add("has-hand-image");
  target.append(image);
  target.offsetHeight;
  target.classList.add("is-hand-pop");
}

function resetRoundView() {
  renderHand(playerHand, null);
  renderHand(cpuHand, null);
  setSelectedButton();
  setResultLabel();
  setStageMood();
  updateCharacterByScore();
}

function randomCpuHand() {
  const keys = Object.keys(hands);
  return keys[Math.floor(Math.random() * keys.length)];
}

function cpuHandForForcedResult(player, result) {
  if (result === "win") {
    return hands[player].beats;
  }

  if (result === "lose") {
    return Object.keys(hands).find((key) => hands[key].beats === player) || randomCpuHand();
  }

  return randomCpuHand();
}

function chooseCpuHand(player) {
  if (state.debugForceNextResult) {
    const forcedResult = state.debugForceNextResult;
    state.debugForceNextResult = null;
    state.psychEvent = null;
    return cpuHandForForcedResult(player, forcedResult);
  }

  if (state.psychEvent) {
    const cpuHand = state.psychEvent.cpuHand;
    state.psychEvent = null;
    return cpuHand;
  }

  return randomCpuHand();
}

function judge(player, cpu) {
  if (player === cpu) {
    return "draw";
  }

  return hands[player].beats === cpu ? "win" : "lose";
}

function cpuMoodForResult(result) {
  if (result === "win") {
    return "lose";
  }

  if (result === "lose") {
    return "win";
  }

  return "draw";
}

function resultText(result) {
  if (result === "win") {
    return lineFor("cpuLose");
  }

  if (result === "lose") {
    return lineFor("cpuWin");
  }

  return lineFor("draw");
}

function stopCountdown() {
  if (state.countdownTimer) {
    window.clearInterval(state.countdownTimer);
    state.countdownTimer = null;
  }
}

function cancelEndFlow() {
  state.flowId += 1;
  stopCountdown();
  stopChanceMessages();
}

function resetScore() {
  state.win = 0;
  state.lose = 0;
  state.draw = 0;
  state.drawWarningShown = false;
  state.psychEvent = null;
  state.nextCallMode = "normal";
  state.lastLine = "";
  setFinalJankenMode(false);
  setChanceMode(false);
  updateScore();
}

function showTitle() {
  stopCountdown();
  stopChanceMessages();
  AudioManager.stopBgm();
  state.started = false;
  state.busy = false;
  state.ended = false;
  cabinet.classList.remove("is-playing", "is-ended", "end-win", "end-lose");
  endOverlay.hidden = true;
  resetScore();
  resetRoundView();
  showMessage("");
  setButtonsEnabled(false);
}

async function returnToTitleWithBlackout() {
  const flowId = ++state.flowId;
  stopCountdown();
  stopChanceMessages();
  setButtonsEnabled(false);
  sceneOverlay.hidden = true;
  cabinet.classList.remove("is-scene");
  AudioManager.playSound("blackout");
  cabinet.classList.add("is-blackout");

  await wait(750);

  if (flowId !== state.flowId) {
    return;
  }

  showTitle();
  await wait(90);

  if (flowId === state.flowId) {
    cabinet.classList.remove("is-blackout");
  }
}

async function showGameOverThenTitle() {
  const flowId = ++state.flowId;
  stopCountdown();
  stopChanceMessages();
  AudioManager.playSound("gameover");
  finalTitle.textContent = "GAME OVER";
  finalMessage.textContent = "また挑戦してね";
  retryButton.hidden = true;
  countdown.parentElement.hidden = true;
  cabinet.classList.remove("end-win");
  cabinet.classList.add("end-lose");
  setCharacter("win");
  showMessage(randomLine(dialogue.cpuLeadBig.cpuWin), "is-result is-win");

  await wait(2400);

  if (flowId !== state.flowId) {
    return;
  }

  await showIllustrationScene("playerLose", randomLine(SCENE_PLAYER_LOSE_LINES), 3600, "happy");

  if (flowId === state.flowId) {
    returnToTitleWithBlackout();
  }
}

function startContinueCountdown() {
  let remaining = CONTINUE_SECONDS;
  countdown.textContent = remaining;

  stopCountdown();
  state.countdownTimer = window.setInterval(() => {
    remaining -= 1;
    countdown.textContent = remaining;

    if (remaining <= 0) {
      showGameOverThenTitle();
    }
  }, 1000);
}

async function endGame(result) {
  cancelEndFlow();
  const flowId = state.flowId;
  state.ended = true;
  state.busy = false;
  setSelectedButton();
  setButtonsEnabled(false);
  cabinet.classList.add("is-ended", `end-${result}`);
  retryButton.hidden = result === "win";
  countdown.parentElement.hidden = result === "win";
  finalTitle.textContent = result === "win" ? "YOU WIN!" : "CONTINUE?";
  finalMessage.textContent = result === "win" ? "完全勝利！ また遊んでね！" : "リベンジする？";
  retryButton.textContent = "リベンジする";
  endOverlay.hidden = false;

  if (result === "win") {
    AudioManager.playSound("youwin");
    setCharacter("panic");
    showMessage(randomLine(dialogue.playerLeadBig.cpuLose), "is-result is-lose");
    await wait(2400);

    if (flowId !== state.flowId) {
      return;
    }

    await showIllustrationScene("playerWin", randomLine(SCENE_PLAYER_WIN_LINES), 3600, "worried");

    if (flowId === state.flowId) {
      returnToTitleWithBlackout();
    }
    return;
  }

  setCharacter("smug");
  AudioManager.playSound("continue");
  showMessage(randomLine(dialogue.cpuLeadBig.cpuWin), "is-result is-win");
  startContinueCountdown();
}

function restartMatch() {
  AudioManager.initAudio();
  AudioManager.switchBgm("normal");
  AudioManager.playSound("start");
  cancelEndFlow();
  endOverlay.hidden = true;
  state.started = true;
  state.ended = false;
  cabinet.classList.remove("is-ended", "end-win", "end-lose");
  resetScore();
  showIntroThenReady();
}

function addRoundScore(result) {
  const scoreChange = {
    bonus: 1,
    warningStarted: false,
    chanceStarted: false,
    finalStarted: false,
    finalResolved: false,
    finalResult: null,
  };

  if (result === "draw") {
    state.draw += 1;

    if (state.draw >= DRAW_WARNING_COUNT && !state.drawWarningShown) {
      state.drawWarningShown = true;
      scoreChange.warningStarted = true;
    }

    if (state.draw >= CHANCE_DRAW_COUNT && !state.chance) {
      setChanceMode(true);
      scoreChange.chanceStarted = true;
    }

    if (state.draw >= FINAL_DRAW_COUNT && !state.finalJanken) {
      setFinalJankenMode(true);
      if (!state.chance) {
        setChanceMode(true);
      }
      scoreChange.finalStarted = true;
    }

    return scoreChange;
  }

  if (state.finalJanken) {
    scoreChange.finalResolved = true;
    scoreChange.finalResult = result;
    if (result === "win") {
      state.win = MATCH_POINT;
    } else if (result === "lose") {
      state.lose = MATCH_POINT;
    }
    return scoreChange;
  }

  const bonus = state.chance ? 2 : 1;
  scoreChange.bonus = bonus;
  state[result] = Math.min(MATCH_POINT, state[result] + bonus);
  return scoreChange;
}

async function startGame() {
  if (state.started || state.busy) {
    return;
  }

  AudioManager.initAudio();
  AudioManager.switchBgm("normal");
  AudioManager.playSound("start");
  state.started = true;
  state.ended = false;
  cabinet.classList.add("is-playing");
  showIntroThenReady();
}

async function playRound(player) {
  if (!state.started || state.busy || state.ended) {
    return;
  }

  state.busy = true;
  stopChanceMessages();
  resetRoundView();
  AudioManager.playSound("select");
  setSelectedButton(player);
  setButtonsEnabled(false);
  cabinet.classList.add("is-shaking");

  const callMode = state.nextCallMode;
  const cpu = chooseCpuHand(player);
  const result = judge(player, cpu);
  const scoreChange = addRoundScore(result);

  const calls = callMode === "draw" ? ["あいこで"] : ["ジャン", "ケン"];
  const revealCall = callMode === "draw" ? "しょ！" : "ポン！";

  for (const call of calls) {
    showMessage(call, "is-calling");
    await wait(420);
  }

  showMessage(revealCall, "is-calling");
  renderHand(playerHand, player);
  renderHand(cpuHand, cpu);
  AudioManager.playSound("reveal");
  await wait(260);

  cabinet.classList.remove("is-shaking");
  updateScore();
  const cpuMood = cpuMoodForResult(result);
  if (scoreChange.bonus > 1) {
    setCharacter("excited");
  } else if (result === "win") {
    setCharacter(state.win - state.lose >= 4 ? "panic" : "worried");
  } else if (result === "lose") {
    setCharacter(state.lose - state.win >= 4 ? "smug" : "happy");
  } else {
    setCharacter(state.chance ? "excited" : "normal");
  }
  setResultLabel(result, scoreChange.bonus, scoreChange.finalResolved);

  if (scoreChange.finalResolved) {
    const finalLine = result === "win"
      ? randomLine(dialogue.final.cpuLose)
      : randomLine(dialogue.final.cpuWin);
    AudioManager.playSound(result === "win" ? "win" : "lose");
    showMessage(finalLine, `is-result is-${cpuMood} player-${result} is-final-entry`);
  } else if (scoreChange.finalStarted) {
    state.nextCallMode = "draw";
    await showFinalJankenEntry();
    return;
  } else if (scoreChange.chanceStarted) {
    state.chanceMessageIndex = 0;
    setCharacter("excited");
    AudioManager.playSound("chance");
    AudioManager.switchBgm("chance");
    showMessage(randomLine(CHANCE_ENTRY_LINES), "is-result is-draw player-draw is-chance-entry");
  } else if (scoreChange.warningStarted) {
    setCharacter("worried");
    AudioManager.playSound("draw");
    showMessage(randomLine(DRAW_WARNING_LINES), "is-result is-draw player-draw is-draw-warning");
  } else if (scoreChange.bonus > 1 && result === "win") {
    AudioManager.playSound("win");
    showMessage(randomLine(dialogue.chance.cpuLose), "is-result is-lose player-win is-double");
  } else if (scoreChange.bonus > 1 && result === "lose") {
    AudioManager.playSound("lose");
    showMessage(randomLine(dialogue.chance.cpuWin), "is-result is-win player-lose is-double");
  } else if (state.finalJanken && result === "draw") {
    AudioManager.playSound("draw");
    showMessage(randomLine(FINAL_JANKEN_IDLE_LINES), "is-result is-draw player-draw is-final-entry");
  } else if (state.chance && result === "draw") {
    AudioManager.playSound("draw");
    showMessage(randomLine(dialogue.chance.draw), "is-result is-draw player-draw");
  } else {
    AudioManager.playSound(result);
    showMessage(resultText(result), `is-result is-${cpuMood} player-${result}`);
  }

  state.nextCallMode = result === "draw" ? "draw" : "normal";

  const roundEndsMatch = scoreChange.finalResolved || state.win >= MATCH_POINT || state.lose >= MATCH_POINT;
  const resultPause = roundEndsMatch
    ? 2200
    : scoreChange.chanceStarted
      ? 2200
      : scoreChange.warningStarted
        ? 1900
        : 1600;

  await wait(resultPause);

  if (roundEndsMatch) {
    endGame(scoreChange.finalResolved ? scoreChange.finalResult : state.win >= MATCH_POINT ? "win" : "lose");
    return;
  }

  state.busy = false;
  setSelectedButton();
  setButtonsEnabled(true);
  updateCharacterByScore();
  showNextInputPrompt();
}

characterImage.addEventListener("error", useFallbackCharacter);
sceneCharacterImage.addEventListener("error", useFallbackSceneCharacter);
sceneIllustration.addEventListener("error", fallbackSceneIllustration);
startButton.addEventListener("click", startGame);
retryButton.addEventListener("click", restartMatch);
muteButton.addEventListener("click", () => {
  AudioManager.initAudio();
  if (trackDebugToggleTap()) {
    AudioManager.playSound("select");
    return;
  }

  AudioManager.toggleMute();
  AudioManager.playSound("select");
});

choiceButtons.forEach((button) => {
  button.addEventListener("click", () => {
    playRound(button.dataset.hand);
  });
});

document.querySelectorAll(".choice-hand-image").forEach((image) => {
  image.addEventListener(
    "error",
    () => {
      const button = image.closest(".choice");
      const hand = hands[button?.dataset.hand];
      if (hand) {
        image.replaceWith(document.createTextNode(hand.symbol));
      }
    },
    { once: true }
  );
});

useFallbackCharacter();
AudioManager.initAudio();
AudioManager.updateMuteButton();
if (DEBUG_MODE) {
  toggleDebugMode(true);
}
setButtonsEnabled(false);
updateScore();
