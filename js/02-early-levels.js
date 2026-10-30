function startLevel3() {
  saveCampaignChapter(3);
  focusGame();
  document
    .getElementById("game")
    .classList.remove("germany-mode", "training-mode");
  churchEventUsed = false;
  azotEventUsed = false;
  stage = 3;
  gameEnded = false;
  running = true;
  paused = false;
  time = 60;
  chaseMarkerActive = false;
  courierToCafe = false;
  deliveries = [];
  keys.clear();
  boostPressed = false;
  player.x = 1740;
  player.y = 1640;
  player.vx = 0;
  player.vy = 0;
  player.dir = 0;
  player.boost = 0;
  player.boostCd = 0;
  chaseVan = { x: 1270, y: 1430, vx: 0, vy: 0 };
  buildChaseBackdrop();
  document.getElementById("game").classList.remove("cafe-mode");
  document.querySelector(".mapbox").style.display = "block";
  document.querySelector(".speed").style.display = "block";
  setHint("РУХ <b>WASD / СТРІЛКИ</b>　 РИВОК <b>SPACE</b>　 ПАУЗА <b>ESC</b>");
  document.getElementById("delivered").parentElement.firstChild.textContent =
    "🚨 ПОГОНЯ ";
  document.getElementById("delivered").textContent = "—";
  document.getElementById("timer").textContent = "01:00";
  document.getElementById("objectiveTitle").textContent = "ТІКАЙ ВІД БУСА";
  document.getElementById("objectiveText").textContent =
    "Уникай машин і тримай швидкість. Шукай шлях крізь місто.";
  document.getElementById("intro").classList.add("hidden");
  document.getElementById("pause").classList.remove("show");
  audioStart();
  showToast("WASD / СТРІЛКИ — РУХ · SPACE — РИВОК · БУС ПОЗАДУ!");
  last = performance.now();
  scheduleLoop();
}
let forest = null,
  germany = null,
  vrMaze = null;
let vrWave = 1,
  vrEnemies = [],
  vrShots = [],
  vrEnemyShots = [],
  vrPlayer = { x: 640, hp: 3, invuln: 0 },
  vrBoss = null,
  vrFireCooldown = 0,
  vrEnemyFire = 0,
  vrWavePause = 0,
  vrDashPressed = false,
  vrDashCooldown = 0,
  vrStars = [];
function showVrCutscene() {
  saveCampaignChapter(6);
  running = false;
  paused = false;
  const layer = document.getElementById("intro");
  layer.classList.remove("hidden");
  layer.innerHTML = `<section class="card vr-story-card"><style>
.vr-story-card{width:min(820px,94vw)}.vr-scene{height:290px;position:relative;overflow:hidden;border:2px solid #526671;border-radius:18px;background:linear-gradient(#263440 0 72%,#17232a 72%);box-shadow:inset 0 0 55px #07121d;margin:18px 0 20px}.vr-scene:before{content:"";position:absolute;left:5%;right:5%;top:12%;height:57%;border:8px solid #18232d;border-radius:9px;background:linear-gradient(#344d67 0 70%,#293d4c 70%)}.vr-church{position:absolute;right:19%;top:45px;color:#d9d0aa;font-size:45px;text-shadow:0 0 14px #ffd783}.vr-door{position:absolute;left:7%;bottom:27%;width:82px;height:150px;background:#332f32;border:7px solid #111a20;border-radius:8px 8px 0 0;transform:perspective(250px) rotateY(-15deg);box-shadow:inset -12px 0 #67513a}.vr-stairs{position:absolute;left:0;bottom:24%;width:31%;height:48%;background:repeating-linear-gradient(0deg,#64605a 0 10px,#252f34 10px 16px);clip-path:polygon(0 0,100% 60%,100% 100%,0 100%);opacity:.8}.vr-floor{position:absolute;bottom:0;left:0;right:0;height:26%;background:repeating-linear-gradient(90deg,#344044 0 2px,transparent 2px 85px),linear-gradient(#283438,#11191d)}.vr-prop{position:absolute;bottom:22%;font-size:48px;filter:drop-shadow(0 7px 4px #0009)}.vr-scooter{left:19%}.vr-pack{right:18%}.vr-walker,.vr-sitter{position:absolute;bottom:20%;font-size:74px;filter:drop-shadow(0 8px 5px #000b);transition:all .7s ease}.vr-walker{left:8%;animation:vr-enter 2s ease-in-out infinite alternate}.vr-sitter{left:46%;transform:scale(.92);display:none}.vr-visor{position:absolute;left:calc(46% + 8px);bottom:42%;font-size:38px;display:none;filter:drop-shadow(0 0 12px #4ff6ff)}.vr-scene[data-step="1"] .vr-walker,.vr-scene[data-step="2"] .vr-walker{display:none}.vr-scene[data-step="1"] .vr-sitter,.vr-scene[data-step="2"] .vr-sitter{display:block}.vr-scene[data-step="2"] .vr-visor{display:block}.vr-scene[data-step="0"] .vr-prop{opacity:.28}.vr-caption{position:absolute;left:0;right:0;bottom:10px;text-align:center;color:#f7e8cc;font-size:13px;font-weight:800;letter-spacing:.08em;text-shadow:0 2px 5px #000}.vr-story-card h2{margin:8px 0;color:#f6e5c8}.vr-story-card .mission{margin:12px 0}.vr-story-card .story-dots{display:flex;gap:8px;justify-content:center;margin:10px}.vr-story-card .story-dots i{width:9px;height:9px;border-radius:50%;background:#63727c}.vr-story-card .story-dots i.on{background:#56e4e6;box-shadow:0 0 10px #56e4e6}@keyframes vr-enter{from{left:8%}to{left:25%}}
</style><div class="eyebrow">КАТСЦЕНА · РІВЕНЬ 5 · ПІДВАЛ</div><div class="vr-scene" id="vrScene" data-step="0"><div class="vr-door"></div><div class="vr-stairs"></div><div class="vr-church">✝</div><div class="vr-floor"></div><div class="vr-walker">🧍🏻‍♂️</div><div class="vr-sitter">🧎🏻‍♂️</div><div class="vr-visor">🥽</div><div class="vr-caption" id="vrCaption">ГЕРОЙ СПУСКАЄТЬСЯ В СИРИЙ ПІДВАЛ</div></div><h2 id="vrStoryTitle">Двері зачиняються за спиною.</h2><p id="vrStoryText">Він залишає самокат і рюкзак біля стіни. У маленькому вікні видніється церква.</p><div class="story-dots"><i class="on"></i><i></i><i></i></div><button id="vrStoryNext">ДАЛІ　→</button><p class="micro">Після катсцени почнеться VR-головоломка: перенеси сирники, заглуши бетонні труби й вимкни завод.</p></section>`;
  let step = 0;
  const captions = [
    "ГЕРОЙ СПУСКАЄТЬСЯ В СИРИЙ ПІДВАЛ",
    "НА СТАРОМУ ЕКРАНІ ЗАВАНТАЖУЄТЬСЯ ПЛАН ЦЕХУ",
    "ШОЛОМ НАДЯГНУТО · ВХІД У VR-ЦЕХ",
  ];
  const titles = [
    "Двері зачиняються за спиною.",
    "Цех працює на критичному тиску.",
    "Світ навколо зникає.",
  ];
  const texts = [
    "У маленькому вікні видніється церква. На столі блимає старий шолом.",
    "На екрані блимає схема: зважити платформу, заглушити три труби й повернути клапан.",
    "У VR можна переносити сирники, обходити блоки на конвеєрі та керувати заводом клавішею E.",
  ];
  const advance = () => {
    step++;
    if (step >= 3) {
      startLevel5();
      return;
    }
    document.getElementById("vrScene").dataset.step = String(step);
    document.getElementById("vrCaption").textContent = captions[step];
    document.getElementById("vrStoryTitle").textContent = titles[step];
    document.getElementById("vrStoryText").textContent = texts[step];
    document
      .querySelectorAll(".story-dots i")
      .forEach((dot, i) => dot.classList.toggle("on", i === step));
    document.getElementById("vrStoryNext").textContent =
      step === 2 ? "ЗНЕШКОДИТИ ЗАВОД　→" : "ДАЛІ　→";
  };
  document.getElementById("vrStoryNext").onclick = advance;
}
function buildFactoryBackdrop() {
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const g = c.getContext("2d");
  g.fillStyle = "#26252b";
  g.fillRect(0, 0, W, H);
  g.fillStyle = "#45232f";
  g.fillRect(0, 0, W, 185);
  for (let row = 0; row < 9; row++) {
    const yy = row * 21;
    for (let col = -1; col < 27; col++) {
      const xx = col * 52 + (row % 2) * 26;
      g.fillStyle = ["#7e3444", "#8f3a4a", "#71303d", "#9a4350"][
        (row * 7 + col * 3 + 80) % 4
      ];
      g.fillRect(xx + 2, yy + 2, 48, 17);
      g.strokeStyle = "#4a2630";
      g.lineWidth = 2;
      g.strokeRect(xx + 2, yy + 2, 48, 17);
    }
  }
  for (const x of [0, 48, 96, W - 116, W - 68, W - 20]) {
    g.fillStyle = "#512937";
    g.fillRect(x, 185, 20, H - 185);
    for (let y = 205; y < H; y += 23) {
      g.fillStyle = "#8d3c4b";
      g.fillRect(x + 2, y, 16, 18);
      g.strokeStyle = "#48252f";
      g.strokeRect(x + 2, y, 16, 18);
    }
  }
  g.fillStyle = "#34343a";
  g.fillRect(128, 185, W - 256, H - 185);
  for (let y = 220; y < H; y += 90) {
    g.strokeStyle = "#4a4a50";
    g.lineWidth = 2;
    g.beginPath();
    g.moveTo(82, y);
    g.lineTo(W - 82, y);
    g.stroke();
  }
  for (let x = 125; x < W - 100; x += 128) {
    g.strokeStyle = "#414147";
    g.beginPath();
    g.moveTo(x, 190);
    g.lineTo(x, H);
    g.stroke();
  }
  g.fillStyle = "#201c25";
  rounded(g, 420, 24, 440, 102, 10);
  g.strokeStyle = "#ff3e9b";
  g.lineWidth = 4;
  g.shadowColor = "#ff3e9b";
  g.shadowBlur = 20;
  g.strokeRect(432, 32, 416, 86);
  g.shadowBlur = 0;
  g.fillStyle = "#f3d1b1";
  g.font = "900 25px Arial";
  g.textAlign = "center";
  g.fillText("БЕТОННИЙ ЗАВОД", 640, 70);
  g.fillStyle = "#5ce9e1";
  g.font = "bold 17px Arial";
  g.fillText("СИХОВА", 640, 98);
  for (const y of [206, 345, 514, 700]) {
    g.strokeStyle = y % 2 ? "#31dfd2" : "#ff3e9b";
    g.lineWidth = 5;
    g.shadowColor = g.strokeStyle;
    g.shadowBlur = 13;
    g.beginPath();
    g.moveTo(78, y);
    g.lineTo(132, y);
    g.moveTo(W - 132, y);
    g.lineTo(W - 78, y);
    g.stroke();
    g.shadowBlur = 0;
  }
  g.fillStyle = "#f3bd59";
  for (const x of [105, 1175]) {
    g.beginPath();
    g.moveTo(x, 178);
    g.lineTo(x + 13, 178);
    g.lineTo(x + 6, 204);
    g.closePath();
    g.fill();
  }
  return c;
}
function startLevel5() {
  focusGame();
  document
    .getElementById("game")
    .classList.remove("germany-mode", "forest-mode");
  stage = 6;
  document.getElementById("game").classList.remove("training-mode");
  gameEnded = false;
  running = true;
  paused = false;
  score = 0;
  vrMaze = {
    backdrop: buildFactoryBackdrop(),
    player: { x: 640, y: 710, hp: 5, invuln: 0, dir: -Math.PI / 2 },
    phase: 0,
    clock: 0,
    plate: { x: 300, y: 560, active: false },
    supply: { x: 145, y: 642, count: 4 },
    carrying: false,
    dropped: [],
    sockets: [
      { x: 300, y: 315, plugged: false },
      { x: 640, y: 300, plugged: false },
      { x: 980, y: 315, plugged: false },
    ],
    valve: { x: 1060, y: 260, turned: false },
    panel: { x: 640, y: 185, active: false },
    hazards: [],
    hazardTimer: 1.1,
    score: 0,
    invuln: 0,
  };
  vrPlayer = vrMaze.player;
  vrDashCooldown = 0;
  keys.clear();
  boostPressed = false;
  interactPressed = false;
  document.getElementById("game").classList.add("arcade-mode");
  document.getElementById("game").classList.remove("cafe-mode");
  document.querySelector(".mapbox").style.display = "none";
  document.querySelector(".speed").style.display = "none";
  setHint("");
  document.getElementById("delivered").parentElement.firstChild.textContent =
    "🏭 МЕХАНІЗМИ ";
  document.getElementById("delivered").textContent = "0 / 5";
  document.getElementById("timer").textContent = "VR";
  document.getElementById("objectiveTitle").textContent =
    "БЕТОННИЙ ЗАВОД СИХОВА";
  document.getElementById("objectiveText").textContent =
    "Перенеси сирник на платформу, заглуши три труби, поверни клапан і вимкни завод.";
  document.getElementById("intro").classList.add("hidden");
  document.getElementById("pause").classList.remove("show");
  audioStart();
  showToast("E · ПІДНЯТИ / ПОСТАВИТИ СИРНИК · WASD · РУХ");
  last = performance.now();
  scheduleLoop();
}
function factoryGoal(m) {
  if (m.phase === 0 && m.carrying) return m.plate;
  if (m.phase === 1 && m.carrying)
    return m.sockets.find((q) => !q.plugged) || m.valve;
  if (m.phase === 0 || m.phase === 1) {
    const choices = [...m.dropped, ...(m.supply.count > 0 ? [m.supply] : [])];
    return choices.reduce(
      (best, q) =>
        Math.hypot(q.x - m.player.x, q.y - m.player.y) <
        (best ? Math.hypot(best.x - m.player.x, best.y - m.player.y) : Infinity)
          ? q
          : best,
      null,
    );
  }
  if (m.phase === 2) return m.valve;
  if (m.phase === 3) return m.panel;
  return null;
}
function factoryPhaseName(m) {
  return (
    [
      "1/4 · ЗВАЖ ПЛАТФОРМУ",
      "2/4 · ЗАГЛУШИ ТРУБИ 1 → 2 → 3",
      "3/4 · ПОВЕРНИ КЛАПАН",
      "4/4 · ВИМКНИ ЗАВОД",
    ][m.phase] || "ЗАВОД ЗНЕШКОДЖЕНО"
  );
}
function factoryInteract(m) {
  const p = m.player,
    dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  if ((m.phase === 0 || m.phase === 1) && m.carrying) {
    if (m.phase === 0 && dist(p, m.plate) < 80) {
      m.carrying = false;
      m.plate.active = true;
      m.phase = 1;
      m.score += 100;
      score += 100;
      document.getElementById("objectiveTitle").textContent =
        factoryPhaseName(m);
      document.getElementById("delivered").textContent = "1 / 5";
      showToast("ПЛАТФОРМУ ЗВАЖЕНО · ТЕПЕР ЗАГЛУШИ ТРИ ТРУБИ");
      chime();
      return;
    }
    if (m.phase === 1) {
      const i = m.sockets.findIndex((q) => !q.plugged);
      if (i >= 0 && dist(p, m.sockets[i]) < 82) {
        m.carrying = false;
        m.sockets[i].plugged = true;
        m.score += 100;
        score += 100;
        const n = m.sockets.filter((q) => q.plugged).length;
        document.getElementById("delivered").textContent = `${1 + n} / 5`;
        if (n === 3) {
          m.phase = 2;
          document.getElementById("objectiveTitle").textContent =
            factoryPhaseName(m);
          showToast("ТРУБИ ЗАГЛУШЕНО · ДІСТАНЬСЯ ДО КЛАПАНА");
        } else showToast(`ТРУБУ ${i + 1} ЗАГЛУШЕНО · ЗАЛИШИЛОСЯ ${3 - n}`);
        chime();
        return;
      }
    }
  } else if ((m.phase === 0 || m.phase === 1) && !m.carrying) {
    let pick = -1,
      best = 73;
    for (let i = 0; i < m.dropped.length; i++) {
      const d = dist(p, m.dropped[i]);
      if (d < best) {
        best = d;
        pick = i;
      }
    }
    if (pick >= 0) {
      m.dropped.splice(pick, 1);
      m.carrying = true;
      showToast("СИРНИК ПІДНЯТО · НЕСИ ДО ПІДСВІЧЕНОЇ ЦІЛІ");
      return;
    }
    if (m.supply.count > 0 && dist(p, m.supply) < 84) {
      m.supply.count--;
      m.carrying = true;
      showToast(`ПОРЦІЮ ВЗЯТО · НА СТІЙЦІ ЩЕ ${m.supply.count}`);
      chime();
      return;
    }
  }
  if (m.phase === 2 && !m.carrying && dist(p, m.valve) < 90) {
    m.valve.turned = true;
    m.phase = 3;
    m.score += 150;
    score += 150;
    document.getElementById("objectiveTitle").textContent = factoryPhaseName(m);
    document.getElementById("delivered").textContent = "4 / 5";
    showToast("ПОТІК СПРЯМОВАНО В РЕЗЕРВУАР · ДО ПУЛЬТА");
    chime();
    return;
  }
  if (m.phase === 3 && !m.carrying && dist(p, m.panel) < 90) {
    m.panel.active = true;
    m.score += 250;
    score += 250;
    document.getElementById("delivered").textContent = "5 / 5";
    document.getElementById("score").textContent = String(score).padStart(
      4,
      "0",
    );
    showVrVictory();
  }
}
function updateVrArcade(dt, t) {
  const m = vrMaze,
    p = m.player,
    { x: dx, y: dy } = movementAxes(),
    speed = m.carrying ? 220 : 320;
  p.invuln = Math.max(0, p.invuln - dt);
  vrDashCooldown = Math.max(0, vrDashCooldown - dt);
  if (dx || dy) {
    p.dir = Math.atan2(dy, dx);
    p.x = clamp(p.x + dx * speed * dt, 56, W - 56);
    p.y = clamp(p.y + dy * speed * dt, 190, H - 55);
  }
  if (
    (keyDown("ShiftLeft") || keyDown("ShiftRight") || vrDashPressed) &&
    vrDashCooldown <= 0
  ) {
    const n = Math.hypot(dx, dy) || 1,
      dash = m.carrying ? 95 : 155;
    p.x = clamp(p.x + ((dx || Math.cos(p.dir)) / n) * dash, 56, W - 56);
    p.y = clamp(p.y + ((dy || Math.sin(p.dir)) / n) * dash, 190, H - 55);
    p.invuln = Math.max(p.invuln, 0.4);
    vrDashCooldown = 1.1;
    vrDashPressed = false;
    tone(260, 0.08, "triangle", 0.03, 180);
  }
  vrDashPressed = false;
  m.clock += dt;
  if (interactPressed) {
    interactPressed = false;
    factoryInteract(m);
  }
  if (m.plate.active) {
    m.hazardTimer -= dt;
    if (m.hazardTimer <= 0) {
      const lane = Math.random() < 0.5 ? 468 : 585,
        direction = Math.random() < 0.5 ? 1 : -1;
      m.hazards.push({
        x: direction > 0 ? -44 : W + 44,
        y: lane,
        vx: direction * (190 + m.sockets.filter((q) => q.plugged).length * 28),
        r: 23,
        phase: Math.random() * 7,
      });
      if (m.phase >= 2 && Math.random() < 0.42)
        m.hazards.push({
          x: 120 + Math.random() * (W - 240),
          y: 190,
          vy: 260,
          r: 17,
          warning: 0.45,
        });
      m.hazardTimer = Math.max(
        0.62,
        1.18 - m.sockets.filter((q) => q.plugged).length * 0.12,
      );
    }
  }
  for (const h of m.hazards) {
    h.phase += dt * 7;
    if (h.warning > 0) h.warning -= dt;
    else {
      h.x += (h.vx || 0) * dt;
      h.y += (h.vy || 0) * dt;
    }
    if (
      p.invuln <= 0 &&
      !h.warning &&
      Math.hypot(p.x - h.x, p.y - h.y) < h.r + 21
    ) {
      p.hp--;
      p.invuln = 1.1;
      if (m.carrying) {
        m.carrying = false;
        m.dropped.push({ x: p.x, y: p.y + 18 });
        showToast("УДАР! СИРНИК ВПАВ — ПІДБЕРИ ЙОГО");
      } else showToast(`БЕТОННИЙ БЛОК · ${p.hp} ♥`);
      h.x = -100;
      tone(120, 0.16, "sawtooth", 0.03, -80);
      if (p.hp <= 0) {
        showVrFail();
        return;
      }
    }
  }
  m.hazards = m.hazards.filter(
    (h) => h.x > -85 && h.x < W + 85 && h.y < H + 35,
  );
  document.getElementById("delivered").textContent =
    m.phase === 0
      ? "0 / 5"
      : m.phase === 1
        ? `${1 + m.sockets.filter((q) => q.plugged).length} / 5`
        : m.phase === 2
          ? "4 / 5"
          : "4 / 5";
  document.getElementById("score").textContent = String(score).padStart(4, "0");
  if (toastTimer > 0) {
    toastTimer -= dt;
    if (toastTimer <= 0)
      document.getElementById("toast").classList.remove("show");
  }
}
function drawVrArcade(t) {
  drawVrGameField(t);
}
function drawBasementBackground(t) {
  ctx.clearRect(0, 0, W, H);
  const wall = ctx.createLinearGradient(0, 0, 0, 640);
  wall.addColorStop(0, "#25303a");
  wall.addColorStop(1, "#414047");
  ctx.fillStyle = wall;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#1a232b";
  ctx.fillRect(0, 0, W, 24);
  for (let i = 0; i < 8; i++) {
    const x = i * 177 + Math.sin(i * 7) * 9;
    ctx.strokeStyle = i % 2 ? "#68706c" : "#5b6262";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, 36);
    ctx.lineTo(x + 12, 78);
    ctx.lineTo(x - 3, 107);
    ctx.lineTo(x + 15, 132);
    ctx.stroke();
    ctx.fillStyle = "rgba(111,144,139,.12)";
    ctx.beginPath();
    ctx.ellipse(x + 24, 117, 23, 48, 0.2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = "#151f26";
  ctx.fillRect(0, 628, W, 172);
  ctx.fillStyle = "#465052";
  for (let x = 0; x < W; x += 82) {
    ctx.strokeStyle = "#323b3d";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, 636, 80, 74);
  }
  ctx.fillStyle = "rgba(70,135,147,.25)";
  ctx.beginPath();
  ctx.ellipse(840, 755, 210, 26, -0.08, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(147,212,221,.36)";
  ctx.beginPath();
  ctx.ellipse(840, 752, 164, 13, -0.08, Math.PI, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = "#18212a";
  rounded(ctx, 944, 15, 310, 120, 12);
  ctx.fillStyle = "#18233a";
  rounded(ctx, 957, 25, 284, 98, 7);
  ctx.fillStyle = "#28385a";
  ctx.beginPath();
  ctx.moveTo(970, 112);
  ctx.lineTo(1001, 83);
  ctx.lineTo(1038, 92);
  ctx.lineTo(1072, 51);
  ctx.lineTo(1104, 92);
  ctx.lineTo(1130, 76);
  ctx.lineTo(1160, 106);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#29374b";
  ctx.fillRect(1058, 43, 29, 69);
  ctx.fillStyle = "#ffdf8b";
  ctx.fillRect(1065, 65, 6, 10);
  ctx.fillRect(1076, 65, 6, 10);
  ctx.fillStyle = "#dce9d0";
  ctx.fillRect(1070, 31, 4, 16);
  ctx.fillRect(1064, 36, 16, 3);
  ctx.fillStyle = "#222d3c";
  ctx.fillRect(969, 113, 275, 7);
  ctx.fillStyle = "#e9c875";
  ctx.font = "bold 10px Arial,sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("ЦЕРКВА ЗА ВІКНОМ", 1100, 130);
  drawBasementScooter(238, 741);
  drawBasementBackpack(1055, 744);
  drawBasementViewer(640, 726, t);
}
function drawBasementViewer(x, y, t) {
  ctx.save();
  ctx.translate(x, y + Math.sin(t * 1.3) * 1.5);
  ctx.fillStyle = "#080d14";
  ctx.beginPath();
  ctx.ellipse(0, 54, 83, 18, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#202b39";
  rounded(ctx, -56, 8, 112, 70, 25);
  ctx.fillStyle = "#3b5962";
  rounded(ctx, -40, 5, 80, 35, 16);
  ctx.fillStyle = "#202831";
  ctx.beginPath();
  ctx.arc(0, -12, 37, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#d2aa80";
  ctx.beginPath();
  ctx.arc(0, -10, 28, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#151e2c";
  rounded(ctx, -39, -28, 78, 32, 12);
  ctx.fillStyle = "#45ddeb";
  rounded(ctx, -30, -23, 60, 19, 8);
  ctx.fillStyle = "#172633";
  ctx.fillRect(-3, -22, 6, 18);
  ctx.strokeStyle = "#89999a";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(0, -17, 43, Math.PI, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = "#bf8a52";
  ctx.beginPath();
  ctx.arc(-52, 2, 5, 0, Math.PI * 2);
  ctx.arc(52, 2, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}
function drawBasementScooter(x, y) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "#080d12";
  ctx.beginPath();
  ctx.arc(-62, 0, 21, 0, Math.PI * 2);
  ctx.arc(62, 0, 21, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#829294";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(-62, 0, 13, 0, Math.PI * 2);
  ctx.arc(62, 0, 13, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = "#41dbc9";
  ctx.lineWidth = 11;
  ctx.beginPath();
  ctx.moveTo(-60, -5);
  ctx.lineTo(54, -5);
  ctx.stroke();
  ctx.strokeStyle = "#d4ddd2";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(50, -7);
  ctx.lineTo(43, -59);
  ctx.lineTo(70, -64);
  ctx.stroke();
  ctx.strokeStyle = "#edc96c";
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.moveTo(55, -64);
  ctx.lineTo(87, -64);
  ctx.stroke();
  ctx.restore();
}
function drawBasementBackpack(x, y) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "#101820";
  ctx.beginPath();
  ctx.ellipse(0, 30, 48, 13, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#293845";
  rounded(ctx, -36, -39, 72, 68, 17);
  ctx.fillStyle = "#a96d42";
  rounded(ctx, -27, -32, 54, 54, 13);
  ctx.fillStyle = "#e5bc6d";
  rounded(ctx, -12, -25, 24, 8, 3);
  ctx.fillStyle = "#172834";
  rounded(ctx, -19, -7, 38, 27, 7);
  ctx.fillStyle = "#d6a953";
  ctx.fillRect(-3, -5, 6, 23);
  ctx.restore();
}
function drawVrSyrnyk(x, y, size) {
  ctx.save();
  ctx.translate(x, y);
  ctx.shadowColor = "#ffc55f";
  ctx.shadowBlur = 12;
  for (const [dx, dy, r] of [
    [-size * 0.38, size * 0.12, size * 0.39],
    [size * 0.38, size * 0.12, size * 0.39],
    [0, -size * 0.3, size * 0.4],
  ]) {
    ctx.fillStyle = "#a85e36";
    ctx.beginPath();
    ctx.arc(dx, dy, r + 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#f3c66f";
    ctx.beginPath();
    ctx.arc(dx, dy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff0bf";
    ctx.beginPath();
    ctx.arc(dx - 2, dy - 2, r * 0.4, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}
function drawVrGameField(t) {
  const m = vrMaze,
    p = m.player,
    nextSocket = m.sockets.find((q) => !q.plugged),
    ctx2 = ctx;
  ctx2.clearRect(0, 0, W, H);
  ctx2.drawImage(m.backdrop, 0, 0);
  for (const y of [468, 585]) {
    ctx2.fillStyle = "#17191e";
    rounded(ctx2, 80, y - 31, W - 160, 62, 9);
    ctx2.fillStyle = "#504b53";
    rounded(ctx2, 88, y - 24, W - 176, 48, 7);
    ctx2.save();
    ctx2.beginPath();
    ctx2.roundRect(88, y - 24, W - 176, 48, 7);
    ctx2.clip();
    for (let x = -50; x < W + 40; x += 48) {
      const xx = x + ((t * 135) % (W + 90));
      ctx2.fillStyle = "#7c7178";
      ctx2.fillRect(xx, y - 20, 27, 40);
      ctx2.fillStyle = "#332a32";
      ctx2.fillRect(xx + 29, y - 20, 6, 40);
    }
    ctx2.restore();
    ctx2.strokeStyle = "#f1499b";
    ctx2.lineWidth = 2;
    ctx2.strokeRect(84, y - 28, W - 168, 56);
  }
  ctx2.strokeStyle = m.plate.active ? "#59f2df" : "#826579";
  ctx2.lineWidth = 7;
  ctx2.shadowColor = ctx2.strokeStyle;
  ctx2.shadowBlur = 13;
  ctx2.beginPath();
  ctx2.moveTo(195, 502);
  ctx2.lineTo(195, 420);
  ctx2.lineTo(300, 420);
  ctx2.lineTo(300, 347);
  ctx2.lineTo(980, 347);
  ctx2.lineTo(980, 260);
  ctx2.stroke();
  ctx2.shadowBlur = 0;
  for (let i = 0; i < 3; i++) {
    const q = m.sockets[i];
    ctx2.strokeStyle = q.plugged
      ? "#58f3b3"
      : q === nextSocket
        ? "#ff4ca7"
        : "#38dce6";
    ctx2.lineWidth = 8;
    ctx2.beginPath();
    ctx2.moveTo(q.x, 347);
    ctx2.lineTo(q.x, q.y + 28);
    ctx2.stroke();
    ctx2.fillStyle = "#282b30";
    rounded(ctx2, q.x - 43, q.y - 37, 86, 74, 12);
    ctx2.strokeStyle = q.plugged
      ? "#5affb5"
      : q === nextSocket
        ? "#ff4ca7"
        : "#56e8e9";
    ctx2.lineWidth = 4;
    ctx2.strokeRect(q.x - 39, q.y - 33, 78, 66);
    ctx2.fillStyle = q.plugged ? "#5affb5" : "#222b31";
    ctx2.beginPath();
    ctx2.arc(q.x, q.y, 19, 0, Math.PI * 2);
    ctx2.fill();
    ctx2.strokeStyle = q.plugged ? "#d5ffde" : "#cfbca4";
    ctx2.lineWidth = 4;
    ctx2.beginPath();
    ctx2.arc(q.x, q.y, 12, 0, Math.PI * 2);
    ctx2.stroke();
    ctx2.fillStyle = "#f3e7ce";
    ctx2.font = "bold 10px Arial";
    ctx2.textAlign = "center";
    ctx2.fillText(`ТРУБА ${i + 1}${q.plugged ? " · OK" : ""}`, q.x, q.y - 47);
  }
  ctx2.fillStyle = "#282b30";
  rounded(ctx2, m.supply.x - 52, m.supply.y - 35, 104, 70, 10);
  ctx2.strokeStyle = "#f2bc5c";
  ctx2.lineWidth = 3;
  ctx2.strokeRect(m.supply.x - 48, m.supply.y - 31, 96, 62);
  ctx2.fillStyle = "#f2c870";
  ctx2.font = "bold 10px Arial";
  ctx2.textAlign = "center";
  ctx2.fillText("СТІЙКА СИРНИКІВ", m.supply.x, m.supply.y - 43);
  ctx2.fillStyle = "#fff2cc";
  ctx2.fillText(`ПОРЦІЙ: ${m.supply.count}`, m.supply.x, m.supply.y + 53);
  for (let i = 0; i < Math.min(3, m.supply.count); i++)
    drawVrSyrnyk(m.supply.x - 20 + i * 20, m.supply.y, 9);
  ctx2.fillStyle = m.plate.active ? "#55f0d5" : "#46424b";
  rounded(ctx2, m.plate.x - 58, m.plate.y - 19, 116, 38, 8);
  ctx2.strokeStyle = m.plate.active ? "#62fff0" : "#de9c56";
  ctx2.lineWidth = 4;
  ctx2.strokeRect(m.plate.x - 54, m.plate.y - 15, 108, 30);
  ctx2.fillStyle = "#f6e5ca";
  ctx2.font = "bold 10px Arial";
  ctx2.textAlign = "center";
  ctx2.fillText(
    m.plate.active ? "ПЛАТФОРМА · АКТИВНА" : "ПЛАТФОРМА · ВАГА",
    m.plate.x,
    m.plate.y + 4,
  );
  ctx2.save();
  ctx2.translate(m.valve.x, m.valve.y);
  ctx2.fillStyle = "#252b31";
  rounded(ctx2, -45, -40, 90, 80, 12);
  ctx2.strokeStyle = m.valve.turned ? "#5af3b4" : "#ff559f";
  ctx2.lineWidth = 5;
  ctx2.strokeRect(-40, -35, 80, 70);
  ctx2.strokeStyle = "#d7b68a";
  ctx2.lineWidth = 8;
  ctx2.beginPath();
  ctx2.arc(0, 0, 22, 0, Math.PI * 2);
  ctx2.stroke();
  ctx2.beginPath();
  ctx2.moveTo(-28, 0);
  ctx2.lineTo(28, 0);
  ctx2.moveTo(0, -28);
  ctx2.lineTo(0, 28);
  ctx2.stroke();
  ctx2.fillStyle = "#fff0d5";
  ctx2.font = "bold 10px Arial";
  ctx2.textAlign = "center";
  ctx2.fillText(
    m.valve.turned ? "ПОТІК → РЕЗЕРВУАР" : "КЛАПАН · ЗАКРИТИЙ",
    0,
    55,
  );
  ctx2.restore();
  ctx2.fillStyle = m.panel.active ? "#5af3b4" : "#222a30";
  rounded(ctx2, m.panel.x - 55, m.panel.y - 28, 110, 56, 10);
  ctx2.strokeStyle = m.panel.active ? "#5af3b4" : "#ff4d9d";
  ctx2.lineWidth = 4;
  ctx2.strokeRect(m.panel.x - 51, m.panel.y - 24, 102, 48);
  ctx2.fillStyle = "#f4dfbd";
  ctx2.font = "bold 10px Arial";
  ctx2.textAlign = "center";
  ctx2.fillText(
    m.panel.active ? "ЗАВОД ВИМКНЕНО" : "АВАРІЙНИЙ ПУЛЬТ",
    m.panel.x,
    m.panel.y + 4,
  );
  ctx2.fillStyle = "#4b5360";
  rounded(ctx2, 242, 540, 116, 42, 7);
  ctx2.fillStyle = m.plate.active ? "#ff68b1" : "#c69054";
  ctx2.beginPath();
  ctx2.arc(m.plate.x, m.plate.y, 18, 0, Math.PI * 2);
  ctx2.fill();
  for (const q of m.dropped) drawVrSyrnyk(q.x, q.y, 17);
  for (const h of m.hazards) {
    if (h.warning > 0) {
      ctx2.save();
      ctx2.globalAlpha = 0.4 + 0.3 * Math.sin(t * 19);
      ctx2.fillStyle = "#ff465f";
      ctx2.beginPath();
      ctx2.arc(h.x, h.y + 35, 28, 0, Math.PI * 2);
      ctx2.fill();
      ctx2.fillStyle = "#fff";
      ctx2.font = "bold 9px Arial";
      ctx2.textAlign = "center";
      ctx2.fillText("УВАГА", h.x, h.y + 38);
      ctx2.restore();
    } else {
      ctx2.save();
      ctx2.translate(h.x, h.y);
      ctx2.rotate(Math.sin(h.phase) * 0.08);
      ctx2.fillStyle = "#99928b";
      rounded(ctx2, -h.r, -h.r, h.r * 2, h.r * 2, 5);
      ctx2.fillStyle = "#c5b9a4";
      ctx2.fillRect(-h.r + 4, -h.r + 7, h.r * 2 - 8, 5);
      ctx2.restore();
    }
  }
  drawTrainingAvatar(p.x, p.y, t);
  if (m.carrying) drawVrSyrnyk(p.x + 20, p.y - 30, 17);
  const prompt = (x, y, text) => {
    ctx2.fillStyle = "#101923e8";
    rounded(ctx2, x - 66, y - 18, 132, 22, 6);
    ctx2.fillStyle = "#fff";
    ctx2.font = "bold 10px Arial";
    ctx2.textAlign = "center";
    ctx2.fillText(text, x, y - 3);
  };
  if (
    (m.phase === 0 || m.phase === 1) &&
    !m.carrying &&
    Math.hypot(p.x - m.supply.x, p.y - m.supply.y) < 150
  )
    prompt(
      m.supply.x,
      m.supply.y - 56,
      m.dropped.length ? "E · ПІДНЯТИ" : "E · ВЗЯТИ СИРНИК",
    );
  if (!m.carrying && m.dropped.length) {
    let near = null,
      nd = 145;
    for (const item of m.dropped) {
      const d = Math.hypot(p.x - item.x, p.y - item.y);
      if (d < nd) {
        near = item;
        nd = d;
      }
    }
    if (near) prompt(near.x, near.y - 30, "E · ПІДНЯТИ СИРНИК");
  }
  if (
    m.carrying &&
    m.phase === 0 &&
    Math.hypot(p.x - m.plate.x, p.y - m.plate.y) < 145
  )
    prompt(m.plate.x, m.plate.y - 45, "E · ПОСТАВИТИ НА ПЛАТФОРМУ");
  if (m.carrying && m.phase === 1) {
    const q = m.sockets.find((v) => !v.plugged);
    if (q && Math.hypot(p.x - q.x, p.y - q.y) < 150)
      prompt(q.x, q.y - 57, `E · ЗАГЛУШИТИ ТРУБУ ${m.sockets.indexOf(q) + 1}`);
  }
  if (m.phase === 2 && Math.hypot(p.x - m.valve.x, p.y - m.valve.y) < 150)
    prompt(m.valve.x, m.valve.y - 63, "E · ПОВЕРНУТИ КЛАПАН");
  if (m.phase === 3 && Math.hypot(p.x - m.panel.x, p.y - m.panel.y) < 150)
    prompt(m.panel.x, m.panel.y - 55, "E · ВИМКНУТИ ЗАВОД");
  const target = factoryGoal(m);
  if (target) {
    const d = Math.hypot(target.x - p.x, target.y - p.y);
    if (d > 68) {
      ctx2.save();
      ctx2.strokeStyle = "#55f1df99";
      ctx2.lineWidth = 3;
      ctx2.setLineDash([8, 7]);
      ctx2.beginPath();
      ctx2.moveTo(p.x, p.y);
      ctx2.lineTo(target.x, target.y);
      ctx2.stroke();
      ctx2.setLineDash([]);
      ctx2.strokeStyle = "#ffe078";
      ctx2.lineWidth = 3;
      ctx2.beginPath();
      ctx2.arc(target.x, target.y, 20 + Math.sin(t * 5) * 3, 0, Math.PI * 2);
      ctx2.stroke();
      ctx2.restore();
    }
  }
  ctx2.fillStyle = "#09131bee";
  rounded(ctx2, 18, 15, 392, 112, 11);
  ctx2.fillStyle = "#f5ddbf";
  ctx2.font = "900 14px Arial";
  ctx2.textAlign = "left";
  ctx2.fillText("БЕТОННИЙ ЗАВОД СИХОВА · VR", 31, 38);
  ctx2.fillStyle = "#69eee1";
  ctx2.font = "bold 11px Arial";
  ctx2.fillText(factoryPhaseName(m), 31, 59);
  ctx2.fillStyle = "#fff";
  ctx2.font = "bold 11px Arial";
  ctx2.fillText(
    `ЖИТТЯ ${"♥ ".repeat(p.hp)}  ·  В РУКАХ ${m.carrying ? "СИРНИК" : "НІЧОГО"}  ·  ОЧКИ ${String(m.score).padStart(4, "0")}`,
    31,
    81,
  );
  ctx2.fillStyle = "#2a373b";
  rounded(ctx2, 31, 92, 364, 8, 4);
  ctx2.fillStyle = "#ff4a9f";
  rounded(ctx2, 33, 94, 360 * (m.phase / 4), 4, 2);
  ctx2.fillStyle = "#f4e1c5";
  ctx2.font = "bold 10px Arial";
  ctx2.fillText(
    "WASD · РУХ     E · ПІДНЯТИ / ПОСТАВИТИ     SHIFT · РИВОК",
    31,
    116,
  );
  ctx2.fillStyle = "#12171cdd";
  rounded(ctx2, 412, 750, 456, 28, 7);
  ctx2.fillStyle = "#ffe4aa";
  ctx2.font = "bold 10px Arial";
  ctx2.textAlign = "center";
  ctx2.fillText(
    m.phase === 0
      ? "ДОНЕСИ СИРНИК ДО ВАГОВОЇ ПЛАТФОРМИ"
      : m.phase === 1
        ? "ВСТАВ ТРИ СИРНИКИ-ЗАГЛУШКИ В ПІДСВІЧЕНІ ТРУБИ"
        : m.phase === 2
          ? "ПОВЕРНИ КЛАПАН ДО ПОТОКУ В РЕЗЕРВУАР"
          : m.phase === 3
            ? "ДОБЕРИСЯ ДО АВАРІЙНОГО ПУЛЬТА"
            : "ЗАВОД ЗУПИНЕНО",
    640,
    768,
  );
}
function drawVrEnemy(e, t) {
  ctx.save();
  ctx.translate(e.x, e.y + Math.sin(t * 5 + e.phase) * 4);
  ctx.shadowColor = "#ff46c8";
  ctx.shadowBlur = 14;
  ctx.fillStyle = e.hp > 1 ? "#b04ce0" : "#ed4fab";
  ctx.beginPath();
  ctx.ellipse(0, 0, 22, 16, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ffe788";
  ctx.fillRect(-11, -5, 7, 7);
  ctx.fillRect(4, -5, 7, 7);
  ctx.strokeStyle = "#f8a1dc";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-15, 9);
  ctx.lineTo(-28, 20);
  ctx.moveTo(15, 9);
  ctx.lineTo(28, 20);
  ctx.stroke();
  ctx.restore();
}
function drawVrBoss(b, t) {
  ctx.save();
  ctx.translate(b.x, b.y + Math.sin(t * 2) * 8);
  ctx.shadowColor = "#ff9a55";
  ctx.shadowBlur = 24;
  ctx.fillStyle = "#575960";
  ctx.beginPath();
  ctx.moveTo(-94, 48);
  ctx.lineTo(-92, -12);
  ctx.lineTo(-72, -12);
  ctx.lineTo(-72, -68);
  ctx.lineTo(-42, -68);
  ctx.lineTo(-42, -35);
  ctx.lineTo(-22, -35);
  ctx.lineTo(-22, -91);
  ctx.lineTo(17, -91);
  ctx.lineTo(17, -51);
  ctx.lineTo(43, -51);
  ctx.lineTo(43, -76);
  ctx.lineTo(74, -76);
  ctx.lineTo(74, -16);
  ctx.lineTo(94, -16);
  ctx.lineTo(94, 48);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#8a8b89";
  ctx.fillRect(-67, -58, 21, 96);
  ctx.fillRect(-15, -80, 27, 118);
  ctx.fillRect(49, -65, 20, 103);
  ctx.fillStyle = "#d3a36d";
  ctx.fillRect(-78, -57, 4, 88);
  ctx.fillRect(-6, -77, 4, 110);
  ctx.fillRect(58, -62, 4, 93);
  ctx.fillStyle = "#303640";
  ctx.fillRect(-105, 43, 210, 16);
  ctx.fillStyle = "#ad5e47";
  ctx.fillRect(-82, 16, 48, 20);
  ctx.fillRect(30, 9, 49, 27);
  ctx.strokeStyle = "#d4c5a0";
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(-70, -45);
  ctx.lineTo(-38, -15);
  ctx.lineTo(-8, -15);
  ctx.lineTo(8, -43);
  ctx.lineTo(44, -43);
  ctx.stroke();
  ctx.fillStyle = "#efbe5e";
  for (const x of [-79, -54, -9, 15, 56, 78]) ctx.fillRect(x, 49, 8, 5);
  ctx.fillStyle = "#fa6d4f";
  ctx.beginPath();
  ctx.arc(0, -96, 9 + Math.sin(t * 12) * 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  ctx.fillStyle = "#362a32";
  rounded(ctx, 430, 68, 420, 13, 7);
  ctx.fillStyle = "#ff9a55";
  rounded(ctx, 432, 70, 416 * (b.hp / b.maxHp), 9, 5);
  ctx.fillStyle = "#fff";
  ctx.font = "bold 13px Arial,sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("БЕТОННИЙ ЗАВОД «СМІЛАБЕТОН»", 640, 62);
}
function showVrVictory() {
  running = false;
  gameEnded = true;
  const layer = document.getElementById("intro");
  layer.classList.remove("hidden");
  layer.innerHTML = `<section class="card"><div class="eyebrow">АРКАДУ ПРОЙДЕНО · ПОВЕРНЕННЯ ДО ПІДВАЛУ</div><h1>Бетонний завод зупинено.<br><em>Шолом знятий.</em></h1><p>Герой зважує платформу сирником, заглушає три бетонні труби, повертає клапан і натискає аварійне вимкнення. За ними — нічне повітря та дорога до лісу.</p><div class="mission"><span>🥞 Платформа й труби: <b>заблоковано</b></span><span>🏭 Клапан і завод: <b>вимкнено</b></span></div><button id="leaveBasementBtn">ЗНЯТИ ШОЛОМ І ВИЙТИ　→</button><button id="replayVrBtn" class="secondary">ЩЕ ОДНА ГРА</button></section>`;
  document.getElementById("leaveBasementBtn").onclick = showForestTransition;
  document.getElementById("replayVrBtn").onclick = showVrCutscene;
}
function showForestTransition() {
  const layer = document.getElementById("intro");
  layer.classList.remove("hidden");
  layer.innerHTML = `<section class="card"><div class="eyebrow">НАСТУПНИЙ МАРШРУТ · РІВЕНЬ 6</div><h1>Лісовий режим.<br><em>Бігти — тільки вперед.</em></h1><p>Герой виходить із підвалу, закидає рюкзак на плечі й рушає крізь нічний ліс до колючого паркану. З усіх боків наближаються прикордонники, собаки та ведмеді.</p><div class="mission"><span>🌲 Біжи знизу вгору</span><span>🥞 Відстрілюйся сирниками</span><span>✂️ Переріж дріт і тікай</span></div><button id="startForestBtn">УВІЙТИ ДО ЛІСУ　→</button><button id="forestMenuBtn" class="secondary">ДО ГОЛОВНОГО МЕНЮ</button></section>`;
  document.getElementById("startForestBtn").onclick = startForestLevel;
  document.getElementById("forestMenuBtn").onclick = () => location.reload();
}
function forestRoutePoints() {
  return [
    { x: 1300, y: 6200 },
    ...forest.waypoints.map((q) => ({ x: q.x, y: q.y })),
    { x: 1300, y: 400 },
  ];
}
function forestRouteX(y) {
  const pts = forestRoutePoints();
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i],
      b = pts[i + 1];
    if (y <= a.y && y >= b.y) {
      const k = (a.y - y) / (a.y - b.y);
      return a.x + (b.x - a.x) * k;
    }
  }
  return 1300;
}
function forestGoal() {
  return forest.checkpointIndex < forest.waypoints.length
    ? forest.waypoints[forest.checkpointIndex]
    : { x: 1300, y: 450 };
}
function startForestLevel() {
  saveCampaignChapter(7);
  focusGame();
  document
    .getElementById("game")
    .classList.remove(
      "germany-mode",
      "training-mode",
      "arcade-mode",
      "cafe-mode",
    );
  document.getElementById("game").classList.add("forest-mode");
  stage = 7;
  gameEnded = false;
  running = true;
  paused = false;
  const worldW = 2600,
    worldH = 6700,
    startY = 6200,
    targetY = 400;
  forest = {
    worldW,
    worldH,
    startY,
    targetY,
    x: 1300,
    y: startY,
    cameraX: 660,
    cameraY: startY - 520,
    vx: 0,
    vy: 0,
    screenX: 640,
    screenY: 520,
    hp: 6,
    invuln: 0,
    shots: [],
    enemies: [],
    trees: [],
    hazards: [],
    tracks: [],
    waypoints: [
      { x: 2180, y: 5050, done: false },
      { x: 470, y: 3720, done: false },
      { x: 2140, y: 2410, done: false },
      { x: 900, y: 1220, done: false },
    ],
    checkpointIndex: 0,
    progress: 0,
    dashCd: 0,
    fire: 0,
    spawn: 0.65,
    ending: 0,
    cutProgress: 0,
    score: 0,
    dirX: 0,
    dirY: -1,
    phase: "run",
    mud: 0,
    toastCooldown: 0,
  };
  for (let i = 0; i < 620; i++) {
    const y = 100 + Math.random() * (worldH - 200),
      x = 80 + Math.random() * (worldW - 160);
    if (Math.abs(x - forestRouteX(y)) > 145)
      forest.trees.push({
        x,
        y,
        r: 22 + Math.random() * 42,
        seed: Math.random() * 9,
        kind: Math.random() < 0.2 ? "pine" : "broadleaf",
      });
  }
  for (let i = 0; i < 46; i++) {
    const y = 700 + Math.random() * 5200,
      x = 100 + Math.random() * (worldW - 200);
    forest.hazards.push({
      x,
      y,
      type: i % 3 === 0 ? "bog" : "mine",
      armed: true,
      warn: 0,
      phase: Math.random() * 8,
    });
  }
  keys.clear();
  boostPressed = false;
  interactPressed = false;
  document.querySelector(".mapbox").style.display = "none";
  document.querySelector(".speed").style.display = "none";
  setHint("");
  document.getElementById("delivered").parentElement.firstChild.textContent =
    "🌲 МАРКЕР ";
  document.getElementById("delivered").textContent = "0 / 4";
  document.getElementById("timer").textContent = "ЛІС";
  document.getElementById("objectiveTitle").textContent = "ДО КОЛЮЧОГО ПАРКАНУ";
  document.getElementById("objectiveText").textContent =
    "Йди до чотирьох маяків за компасом. Тримайся стежки, кидай сирники й бережись мін та боліт.";
  document.getElementById("intro").classList.add("hidden");
  document.getElementById("pause").classList.remove("show");
  audioStart();
  showToast("WASD · РУХ  |  SPACE · СИРНИК  |  КОМПАС → НАСТУПНИЙ МАЯК");
  last = performance.now();
  scheduleLoop();
}
function spawnForestEnemy() {
  const edge = Math.floor(Math.random() * 4),
    r = 360 + Math.random() * 210,
    cx = forest.x,
    cy = forest.y;
  let x =
      edge === 0
        ? cx - r
        : edge === 1
          ? cx + r
          : cx + (Math.random() - 0.5) * 850,
    y =
      edge === 2
        ? cy - r
        : edge === 3
          ? cy + r
          : cy + (Math.random() - 0.5) * 620;
  const type = ["guard", "dog", "bear", "dog"][Math.floor(Math.random() * 4)];
  forest.enemies.push({
    x: clamp(x, 35, forest.worldW - 35),
    y: clamp(y, forest.targetY + 25, forest.startY - 20),
    type,
    hp: type === "bear" ? 3 : type === "guard" ? 2 : 1,
    speed: type === "dog" ? 182 : type === "bear" ? 105 : 128,
    phase: Math.random() * 8,
    windup: type === "bear" ? 1 + Math.random() * 0.8 : 0,
    charge: 0,
    chargeX: 0,
    chargeY: 0,
    lastTrackX: x,
    lastTrackY: y,
  });
}
function updateForest(dt, t) {
  if (forest.ending) {
    forest.ending += dt;
    forest.cameraX +=
      (clamp(forest.x - W / 2, 0, forest.worldW - W) - forest.cameraX) *
      Math.min(1, dt * 5);
    forest.cameraY +=
      (clamp(forest.y - H * 0.65, 0, forest.worldH - H) - forest.cameraY) *
      Math.min(1, dt * 5);
    if (forest.ending > 3.1) {
      showForestVictory();
      return;
    }
    return;
  }
  const axes = movementAxes(),
    rawX = forest.phase === "cut" ? 0 : axes.x,
    rawY = forest.phase === "cut" ? 0 : axes.y,
    mag = Math.hypot(rawX, rawY) || 1,
    dx = rawX / mag,
    dy = rawY / mag;
  if (dx || dy) {
    forest.dirX = dx;
    forest.dirY = dy;
  }
  const trailDist = Math.abs(forest.x - forestRouteX(forest.y)),
    inBrush = trailDist > 185;
  let speed = inBrush ? 205 : 365;
  if (forest.mud > 0) {
    forest.mud = Math.max(0, forest.mud - dt);
    speed *= 0.58;
  }
  const oldX = forest.x,
    oldY = forest.y;
  forest.vx = dx * speed;
  forest.vy = dy * speed;
  if (
    (keyDown("ShiftLeft") || keyDown("ShiftRight") || vrDashPressed) &&
    forest.dashCd <= 0
  ) {
    const dash = inBrush ? 175 : 245;
    forest.x = clamp(forest.x + dx * dash, 35, forest.worldW - 35);
    forest.y = clamp(
      forest.y + dy * dash,
      forest.targetY + 25,
      forest.startY - 20,
    );
    forest.dashCd = 1.05;
    forest.invuln = Math.max(forest.invuln, 0.3);
    vrDashPressed = false;
    tone(330, 0.07, "triangle", 0.025, 150);
  } else {
    forest.x = clamp(forest.x + forest.vx * dt, 35, forest.worldW - 35);
    forest.y = clamp(
      forest.y + forest.vy * dt,
      forest.targetY + 25,
      forest.startY - 20,
    );
  }
  vrDashPressed = false;
  forest.dashCd = Math.max(0, forest.dashCd - dt);
  forest.invuln = Math.max(0, forest.invuln - dt);
  forest.fire = Math.max(0, forest.fire - dt);
  forest.progress = forest.startY - forest.y;
  const aim = Math.hypot(forest.dirX, forest.dirY) || 1;
  if ((keyDown("Space") || boostPressed) && forest.fire <= 0) {
    forest.shots.push({
      x: forest.x + (forest.dirX / aim) * 28,
      y: forest.y + (forest.dirY / aim) * 28,
      vx: (forest.dirX / aim) * 830,
      vy: (forest.dirY / aim) * 830,
      life: 1.3,
    });
    forest.fire = 0.24;
    tone(580, 0.05, "triangle", 0.025, 120);
  }
  boostPressed = false;
  for (const q of forest.shots) {
    q.x += q.vx * dt;
    q.y += q.vy * dt;
    q.life -= dt;
  }
  forest.shots = forest.shots.filter(
    (q) => q.life > 0 && Math.hypot(q.x - forest.x, q.y - forest.y) < 1050,
  );
  if (Math.hypot(forest.x - oldX, forest.y - oldY) > 24) {
    forest.tracks.push({ x: forest.x, y: forest.y, type: "hero", life: 7 });
    if (forest.tracks.length > 170) forest.tracks.shift();
  }
  for (const q of forest.tracks) q.life -= dt;
  forest.tracks = forest.tracks.filter((q) => q.life > 0);
  forest.spawn -= dt;
  if (
    forest.phase === "run" &&
    forest.spawn <= 0 &&
    forest.enemies.length < 10
  ) {
    forest.spawn = Math.max(0.56, 0.92 - forest.checkpointIndex * 0.06);
    spawnForestEnemy();
    if (forest.checkpointIndex > 1 && Math.random() < 0.38) spawnForestEnemy();
  }
  for (let i = forest.enemies.length - 1; i >= 0; i--) {
    const e = forest.enemies[i];
    e.phase += dt * 4.5;
    const vx = forest.x - e.x,
      vy = forest.y - e.y,
      d = Math.hypot(vx, vy) || 1;
    if (e.type === "bear") {
      if (e.charge > 0) {
        e.x += e.chargeX * e.speed * 3.2 * dt;
        e.y += e.chargeY * e.speed * 3.2 * dt;
        e.charge -= dt;
      } else if (e.windup > 0) {
        e.windup -= dt;
        if (e.windup <= 0) {
          const n = Math.hypot(vx, vy) || 1;
          e.chargeX = vx / n;
          e.chargeY = vy / n;
          e.charge = 0.62;
        }
      } else if (d < 410) {
        e.windup = 0.95;
      }
    } else {
      const lead = e.type === "guard" ? 0.5 : 0,
        tx = forest.x + forest.vx * lead,
        ty = forest.y + forest.vy * lead,
        n = Math.hypot(tx - e.x, ty - e.y) || 1;
      e.x += ((tx - e.x) / n) * e.speed * dt + Math.sin(e.phase) * 9 * dt;
      e.y += ((ty - e.y) / n) * e.speed * dt;
    }
    if (Math.hypot(e.x - e.lastTrackX, e.y - e.lastTrackY) > 35) {
      forest.tracks.push({ x: e.x, y: e.y, type: e.type, life: 5 });
      if (forest.tracks.length > 280) forest.tracks.shift();
      e.lastTrackX = e.x;
      e.lastTrackY = e.y;
    }
    for (let j = forest.shots.length - 1; j >= 0; j--) {
      const q = forest.shots[j];
      if (Math.hypot(q.x - e.x, q.y - e.y) < 34) {
        forest.shots.splice(j, 1);
        e.hp--;
        if (e.hp <= 0) {
          forest.enemies.splice(i, 1);
          score += 120;
          forest.score += 120;
          chime();
          break;
        }
      }
    }
    if (!forest.enemies.includes(e)) continue;
    if (forest.invuln <= 0 && Math.hypot(forest.x - e.x, forest.y - e.y) < 38) {
      forest.hp--;
      forest.invuln = 1.12;
      forest.x = clamp(
        forest.x + (forest.x - e.x) * 0.8,
        35,
        forest.worldW - 35,
      );
      forest.y = clamp(forest.y + 52, forest.targetY + 25, forest.startY - 20);
      e.x = clamp(e.x + (e.x - forest.x) * 0.5, 35, forest.worldW - 35);
      showToast(`ПОГОНЯ ЗБИЛА ЗІ СТЕЖКИ · ♥ ${forest.hp}`);
      if (forest.hp <= 0) {
        showForestFail();
        return;
      }
    }
  }
  forest.hazards.forEach((h) => {
    if (!h.armed) return;
    h.phase += dt * 4;
    const d = Math.hypot(forest.x - h.x, forest.y - h.y);
    if (h.type === "bog") {
      if (d < 64) forest.mud = 0.7;
    } else if (d < 100) {
      h.warn = (h.warn || 0) + dt;
      if (h.warn > 0.72) {
        h.armed = false;
        if (d < 58 && forest.invuln <= 0) {
          forest.hp--;
          forest.invuln = 1.05;
          showToast(`МІНА · ♥ ${forest.hp}`);
          if (forest.hp <= 0) showForestFail();
        }
      }
    } else h.warn = 0;
  });
  if (gameEnded) return;
  const goal = forestGoal(),
    goalDist = Math.hypot(forest.x - goal.x, forest.y - goal.y);
  if (forest.checkpointIndex < forest.waypoints.length && goalDist < 108) {
    const q = forest.waypoints[forest.checkpointIndex];
    q.done = true;
    forest.checkpointIndex++;
    forest.hp = Math.min(6, forest.hp + 1);
    score += 250;
    forest.score += 250;
    document.getElementById("delivered").textContent =
      `${forest.checkpointIndex} / 4`;
    document.getElementById("objectiveTitle").textContent =
      forest.checkpointIndex < 4
        ? `МАРКЕР ${forest.checkpointIndex + 1} / 4 · КОМПАС`
        : "УСІ МАРКЕРИ ЗІБРАНО · ДО ПАРКАНУ";
    showToast(`МАЯК ${forest.checkpointIndex} / 4 · +1 СИЛА · +250 ОЧОК`);
    for (let n = 0; n < 2; n++) spawnForestEnemy();
  } else if (
    forest.checkpointIndex === forest.waypoints.length &&
    Math.hypot(forest.x - 1300, forest.y - 450) < 112 &&
    forest.phase === "run"
  ) {
    forest.phase = "cut";
    forest.cutProgress = 0;
    forest.x = 1300;
    forest.y = 450;
    // Give the player a quiet interaction window at the fence. Pursuers
    // otherwise keep knocking them away while they hold the cut key.
    forest.enemies = [];
    forest.hazards.forEach((hazard) => (hazard.armed = false));
    forest.invuln = 2.5;
    showToast("ЗНАЙДИ КУСАЧКИ · УТРИМУЙ E БІЛЯ ДРОТУ");
  }
  if (forest.phase === "cut") {
    const close = Math.hypot(forest.x - 1300, forest.y - 450) < 120;
    if (close && keyDown("KeyE"))
      forest.cutProgress = Math.min(1.5, forest.cutProgress + dt);
    else forest.cutProgress = Math.max(0, forest.cutProgress - dt * 0.55);
    if (forest.cutProgress >= 1.5) {
      forest.phase = "cutDone";
      forest.ending = 0.01;
      forest.enemies = [];
      chime();
      showToast("ДРІТ ПЕРЕРІЗАНО · ПРОСКАКУЙ У ПРОХІД");
    }
  }
  forest.cameraX +=
    (clamp(forest.x - W / 2, 0, forest.worldW - W) - forest.cameraX) *
    Math.min(1, dt * 6);
  forest.cameraY +=
    (clamp(forest.y - H * 0.62, 0, forest.worldH - H) - forest.cameraY) *
    Math.min(1, dt * 6);
  forest.screenX = forest.x - forest.cameraX;
  forest.screenY = forest.y - forest.cameraY;
  document.getElementById("score").textContent = String(score).padStart(4, "0");
  if (toastTimer > 0) {
    toastTimer -= dt;
    if (toastTimer <= 0)
      document.getElementById("toast").classList.remove("show");
  }
}
function drawForest(t) {
  ctx.clearRect(0, 0, W, H);
  const cameraX = forest.cameraX,
    cameraY = forest.cameraY;
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, "#a5c871");
  bg.addColorStop(0.45, "#7fa64c");
  bg.addColorStop(1, "#587b40");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);
  for (
    let y = Math.floor(cameraY / 128) * 128;
    y < cameraY + H + 128;
    y += 128
  ) {
    for (
      let x = Math.floor(cameraX / 128) * 128;
      x < cameraX + W + 128;
      x += 128
    ) {
      const sx = x - cameraX,
        sy = y - cameraY,
        seed = Math.abs(((x / 128) | 0) * 31 + ((y / 128) | 0) * 17) % 8;
      ctx.fillStyle = seed % 2 ? "#87ad50" : "#80a44b";
      ctx.fillRect(sx, sy, 128, 128);
      ctx.strokeStyle = "#759846";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(sx, sy + 64);
      ctx.lineTo(sx + 128, sy + 64);
      ctx.stroke();
      for (let k = 0; k < 3; k++) {
        const px = sx + ((seed * 17 + k * 39) % 120),
          py = sy + ((seed * 31 + k * 47) % 120);
        ctx.fillStyle = k % 2 ? "#bfd46a" : "#e2d982";
        ctx.beginPath();
        ctx.arc(px, py, 2 + (k % 2), 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
  const pts = forestRoutePoints();
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.beginPath();
  pts.forEach((q, i) => {
    const x = q.x - cameraX,
      y = q.y - cameraY;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.strokeStyle = "#526640";
  ctx.lineWidth = 102;
  ctx.stroke();
  ctx.strokeStyle = "#b79a5f";
  ctx.lineWidth = 82;
  ctx.stroke();
  ctx.strokeStyle = "#d0b478";
  ctx.lineWidth = 3;
  ctx.setLineDash([18, 18]);
  ctx.stroke();
  ctx.setLineDash([]);
  for (const tree of forest.trees) {
    const sx = tree.x - cameraX,
      sy = tree.y - cameraY;
    if (sx < -100 || sx > W + 100 || sy < -100 || sy > H + 100) continue;
    const sway = Math.sin(t * 1.7 + tree.seed) * 3;
    ctx.fillStyle = "#34482c";
    ctx.beginPath();
    ctx.ellipse(
      sx + 6,
      sy + 17,
      tree.r * 1.05,
      tree.r * 0.65,
      0,
      0,
      Math.PI * 2,
    );
    ctx.fill();
    ctx.fillStyle = tree.kind === "pine" ? "#2d603e" : "#3e743e";
    for (let k = 0; k < 3; k++) {
      const ax = sx + sway + Math.cos(k * 2.1) * tree.r * 0.42,
        ay = sy + Math.sin(k * 2.1) * tree.r * 0.3;
      ctx.beginPath();
      ctx.arc(ax, ay, tree.r * 0.58, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = "#77a94e";
    ctx.beginPath();
    ctx.arc(sx - 7 + sway, sy - 8, tree.r * 0.28, 0, Math.PI * 2);
    ctx.fill();
  }
  for (const q of forest.tracks) {
    const x = q.x - cameraX,
      y = q.y - cameraY;
    if (x < 0 || x > W || y < 0 || y > H) continue;
    ctx.globalAlpha = (q.life / (q.type === "hero" ? 7 : 5)) * 0.6;
    ctx.strokeStyle =
      q.type === "hero"
        ? "#f1df9b"
        : q.type === "dog"
          ? "#c48c54"
          : q.type === "bear"
            ? "#756152"
            : "#df6d62";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.ellipse(x, y, 10, 4, Math.sin(x + y), 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
  for (const h of forest.hazards) {
    const x = h.x - cameraX,
      y = h.y - cameraY;
    if (x < -45 || x > W + 45 || y < -45 || y > H + 45) continue;
    if (h.type === "bog") {
      ctx.fillStyle = "#244f52";
      ctx.beginPath();
      ctx.ellipse(x, y, 40, 26, Math.sin(t) * 0.08, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#77b9a3";
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.fillStyle = "#9bd7c3";
      ctx.font = "bold 9px Arial";
      ctx.textAlign = "center";
      ctx.fillText("БОЛОТО · ПОВІЛЬНО", x, y + 4);
    } else if (h.armed) {
      ctx.fillStyle = h.warn > 0 ? "#ff7e46" : "#992f32";
      ctx.beginPath();
      ctx.arc(x, y, 11 + Math.sin(t * 8) * 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = h.warn > 0 ? "#ffe16b" : "#e85d43";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, h.warn > 0 ? 50 : 20, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = "#fff1b7";
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  for (const shot of forest.shots)
    drawVrSyrnyk(shot.x - cameraX, shot.y - cameraY, 13);
  for (const e of forest.enemies) {
    const x = e.x - cameraX,
      y = e.y - cameraY;
    if (x < -70 || x > W + 70 || y < -70 || y > H + 70) continue;
    if (e.type === "bear" && e.windup > 0) {
      ctx.strokeStyle = "#ff8a4c";
      ctx.globalAlpha = 0.45 + 0.3 * Math.sin(t * 14);
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(x, y, 44 + Math.sin(t * 8) * 5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
    drawForestEnemy({ ...e, x, y }, t);
  }
  const fenceY = forest.targetY - cameraY;
  if (fenceY > -120 && fenceY < H + 130) {
    drawForestFence(fenceY, forest.phase === "cutDone" && forest.ending > 1);
    drawForestFlags(245, fenceY - 154);
    drawForestFlags(W - 330, fenceY - 154);
  }
  drawForestHero(
    forest.x - cameraX,
    forest.y - cameraY,
    t,
    forest.phase === "cut",
  );
  const target = forestGoal();
  drawForestCompass(W - 85, H - 95, forest.x, forest.y, target.x, target.y);
  drawForestMap();
  ctx.fillStyle = "#0c2018eD";
  rounded(ctx, 18, 15, 392, 103, 11);
  ctx.fillStyle = "#fff1ce";
  ctx.font = "900 15px Arial";
  ctx.textAlign = "left";
  ctx.fillText("ЛІС · МАРШРУТ УТЕЧІ", 31, 39);
  ctx.fillStyle = "#f1d989";
  ctx.font = "bold 11px Arial";
  ctx.fillText(
    `МАЯКИ ${forest.checkpointIndex}/4   ·   ♥ ${forest.hp}   ·   ОЧКИ ${String(forest.score).padStart(4, "0")}`,
    31,
    60,
  );
  ctx.fillStyle = "#26372c";
  rounded(ctx, 31, 70, 364, 8, 4);
  ctx.fillStyle = "#77e1b5";
  rounded(ctx, 33, 72, (360 * forest.checkpointIndex) / 4, 4, 2);
  ctx.fillStyle = "#e3ead6";
  ctx.font = "bold 10px Arial";
  ctx.fillText("WASD · РУХ    SPACE · СИРНИК    SHIFT · РИВОК", 31, 100);
  if (forest.phase === "cut") {
    ctx.fillStyle = "#0b1714ee";
    rounded(ctx, W / 2 - 170, H - 92, 340, 55, 9);
    ctx.fillStyle = "#fff1cf";
    ctx.font = "bold 12px Arial";
    ctx.textAlign = "center";
    ctx.fillText("УТРИМУЙ E · ПЕРЕРІЗАТИ ДРІТ", W / 2, H - 70);
    ctx.fillStyle = "#293a34";
    rounded(ctx, W / 2 - 140, H - 57, 280, 9, 4);
    ctx.fillStyle = "#ffd269";
    rounded(ctx, W / 2 - 137, H - 54, (274 * forest.cutProgress) / 1.5, 4, 2);
  } else if (forest.phase === "run") {
    const goalDist = Math.hypot(forest.x - target.x, forest.y - target.y);
    if (goalDist < 210) {
      ctx.fillStyle = "#0b1714e8";
      rounded(ctx, W / 2 - 100, H - 75, 200, 32, 8);
      ctx.fillStyle = "#fff2cb";
      ctx.font = "bold 11px Arial";
      ctx.textAlign = "center";
      ctx.fillText(
        forest.checkpointIndex < 4 ? "ІДИ ДО МАРКЕРА" : "E · КУСАЧКИ",
        W / 2,
        H - 54,
      );
    }
  }
  if (forest.ending > 0 && forest.phase === "cutDone") {
    ctx.fillStyle = "#f6edce";
    ctx.font = "900 17px Arial";
    ctx.textAlign = "center";
    ctx.fillText("ДРІТ ПЕРЕРІЗАНО · ПРОСКАКУЙ У ПРОХІД", W / 2, 145);
  }
}
function drawForestMap() {
  const x = 1030,
    y = 15,
    w = 235,
    h = 140;
  ctx.fillStyle = "#0b1b19e8";
  rounded(ctx, x, y, w, 140, 10);
  ctx.fillStyle = "#fff0ca";
  ctx.font = "bold 10px Arial";
  ctx.textAlign = "center";
  ctx.fillText("СТЕЖКА · НАСТУПНИЙ МАЯК", x + w / 2, y + 16);
  const pts = forestRoutePoints(),
    sx = (w - 30) / forest.worldW,
    sy = 100 / (forest.startY - forest.targetY),
    ox = x + 15,
    oy = y + 23;
  ctx.strokeStyle = "#a99566";
  ctx.lineWidth = 3;
  ctx.beginPath();
  pts.forEach((q, i) => {
    const px = ox + q.x * sx,
      py = oy + (forest.startY - q.y) * sy;
    if (i) ctx.lineTo(px, py);
    else ctx.moveTo(px, py);
  });
  ctx.stroke();
  for (const q of forest.waypoints) {
    ctx.fillStyle = q.done ? "#65efba" : "#ffcc65";
    ctx.beginPath();
    ctx.arc(
      ox + q.x * sx,
      oy + (forest.startY - q.y) * sy,
      3.5,
      0,
      Math.PI * 2,
    );
    ctx.fill();
  }
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(
    ox + forest.x * sx,
    oy + (forest.startY - forest.y) * sy,
    4.5,
    0,
    Math.PI * 2,
  );
  ctx.fill();
  ctx.fillStyle = "#e34e54";
  ctx.beginPath();
  ctx.arc(ox + 1300 * sx, oy + (forest.startY - 400) * sy, 4, 0, Math.PI * 2);
  ctx.fill();
}
function drawForestHero(x, y, t, cutting) {
  ctx.save();
  ctx.translate(x, y + Math.sin(t * 13) * 1.5);
  ctx.fillStyle = "#0005";
  ctx.beginPath();
  ctx.ellipse(3, 18, 25, 14, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#17282c";
  rounded(ctx, -13, 4, 10, 23, 4);
  rounded(ctx, 3, 4, 10, 23, 4);
  ctx.fillStyle = "#d0b67c";
  rounded(ctx, -16, 22, 13, 7, 3);
  rounded(ctx, 3, 22, 13, 7, 3);
  ctx.fillStyle = "#d4774e";
  rounded(ctx, -17, -18, 34, 31, 8);
  ctx.fillStyle = "#f0c393";
  ctx.beginPath();
  ctx.arc(0, -29, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#4a3528";
  ctx.beginPath();
  ctx.arc(0, -34, 14, Math.PI, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#334d3e";
  rounded(ctx, -21, 0, 42, 14, 6);
  ctx.fillStyle = "#c34b44";
  rounded(ctx, cutting ? 15 : 12, -18, cutting ? 15 : 10, 27, 4);
  if (cutting) {
    ctx.fillStyle = "#e6dbb2";
    ctx.font = "bold 24px Arial";
    ctx.textAlign = "center";
    ctx.fillText("✂", 33, -23);
  }
  ctx.restore();
}
function drawForestEnemy(e, t) {
  ctx.save();
  ctx.translate(e.x, e.y + Math.sin(t * 6 + e.phase) * 2);
  const col =
    e.type === "dog" ? "#9a6738" : e.type === "bear" ? "#514033" : "#626f46";
  ctx.fillStyle = "#0005";
  ctx.beginPath();
  ctx.ellipse(2, 16, e.type === "bear" ? 28 : 23, 13, 0, 0, Math.PI * 2);
  ctx.fill();
  if (e.type === "dog") {
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.ellipse(0, 0, 23, 13, Math.sin(e.phase) * 0.05, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(15, -7, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#f4d78c";
    ctx.beginPath();
    ctx.arc(18, -9, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#3f3426";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-12, 9);
    ctx.lineTo(-15, 18);
    ctx.moveTo(10, 9);
    ctx.lineTo(13, 18);
    ctx.stroke();
  } else if (e.type === "bear") {
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.ellipse(0, 2, 27, 20, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(0, -15, 16, 0, Math.PI * 2);
    ctx.arc(-12, -26, 6, 0, Math.PI * 2);
    ctx.arc(12, -26, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#e5c493";
    ctx.beginPath();
    ctx.ellipse(0, -11, 7, 5, 0, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.fillStyle = "#14211d";
    rounded(ctx, -11, 5, 8, 21, 3);
    rounded(ctx, 4, 5, 8, 21, 3);
    ctx.fillStyle = col;
    rounded(ctx, -17, -19, 34, 29, 7);
    ctx.fillStyle = "#d1ae86";
    ctx.beginPath();
    ctx.arc(0, -27, 13, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#4c593e";
    rounded(ctx, -15, -39, 30, 11, 5);
    ctx.fillStyle = "#f1d381";
    ctx.fillRect(-4, -36, 8, 3);
    ctx.fillStyle = "#ed705c";
    ctx.fillRect(-17, -7, 34, 4);
  }
  ctx.restore();
}
function drawForestFence(y, cut) {
  ctx.fillStyle = "#383f40";
  ctx.fillRect(0, y, W, 14);
  ctx.fillRect(0, y + 70, W, 10);
  for (let x = 0; x < W; x += 38) {
    ctx.fillStyle = "#45494a";
    ctx.fillRect(x, y - 14, 6, 102);
  }
  ctx.strokeStyle = "#d3d7cb";
  ctx.lineWidth = 2;
  for (let k = 0; k < 4; k++) {
    ctx.beginPath();
    ctx.moveTo(0, y + 17 + k * 13);
    ctx.lineTo(W, y + 17 + k * 13);
    ctx.stroke();
  }
  if (cut) {
    ctx.fillStyle = "#87b960";
    ctx.fillRect(W / 2 - 48, y - 15, 96, 99);
    ctx.strokeStyle = "#ffe28c";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(W / 2 - 37, y + 20);
    ctx.lineTo(W / 2 - 12, y + 43);
    ctx.lineTo(W / 2 + 2, y + 16);
    ctx.lineTo(W / 2 + 17, y + 44);
    ctx.lineTo(W / 2 + 38, y + 22);
    ctx.stroke();
  }
}
function drawForestFlags(x, y = 275) {
  ctx.fillStyle = "#a9b9a5";
  ctx.fillRect(x, y, 4, 140);
  ctx.fillStyle = "#d52c3b";
  ctx.fillRect(x + 4, y + 5, 82, 28);
  ctx.fillStyle = "#218c59";
  ctx.fillRect(x + 4, y + 33, 82, 14);
  ctx.fillStyle = "#fff";
  ctx.fillRect(x + 4, y + 5, 12, 42);
  ctx.fillStyle = "#c72b3b";
  for (let yy = y + 7; yy < y + 49; yy += 8) {
    ctx.fillRect(x + 6, yy, 3, 4);
    ctx.fillRect(x + 11, yy + 3, 3, 3);
  }
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 2;
  ctx.strokeRect(x + 4, y + 5, 82, 42);
}
function drawForestCompass(x, y, px, py, targetX, targetY) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "#11221be8";
  ctx.beginPath();
  ctx.arc(0, 0, 42, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#e9e6d288";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = "#f3f0dd";
  ctx.font = "bold 10px Arial";
  ctx.textAlign = "center";
  ctx.fillText("N", 0, -28);
  ctx.fillText("S", 0, 33);
  ctx.fillText("W", -30, 4);
  ctx.fillText("E", 30, 4);
  const a = Math.atan2(targetX - px, py - targetY);
  ctx.rotate(a);
  ctx.fillStyle = "#ffca61";
  ctx.beginPath();
  ctx.moveTo(0, -25);
  ctx.lineTo(-8, 8);
  ctx.lineTo(0, 4);
  ctx.lineTo(8, 8);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#67f2c3";
  ctx.beginPath();
  ctx.arc(0, 0, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}
function showForestVictory() {
  running = false;
  gameEnded = true;
  const layer = document.getElementById("intro");
  layer.classList.remove("hidden");
  layer.innerHTML = `<section class="card"><div class="eyebrow">РІВЕНЬ 6 · ЛІС ЗАЛИШИВСЯ ПОЗАДУ</div><h1>Дріт перерізано.<br><em>Герой уже біжить.</em></h1><p>Після чотирьох маяків герой перерізав дріт і вибіг із лісу на сонячну дорогу.</p><div class="mission"><span>🌲 Ліс: пройдено</span><span>🥞 Сирники: тактичний запас</span><span>🚩 Прапор Білорусі: на місці</span></div><button id="forestReplayBtn">ПОВТОРИТИ РІВЕНЬ 6　↻</button><button id="forestToGermanyBtn" class="secondary">ПЕРЕЙТИ ДО РІВНЯ 7 · НІМЕЧЧИНА　→</button><button id="forestDoneBtn" class="secondary">ДО ГОЛОВНОГО МЕНЮ</button></section>`;
  document.getElementById("forestReplayBtn").onclick = startForestLevel;
  document.getElementById("forestToGermanyBtn").onclick = showGermanyTransition;
  document.getElementById("forestDoneBtn").onclick = () => location.reload();
}
function showForestFail() {
  running = false;
  gameEnded = true;
  const layer = document.getElementById("intro");
  layer.classList.remove("hidden");
  layer.innerHTML = `<section class="card"><div class="eyebrow">РІВЕНЬ 6 · ЛІС</div><h1>Лісова команда.<br><em>Занадто близько.</em></h1><p>Прикордонники, собаки й ведмеді перехопили героя. Віднови запас сил і спробуй ще раз.</p><button id="forestRetryBtn">ПОВТОРИТИ РІВЕНЬ 6　↻</button></section>`;
  document.getElementById("forestRetryBtn").onclick = startForestLevel;
}
