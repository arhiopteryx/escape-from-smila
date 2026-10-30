function germanyGoal() {
  return !germany.banked
    ? germany.machine
    : germany.shopping
      ? { x: 1460, y: 835 }
      : germany.meet;
}
function showGermanyTransition() {
  saveCampaignChapter(8);
  const layer = document.getElementById("intro");
  layer.classList.remove("hidden");
  layer.innerHTML = `<section class="card"><div class="eyebrow">РІВЕНЬ 7 · НІЧНЕ МІСТО · НІМЕЧЧИНА</div><h1>Новий кордон.<br><em>Челендж є. Цінників нема.</em></h1><p>Герой влаштовує TikTok-челендж: назбирати 12 пляшок і здати їх у Lidl Pfand. Насправді він дуже багатий і цінників не дивиться — це чисто контент. Колишня з Росії тим часом лишила дев’ять голосових; «кста, не зараз».</p><div class="mission"><span>🍾 12 пляшок × €0,25 = €3,00</span><span>♻️ Рюкзак: максимум 2 · Lidl Pfand</span><span>🛒 Обери 3 товари без цінників</span><span>💛 Знайди Жінку Непальця</span></div><button id="startGermanyBtn">ШУКАТИ PFAND　→</button><button id="germanyMenuBtn" class="secondary">ДО ГОЛОВНОГО МЕНЮ</button></section>`;
  document.getElementById("startGermanyBtn").onclick = startGermanyLevel;
  document.getElementById("germanyMenuBtn").onclick = () => location.reload();
}
function startGermanyLevel() {
  saveCampaignChapter(8);
  focusGame();
  stage = 8;
  gameEnded = false;
  running = true;
  paused = false;
  germany = {
    worldW: 2500,
    worldH: 1900,
    x: 150,
    y: 1700,
    vx: 0,
    vy: 0,
    cameraX: 0,
    cameraY: 1100,
    carried: 0,
    deposited: 0,
    goal: 12,
    banked: false,
    shopping: false,
    shopCount: 0,
    shopProducts: [],
    meet: { x: 2310, y: 1690 },
    machine: { x: 1280, y: 920 },
    items: [],
    npcs: [],
    rivals: [],
    cars: [],
    scooters: [],
    bins: [],
    speechCooldown: 0,
    fullHint: 0,
  };
  for (let i = 0; i < 12; i++) {
    const x = 180 + Math.random() * 2140,
      y = 160 + Math.random() * 1600;
    germany.npcs.push({
      x,
      y,
      dx: Math.random() - 0.5,
      dy: Math.random() - 0.5,
      dropTimer: 1 + Math.random() * 5,
      barkTimer: 1 + Math.random() * 3,
      bark: "",
      barkLife: 0,
    });
  }
  for (const y of [250, 800, 1350, 1700])
    for (let i = 0; i < 3; i++)
      germany.cars.push({
        axis: "h",
        x: Math.random() * germany.worldW,
        y: y + (i % 2 ? 34 : -34),
        speed: 90 + Math.random() * 110,
        dir: Math.random() < 0.5 ? 1 : -1,
        color: ["#d4dbe0", "#cf5349", "#62a1a3", "#e3c76d"][
          Math.floor(Math.random() * 4)
        ],
      });
  for (const x of [200, 700, 1200, 1700, 2200])
    for (let i = 0; i < 2; i++)
      germany.cars.push({
        axis: "v",
        x: x + (i % 2 ? 34 : -34),
        y: Math.random() * germany.worldH,
        speed: 85 + Math.random() * 105,
        dir: Math.random() < 0.5 ? 1 : -1,
        color: ["#c4d1d1", "#bb6552", "#657eab", "#d6a84d"][
          Math.floor(Math.random() * 4)
        ],
      });
  for (let i = 0; i < 12; i++)
    germany.scooters.push({
      x: Math.random() * germany.worldW,
      y: [250, 800, 1350, 1700][i % 4] + (i % 2 ? 56 : -56),
      speed: 60 + Math.random() * 70,
      dir: i % 2 ? 1 : -1,
      color: ["#5ae3d0", "#f0be5d", "#df7655"][i % 3],
    });
  for (let i = 0; i < 20; i++)
    germany.bins.push({
      x: 80 + Math.random() * 2340,
      y: 100 + Math.random() * 1700,
    });
  germany.items = [
    { x: 390, y: 1650, life: 30 },
    { x: 550, y: 1600, life: 30 },
    { x: 810, y: 1450, life: 27 },
    { x: 1350, y: 1150, life: 30 },
    { x: 1780, y: 1500, life: 28 },
    { x: 2290, y: 1200, life: 30 },
  ];
  germany.shopProducts = [
    { x: 1430, y: 760, name: "КОЛОНКА", color: "#6fd9c8", got: false },
    { x: 1500, y: 805, name: "ПЛЮШ", color: "#f296bd", got: false },
    { x: 1420, y: 850, name: "КОНСОЛЬ", color: "#95a8ed", got: false },
    { x: 1515, y: 900, name: "ФУТБОЛКА", color: "#f0c46a", got: false },
    { x: 1390, y: 915, name: "ТІКТОК-ШТАТИВ", color: "#9add77", got: false },
  ];
  germany.rivals = Array.from({ length: 3 }, (_, i) => ({
    x: 220 + Math.random() * 2050,
    y: 240 + Math.random() * 1550,
    speed: 76 + Math.random() * 32,
    target: null,
    kind: i % 3,
  }));
  keys.clear();
  gamepadKeys.clear();
  boostPressed = false;
  interactPressed = false;
  document
    .getElementById("game")
    .classList.remove(
      "arcade-mode",
      "cafe-mode",
      "training-mode",
      "forest-mode",
    );
  document.getElementById("game").classList.add("germany-mode");
  document.querySelector(".mapbox").style.display = "block";
  document.querySelector(".maplabel").textContent = "ЖОВТИЙ · PFAND / МЕТА";
  document.querySelector(".speed").style.display = "none";
  setHint(
    "РУХ <b>WASD / СТРІЛКИ</b>　 <b>E</b> ВІДВОЛІКТИ СУПЕРНИКА　 РУКИ: <b>2 ПЛЯШКИ</b>",
  );
  document.getElementById("delivered").parentElement.firstChild.textContent =
    "🍾 PFAND ";
  document.getElementById("delivered").textContent = "0 / 12";
  document.getElementById("timer").textContent = "€0.00";
  document.getElementById("objectiveTitle").textContent = "ЗБЕРИ 12 ПЛЯШОК";
  document.getElementById("objectiveText").textContent =
    "Місто велике й живе: стеж за машинами, перехожими та самокатчиками. Здавай пляшки в Lidl Pfand.";
  document.getElementById("intro").classList.add("hidden");
  document.getElementById("pause").classList.remove("show");
  audioStart();
  showToast("12 ПЛЯШОК = €3 · НОСИ НЕ БІЛЬШЕ ДВОХ");
  last = performance.now();
  scheduleLoop();
}
function germanBark(n) {
  const lines = [
    "Scheiß Ausländer!",
    "Geh arbeiten!",
    "Geh zurück in dein Land!",
    "Verpiss dich!",
    "Fluggegecheimen!",
    "Fahr doch zurück in die Ukraine!",
    "Deutschland den Deutschen!",
    "Ausländer raus!",
  ];
  n.bark = lines[Math.floor(Math.random() * lines.length)];
  n.barkLife = 2.7;
  germany.speechCooldown = 4.6;
  if ("speechSynthesis" in window && "SpeechSynthesisUtterance" in window) {
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(n.bark);
      u.lang = "de-DE";
      u.rate = 0.9;
      u.pitch = 0.82;
      window.speechSynthesis.speak(u);
    } catch (e) {}
  }
}
function updateGermany(dt, t) {
  const { x: dx, y: dy } = movementAxes();
  germany.vx += (dx * 365 - germany.vx) * Math.min(1, dt * 10);
  germany.vy += (dy * 365 - germany.vy) * Math.min(1, dt * 10);
  germany.x = clamp(germany.x + germany.vx * dt, 36, germany.worldW - 36);
  germany.y = clamp(germany.y + germany.vy * dt, 120, germany.worldH - 40);
  germany.cameraX = clamp(germany.x - W / 2, 0, germany.worldW - W);
  germany.cameraY = clamp(germany.y - H / 2, 0, germany.worldH - H);
  if (interactPressed) {
    interactPressed = false;
    const rival = germany.rivals.reduce(
      (best, r) =>
        Math.hypot(r.x - germany.x, r.y - germany.y) <
        (best ? Math.hypot(best.x - germany.x, best.y - germany.y) : 92)
          ? r
          : best,
      null,
    );
    if (rival && Math.hypot(rival.x - germany.x, rival.y - germany.y) < 92) {
      rival.stun = 1.65;
      showToast("ГЕЙ, ВІДВОЛІК РИВАЛА · ПІДБИРАЙ ПЛЯШКУ");
      tone(240, 0.08, "triangle", 0.03, -90);
    } else showToast("ПІДІЙДИ ДО СУПЕРНИКА, ЩОБ ВІДВОЛІКТИ ЙОГО");
  }
  germany.speechCooldown = Math.max(0, germany.speechCooldown - dt);
  germany.fullHint = Math.max(0, germany.fullHint - dt);
  for (const n of germany.npcs) {
    n.x = clamp(n.x + n.dx * 58 * dt, 45, germany.worldW - 45);
    n.y = clamp(n.y + n.dy * 52 * dt, 120, germany.worldH - 45);
    if (n.x < 60 || n.x > germany.worldW - 60) n.dx *= -1;
    if (n.y < 130 || n.y > germany.worldH - 60) n.dy *= -1;
    if (Math.random() < dt * 0.2) {
      n.dx += (Math.random() - 0.5) * 0.9;
      n.dy += (Math.random() - 0.5) * 0.9;
      const d = Math.hypot(n.dx, n.dy) || 1;
      n.dx /= d;
      n.dy /= d;
    }
    n.dropTimer -= dt;
    n.barkLife = Math.max(0, n.barkLife - dt);
    n.barkTimer = Math.max(0, n.barkTimer - dt);
    if (n.dropTimer <= 0 && germany.items.length < 8) {
      const a = Math.random() * Math.PI * 2;
      germany.items.push({
        x: clamp(n.x + Math.cos(a) * 35, 45, germany.worldW - 45),
        y: clamp(n.y + Math.sin(a) * 35, 130, germany.worldH - 45),
        life: 24 + Math.random() * 8,
      });
      n.dropTimer = 8 + Math.random() * 5;
    }
    if (
      Math.hypot(germany.x - n.x, germany.y - n.y) < 145 &&
      n.barkTimer <= 0 &&
      germany.speechCooldown <= 0
    ) {
      germanBark(n);
      n.barkTimer = 5 + Math.random() * 2;
    }
  }
  for (const c of germany.cars) {
    if (c.axis === "h") {
      c.x += c.speed * c.dir * dt;
      if (c.dir > 0 && c.x > germany.worldW + 100) c.x = -100;
      if (c.dir < 0 && c.x < -100) c.x = germany.worldW + 100;
    } else {
      c.y += c.speed * c.dir * dt;
      if (c.dir > 0 && c.y > germany.worldH + 100) c.y = -100;
      if (c.dir < 0 && c.y < -100) c.y = germany.worldH + 100;
    }
    if (Math.abs(germany.x - c.x) < 34 && Math.abs(germany.y - c.y) < 27) {
      const d = Math.hypot(germany.x - c.x, germany.y - c.y) || 1;
      germany.x = clamp(
        germany.x + ((germany.x - c.x) / d) * 60,
        36,
        germany.worldW - 36,
      );
      germany.y = clamp(
        germany.y + ((germany.y - c.y) / d) * 60,
        120,
        germany.worldH - 40,
      );
      showToast("УВАГА, МАШИНА!");
    }
  }
  for (const c of germany.scooters) {
    c.x += c.speed * c.dir * dt;
    if (c.x > germany.worldW + 70) c.x = -70;
    if (c.x < -70) c.x = germany.worldW + 70;
    if (Math.hypot(germany.x - c.x, germany.y - c.y) < 28) {
      germany.x = clamp(germany.x - c.dir * 32, 36, germany.worldW - 36);
      showToast("САМОКАТЧИК ПРОМЧАВ ПОВЗ!");
    }
  }
  for (let i = germany.items.length - 1; i >= 0; i--) {
    const b = germany.items[i];
    b.life -= dt;
    if (b.life <= 0) {
      germany.items.splice(i, 1);
      continue;
    }
    if (
      germany.carried < 2 &&
      Math.hypot(germany.x - b.x, germany.y - b.y) < 32
    ) {
      germany.items.splice(i, 1);
      germany.carried++;
      tone(680, 0.07, "sine", 0.035, 120);
      showToast("ПЛЯШКА В РЮКЗАКУ · €0,25");
    }
  }
  for (const r of germany.rivals) {
    let target = null,
      dist = 1e9;
    for (const b of germany.items) {
      const d = Math.hypot(r.x - b.x, r.y - b.y);
      if (d < dist) {
        dist = d;
        target = b;
      }
    }
    r.target = target;
    if (r.stun > 0) {
      r.stun = Math.max(0, r.stun - dt);
      r.lastStole = r.stun;
    } else if (target) {
      const dx = target.x - r.x,
        dy = target.y - r.y,
        d = Math.hypot(dx, dy) || 1;
      r.x += (dx / d) * r.speed * dt;
      r.y += (dy / d) * r.speed * dt;
      if (d < 22) {
        const i = germany.items.indexOf(target);
        if (i >= 0) {
          germany.items.splice(i, 1);
          r.lastStole = 1.4;
        }
      }
    } else {
      r.lastStole = Math.max(0, (r.lastStole || 0) - dt);
      r.x = clamp(r.x + Math.sin(t + r.x) * 15 * dt, 35, germany.worldW - 35);
    }
  }
  if (
    germany.carried > 0 &&
    Math.hypot(germany.x - germany.machine.x, germany.y - germany.machine.y) <
      76
  ) {
    const amount = germany.carried,
      deposit = Math.min(amount, germany.goal - germany.deposited);
    germany.deposited += deposit;
    germany.carried = 0;
    score += deposit * 25;
    document.getElementById("score").textContent = String(score).padStart(
      4,
      "0",
    );
    document.getElementById("delivered").textContent =
      `${germany.deposited} / ${germany.goal}`;
    document.getElementById("timer").textContent =
      `€${(germany.deposited * 0.25).toFixed(2)}`;
    tone(740, 0.12, "sine", 0.05, 200);
    showToast(`LIDL PFAND: +€${(deposit * 0.25).toFixed(2)}`);
    if (germany.deposited >= germany.goal) {
      germany.banked = true;
      germany.shopping = true;
      document.getElementById("objectiveTitle").textContent =
        "LIDL · ОБЕРИ 3 РЕЧІ";
      document.getElementById("objectiveText").textContent =
        "У героя немає бюджету — просто обери будь-які три товари. Цінників тут немає.";
      document.querySelector(".maplabel").textContent =
        "ФІОЛЕТОВИЙ · LIDL / ВИБЕРИ 3 ТОВАРИ";
      showToast("PFAND-ЧЕЛЕНДЖ ВИКОНАНО · ЧАС ЗАКУПІВ");
    } else {
      document.getElementById("objectiveTitle").textContent =
        `ЗБЕРИ ЩЕ ${germany.goal - germany.deposited} ПЛЯШОК`;
      document.getElementById("objectiveText").textContent =
        "Збирай не більше двох за раз і повертайся до Lidl Pfand.";
    }
  }
  if (germany.shopping) {
    for (const item of germany.shopProducts) {
      if (
        !item.got &&
        Math.hypot(germany.x - item.x, germany.y - item.y) < 42
      ) {
        item.got = true;
        germany.shopCount++;
        score += 500;
        showToast(
          `ВІЗЬМЕМО · ${item.name} · РАХУЄМО НЕ ЦІННИКИ (${germany.shopCount}/3)`,
        );
        if (germany.shopCount >= 3) {
          germany.shopping = false;
          document.getElementById("objectiveTitle").textContent =
            "ЗУСТРІЧ ІЗ ЖІНКОЮ НЕПАЛЬЦЯ";
          document.getElementById("objectiveText").textContent =
            "Вирушай до східного скверу. TikTok уже записав, покупки зроблені.";
          document.querySelector(".maplabel").textContent =
            "РОЖЕВИЙ · МІСЦЕ ЗУСТРІЧІ";
          chime();
        }
      }
    }
  }
  if (
    germany.banked &&
    !germany.shopping &&
    Math.hypot(germany.x - germany.meet.x, germany.y - germany.meet.y) < 55
  ) {
    showGermanyVictory();
    return;
  }
  document.getElementById("delivered").textContent =
    `${germany.deposited} / 12 · ${germany.carried}/2`;
  if (toastTimer > 0) {
    toastTimer -= dt;
    if (toastTimer <= 0)
      document.getElementById("toast").classList.remove("show");
  }
}
function drawGermany(t) {
  ctx.clearRect(0, 0, W, H);
  const cX = germany.cameraX,
    cY = germany.cameraY;
  ctx.save();
  ctx.translate(-cX, -cY);
  const bg = ctx.createLinearGradient(0, cY, 0, cY + H);
  bg.addColorStop(0, "#a8c8d1");
  bg.addColorStop(0.55, "#c4d6c8");
  bg.addColorStop(1, "#d5d4be");
  ctx.fillStyle = bg;
  ctx.fillRect(cX, cY, W, H);
  const roadsXg = [200, 700, 1200, 1700, 2200],
    roadsYg = [250, 800, 1350, 1700];
  for (const y of roadsYg) {
    ctx.fillStyle = "#8b928e";
    ctx.fillRect(0, y - 56, germany.worldW, 112);
    ctx.fillStyle = "#c2c5b5";
    ctx.fillRect(0, y - 58, germany.worldW, 5);
    ctx.fillRect(0, y + 53, germany.worldW, 5);
    ctx.fillStyle = "#626b69";
    ctx.fillRect(0, y - 42, germany.worldW, 84);
    ctx.strokeStyle = "#c5b887";
    ctx.lineWidth = 3;
    ctx.setLineDash([26, 22]);
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(germany.worldW, y);
    ctx.stroke();
    ctx.setLineDash([]);
  }
  for (const x of roadsXg) {
    ctx.fillStyle = "#8b928e";
    ctx.fillRect(x - 56, 0, 112, germany.worldH);
    ctx.fillStyle = "#c2c5b5";
    ctx.fillRect(x - 58, 0, 5, germany.worldH);
    ctx.fillRect(x + 53, 0, 5, germany.worldH);
    ctx.fillStyle = "#626b69";
    ctx.fillRect(x - 42, 0, 84, germany.worldH);
    ctx.strokeStyle = "#c5b887";
    ctx.lineWidth = 3;
    ctx.setLineDash([26, 22]);
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, germany.worldH);
    ctx.stroke();
    ctx.setLineDash([]);
  }
  for (let row = 0; row < 4; row++)
    for (let col = 0; col < 5; col++) {
      const bx = 50 + col * 500 + (row % 2) * 30,
        by = 45 + row * 480;
      if (bx > germany.worldW - 320) continue;
      ctx.fillStyle = "#89958f";
      rounded(ctx, bx, by, 330, 175, 12);
      ctx.fillStyle = ["#c6b99f", "#b8c1b5", "#d0c4ad", "#b6c4c2"][
        (row + col) % 4
      ];
      rounded(ctx, bx + 9, by + 10, 312, 156, 9);
      for (let wx = bx + 24; wx < bx + 305; wx += 42)
        for (let wy = by + 27; wy < by + 145; wy += 35) {
          ctx.fillStyle = (Math.floor(wx + wy) / 7) % 2 ? "#9fd6ed" : "#ffe3a0";
          ctx.fillRect(wx, wy, 18, 18);
        }
      ctx.fillStyle = "#262e3a";
      ctx.fillRect(bx + 18, by + 142, 294, 12);
      ctx.fillStyle = "#f1e5c3";
      ctx.fillRect(bx + 14, by + 8, 302, 5);
      ctx.fillStyle = "#343b3a";
      ctx.fillRect(bx + 150, by + 122, 32, 43);
    }
  for (const y of roadsYg)
    for (let x = 0; x < germany.worldW; x += 190) {
      ctx.fillStyle = "#eee5cf";
      ctx.fillRect(x, y - 55, 26, 8);
      ctx.fillRect(x, y + 47, 26, 8);
    }
  for (const b of germany.bins) drawGermanyBin(b.x, b.y);
  drawGermanyFlags(t);
  for (const c of germany.cars) drawGermanyCar(c);
  for (const c of germany.scooters) drawGermanyScooter(c, t);
  for (const b of germany.items) drawGermanyBottle(b.x, b.y, t);
  for (const n of germany.npcs) drawGermanyNpc(n.x, n.y, t, n.bark, n.barkLife);
  for (const r of germany.rivals) drawGermanyRival(r, t);
  drawPfandMachine(germany.machine.x, germany.machine.y);
  ctx.save();
  ctx.fillStyle = "#ffe15b";
  ctx.font = "900 16px Arial";
  ctx.textAlign = "center";
  ctx.shadowColor = "#ffcf45";
  ctx.shadowBlur = 9;
  ctx.fillText(
    "LIDL PFAND ↓",
    germany.machine.x,
    germany.machine.y - 88 + Math.sin(t * 3) * 3,
  );
  ctx.restore();
  if (germany.banked && !germany.shopping)
    drawGermanyWoman(germany.meet.x, germany.meet.y, t);
  if (germany.banked) {
    drawGermanyStore(1430, 835, t);
    for (const item of germany.shopProducts)
      if (!item.got)
        drawGermanyProduct(item.x, item.y, item.color, item.name, t);
  }
  drawGermanyHero(germany.x, germany.y, t);
  ctx.restore();
  ctx.fillStyle = "#f5e8cc";
  ctx.font = "bold 16px Arial,sans-serif";
  ctx.textAlign = "center";
  ctx.fillStyle = "#101923dd";
  rounded(ctx, W / 2 - 155, H - 78, 310, 39, 10);
  ctx.fillStyle = "#ffd479";
  ctx.font = "bold 14px Arial";
  ctx.textAlign = "center";
  ctx.fillText(
    `${germany.banked ? (germany.shopping ? `LIDL · ${germany.shopCount}/3 БЕЗ ЦІННИКІВ` : "ФІНАЛЬНИЙ МАРШРУТ") : "€" + (germany.deposited * 0.25).toFixed(2) + " / €3.00"} · РАЙОН ${Math.floor(germany.x / 500) + 1}`,
    W / 2,
    H - 53,
  );
  if (germany.carried === 2) {
    ctx.fillStyle = "#fff1b2";
    ctx.font = "bold 12px Arial";
    ctx.fillText("РЮКЗАК ПОВНИЙ · ДО LIDL PFAND", W / 2, H - 91);
  }
}
function drawGermanyStore(x, y, t) {
  ctx.save();
  ctx.fillStyle = "#0008";
  ctx.beginPath();
  ctx.ellipse(x, y + 44, 103, 20, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#344452";
  rounded(ctx, x - 93, y - 70, 186, 112, 10);
  ctx.fillStyle = "#dc252c";
  rounded(ctx, x - 88, y - 65, 176, 31, 7);
  ctx.fillStyle = "#fff";
  ctx.font = "900 20px Arial";
  ctx.textAlign = "center";
  ctx.fillText("LIDL", x, y - 43);
  ctx.fillStyle = "#f2d668";
  ctx.beginPath();
  ctx.arc(x, y - 52, 12 + Math.sin(t * 5) * 1.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#a4cdd2";
  rounded(ctx, x - 74, y - 25, 148, 57, 5);
  ctx.fillStyle = "#26323b";
  ctx.fillRect(x - 8, y - 24, 41, 56);
  ctx.fillStyle = "#e9dcb9";
  ctx.font = "bold 10px Arial";
  ctx.fillText("KEINE PREISSCHILDER", x, y + 26);
  ctx.restore();
}
function drawGermanyProduct(x, y, color, name, t) {
  ctx.save();
  ctx.translate(x, y + Math.sin(t * 4 + x) * 3);
  ctx.shadowColor = color;
  ctx.shadowBlur = 12;
  ctx.fillStyle = color;
  rounded(ctx, -15, -16, 30, 31, 6);
  ctx.shadowBlur = 0;
  ctx.fillStyle = "#1b2530";
  ctx.font = "bold 8px Arial";
  ctx.textAlign = "center";
  ctx.fillText(name, 0, 23);
  ctx.restore();
}
function drawGermanyBin(x, y) {
  ctx.fillStyle = "#0b131b";
  rounded(ctx, x - 20, y - 18, 40, 37, 6);
  ctx.fillStyle = "#377c6d";
  rounded(ctx, x - 16, y - 13, 32, 29, 4);
  ctx.fillStyle = "#a8c7b7";
  ctx.fillRect(x - 23, y - 20, 46, 5);
  ctx.fillStyle = "#e7ca7c";
  ctx.fillRect(x - 8, y - 5, 16, 9);
  ctx.fillStyle = "#17232b";
  ctx.font = "bold 7px Arial";
  ctx.textAlign = "center";
  ctx.fillText("PFAND", x, y + 1);
}
function drawGermanyWoman(x, y, t) {
  ctx.save();
  ctx.translate(x, y + Math.sin(t * 3) * 2);
  ctx.scale(0.94, 0.94);
  ctx.strokeStyle = "rgba(255,207,104,.75)";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(0, 0, 34 + Math.sin(t * 4) * 3, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = "#0009";
  ctx.beginPath();
  ctx.ellipse(1, 19, 23, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#202733";
  rounded(ctx, -14, 3, 11, 23, 4);
  rounded(ctx, 4, 3, 11, 23, 4);
  ctx.fillStyle = "#9b5f92";
  rounded(ctx, -19, -29, 38, 34, 9);
  ctx.fillStyle = "#d6a67e";
  ctx.beginPath();
  ctx.arc(0, -39, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#251e24";
  ctx.beginPath();
  ctx.arc(-1, -45, 15, Math.PI, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(13, -35, 7, 12, 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ffe9aa";
  ctx.font = "bold 13px Arial";
  ctx.textAlign = "center";
  ctx.fillText("ЖІНКА НЕПАЛЬЦЯ", 0, -67);
  ctx.fillStyle = "#ff7298";
  ctx.font = "24px Arial";
  ctx.fillText("♥", 26, -48);
  ctx.restore();
}
function drawGermanyBottle(x, y, t = 0) {
  ctx.save();
  ctx.shadowColor = "#ffe28a";
  ctx.shadowBlur = 12;
  ctx.fillStyle = "#0007";
  ctx.beginPath();
  ctx.ellipse(x + 2, y + 9, 12, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#79d6a0";
  rounded(ctx, x - 7, y - 15, 14, 26, 4);
  ctx.fillStyle = "#c8edce";
  ctx.fillRect(x - 4, y - 21, 8, 8);
  ctx.fillStyle = "#f1d66d";
  ctx.fillRect(x - 3, y - 10, 6, 10);
  ctx.restore();
}
function drawPfandMachine(x, y) {
  ctx.save();
  ctx.fillStyle = "rgba(8,16,20,.7)";
  ctx.beginPath();
  ctx.ellipse(x, y + 55, 62, 17, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#151d23";
  rounded(ctx, x - 49, y - 72, 98, 140, 12);
  ctx.fillStyle = "#e1262e";
  rounded(ctx, x - 42, y - 64, 84, 122, 8);
  ctx.fillStyle = "#ffdc36";
  ctx.beginPath();
  ctx.arc(x, y - 43, 17, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#d52b32";
  ctx.beginPath();
  ctx.arc(x, y - 43, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.font = "900 14px Arial";
  ctx.textAlign = "center";
  ctx.fillText("LIDL", x, y - 12);
  ctx.fillStyle = "#133e35";
  rounded(ctx, x - 34, y + 1, 68, 39, 5);
  ctx.fillStyle = "#9effca";
  ctx.font = "900 10px Arial";
  ctx.fillText("PFAND", x, y + 17);
  ctx.fillText("AUTOMAT", x, y + 29);
  ctx.fillStyle = "#ffe46b";
  ctx.fillRect(x - 17, y + 48, 34, 6);
  ctx.restore();
}
function drawGermanyNpc(x, y, t, bark = "", barkLife = 0) {
  ctx.save();
  ctx.translate(x, y + Math.sin(t * 3 + x) * 2);
  ctx.scale(0.94, 0.94);
  ctx.fillStyle = "#0008";
  ctx.beginPath();
  ctx.ellipse(0, 18, 20, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#192331";
  rounded(ctx, -14, -1, 12, 20, 4);
  rounded(ctx, 2, -1, 12, 20, 4);
  ctx.fillStyle = ["#647a68", "#c78e52", "#647895", "#a46d71"][
    Math.floor(x / 280) % 4
  ];
  rounded(ctx, -18, -32, 36, 34, 9);
  ctx.fillStyle = "#d6b08a";
  ctx.beginPath();
  ctx.arc(0, -42, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#403830";
  ctx.beginPath();
  ctx.arc(0, -47, 14, Math.PI, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  if (bark && barkLife > 0) drawGermanSpeechBubble(x, y - 61, bark);
}
function drawGermanSpeechBubble(x, y, text) {
  ctx.save();
  ctx.font = "bold 13px Arial,sans-serif";
  const max = 300,
    words = text.split(" "),
    lines = [];
  let line = "";
  for (const w of words) {
    const next = line ? line + " " + w : w;
    if (ctx.measureText(next).width > max && line) {
      lines.push(line);
      line = w;
    } else line = next;
  }
  if (line) lines.push(line);
  const width = Math.min(
      max,
      Math.max(100, ...lines.map((l) => ctx.measureText(l).width)) + 22,
    ),
    height = lines.length * 17 + 16,
    left = clamp(x - width / 2, 8, W - width - 8),
    top = clamp(y - height, 105, H - height - 8);
  ctx.fillStyle = "#fff8e8";
  ctx.strokeStyle = "#252a32";
  ctx.lineWidth = 2;
  rounded(ctx, left, top, width, height, 9);
  ctx.stroke();
  ctx.fillStyle = "#fff8e8";
  ctx.beginPath();
  ctx.moveTo(clamp(x, left + 12, left + width - 12), top + height - 1);
  ctx.lineTo(x, top + height + 9);
  ctx.lineTo(clamp(x + 17, left + 12, left + width - 12), top + height - 1);
  ctx.fill();
  ctx.fillStyle = "#222630";
  ctx.textAlign = "center";
  ctx.font = "bold 13px Arial,sans-serif";
  lines.forEach((l, i) => ctx.fillText(l, left + width / 2, top + 20 + i * 17));
  ctx.restore();
}
function drawGermanyCar(c) {
  ctx.save();
  ctx.translate(c.x, c.y);
  if (c.axis === "v") ctx.rotate(Math.PI / 2);
  ctx.fillStyle = "#0008";
  ctx.beginPath();
  ctx.ellipse(3, 5, 31, 16, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = c.color;
  rounded(ctx, -31, -15, 62, 30, 9);
  ctx.fillStyle = "#b7d9df";
  rounded(ctx, -11, -11, 22, 22, 5);
  ctx.fillStyle = "#f8edc2";
  ctx.fillRect(-29, -10, 5, 7);
  ctx.fillRect(24, -10, 5, 7);
  ctx.fillStyle = "#242c36";
  ctx.fillRect(-20, -18, 12, 4);
  ctx.fillRect(10, -18, 12, 4);
  ctx.fillRect(-20, 14, 12, 4);
  ctx.fillRect(10, 14, 12, 4);
  ctx.restore();
}
function drawGermanyScooter(c, t) {
  ctx.save();
  ctx.translate(c.x, c.y + Math.sin(t * 8 + c.x) * 2);
  if (c.dir < 0) ctx.scale(-1, 1);
  ctx.strokeStyle = "#111820";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(-11, 5, 5, 0, Math.PI * 2);
  ctx.arc(13, 5, 5, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = c.color;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(-10, 2);
  ctx.lineTo(11, 2);
  ctx.lineTo(7, -16);
  ctx.lineTo(15, -17);
  ctx.stroke();
  ctx.fillStyle = "#25313a";
  rounded(ctx, -6, -36, 14, 23, 5);
  ctx.fillStyle = c.color;
  rounded(ctx, -10, -33, 20, 17, 5);
  ctx.fillStyle = "#d9ae7d";
  ctx.beginPath();
  ctx.arc(1, -45, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#3a3029";
  ctx.beginPath();
  ctx.arc(0, -48, 8, Math.PI, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#303941";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(-4, -13);
  ctx.lineTo(-8, -3);
  ctx.moveTo(6, -13);
  ctx.lineTo(10, -2);
  ctx.stroke();
  ctx.restore();
}
function drawGermanyRival(r, t) {
  ctx.save();
  ctx.translate(r.x, r.y + Math.sin(t * 6 + r.x) * 2);
  ctx.scale(0.94, 0.94);
  ctx.fillStyle = "#0008";
  ctx.beginPath();
  ctx.ellipse(0, 17, 22, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#232b2a";
  rounded(ctx, -14, 3, 11, 21, 4);
  rounded(ctx, 4, 3, 11, 21, 4);
  ctx.fillStyle = "#6a6655";
  rounded(ctx, -19, -31, 38, 37, 10);
  ctx.fillStyle = "#b79672";
  ctx.beginPath();
  ctx.arc(0, -40, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#31362f";
  ctx.beginPath();
  ctx.arc(0, -44, 15, Math.PI, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#7a513c";
  rounded(ctx, 13, -6, 14, 20, 4);
  ctx.fillStyle = "#b7804b";
  rounded(ctx, 16, -4, 8, 13, 3);
  if (r.stun > 0) {
    ctx.fillStyle = "#f5e9c5";
    ctx.font = "bold 11px Arial";
    ctx.textAlign = "center";
    ctx.fillText("ОЙ!", 0, -62);
  } else if (r.lastStole > 0) {
    ctx.fillStyle = "#f5e9c5";
    ctx.font = "bold 11px Arial";
    ctx.textAlign = "center";
    ctx.fillText("МОЯ!", 0, -62);
  }
  ctx.restore();
}
function drawGermanyHero(x, y, t) {
  ctx.save();
  ctx.translate(x, y + Math.sin(t * 10) * 1.3);
  ctx.scale(0.94, 0.94);
  ctx.fillStyle = "#0008";
  ctx.beginPath();
  ctx.ellipse(2, 17, 23, 11, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#1b2733";
  rounded(ctx, -14, 3, 11, 23, 4);
  rounded(ctx, 4, 3, 11, 23, 4);
  ctx.fillStyle = "#d2aa7d";
  rounded(ctx, -17, -23, 34, 31, 9);
  ctx.fillStyle = "#314e61";
  rounded(ctx, -17, -7, 34, 22, 8);
  ctx.fillStyle = "#ad7545";
  rounded(ctx, -22, 0, 44, 13, 6);
  ctx.fillStyle = "#e3bd71";
  ctx.fillRect(-4, 3, 8, 8);
  ctx.fillStyle = "#e1b28b";
  ctx.beginPath();
  ctx.arc(0, -32, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#48382c";
  ctx.beginPath();
  ctx.arc(0, -36, 14, Math.PI, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}
function drawGermanyFlags(t) {
  const flags = [
    { x: 130, y: 120, type: "de" },
    { x: 660, y: 145, type: "rainbow" },
    { x: 1220, y: 230, type: "ua" },
    { x: 1740, y: 960, type: "gear" },
    { x: 2220, y: 320, type: "de" },
  ];
  for (const f of flags) {
    ctx.fillStyle = "#7b817c";
    ctx.fillRect(f.x, f.y, 3, 65);
    if (f.type === "de") {
      ctx.fillStyle = "#171a1b";
      ctx.fillRect(f.x + 3, f.y, 50, 10);
      ctx.fillStyle = "#d52c38";
      ctx.fillRect(f.x + 3, f.y + 10, 50, 10);
      ctx.fillStyle = "#f0c344";
      ctx.fillRect(f.x + 3, f.y + 20, 50, 10);
    } else if (f.type === "ua") {
      ctx.fillStyle = "#2476cf";
      ctx.fillRect(f.x + 3, f.y, 50, 15);
      ctx.fillStyle = "#f1d14a";
      ctx.fillRect(f.x + 3, f.y + 15, 50, 15);
    } else if (f.type === "rainbow") {
      const cols = [
        "#ed4c54",
        "#ed9144",
        "#e5cf4d",
        "#4dbb74",
        "#3b8dd2",
        "#9660bd",
      ];
      cols.forEach((c, i) => {
        ctx.fillStyle = c;
        ctx.fillRect(f.x + 3, f.y + i * 5, 50, 5);
      });
    } else {
      const cx = f.x + 29,
        cy = f.y + 15;
      ctx.fillStyle = "#d82731";
      ctx.fillRect(f.x + 3, f.y, 56, 32);
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(cx, cy, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.save();
      ctx.translate(cx, cy);
      ctx.fillStyle = "#53615e";
      for (let k = 0; k < 8; k++) {
        ctx.save();
        ctx.rotate((k * Math.PI) / 4);
        ctx.fillRect(-2.5, -11, 5, 7);
        ctx.restore();
      }
      ctx.beginPath();
      ctx.arc(0, 0, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(0, 0, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    ctx.fillStyle = "#fff";
    ctx.strokeStyle = "#3d4544";
    ctx.lineWidth = 1;
    ctx.strokeRect(f.x + 3, f.y, 56, 32);
  }
}
function showGermanyVictory() {
  running = false;
  gameEnded = true;
  const layer = document.getElementById("intro");
  layer.classList.remove("hidden");
  layer.innerHTML = `<section class="card"><div class="eyebrow">ФІНАЛ · НІМЕЧЧИНА · PFAND ЗДАНО</div><h1>Довгий маршрут.<br><em>Щаслива зустріч.</em></h1><p>Герой знаходить Жінку Непальця, трохи ніяковіє й зізнається їй у коханні. Вона усміхається та бере його за руку. Автомат Pfand лишається далеко позаду — нарешті це не його головна проблема.</p><div class="mission"><span>🍾 Пляшки: здано</span><span>💛 Зізнання: зроблено</span><span>🏁 Історія: завершена</span></div><button id="germanyReplayBtn">ПОВТОРИТИ РІВЕНЬ 7　↻</button><button id="germanyDoneBtn" class="secondary">У ГОЛОВНЕ МЕНЮ</button></section>`;
  document.getElementById("germanyReplayBtn").onclick = startGermanyLevel;
  document.getElementById("germanyDoneBtn").onclick = () => location.reload();
}
