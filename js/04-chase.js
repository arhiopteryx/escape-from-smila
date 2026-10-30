function showVrFail() {
  running = false;
  gameEnded = true;
  const layer = document.getElementById("intro");
  layer.classList.remove("hidden");
  layer.innerHTML = `<section class="card"><div class="eyebrow">VR-ЦЕХ · ПОВТОРНА СПРОБА</div><h1>Сигнал зник.<br><em>Шолом цілий.</em></h1><p>Цементний блок збив героя з ніг. Перепочинь і спробуй знешкодити завод ще раз.</p><button id="retryVrBtn">ПОВТОРИТИ РІВЕНЬ 5　↻</button></section>`;
  document.getElementById("retryVrBtn").onclick = showVrCutscene;
}
let captureStartedAt = 0;
function showChaseCapture() {
  if (gameEnded) return;
  gameEnded = true;
  running = false;
  stage = 4;
  captureStartedAt = performance.now();
  document.getElementById("intro").classList.add("hidden");
  chime();
  requestAnimationFrame(captureLoop);
}
function captureLoop(now) {
  if (!gameEnded || stage !== 4) return;
  const sec = (now - captureStartedAt) / 1000;
  drawCaptureCutscene(sec);
  if (sec < 7.5) requestAnimationFrame(captureLoop);
  else showCaptureResult();
}
function drawCaptureCutscene(sec) {
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "#111a2b";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#18243a";
  for (let i = 0; i < 9; i++) {
    const x = i * 158 - 22,
      h = 170 + ((i * 47) % 180);
    ctx.fillRect(x, 70, 130, h);
    ctx.fillStyle = "#e7bd64";
    for (let wy = 92; wy < 70 + h - 20; wy += 38)
      for (let wx = x + 15; wx < x + 120; wx += 31) {
        ctx.fillRect(wx, wy, 9, 13);
      }
    ctx.fillStyle = "#18243a";
  }
  ctx.fillStyle = "#414c57";
  ctx.fillRect(0, 430, W, 250);
  ctx.fillStyle = "#d7c982";
  ctx.fillRect(0, 424, W, 7);
  ctx.fillRect(0, 680, W, 7);
  ctx.fillStyle = "#d9d4b2";
  for (let x = 45; x < W; x += 170) ctx.fillRect(x, 546, 82, 7);
  for (const [lx, ly] of [
    [130, 300],
    [1140, 310],
  ]) {
    ctx.fillStyle = "#202b34";
    ctx.fillRect(lx - 4, ly, 8, 155);
    const glow = ctx.createRadialGradient(lx, ly + 15, 5, lx, ly + 15, 220);
    glow.addColorStop(0, "rgba(255,215,130,.26)");
    glow.addColorStop(1, "rgba(255,215,130,0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(lx, ly + 15, 220, 0, Math.PI * 2);
    ctx.fill();
  }
  const vanX =
      sec < 1.25
        ? 1300 - 370 * Math.min(1, sec / 1.25)
        : sec < 4.8
          ? 930
          : 930 + Math.min(520, (sec - 4.8) * 260),
    vanY = 365;
  ctx.save();
  ctx.translate(vanX, vanY);
  if (sec >= 4.8) ctx.rotate(Math.min(Math.PI / 2, (sec - 4.8) * 2.2));
  ctx.fillStyle = "#0008";
  rounded(ctx, -45, -72, 90, 153, 18);
  ctx.fillStyle = "#465142";
  rounded(ctx, -42, -75, 84, 148, 18);
  ctx.fillStyle = "#63704f";
  rounded(ctx, -35, -67, 70, 125, 12);
  ctx.fillStyle = "#17232a";
  rounded(ctx, -28, -51, 56, 38, 8);
  ctx.fillStyle = "#a9d7ce";
  rounded(ctx, -23, -46, 46, 26, 5);
  ctx.fillStyle = "#29332e";
  rounded(ctx, -29, 2, 58, 43, 9);
  ctx.fillStyle = "#d7dfc9";
  ctx.font = "900 18px Arial,sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("ТЦК", 0, 28);
  ctx.fillStyle = "#f7dc92";
  ctx.fillRect(-32, -72, 15, 5);
  ctx.fillRect(17, -72, 15, 5);
  ctx.fillStyle = "#141b20";
  rounded(ctx, -47, -48, 8, 33, 3);
  rounded(ctx, 39, -48, 8, 33, 3);
  rounded(ctx, -47, 29, 8, 34, 3);
  rounded(ctx, 39, 29, 8, 34, 3);
  if (sec > 1 && sec < 4.8) {
    ctx.fillStyle = "#18242a";
    ctx.fillRect(-31, 68, 62, 8);
    ctx.fillStyle = "#a6afa0";
    ctx.fillRect(-30, 75, 60, 3);
  }
  ctx.restore();
  // The scooter skids and stays behind while the rider falls, then officers move the rider into the van.
  const fall = Math.min(1, sec / 0.9),
    approach = Math.max(0, Math.min(1, (sec - 1.6) / 2.9)),
    riderX = sec < 1.6 ? 565 : 565 + approach * 285,
    riderY = 440 + Math.sin(Math.min(sec, 1) * Math.PI) * 10;
  drawCineScooter(470, 465, sec);
  if (sec < 4.45) {
    drawCinePerson(
      riderX,
      riderY,
      sec < 1.2
        ? fall * 1.25
        : sec < 2
          ? Math.max(0, 1.25 * (1 - (sec - 1.2) / 0.8))
          : 0,
      "#df7647",
      "#f0b844",
      sec < 1.2,
    );
    if (sec > 1.5 && sec < 4.5) {
      const q = Math.min(1, (sec - 1.5) / 2.7);
      drawCineOfficer(560 + q * 220, 396, "#7f8764", sec);
      drawCineOfficer(555 + q * 220, 487, "#6d795d", sec + 1);
    }
  }
  if (sec < 1.35) {
    ctx.fillStyle = "#ffe286";
    ctx.font = "900 30px Arial,sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("ОЙ!", 550, 365);
  }
  ctx.fillStyle = "#fff";
  ctx.font = "bold 22px Arial,sans-serif";
  ctx.textAlign = "left";
  const caption =
    sec < 1.2
      ? "Самокат ковзнув на мокрій дорозі…"
      : sec < 3.4
        ? "Бус зупинився. Двері відчинилися."
        : sec < 5
          ? "Героя посадили всередину…"
          : "Бус поїхав. Самокат залишився.";
  ctx.fillText(caption, 42, 75);
  ctx.fillStyle = "#fff";
  ctx.font = "bold 16px Arial,sans-serif";
  ctx.fillText("РІВЕНЬ 3 · НІЧНА ПОГОНЯ", 42, 108);
}
function drawCineScooter(x, y, t) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(-0.22 + Math.sin(Math.min(t, 1) * 5) * 0.06);
  ctx.fillStyle = "#0007";
  ctx.beginPath();
  ctx.ellipse(0, 4, 17, 59, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#111a22";
  rounded(ctx, -10, -55, 20, 20, 7);
  rounded(ctx, -10, 35, 20, 20, 7);
  ctx.fillStyle = "#b5c3c7";
  ctx.beginPath();
  ctx.arc(0, -45, 5, 0, Math.PI * 2);
  ctx.arc(0, 45, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#35d6c0";
  rounded(ctx, -9, -39, 18, 78, 7);
  ctx.fillStyle = "#f5d576";
  rounded(ctx, -27, -52, 54, 8, 4);
  ctx.restore();
}
function drawCinePerson(x, y, angle, shirt, helmet, fallen) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.fillStyle = "#0007";
  ctx.beginPath();
  ctx.ellipse(2, 9, 24, 35, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#1a2830";
  rounded(ctx, -11, 8, 9, 20, 4);
  rounded(ctx, 3, 8, 9, 20, 4);
  ctx.fillStyle = shirt;
  rounded(ctx, -15, -8, 30, 26, 9);
  ctx.strokeStyle = shirt;
  ctx.lineWidth = 7;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(-11, -1);
  ctx.lineTo(-22, -25);
  ctx.moveTo(11, -1);
  ctx.lineTo(22, -25);
  ctx.stroke();
  ctx.fillStyle = "#f0c18d";
  ctx.beginPath();
  ctx.arc(0, -19, 13, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = helmet;
  ctx.beginPath();
  ctx.arc(0, -21, 14, Math.PI, Math.PI * 2);
  ctx.fill();
  if (fallen) {
    ctx.fillStyle = "#ffe78c";
    ctx.beginPath();
    ctx.arc(0, -45, 6, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}
function drawCineOfficer(x, y, uniform, t) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(-Math.PI / 2);
  ctx.fillStyle = "#0006";
  ctx.beginPath();
  ctx.ellipse(2, 8, 17, 24, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#1a2427";
  rounded(ctx, -8, 6, 7, 17, 3);
  rounded(ctx, 2, 6, 7, 17, 3);
  ctx.fillStyle = uniform;
  rounded(ctx, -13, -12, 26, 23, 8);
  ctx.fillStyle = "#394332";
  ctx.beginPath();
  ctx.arc(0, -18, 11, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#28352d";
  rounded(ctx, -12, -25, 24, 7, 3);
  ctx.fillStyle = "#dfbd6a";
  ctx.fillRect(-3, -22, 6, 3);
  ctx.restore();
}
function showCaptureResult() {
  const layer = document.getElementById("intro");
  layer.classList.remove("hidden");
  layer.innerHTML = `<section class="card"><div class="eyebrow">РІВЕНЬ 3 · ФІНАЛ ПОГОНІ</div><h1>От халепа.<br><em>Бус поїхав.</em></h1><p>Самокат лишився на мокрій вулиці. Герой — у бусі. Далі шлях веде до навчального центру.</p><div class="mission"><span>🚨 Погоня завершена</span><span>🛴 Самокат залишився на дорозі</span></div><button id="retryChaseBtn">ПОВТОРИТИ РІВЕНЬ 3　↻</button> <button id="continueLevel4Btn" class="secondary">ПЕРЕЙТИ ДО РІВНЯ 4　→</button><br><button id="returnMenuBtn" class="secondary">ГОЛОВНЕ МЕНЮ</button></section>`;
  document.getElementById("retryChaseBtn").onclick = startLevel3;
  document.getElementById("continueLevel4Btn").onclick = startLevel4;
  document.getElementById("returnMenuBtn").onclick = () => location.reload();
}
function updateChase(dt) {
  updateCityTraffic(dt);
  const { x: dx, y: dy } = movementAxes();
  if (!churchEventUsed && Math.hypot(player.x - 700, player.y - 760) < 165) {
    churchEventUsed = true;
    chaseVan.stun = 2.2;
    showToast("ЦЕРКОВНИЙ ДЗВІН ЗБИВ БУС З КУРСУ · +2 СЕК");
    chime();
  }
  if (!azotEventUsed && Math.hypot(player.x - 2760, player.y - 2110) < 190) {
    azotEventUsed = true;
    chaseVan.stun = 1.7;
    player.boost = 0.8;
    showToast("АЗОТІВСЬКА ПАРА ЗАВАДИЛА ПЕРЕСЛІДУВАЧАМ");
    tone(280, 0.16, "sawtooth", 0.035, 180);
  }
  const onRoad =
      roadsX.some((x) => Math.abs(x - player.x) < roadW / 2 - 18) ||
      roadsY.some((y) => Math.abs(y - player.y) < roadW / 2 - 18),
    accel = onRoad ? 1280 : 820,
    max = (onRoad ? 455 : 325) * (player.boost > 0 ? 1.65 : 1);
  if (dx || dy) {
    player.vx += dx * accel * dt;
    player.vy += dy * accel * dt;
    player.dir = Math.atan2(player.vy, player.vx);
  } else {
    player.vx *= Math.pow(0.08, dt);
    player.vy *= Math.pow(0.08, dt);
  }
  if (boostPressed) {
    boostPressed = false;
    if (player.boostCd <= 0) {
      player.boost = 0.7;
      player.boostCd = 2.1;
      const n = Math.hypot(player.vx, player.vy) || 1;
      player.vx += (player.vx / n) * 240;
      player.vy += (player.vy / n) * 240;
      tone(300, 0.14, "sawtooth", 0.04, 350);
    }
  }
  player.boostCd = Math.max(0, player.boostCd - dt);
  player.boost = Math.max(0, player.boost - dt);
  let sp = Math.hypot(player.vx, player.vy);
  if (sp > max) {
    player.vx = (player.vx / sp) * max;
    player.vy = (player.vy / sp) * max;
  }
  const ox = player.x,
    oy = player.y;
  player.x = clamp(player.x + player.vx * dt, 24, world.w - 24);
  player.y = clamp(player.y + player.vy * dt, 24, world.h - 24);
  for (const b of buildings) {
    const dx = player.x - b.x,
      dy = player.y - b.y;
    if (Math.abs(dx) < b.w / 2 + 15 && Math.abs(dy) < b.h / 2 + 15) {
      player.x = ox;
      player.y = oy;
      player.vx *= -0.2;
      player.vy *= -0.2;
      player.bump = 0.35;
    }
  }
  for (const car of cars) {
    if (Math.abs(player.x - car.x) < 43 && Math.abs(player.y - car.y) < 32) {
      player.x = ox;
      player.y = oy;
      player.vx *= -0.35;
      player.vy *= -0.35;
      player.bump = 0.55;
      score = Math.max(0, score - 10);
      tone(125, 0.1, "square", 0.03, -35);
    }
  }
  player.bump = Math.max(0, player.bump - dt);
  chaseVan.stun = Math.max(0, (chaseVan.stun || 0) - dt);
  const vanRoute = cityRoute(chaseVan, player);
  // Follow the next road waypoint. Re-evaluating the first point by a fixed
  // 30px threshold could skip a corner and leave the van oscillating there.
  let vanTarget = vanRoute[1] || player;
  if (Math.hypot(vanTarget.x - chaseVan.x, vanTarget.y - chaseVan.y) < 48)
    vanTarget = vanRoute[2] || player;
  let routeLen = Math.hypot(vanTarget.x - chaseVan.x, vanTarget.y - chaseVan.y);
  if (routeLen < 1) {
    vanTarget = player;
    routeLen = Math.hypot(vanTarget.x - chaseVan.x, vanTarget.y - chaseVan.y);
  }
  const gapToHero = Math.hypot(player.x - chaseVan.x, player.y - chaseVan.y),
    vSpeed = clamp(250 + Math.max(0, gapToHero - 240) * 0.075, 250, 330);
  chaseVan.vx = routeLen ? ((vanTarget.x - chaseVan.x) / routeLen) * vSpeed : 0;
  chaseVan.vy = routeLen ? ((vanTarget.y - chaseVan.y) / routeLen) * vSpeed : 0;
  if (chaseVan.stun <= 0) {
    chaseVan.x = clamp(chaseVan.x + chaseVan.vx * dt, 20, world.w - 20);
    chaseVan.y = clamp(chaseVan.y + chaseVan.vy * dt, 20, world.h - 20);
  }
  for (const p of pedestrians) {
    const px = p.x - chaseVan.x,
      py = p.y - chaseVan.y,
      pd = Math.hypot(px, py) || 1;
    if (pd < 290) {
      p.x = clamp(p.x + (px / pd) * 195 * dt, 0, world.w);
      p.y = clamp(p.y + (py / pd) * 195 * dt, 0, world.h);
      p.fleeing = 0.65;
    }
  }
  if (Math.hypot(player.x - chaseVan.x, player.y - chaseVan.y) < 82) {
    showChaseCapture();
    return;
  }
  if (!chaseMarkerActive && time <= 20) {
    chaseMarkerActive = true;
    document.getElementById("objectiveTitle").textContent = "БЕЗПЕЧНЕ МІСЦЕ";
    document.getElementById("objectiveText").textContent =
      "Маркер уже на мапі. До нього ще є час — тримай курс!";
    showToast("МАРШРУТ ВІДКРИТО: БЕЗПЕЧНЕ МІСЦЕ");
    chime();
  }
  if (chaseMarkerActive) {
    const d = routeDistance(cityRoute(player, chaseDestination));
    document.getElementById("objectiveText").textContent =
      `Безпечне місце попереду · ${Math.round(d)} м`;
    if (d < 155) {
      showChaseCapture();
      return;
    }
  }
  const gap = Math.round(
    Math.hypot(player.x - chaseVan.x, player.y - chaseVan.y),
  );
  document.getElementById("delivered").textContent = `${gap} м`;
  document.getElementById("speedValue").textContent = Math.round(
    Math.hypot(player.vx, player.vy) * 0.21,
  );
  document.getElementById("timer").textContent = formatTime(time);
  document.getElementById("score").textContent = String(score).padStart(4, "0");
  document.getElementById("boostMeter").style.transform =
    `scaleX(${player.boostCd ? 1 - player.boostCd / 2.1 : 1})`;
}
function togglePause() {
  if (!running || gameEnded) return;
  paused = !paused;
  document.getElementById("pause").classList.toggle("show", paused);
  if (!paused) {
    last = performance.now();
    scheduleLoop();
  }
}
function finish(success = false) {
  if (gameEnded) return;
  gameEnded = true;
  running = false;
  chime();
  document.getElementById("objectiveTitle").textContent = success
    ? "ЗМІНА ЗАВЕРШЕНА"
    : "ЧАС ВИЙШОВ";
  document.getElementById("objectiveText").textContent = success
    ? "Усі столики обслужені. На вулиці починається наступна пригода."
    : "Зміна закінчилася. Кухня зачекає на наступний рейс.";
  const layer = document.getElementById("intro");
  layer.classList.remove("hidden");
  const result = success
    ? `Гостей обслужено: <b>${cafeServed} / 10</b>. Кафе вижило, сирники теж.`
    : `Посилок доставлено: <b>${delivered}</b>. Столиків обслужено: <b>${cafeServed} / 10</b>.`;
  layer.innerHTML = `<section class="card"><div class="eyebrow">СМІЛА · ПІДСУМОК ЗМІНИ</div><h1>${success ? "Кафе врятовано." : "Кур’єр зробив усе, що міг."}<br><em>${success ? "На сьогодні." : "Майже."}</em></h1><p>${result}</p><div class="mission"><span>📦 Доставки <b>${delivered}</b></span><span>🍽 Столики <b>${cafeServed} / 10</b></span><span>✦ Рахунок <b>${String(score).padStart(4, "0")}</b></span></div><button id="${success ? "nextLevelBtn" : "restartBtn"}">${success ? "ПЕРЕЙТИ ДО РІВНЯ 3　→" : "ЩЕ ОДНА ЗМІНА　↻"}</button><p class="micro">Далі буде: самокат, вечірнє місто і дуже підозрілий бус.</p></section>`;
  if (success)
    document.getElementById("nextLevelBtn").onclick = showCafeToChaseCutscene;
  else document.getElementById("restartBtn").onclick = () => location.reload();
}
