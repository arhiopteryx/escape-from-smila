function showCafeCutscene() {
  buildChaseBackdrop();
  running = false;
  paused = false;
  const layer = document.getElementById("intro");
  layer.classList.remove("hidden");
  layer.innerHTML = `<section class="card"><div class="eyebrow">КАТСЦЕНА · VR-КАФЕ · ПІСЛЯ КУР’ЄРСЬКОГО РЕЙДУ</div><h1>Посилки здані.<br><em>Фартух одягнений.</em></h1><p>Самокат нарешті відпочиває під вивіскою кафе. Усередині — шість гостей у великих VR-шоломах. Тепер у меню п’ять страв, а герой уже знімає TikTok про зміну: «кста, сервіс — шось на зумерском». Його типаж — фембой у пастельному худі; герою такий стиль дуже до душі.</p><div class="mission"><span>● Сирники — круглі</span><span>▦ Квадратна піца</span><span>🥫 Куп’янська згущонка</span><span>🥪 Бутерброд зі свининою</span><span>Пельмені «Єрмоліно» · фірмовий логотип</span></div><button id="enterCafeBtn">ЗАЙТИ НА ЗМІНУ　→</button><p class="micro">У кафе: плавний рух, E — взяти страву або подати її; замовлення мають чіткі кольорові мітки.</p></section>`;
  document.getElementById("enterCafeBtn").onclick = enterCafe;
}
function showCafeToChaseCutscene() {
  running = false;
  const layer = document.getElementById("intro");
  layer.classList.remove("hidden");
  layer.innerHTML = `<section class="card"><div class="eyebrow">КАТСЦЕНА · ПІСЛЯ ЗМІНИ</div><h1>Зміна скінчилась.<br><em>Місто не спить.</em></h1><p>Герой зачиняє VR-кафе, хапає кермо самоката й виїжджає на нічну вулицю. За рогом уже розвертається оливковий бус.</p><div class="mission"><span>🛴 Заряджено</span><span>🌙 Сміла засинає</span><span>🚐 Бус уже рушив</span></div><button id="beginChase">ВИЇХАТИ В НІЧ　→</button></section>`;
  document.getElementById("beginChase").onclick = startLevel3;
}
function enterCafe() {
  saveCampaignChapter(2);
  focusGame();
  document
    .getElementById("game")
    .classList.remove("germany-mode", "training-mode");
  stage = 2;
  cafeActionCooldown = 0;
  document.getElementById("game").classList.add("cafe-mode");
  time = 150;
  cafeServed = 0;
  cafeOrdersCreated = 0;
  heldDish = null;
  cafeOrders = Array(cafeTables.length).fill(null);
  for (let i = 0; i < 4; i++) spawnCafeOrder(i);
  player.x = 640;
  player.y = 585;
  player.vx = 0;
  player.vy = 0;
  player.dir = 0;
  interactPressed = false;
  document.getElementById("delivered").parentElement.firstChild.textContent =
    "🍽 СТОЛИКИ ";
  document.getElementById("delivered").textContent = "0 / 10";
  document.getElementById("timer").textContent = "02:30";
  document.getElementById("objectiveTitle").textContent = "ЗМІНА: VR-КАФЕ";
  document.getElementById("objectiveText").textContent =
    "Бери потрібні страви на кухні, плануй маршрут між столами й не плутай замовлення.";
  document.querySelector(".mapbox").style.display = "none";
  document.querySelector(".speed").style.display = "none";
  setHint(
    "РУХ <b>WASD / СТРІЛКИ</b>　 ДІЯ <b>E / F / ENTER</b>　 РИВОК <b>SPACE</b>",
  );
  document.getElementById("intro").classList.add("hidden");
  running = true;
  paused = false;
  audioStart();
  showToast("ЗАПАМ’ЯТАЙ СТРАВУ · НЕСИ ЇЇ ДО ВІРНОГО СТОЛИКА");
  last = performance.now();
  scheduleLoop();
}
function skipCourierLevel() {
  showCafeCutscene();
}
function formatTime(s) {
  let v = Math.max(0, Math.ceil(s));
  return `${String(Math.floor(v / 60)).padStart(2, "0")}:${String(v % 60).padStart(2, "0")}`;
}
function updateCityTraffic(dt) {
  for (const c of cars) {
    const v =
      (c.speed || 65) *
      c.dir *
      dt *
      (stage === 3 ? 1.75 : stage === 1 ? 1.38 : 1);
    if (c.horizontal) {
      c.x += v;
      if (c.dir > 0 && c.x > world.w + 100) c.x = -100;
      if (c.dir < 0 && c.x < -100) c.x = world.w + 100;
    } else {
      c.y += v;
      if (c.dir > 0 && c.y > world.h + 100) c.y = -100;
      if (c.dir < 0 && c.y < -100) c.y = world.h + 100;
    }
  }
  for (const p of pedestrians) {
    p.stun = Math.max(0, p.stun - dt);
    p.fleeing = Math.max(0, (p.fleeing || 0) - dt);
    if (p.stun > 0) continue;
    const step =
      p.speed * p.dir * dt * (stage === 3 ? 1.55 : stage === 1 ? 1.28 : 1);
    if (p.axis === "h") {
      p.x += step;
      if (p.x < 0 || p.x > world.w) p.dir *= -1;
    } else {
      p.y += step;
      if (p.y < 0 || p.y > world.h) p.dir *= -1;
    }
    if (Math.random() < dt * 0.035) {
      p.dir *= -1;
      if (Math.random() < 0.35) p.axis = p.axis === "h" ? "v" : "h";
    }
  }
}
function drawPedestrian(p, t) {
  ctx.save();
  ctx.translate(p.x, p.y + Math.sin(t * 5 + p.phase) * 2);
  if (p.fleeing > 0) ctx.rotate(Math.sin(t * 18 + p.phase) * 0.16);
  ctx.fillStyle = "#0004";
  ctx.beginPath();
  ctx.ellipse(2, 8, 10, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  if (p.stun > 0) {
    ctx.rotate(Math.sin(t * 24) * 0.3);
    ctx.fillStyle = "#d9ad82";
    ctx.beginPath();
    ctx.arc(0, -10, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = p.color;
    rounded(ctx, -7, -3, 14, 13, 5);
    ctx.restore();
    if (Math.floor(t * 8) % 2 === 0) {
      ctx.fillStyle = "#fff1a3";
      ctx.font = "bold 13px Arial";
      ctx.textAlign = "center";
      ctx.fillText("✦", p.x, p.y - 24);
    }
    return;
  }
  if (p.axis === "h") ctx.rotate(p.dir > 0 ? Math.PI / 2 : -Math.PI / 2);
  else if (p.dir < 0) ctx.rotate(Math.PI);
  const step = Math.sin(t * 10 + p.phase) * (p.fleeing > 0 ? 3 : 1.7);
  ctx.fillStyle = p.color;
  rounded(ctx, -6, -5, 12, 14, 4);
  ctx.fillStyle = "#26353c";
  ctx.fillRect(-5, 7 + step, 4, 8);
  ctx.fillRect(2, 7 - step, 4, 8);
  ctx.fillStyle = "#d9ad82";
  ctx.beginPath();
  ctx.arc(0, -10, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  if (p.fleeing > 0) {
    ctx.fillStyle = "#ffdf80";
    ctx.font = "900 14px Arial";
    ctx.textAlign = "center";
    ctx.fillText("!", p.x, p.y - 24);
  }
}
let chaseBackdrop = null,
  buildingBackdrop = false;
function drawGround() {
  const night = stage === 3;
  ctx.fillStyle = night ? "#19242a" : "#9bb58b";
  ctx.fillRect(0, 0, world.w, world.h);
  for (let i = 0; i < roadsX.length - 1; i++)
    for (let j = 0; j < roadsY.length - 1; j++) {
      const x = roadsX[i] + 120,
        y = roadsY[j] + 120;
      ctx.fillStyle = night ? "#202c30" : "#86a57f";
      rounded(ctx, x, y, 420, 400, 14);
      ctx.fillStyle = night ? "#263639" : "#aac19a";
      rounded(ctx, x + 15, y + 15, 390, 370, 12);
    }
  for (let x = 60; x < world.w; x += 140)
    for (let y = 60; y < world.h; y += 130) {
      if (nearRoad(x, y) || (Math.floor(x / 140) + Math.floor(y / 130)) % 4)
        continue;
      ctx.fillStyle = night ? "#8ca38b20" : "#edf0cf35";
      ctx.beginPath();
      ctx.ellipse(x, y, 5, 2.5, ((x + y) % 3) * 0.4, 0, Math.PI * 2);
      ctx.fill();
    }
  const pavement = night ? "#3c4141" : "#c9c1aa",
    sidewalk = night ? "#555653" : "#dfd5bb",
    asphalt = night ? "#171d22" : "#48515a",
    curb = night ? "#78776c" : "#f0e7cf";
  ctx.fillStyle = pavement;
  roadsX.forEach((x) =>
    ctx.fillRect(x - roadW / 2 - 22, 0, roadW + 44, world.h),
  );
  roadsY.forEach((y) =>
    ctx.fillRect(0, y - roadW / 2 - 22, world.w, roadW + 44),
  );
  roadsX.forEach((x) => {
    ctx.fillStyle = sidewalk;
    ctx.fillRect(x - roadW / 2 - 18, 0, 14, world.h);
    ctx.fillRect(x + roadW / 2 + 4, 0, 14, world.h);
  });
  roadsY.forEach((y) => {
    ctx.fillStyle = sidewalk;
    ctx.fillRect(0, y - roadW / 2 - 18, world.w, 14);
    ctx.fillRect(0, y + roadW / 2 + 4, world.w, 14);
  });
  roadsX.forEach((x) => {
    ctx.fillStyle = asphalt;
    ctx.fillRect(x - roadW / 2, 0, roadW, world.h);
  });
  roadsY.forEach((y) => {
    ctx.fillStyle = asphalt;
    ctx.fillRect(0, y - roadW / 2, world.w, roadW);
  });
  ctx.save();
  ctx.strokeStyle = curb;
  ctx.lineWidth = 2;
  roadsX.forEach((x) => {
    for (const edge of [x - roadW / 2, x + roadW / 2]) {
      ctx.beginPath();
      ctx.moveTo(edge, 0);
      ctx.lineTo(edge, world.h);
      ctx.stroke();
    }
    for (let y = 12; y < world.h; y += 72) {
      ctx.fillStyle = pavement;
      ctx.fillRect(x - roadW / 2 - 12, y, 2, 18);
      ctx.fillRect(x + roadW / 2 + 10, y, 2, 18);
    }
  });
  roadsY.forEach((y) => {
    for (const edge of [y - roadW / 2, y + roadW / 2]) {
      ctx.beginPath();
      ctx.moveTo(0, edge);
      ctx.lineTo(world.w, edge);
      ctx.stroke();
    }
    for (let x = 12; x < world.w; x += 72) {
      ctx.fillStyle = pavement;
      ctx.fillRect(x, y - roadW / 2 - 12, 18, 2);
      ctx.fillRect(x, y + roadW / 2 + 10, 18, 2);
    }
  });
  ctx.restore();
  ctx.save();
  ctx.setLineDash([24, 22]);
  ctx.strokeStyle = night ? "#8c7751" : "#e8d997";
  ctx.lineWidth = 4;
  roadsX.forEach((x) => {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, world.h);
    ctx.stroke();
  });
  roadsY.forEach((y) => {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(world.w, y);
    ctx.stroke();
  });
  ctx.strokeStyle = night ? "#c5c2ae55" : "#e7e8dcbb";
  ctx.lineWidth = 2;
  ctx.setLineDash([16, 20]);
  roadsX.forEach((x) =>
    [-34, 34].forEach((offset) => {
      ctx.beginPath();
      ctx.moveTo(x + offset, 0);
      ctx.lineTo(x + offset, world.h);
      ctx.stroke();
    }),
  );
  roadsY.forEach((y) =>
    [-34, 34].forEach((offset) => {
      ctx.beginPath();
      ctx.moveTo(0, y + offset);
      ctx.lineTo(world.w, y + offset);
      ctx.stroke();
    }),
  );
  ctx.restore();
  ctx.fillStyle = night ? "#9a8a67" : "#f1e6c4";
  roadsX.forEach((x) =>
    roadsY.forEach((y) => {
      for (let k = -2; k <= 2; k++) {
        ctx.fillRect(x + k * 12 - 3, y - 116, 6, 30);
        ctx.fillRect(x + k * 12 - 3, y + 86, 6, 30);
        ctx.fillRect(x - 116, y + k * 12 - 3, 30, 6);
        ctx.fillRect(x + 86, y + k * 12 - 3, 30, 6);
      }
    }),
  );
}
function drawScenery(t) {
  const night = stage === 3,
    minX = buildingBackdrop ? 0 : player.x - W * 0.6,
    maxX = buildingBackdrop ? world.w : player.x + W * 0.6,
    minY = buildingBackdrop ? 0 : player.y - H * 0.6,
    maxY = buildingBackdrop ? world.h : player.y + H * 0.6;
  for (const b of buildings) {
    if (
      b.x + b.w < minX ||
      b.x - b.w > maxX ||
      b.y + b.h < minY ||
      b.y - b.h > maxY
    )
      continue;
    const left = b.x - b.w / 2,
      top = b.y - b.h / 2;
    // Small front yard and a stone entrance path make each block read as a
    // neighborhood instead of a field of isolated roof tiles.
    ctx.fillStyle = night ? "#26352e" : "#9eb67f";
    rounded(ctx, left - 10, top - 9, b.w + 20, b.h + 24, 8);
    ctx.fillStyle = night ? "#444742" : "#c8bea6";
    ctx.fillRect(b.x - 7, top + b.h - 1, 14, 30);
    ctx.fillStyle = "#0005";
    rounded(ctx, left + 2, top + 5, b.w + 3, b.h + 3, 6);
    ctx.fillStyle = night ? "#45494a" : "#d7cbb3";
    rounded(ctx, left - 3, top - 3, b.w + 6, b.h + 6, 6);
    ctx.fillStyle = night ? "#27343a" : b.roof;
    rounded(ctx, left, top, b.w, b.h, 4);
    ctx.fillStyle = night ? "#34434a" : b.c;
    ctx.fillRect(left + 5, top + 5, b.w - 10, 5);
    ctx.fillStyle = night ? "#171f23" : "#574b48";
    ctx.fillRect(left + 5, top + b.h - 10, b.w - 10, 5);
    ctx.fillStyle = night ? "#8c998f" : "#eadfc6";
    for (let wx = left + 9; wx < left + b.w - 8; wx += 20) {
      ctx.fillRect(wx, top + 2, 8, 3);
      ctx.fillRect(wx, top + b.h - 5, 8, 3);
    }
    // Roof ridges, skylights and vents distinguish houses without image sprites.
    ctx.fillStyle = night ? "#63716e" : "#ead9ad";
    ctx.fillRect(left + 8, b.y - 1, b.w - 16, 3);
    const ventX = left + 11 + (b.kind * 31) % Math.max(14, b.w - 30),
      ventY = top + 14 + (b.kind * 19) % Math.max(12, b.h - 30);
    ctx.fillStyle = night ? "#182329" : "#46555a";
    rounded(ctx, ventX, ventY, 15, 12, 2);
    ctx.fillStyle = night ? "#d2a76b" : "#a8d2ca";
    ctx.fillRect(ventX + 3, ventY + 2, 9, 3);
    ctx.fillStyle = night ? "#665749" : "#8e6049";
    ctx.fillRect(left + b.w - 18, top + 8, 9, 12);
    ctx.fillStyle = night ? "#303a3c" : "#c8b796";
    ctx.fillRect(left + b.w - 20, top + 6, 13, 3);
    if (b.kind > 0.72) {
      ctx.fillStyle = night ? "#839088" : "#d7d4c4";
      ctx.fillRect(left + b.w * 0.52, top + 10, 12, 16);
      ctx.fillStyle = night ? "#edd08c" : "#91aaa4";
      ctx.fillRect(left + b.w * 0.52 + 2, top + 12, 8, 5);
    }
  }
  for (const tr of trees) {
    if (tr.x < minX || tr.x > maxX || tr.y < minY || tr.y > maxY) continue;
    ctx.fillStyle = "#0005";
    ctx.beginPath();
    ctx.ellipse(tr.x + 5, tr.y + 9, tr.r * 1.1, tr.r * 0.7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = night ? "#332b28" : "#795f48";
    ctx.fillRect(tr.x - 3, tr.y - 2, 6, 14);
    ctx.fillStyle = night ? "#152b26" : "#507c53";
    ctx.beginPath();
    ctx.arc(tr.x, tr.y - 3, tr.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = night ? "#1d3830" : "#78a96a";
    ctx.beginPath();
    ctx.arc(tr.x - 5, tr.y - 8, tr.r * 0.57, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = night ? "#7d744f" : "#b7ce76";
    ctx.beginPath();
    ctx.arc(tr.x + 5, tr.y - 5, 3, 0, Math.PI * 2);
    ctx.fill();
  }
  for (let y = 120; y < world.h; y += 270)
    for (const x of roadsX) {
      ctx.fillStyle = night ? "#ffffff10" : "#ffffff18";
      ctx.fillRect(x - roadW / 2 + 8, y, 15, 40);
      ctx.strokeStyle = night ? "#343a3c" : "#323b40";
      for (let k = 0; k < 5; k++) {
        ctx.beginPath();
        ctx.moveTo(x - roadW / 2 + 10, y + k * 8);
        ctx.lineTo(x - roadW / 2 + 22, y + k * 8);
        ctx.stroke();
      }
    }
  for (const p of puddles) {
    if (
      p.x + p.rx < minX ||
      p.x - p.rx > maxX ||
      p.y + p.ry < minY ||
      p.y - p.ry > maxY
    )
      continue;
    ctx.fillStyle = night ? "#3a6b8140" : "#66b6c64a";
    ctx.beginPath();
    ctx.ellipse(p.x, p.y, p.rx, p.ry, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = night ? "#b1c6cc55" : "#d8f0e873";
    ctx.beginPath();
    ctx.ellipse(
      p.x - 3,
      p.y - 2,
      p.rx * 0.55,
      p.ry * 0.3,
      -0.2,
      Math.PI,
      Math.PI * 2,
    );
    ctx.stroke();
  }
  for (const p of pigeons) {
    if (p.x < minX || p.x > maxX || p.y < minY || p.y > maxY) continue;
    const flap = Math.sin(t * 8 + p.phase);
    ctx.fillStyle = night ? "#303a40" : "#394b51";
    ctx.beginPath();
    ctx.ellipse(p.x, p.y, 7, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(p.x - 2, p.y);
    ctx.quadraticCurveTo(p.x - 8, p.y - 5 - flap * 2, p.x - 10, p.y - 1);
    ctx.quadraticCurveTo(p.x - 5, p.y - 2, p.x, p.y + 1);
    ctx.fill();
    ctx.fillStyle = night ? "#b8a06b" : "#e5bd62";
    ctx.fillRect(p.x + 6, p.y - 1, 3, 2);
  }
}
function drawStreetLights(t) {
  const night = stage === 3,
    minX = player.x - W * 0.62,
    maxX = player.x + W * 0.62,
    minY = player.y - H * 0.62,
    maxY = player.y + H * 0.62,
    lamps = [];
  roadsX.forEach((roadX) => {
    for (let y = 680; y < world.h; y += 640)
      for (const side of [-1, 1]) lamps.push([roadX + side * 106, y]);
  });
  roadsY.forEach((roadY) => {
    for (let x = 750; x < world.w; x += 660)
      for (const side of [-1, 1]) lamps.push([x, roadY + side * 106]);
  });
  for (const [x, y] of lamps) {
    if (x < minX || x > maxX || y < minY || y > maxY) continue;
    if (night) {
      const glow = ctx.createRadialGradient(x, y - 4, 1, x, y - 4, 40);
      glow.addColorStop(0, "#ffcf7866");
      glow.addColorStop(1, "#ffcf7800");
      ctx.fillStyle = glow;
      ctx.fillRect(x - 40, y - 44, 80, 80);
    }
    ctx.fillStyle = "#0004";
    ctx.beginPath();
    ctx.ellipse(x + 4, y + 5, 10, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = night ? "#7b8279" : "#65716d";
    rounded(ctx, x - 2, y - 8, 4, 16, 2);
    ctx.fillStyle = night ? "#343f42" : "#435457";
    rounded(ctx, x - 7, y - 13, 14, 7, 3);
    ctx.fillStyle = night ? "#ffd487" : "#f3d58e";
    rounded(ctx, x - 4, y - 11, 8, 3, 1);
  }
}
function drawSmilaLandmarks(t) {
  ctx.save();
  ctx.translate(700, 760);
  ctx.fillStyle = "#617255";
  rounded(ctx, -136, -122, 272, 231, 17);
  ctx.fillStyle = "#c8c2a3";
  rounded(ctx, -126, -112, 252, 211, 14);
  ctx.fillStyle = "#a4b37c";
  rounded(ctx, -118, -104, 236, 195, 12);
  ctx.fillStyle = "#d5c9a8";
  ctx.fillRect(-13, 46, 26, 58);
  ctx.fillRect(-84, 53, 168, 22);
  for (const [x, y] of [
    [-104, -83],
    [104, -83],
    [-104, 69],
    [104, 69],
  ]) {
    ctx.fillStyle = "#53734d";
    ctx.beginPath();
    ctx.arc(x, y, 13, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#7e9f61";
    ctx.beginPath();
    ctx.arc(x - 3, y - 3, 8, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = "#e3d7bd";
  rounded(ctx, -82, -59, 164, 133, 12);
  ctx.fillStyle = "#6d5360";
  rounded(ctx, -72, -50, 144, 113, 9);
  ctx.fillStyle = "#9c666a";
  ctx.fillRect(-65, -43, 130, 12);
  ctx.fillStyle = "#c9b792";
  ctx.fillRect(-8, 22, 16, 39);
  ctx.fillStyle = "#26333c";
  ctx.fillRect(-5, 39, 10, 23);
  ctx.fillStyle = "#e8d7ad";
  ctx.beginPath();
  ctx.ellipse(0, -5, 34, 30, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#4b7790";
  ctx.beginPath();
  ctx.ellipse(0, -9, 26, 23, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#d7aa55";
  ctx.beginPath();
  ctx.ellipse(0, -13, 17, 16, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#f4d784";
  ctx.fillRect(-2, -42, 4, 20);
  ctx.fillRect(-8, -37, 16, 4);
  ctx.fillStyle = "#d7aa55";
  ctx.beginPath();
  ctx.moveTo(-18, -48);
  ctx.lineTo(0, -66);
  ctx.lineTo(18, -48);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#f4d784";
  ctx.fillRect(-2, -78, 4, 16);
  ctx.fillRect(-7, -74, 14, 3);
  ctx.fillStyle = "#23313a";
  rounded(ctx, -84, 105, 168, 24, 5);
  ctx.fillStyle = "#fff3d6";
  ctx.font = "bold 12px Arial";
  ctx.textAlign = "center";
  ctx.fillText("ЦЕРКВА СМІЛИ", 0, 122);
  ctx.restore();
  ctx.save();
  ctx.translate(2760, 2034);
  ctx.fillStyle = "#0006";
  rounded(ctx, -218, -78, 436, 244, 18);
  ctx.fillStyle = "#576160";
  rounded(ctx, -224, -88, 436, 244, 18);
  ctx.fillStyle = "#98a295";
  rounded(ctx, -213, -77, 414, 222, 14);
  ctx.fillStyle = "#697976";
  rounded(ctx, -190, -57, 236, 174, 10);
  ctx.fillStyle = "#526363";
  rounded(ctx, -181, -48, 218, 155, 8);
  ctx.fillStyle = "#8ca49a";
  ctx.fillRect(-168, -34, 68, 10);
  ctx.fillRect(-168, -14, 68, 7);
  ctx.fillRect(-168, 4, 68, 7);
  ctx.fillStyle = "#38494b";
  rounded(ctx, 58, -48, 124, 154, 9);
  ctx.fillStyle = "#7d9390";
  ctx.fillRect(72, -34, 96, 14);
  ctx.fillStyle = "#4e6664";
  ctx.fillRect(72, -8, 96, 100);
  ctx.fillStyle = "#d2915c";
  ctx.fillRect(-194, 118, 392, 8);
  for (let x = -194; x <= 194; x += 24) {
    ctx.fillStyle = "#63716c";
    ctx.fillRect(x, 129, 10, 9);
  }
  for (const [x, h, w] of [
    [-128, 132, 34],
    [-47, 184, 38],
    [42, 151, 31],
    [128, 116, 34],
  ]) {
    ctx.fillStyle = "#394a4c";
    rounded(ctx, x - 4, -h - 61, w + 8, h + 15, 5);
    ctx.fillStyle = "#75837d";
    ctx.fillRect(x, -h - 55, w, h);
    ctx.fillStyle = "#d8865d";
    ctx.fillRect(x + 5, -h - 64, w - 10, 9);
    ctx.fillStyle = "#f4c16e";
    ctx.fillRect(x + w / 2 - 3, -h - 64, 6, 4);
    for (let k = 0; k < 3; k++) {
      ctx.globalAlpha = 0.14;
      ctx.fillStyle = "#e5e4cf";
      ctx.beginPath();
      ctx.arc(
        x + w / 2 + Math.sin(t * 0.7 + k + x) * 5,
        -h - 78 - k * 19,
        12 + k * 3,
        0,
        Math.PI * 2,
      );
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }
  ctx.strokeStyle = "#d59462";
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.moveTo(44, 42);
  ctx.lineTo(44, -28);
  ctx.lineTo(58, -28);
  ctx.moveTo(46, 42);
  ctx.lineTo(183, 42);
  ctx.stroke();
  ctx.fillStyle = "#f2d18a";
  ctx.font = "900 17px Arial";
  ctx.textAlign = "center";
  ctx.fillText("АЗОТ · СМІЛА", -86, 141);
  ctx.restore();
}
function drawDistrict() {
  // title mural / plaza lettering, no external assets
  const fx = 1740,
    fy = 1640;
  ctx.save();
  ctx.translate(fx, fy);
  ctx.fillStyle = "#d4c394";
  rounded(ctx, -123, -95, 246, 190, 13);
  ctx.fillStyle = "#61756b";
  rounded(ctx, -110, -83, 220, 166, 9);
  ctx.fillStyle = "#4a625b";
  rounded(ctx, -91, -63, 182, 126, 8);
  ctx.fillStyle = "#ead79b";
  ctx.font = "bold 16px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("СМІЛА", 0, -11);
  ctx.font = "11px sans-serif";
  ctx.fillText("МІСТО ВЕЛИКИХ МАРШРУТІВ", 0, 10);
  ctx.fillStyle = "#e89061";
  ctx.beginPath();
  ctx.arc(0, 38, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#8fb5a2";
  ctx.fillRect(-55, 46, 110, 3);
  ctx.restore();
  // roadside park band
  ctx.fillStyle = "#83a975";
  ctx.fillRect(1910, 1510, 220, 250);
  ctx.fillStyle = "#9bbd83";
  for (let i = 0; i < 9; i++) {
    let x = 1930 + (i % 3) * 66,
      y = 1535 + Math.floor(i / 3) * 68;
    ctx.beginPath();
    ctx.arc(x, y, 19, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#547e55";
    ctx.beginPath();
    ctx.arc(x - 4, y - 5, 13, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#9bbd83";
  }
}
function drawCar(car, t) {
  let bob = Math.sin(t * 2 + car.phase) * 0.8;
  ctx.save();
  ctx.translate(car.x, car.y + bob);
  ctx.rotate(
    car.horizontal
      ? car.dir > 0
        ? 0
        : Math.PI
      : car.dir > 0
        ? Math.PI / 2
        : -Math.PI / 2,
  );
  ctx.fillStyle = "#0005";
  rounded(ctx, -29, -13, 62, 32, 9);
  ctx.fillStyle = "#273039";
  rounded(ctx, -30, -19, 17, 7, 3);
  rounded(ctx, 13, -19, 17, 7, 3);
  rounded(ctx, -30, 13, 17, 7, 3);
  rounded(ctx, 13, 13, 17, 7, 3);
  ctx.fillStyle = car.color;
  rounded(ctx, -32, -16, 64, 30, 8);
  ctx.fillStyle = "#283940";
  rounded(ctx, -15, -12, 30, 24, 6);
  ctx.fillStyle = "#a9d1ce";
  rounded(ctx, -11, -9, 22, 9, 3);
  ctx.fillStyle = "#73949a";
  rounded(ctx, -11, 2, 22, 7, 3);
  ctx.fillStyle = "#fff0bd";
  rounded(ctx, 27, -11, 5, 7, 2);
  rounded(ctx, 27, 3, 5, 7, 2);
  ctx.fillStyle = "#e97958";
  rounded(ctx, -33, -10, 4, 7, 2);
  rounded(ctx, -33, 2, 4, 7, 2);
  ctx.fillStyle = "#fff7d8";
  ctx.fillRect(19, -2, 8, 3);
  ctx.restore();
}
function drawDelivery(d, i, t) {
  if (!d || d.done) return;
  const pulse = 1 + Math.sin(t * 3 + i) * 0.08;
  ctx.save();
  ctx.translate(d.x, d.y);
  ctx.fillStyle = d.color + "24";
  ctx.beginPath();
  ctx.arc(0, 0, 77 * pulse, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = d.color;
  ctx.globalAlpha = 0.45 + 0.4 * Math.sin(t * 4 + i);
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(0, 0, 55 * pulse, 0, Math.PI * 2);
  ctx.stroke();
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#17232d";
  rounded(ctx, -91, -43, 182, 85, 10);
  ctx.fillStyle = "#fff";
  rounded(ctx, -87, -39, 174, 77, 8);
  const logo = logos[d.brand];
  if (logo?.complete && logo.naturalWidth) {
    if (d.brand === "meest")
      ctx.drawImage(logo, 39, 139, 357, 140, -72, -33, 144, 54);
    else {
      const ratio = Math.min(162 / logo.width, 43 / logo.height),
        w = logo.width * ratio,
        h = logo.height * ratio;
      ctx.drawImage(logo, -w / 2, -28, w, h);
    }
  } else {
    ctx.fillStyle = d.color;
    ctx.font = "bold 16px Arial,sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(d.name, 0, -6);
  }
  ctx.fillStyle = "#53636a";
  ctx.font = "bold 10px Arial,sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(d.sub, 0, 27);
  ctx.fillStyle = "#17202b";
  ctx.beginPath();
  ctx.arc(-78, 42, 6, 0, Math.PI * 2);
  ctx.arc(78, 42, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#f7d78b";
  ctx.beginPath();
  ctx.moveTo(0, -56);
  ctx.lineTo(-9, -70);
  ctx.lineTo(-3, -70);
  ctx.lineTo(-3, -86);
  ctx.lineTo(3, -86);
  ctx.lineTo(3, -70);
  ctx.lineTo(9, -70);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}
function drawPlayer(t) {
  ctx.save();
  ctx.translate(player.x, player.y);
  ctx.rotate(player.dir + Math.PI / 2);
  ctx.scale(stage === 3 ? 0.7 : 0.62, stage === 3 ? 0.7 : 0.62);
  if (player.boost > 0) {
    ctx.globalAlpha = 0.72;
    ctx.fillStyle = "#65f1dc";
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.ellipse(0, 42 + i * 8, 9 - i, 14, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
  ctx.fillStyle = "#0008";
  ctx.beginPath();
  ctx.ellipse(2, 9, 30, 47, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#101820";
  ctx.beginPath();
  ctx.ellipse(0, -47, 13, 16, 0, 0, Math.PI * 2);
  ctx.ellipse(0, 46, 13, 16, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#d9e8e5";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(0, -47, 8, 10, 0, 0, Math.PI * 2);
  ctx.ellipse(0, 46, 8, 10, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = "#47e5d2";
  ctx.beginPath();
  ctx.arc(0, -47, 4, 0, Math.PI * 2);
  ctx.arc(0, 46, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#fff0ad";
  rounded(ctx, -5, -64, 10, 5, 2);
  ctx.fillStyle = "#f17458";
  rounded(ctx, -5, 59, 10, 5, 2);
  ctx.fillStyle = "#1b3440";
  rounded(ctx, -13, -32, 26, 63, 8);
  ctx.strokeStyle = "#91a9a5";
  ctx.lineWidth = 2;
  ctx.strokeRect(-13, -32, 26, 63);
  ctx.fillStyle = "#41d8c2";
  rounded(ctx, -9, -29, 18, 57, 6);
  ctx.fillStyle = "#f6d46e";
  rounded(ctx, -30, -43, 60, 8, 4);
  ctx.fillStyle = "#202b35";
  rounded(ctx, -33, -44, 9, 10, 4);
  rounded(ctx, 24, -44, 9, 10, 4);
  ctx.strokeStyle = "#defff7";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, -39);
  ctx.lineTo(0, -29);
  ctx.stroke();
  ctx.fillStyle = "#17232d";
  rounded(ctx, -14, 8, 11, 21, 4);
  rounded(ctx, 3, 8, 11, 21, 4);
  ctx.fillStyle = "#f2c974";
  rounded(ctx, -16, 23, 14, 7, 3);
  rounded(ctx, 2, 23, 14, 7, 3);
  ctx.fillStyle = "#e57948";
  rounded(ctx, -15, -7, 30, 26, 9);
  ctx.fillStyle = "#263d49";
  rounded(ctx, -13, -3, 26, 20, 6);
  ctx.fillStyle = "#eebf64";
  rounded(ctx, -11, 0, 22, 15, 4);
  ctx.fillStyle = "#f5e0a0";
  ctx.fillRect(-2, 0, 4, 15);
  ctx.strokeStyle = "#f8c49b";
  ctx.lineWidth = 7;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(-11, -1);
  ctx.lineTo(-21, -13);
  ctx.lineTo(-27, -39);
  ctx.moveTo(11, -1);
  ctx.lineTo(21, -13);
  ctx.lineTo(27, -39);
  ctx.stroke();
  ctx.fillStyle = "#ffe28d";
  ctx.beginPath();
  ctx.arc(-27, -40, 4, 0, Math.PI * 2);
  ctx.arc(27, -40, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#f0a845";
  ctx.beginPath();
  ctx.arc(0, -21, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#253b45";
  rounded(ctx, -11, -25, 22, 10, 5);
  ctx.fillStyle = "#a8f4ed";
  rounded(ctx, -7, -22, 14, 4, 2);
  ctx.restore();
  if (player.bump > 0) {
    ctx.save();
    ctx.globalAlpha = Math.min(1, player.bump * 2);
    ctx.fillStyle = "#fff1a6";
    ctx.font = "bold 16px Arial,sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("ОЙ!", player.x + 25, player.y - 26);
    ctx.restore();
  }
}
function spawnCafeOrder(index) {
  if (cafeOrders[index]) return;
  const available = cafeMenu.filter(
    (item) =>
      !cafeOrders.some((order) => order && order.items.includes(item.id)),
  );
  const pool = available.length ? available : cafeMenu;
  const choices = shuffled(pool),
    count = Math.min(pool.length, Math.random() < 0.62 ? 1 : 2),
    orderNumber = ++cafeOrdersCreated;
  cafeOrders[index] = {
    items: choices.slice(0, count).map((item) => item.id),
    patience: 78,
    orderNumber,
  };
}
function cafeInteract() {
  if (cafeActionCooldown > 0) return;
  cafeActionCooldown = 0.24;
  let station = null,
    stationDist = 1e9;
  for (const item of cafeMenu) {
    const d = Math.hypot(player.x - item.x, player.y - 650);
    if (d < stationDist) {
      station = item;
      stationDist = d;
    }
  }
  let table = -1,
    tableDist = 1e9;
  for (let i = 0; i < cafeTables.length; i++) {
    const p = cafeTables[i],
      d = Math.hypot(player.x - p.x, player.y - p.y);
    if (d < tableDist) {
      table = i;
      tableDist = d;
    }
  }
  if (!heldDish) {
    if (station && stationDist < 92) {
      heldDish = station.id;
      showToast(`ВЗЯТО: ${station.name.toUpperCase()} · НЕСИ ДО СТОЛИКА`);
      tone(480, 0.08, "triangle", 0.035, 90);
    } else showToast("ПІДІЙДИ ДО КУХОННОЇ СТАНЦІЇ");
    return;
  }
  if (station && stationDist < 92) {
    const dish = cafeMenu.find((item) => item.id === heldDish);
    heldDish = null;
    showToast(`${dish.name.toUpperCase()} ПОВЕРНУТО НА КУХНЮ`);
    return;
  }
  if (table >= 0 && tableDist < 92) {
    const order = cafeOrders[table];
    if (!order) {
      showToast(
        "ЗА ЦИМ СТОЛИКОМ ПОКИ НЕМАЄ ЗАМОВЛЕННЯ · СТРАВА ЛИШАЄТЬСЯ У ТЕБЕ",
      );
      return;
    }
    const index = order.items.indexOf(heldDish);
    if (index < 0) {
      const wanted = order.items
        .map((id) => cafeMenu.find((item) => item.id === id)?.name)
        .filter(Boolean)
        .join(" + ");
      showToast(`ЦЬОМУ СТОЛИКУ ПОТРІБНО: ${wanted} · СТРАВА ЛИШАЄТЬСЯ У ТЕБЕ`);
      return;
    }
    order.items.splice(index, 1);
    heldDish = null;
    score += 100;
    chime();
    if (order.items.length === 0) {
      cafeServed++;
      score += 200 + Math.round(order.patience * 2);
      cafeOrders[table] = null;
      document.getElementById("delivered").textContent = `${cafeServed} / 10`;
      showToast(`СТОЛИК ${table + 1} ОБСЛУЖЕНО! · ${cafeServed} / 10`);
      if (cafeServed >= 10) {
        finish(true);
        return;
      }
      spawnCafeOrder(table);
    } else showToast(`СМАЧНО! ЩЕ ${order.items.length} ПОЗИЦІЯ У ЗАМОВЛЕННІ`);
    return;
  }
  const dish = cafeMenu.find((item) => item.id === heldDish);
  showToast(`НЕСИ ${dish.name.toUpperCase()} ДО ПОТРІБНОГО СТОЛИКА`);
}
function updateCafe(dt) {
  const { x: dx, y: dy } = movementAxes();
  const baseSpeed = 405,
    targetVx = dx * baseSpeed,
    targetVy = dy * baseSpeed,
    responsiveness = dx || dy ? 19 : 22;
  player.vx += (targetVx - player.vx) * Math.min(1, dt * responsiveness);
  player.vy += (targetVy - player.vy) * Math.min(1, dt * responsiveness);
  if (dx || dy) player.dir = Math.atan2(player.vy, player.vx);
  if (boostPressed) {
    boostPressed = false;
    if (player.boostCd <= 0) {
      player.boost = 0.5;
      player.boostCd = 2;
      const n = Math.hypot(player.vx, player.vy) || 1;
      player.vx += (player.vx / n) * 265;
      player.vy += (player.vy / n) * 265;
      tone(290, 0.1, "sawtooth", 0.025, 210);
    }
  }
  player.boostCd = Math.max(0, player.boostCd - dt);
  player.boost = Math.max(0, player.boost - dt);
  const max = player.boost > 0 ? 500 : baseSpeed,
    sp = Math.hypot(player.vx, player.vy);
  if (sp > max) {
    player.vx = (player.vx / sp) * max;
    player.vy = (player.vy / sp) * max;
  }
  const blocked = (x, y) =>
    cafeTables.some((p) => {
      const ox = (x - p.x) / 84,
        oy = (y - p.y) / 58;
      return ox * ox + oy * oy < 1;
    });
  const nextX = clamp(player.x + player.vx * dt, 70, W - 70),
    nextY = clamp(player.y + player.vy * dt, 145, 730);
  if (!blocked(nextX, player.y)) player.x = nextX;
  else player.vx = 0;
  if (!blocked(player.x, nextY)) player.y = nextY;
  else player.vy = 0;
  cafeActionCooldown = Math.max(0, cafeActionCooldown - dt);
  for (let i = 0; i < cafeOrders.length; i++) {
    const order = cafeOrders[i];
    if (!order) continue;
    order.patience = Math.max(0, order.patience - dt);
    if (order.patience <= 0) {
      cafeOrders[i] = null;
      score = Math.max(0, score - 60);
      spawnCafeOrder(i);
      showToast(`СТОЛИК ${i + 1} ВТРАТИВ ТЕРПІННЯ · НОВЕ ЗАМОВЛЕННЯ`);
      tone(155, 0.12, "square", 0.02, -45);
    }
  }
  if (interactPressed) {
    interactPressed = false;
    cafeInteract();
  }
  document.getElementById("delivered").textContent = `${cafeServed} / 10`;
  document.getElementById("score").textContent = String(score).padStart(4, "0");
  document.getElementById("timer").textContent = formatTime(time);
  if (toastTimer > 0) {
    toastTimer -= dt;
    if (toastTimer <= 0)
      document.getElementById("toast").classList.remove("show");
  }
}
function drawFoodIcon(c, id, x, y, size) {
  c.save();
  c.translate(x, y);
  c.scale(size / 40, size / 40);
  c.lineJoin = "round";
  if (id === "syrnyky") {
    for (const [dx, dy, r] of [
      [-10, 3, 10],
      [9, 2, 10],
      [0, -8, 10],
    ]) {
      c.fillStyle = "#9c5b2c";
      c.beginPath();
      c.arc(dx, dy, r + 1, 0, Math.PI * 2);
      c.fill();
      c.fillStyle = "#f1bd61";
      c.beginPath();
      c.arc(dx, dy, r, 0, Math.PI * 2);
      c.fill();
      c.fillStyle = "#ffdf91";
      c.beginPath();
      c.arc(dx - 2, dy - 2, r * 0.55, 0, Math.PI * 2);
      c.fill();
      c.fillStyle = "#fff1c6";
      c.beginPath();
      c.arc(dx + 2, dy + 2, 1.5, 0, Math.PI * 2);
      c.fill();
    }
  } else if (id === "pizza") {
    c.fillStyle = "#9a492f";
    c.beginPath();
    c.roundRect(-18, -18, 36, 36, 3);
    c.fill();
    c.fillStyle = "#e8a743";
    c.beginPath();
    c.roundRect(-15, -15, 30, 30, 2);
    c.fill();
    c.fillStyle = "#cf493a";
    c.beginPath();
    c.roundRect(-11, -11, 22, 22, 2);
    c.fill();
    c.fillStyle = "#f2cb68";
    c.beginPath();
    c.roundRect(-8, -8, 16, 16, 2);
    c.fill();
    for (const [dx, dy] of [
      [-5, -4],
      [4, -5],
      [-4, 5],
      [5, 4],
    ]) {
      c.fillStyle = "#a9443b";
      c.beginPath();
      c.arc(dx, dy, 2.5, 0, Math.PI * 2);
      c.fill();
    }
    c.fillStyle = "#5c914e";
    c.beginPath();
    c.ellipse(0, 0, 2, 4, 0.7, 0, Math.PI * 2);
    c.fill();
  } else if (id === "condensed") {
    c.fillStyle = "#f4f3df";
    c.beginPath();
    c.roundRect(-14, -15, 28, 30, 5);
    c.fill();
    c.fillStyle = "#278cae";
    c.beginPath();
    c.roundRect(-13, -8, 26, 17, 3);
    c.fill();
    c.fillStyle = "#f2cd5e";
    c.fillRect(-13, -12, 26, 4);
    c.fillStyle = "#fff";
    c.font = "bold 5px Arial,sans-serif";
    c.textAlign = "center";
    c.fillText("КУП’ЯНСЬКЕ", 0, 0);
    c.fillStyle = "#bc4b7b";
    c.beginPath();
    c.ellipse(0, 7, 7, 5, 0, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = "#f6e8dc";
    c.beginPath();
    c.arc(0, 5, 3.5, 0, Math.PI * 2);
    c.fill();
    c.beginPath();
    c.ellipse(-2, 1, 1.3, 4, -0.2, 0, Math.PI * 2);
    c.ellipse(2, 1, 1.3, 4, 0.2, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = "#4a3840";
    c.fillRect(-1, 5, 1, 1);
    c.fillRect(2, 5, 1, 1);
  } else if (id === "sandwich") {
    c.fillStyle = "#9b5b34";
    c.beginPath();
    c.moveTo(-18, 8);
    c.lineTo(-12, -8);
    c.quadraticCurveTo(0, -20, 12, -8);
    c.lineTo(18, 8);
    c.closePath();
    c.fill();
    c.fillStyle = "#f0d18b";
    c.fillRect(-16, 5, 32, 5);
    c.fillStyle = "#8d4431";
    c.fillRect(-14, -2, 28, 8);
    c.fillStyle = "#65a65e";
    c.fillRect(-13, -6, 26, 4);
  } else if (id === "pelmeni") {
    if (ermolinoLogo.complete && ermolinoLogo.naturalWidth) {
      c.fillStyle = "#fff";
      c.beginPath();
      c.arc(0, 0, 19, 0, Math.PI * 2);
      c.fill();
      const pad = 2;
      c.drawImage(ermolinoLogo, -20 + pad, -20 + pad, 36, 36);
    } else {
      c.fillStyle = "#fff";
      c.font = "bold 7px Arial,sans-serif";
      c.textAlign = "center";
      c.textBaseline = "middle";
      c.fillText("ЄРМОЛІНО", 0, 0);
    }
  }
  c.restore();
}
function drawVrGuest(p, i, t, o = null) {
  const shirts = [
      "#6f84bd",
      "#cb745a",
      "#779b75",
      "#b37ca1",
      "#4f9a9b",
      "#b28c51",
    ],
    skin = ["#efc795", "#dca878", "#f1d1aa", "#c99068", "#e8ba8c", "#d7a174"],
    hair = ["#322d36", "#74513b", "#222934", "#aa7647", "#5c3f34", "#c5ae76"],
    x = p.x,
    y = p.y,
    angry = o && o.patience < 25,
    pulse = 1 + Math.sin(t * 2 + i) * 0.025,
    gesture = angry ? Math.sin(t * 12 + i) * 10 : Math.sin(t * 2 + i) * 3,
    turn = Math.sign(player.x - x) * 3,
    c = ctx;
  c.save();
  c.fillStyle = "#25343f";
  c.beginPath();
  c.ellipse(x, y + 62, 31, 19, 0, 0, Math.PI * 2);
  c.fill();
  c.fillStyle = shirts[i % shirts.length];
  c.beginPath();
  c.ellipse(x + Math.sin(t * 1.4 + i) * 2, y + 52, 22, 29, 0, 0, Math.PI * 2);
  c.fill();
  c.strokeStyle = shirts[i % shirts.length];
  c.lineWidth = 9;
  c.lineCap = "round";
  c.beginPath();
  c.moveTo(x - 15, y + 43);
  c.lineTo(x - 28, y + 28);
  c.moveTo(x + 15, y + 43);
  c.lineTo(x + 29, y + 25 + gesture);
  c.stroke();
  for (const side of [-1, 1]) {
    c.fillStyle = "#203542";
    rounded(c, x + side * 30 - 7, y + 19, 14, 18, 5);
    c.fillStyle = "#53dedb";
    c.beginPath();
    c.arc(x + side * 30, y + 28, 3, 0, Math.PI * 2);
    c.fill();
  }
  c.fillStyle = skin[i % skin.length];
  c.beginPath();
  c.arc(x + turn, y + 27, 18 * pulse, 0, Math.PI * 2);
  c.fill();
  c.fillStyle = hair[i % hair.length];
  c.beginPath();
  c.arc(x + turn, y + 23, 18, Math.PI, Math.PI * 2);
  c.fill();
  c.fillStyle = "#172832";
  rounded(c, x - 25, y + 17, 50, 22, 8);
  c.fill();
  c.strokeStyle = "#526d77";
  c.lineWidth = 2;
  c.beginPath();
  c.arc(x, y + 23, 25, Math.PI, Math.PI * 2);
  c.stroke();
  c.fillStyle = angry ? "#f48574" : "#27b8c2";
  rounded(c, x - 19, y + 20, 17, 14, 5);
  rounded(c, x + 2, y + 20, 17, 14, 5);
  c.fillStyle = "#bafffa";
  c.beginPath();
  c.arc(x - 10.5, y + 27, 4, 0, Math.PI * 2);
  c.arc(x + 10.5, y + 27, 4, 0, Math.PI * 2);
  c.fill();
  c.fillStyle = "#152631";
  c.beginPath();
  c.arc(x, y + 27, 2.5, 0, Math.PI * 2);
  c.fill();
  c.fillStyle = "#d5ffff";
  c.font = "bold 7px Arial,sans-serif";
  c.textAlign = "center";
  c.fillText("VR", x, y + 16);
  if (angry) {
    c.fillStyle = "#fff4db";
    rounded(c, x - 23, y - 14, 46, 20, 8);
    c.fillStyle = "#c14d4c";
    c.font = "bold 14px Arial";
    c.fillText("…", x, y + 1);
  }
  c.restore();
}
function drawCafeAvatar(t) {
  ctx.save();
  ctx.translate(player.x, player.y);
  ctx.rotate(player.dir + Math.PI / 2);
  ctx.fillStyle = "#0006";
  ctx.beginPath();
  ctx.ellipse(3, 12, 26, 16, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#283c4b";
  ctx.beginPath();
  ctx.ellipse(0, 3, 14, 23, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#49cbb8";
  rounded(ctx, -13, -12, 26, 23, 8);
  ctx.fillStyle = "#f7c993";
  ctx.beginPath();
  ctx.arc(0, -18, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#3b2c2a";
  ctx.beginPath();
  ctx.arc(0, -21, 9, Math.PI, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#f0d9aa";
  rounded(ctx, -10, 3, 20, 7, 3);
  ctx.restore();
  if (heldDish) {
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(player.x + 23, player.y - 30, 23, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#38505a";
    ctx.lineWidth = 2;
    ctx.stroke();
    drawFoodIcon(ctx, heldDish, player.x + 23, player.y - 30, 34);
  }
}
function drawCafe(t) {
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "#a98866";
  ctx.fillRect(0, 0, W, H);
  for (let y = 0; y < H; y += 64)
    for (let x = 0; x < W; x += 64) {
      ctx.fillStyle = (x / 64 + y / 64) % 2 === 0 ? "#e2d2b2" : "#d4c19e";
      ctx.fillRect(x, y, 62, 62);
    }
  ctx.fillStyle = "#293c48";
  ctx.fillRect(0, 0, W, 136);
  ctx.fillStyle = "#172a35";
  ctx.fillRect(0, 132, W, 15);
  ctx.fillStyle = "#f7e6c4";
  ctx.font = "900 29px Arial,sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.fillText("VR-КАФЕ «СМІЛА»", W / 2, 61);
  ctx.font = "bold 14px Arial,sans-serif";
  ctx.fillStyle = "#72f0dc";
  ctx.fillText("ЗАМОВЛЕННЯ Є. РЕАЛЬНІСТЬ — ЗА БАЖАННЯМ.", W / 2, 92);
  ctx.fillStyle = "#f4cb7a";
  ctx.font = "bold 12px Arial,sans-serif";
  ctx.fillText("ГОСТІ У VR · КУХНЯ ПРАЦЮЄ НАСПРАВДІ", W / 2, 118);
  for (let x = 70; x < 250; x += 90) {
    ctx.fillStyle = "#68a4b0";
    rounded(ctx, x, 30, 66, 75, 8);
    ctx.fillStyle = "#d8eee2";
    ctx.fillRect(x + 7, 38, 52, 4);
    ctx.fillStyle = "#34464c";
    ctx.fillRect(x + 31, 30, 4, 75);
  }
  for (let i = 0; i < cafeTables.length; i++) {
    const p = cafeTables[i],
      o = cafeOrders[i];
    ctx.fillStyle = "#34464d";
    for (const [dx, dy] of [
      [-63, -33],
      [63, -33],
      [-63, 33],
      [63, 33],
    ]) {
      ctx.beginPath();
      ctx.arc(p.x + dx, p.y + dy, 14, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = "#0004";
    ctx.beginPath();
    ctx.ellipse(p.x + 4, p.y + 9, 83, 57, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#714a36";
    ctx.beginPath();
    ctx.ellipse(p.x, p.y + 1, 80, 54, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#bd8a60";
    ctx.beginPath();
    ctx.ellipse(p.x, p.y - 4, 76, 49, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#eed0a1";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(p.x, p.y - 4, 67, 41, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "#f1d7a6";
    ctx.font = "bold 14px Arial,sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`СТІЛ ${i + 1}`, p.x, p.y + 1);
    drawVrGuest(p, i, t, o);
    if (o) {
      const by = p.y - 127;
      ctx.fillStyle = "#152732";
      rounded(ctx, p.x - 94, by - 3, 188, 100, 11);
      ctx.fillStyle = "#fffdf5";
      rounded(ctx, p.x - 90, by, 180, 94, 8);
      ctx.fillStyle = "#223641";
      ctx.font = "bold 15px Arial,sans-serif";
      ctx.fillText(`ЗАМОВЛЕННЯ №${o.orderNumber}`, p.x, by + 17);
      o.items.forEach((id, j) => {
        const x = p.x + (j - (o.items.length - 1) / 2) * 78;
        drawFoodIcon(ctx, id, x, by + 40, 28);
        ctx.fillStyle = "#182b33";
        ctx.font = "bold 12px Arial,sans-serif";
        const label =
          id === "pelmeni"
            ? "Пельмені Єрмоліно"
            : cafeMenu.find((m) => m.id === id).name;
        if (label === "Куп’янська згущонка") {
          ctx.fillText("Куп’янська", x, by + 59);
          ctx.fillText("згущонка", x, by + 72);
        } else if (label === "Бутерброд зі свининою") {
          ctx.fillText("Бутерброд", x, by + 59);
          ctx.fillText("зі свининою", x, by + 72);
        } else if (label === "Квадратна піца") {
          ctx.fillText("Квадратна", x, by + 59);
          ctx.fillText("піца", x, by + 72);
        } else if (label === "Пельмені Єрмоліно") {
          ctx.fillText("Пельмені", x, by + 59);
          ctx.fillText("Єрмоліно", x, by + 72);
        } else ctx.fillText(label, x, by + 65);
      });
      ctx.fillStyle = "#d7ded8";
      rounded(ctx, p.x - 63, by + 86, 126, 6, 3);
      ctx.fillStyle = o.patience > 30 ? "#28a978" : "#d94141";
      rounded(ctx, p.x - 63, by + 86, (126 * o.patience) / 78, 6, 3);
    }
  }
  if (heldDish) {
    let target = -1,
      dist = 1e9;
    for (let i = 0; i < cafeOrders.length; i++) {
      const order = cafeOrders[i];
      if (order?.items.includes(heldDish)) {
        const p = cafeTables[i],
          d = Math.hypot(player.x - p.x, player.y - p.y);
        if (d < dist) {
          target = i;
          dist = d;
        }
      }
    }
    if (target >= 0) {
      const p = cafeTables[target];
      ctx.save();
      ctx.strokeStyle = "#5af0d4";
      ctx.lineWidth = 4;
      ctx.setLineDash([9, 6]);
      ctx.beginPath();
      ctx.ellipse(p.x, p.y - 4, 91, 63, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "#071a19e8";
      rounded(ctx, p.x - 72, p.y - 93, 144, 24, 6);
      ctx.fillStyle = "#9bf9df";
      ctx.font = "bold 11px Arial";
      ctx.textAlign = "center";
      ctx.fillText("ЦЕЙ СТОЛИК ЧЕКАЄ", p.x, p.y - 77);
      ctx.restore();
    }
  }
  ctx.fillStyle = "#243942";
  rounded(ctx, 62, 610, 1156, 119, 17);
  ctx.fillStyle = "#76543d";
  rounded(ctx, 70, 617, 1140, 104, 14);
  for (const s of cafeMenu) {
    const nearStation = Math.hypot(player.x - s.x, player.y - 650) < 94;
    ctx.fillStyle = nearStation ? "#fff0be" : "#f3e4cc";
    rounded(ctx, s.x - 78, 623, 156, 90, 12);
    ctx.fillStyle = s.c;
    rounded(ctx, s.x - 73, 628, 146, 80, 9);
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(s.x, 642, 23, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#263b42";
    ctx.lineWidth = 2;
    ctx.stroke();
    drawFoodIcon(ctx, s.id, s.x, 642, s.id === "pelmeni" ? 48 : 38);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 12px Arial,sans-serif";
    ctx.textAlign = "center";
    if (s.id === "pelmeni") {
      ctx.fillText("ЄРМОЛІНО", s.x, 685);
    } else if (s.id === "condensed") {
      ctx.font = "bold 10px Arial,sans-serif";
      ctx.fillText("КУП’ЯНСЬКА", s.x, 673);
      ctx.fillText("ЗГУЩОНКА", s.x, 685);
    } else if (s.id === "sandwich") {
      ctx.font = "bold 10px Arial,sans-serif";
      ctx.fillText("БУТЕРБРОД", s.x, 673);
      ctx.fillText("ЗІ СВИНИНОЮ", s.x, 685);
    } else ctx.fillText(s.name, s.x, 685);
    ctx.fillStyle = "#182b33";
    rounded(ctx, s.x - 48, 690, 96, 20, 6);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 12px Arial,sans-serif";
    ctx.fillText(heldDish ? "E · ПОВЕРНУТИ" : "E · ВЗЯТИ", s.x, 704);
  }
  ctx.fillStyle = "#233740";
  ctx.fillRect(0, 740, W, 60);
  ctx.fillStyle = "#fff3da";
  ctx.font = "bold 15px Arial,sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("", W / 2, 778);
  drawCafeAvatar(t);
}
function drawCafeDestination(t) {
  const x = cafeDestination.x,
    y = cafeDestination.y,
    pulse = 1 + Math.sin(t * 4) * 0.1;
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "#39edb733";
  ctx.beginPath();
  ctx.arc(0, 0, 88 * pulse, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#39edb7";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(0, 0, 60 * pulse, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = "#172a35";
  rounded(ctx, -61, -44, 122, 78, 10);
  ctx.fillStyle = "#58d4b7";
  rounded(ctx, -54, -37, 108, 64, 7);
  ctx.fillStyle = "#fff6d7";
  ctx.fillRect(-39, -22, 78, 4);
  ctx.fillStyle = "#172a35";
  ctx.font = "900 21px Arial,sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("VR", 0, 3);
  ctx.font = "bold 13px Arial,sans-serif";
  ctx.fillText("КАФЕ", 0, 21);
  ctx.fillStyle = "#fff";
  rounded(ctx, -92, -81, 184, 25, 8);
  ctx.fillStyle = "#13232c";
  ctx.font = "bold 13px Arial,sans-serif";
  ctx.fillText("НА ЗМІНУ →", 0, -64);
  ctx.restore();
}
function drawNeonCity(t) {
  const minX = buildingBackdrop ? 0 : player.x - W * 0.65,
    maxX = buildingBackdrop ? world.w : player.x + W * 0.65,
    minY = buildingBackdrop ? 0 : player.y - H * 0.65,
    maxY = buildingBackdrop ? world.h : player.y + H * 0.65;
  ctx.save();
  for (const x of roadsX) {
    if (x < minX || x > maxX) continue;
    for (const y of roadsY) {
      if (y < minY || y > maxY) continue;
      const lx = x + roadW / 2 - 36,
        ly = y + roadW / 2 - 42;
      ctx.strokeStyle = "#44484a";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(lx, ly + 20);
      ctx.lineTo(lx, ly - 42);
      ctx.lineTo(lx - 21, ly - 52);
      ctx.stroke();
      ctx.fillStyle = "#f6d28b";
      rounded(ctx, lx - 29, ly - 57, 20, 9, 4);
    }
  }
  ctx.restore();
  for (let i = 0; i < 18; i++) {
    const x = 160 + ((i * 173) % world.w),
      y = 120 + ((i * 277) % world.h);
    if (
      x < minX ||
      x > maxX ||
      y < minY ||
      y > maxY ||
      roadsX.some((r) => Math.abs(x - r) < roadW * 0.8) ||
      roadsY.some((r) => Math.abs(y - r) < roadW * 0.8)
    )
      continue;
    ctx.fillStyle = "#18212b";
    rounded(ctx, x - 38, y - 24, 76, 48, 4);
    for (let wx = -25; wx <= 20; wx += 22)
      for (let wy = -12; wy <= 8; wy += 20) {
        ctx.fillStyle = (i + wx + wy) % 3 === 0 ? "#f0c77a" : "#43505a";
        ctx.fillRect(x + wx, y + wy, 9, 8);
      }
  }
}
function buildChaseBackdrop() {
  if (chaseBackdrop) return;
  const back = document.createElement("canvas");
  back.width = world.w;
  back.height = world.h;
  const screenCtx = ctx,
    oldStage = stage;
  try {
    ctx = back.getContext("2d", { alpha: false });
    stage = 3;
    buildingBackdrop = true;
    drawGround();
    drawScenery(0);
    drawDistrict();
    drawSmilaLandmarks(0);
    drawNeonCity(0);
    for (const x of roadsX)
      for (const y of roadsY) {
        ctx.fillStyle = "#d0c1a0";
        ctx.beginPath();
        ctx.arc(x, y, 13, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#6d8a69";
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fill();
      }
    chaseBackdrop = back;
  } catch (err) {
    console.warn("Night city cache unavailable; using live rendering.", err);
  } finally {
    ctx = screenCtx;
    stage = oldStage;
    buildingBackdrop = false;
  }
}
function drawChaseWorld(t) {
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "#10171b";
  ctx.fillRect(0, 0, W, H);
  const tx = W / 2 - player.x,
    ty = H / 2 - player.y;
  ctx.drawImage(chaseBackdrop, tx, ty);
  ctx.save();
  ctx.translate(tx, ty);
  for (const car of cars)
    if (
      car.x > player.x - W * 0.65 &&
      car.x < player.x + W * 0.65 &&
      car.y > player.y - H * 0.65 &&
      car.y < player.y + H * 0.65
    )
      drawCar(car, t);
  for (const pedestrian of pedestrians)
    if (
      pedestrian.x > player.x - W * 0.65 &&
      pedestrian.x < player.x + W * 0.65 &&
      pedestrian.y > player.y - H * 0.65 &&
      pedestrian.y < player.y + H * 0.65
    )
      drawPedestrian(pedestrian, t);
  deliveries.forEach((d, i) => drawDelivery(d, i, t));
  if (courierToCafe) drawCafeDestination(t);
  if (chaseMarkerActive) drawSafeMarker(t);
  drawChaseVan(t);
  drawPlayer(t);
  ctx.restore();
  drawNightOverlay(t);
}
function drawNightOverlay(t) {
  const draw = drawNightOverlay;
  let sprite = draw.glow;
  if (!sprite) {
    sprite = document.createElement("canvas");
    sprite.width = 160;
    sprite.height = 160;
    const gctx = sprite.getContext("2d"),
      g = gctx.createRadialGradient(80, 80, 2, 80, 80, 78);
    g.addColorStop(0, "rgba(255,209,132,.28)");
    g.addColorStop(0.38, "rgba(255,197,115,.12)");
    g.addColorStop(1, "rgba(255,185,90,0)");
    gctx.fillStyle = g;
    gctx.fillRect(0, 0, 160, 160);
    draw.glow = sprite;
  }
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  for (const x of roadsX) {
    const sx = W / 2 + x - player.x + roadW / 2;
    if (sx < -100 || sx > W + 100) continue;
    for (const y of roadsY) {
      const sy = H / 2 + y - player.y + roadW / 2;
      if (sy < -100 || sy > H + 100) continue;
      ctx.drawImage(
        sprite,
        sx - roadW * 0.18 - 80,
        sy - roadW * 0.18 - 80,
        160,
        160,
      );
      ctx.drawImage(
        sprite,
        sx + roadW * 0.18 - 80,
        sy + roadW * 0.18 - 80,
        160,
        160,
      );
    }
  }
  const vx = W / 2 + chaseVan.x - player.x,
    vy = H / 2 + chaseVan.y - player.y;
  ctx.drawImage(sprite, vx - 80, vy - 80, 160, 160);
  ctx.restore();
}
function drawSafeMarker(t) {
  const x = chaseDestination.x,
    y = chaseDestination.y,
    p = 1 + Math.sin(t * 5) * 0.12;
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "#55e7b933";
  ctx.beginPath();
  ctx.arc(0, 0, 88 * p, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#54edb8";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(0, 0, 60 * p, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = "#0d2927";
  rounded(ctx, -92, -54, 184, 91, 12);
  ctx.fillStyle = "#5be4b2";
  rounded(ctx, -85, -47, 170, 77, 9);
  ctx.fillStyle = "#12302c";
  ctx.font = "900 19px Arial,sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("БЕЗПЕЧНЕ", 0, -14);
  ctx.fillText("МІСЦЕ", 0, 10);
  ctx.font = "bold 11px Arial,sans-serif";
  ctx.fillText("МАРШРУТ ВІДКРИТО", 0, 28);
  ctx.restore();
}
function drawChaseVan(t) {
  ctx.save();
  ctx.translate(chaseVan.x, chaseVan.y + Math.sin(t * 8) * 1.5);
  ctx.rotate(Math.atan2(chaseVan.vy, chaseVan.vx) + Math.PI / 2);
  ctx.scale(0.76, 0.76);
  ctx.fillStyle = "#0007";
  rounded(ctx, -40, -65, 80, 132, 18);
  ctx.fillStyle = "#465142";
  rounded(ctx, -38, -67, 76, 132, 17);
  ctx.fillStyle = "#65704f";
  rounded(ctx, -32, -60, 64, 114, 13);
  ctx.fillStyle = "#17232a";
  rounded(ctx, -27, -46, 54, 35, 8);
  ctx.fillStyle = "#a9d7ce";
  rounded(ctx, -22, -41, 44, 24, 5);
  ctx.fillStyle = "#25302c";
  rounded(ctx, -26, 2, 52, 37, 8);
  ctx.fillStyle = "#b9c2ad";
  ctx.font = "900 16px Arial,sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("ТЦК", 0, 23);
  ctx.fillStyle = "#f6df8a";
  ctx.fillRect(-29, -65, 14, 5);
  ctx.fillRect(15, -65, 14, 5);
  ctx.fillStyle = "#fff2c1";
  ctx.fillRect(-28, -61, 12, 3);
  ctx.fillRect(16, -61, 12, 3);
  ctx.fillStyle = "#171d22";
  rounded(ctx, -43, -43, 7, 29, 3);
  rounded(ctx, 36, -43, 7, 29, 3);
  rounded(ctx, -43, 33, 7, 29, 3);
  rounded(ctx, 36, 33, 7, 29, 3);
  ctx.restore();
}
