/*
 * SECOND WORLD — final one-minute route + ripple animation
 * Approved visual contract: ../design/APPROVED_ROUTE_RIPPLE_ANIMATION_RULES.md
 */

const SECOND_WORLD_SEED = 250811;
const CANVAS_W = 1600;
const CANVAS_H = 900;
const ANIMATION_DURATION = 60;
const FRAME_TARGETS = [15, 38, 60];
const DOT_REVEAL_DURATION = 0.2;
const POSTURE_BLEND_DURATION = 0.18;
const QUEST_TRANSITION_DURATION = 0.85;
const ACTIVE_RIPPLE_COUNT = 6;
const TRAIL_CROSS_SECTION_COUNT = 9;
const EMBEDDED_PLOT_Y_OFFSET = 0;
const EMBEDDED_PLOT_VERTICAL_SCALE = 1;

const COLORS = {
  background: "#05070B",
  panel: "#0A0E15",
  structure: "#252D39",
  map: "#5B718C",
  text: "#9AA5B5",
  bright: "#E4E0D7",
  plan: "#B8B3A9",
  actual: "#7EA8FF",
  physical: "#B89CFF",
  gesture: "#F0A0B8",
  trigger: "#73D9C6",
};

const ACTION_STYLES = {
  "game loading": { color: "#7890B8", radius: 2.0, label: "LOAD" },
  running: { color: "#76A7FF", radius: 2.7, label: "RUN" },
  flying: { color: "#A58BFF", radius: 3.8, label: "FLY" },
  driving: { color: "#61C8DB", radius: 3.1, label: "DRIVE" },
  combating: { color: "#D997C5", radius: 5.3, label: "COMBAT" },
  "doing quest": { color: "#E0D7F4", radius: 4.4, label: "QUEST" },
  story: { color: "#8D9ED1", radius: 3.5, label: "STORY" },
};

const DETOUR_DIRECTIONS = [-1, 1, -1, 1, -1, 1];
const PLOT = { left: 112, right: 1488, baselineY: 474 };

let sourceData;
let frameCanvas;
let currentSec = 0;
let isPlaying = true;
let playbackRate = 1;
let presentationDuration = ANIMATION_DURATION;
let minimalPresentation = false;
let loadError = null;
let digitalEndSec = 60;
let detours = [];

function preload() {
  sourceData = loadJSON(
    "../processed_data/second_world_derived_data.json",
    () => {},
    () => {
      loadError = "Processed data could not be loaded. Run the project through a local server from the project root.";
    },
  );
}

function setup() {
  pixelDensity(1);
  frameCanvas = createCanvas(CANVAS_W, CANVAS_H);
  frameCanvas.parent("canvas-holder");
  colorMode(RGB, 255, 255, 255, 255);
  strokeCap(ROUND);
  strokeJoin(ROUND);
  textFont("IBM Plex Mono, ui-monospace, monospace");

  if (sourceData?.quest_intervals?.length) {
    const finalQuest = sourceData.quest_intervals.at(-1);
    digitalEndSec = finalQuest.animation_sec + finalQuest.animation_duration_sec;
    detours = sourceData.intention_status_intervals.filter((item) => item.category === "detour");
  }

  const params = new URLSearchParams(window.location.search);
  minimalPresentation = params.get("minimal") === "1";
  const requestedScreenDuration = Number(params.get("duration"));
  if (Number.isFinite(requestedScreenDuration) && requestedScreenDuration > 0) {
    presentationDuration = requestedScreenDuration;
    playbackRate = ANIMATION_DURATION / requestedScreenDuration;
  }

  const rawQueryFrame = params.get("frame");
  const queryFrame = rawQueryFrame === null ? NaN : Number(rawQueryFrame);
  if (Number.isFinite(queryFrame) && queryFrame >= 0 && queryFrame <= ANIMATION_DURATION) {
    currentSec = queryFrame;
    isPlaying = false;
  }

  wireControls();
  updatePresentationLabels();
  document.getElementById("loading-message")?.remove();
}

function draw() {
  if (isPlaying && !loadError && sourceData?.metadata) {
    currentSec += (deltaTime / 1000) * playbackRate;
    if (currentSec >= ANIMATION_DURATION) {
      currentSec = ANIMATION_DURATION;
      isPlaying = false;
    }
  }

  updateControlState();
  renderAnimation(currentSec, millis() / 1000);
}

function wireControls() {
  document.getElementById("play-toggle").addEventListener("click", togglePlayback);
  document.getElementById("restart").addEventListener("click", restartPlayback);
  document.getElementById("save-frame").addEventListener("click", saveSelectedFrame);

  document.querySelectorAll("[data-frame]").forEach((button) => {
    button.addEventListener("click", () => inspectFrame(Number(button.dataset.frame)));
  });

  const scrubber = document.getElementById("time-scrubber");
  scrubber.addEventListener("input", () => {
    currentSec = Number(scrubber.value);
    isPlaying = false;
    updateUrl();
  });
}

function updatePresentationLabels() {
  document.querySelectorAll("[data-frame]").forEach((button) => {
    const frame = Number(button.dataset.frame);
    const presentationSecond = Math.round(frame / ANIMATION_DURATION * presentationDuration);
    const index = button.querySelector("span")?.textContent || "";
    button.innerHTML = `<span>${index}</span> ${String(presentationSecond).padStart(2, "0")} sec`;
  });

  document.querySelector(".timeline-control label").textContent = "Playback time";
  document.getElementById("animation-eyebrow").textContent = `ONE RECORDED SESSION / ${Math.round(presentationDuration)}-SECOND PLAYBACK`;
}

function keyPressed() {
  if (key === " ") togglePlayback();
  if (key === "r" || key === "R") restartPlayback();
  if (key === "1") inspectFrame(15);
  if (key === "2") inspectFrame(38);
  if (key === "3") inspectFrame(60);
  if (key === "s" || key === "S") saveSelectedFrame();
}

function togglePlayback() {
  if (currentSec >= ANIMATION_DURATION) currentSec = 0;
  isPlaying = !isPlaying;
  if (isPlaying) clearFrameQuery();
}

function restartPlayback() {
  currentSec = 0;
  isPlaying = true;
  clearFrameQuery();
}

function inspectFrame(seconds) {
  currentSec = seconds;
  isPlaying = false;
  updateUrl();
}

function updateUrl() {
  const url = new URL(window.location.href);
  const exactFrame = FRAME_TARGETS.find((frame) => abs(frame - currentSec) < 0.01);
  if (exactFrame) url.searchParams.set("frame", String(exactFrame));
  else url.searchParams.delete("frame");
  window.history.replaceState({}, "", url);
}

function clearFrameQuery() {
  const url = new URL(window.location.href);
  url.searchParams.delete("frame");
  window.history.replaceState({}, "", url);
}

function updateControlState() {
  const playButton = document.getElementById("play-toggle");
  playButton.textContent = isPlaying ? "Pause" : "Play";
  playButton.setAttribute("aria-pressed", String(isPlaying));

  document.querySelectorAll("[data-frame]").forEach((button) => {
    const selected = !isPlaying && abs(Number(button.dataset.frame) - currentSec) < 0.01;
    button.setAttribute("aria-pressed", String(selected));
  });

  const scrubber = document.getElementById("time-scrubber");
  if (document.activeElement !== scrubber) scrubber.value = currentSec.toFixed(2);
  const presentationSec = currentSec / ANIMATION_DURATION * presentationDuration;
  document.getElementById("time-output").textContent = `${presentationSec.toFixed(2).padStart(5, "0")} sec`;
}

function saveSelectedFrame() {
  saveCanvas(frameCanvas, `second-world-route-ripple-${currentSec.toFixed(2)}s`, "png");
}

function renderAnimation(targetSec, motionClock) {
  background(COLORS.background);

  if (loadError || !sourceData?.metadata) {
    drawLoadError();
    return;
  }

  const routeTime = min(targetSec, digitalEndSec);
  const embeddedOffset = minimalPresentation ? EMBEDDED_PLOT_Y_OFFSET : 0;
  push();
  translate(0, embeddedOffset);
  if (minimalPresentation) scale(1, EMBEDDED_PLOT_VERTICAL_SCALE);
  drawMapLanguageField();
  drawSubtleField();
  if (minimalPresentation) drawEmbeddedReadingGuide(motionClock);
  if (!minimalPresentation) drawHeader(targetSec);
  drawQuestStructure(routeTime);
  drawLatentGuide();
  drawQuestTransitionPulse(routeTime);
  const physicalField = buildPhysicalField(routeTime, targetSec, motionClock);
  drawPhysicalTunnel(physicalField, routeTime);
  drawGestureRipples(routeTime);
  drawPlannedRoute(routeTime);
  drawActualRoute(routeTime);
  drawQuestWaypoints(routeTime);
  drawDigitalDots(routeTime, physicalField);
  drawTriggerNodes(routeTime);
  drawGestureMemory(routeTime);
  drawRouteCursor(routeTime, targetSec);
  drawDetourLabels(routeTime);
  drawLegends(targetSec);
  pop();
  drawVignette();
}

function drawEmbeddedReadingGuide(motionClock) {
  const panelX = 58;
  const panelY = 14;
  const panelW = width - 116;
  const panelH = 128;
  const visualY = 78;

  noStroke();
  fill(hexWithAlpha(COLORS.panel, 242));
  rect(panelX, panelY, panelW, panelH, 4);
  noFill();
  stroke(hexWithAlpha(COLORS.map, 102));
  strokeWeight(1);
  rect(panelX, panelY, panelW, panelH, 4);
  line(panelX + 18, 50, panelX + panelW - 18, 50);
  line(560, 60, 560, 132);
  line(1044, 60, 1044, 132);

  noStroke();
  fill(hexWithAlpha(COLORS.bright, 225));
  textSize(17);
  text("HOW TO READ THE PORTRAIT", 80, 41);
  textAlign(RIGHT, BASELINE);
  fill(hexWithAlpha(COLORS.text, 160));
  textSize(12);
  text("INTENTION  ·  DIGITAL SELF  ·  PHYSICAL SELF", width - 80, 40);
  textAlign(LEFT, BASELINE);

  drawDashedLine(88, visualY, 340, visualY, 9, 8, COLORS.plan, 195, 1.6);
  noStroke();
  fill(COLORS.plan);
  circle(88, visualY, 7);
  fill(hexWithAlpha(COLORS.text, 185));
  textSize(12);
  text("INTENTION", 88, 111);
  fill(COLORS.bright);
  textSize(16);
  text("planned route", 88, 130);

  noFill();
  stroke(hexWithAlpha(COLORS.actual, 54));
  strokeWeight(9);
  bezier(620, 78, 676, 40, 755, 104, 920, 67);
  stroke(hexWithAlpha(COLORS.actual, 220));
  strokeWeight(2);
  bezier(620, 78, 676, 40, 755, 104, 920, 67);
  const dotPositions = [
    [642, 69, "running"], [682, 56, "flying"], [731, 84, "combating"], [788, 93, "doing quest"], [857, 75, "driving"],
  ];
  dotPositions.forEach(([x, y, category]) => {
    const style = ACTION_STYLES[category];
    noStroke();
    fill(hexWithAlpha(style.color, 225));
    circle(x, y, style.radius * 2.35);
  });
  push();
  translate(918, 67);
  rotate(-0.18);
  rectMode(CENTER);
  noFill();
  stroke(COLORS.bright);
  strokeWeight(1.7);
  square(0, 0, 12);
  pop();
  noStroke();
  fill(hexWithAlpha(COLORS.text, 185));
  textSize(12);
  text("DIGITAL SELF", 588, 111);
  fill(COLORS.bright);
  textSize(16);
  text("avatar actions", 588, 130);

  const ripplePulse = (sin(motionClock * 1.6) + 1) * 0.5;
  const rippleX = 1275;
  noFill();
  for (let index = 0; index < 3; index += 1) {
    const radius = 19 + index * 22 + ripplePulse * 5;
    stroke(hexWithAlpha(COLORS.physical, 205 - index * 48));
    strokeWeight(index === 0 ? 2 : 1.35);
    ellipse(rippleX, visualY, radius * 2, radius * 0.56);
  }
  noStroke();
  fill(COLORS.bright);
  circle(rippleX, visualY, 8);
  fill(hexWithAlpha(COLORS.text, 185));
  textSize(12);
  text("PHYSICAL SELF", 1125, 111);
  fill(COLORS.bright);
  textSize(16);
  text("body response", 1125, 130);
}

function drawMapLanguageField() {
  push();
  noFill();

  stroke(hexWithAlpha(COLORS.map, 58));
  strokeWeight(1);
  for (let x = PLOT.left; x <= PLOT.right; x += 172) line(x, 118, x, height - 112);
  for (let y = 150; y <= height - 112; y += 108) line(PLOT.left, y, PLOT.right, y);

  // Fixed coordinate crosses keep the field readable as a minimap after the
  // 1600px canvas is scaled down inside the comparison page.
  stroke(hexWithAlpha(COLORS.map, 84));
  strokeWeight(1.25);
  for (let x = PLOT.left; x <= PLOT.right; x += 172) {
    for (let y = 150; y <= height - 112; y += 108) {
      line(x - 3.5, y, x + 3.5, y);
      line(x, y - 3.5, x, y + 3.5);
    }
  }

  drawContourCluster(360, 270, 118, 46, 6, 22);
  drawContourCluster(1215, 628, 162, 58, 7, 24);
  drawContourCluster(980, 235, 92, 34, 4, 19);
  pop();
}

function drawContourCluster(centerX, centerY, baseRadiusX, baseRadiusY, count, spacing) {
  for (let contour = 0; contour < count; contour += 1) {
    const radiusX = baseRadiusX + contour * spacing;
    const radiusY = baseRadiusY + contour * spacing * 0.38;
    stroke(hexWithAlpha(COLORS.map, 100 - contour * 6.2));
    strokeWeight(contour < 2 ? 1.35 : 1.05);
    beginShape();
    for (let step = 0; step <= 48; step += 1) {
      const angle = map(step, 0, 48, 0, TWO_PI);
      const warp = 1 + sin(angle * 3 + contour * 0.72) * 0.055 + cos(angle * 5 - contour * 0.41) * 0.025;
      vertex(
        centerX + cos(angle) * radiusX * warp,
        centerY + sin(angle) * radiusY * (1 + sin(angle * 2 + contour) * 0.045),
      );
    }
    endShape(CLOSE);
  }
}

function drawSubtleField() {
  noStroke();
  for (let y = 90; y < height - 80; y += 54) {
    fill(255, 255, 255, y === PLOT.baselineY ? 7 : 3);
    rect(PLOT.left, y, PLOT.right - PLOT.left, 1);
  }
}

function drawHeader(targetSec) {
  fill(hexWithAlpha(COLORS.text, 120));
  noStroke();
  textSize(11);
  text("SECOND WORLD / A BEHAVIORAL TRACE BETWEEN MY BODY AND MY DIGITAL SELF", 58, 54);

  fill(COLORS.bright);
  textSize(25);
  text(`${targetSec.toFixed(2)} SEC`, 58, 88);

  fill(hexWithAlpha(COLORS.text, 135));
  textSize(10);
  const status = targetSec > digitalEndSec ? "PHYSICAL AFTERTRACE" : activeStateLabel(targetSec);
  text(status, 58, 108);

  textAlign(RIGHT, BASELINE);
  fill(hexWithAlpha(COLORS.text, 100));
  const screenDuration = ANIMATION_DURATION / playbackRate;
  text(`RECORDED 49:56 → ${screenDuration < 59.5 ? `PLAYBACK ${screenDuration.toFixed(0)} SEC` : "COMPRESSED TO 01:00"}`, width - 58, 54);
  textAlign(LEFT, BASELINE);
}

function drawLatentGuide() {
  stroke(hexWithAlpha(COLORS.structure, 72));
  strokeWeight(1);
  line(PLOT.left, PLOT.baselineY, PLOT.right, PLOT.baselineY);
}

function drawPlannedRoute(routeTime) {
  const xEnd = timeToX(routeTime);
  drawDashedLine(PLOT.left, PLOT.baselineY, xEnd, PLOT.baselineY, 9, 10, COLORS.plan, 132, 1.25);

  if (routeTime > 0) {
    noStroke();
    fill(hexWithAlpha(COLORS.plan, 170));
    circle(PLOT.left, PLOT.baselineY, 5);
  }
}

function drawActualRoute(routeTime) {
  if (routeTime <= 0) return;

  noFill();
  stroke(hexWithAlpha(COLORS.actual, 20));
  strokeWeight(12);
  drawRouteShape(routeTime);

  stroke(hexWithAlpha(COLORS.actual, 235));
  strokeWeight(2.2);
  drawRouteShape(routeTime);
}

function drawRouteShape(routeTime) {
  beginShape();
  for (let t = 0; t <= routeTime; t += 0.055) {
    const point = actualPointAt(t);
    vertex(point.x, point.y);
  }
  const finalPoint = actualPointAt(routeTime);
  vertex(finalPoint.x, finalPoint.y);
  endShape();
}

function drawDigitalDots(routeTime, physicalField) {
  sourceData.digital_action_intervals.forEach((item) => {
    const count = max(1, ceil(item.duration_sec / 14));
    const style = ACTION_STYLES[item.category] || ACTION_STYLES.story;

    for (let index = 0; index < count; index += 1) {
      const u = (index + 0.5) / count;
      const birthTime = item.animation_sec + item.animation_duration_sec * u;
      if (birthTime > routeTime) continue;

      const rng = makeRng(stableSeed(item.source_row, item.category, index));
      const point = actualPointAt(birthTime);
      const tangent = routeTangentAt(birthTime);
      const normal = { x: -tangent.y, y: tangent.x };
      const spread = 7 + style.radius * 2.7;
      const normalOffset = (rng() - 0.5) * spread * 2;
      const tangentOffset = (rng() - 0.5) * 7;
      const restingX = point.x + normal.x * normalOffset + tangent.x * tangentOffset;
      const restingY = point.y + normal.y * normalOffset + tangent.y * tangentOffset;
      const interaction = physicalDotInteraction(restingX, restingY, physicalField);
      const x = restingX + interaction.x;
      const y = restingY + interaction.y;
      const reveal = easeOutCubic(constrain((routeTime - birthTime) / DOT_REVEAL_DURATION, 0, 1));
      const radius = style.radius * (0.76 + rng() * 0.48) * reveal;

      noStroke();
      fill(hexWithAlpha(style.color, 24 * reveal * interaction.brightness));
      circle(x, y, radius * 4.4 * interaction.brightness);
      fill(hexWithAlpha(style.color, 205 * reveal * interaction.brightness));
      circle(x, y, radius * 2 * min(interaction.brightness, 1.18));
    }
  });
}

function buildPhysicalField(routeTime, physicalTime, motionClock) {
  if (routeTime <= 0) return null;
  const style = physicalStyleAt(physicalTime);
  const center = actualPointAt(routeTime);
  const tangent = routeTangentAt(routeTime);
  const angle = atan2(tangent.y, tangent.x) * 0.2 + style.tilt;
  const waves = [];

  for (let index = 0; index < ACTIVE_RIPPLE_COUNT; index += 1) {
    const phase = (motionClock * style.rate + index / ACTIVE_RIPPLE_COUNT) % 1;
    const eased = 1 - pow(1 - phase, 1.7);
    waves.push({
      phase,
      radius: lerp(12, style.maxRadius, eased),
      alpha: pow(1 - phase, 1.55) * style.opacity,
      band: lerp(8, 16, phase),
    });
  }

  return { center, angle, style, waves };
}

function drawPhysicalTunnel(field, routeTime) {
  if (!field) return;
  const { center, angle, style, waves } = field;

  push();
  translate(center.x, center.y);
  rotate(angle);
  noFill();
  blendMode(ADD);

  waves.forEach((wave) => {
    const coreWeight = 0.85 + (1 - wave.phase) * style.weight;
    drawLuminousEllipse(
      style.driftX * wave.phase,
      style.driftY * wave.phase,
      wave.radius * 2 * style.scaleX,
      wave.radius * 2 * style.scaleY,
      COLORS.physical,
      wave.alpha,
      coreWeight,
      style.glow,
    );
  });

  blendMode(BLEND);
  pop();

  // Short-lived cross-sections make the pulse read as a moving volume rather than a badge.
  for (let index = 1; index <= TRAIL_CROSS_SECTION_COUNT; index += 1) {
    const trailTime = max(0, routeTime - index * 0.3);
    const trail = actualPointAt(trailTime);
    const trailStyle = physicalStyleAt(trailTime);
    const trailTangent = routeTangentAt(trailTime);
    const trailAngle = atan2(trailTangent.y, trailTangent.x) * 0.2 + trailStyle.tilt;
    const trailScale = 1 - index * 0.055;
    const trailAlpha = max(8, 68 - index * 6.2);
    push();
    translate(trail.x, trail.y);
    rotate(trailAngle);
    noFill();
    blendMode(ADD);
    drawLuminousEllipse(
      0,
      0,
      trailStyle.maxRadius * trailScale * trailStyle.scaleX,
      trailStyle.maxRadius * trailScale * trailStyle.scaleY,
      COLORS.physical,
      trailAlpha,
      0.65 + trailStyle.weight * 0.28,
      trailStyle.glow * 0.55,
    );
    blendMode(BLEND);
    pop();
  }
}

function drawLuminousEllipse(x, y, ellipseWidth, ellipseHeight, colorHex, alpha, coreWeight, glowStrength) {
  noFill();
  stroke(hexWithAlpha(colorHex, alpha * 0.1 * glowStrength));
  strokeWeight(coreWeight + 9 * glowStrength);
  ellipse(x, y, ellipseWidth, ellipseHeight);
  stroke(hexWithAlpha(colorHex, alpha * 0.28 * glowStrength));
  strokeWeight(coreWeight + 3.5 * glowStrength);
  ellipse(x, y, ellipseWidth, ellipseHeight);
  stroke(hexWithAlpha(colorHex, alpha));
  strokeWeight(coreWeight);
  ellipse(x, y, ellipseWidth, ellipseHeight);
}

function physicalDotInteraction(x, y, field) {
  if (!field) return { x: 0, y: 0, brightness: 1 };

  const dx = x - field.center.x;
  const dy = y - field.center.y;
  const cosine = cos(-field.angle);
  const sine = sin(-field.angle);
  const localX = dx * cosine - dy * sine;
  const localY = dx * sine + dy * cosine;
  const ellipticalDistance = sqrt(
    sq(localX / max(0.2, field.style.scaleX)) + sq(localY / max(0.2, field.style.scaleY)),
  );

  let influence = 0;
  field.waves.forEach((wave) => {
    const distanceFromWave = abs(ellipticalDistance - wave.radius);
    const waveInfluence = exp(-sq(distanceFromWave / wave.band)) * (wave.alpha / field.style.opacity);
    influence = max(influence, waveInfluence);
  });

  influence = constrain(influence, 0, 1);
  const distance = max(0.001, sqrt(dx * dx + dy * dy));
  const push = influence * field.style.dotPush;
  return {
    x: dx / distance * push,
    y: dy / distance * push,
    brightness: 1 + influence * 0.42,
  };
}

function drawQuestTransitionPulse(routeTime) {
  sourceData.quest_intervals.slice(1).forEach((quest) => {
    const age = routeTime - quest.animation_sec;
    if (age < 0 || age > QUEST_TRANSITION_DURATION) return;

    const phase = age / QUEST_TRANSITION_DURATION;
    const center = actualPointAt(quest.animation_sec);
    const radius = lerp(12, 64, easeOutCubic(phase));
    noFill();
    stroke(hexWithAlpha(COLORS.actual, pow(1 - phase, 1.8) * 125));
    strokeWeight(1);
    ellipse(center.x, center.y, radius * 2, radius * 0.72);
  });
}

function drawQuestWaypoints(routeTime) {
  sourceData.quest_intervals.forEach((quest, index) => {
    if (routeTime < quest.animation_sec) return;

    const startPoint = actualPointAt(quest.animation_sec);
    const questEnd = quest.animation_sec + quest.animation_duration_sec;
    const endPoint = actualPointAt(min(questEnd, digitalEndSec));
    const complete = routeTime >= questEnd - 0.01;

    drawWaypointDiamond(startPoint.x, startPoint.y, true, index === 0 ? "START" : `Q${index + 1}`);
    drawWaypointDiamond(endPoint.x, endPoint.y, complete, index === sourceData.quest_intervals.length - 1 ? "DEST" : "");
  });
}

function drawWaypointDiamond(x, y, reached, label) {
  push();
  translate(x, y);
  rotate(PI / 4);
  rectMode(CENTER);
  noFill();
  stroke(hexWithAlpha(reached ? COLORS.trigger : COLORS.text, reached ? 205 : 78));
  strokeWeight(reached ? 1.5 : 1);
  square(0, 0, reached ? 11 : 9);
  pop();

  if (!label) return;
  noStroke();
  fill(hexWithAlpha(COLORS.text, 105));
  textSize(9.5);
  textAlign(CENTER, BASELINE);
  text(label, x, y - 13);
  textAlign(LEFT, BASELINE);
}

function drawGestureRipples(routeTime) {
  sourceData.hand_gesture_events.forEach((event) => {
    const age = routeTime - event.animation_sec;
    if (age < 0 || age > 1.35) return;

    const center = actualPointAt(event.animation_sec);
    for (let index = 0; index < 3; index += 1) {
      const phase = constrain(age / 1.35 - index * 0.13, 0, 1);
      if (phase <= 0) continue;
      const radius = lerp(10, 76, phase);
      push();
      blendMode(ADD);
      drawLuminousEllipse(
        center.x,
        center.y,
        radius * 2,
        radius * 1.35,
        COLORS.gesture,
        pow(1 - phase, 1.6) * 170,
        1.1,
        0.7,
      );
      blendMode(BLEND);
      pop();
    }
  });
}

function drawGestureMemory(routeTime) {
  sourceData.hand_gesture_events
    .filter((event) => event.animation_sec <= routeTime)
    .forEach((event) => {
      const point = actualPointAt(event.animation_sec);
      const tangent = routeTangentAt(event.animation_sec);
      const normal = { x: -tangent.y, y: tangent.x };
      stroke(hexWithAlpha(COLORS.gesture, 130));
      strokeWeight(1);
      line(point.x - normal.x * 4, point.y - normal.y * 4, point.x + normal.x * 4, point.y + normal.y * 4);
    });
}

function drawTriggerNodes(routeTime) {
  sourceData.trigger_events
    .filter((event) => event.animation_sec <= routeTime)
    .forEach((event) => {
      const point = actualPointAt(event.animation_sec);
      noFill();
      stroke(hexWithAlpha(COLORS.trigger, 225));
      strokeWeight(1.4);
      circle(point.x, point.y, event.category === "explore" ? 16 : 11);
      noStroke();
      fill(hexWithAlpha(COLORS.trigger, 220));
      circle(point.x, point.y, 3.2);

      const age = routeTime - event.animation_sec;
      if (age <= 0.55) {
        const phase = constrain(age / 0.55, 0, 1);
        noFill();
        stroke(hexWithAlpha(COLORS.trigger, pow(1 - phase, 1.6) * 120));
        strokeWeight(1);
        circle(point.x, point.y, lerp(12, 48, easeOutCubic(phase)));
      }
    });
}

function drawQuestStructure(routeTime) {
  sourceData.quest_intervals.forEach((quest, index) => {
    if (routeTime < quest.animation_sec) return;
    const startX = timeToX(quest.animation_sec);
    const visibleEnd = min(routeTime, quest.animation_sec + quest.animation_duration_sec);
    const endX = timeToX(visibleEnd);
    const y = PLOT.baselineY + 254;

    stroke(hexWithAlpha(COLORS.structure, 150));
    strokeWeight(1);
    line(startX, y, endX, y);
    line(startX, y - 4, startX, y + 4);
    if (visibleEnd >= quest.animation_sec + quest.animation_duration_sec - 0.01) line(endX, y - 4, endX, y + 4);

    noStroke();
    fill(hexWithAlpha(COLORS.text, 125));
    textSize(11.5);
    text(`Q${index + 1}`, startX + 5, y + 18);
  });
}

function drawRouteCursor(routeTime, targetSec) {
  const point = actualPointAt(routeTime);
  const tangent = routeTangentAt(routeTime);
  const angle = atan2(tangent.y, tangent.x);

  push();
  translate(point.x, point.y);
  rotate(angle);

  noStroke();
  fill(hexWithAlpha(COLORS.actual, 22));
  ellipse(0, 0, 42, 29);
  fill(hexWithAlpha(COLORS.actual, 42));
  ellipse(0, 0, 27, 19);

  // An asymmetric kite keeps travel direction legible without depicting a
  // copyrighted game character.
  noFill();
  stroke(hexWithAlpha(COLORS.actual, 100));
  strokeWeight(5.5);
  beginShape();
  vertex(13, 0);
  vertex(-2, -7);
  vertex(-9, 0);
  vertex(-2, 7);
  endShape(CLOSE);

  fill(hexWithAlpha(COLORS.background, 215));
  stroke(COLORS.bright);
  strokeWeight(1.8);
  beginShape();
  vertex(13, 0);
  vertex(-2, -7);
  vertex(-9, 0);
  vertex(-2, 7);
  endShape(CLOSE);

  stroke(hexWithAlpha(COLORS.actual, 220));
  strokeWeight(1.4);
  line(-10, 0, -18, 0);
  pop();

  if (targetSec > digitalEndSec) {
    noStroke();
    fill(hexWithAlpha(COLORS.physical, 165));
    textSize(11.5);
    text("BODY CONTINUES", point.x - 86, point.y - 24);
  }
}

function drawDetourLabels(routeTime) {
  detours.forEach((detour, index) => {
    if (routeTime < detour.animation_sec) return;
    const middleTime = detour.animation_sec + detour.animation_duration_sec / 2;
    const peak = actualPointAt(middleTime);
    const side = DETOUR_DIRECTIONS[index] || 1;
    const sourceDuration = formatSourceDuration(detour.duration_sec);

    noStroke();
    fill(hexWithAlpha(COLORS.text, detour.animation_duration_sec > 1 ? 118 : 78));
    textSize(11.5);
    textAlign(CENTER, BASELINE);
    text(`D${index + 1} · ${sourceDuration}`, peak.x, peak.y + side * 22);
    textAlign(LEFT, BASELINE);
  });
}

function drawLegends(targetSec) {
  const legendY = 812;
  fill(hexWithAlpha(COLORS.text, 135));
  noStroke();
  textSize(11.5);
  text("PLAN", 58, legendY);
  drawDashedLine(105, legendY - 3, 154, legendY - 3, 7, 7, COLORS.plan, 150, 1);

  stroke(hexWithAlpha(COLORS.actual, 220));
  strokeWeight(2);
  line(196, legendY - 3, 246, legendY - 3);
  noStroke();
  fill(hexWithAlpha(COLORS.text, 135));
  text("ACTUAL", 256, legendY);

  noFill();
  stroke(hexWithAlpha(COLORS.physical, 160));
  strokeWeight(1);
  ellipse(365, legendY - 3, 26, 12);
  noStroke();
  fill(hexWithAlpha(COLORS.text, 135));
  text("BODY ENERGY", 386, legendY);

  let x = 572;
  Object.values(ACTION_STYLES).forEach((style) => {
    noStroke();
    fill(hexWithAlpha(style.color, 215));
    circle(x, legendY - 4, style.radius * 2);
    fill(hexWithAlpha(COLORS.text, 110));
    text(style.label, x + 10, legendY);
    x += textWidth(style.label) + 38;
  });

  textAlign(RIGHT, BASELINE);
  fill(hexWithAlpha(COLORS.text, 90));
  const action = actionAt(targetSec)?.category?.toUpperCase() || "NO DIGITAL ACTION";
  text(action, width - 58, legendY);
  textAlign(LEFT, BASELINE);
}

function drawVignette() {
  noFill();
  for (let index = 0; index < 20; index += 1) {
    stroke(0, 0, 0, 7);
    strokeWeight(18);
    rect(index * 4, index * 4, width - index * 8, height - index * 8);
  }
}

function actualPointAt(animationSec) {
  const time = constrain(animationSec, 0, digitalEndSec);
  const detourIndex = detours.findIndex(
    (item) => time >= item.animation_sec && time <= item.animation_sec + item.animation_duration_sec,
  );

  let offset = 0;
  if (detourIndex >= 0) {
    const detour = detours[detourIndex];
    const u = constrain((time - detour.animation_sec) / detour.animation_duration_sec, 0, 1);
    const durationRoot = sqrt(detour.duration_sec);
    const rootMin = sqrt(min(...detours.map((item) => item.duration_sec)));
    const rootMax = sqrt(max(...detours.map((item) => item.duration_sec)));
    const amplitude = map(durationRoot, rootMin, rootMax, 24, 205);
    const smoothDeparture = pow(sin(PI * u), 1.12);
    offset = (DETOUR_DIRECTIONS[detourIndex] || 1) * amplitude * smoothDeparture;
  }

  return { x: timeToX(time), y: PLOT.baselineY + offset };
}

function routeTangentAt(animationSec) {
  const before = actualPointAt(max(0, animationSec - 0.025));
  const after = actualPointAt(min(digitalEndSec, animationSec + 0.025));
  const magnitude = max(0.001, dist(before.x, before.y, after.x, after.y));
  return { x: (after.x - before.x) / magnitude, y: (after.y - before.y) / magnitude };
}

function postureAt(animationSec) {
  return sourceData.physical_posture_intervals.find(
    (item) => animationSec >= item.animation_sec && animationSec < item.animation_sec + item.animation_duration_sec,
  ) || sourceData.physical_posture_intervals.at(-1);
}

function actionAt(animationSec) {
  return sourceData.digital_action_intervals.find(
    (item) => animationSec >= item.animation_sec && animationSec < item.animation_sec + item.animation_duration_sec,
  );
}

function activeStateLabel(animationSec) {
  const intention = sourceData.intention_status_intervals.find(
    (item) => animationSec >= item.animation_sec && animationSec < item.animation_sec + item.animation_duration_sec,
  );
  const posture = postureAt(animationSec);
  const action = actionAt(animationSec);
  return `${intention?.category || "unknown"} / ${action?.category || "digital end"} / ${posture?.category || "unknown posture"}`.toUpperCase();
}

function postureStyle(category) {
  const styles = {
    neutral: { maxRadius: 76, scaleX: 1, scaleY: 0.58, rate: 0.32, opacity: 128, weight: 1.15, glow: 0.72, dotPush: 2.2, tilt: 0, driftX: 0, driftY: 0 },
    "hand support face": { maxRadius: 92, scaleX: 0.88, scaleY: 0.66, rate: 0.42, opacity: 160, weight: 1.5, glow: 0.9, dotPush: 3.6, tilt: 0.18, driftX: 8, driftY: -3 },
    "head to one side": { maxRadius: 108, scaleX: 1.12, scaleY: 0.55, rate: 0.52, opacity: 180, weight: 1.7, glow: 1.02, dotPush: 5.0, tilt: 0.35, driftX: 10, driftY: 3 },
    "leaning forward": { maxRadius: 150, scaleX: 1.08, scaleY: 0.82, rate: 0.72, opacity: 230, weight: 2.4, glow: 1.35, dotPush: 8.0, tilt: 0.04, driftX: 16, driftY: 0 },
    "leaning backward": { maxRadius: 70, scaleX: 0.76, scaleY: 0.48, rate: 0.38, opacity: 125, weight: 1, glow: 0.65, dotPush: 2.0, tilt: -0.04, driftX: -7, driftY: 0 },
    "leaning to side": { maxRadius: 100, scaleX: 1.24, scaleY: 0.5, rate: 0.46, opacity: 170, weight: 1.55, glow: 0.95, dotPush: 4.5, tilt: 0.28, driftX: 11, driftY: 3 },
  };
  return styles[category] || styles.neutral;
}

function physicalStyleAt(animationSec) {
  const intervals = sourceData.physical_posture_intervals;
  const activeIndex = intervals.findIndex(
    (item) => animationSec >= item.animation_sec && animationSec < item.animation_sec + item.animation_duration_sec,
  );
  const safeIndex = activeIndex >= 0 ? activeIndex : intervals.length - 1;
  const current = intervals[safeIndex];
  const currentStyle = postureStyle(current?.category);
  if (safeIndex <= 0 || animationSec < current.animation_sec) return currentStyle;

  const phase = constrain((animationSec - current.animation_sec) / POSTURE_BLEND_DURATION, 0, 1);
  if (phase >= 1) return currentStyle;

  const previousStyle = postureStyle(intervals[safeIndex - 1]?.category);
  const eased = smoothstep(phase);
  const blended = {};
  Object.keys(currentStyle).forEach((key) => {
    blended[key] = lerp(previousStyle[key], currentStyle[key], eased);
  });
  return blended;
}

function timeToX(animationSec) {
  return map(constrain(animationSec, 0, ANIMATION_DURATION), 0, ANIMATION_DURATION, PLOT.left, PLOT.right);
}

function drawDashedLine(x1, y1, x2, y2, dash, gap, hex, alpha, weight) {
  const total = dist(x1, y1, x2, y2);
  if (total <= 0) return;
  const dx = (x2 - x1) / total;
  const dy = (y2 - y1) / total;
  stroke(hexWithAlpha(hex, alpha));
  strokeWeight(weight);
  for (let cursor = 0; cursor < total; cursor += dash + gap) {
    const end = min(cursor + dash, total);
    line(x1 + dx * cursor, y1 + dy * cursor, x1 + dx * end, y1 + dy * end);
  }
}

function formatSourceDuration(seconds) {
  const minutes = floor(seconds / 60);
  const remainder = round(seconds % 60);
  if (minutes === 0) return `${remainder}s`;
  return `${minutes}:${String(remainder).padStart(2, "0")}`;
}

function stableSeed(sourceRow, category, sampleIndex) {
  let hash = SECOND_WORLD_SEED ^ sourceRow ^ (sampleIndex * 0x45d9f3b);
  for (let index = 0; index < category.length; index += 1) {
    hash = Math.imul(hash ^ category.charCodeAt(index), 2654435761);
  }
  return hash >>> 0;
}

function makeRng(seed) {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let t = value;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function easeOutCubic(value) {
  return 1 - pow(1 - value, 3);
}

function smoothstep(value) {
  return value * value * (3 - 2 * value);
}

function hexWithAlpha(hex, alpha) {
  return `${hex}${round(constrain(alpha, 0, 255)).toString(16).padStart(2, "0")}`;
}

function drawLoadError() {
  fill(COLORS.text);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(14);
  text(loadError || "Waiting for processed data…", width / 2, height / 2);
  textAlign(LEFT, BASELINE);
}

// Read-only audit hook used during local QA.
function secondWorldAnimationAudit() {
  return {
    detourCount: detours.length,
    detours: detours.map((item, index) => {
      const start = actualPointAt(item.animation_sec);
      const middle = actualPointAt(item.animation_sec + item.animation_duration_sec / 2);
      const end = actualPointAt(item.animation_sec + item.animation_duration_sec);
      return {
        id: index + 1,
        durationSec: item.duration_sec,
        startOffset: start.y - PLOT.baselineY,
        peakOffset: abs(middle.y - PLOT.baselineY),
        endOffset: end.y - PLOT.baselineY,
      };
    }),
    actionCategories: [...new Set(sourceData.digital_action_intervals.map((item) => item.category))],
    styleCategories: Object.keys(ACTION_STYLES),
    postureCategories: [...new Set(sourceData.physical_posture_intervals.map((item) => item.category))],
    finalPhysicalCategory: postureAt(ANIMATION_DURATION)?.category,
    digitalEndSec,
    questCount: sourceData.quest_intervals.length,
    gestureCount: sourceData.hand_gesture_events.length,
    triggerCount: sourceData.trigger_events.length,
    playbackRate,
    screenDurationSec: ANIMATION_DURATION / playbackRate,
  };
}
