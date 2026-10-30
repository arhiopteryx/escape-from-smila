function drawTrainingStage(t) {
  if (trainingPhase === "field") {
    drawCornfield(t);
    return;
  }
  if (trainingPhase === "escape") {
    drawEscapeTransition(t);
    return;
  }
  ctx.clearRect(0, 0, W, H);
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, "#cbd0b9");
  bg.addColorStop(0.5, "#aeb7a2");
  bg.addColorStop(1, "#828f7e");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);
  for (let y = 128; y < H; y += 48)
    for (let x = 16; x < W; x += 48) {
      ctx.fillStyle = (x / 48 + y / 48) % 2 ? "#c7c6ad" : "#b7bea8";
      ctx.fillRect(x, y, 45, 45);
    }
  // Fine grout, soft ceiling pools and floor reflections clarify the tiled room.
  ctx.save();
  ctx.strokeStyle = "#66736b35";
  ctx.lineWidth = 1;
  for (let x = 16; x < W; x += 48) {
    ctx.beginPath(); ctx.moveTo(x, 128); ctx.lineTo(x, H - 18); ctx.stroke();
  }
  for (let y = 128; y < H; y += 48) {
    ctx.beginPath(); ctx.moveTo(16, y); ctx.lineTo(W - 16, y); ctx.stroke();
  }
  for (const x of [210, 640, 1070]) {
    const glow = ctx.createRadialGradient(x, 143, 5, x, 143, 150);
    glow.addColorStop(0, "#fff5c72b");
    glow.addColorStop(1, "#fff5c700");
    ctx.fillStyle = glow;
    ctx.fillRect(x - 150, 130, 300, 230);
    ctx.fillStyle = "#fff0c9";
    rounded(ctx, x - 22, 119, 44, 6, 3);
  }
  ctx.restore();
  ctx.fillStyle = "#46504b";
  ctx.fillRect(20, 118, W - 40, 14);
  ctx.fillRect(20, H - 18, W - 40, 14);
  ctx.fillRect(20, 118, 14, H - 136);
  ctx.fillRect(W - 34, 118, 14, H - 136);
  ctx.fillStyle = "#66766e";
  rounded(ctx, 92, 500, 240, 115, 12);
  ctx.fillStyle = "#dce5d9";
  rounded(ctx, 112, 520, 200, 63, 18);
  ctx.fillStyle = "#9fb4a6";
  ctx.beginPath();
  ctx.ellipse(210, 551, 49, 19, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#6f8278";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(210, 516);
  ctx.lineTo(210, 535);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(211, 519, 12, Math.PI, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = "#35423c";
  ctx.fillRect(112, 592, 200, 8);
  ctx.fillStyle = "#eee2c1";
  ctx.font = "bold 11px Arial";
  ctx.textAlign = "center";
  ctx.fillText("РАКОВИНА", 212, 632);
  for (let i = 0; i < toiletStalls.length; i++) {
    const q = toiletStalls[i],
      x = q.x;
    ctx.fillStyle = "#61716c";
    ctx.fillRect(x - 112, 235, 8, 166);
    ctx.fillRect(x + 104, 235, 8, 166);
    ctx.fillStyle = "#89998c";
    ctx.fillRect(x - 108, 236, 212, 7);
    ctx.fillStyle = "#45514d";
    rounded(ctx, x - 54, 280, 108, 98, 15);
    ctx.fillStyle = q.occupied
      ? "#b9a477"
      : q.progress >= 0.995
        ? "#e5e9d8"
        : "#ddd3b8";
    ctx.beginPath();
    ctx.ellipse(x, 332, 38, 28, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = q.occupied
      ? "#82907d"
      : q.progress >= 0.995
        ? "#a6d9b6"
        : "#8c7353";
    ctx.beginPath();
    ctx.ellipse(x, 332, 23, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#596a64";
    rounded(ctx, x - 26, 291, 52, 15, 6);
    ctx.fillStyle = "#182322";
    rounded(ctx, x - 62, 255, 124, 22, 6);
    ctx.fillStyle = q.occupied
      ? "#f3d37e"
      : q.progress >= 0.995
        ? "#9ce0b9"
        : "#e4ac76";
    ctx.font = "bold 11px Arial";
    ctx.textAlign = "center";
    ctx.fillText(
      q.occupied ? "ЗАЙНЯТО" : q.progress >= 0.995 ? "ЧИСТО" : "БРУДНО",
      x,
      270,
    );
    ctx.fillStyle = "#293431";
    rounded(ctx, x - 48, 373, 96, 9, 4);
    ctx.fillStyle = q.progress >= 0.995 ? "#55c49a" : "#d79463";
    rounded(ctx, x - 46, 375, 92 * q.progress, 5, 3);
    if (q.mess) {
      ctx.fillStyle = "#9b7048";
      ctx.beginPath();
      ctx.ellipse(x, 319, 14, 6, 0, 0, Math.PI * 2);
      ctx.arc(x - 7, 314, 6, 0, Math.PI * 2);
      ctx.arc(x + 3, 310, 7, 0, Math.PI * 2);
      ctx.arc(x + 9, 316, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fff0d1";
      ctx.beginPath();
      ctx.arc(x - 3, 311, 1.5, 0, Math.PI * 2);
      ctx.arc(x + 4, 311, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.fillStyle = "#25312e";
  rounded(ctx, 1100, 120, 105, 14, 5);
  ctx.fillStyle = "#55655e";
  rounded(ctx, 1108, 134, 89, 59, 7);
  ctx.fillStyle = trainingPhase === "leave" ? "#49bf91" : "#db9861";
  ctx.beginPath();
  ctx.arc(1180, 163, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#1d2925";
  ctx.font = "bold 10px Arial";
  ctx.textAlign = "center";
  ctx.fillText(
    trainingPhase === "leave" ? "ВИХІД" : "СЛУЖБОВІ ДВЕРІ",
    1152,
    207,
  );
  if (!trainingBrush) {
    ctx.fillStyle = "#53635a";
    rounded(ctx, toothbrush.x - 35, toothbrush.y + 20, 70, 18, 5);
    ctx.fillStyle = "#c5b890";
    rounded(ctx, toothbrush.x - 30, toothbrush.y + 14, 60, 8, 3);
    ctx.fillStyle = "#e7dfc7";
    ctx.font = "bold 9px Arial";
    ctx.textAlign = "center";
    ctx.fillText("ТРИМАЧ ЩІТКИ", toothbrush.x, toothbrush.y + 55);
    ctx.save();
    ctx.translate(toothbrush.x, toothbrush.y + Math.sin(t * 4) * 3);
    ctx.rotate(-0.55);
    ctx.fillStyle = "#e9c34e";
    rounded(ctx, -7, -28, 14, 54, 6);
    ctx.fillStyle = "#69d5c8";
    rounded(ctx, -7, -32, 14, 12, 4);
    ctx.fillStyle = "#fff";
    for (let k = 0; k < 5; k++) ctx.fillRect(-5 + k * 2.5, -35, 2, 4);
    ctx.restore();
    ctx.fillStyle = "#162321";
    rounded(ctx, toothbrush.x - 58, toothbrush.y - 58, 116, 22, 6);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 10px Arial";
    ctx.textAlign = "center";
    ctx.fillText("ЗУБНА ЩІТКА · E", toothbrush.x, toothbrush.y - 43);
  }
  if (
    trainingBrush &&
    (trainingPhase === "brush_teeth" || trainingPhase === "clean")
  ) {
    ctx.save();
    ctx.translate(player.x + 18, player.y - 12);
    ctx.rotate(-0.72);
    ctx.fillStyle = "#e9c34e";
    rounded(ctx, -4, -18, 8, 36, 4);
    ctx.fillStyle = "#69d5c8";
    rounded(ctx, -5, -22, 10, 7, 3);
    ctx.fillStyle = "#fff";
    for (let k = 0; k < 4; k++) ctx.fillRect(-4 + k * 2.4, -25, 2, 4);
    ctx.restore();
  }
  if (trainingBrush && trainingPhase === "brush_teeth") {
    ctx.fillStyle = "#effff1";
    ctx.font = "bold 18px Arial";
    ctx.textAlign = "center";
    for (let k = 0; k < 6; k++) {
      const a = t * 2 + (k * Math.PI) / 3;
      ctx.fillText(
        "✦",
        player.x + Math.cos(a) * 27,
        player.y - 34 + Math.sin(a) * 15,
      );
    }
  }
  for (const g of toiletGuests) {
    if (g.state === "using") {
      ctx.fillStyle = "#6f7d69";
      rounded(ctx, g.target.x - 39, g.target.y - 73, 78, 73, 8);
      ctx.strokeStyle = "#c6b989";
      ctx.lineWidth = 3;
      ctx.strokeRect(g.target.x - 39, g.target.y - 73, 78, 73);
      ctx.fillStyle = "#e5d6ae";
      ctx.font = "bold 9px Arial";
      ctx.textAlign = "center";
      ctx.fillText("ЗАЙНЯТО", g.target.x, g.target.y - 54);
      ctx.fillStyle = "#18231f";
      rounded(ctx, g.target.x - 28, g.target.y - 42, 56, 6, 3);
      ctx.fillStyle = "#e3bd69";
      rounded(
        ctx,
        g.target.x - 26,
        g.target.y - 40,
        52 * Math.max(0, g.timer / 3.7),
        2,
        1,
      );
      ctx.fillStyle = "#e9d7b0";
      const wiggle = Math.sin(t * 13) * 3;
      ctx.fillRect(g.target.x - 13 + wiggle, g.target.y - 8, 9, 8);
      ctx.fillRect(g.target.x + 4 - wiggle, g.target.y - 8, 9, 8);
    } else {
      drawTrainingSoldier(g.x, g.y, "#71815f");
      ctx.fillStyle = "#15221fdd";
      rounded(ctx, g.x - 44, g.y - 53, 88, 19, 5);
      ctx.fillStyle = "#fff";
      ctx.font = "bold 9px Arial";
      ctx.textAlign = "center";
      ctx.fillText("ЗАРАЗ БУДЕ ЧЕРГА", g.x, g.y - 40);
    }
  }
  drawTrainingAvatar(player.x, player.y, t);
  const cleanN = toiletStalls.filter((q) => q.progress >= 0.995).length;
  const phaseLabel =
    trainingPhase === "brush_pickup"
      ? "ЩІТКА: ВЗЯТИ"
      : trainingPhase === "brush_teeth"
        ? "ЩІТКА: ЗУБИ"
        : trainingPhase === "clean"
          ? `КАБІНКИ ${cleanN}/3`
          : trainingPhase === "return_brush"
            ? "ЩІТКА: ПОВЕРНУТИ"
            : "ВИХІД";
  const statusLine = `${phaseLabel} · ${toiletGuestVisits}/7 ВІЗИТІВ`;
  ctx.font = "bold 13px Arial";
  const title = "САНВУЗОЛ · 3 КАБІНКИ";
  const titleWidth = ctx.measureText(title).width;
  ctx.font = "bold 11px Arial";
  const statusWidth = ctx.measureText(statusLine).width;
  const hudWidth = Math.ceil(Math.max(titleWidth, statusWidth) + 24);
  ctx.fillStyle = "#101923eF";
  rounded(ctx, 18, 14, hudWidth, 48, 7);
  ctx.fillStyle = "#f4e7ca";
  ctx.font = "bold 13px Arial";
  ctx.textAlign = "left";
  ctx.fillText(title, 30, 34);
  ctx.fillStyle = "#d8e1d5";
  ctx.font = "bold 11px Arial";
  ctx.fillText(statusLine, 30, 51);
  if (
    trainingPhase === "brush_pickup" &&
    Math.hypot(player.x - toothbrush.x, player.y - toothbrush.y) < 125
  )
    drawTrainingPrompt(toothbrush.x, toothbrush.y - 38, "E · ВЗЯТИ");
  if (
    trainingPhase === "brush_teeth" &&
    Math.hypot(player.x - 210, player.y - 550) < 180
  )
    drawTrainingPrompt(210, 485, "E · ЧИСТИТИ ЗУБИ", brushProgress);
  if (trainingPhase === "clean") {
    let near = null,
      nd = 145;
    for (const stall of toiletStalls) {
      const d = Math.hypot(player.x - stall.x, player.y - stall.y);
      if (d < nd) {
        near = stall;
        nd = d;
      }
    }
    if (near)
      drawTrainingPrompt(
        near.x,
        near.y - 60,
        near.occupied ? "ЗАЙНЯТО" : "E · ЧИСТИТИ",
        near.progress,
      );
  }
  if (
    trainingPhase === "return_brush" &&
    Math.hypot(player.x - 210, player.y - 550) < 145
  )
    drawTrainingPrompt(210, 485, "E · ПОВЕРНУТИ");
  if (
    trainingPhase === "leave" &&
    Math.hypot(player.x - trainingDoor.x, player.y - trainingDoor.y) < 145
  )
    drawTrainingPrompt(trainingDoor.x, 230, "E · ВИХІД");
}
function drawTrainingSoldier(x, y, uniform) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "#0005";
  ctx.beginPath();
  ctx.ellipse(0, 12, 23, 16, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#1c292a";
  rounded(ctx, -13, 4, 10, 23, 4);
  rounded(ctx, 3, 4, 10, 23, 4);
  ctx.fillStyle = uniform;
  rounded(ctx, -19, -18, 38, 29, 9);
  ctx.fillStyle = "#d8b28a";
  ctx.beginPath();
  ctx.arc(0, -24, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#4c5643";
  rounded(ctx, -16, -37, 32, 9, 5);
  ctx.fillStyle = "#c0a267";
  ctx.fillRect(-4, -33, 8, 3);
  ctx.restore();
}
function drawTrainingAvatar(x, y, t) {
  ctx.save();
  ctx.translate(x, y + Math.sin(t * 7) * 1.5);
  ctx.fillStyle = "#0006";
  ctx.beginPath();
  ctx.ellipse(3, 13, 24, 15, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#202c36";
  rounded(ctx, -13, 4, 10, 22, 4);
  rounded(ctx, 3, 4, 10, 22, 4);
  ctx.fillStyle = "#edc573";
  rounded(ctx, -15, 20, 13, 7, 3);
  rounded(ctx, 2, 20, 13, 7, 3);
  ctx.fillStyle = "#df7548";
  rounded(ctx, -16, -19, 32, 28, 9);
  ctx.fillStyle = "#293f4c";
  rounded(ctx, -13, -12, 26, 19, 6);
  ctx.fillStyle = "#edc56c";
  rounded(ctx, -11, -9, 22, 14, 4);
  ctx.fillStyle = "#f0c391";
  ctx.beginPath();
  ctx.arc(0, -28, 13, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#e7b742";
  ctx.beginPath();
  ctx.arc(0, -31, 14, Math.PI, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}
function updateTraining(dt, t) {
  if (trainingPhase === "field") {
    updateCornfield(dt, t);
    return;
  }
  const { x: dx, y: dy } = movementAxes();
  player.vx += (dx * 285 - player.vx) * Math.min(1, dt * 12);
  player.vy += (dy * 285 - player.vy) * Math.min(1, dt * 12);
  if (dx || dy) player.dir = Math.atan2(player.vy, player.vx);
  player.x = clamp(player.x + player.vx * dt, 55, 1225);
  player.y = clamp(player.y + player.vy * dt, 145, 745);
  if (trainingPhase === "escape") {
    cleanElapsed += dt;
    if (interactPressed) {
      interactPressed = false;
      startCornfieldRun();
    }
    return;
  }
  const press = interactPressed,
    held = keyDown("KeyE");
  interactPressed = false;
  if (
    trainingPhase === "brush_pickup" &&
    (press || held) &&
    Math.hypot(player.x - toothbrush.x, player.y - toothbrush.y) < 112
  ) {
    trainingBrush = true;
    trainingPhase = "brush_teeth";
    showToast("ЩІТКУ ЗНАЙДЕНО · ПОЧИСТЬ ЗУБИ");
  } else if (trainingPhase === "brush_teeth") {
    if (Math.hypot(player.x - 210, player.y - 550) < 155 && (held || press)) {
      brushProgress = Math.min(1, brushProgress + (press ? 0.2 : dt * 0.52));
      if (brushProgress >= 1) {
        trainingPhase = "clean";
        brushProgress = 0;
        chime();
        showToast("ЗУБИ ПОЧИЩЕНО · ТЕПЕР КАБІНКИ");
        document.getElementById("objectiveTitle").textContent =
          "ВІДЧИСТИ ТРИ КАБІНКИ";
      }
    } else if (!held) brushProgress = Math.max(0, brushProgress - dt * 0.1);
  } else if (trainingPhase === "clean") {
    toiletGuestTimer -= dt;
    if (
      toiletGuestTimer <= 0 &&
      toiletGuestVisits < 7 &&
      toiletGuests.length < 3
    ) {
      const cleaned = toiletStalls.filter(
          (q) => !q.occupied && q.progress > 0.15,
        ),
        available = toiletStalls.filter((q) => !q.occupied),
        choices = cleaned.length ? cleaned : available,
        q = choices[Math.floor(Math.random() * choices.length)];
      toiletGuestTimer = 2.9 + Math.random() * 0.9;
      if (q) {
        toiletGuestVisits++;
        q.occupied = true;
        toiletGuests.push({
          x: 640,
          y: 146,
          target: q,
          state: "approach",
          timer: 0,
        });
      }
    }
    for (let i = toiletGuests.length - 1; i >= 0; i--) {
      const g = toiletGuests[i],
        q = g.target;
      if (g.state === "approach") {
        const vx = q.x - g.x,
          vy = q.y - 42 - g.y,
          d = Math.hypot(vx, vy) || 1;
        g.x += (vx / d) * 142 * dt;
        g.y += (vy / d) * 142 * dt;
        if (d < 24) {
          g.state = "using";
          g.timer = 3.7;
          showToast("КАБІНКА ЗАЙНЯТА · ПЕРЕЙДИ ДО ІНШОЇ");
        }
      } else if (g.state === "using") {
        g.timer -= dt;
        if (g.timer <= 0) {
          q.occupied = false;
          q.mess = true;
          q.progress = Math.max(0, q.progress - 0.38);
          g.state = "leaving";
          showToast("СОСЛУЖБОВЕЦЬ ЗАЛИШИВ СЛІД · ДОЧИСТЬ КАБІНКУ");
        }
      } else {
        const vx = 1150 - g.x,
          vy = 150 - g.y,
          d = Math.hypot(vx, vy) || 1;
        g.x += (vx / d) * 132 * dt;
        g.y += (vy / d) * 132 * dt;
        if (d < 24) toiletGuests.splice(i, 1);
      }
    }
    if (held || press) {
      let q = null,
        dist = 1e9;
      for (const stall of toiletStalls) {
        const d = Math.hypot(player.x - stall.x, player.y - stall.y);
        if (d < dist) {
          q = stall;
          dist = d;
        }
      }
      if (q && dist < 94 && !q.occupied) {
        q.progress = Math.min(1, q.progress + (press ? 0.08 : dt * 0.45));
        q.cleaning = q.progress;
        if (q.progress >= 0.995) {
          q.progress = 1;
          q.mess = false;
        }
      } else toiletStalls.forEach((stall) => (stall.cleaning = 0));
    } else toiletStalls.forEach((stall) => (stall.cleaning = 0));
    const cleanCount = toiletStalls.filter((q) => q.progress >= 0.995).length;
    document.getElementById("delivered").textContent = `${cleanCount} / 3`;
    if (
      cleanCount === 3 &&
      toiletGuests.length === 0 &&
      toiletGuestVisits >= 7
    ) {
      trainingPhase = "return_brush";
      showToast("УСІ КАБІНКИ ЧИСТІ · ПОВЕРНИ ЩІТКУ");
    }
  } else if (
    trainingPhase === "return_brush" &&
    press &&
    Math.hypot(player.x - 210, player.y - 550) < 95
  ) {
    trainingBrush = false;
    trainingPhase = "leave";
    document.getElementById("objectiveTitle").textContent = "ВИХІД У ДВІР";
    showToast("ЩІТКУ ПОВЕРНУТО · ВИХІД У ДВОРІ");
  } else if (
    trainingPhase === "leave" &&
    press &&
    Math.hypot(player.x - trainingDoor.x, player.y - trainingDoor.y) < 78
  ) {
    trainingPhase = "escape";
    cleanElapsed = 0;
    showToast("ДВЕРІ ВІДЧИНЕНО · ДО ПОЛЯ");
  }
  if (toastTimer > 0) {
    toastTimer -= dt;
    if (toastTimer <= 0)
      document.getElementById("toast").classList.remove("show");
  }
}
const CORN_TILE = 1160;
function cornPath(worldY, lane = 0) {
  return (
    640 +
    Math.sin((worldY * Math.PI * 2) / CORN_TILE + lane * 2.3) *
      (lane ? 95 : 170) +
    lane * 245
  );
}
function buildCornfieldBackdrop() {
  fieldBackdrop = document.createElement("canvas");
  fieldBackdrop.width = W;
  fieldBackdrop.height = CORN_TILE;
  const c = fieldBackdrop.getContext("2d");
  c.fillStyle = "#35432c";
  c.fillRect(0, 0, W, CORN_TILE);
  for (let gy = 0; gy < CORN_TILE; gy += 58) {
    const center = cornPath(gy);
    for (let col = 0; col < 24; col++) {
      const x = col * 56 - 24,
        seed = ((gy / 58) * 31 + col * 17) | 0;
      if (Math.abs(x - center) < 64 || Math.abs(x - cornPath(gy, 1)) < 38)
        continue;
      drawCornPlantTo(c, x, gy + ((seed % 9) - 4), seed);
    }
  }
  c.fillStyle = "#927e57";
  c.globalAlpha = 0.35;
  for (let lane = 0; lane < 2; lane++) {
    c.beginPath();
    for (let gy = 0; gy <= CORN_TILE; gy += 29) {
      const x = cornPath(gy, lane);
      if (!gy) c.moveTo(x, gy);
      else c.lineTo(x, gy);
    }
    c.lineWidth = lane ? 24 : 39;
    c.strokeStyle = "#a99668";
    c.stroke();
  }
  c.globalAlpha = 1;
  for (let x = 0; x < W; x += 76) {
    c.fillStyle = x % 2 ? "#536e3b" : "#456336";
    c.fillRect(x, 0, 2, CORN_TILE);
  }
}
function drawCornPlantTo(c, x, y, seed) {
  c.strokeStyle = seed % 3 ? "#567c3d" : "#739247";
  c.lineWidth = 3;
  c.beginPath();
  c.moveTo(x, y + 17);
  c.quadraticCurveTo(x, y, x, y - 18);
  c.stroke();
  c.fillStyle = seed % 2 ? "#78994a" : "#95a853";
  for (let k = 0; k < 3; k++) {
    const side = k % 2 ? 1 : -1,
      yy = y - 2 - k * 7;
    c.beginPath();
    c.ellipse(x + side * (8 + k * 2), yy, 12, 4, side * 0.36, 0, Math.PI * 2);
    c.fill();
  }
  c.fillStyle = "#d9c66a";
  c.beginPath();
  c.ellipse(x, y - 17, 3, 7, 0, 0, Math.PI * 2);
  c.fill();
}
function fieldTrack(type, x, y) {
  fieldTracks.push({
    type,
    x,
    y,
    life: type === "hero" ? 30 : type === "dog" ? 24 : 27,
    max: type === "hero" ? 30 : type === "dog" ? 24 : 27,
    angle: Math.random() * 0.22 - 0.11,
  });
  if (fieldTracks.length > 500) fieldTracks.splice(0, fieldTracks.length - 500);
}
function updateCornfield(dt, t) {
  const { x: dx, y: dy } = movementAxes(),
    laneDist = Math.min(
      Math.abs(player.x - cornPath(player.y)),
      Math.abs(player.x - cornPath(player.y, 1)),
    ),
    speed = laneDist < 62 ? 312 : 156;
  player.vx += (dx * speed - player.vx) * Math.min(1, dt * 11);
  player.vy += (dy * speed - player.vy) * Math.min(1, dt * 11);
  if (dx || dy) {
    fieldAimX = dx;
    fieldAimY = dy;
    player.dir = Math.atan2(player.vy, player.vx);
  }
  player.x = clamp(player.x + player.vx * dt, 56, 1224);
  player.y += player.vy * dt;
  fieldProgress = Math.max(0, -player.y);
  fieldSway += dt;
  fieldCar.phase += dt;
  fieldCar.ready = fieldProgress > fieldTarget * 0.72;
  fieldCar.x = 640 + Math.sin(t * 0.55) * 110;
  fieldCar.y = -fieldTarget;
  const moved = Math.hypot(player.x - fieldTrackX, player.y - fieldTrackY);
  if (moved > 25) {
    fieldTrack("hero", player.x, player.y);
    fieldTrackX = player.x;
    fieldTrackY = player.y;
  }
  for (const tr of fieldTracks) tr.life -= dt;
  fieldTracks = fieldTracks.filter((tr) => tr.life > 0);
  for (const n of fieldDecoys) n.life -= dt;
  fieldDecoys = fieldDecoys.filter((n) => n.life > 0);
  shotCooldown = Math.max(0, shotCooldown - dt);
  fieldInvuln = Math.max(0, fieldInvuln - dt);
  if ((keyDown("Space") || boostPressed) && shotCooldown <= 0) {
    const d = Math.hypot(fieldAimX, fieldAimY) || 1,
      ax = fieldAimX / d,
      ay = fieldAimY / d;
    fieldShots.push({
      x: player.x + ax * 24,
      y: player.y + ay * 24,
      vx: ax * 650,
      vy: ay * 650,
      life: 1,
    });
    fieldDecoys.push({
      x: player.x + ax * 330,
      y: player.y + ay * 330,
      life: 3.4,
      max: 3.4,
    });
    shotCooldown = 0.62;
    tone(590, 0.07, "triangle", 0.03, 150);
  }
  boostPressed = false;
  for (const shot of fieldShots) {
    shot.x += shot.vx * dt;
    shot.y += shot.vy * dt;
    shot.life -= dt;
  }
  fieldShots = fieldShots.filter((q) => q.life > 0);
  fieldSpawnTimer -= dt;
  if (
    fieldSpawnTimer <= 0 &&
    fieldProgress < fieldTarget * 0.94 &&
    fieldEnemies.length < 9
  ) {
    fieldSpawnTimer = Math.max(0.58, 1.55 - fieldProgress / 3100);
    const edge = Math.floor(Math.random() * 4),
      cam = player.y - 575;
    let x =
        edge === 0 ? 24 : edge === 1 ? W - 24 : 90 + Math.random() * (W - 180),
      y =
        edge === 2
          ? cam + 95
          : edge === 3
            ? cam + H - 70
            : cam + 140 + Math.random() * (H - 250),
      roll = Math.random(),
      type = roll < 0.55 ? "guard" : "dog";
    fieldEnemies.push({
      x,
      y,
      type,
      hp: type === "guard" ? 2 : 1,
      speed: type === "dog" ? 196 : 136,
      phase: Math.random() * 8,
      sniff: 0,
    });
  }
  for (let i = fieldEnemies.length - 1; i >= 0; i--) {
    const e = fieldEnemies[i];
    e.phase += dt * 5;
    let tx = player.x,
      ty = player.y,
      best = 560;
    for (const n of fieldDecoys) {
      const d = Math.hypot(n.x - e.x, n.y - e.y);
      if (d < best) {
        best = d;
        tx = n.x;
        ty = n.y;
      }
    }
    if (e.sniff > 0) e.sniff -= dt;
    else {
      const vx = tx - e.x,
        vy = ty - e.y,
        d = Math.hypot(vx, vy) || 1,
        brushDist = Math.min(
          Math.abs(e.x - cornPath(e.y)),
          Math.abs(e.x - cornPath(e.y, 1)),
        ),
        pace = e.speed * (brushDist < 62 ? 1 : 0.68);
      e.x += (vx / d) * pace * dt + Math.sin(e.phase) * 12 * dt;
      e.y += (vy / d) * pace * dt;
      if (best < 560 && Math.hypot(tx - e.x, ty - e.y) < 34) e.sniff = 1.25;
    }
    if (
      e._trackX == null ||
      Math.hypot(e.x - e._trackX, e.y - e._trackY) > 34
    ) {
      fieldTrack(e.type, e.x, e.y);
      e._trackX = e.x;
      e._trackY = e.y;
    }
    for (let j = fieldShots.length - 1; j >= 0; j--) {
      const q = fieldShots[j];
      if (Math.hypot(q.x - e.x, q.y - e.y) < 32) {
        fieldShots.splice(j, 1);
        e.hp--;
        fieldDecoys.push({ x: q.x, y: q.y, life: 2.3, max: 2.3 });
        if (e.hp <= 0) {
          fieldEnemies.splice(i, 1);
          score += 80;
        }
        break;
      }
    }
    if (!fieldEnemies.includes(e)) continue;
    if (Math.abs(e.y - player.y) > 1150) fieldEnemies.splice(i, 1);
    else if (
      fieldInvuln <= 0 &&
      Math.hypot(player.x - e.x, player.y - e.y) < 38
    ) {
      fieldLives--;
      fieldInvuln = 1.05;
      player.vx += (player.x - e.x) * 2;
      player.vy += (player.y - e.y) * 2;
      showToast(`ПОГОНЯ ЗБИЛА З КУРСУ · ${fieldLives} ♥`);
      if (fieldLives <= 0) {
        showTrainingFail();
        return;
      }
    }
  }
  if (
    fieldCar.ready &&
    Math.hypot(player.x - fieldCar.x, player.y - fieldCar.y) < 118
  ) {
    showTrainingEnd();
    return;
  }
  document.getElementById("delivered").textContent =
    `${Math.min(fieldTarget, Math.floor(fieldProgress))} м`;
  document.getElementById("score").textContent = String(score).padStart(4, "0");
  if (fieldCar.ready) {
    document.getElementById("objectiveTitle").textContent = "MAZDA ПОПЕРЕДУ";
    document.getElementById("objectiveText").textContent =
      "Добіжи до машини, кидай сирники вбік і стеж за слідами погоні.";
  }
}
function drawCornPlant(x, y, t, seed) {
  const sway = Math.sin(t * 2.2 + seed) * 4;
  ctx.strokeStyle = seed % 3 ? "#567c3d" : "#739247";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x, y + 17);
  ctx.quadraticCurveTo(x + sway, y, x + sway * 0.6, y - 18);
  ctx.stroke();
  ctx.fillStyle = seed % 2 ? "#78994a" : "#95a853";
  for (let k = 0; k < 3; k++) {
    const side = k % 2 ? 1 : -1,
      yy = y - 2 - k * 7;
    ctx.beginPath();
    ctx.ellipse(
      x + sway + side * (8 + k * 2),
      yy,
      12,
      4,
      side * 0.36,
      0,
      Math.PI * 2,
    );
    ctx.fill();
  }
  ctx.fillStyle = "#d9c66a";
  ctx.beginPath();
  ctx.ellipse(x + sway * 0.6, y - 17, 3, 7, 0, 0, Math.PI * 2);
  ctx.fill();
}
function drawFieldPerson(x, y, type, t) {
  if (type === "dog") {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.sin(t * 7 + x) * 0.12);
    ctx.fillStyle = "#714a33";
    ctx.beginPath();
    ctx.ellipse(0, 2, 22, 13, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(17, -5, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#e3c98b";
    ctx.beginPath();
    ctx.arc(20, -7, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#392b24";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-12, 9);
    ctx.lineTo(-16, 18);
    ctx.moveTo(8, 9);
    ctx.lineTo(12, 17);
    ctx.stroke();
    ctx.restore();
  } else drawTrainingSoldier(x, y, "#6f7c54");
}
function drawFieldCar(t, sy) {
  ctx.save();
  ctx.translate(fieldCar.x, sy);
  ctx.fillStyle = "#0008";
  ctx.beginPath();
  ctx.ellipse(0, 38, 76, 24, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#101820";
  rounded(ctx, -72, -26, 144, 72, 17);
  ctx.fillStyle = "#17242b";
  rounded(ctx, -53, -46, 106, 43, 15);
  ctx.fillStyle = "#a8c5c4";
  rounded(ctx, -36, -40, 72, 24, 7);
  ctx.fillStyle = "#d4ab7e";
  ctx.beginPath();
  ctx.arc(0, -29, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#101820";
  rounded(ctx, -57, -15, 114, 48, 12);
  ctx.fillStyle = "#e6bd52";
  ctx.fillRect(-68, 20, 15, 9);
  ctx.fillRect(53, 20, 15, 9);
  ctx.fillStyle = "#d8f2c7";
  ctx.fillRect(-63, -6, 7, 11);
  ctx.fillRect(56, -6, 7, 11);
  ctx.fillStyle = "#fbebac";
  ctx.font = "bold 11px Arial";
  ctx.textAlign = "center";
  ctx.fillText("КУМ · MAZDA", 0, 59);
  ctx.restore();
}
function drawCornfieldMap() {
  const x = 1052,
    y = 14,
    w = 212,
    h = 204;
  ctx.fillStyle = "#07131ddd";
  rounded(ctx, x, y, w, h, 10);
  ctx.fillStyle = "#f5e9c7";
  ctx.font = "bold 12px Arial";
  ctx.textAlign = "left";
  ctx.fillText("МАРШРУТ ДО MAZDA ↑", x + 12, y + 21);
  ctx.fillStyle = "#34432f";
  rounded(ctx, x + 10, y + 30, w - 20, h - 40, 7);
  for (let lane = 0; lane < 2; lane++) {
    ctx.strokeStyle = lane ? "#879969" : "#d6c17c";
    ctx.globalAlpha = 0.85;
    ctx.lineWidth = lane ? 2 : 3;
    ctx.beginPath();
    for (let i = 0; i <= 18; i++) {
      const p = i / 18,
        worldY = -fieldTarget * p,
        mx = x + 22 + (cornPath(worldY, lane) / W) * (w - 44),
        my = y + h - 20 - p * (h - 61);
      if (!i) ctx.moveTo(mx, my);
      else ctx.lineTo(mx, my);
    }
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  const px = x + 22 + (player.x / W) * (w - 44),
    py = y + h - 20 - Math.min(1, fieldProgress / fieldTarget) * (h - 61);
  ctx.fillStyle = "#ffe37b";
  ctx.beginPath();
  ctx.arc(px, py, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#17221b";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = "#eff2c8";
  ctx.font = "bold 10px Arial";
  ctx.textAlign = "center";
  ctx.fillText("🚙", x + w / 2, y + 43);
}
function drawCornfield(t) {
  ctx.clearRect(0, 0, W, H);
  const cam = player.y - 575,
    tile = CORN_TILE,
    offset = -(((cam % tile) + tile) % tile);
  ctx.fillStyle = "#35432c";
  ctx.fillRect(0, 0, W, H);
  for (let y = offset; y < H; y += tile) ctx.drawImage(fieldBackdrop, 0, y);
  // Dark furrows and broken leaf highlights make the dense rows read as a field.
  ctx.save();
  for (let x = 24; x < W; x += 64) {
    ctx.fillStyle = "#17231820";
    ctx.fillRect(x, 0, 9, H);
    ctx.fillStyle = "#d2bd6740";
    ctx.fillRect(x + 18, 0, 2, H);
  }
  ctx.restore();
  for (let i = 0; i < 24; i++) {
    const side = i % 2 ? 1 : -1,
      x = side < 0 ? 18 + ((i * 67) % 250) : W - 18 - ((i * 67) % 250),
      y = (i * 97 + t * 31) % H;
    drawCornPlant(x, y, t, i * 17);
  }
  for (const tr of fieldTracks) {
    const sy = tr.y - cam;
    if (sy < -24 || sy > H + 24) continue;
    ctx.save();
    ctx.globalAlpha = 0.78 * (tr.life / tr.max);
    ctx.translate(tr.x, sy);
    ctx.rotate(tr.angle);
    const c =
      tr.type === "hero"
        ? "#f1d989"
        : tr.type === "dog"
          ? "#e6a454"
          : "#df7569";
    ctx.strokeStyle = "#322f22";
    ctx.lineWidth = 12;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(-18, 2);
    ctx.quadraticCurveTo(0, -8, 18, 2);
    ctx.stroke();
    ctx.strokeStyle = c;
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(-18, 2);
    ctx.quadraticCurveTo(0, -8, 18, 2);
    ctx.stroke();
    ctx.restore();
  }
  for (const n of fieldDecoys) {
    const sy = n.y - cam;
    if (sy < 0 || sy > H) continue;
    ctx.globalAlpha = 0.35 + 0.3 * Math.sin(t * 12);
    ctx.fillStyle = "#fff0a8";
    ctx.beginPath();
    ctx.arc(n.x, sy, 11 + Math.sin(t * 8) * 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#7c5b2f";
    ctx.beginPath();
    ctx.arc(n.x, sy, 5, 0, Math.PI * 2);
    ctx.fill();
  }
  for (const q of fieldShots) {
    const sy = q.y - cam;
    if (sy < 0 || sy > H) continue;
    ctx.fillStyle = "#ffe196";
    ctx.beginPath();
    ctx.arc(q.x, sy, 8, 0, Math.PI * 2);
    ctx.fill();
  }
  for (const e of fieldEnemies) {
    const sy = e.y - cam;
    if (sy < -45 || sy > H + 45) continue;
    drawFieldPerson(e.x, sy, e.type, t);
    if (e.sniff > 0) {
      ctx.fillStyle = "#fff0a8";
      ctx.font = "bold 16px Arial";
      ctx.textAlign = "center";
      ctx.fillText("…", e.x, sy - 26);
    }
  }
  drawTrainingAvatar(player.x, 575, t);
  if (fieldCar.ready) {
    const sy = fieldCar.y - cam;
    if (sy > -90 && sy < H + 90) drawFieldCar(t, sy);
  }
  ctx.fillStyle = "#07131ddd";
  rounded(ctx, 18, 14, 400, 103, 10);
  ctx.fillStyle = "#f5e9c7";
  ctx.font = "bold 14px Arial";
  ctx.textAlign = "left";
  ctx.fillText("04B · ВТЕЧА КРІЗЬ КУКУРУДЗУ", 32, 36);
  ctx.font = "bold 11px Arial";
  ctx.fillStyle = "#fff";
  ctx.fillText(
    `ШЛЯХ ${Math.floor(fieldProgress)} / ${fieldTarget} м     ОЧКИ ${String(score).padStart(4, "0")}     ♥ ${fieldLives}`,
    32,
    55,
  );
  ctx.fillStyle = "#17251c";
  rounded(ctx, 32, 64, 370, 8, 4);
  ctx.fillStyle = "#77ddb2";
  rounded(ctx, 34, 66, 366 * Math.min(1, fieldProgress / fieldTarget), 4, 2);
  ctx.font = "bold 10px Arial";
  ctx.fillStyle = "#f1d989";
  ctx.fillText("━ ТИ", 32, 88);
  ctx.fillStyle = "#df7569";
  ctx.fillText("━ СОЛДАТ", 105, 88);
  ctx.fillStyle = "#e6a454";
  ctx.fillText("━ СОБАКА", 205, 88);
  ctx.fillStyle = "#d7e2d1";
  ctx.fillText("WASD · РУХ   SPACE · СИРНИК ВІДВОЛІКАЄ", 32, 105);
  drawCornfieldMap();
  if (fieldSway < 5) {
    ctx.save();
    ctx.globalAlpha = Math.min(1, (5 - fieldSway) * 1.5);
    ctx.fillStyle = "#08131ee8";
    rounded(ctx, 438, 14, 448, 42, 8);
    ctx.fillStyle = "#fff1c8";
    ctx.font = "bold 11px Arial";
    ctx.textAlign = "center";
    ctx.fillText(
      "WASD — РУХ · SPACE — КИНЬ СИРНИК УБІК, ЩОБ ВІДВОЛІКТИ ПОГОНЮ",
      662,
      39,
    );
    ctx.restore();
  }
  if (fieldCar.ready) {
    ctx.fillStyle = "#ffe89c";
    ctx.font = "bold 11px Arial";
    ctx.textAlign = "center";
    ctx.fillText("MAZDA ПОПЕРЕДУ · КУМ ЧЕКАЄ", W / 2, 25);
  }
}
function drawTrainingPrompt(x, y, label, progress) {
  ctx.save();
  ctx.textAlign = "center";
  ctx.font = "bold 10px Arial";
  const w = Math.max(60, ctx.measureText(label).width + 14);
  ctx.fillStyle = "#101923e8";
  rounded(ctx, x - w / 2, y - 17, w, 21, 6);
  ctx.fillStyle = "#fff";
  ctx.fillText(label, x, y - 3);
  if (progress != null) {
    ctx.fillStyle = "#18251f";
    rounded(ctx, x - w / 2, y + 8, w, 6, 3);
    ctx.fillStyle = "#61d3a8";
    rounded(ctx, x - w / 2 + 2, y + 10, (w - 4) * progress, 2, 2);
  }
  ctx.restore();
}
function showTrainingEnd() {
  running = false;
  gameEnded = true;
  const layer = document.getElementById("intro");
  layer.classList.remove("hidden");
  layer.innerHTML = `<section class="card"><div class="eyebrow">РІВЕНЬ 4 · ПОЛЕ ЗАЛИШИЛОСЯ ПОЗАДУ</div><h1>У Mazda.<br><em>І жодного строю.</em></h1><p>За кермом Mazda чекає кум. Герой дав йому гроші «на відкуп», а кум купив у Steam картинки ножиків для CS. «Кста, сідай — А потім помер», — каже він і тисне на газ.</p><div class="mission"><span>🪪 Пропуск: отримано</span><span>🌽 Поле: пройдено</span></div><button id="retryLevel4Btn">ПОВТОРИТИ ПОЛЕ　↻</button><button id="toLevel5Btn" class="secondary">ПЕРЕЙТИ ДО РІВНЯ 5　→</button><br><button id="menuLevel4Btn" class="secondary">ГОЛОВНЕ МЕНЮ</button></section>`;
  document.getElementById("retryLevel4Btn").onclick = startCornfieldLevel;
  document.getElementById("toLevel5Btn").onclick = showVrCutscene;
  document.getElementById("menuLevel4Btn").onclick = () => location.reload();
}
function showTrainingFail() {
  running = false;
  gameEnded = true;
  const layer = document.getElementById("intro");
  layer.classList.remove("hidden");
  layer.innerHTML = `<section class="card"><div class="eyebrow">РІВЕНЬ 4 · ПОЛЕ</div><h1>Кукурудза виграла.<br><em>Цього разу.</em></h1><p>Переслідувачі наздогнали героя. Зберися, віднови запас сирників і спробуй ще раз.</p><button id="retryLevel4Btn">ПОВТОРИТИ ПОЛЕ　↻</button></section>`;
  document.getElementById("retryLevel4Btn").onclick = startCornfieldLevel;
}
