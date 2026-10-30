  function pollGamepad() {
    const pad = [...(navigator.getGamepads?.() || [])].find(Boolean);
    gamepadMoveX = pad && Math.abs(pad.axes[0] || 0) > 0.18 ? pad.axes[0] : 0;
    gamepadMoveY = pad && Math.abs(pad.axes[1] || 0) > 0.18 ? pad.axes[1] : 0;
    if (pad) {
      gamepadMoveX = clamp(
        gamepadMoveX +
          (pad.buttons[15]?.pressed ? 1 : 0) -
          (pad.buttons[14]?.pressed ? 1 : 0),
        -1,
        1,
      );
      gamepadMoveY = clamp(
        gamepadMoveY +
          (pad.buttons[13]?.pressed ? 1 : 0) -
          (pad.buttons[12]?.pressed ? 1 : 0),
        -1,
        1,
      );
    }
    const space = !!pad?.buttons[0]?.pressed,
      dash = !!pad?.buttons[1]?.pressed,
      interact = !!pad?.buttons[2]?.pressed;
    if (space && !padSpaceWas) boostPressed = true;
    if (dash && !padDashWas) vrDashPressed = true;
    if (interact && !padInteractWas) interactPressed = true;
    padSpaceWas = space;
    padDashWas = dash;
    padInteractWas = interact;
    for (const [code, pressed] of [
      ["Space", space],
      ["ShiftLeft", dash],
      ["KeyE", interact],
    ]) {
      if (pressed) gamepadKeys.add(code);
      else gamepadKeys.delete(code);
    }
  }
  function normalizeKey(e) {
    const code = e.code || "";
    if (
      code === "Escape" ||
      code === "Space" ||
      code.startsWith("Arrow") ||
      code.startsWith("Shift") ||
      ["KeyW", "KeyA", "KeyS", "KeyD", "KeyE", "KeyF", "Enter"].includes(code)
    )
      return code;
    const k = (e.key || "").toLowerCase();
    return (
      {
        w: "KeyW",
        a: "KeyA",
        s: "KeyS",
        d: "KeyD",
        e: "KeyE",
        f: "KeyF",
        " ": "Space",
        spacebar: "Space",
        arrowup: "ArrowUp",
        arrowdown: "ArrowDown",
        arrowleft: "ArrowLeft",
        arrowright: "ArrowRight",
        escape: "Escape",
        shift: "ShiftLeft",
        enter: "Enter",
      }[k] || code
    );
  }
  function actionKey(code) {
    if (code === "Escape") {
      togglePause();
      return;
    }
    if (
      code === "Space" ||
      code.startsWith("Arrow") ||
      ["KeyW", "KeyA", "KeyS", "KeyD"].includes(code)
    )
      keys.add(code);
  }
  canvas.addEventListener("pointerdown", (e) => {
    focusGame();
    if (stage === 6) {
      keys.add("Space");
      boostPressed = true;
      e.preventDefault();
    } else if (stage === 2 && e.button === 0) {
      interactPressed = true;
      e.preventDefault();
    }
  });
  ["pointerup", "pointercancel", "pointerleave"].forEach((ev) =>
    canvas.addEventListener(ev, () => keys.delete("Space")),
  );
  addEventListener(
    "keydown",
    (e) => {
      const code = normalizeKey(e),
        isInteract = ["KeyE", "KeyF", "Enter"].includes(code);
      if (
        [
          "ArrowUp",
          "ArrowDown",
          "ArrowLeft",
          "ArrowRight",
          "Space",
          "KeyW",
          "KeyA",
          "KeyS",
          "KeyD",
        ].includes(code) ||
        isInteract
      )
        e.preventDefault();
      if (e.repeat && code === "Escape") return;
      if (code === "Space" && !e.repeat) boostPressed = true;
      if ((stage === 6 || stage === 7) && code.startsWith("Shift") && !e.repeat)
        vrDashPressed = true;
      if (
        (stage === 2 && !e.repeat && isInteract) ||
        (stage === 5 &&
          !e.repeat &&
          (code === "KeyE" ||
            (trainingPhase === "escape" && code === "Enter"))) ||
        ((stage === 6 || stage === 8) && !e.repeat && code === "KeyE")
      )
        interactPressed = true;
      if (isInteract) keys.add(code);
      actionKey(code);
    },
    { capture: true, passive: false },
  );
  addEventListener("keyup", (e) => keys.delete(normalizeKey(e)), {
    capture: true,
  });
  addEventListener("blur", () => {
    keys.clear();
    gamepadKeys.clear();
    boostPressed = false;
    interactPressed = false;
    vrDashPressed = false;
    gamepadMoveX = gamepadMoveY = 0;
    padSpaceWas = padInteractWas = padDashWas = false;
  });
  document.getElementById("startBtn").onclick = start;
  document.getElementById("resumeBtn").onclick = togglePause;
  document.getElementById("soundBtn").onclick = () => {
    soundOn = !soundOn;
    document
      .getElementById("soundBtn")
      .setAttribute("aria-pressed", String(soundOn));
    document
      .getElementById("soundBtn")
      .setAttribute("aria-label", soundOn ? "Вимкнути звук" : "Увімкнути звук");
    document.getElementById("soundBtn").textContent =
      `♫ ЗВУК: ${soundOn ? "УВІМК." : "ВИМК."}`;
    if (soundOn) audioStart();
    else if ("speechSynthesis" in window) speechSynthesis.cancel();
  };
  document.getElementById("fullscreenBtn").onclick = async () => {
    try {
      if (!document.fullscreenElement)
        await document.getElementById("game").requestFullscreen();
      else await document.exitFullscreen();
    } catch {
      showToast("Повноекранний режим недоступний у цьому браузері");
    }
  };
  function boot() {
    nextDelivery();
    drawWorld(0);
    drawMini();
    document.getElementById("objectiveTitle").textContent =
      `МІСІЯ: ${deliveries[0].name}`;
    document.getElementById("objectiveText").textContent =
      `Кожна доставка додає +${DELIVERY_TIME_BONUS} секунд. Достав ${DELIVERY_GOAL} посилок!`;
  }
  boot();
})();
