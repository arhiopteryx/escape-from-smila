(() => {
  "use strict";
  const DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  const canvas = document.getElementById("world"),
    mini = document.getElementById("minimap"),
    W = 1280,
    H = 800,
    MINI_W = 240,
    MINI_H = 150;
  canvas.width = W * DPR;
  canvas.height = H * DPR;
  mini.width = MINI_W * DPR;
  mini.height = MINI_H * DPR;
  canvas.tabIndex = 0;
  const focusGame = () =>
    setTimeout(() => canvas.focus({ preventScroll: true }), 40);
  let ctx = canvas.getContext("2d");
  const mctx = mini.getContext("2d");
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  mctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  const world = { w: 3600, h: 2800 };
  const DELIVERY_GOAL = 7,
    DELIVERY_START_TIME = 55,
    DELIVERY_TIME_BONUS = 15,
    DELIVERY_TIME_CAP = 85;
  const roadW = 188,
    roadsX = [420, 1080, 1740, 2400, 3060],
    roadsY = [360, 1000, 1640, 2280];
  const player = {
    x: 260,
    y: 380,
    vx: 0,
    vy: 0,
    dir: 0,
    r: 24,
    speed: 0,
    boost: 0,
    boostCd: 0,
    bump: 0,
  };
  const stopPool = [
    {
      x: 420,
      y: 360,
      brand: "ukrposhta",
      name: "УКРПОШТА",
      sub: "Листоноша легенд",
      color: "#efb72e",
    },
    {
      x: 1740,
      y: 1000,
      brand: "ukrposhta",
      name: "УКРПОШТА",
      sub: "Відділення на розі",
      color: "#efb72e",
    },
    {
      x: 3060,
      y: 1640,
      brand: "ukrposhta",
      name: "УКРПОШТА",
      sub: "Пошта міста",
      color: "#efb72e",
    },
    {
      x: 1080,
      y: 2280,
      brand: "ukrposhta",
      name: "УКРПОШТА",
      sub: "Посилка чекає",
      color: "#efb72e",
    },
    {
      x: 1080,
      y: 360,
      brand: "nova",
      name: "НОВА ПОШТА",
      sub: "Швидше за голуба",
      color: "#e32636",
    },
    {
      x: 2400,
      y: 1000,
      brand: "nova",
      name: "НОВА ПОШТА",
      sub: "Експрес-маршрут",
      color: "#e32636",
    },
    {
      x: 420,
      y: 1640,
      brand: "nova",
      name: "НОВА ПОШТА",
      sub: "Нова адреса",
      color: "#e32636",
    },
    {
      x: 3060,
      y: 2280,
      brand: "nova",
      name: "НОВА ПОШТА",
      sub: "Доставляємо легенди",
      color: "#e32636",
    },
    {
      x: 2400,
      y: 360,
      brand: "meest",
      name: "MEEST ПОШТА",
      sub: "Посилка крізь епохи",
      color: "#2873b9",
    },
    {
      x: 3060,
      y: 1000,
      brand: "meest",
      name: "MEEST ПОШТА",
      sub: "Світ ближче",
      color: "#2873b9",
    },
    {
      x: 1080,
      y: 1640,
      brand: "meest",
      name: "MEEST ПОШТА",
      sub: "Твоя наступна ціль",
      color: "#2873b9",
    },
    {
      x: 1740,
      y: 2280,
      brand: "meest",
      name: "MEEST ПОШТА",
      sub: "Швидкий заїзд",
      color: "#2873b9",
    },
  ];
  const logos = {
      ukrposhta: new Image(),
      nova: new Image(),
      meest: new Image(),
    },
    ermolinoLogo = new Image();
  logos.ukrposhta.src = "assets/ukrposhta.png";
  logos.nova.src = "assets/nova-poshta.png";
  logos.meest.src = "assets/meest.png";
  ermolinoLogo.src = "assets/ermolino-logo.png";
  let deliveries = [],
    lastStop = -1,
    courierToCafe = false;
  const cafeDestination = { x: 3060, y: 360 },
    chaseDestination = { x: 420, y: 360 };
  let chaseMarkerActive = false,
    chaseVan = { x: 0, y: 0, vx: 0, vy: 0 },
    churchEventUsed = false,
    azotEventUsed = false;
  function nextDelivery() {
    let candidates = stopPool
      .map((s, i) => ({ s, i }))
      .filter(({ i }) => i !== lastStop);
    const pick = candidates[Math.floor(Math.random() * candidates.length)];
    lastStop = pick.i;
    deliveries = [{ ...pick.s, done: false }];
    return deliveries[0];
  }
  function nearestGrid(value, list) {
    return list.reduce(
      (best, v) => (Math.abs(v - value) < Math.abs(best - value) ? v : best),
      list[0],
    );
  }
  function cityRoute(from, to) {
    if (!to) return [];
    const sx = nearestGrid(from.x, roadsX),
      sy = nearestGrid(from.y, roadsY),
      tx = nearestGrid(to.x, roadsX),
      ty = nearestGrid(to.y, roadsY),
      entry =
        Math.abs(from.x - sx) <= Math.abs(from.y - sy)
          ? { x: sx, y: from.y }
          : { x: from.x, y: sy },
      exit =
        Math.abs(to.x - tx) <= Math.abs(to.y - ty)
          ? { x: tx, y: to.y }
          : { x: to.x, y: ty },
      points = [{ x: from.x, y: from.y }, entry, { x: sx, y: sy }];
    const xi = roadsX.indexOf(sx),
      xt = roadsX.indexOf(tx),
      yi = roadsY.indexOf(sy),
      yt = roadsY.indexOf(ty),
      stepX = Math.sign(xt - xi),
      stepY = Math.sign(yt - yi);
    for (let i = xi + stepX; i !== xt + stepX && stepX; i += stepX)
      points.push({ x: roadsX[i], y: sy });
    for (let i = yi + stepY; i !== yt + stepY && stepY; i += stepY)
      points.push({ x: tx, y: roadsY[i] });
    points.push({ x: tx, y: ty }, exit, { x: to.x, y: to.y });
    return points.filter(
      (q, i, a) => !i || Math.hypot(q.x - a[i - 1].x, q.y - a[i - 1].y) > 1,
    );
  }
  function shuffled(items) {
    const result = [...items];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
  function routeDistance(points) {
    let d = 0;
    for (let i = 1; i < points.length; i++)
      d += Math.hypot(
        points[i].x - points[i - 1].x,
        points[i].y - points[i - 1].y,
      );
    return d;
  }
  function routeHeading(points) {
    if (points.length < 2) return "МАРШРУТ";
    const dx = points[1].x - points[0].x,
      dy = points[1].y - points[0].y;
    return Math.abs(dx) > Math.abs(dy)
      ? dx > 0
        ? "ПОВЕРНИ ПРАВОРУЧ"
        : "ПОВЕРНИ ЛІВОРУЧ"
      : dy > 0
        ? "ЇДЬ УНИЗ"
        : "ЇДЬ УГОРУ";
  }
  const campaignChapterNames = [
    "",
    "Кур’єрський рейд",
    "VR-кафе",
    "Нічна погоня",
    "Санвузол",
    "Кукурудзяне поле",
    "VR-завод",
    "Лісова втеча",
    "Pfand-квест",
  ];
  let campaignChapter = 0;
  try {
    const saved = Number(localStorage.getItem("escapeSmila.chapter"));
    if (saved) campaignChapter = Math.max(1, Math.min(8, saved));
  } catch {}
  function saveCampaignChapter(chapter) {
    campaignChapter = clamp(chapter, 1, 8);
    try {
      localStorage.setItem("escapeSmila.chapter", String(campaignChapter));
    } catch {}
  }
  function continueCampaign() {
    switch (campaignChapter) {
      case 2:
        return enterCafe();
      case 3:
        return startLevel3();
      case 4:
        return startLevel4();
      case 5:
        return startCornfieldLevel();
      case 6:
        return showVrCutscene();
      case 7:
        return startForestLevel();
      case 8:
        return showGermanyTransition();
      default:
        return start();
    }
  }
  function setupContinueButton() {
    const button = document.getElementById("continueCampaignBtn");
    if (button) {
      button.hidden = !campaignChapter;
      if (campaignChapter)
        button.textContent =
          "ПРОДОВЖИТИ · " + campaignChapterNames[campaignChapter];
    }
  }
  const keys = new Set(),
    gamepadKeys = new Set();
  let gamepadMoveX = 0,
    gamepadMoveY = 0,
    padSpaceWas = false,
    padInteractWas = false,
    padDashWas = false;
  function keyDown(code) {
    return keys.has(code) || gamepadKeys.has(code);
  }
  function movementAxes() {
    let x =
        (keyDown("KeyD") || keyDown("ArrowRight") ? 1 : 0) -
        (keyDown("KeyA") || keyDown("ArrowLeft") ? 1 : 0),
      y =
        (keyDown("KeyS") || keyDown("ArrowDown") ? 1 : 0) -
        (keyDown("KeyW") || keyDown("ArrowUp") ? 1 : 0);
    x = clamp(x + gamepadMoveX, -1, 1);
    y = clamp(y + gamepadMoveY, -1, 1);
    const m = Math.hypot(x, y);
    if (m > 1) {
      x /= m;
      y /= m;
    }
    return { x, y };
  }
  let running = false,
    paused = false,
    won = false,
    time = DELIVERY_START_TIME,
    score = 0,
    delivered = 0,
    streak = 0,
    bestStreak = 0,
    last = performance.now(),
    toastTimer = 0,
    toastToken = 0,
    hintTimer = 0,
    soundOn = true,
    audio = null,
    gameEnded = false,
    stage = 1,
    interactPressed = false,
    boostPressed = false;
  const cafeMenu = [
    { id: "syrnyky", name: "Сирники", icon: "●", x: 140, c: "#d8a942" },
    { id: "pizza", name: "Квадратна піца", icon: "▦", x: 390, c: "#cf654f" },
    { id: "pelmeni", name: "Пельмені Єрмоліно", x: 640, c: "#8c9b72" },
    {
      id: "condensed",
      name: "Куп’янська згущонка",
      icon: "🥫",
      x: 890,
      c: "#6b91c4",
    },
    {
      id: "sandwich",
      name: "Бутерброд зі свининою",
      icon: "🥪",
      x: 1140,
      c: "#a67b55",
    },
  ];
  const cafeTables = [
    { x: 280, y: 280 },
    { x: 640, y: 280 },
    { x: 1000, y: 280 },
    { x: 280, y: 490 },
    { x: 640, y: 490 },
    { x: 1000, y: 490 },
  ];
  let cafeOrders = [],
    cafeServed = 0,
    cafeOrdersCreated = 0,
    heldDish = null,
    cafeActionCooldown = 0;
  let seed = 83617;
  function rand() {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  }
  const buildings = [],
    trees = [],
    cars = [],
    puddles = [],
    pigeons = [],
    pedestrians = [];
  function nearRoad(x, y) {
    return (
      roadsX.some((a) => Math.abs(x - a) < roadW / 2 + 115) ||
      roadsY.some((a) => Math.abs(y - a) < roadW / 2 + 115)
    );
  }
  for (let x = 100; x < world.w - 120; x += 110)
    for (let y = 100; y < world.h - 100; y += 100) {
      let px = x + (rand() - 0.5) * 44,
        py = y + (rand() - 0.5) * 40;
      if (!nearRoad(px, py) && rand() > 0.23) {
        let bw = 55 + rand() * 46,
          bh = 48 + rand() * 45;
        buildings.push({
          x: px,
          y: py,
          w: bw,
          h: bh,
          c: ["#d6a66c", "#c8bd9c", "#b7c4bb", "#d78970", "#8eaaa3", "#ddc48b"][
            Math.floor(rand() * 6)
          ],
          roof: ["#765f55", "#596b68", "#94725b", "#6a727c"][
            Math.floor(rand() * 4)
          ],
          kind: rand(),
        });
      } else if (!nearRoad(px, py) && rand() > 0.5)
        trees.push({ x: px, y: py, r: 13 + rand() * 10 });
    }
  for (let i = 0; i < 40; i++) {
    let rx = roadsX[Math.floor(rand() * roadsX.length)],
      ry = roadsY[Math.floor(rand() * roadsY.length)];
    let horizontal = rand() > 0.5;
    cars.push({
      x: horizontal ? rand() * world.w : rx + (rand() - 0.5) * 100,
      y: horizontal ? ry + (rand() - 0.5) * 100 : rand() * world.h,
      horizontal,
      dir: rand() > 0.5 ? 1 : -1,
      speed: 68 + rand() * 54,
      color: ["#d9d4bf", "#729197", "#bd755a", "#394954", "#e0b546"][
        Math.floor(rand() * 5)
      ],
      phase: rand() * 6,
    });
  }
  for (let i = 0; i < 30; i++)
    pigeons.push({
      x: 150 + rand() * (world.w - 300),
      y: 130 + rand() * (world.h - 260),
      phase: rand() * 10,
    });
  for (let i = 0; i < 88; i++) {
    const horizontal = rand() > 0.5,
      road = horizontal
        ? roadsY[Math.floor(rand() * roadsY.length)]
        : roadsX[Math.floor(rand() * roadsX.length)];
    pedestrians.push({
      x: horizontal
        ? rand() * world.w
        : road + (rand() > 0.5 ? 1 : -1) * (roadW / 2 + 26),
      y: horizontal
        ? road + (rand() > 0.5 ? 1 : -1) * (roadW / 2 + 26)
        : rand() * world.h,
      axis: horizontal ? "h" : "v",
      dir: rand() > 0.5 ? 1 : -1,
      speed: 22 + rand() * 35,
      color: ["#d98261", "#e4c66b", "#77a6a1", "#b9b7d1", "#e1d2bc"][
        Math.floor(rand() * 5)
      ],
      stun: 0,
      phase: rand() * 9,
    });
  }
  for (let i = 0; i < 24; i++)
    puddles.push({
      x: 140 + rand() * (world.w - 280),
      y: 140 + rand() * (world.h - 280),
      rx: 13 + rand() * 20,
      ry: 8 + rand() * 12,
    });
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  function rounded(c, x, y, w, h, r) {
    c.beginPath();
    c.roundRect(x, y, w, h, r);
    c.fill();
  }
  function audioStart() {
    if (!soundOn) return;
    try {
      audio = audio || new (window.AudioContext || window.webkitAudioContext)();
      if (audio.state === "suspended") audio.resume();
    } catch {}
  }
  function tone(freq, dur = 0.12, type = "sine", vol = 0.04, slide = 0) {
    if (!audio || !soundOn) return;
    const o = audio.createOscillator(),
      g = audio.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, audio.currentTime);
    if (slide)
      o.frequency.exponentialRampToValueAtTime(
        Math.max(35, freq + slide),
        audio.currentTime + dur,
      );
    g.gain.setValueAtTime(vol, audio.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + dur);
    o.connect(g);
    g.connect(audio.destination);
    o.start();
    o.stop(audio.currentTime + dur);
  }
  function chime() {
    [660, 880, 1100].forEach((n, i) =>
      setTimeout(() => tone(n, 0.25, "triangle", 0.065, 180), i * 90),
    );
  }
  function setHint(html) {
    const el = document.querySelector(".hint");
    el.innerHTML = html;
    el.classList.remove("hint-fade");
    clearTimeout(hintTimer);
    hintTimer = setTimeout(() => el.classList.add("hint-fade"), 4200);
  }
  function showToast(text) {
    const el = document.getElementById("toast");
    el.textContent = text;
    el.classList.add("show");
    toastTimer = 2.15;
    const token = ++toastToken;
    setTimeout(() => {
      if (token === toastToken) {
        el.classList.remove("show");
        toastTimer = 0;
      }
    }, 2150);
  }
  function start() {
    saveCampaignChapter(1);
    focusGame();
    keys.clear();
    boostPressed = false;
    interactPressed = false;
    churchEventUsed = false;
    azotEventUsed = false;
    player.x = 260;
    player.y = 380;
    player.vx = 0;
    player.vy = 0;
    player.dir = 0;
    player.boost = 0;
    player.boostCd = 0;
    setHint(document.querySelector(".hint").innerHTML);
    stage = 1;
    courierToCafe = false;
    delivered = 0;
    streak = 0;
    score = 0;
    time = DELIVERY_START_TIME;
    lastStop = -1;
    nextDelivery();
    document.getElementById("delivered").textContent =
      `0 / ${DELIVERY_GOAL}`;
    document.getElementById("timer").textContent = formatTime(time);
    document.getElementById("intro").classList.add("hidden");
    running = true;
    paused = false;
    gameEnded = false;
    audioStart();
    last = performance.now();
    showToast("WASD / СТРІЛКИ — РУХ · SPACE — РИВОК");
    scheduleLoop();
  }
  let trainingPhase = "brush_pickup",
    toothbrush = { x: 210, y: 570 },
    toiletStalls = [],
    toiletGuests = [],
    toiletGuestTimer = 0,
    toiletGuestVisits = 0,
    trainingBrush = false,
    brushProgress = 0,
    cleanElapsed = 0,
    trainingDoor = { x: 1150, y: 150 },
    guestTimer = 0,
    fieldEnemies = [],
    fieldShots = [],
    fieldLives = 6,
    shotCooldown = 0,
    fieldProgress = 0,
    fieldTarget = 4200,
    fieldAimX = 0,
    fieldAimY = -1,
    fieldCar = null,
    fieldSway = 0,
    fieldInvuln = 0,
    fieldTracks = [],
    fieldDecoys = [],
    fieldTrackX = 0,
    fieldTrackY = 0,
    fieldSpawnTimer = 0.6,
    fieldBackdrop = null;
  function startLevel4() {
    saveCampaignChapter(4);
    focusGame();
    document.getElementById("toast").classList.remove("show");
    toastTimer = 0;
    stage = 5;
    document.getElementById("game").classList.remove("germany-mode");
    document.getElementById("game").classList.add("training-mode");
    gameEnded = false;
    running = true;
    paused = false;
    trainingPhase = "brush_pickup";
    toothbrush = { x: 250, y: 640 };
    toiletStalls = [
      { x: 320, y: 325, progress: 0, occupied: false, mess: true },
      { x: 640, y: 325, progress: 0, occupied: false, mess: true },
      { x: 960, y: 325, progress: 0, occupied: false, mess: true },
    ];
    toiletGuests = [];
    toiletGuestTimer = 1.1;
    toiletGuestVisits = 0;
    trainingBrush = false;
    brushProgress = 0;
    cleanElapsed = 0;
    trainingDoor = { x: 1150, y: 150 };
    fieldEnemies = [];
    fieldShots = [];
    fieldLives = 6;
    shotCooldown = 0;
    fieldProgress = 0;
    fieldCar = null;
    player.x = 165;
    player.y = 690;
    player.vx = 0;
    player.vy = 0;
    player.dir = -Math.PI / 2;
    player.boost = 0;
    player.boostCd = 0;
    keys.clear();
    boostPressed = false;
    interactPressed = false;
    document.getElementById("game").classList.remove("cafe-mode");
    document.querySelector(".mapbox").style.display = "none";
    document.querySelector(".speed").style.display = "none";
    setHint("");
    document.getElementById("delivered").parentElement.firstChild.textContent =
      "🧽 КАБІНКИ ";
    document.getElementById("delivered").textContent = "0 / 3";
    document.getElementById("timer").textContent = "04A";
    document.getElementById("objectiveTitle").textContent =
      "СПОЧАТКУ — ЧИСТИТЬ ЗУБИ";
    document.getElementById("objectiveText").textContent =
      "Візьми щітку біля раковини. Потім відчисти три кабінки.";
    document.getElementById("intro").classList.add("hidden");
    document.getElementById("pause").classList.remove("show");
    audioStart();
    last = performance.now();
    scheduleLoop();
  }
  function startCornfieldRun() {
    saveCampaignChapter(5);
    document.getElementById("toast").classList.remove("show");
    toastTimer = 0;
    stage = 9;
    document.getElementById("game").classList.add("training-mode");
    document.getElementById("objectiveTitle").textContent =
      "04B · КУКУРУДЗЯНЕ ПОЛЕ";
    trainingPhase = "field";
    guestTimer = 0.65;
    fieldInvuln = 0;
    fieldProgress = 0;
    fieldTarget = 4200;
    fieldAimX = 0;
    fieldAimY = -1;
    fieldSway = 0;
    fieldTracks = [];
    fieldDecoys = [];
    fieldTrackX = 640;
    fieldTrackY = 0;
    fieldSpawnTimer = 0.6;
    fieldCar = { x: 640, y: -fieldTarget, phase: 0, ready: false };
    player.x = 640;
    player.y = 0;
    player.vx = 0;
    player.vy = 0;
    player.dir = -Math.PI / 2;
    fieldEnemies = [];
    fieldShots = [];
    fieldLives = 6;
    shotCooldown = 0;
    document.getElementById("objectiveTitle").textContent = "ПРОРВИСЯ ДО MAZDA";
    document.getElementById("objectiveText").textContent =
      "Біжи крізь кукурудзу. Свіжі сліди показують маршрути; сирником відверни погоню в інший прохід.";
    document.getElementById("delivered").parentElement.firstChild.textContent =
      "🚙 ДО ВИЇЗДУ ";
    document.getElementById("delivered").textContent = "0%";
    document.getElementById("timer").textContent = "ПОЛЕ";
    setHint("");
    buildCornfieldBackdrop();
    last = performance.now();
  }
  function startCornfieldLevel() {
    saveCampaignChapter(5);
    focusGame();
    gameEnded = false;
    running = true;
    paused = false;
    document.getElementById("intro").classList.add("hidden");
    document.getElementById("pause").classList.remove("show");
    document
      .getElementById("game")
      .classList.remove("arcade-mode", "cafe-mode");
    document.querySelector(".mapbox").style.display = "none";
    document.querySelector(".speed").style.display = "none";
    startCornfieldRun();
    last = performance.now();
    audioStart();
    scheduleLoop();
  }
  function drawEscapeTransition(t) {
    ctx.clearRect(0, 0, W, H);
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#344d42");
    g.addColorStop(0.55, "#566344");
    g.addColorStop(1, "#1c2a22");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    for (let i = 0; i < 9; i++) {
      const x = i * 160 + Math.sin(t * 2 + i) * 12;
      ctx.fillStyle = "#456343";
      ctx.beginPath();
      ctx.ellipse(
        x,
        270 + Math.sin(t * 2.7 + i) * 12,
        66,
        192,
        0,
        0,
        Math.PI * 2,
      );
      ctx.fill();
      ctx.strokeStyle = "#a9c468";
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(x, 90);
      ctx.lineTo(x + Math.sin(t + i) * 20, 510);
      ctx.stroke();
    }
    ctx.fillStyle = "#101a20ed";
    rounded(ctx, 190, 120, 900, 140, 18);
    ctx.fillStyle = "#f5dfae";
    ctx.font = "900 28px Arial";
    ctx.textAlign = "center";
    ctx.fillText("ЗМІНУ ЗАВЕРШЕНО · ВИХІД У КУКУРУДЗУ", W / 2, 166);
    ctx.fillStyle = "#e2e9df";
    ctx.font = "bold 18px Arial";
    ctx.fillText("За службовими дверима вже чекає поле.", W / 2, 205);
    ctx.fillStyle = "#ffd166";
    ctx.font = "900 16px Arial";
    ctx.fillText(
      "НАТИСНИ E АБО ENTER, ЩОБ ПОЧАТИ ОКРЕМИЙ ЕТАП 04B",
      W / 2,
      235,
    );
    drawTrainingAvatar(640, 590, t);
  }
