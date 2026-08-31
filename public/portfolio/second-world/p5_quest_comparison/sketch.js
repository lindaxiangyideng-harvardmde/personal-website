/*
 * SECOND WORLD — three-quest local-time comparison experiment
 * Main synchronized animation remains untouched in ../p5_animation/.
 */

const SECOND_WORLD_SEED = 250811;
const CANVAS_W = 1600;
const CANVAS_H = 900;
const LANE_Y = [220, 485, 750];
const ROUTE_START_X = 210;
const MAX_ROUTE_LENGTH = 1280;
const ACTION_ROW_OFFSET_Y = -42;
const ACTION_ROW_SPACING = 14;
const ACTION_BAR_WEIGHT = 8;
const ACTION_BAR_GAP_PX = 1.25;
const DETAIL_WINDOW_SOURCE_SEC = 120;
const DETAIL_CANVAS_W = 2400;
const DETAIL_CANVAS_H = 1000;
const DETAIL_LOOP_SCREEN_SEC = 8;
const HOVER_FIELD_HALF_HEIGHT = 104;
const HOVER_OPEN_DELAY_MS = 120;

const COLORS = {
  background: "#05070B",
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
  "game loading": { color: "#7890B8", label: "LOAD" },
  running: { color: "#76A7FF", label: "RUN" },
  flying: { color: "#A58BFF", label: "FLY" },
  driving: { color: "#61C8DB", label: "DRIVE" },
  combating: { color: "#D997C5", label: "COMBAT" },
  "doing quest": { color: "#E0D7F4", label: "QUEST" },
  story: { color: "#8D9ED1", label: "STORY" },
};
const ACTION_ORDER = Object.keys(ACTION_STYLES);
const ACTION_DISPLAY_LABELS = {
  "game loading": "GAME LOADING",
  running: "RUNNING",
  flying: "FLYING",
  driving: "DRIVING",
  combating: "COMBAT",
  "doing quest": "QUEST ACTION",
  story: "STORY",
};

let sourceData;
let quests = [];
let frameCanvas;
let loadError = null;
let activeDetailQuestIndex = null;
let detailWindowStart = 0;
let detailActivatedClock = 0;
let detailPlaybackStartSec = 0;
let detailPlayheadSec = null;
let hoveredSourceSec = null;
let detailCanvas = null;
let detailContext = null;
let hoverOpenTimer = null;
let pendingHoverTarget = null;

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

  if (sourceData?.quest_intervals?.length) quests = buildQuestSlices();

  setupSessionOverview();
  setupHoverInspector();
  document.getElementById("loading-message")?.remove();
}

function draw() {
  const motionClock = millis() / 1000;
  renderComparison(motionClock);
  if (activeDetailQuestIndex !== null) renderDetailWindow(motionClock);
}

function buildQuestSlices() {
  const originalQuests = sourceData.quest_intervals;
  const groupedQuests = [
    { label: "Q1", members: [originalQuests[0]], directionSeed: 0 },
    { label: "Q2", members: [originalQuests[1], originalQuests[2]], directionSeed: 1 },
    { label: "Q3", members: [originalQuests[3]], directionSeed: 3 },
  ];
  const groupedDurations = groupedQuests.map((group) => {
    const first = group.members[0];
    const last = group.members.at(-1);
    return last.aligned_sec + last.duration_sec - first.aligned_sec;
  });
  const maxDuration = max(groupedDurations);

  return groupedQuests.map((group, index) => {
    const firstSourceQuest = group.members[0];
    const finalSourceQuest = group.members.at(-1);
    const start = firstSourceQuest.aligned_sec;
    const end = finalSourceQuest.aligned_sec + finalSourceQuest.duration_sec;
    const duration = end - start;
    const actions = clipIntervals(sourceData.digital_action_intervals, start, end);
    const postures = clipIntervals(sourceData.physical_posture_intervals, start, end);
    const detours = clipIntervals(sourceData.intention_status_intervals, start, end)
      .filter((item) => item.category === "detour")
      .map((item, detourIndex) => ({ ...item, direction: detourDirection(group.directionSeed, detourIndex) }));

    return {
      id: index + 1,
      label: group.label,
      start,
      end,
      duration,
      recordedOrder: index + 1,
      sourceQuestLabels: group.members.map((quest) => quest.category),
      checkpoints: group.members.slice(1).map((quest) => quest.aligned_sec),
      baselineY: LANE_Y[index],
      finalLength: MAX_ROUTE_LENGTH * (duration / maxDuration),
      actions,
      intentions: clipIntervals(sourceData.intention_status_intervals, start, end),
      postures,
      physicalEmitters: buildPhysicalEmitters(postures, actions),
      gestures: sourceData.hand_gesture_events.filter((item) => item.aligned_sec >= start && item.aligned_sec < end),
      triggers: sourceData.trigger_events.filter((item) => item.aligned_sec >= start && item.aligned_sec < end),
      detours,
      detourDuration: detours.reduce((sum, item) => sum + item.clippedDuration, 0),
    };
  });
}

function buildPhysicalEmitters(postures, actions) {
  return postures.flatMap((posture) => {
    const energy = abs(Number(posture.posture_score_raw) || 0);
    if (energy === 0) return [];

    return actions.flatMap((action, actionIndex) => {
      const start = max(posture.clippedStart, action.clippedStart);
      const end = min(posture.clippedEnd, action.clippedEnd);
      if (end <= start) return [];
      return [{
        start,
        end,
        alignedSec: (start + end) / 2,
        duration: end - start,
        energy: constrain(energy, 1, 3),
        postureCategory: posture.category,
        actionCategory: action.category,
        sourceRow: Number(posture.source_row) || 0,
        seedIndex: actionIndex,
      }];
    });
  });
}

function clipIntervals(items, start, end) {
  return items.flatMap((item) => {
    const clippedStart = max(start, item.aligned_sec);
    const clippedEnd = min(end, item.aligned_sec + item.duration_sec);
    if (clippedEnd <= clippedStart) return [];
    return [{
      ...item,
      clippedStart,
      clippedEnd,
      clippedDuration: clippedEnd - clippedStart,
    }];
  });
}

function detourDirection(questIndex, detourIndex) {
  const directions = questIndex % 2 === 0 ? [-1, 1, -1, 1] : [1, -1, 1, -1];
  return directions[detourIndex % directions.length];
}

function renderComparison(motionClock) {
  background(COLORS.background);
  drawMapLanguageField();
  drawSubtleField();

  if (loadError || !quests.length) {
    drawLoadError();
    return;
  }

  quests.forEach((quest) => drawQuest(quest, motionClock));
  drawLegend();
  drawVignette();
}

function drawMapLanguageField() {
  push();
  noFill();

  stroke(hexWithAlpha(COLORS.map, 54));
  strokeWeight(1);
  for (let x = 90; x <= width - 70; x += 180) line(x, 82, x, height - 72);
  for (let y = 112; y <= height - 72; y += 108) line(70, y, width - 60, y);

  stroke(hexWithAlpha(COLORS.map, 80));
  strokeWeight(1.2);
  for (let x = 90; x <= width - 70; x += 180) {
    for (let y = 112; y <= height - 72; y += 108) {
      line(x - 3.25, y, x + 3.25, y);
      line(x, y - 3.25, x, y + 3.25);
    }
  }

  drawContourCluster(410, 160, 130, 40, 5, 24);
  drawContourCluster(1245, 410, 178, 54, 7, 25);
  drawContourCluster(525, 710, 150, 48, 6, 23);
  pop();
}

function drawContourCluster(centerX, centerY, baseRadiusX, baseRadiusY, count, spacing) {
  for (let contour = 0; contour < count; contour += 1) {
    const radiusX = baseRadiusX + contour * spacing;
    const radiusY = baseRadiusY + contour * spacing * 0.36;
    stroke(hexWithAlpha(COLORS.map, 92 - contour * 5.8));
    strokeWeight(contour < 2 ? 1.3 : 1.05);
    beginShape();
    for (let step = 0; step <= 48; step += 1) {
      const angle = map(step, 0, 48, 0, TWO_PI);
      const warp = 1 + sin(angle * 3 + contour * 0.69) * 0.05 + cos(angle * 5 - contour * 0.37) * 0.025;
      vertex(
        centerX + cos(angle) * radiusX * warp,
        centerY + sin(angle) * radiusY * (1 + sin(angle * 2 + contour) * 0.045),
      );
    }
    endShape(CLOSE);
  }
}

function drawSubtleField() {
  stroke(hexWithAlpha(COLORS.structure, 30));
  strokeWeight(1);
  LANE_Y.forEach((laneY) => line(62, laneY, width - 62, laneY));
}

function drawQuest(quest, motionClock) {
  const routeNow = quest.end;

  drawQuestLabel(quest);
  drawDurationEndpoint(quest);
  drawActionGanttRow(quest, routeNow);
  drawPlannedRoute(quest, routeNow);
  drawActualRoute(quest, routeNow);
  drawQuestWaypoints(quest);
  drawAllGanttPhysicalFields(quest, motionClock);
  drawGestureEvents(quest);
  drawTriggerEvents(quest);
  drawDetourMemory(quest, routeNow);
  if (activeDetailQuestIndex === quest.id - 1) drawZoomSelection(quest);
}

function drawQuestWaypoints(quest) {
  const startPoint = questPointAt(quest, quest.start);
  const endPoint = questPointAt(quest, quest.end);

  drawWaypointDiamond(startPoint.x, startPoint.y, "START", true);
  quest.checkpoints.forEach((alignedSec) => {
    const point = questPointAt(quest, alignedSec);
    drawWaypointDiamond(point.x, point.y, "CHECKPOINT", true, true);
  });
  drawWaypointDiamond(endPoint.x, endPoint.y, "DEST", false);
}

function drawWaypointDiamond(x, y, label, reached, compact = false) {
  push();
  translate(x, y);
  rotate(PI / 4);
  rectMode(CENTER);
  noFill();
  stroke(hexWithAlpha(reached ? COLORS.trigger : COLORS.text, reached ? 200 : 120));
  strokeWeight(reached ? 1.5 : 1.1);
  square(0, 0, compact ? 7 : 10);
  pop();

  noStroke();
  fill(hexWithAlpha(COLORS.text, compact ? 74 : 100));
  textSize(compact ? 6.6 : 7.6);
  textAlign(CENTER, BASELINE);
  text(label, x, y - (compact ? 10 : 13));
  textAlign(LEFT, BASELINE);
}

function drawQuestLabel(quest) {
  const detourShare = quest.detourDuration / quest.duration;
  noStroke();
  fill(COLORS.bright);
  textSize(18);
  text(quest.label, 58, quest.baselineY - 16);

  fill(hexWithAlpha(COLORS.text, 180));
  textSize(10.5);
  text(`RECORDED ${formatDuration(quest.duration)}`, 58, quest.baselineY + 1);

  fill(hexWithAlpha(COLORS.actual, 235));
  textSize(16.5);
  text(`DETOUR ${(detourShare * 100).toFixed(0)}%`, 58, quest.baselineY + 21);

  noStroke();
  fill(hexWithAlpha(COLORS.structure, 210));
  rect(58, quest.baselineY + 29, 120, 6, 3);
  fill(hexWithAlpha(COLORS.actual, 235));
  rect(58, quest.baselineY + 29, 120 * detourShare, 6, 3);
}

function drawDurationEndpoint(quest) {
  const x = ROUTE_START_X + quest.finalLength;
  stroke(hexWithAlpha(COLORS.structure, 135));
  strokeWeight(1);
  line(x, quest.baselineY - 7, x, quest.baselineY + 7);
  noStroke();
  fill(hexWithAlpha(COLORS.text, 78));
  textSize(9.5);
  textAlign(RIGHT, BASELINE);
  text(formatDuration(quest.duration), x - 4, quest.baselineY + 57);
  textAlign(LEFT, BASELINE);
}

function drawPlannedRoute(quest, routeNow) {
  const xEnd = questTimeToX(quest, routeNow);
  drawDashedLine(ROUTE_START_X, quest.baselineY, xEnd, quest.baselineY, 9, 10, COLORS.plan, 135, 1.4);
}

function drawActualRoute(quest, routeNow) {
  if (routeNow <= quest.start) return;

  noFill();
  stroke(hexWithAlpha(COLORS.actual, 20));
  strokeWeight(13);
  drawRouteShape(quest, routeNow);

  stroke(hexWithAlpha(COLORS.actual, 225));
  strokeWeight(2.4);
  drawRouteShape(quest, routeNow);
}

function drawRouteShape(quest, routeNow) {
  beginShape();
  const step = max(0.6, quest.duration / 520);
  for (let aligned = quest.start; aligned <= routeNow; aligned += step) {
    const point = questPointAt(quest, aligned);
    vertex(point.x, point.y);
  }
  const finalPoint = questPointAt(quest, routeNow);
  vertex(finalPoint.x, finalPoint.y);
  endShape();
}

function drawActionGanttRow(quest, routeNow) {
  const firstRowY = quest.baselineY + ACTION_ROW_OFFSET_Y;

  ACTION_ORDER.forEach((category, rowIndex) => {
    const style = ACTION_STYLES[category];
    const rowY = firstRowY + rowIndex * ACTION_ROW_SPACING;

    stroke(hexWithAlpha(COLORS.structure, 62));
    strokeWeight(1);
    line(ROUTE_START_X, rowY, ROUTE_START_X + quest.finalLength, rowY);

    noStroke();
    fill(hexWithAlpha(style.color, 200));
    textSize(10.5);
    textAlign(RIGHT, CENTER);
    text(style.label, ROUTE_START_X - 11, rowY);
  });
  textAlign(LEFT, BASELINE);

  quest.actions.forEach((item) => {
    if (routeNow <= item.clippedStart) return;
    const style = ACTION_STYLES[item.category] || ACTION_STYLES.story;
    const rowIndex = max(0, ACTION_ORDER.indexOf(item.category));
    const barY = firstRowY + rowIndex * ACTION_ROW_SPACING;
    const clippedVisibleEnd = min(routeNow, item.clippedEnd);
    let x1 = questTimeToX(quest, item.clippedStart) + ACTION_BAR_GAP_PX;
    let x2 = questTimeToX(quest, clippedVisibleEnd) - ACTION_BAR_GAP_PX;
    const centerX = (x1 + x2) / 2;
    if (x2 - x1 < 1.5) {
      x1 = centerX - 0.75;
      x2 = centerX + 0.75;
    }

    push();
    strokeCap(SQUARE);
    stroke(hexWithAlpha(style.color, 44));
    strokeWeight(ACTION_BAR_WEIGHT + 6);
    line(x1, barY, x2, barY);
    stroke(hexWithAlpha(style.color, routeNow < item.clippedEnd ? 245 : 205));
    strokeWeight(ACTION_BAR_WEIGHT);
    line(x1, barY, x2, barY);
    pop();
  });

  noStroke();
}

function drawAllGanttPhysicalFields(quest, motionClock) {
  quest.physicalEmitters.forEach((emitter) => {
    const rowIndex = max(0, ACTION_ORDER.indexOf(emitter.actionCategory));
    const centerX = questTimeToX(quest, emitter.alignedSec);
    const centerY = quest.baselineY + ACTION_ROW_OFFSET_Y + rowIndex * ACTION_ROW_SPACING;
    const style = postureStyle(emitter.postureCategory);
    const energyScale = 0.48 + emitter.energy * 0.16;
    const durationScale = 1 + min(0.28, emitter.duration / 240);
    const seed = stableSeed(emitter.sourceRow, emitter.postureCategory, emitter.seedIndex, quest.id);
    const phaseOffset = (seed % 997) / 997;

    push();
    translate(centerX, centerY);
    rotate(style.tilt * 0.45);
    noFill();
    blendMode(ADD);
    for (let index = 0; index < 3; index += 1) {
      const phase = (motionClock * style.rate + index / 3 + phaseOffset) % 1;
      const radius = lerp(5, style.maxRadius * energyScale, 1 - pow(1 - phase, 1.7));
      const alpha = pow(1 - phase, 1.55) * style.opacity * (0.34 + emitter.energy * 0.12);
      drawLuminousEllipse(
        0,
        0,
        radius * 2 * style.scaleX * durationScale,
        radius * 1.28 * style.scaleY,
        COLORS.physical,
        alpha,
        0.55 + (1 - phase) * style.weight * 0.62,
        style.glow * 0.7,
      );
    }
    blendMode(BLEND);
    pop();
  });
}

function drawZoomSelection(quest) {
  const x1 = questTimeToX(quest, detailWindowStart);
  const x2 = questTimeToX(quest, detailWindowStart + DETAIL_WINDOW_SOURCE_SEC);
  const hoverX = questTimeToX(quest, hoveredSourceSec ?? detailWindowStart);
  const top = quest.baselineY - HOVER_FIELD_HALF_HEIGHT;
  const bottom = quest.baselineY + HOVER_FIELD_HALF_HEIGHT;

  noStroke();
  fill(hexWithAlpha(COLORS.actual, 8));
  rect(x1, top, max(2, x2 - x1), bottom - top);
  noFill();
  stroke(hexWithAlpha(COLORS.actual, 110));
  strokeWeight(1);
  rect(x1, top, max(2, x2 - x1), bottom - top);
  stroke(hexWithAlpha(COLORS.bright, 155));
  line(hoverX, top, hoverX, bottom);
}

function actionAtSourceTime(quest, alignedSec) {
  return quest.actions.find((item) => alignedSec >= item.clippedStart && alignedSec < item.clippedEnd)
    || quest.actions.at(-1);
}

function drawGestureEvents(quest) {
  quest.gestures.forEach((event) => {
    const point = questPointAt(quest, event.aligned_sec);

    stroke(hexWithAlpha(COLORS.gesture, 125));
    strokeWeight(1);
    line(point.x, point.y - 4, point.x, point.y + 4);
  });
}

function drawTriggerEvents(quest) {
  quest.triggers.forEach((event) => {
    const point = questPointAt(quest, event.aligned_sec);
    noFill();
    stroke(hexWithAlpha(COLORS.trigger, 220));
    strokeWeight(1.2);
    circle(point.x, point.y, event.category === "explore" ? 13 : 9);
    noStroke();
    fill(hexWithAlpha(COLORS.trigger, 225));
    circle(point.x, point.y, 2.6);

  });
}

function drawDetourMemory(quest, routeNow) {
  quest.detours.forEach((detour, index) => {
    if (detour.clippedStart > routeNow) return;
    const midpoint = (detour.clippedStart + detour.clippedEnd) / 2;
    const point = questPointAt(quest, midpoint);
    const share = detour.clippedDuration / quest.duration;
    noStroke();
    fill(hexWithAlpha(COLORS.text, share > 0.05 ? 95 : 60));
    textSize(9);
    textAlign(CENTER, BASELINE);
    text(`D${index + 1}`, point.x, point.y + detour.direction * 13);
    textAlign(LEFT, BASELINE);
  });
}

function drawLegend() {
  const panelX = 44;
  const panelY = 816;
  const panelW = width - 88;
  const panelH = 70;
  const labelY = 869;

  noStroke();
  fill(hexWithAlpha("#0A0E15", 230));
  rect(panelX, panelY, panelW, panelH, 4);
  noFill();
  stroke(hexWithAlpha(COLORS.map, 105));
  strokeWeight(1);
  rect(panelX, panelY, panelW, panelH, 4);

  noStroke();
  fill(hexWithAlpha(COLORS.text, 190));
  textSize(11.5);
  text("READING KEY", 62, 846);

  stroke(hexWithAlpha(COLORS.structure, 200));
  strokeWeight(1);
  line(169, 834, 169, 878);

  const y = labelY;
  noStroke();
  fill(hexWithAlpha(COLORS.bright, 220));
  textSize(14.5);
  text("PLAN", 190, y);
  drawDashedLine(238, y - 4, 288, y - 4, 7, 7, COLORS.plan, 185, 1.4);

  stroke(hexWithAlpha(COLORS.actual, 220));
  strokeWeight(2.5);
  line(334, y - 4, 386, y - 4);
  noStroke();
  fill(hexWithAlpha(COLORS.bright, 220));
  text("ACTUAL ROUTE", 400, y);

  noFill();
  stroke(hexWithAlpha(COLORS.physical, 215));
  strokeWeight(1.8);
  ellipse(590, y - 4, 28, 13);
  noStroke();
  fill(hexWithAlpha(COLORS.bright, 220));
  text("BODY ENERGY", 612, y);

  push();
  translate(785, y - 4);
  rotate(PI / 4);
  rectMode(CENTER);
  noFill();
  stroke(hexWithAlpha(COLORS.trigger, 230));
  strokeWeight(1.5);
  square(0, 0, 10);
  pop();
  noStroke();
  fill(hexWithAlpha(COLORS.bright, 220));
  text("QUEST WAYPOINT", 802, y);

  stroke(hexWithAlpha(COLORS.structure, 200));
  strokeWeight(1);
  line(1025, 834, 1025, 878);

  textAlign(LEFT, BASELINE);
  fill(hexWithAlpha(COLORS.text, 205));
  textSize(13);
  text("ACTION BARS", 1047, 850);
  fill(hexWithAlpha(COLORS.bright, 190));
  textSize(11.5);
  text("COLOR = ACTION TYPE  ·  LENGTH = DURATION", 1047, 872);
  textAlign(LEFT, BASELINE);
}

function questPointAt(quest, alignedSec) {
  const time = constrain(alignedSec, quest.start, quest.end);
  return { x: questTimeToX(quest, time), y: quest.baselineY + questOffsetAt(quest, time) };
}

function questOffsetAt(quest, alignedSec) {
  const time = constrain(alignedSec, quest.start, quest.end);
  const detour = quest.detours.find((item) => time >= item.clippedStart && time <= item.clippedEnd);

  if (detour) {
    const u = constrain((time - detour.clippedStart) / detour.clippedDuration, 0, 1);
    const share = detour.clippedDuration / quest.duration;
    const amplitude = map(sqrt(share), 0, sqrt(0.24), 11, 52);
    return detour.direction * amplitude * pow(sin(PI * u), 1.12);
  }
  return 0;
}

function questTangentAt(quest, alignedSec) {
  const epsilon = max(0.08, quest.duration * 0.0005);
  const before = questPointAt(quest, alignedSec - epsilon);
  const after = questPointAt(quest, alignedSec + epsilon);
  const magnitude = max(0.001, dist(before.x, before.y, after.x, after.y));
  return { x: (after.x - before.x) / magnitude, y: (after.y - before.y) / magnitude };
}

function questTimeToX(quest, alignedSec) {
  const localProgress = constrain((alignedSec - quest.start) / quest.duration, 0, 1);
  return ROUTE_START_X + localProgress * quest.finalLength;
}

function physicalStyleAt(quest, alignedSec) {
  const safeTime = min(alignedSec, quest.end - 0.001);
  const item = quest.postures.find((posture) => safeTime >= posture.clippedStart && safeTime < posture.clippedEnd)
    || quest.postures.at(-1);
  return postureStyle(item?.category);
}

function postureStyle(category) {
  const styles = {
    neutral: { maxRadius: 39, scaleX: 1, scaleY: 0.58, rate: 0.32, opacity: 125, weight: 0.95, glow: 0.72, dotPush: 1.5, tilt: 0, driftX: 0, driftY: 0 },
    "hand support face": { maxRadius: 47, scaleX: 0.88, scaleY: 0.66, rate: 0.42, opacity: 158, weight: 1.18, glow: 0.88, dotPush: 2.2, tilt: 0.18, driftX: 4, driftY: -2 },
    "head to one side": { maxRadius: 52, scaleX: 1.12, scaleY: 0.55, rate: 0.52, opacity: 180, weight: 1.3, glow: 0.98, dotPush: 3, tilt: 0.35, driftX: 5, driftY: 2 },
    "leaning forward": { maxRadius: 68, scaleX: 1.08, scaleY: 0.82, rate: 0.72, opacity: 230, weight: 1.85, glow: 1.25, dotPush: 4.8, tilt: 0.04, driftX: 7, driftY: 0 },
    "leaning backward": { maxRadius: 35, scaleX: 0.76, scaleY: 0.48, rate: 0.38, opacity: 122, weight: 0.85, glow: 0.66, dotPush: 1.2, tilt: -0.04, driftX: -3, driftY: 0 },
    "leaning to side": { maxRadius: 49, scaleX: 1.24, scaleY: 0.5, rate: 0.46, opacity: 170, weight: 1.22, glow: 0.92, dotPush: 2.6, tilt: 0.28, driftX: 5, driftY: 2 },
  };
  return styles[category] || styles.neutral;
}

function drawLuminousEllipse(x, y, ellipseWidth, ellipseHeight, colorHex, alpha, coreWeight, glowStrength) {
  noFill();
  stroke(hexWithAlpha(colorHex, alpha * 0.1 * glowStrength));
  strokeWeight(coreWeight + 5 * glowStrength);
  ellipse(x, y, ellipseWidth, ellipseHeight);
  stroke(hexWithAlpha(colorHex, alpha * 0.3 * glowStrength));
  strokeWeight(coreWeight + 2 * glowStrength);
  ellipse(x, y, ellipseWidth, ellipseHeight);
  stroke(hexWithAlpha(colorHex, alpha));
  strokeWeight(coreWeight);
  ellipse(x, y, ellipseWidth, ellipseHeight);
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

function setupSessionOverview() {
  const iframe = document.getElementById("session-overview-frame");
  if (!iframe) return;

  const prepareEmbeddedAnimation = () => {
    const frameDocument = iframe.contentDocument;
    if (!frameDocument) return;

    if (!frameDocument.getElementById("second-world-embed-style")) {
      const style = frameDocument.createElement("style");
      style.id = "second-world-embed-style";
      style.textContent = `
        body { padding: 0 !important; overflow: hidden !important; }
        .project-shell { width: 100% !important; }
        .project-header { justify-content: flex-end !important; padding: 0 0 12px !important; }
        .project-header > div:first-child, .project-footer { display: none !important; }
      `;
      frameDocument.head.appendChild(style);
    }

    window.setTimeout(() => {
      const playButton = frameDocument.getElementById("play-toggle");
      if (playButton?.textContent.trim() === "Play") playButton.click();
    }, 180);
  };

  iframe.addEventListener("load", prepareEmbeddedAnimation);
  if (iframe.contentDocument?.readyState === "complete") prepareEmbeddedAnimation();
}

function setupHoverInspector() {
  detailCanvas = document.getElementById("detail-canvas");
  detailContext = detailCanvas.getContext("2d");
  frameCanvas.elt.addEventListener("pointermove", handleOverviewPointerMove);
  frameCanvas.elt.addEventListener("pointerleave", hideHoverDetail);
}

function handleOverviewPointerMove(event) {
  const rect = frameCanvas.elt.getBoundingClientRect();
  const canvasX = ((event.clientX - rect.left) / rect.width) * CANVAS_W;
  const canvasY = ((event.clientY - rect.top) / rect.height) * CANVAS_H;
  const questIndex = quests.findIndex((quest) => (
    abs(canvasY - quest.baselineY) <= HOVER_FIELD_HALF_HEIGHT
    && canvasX >= ROUTE_START_X
    && canvasX <= ROUTE_START_X + quest.finalLength
  ));

  if (questIndex < 0) {
    hideHoverDetail();
    return;
  }

  const quest = quests[questIndex];
  const progress = constrain((canvasX - ROUTE_START_X) / quest.finalLength, 0, 1);
  pendingHoverTarget = {
    questIndex,
    sourceSec: round(quest.start + progress * quest.duration),
  };

  if (activeDetailQuestIndex === null) {
    if (hoverOpenTimer === null) {
      hoverOpenTimer = window.setTimeout(() => {
        hoverOpenTimer = null;
        if (pendingHoverTarget) applyHoverTarget(pendingHoverTarget);
      }, HOVER_OPEN_DELAY_MS);
    }
    return;
  }

  applyHoverTarget(pendingHoverTarget);
}

function applyHoverTarget(target) {
  const quest = quests[target.questIndex];
  const sourceSec = constrain(target.sourceSec, quest.start, quest.end);
  if (activeDetailQuestIndex === target.questIndex && hoveredSourceSec === sourceSec) return;

  activeDetailQuestIndex = target.questIndex;
  hoveredSourceSec = sourceSec;

  const maximumStart = quest.end - DETAIL_WINDOW_SOURCE_SEC;
  detailWindowStart = constrain(sourceSec - DETAIL_WINDOW_SOURCE_SEC / 2, quest.start, maximumStart);
  detailPlaybackStartSec = sourceSec;
  detailActivatedClock = millis() / 1000;

  const detailSection = document.getElementById("quest-detail");
  detailSection.hidden = false;
  detailSection.setAttribute("aria-label", `${quest.label} animated quest detail`);
}

function hideHoverDetail() {
  if (hoverOpenTimer !== null) {
    window.clearTimeout(hoverOpenTimer);
    hoverOpenTimer = null;
  }
  pendingHoverTarget = null;
  if (activeDetailQuestIndex === null) return;

  activeDetailQuestIndex = null;
  hoveredSourceSec = null;
  detailPlayheadSec = null;
  document.getElementById("quest-detail").hidden = true;
}

function renderDetailWindow(motionClock) {
  const quest = quests[activeDetailQuestIndex];
  if (!quest || !detailContext) return;

  const ctx = detailContext;
  const windowStart = detailWindowStart;
  const windowEnd = windowStart + DETAIL_WINDOW_SOURCE_SEC;
  const elapsed = max(0, motionClock - detailActivatedClock);
  const sourceAdvance = elapsed * (DETAIL_WINDOW_SOURCE_SEC / DETAIL_LOOP_SCREEN_SEC);
  const startingOffset = detailPlaybackStartSec - windowStart;
  const detailPlayhead = windowStart + ((startingOffset + sourceAdvance) % DETAIL_WINDOW_SOURCE_SEC);
  detailPlayheadSec = detailPlayhead;
  document.getElementById("quest-detail").dataset.playheadSec = detailPlayhead.toFixed(3);
  const left = 405;
  const right = DETAIL_CANVAS_W - 90;
  const routeY = 482;
  const ganttTop = 345;
  const ganttSpacing = 44;
  const xAt = (alignedSec) => mapRange(alignedSec, windowStart, windowEnd, left, right);

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, DETAIL_CANVAS_W, DETAIL_CANVAS_H);
  ctx.fillStyle = COLORS.background;
  ctx.fillRect(0, 0, DETAIL_CANVAS_W, DETAIL_CANVAS_H);
  ctx.textBaseline = "alphabetic";

  drawDetailMapLanguage(ctx);
  drawDetailHeader(ctx, quest, detailPlayhead, motionClock);
  drawDetailGantt(ctx, quest, windowStart, windowEnd, detailPlayhead, xAt, ganttTop, ganttSpacing, motionClock);
  drawDetailRoute(ctx, quest, windowStart, windowEnd, detailPlayhead, xAt, routeY, motionClock);
  drawDetailGanttRipple(ctx, quest, detailPlayhead, xAt, ganttTop, ganttSpacing, motionClock);
  drawDetailLegend(ctx);

  const vignette = ctx.createRadialGradient(DETAIL_CANVAS_W / 2, DETAIL_CANVAS_H / 2, 260, DETAIL_CANVAS_W / 2, DETAIL_CANVAS_H / 2, 1450);
  vignette.addColorStop(0, "#00000000");
  vignette.addColorStop(1, "#000000a8");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, DETAIL_CANVAS_W, DETAIL_CANVAS_H);
}

function drawDetailMapLanguage(ctx) {
  ctx.save();
  ctx.lineWidth = 1;
  ctx.strokeStyle = hexWithAlpha(COLORS.map, 62);

  for (let x = 100; x <= DETAIL_CANVAS_W - 90; x += 230) {
    ctx.beginPath();
    ctx.moveTo(x, 248);
    ctx.lineTo(x, 865);
    ctx.stroke();
  }
  for (let y = 260; y <= 865; y += 110) {
    ctx.beginPath();
    ctx.moveTo(90, y);
    ctx.lineTo(DETAIL_CANVAS_W - 90, y);
    ctx.stroke();
  }


  ctx.strokeStyle = hexWithAlpha(COLORS.map, 90);
  ctx.lineWidth = 1.5;
  for (let x = 100; x <= DETAIL_CANVAS_W - 90; x += 230) {
    for (let y = 260; y <= 865; y += 110) {
      ctx.beginPath();
      ctx.moveTo(x - 5, y);
      ctx.lineTo(x + 5, y);
      ctx.moveTo(x, y - 5);
      ctx.lineTo(x, y + 5);
      ctx.stroke();
    }
  }

  drawDetailContourCluster(ctx, 650, 560, 210, 64, 6, 34);
  drawDetailContourCluster(ctx, 1880, 470, 260, 74, 7, 36);
  ctx.restore();
}

function drawDetailContourCluster(ctx, centerX, centerY, baseRadiusX, baseRadiusY, count, spacing) {
  for (let contour = 0; contour < count; contour += 1) {
    const radiusX = baseRadiusX + contour * spacing;
    const radiusY = baseRadiusY + contour * spacing * 0.34;
    ctx.strokeStyle = hexWithAlpha(COLORS.map, 98 - contour * 6.4);
    ctx.lineWidth = contour < 2 ? 1.7 : 1.25;
    ctx.beginPath();
    for (let step = 0; step <= 56; step += 1) {
      const angle = mapRange(step, 0, 56, 0, Math.PI * 2);
      const warp = 1 + Math.sin(angle * 3 + contour * 0.71) * 0.05 + Math.cos(angle * 5 - contour * 0.39) * 0.022;
      const x = centerX + Math.cos(angle) * radiusX * warp;
      const y = centerY + Math.sin(angle) * radiusY * (1 + Math.sin(angle * 2 + contour) * 0.04);
      if (step === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
  }
}

function drawDetailHeader(ctx, quest, detailPlayhead, motionClock) {
  const intention = intervalAtSourceTime(quest.intentions, detailPlayhead);
  const activeAction = actionAtSourceTime(quest, detailPlayhead);
  const activePosture = intervalAtSourceTime(quest.postures, detailPlayhead);

  ctx.fillStyle = COLORS.bright;
  ctx.font = "500 44px IBM Plex Mono, ui-monospace, monospace";
  ctx.fillText(`${quest.label} / ZOOMED QUEST DETAIL`, 90, 78);

  const intentionCopy = {
    planned: "FOLLOWING THE INTENDED ROUTE",
    detour: "LEAVING THE INTENDED ROUTE",
    unknown: "NO INTENTION DATA RECORDED",
  };
  const intentionCategory = intention?.category || "unknown";
  ctx.fillStyle = intentionCategory === "detour" ? hexWithAlpha(COLORS.actual, 235) : hexWithAlpha(COLORS.text, 205);
  ctx.font = "21px IBM Plex Mono, ui-monospace, monospace";
  ctx.fillText(`INTENTION: ${intentionCategory.toUpperCase()} — ${intentionCopy[intentionCategory] || intentionCopy.unknown}`, 90, 122);

  drawDetailWorldTranslator(ctx, activeAction, activePosture, motionClock);
}

function drawDetailWorldTranslator(ctx, activeAction, activePosture, motionClock) {
  const digitalX = 1410;
  const physicalX = 1830;
  const actionStyle = ACTION_STYLES[activeAction?.category] || ACTION_STYLES.story;
  const actionLabel = activeAction
    ? ACTION_DISPLAY_LABELS[activeAction.category] || activeAction.category.toUpperCase()
    : "NO ACTION RECORDED";
  const postureLabel = (activePosture?.category || "neutral").toUpperCase();
  const energy = abs(Number(activePosture?.posture_score_raw) || 0);

  ctx.save();
  ctx.fillStyle = hexWithAlpha(COLORS.text, 190);
  ctx.font = "600 22px IBM Plex Mono, ui-monospace, monospace";
  ctx.fillText("DIGITAL WORLD", digitalX, 42);
  ctx.fillText("PHYSICAL WORLD", physicalX, 42);

  drawDetailActionIcon(ctx, activeAction?.category || "story", digitalX + 18, 75, 31, actionStyle.color, 255);
  ctx.fillStyle = hexWithAlpha(actionStyle.color, 255);
  ctx.font = "600 37px IBM Plex Mono, ui-monospace, monospace";
  ctx.fillText(actionLabel, digitalX + 56, 85);

  drawDetailHeaderRipple(ctx, physicalX + 23, 74, postureStyle(activePosture?.category), energy, motionClock);
  ctx.fillStyle = hexWithAlpha(COLORS.physical, energy > 0 ? 255 : 190);
  ctx.font = "600 32px IBM Plex Mono, ui-monospace, monospace";
  ctx.fillText(postureLabel, physicalX + 62, 83);
  ctx.fillStyle = hexWithAlpha(COLORS.text, 185);
  ctx.font = "600 20px IBM Plex Mono, ui-monospace, monospace";
  ctx.fillText(`BODY ENERGY ${energy}`, physicalX + 62, 113);
  ctx.restore();
}

function drawDetailHeaderRipple(ctx, x, y, style, energy, motionClock) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(style.tilt * 0.45);
  ctx.globalCompositeOperation = "lighter";
  ctx.strokeStyle = hexWithAlpha(COLORS.physical, energy > 0 ? 235 : 130);
  ctx.lineWidth = energy > 0 ? 2.2 : 1.4;

  const pulse = energy > 0 ? (Math.sin(motionClock * (1.7 + energy * 0.36)) + 1) * 0.5 : 0.3;
  const count = energy > 0 ? 3 : 1;
  for (let index = 0; index < count; index += 1) {
    const radius = 7 + index * 5 + pulse * (2 + energy * 1.2);
    ctx.globalAlpha = energy > 0 ? 0.85 - index * 0.22 : 0.48;
    ctx.beginPath();
    ctx.ellipse(0, 0, radius * style.scaleX, radius * style.scaleY * 0.62, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}

function drawDetailActionIcon(ctx, category, x, y, size, color, alpha = 255) {
  const s = size;
  ctx.save();
  ctx.translate(x, y);
  ctx.strokeStyle = hexWithAlpha(color, alpha);
  ctx.fillStyle = hexWithAlpha(color, alpha * 0.16);
  ctx.lineWidth = max(1.4, s * 0.15);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  if (category === "game loading") {
    ctx.beginPath();
    ctx.arc(0, 0, s * 0.55, -Math.PI * 0.18, Math.PI * 1.45);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(s * 0.1, -s * 0.67);
    ctx.lineTo(s * 0.52, -s * 0.55);
    ctx.stroke();
  } else if (category === "running") {
    ctx.beginPath();
    ctx.moveTo(-s * 0.55, s * 0.42);
    ctx.lineTo(-s * 0.05, -s * 0.16);
    ctx.lineTo(s * 0.18, s * 0.26);
    ctx.lineTo(s * 0.64, s * 0.5);
    ctx.moveTo(-s * 0.05, -s * 0.16);
    ctx.lineTo(s * 0.4, -s * 0.5);
    ctx.stroke();
  } else if (category === "flying") {
    ctx.beginPath();
    ctx.moveTo(-s * 0.7, s * 0.25);
    ctx.quadraticCurveTo(-s * 0.12, -s * 0.55, s * 0.08, 0);
    ctx.quadraticCurveTo(s * 0.38, -s * 0.35, s * 0.72, s * 0.24);
    ctx.stroke();
  } else if (category === "driving") {
    ctx.beginPath();
    ctx.arc(0, 0, s * 0.44, 0, Math.PI * 2);
    ctx.moveTo(-s * 0.78, 0);
    ctx.lineTo(-s * 0.48, 0);
    ctx.moveTo(s * 0.48, 0);
    ctx.lineTo(s * 0.78, 0);
    ctx.stroke();
  } else if (category === "combating") {
    ctx.beginPath();
    ctx.moveTo(-s * 0.58, -s * 0.55);
    ctx.lineTo(s * 0.58, s * 0.55);
    ctx.moveTo(s * 0.58, -s * 0.55);
    ctx.lineTo(-s * 0.58, s * 0.55);
    ctx.stroke();
  } else if (category === "doing quest") {
    ctx.save();
    ctx.rotate(Math.PI / 4);
    ctx.strokeRect(-s * 0.48, -s * 0.48, s * 0.96, s * 0.96);
    ctx.restore();
    ctx.beginPath();
    ctx.arc(0, 0, s * 0.11, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.beginPath();
    ctx.roundRect(-s * 0.66, -s * 0.45, s * 1.32, s * 0.9, s * 0.16);
    ctx.moveTo(-s * 0.2, s * 0.45);
    ctx.lineTo(-s * 0.42, s * 0.72);
    ctx.lineTo(s * 0.08, s * 0.45);
    ctx.stroke();
  }
  ctx.restore();
}

function drawDetailActionLegend(ctx) {
  const y = 205;
  let x = 90;

  ctx.fillStyle = hexWithAlpha(COLORS.bright, 225);
  ctx.font = "600 30px IBM Plex Mono, ui-monospace, monospace";
  ctx.fillText("DIGITAL ACTIONS", x, y);
  x += 275;

  ACTION_ORDER.forEach((category) => {
    const style = ACTION_STYLES[category];
    const label = ACTION_DISPLAY_LABELS[category];
    drawDetailActionIcon(ctx, category, x + 20, y - 13, 23, style.color, 255);

    ctx.fillStyle = hexWithAlpha(COLORS.bright, 225);
    ctx.font = "600 31px IBM Plex Mono, ui-monospace, monospace";
    ctx.fillText(label, x + 56, y);
    x += 56 + ctx.measureText(label).width + 42;
  });
}

function drawDetailRoute(ctx, quest, windowStart, windowEnd, detailPlayhead, xAt, routeY, motionClock) {
  const routeScale = 2.45;

  ctx.save();
  ctx.setLineDash([20, 18]);
  ctx.strokeStyle = hexWithAlpha(COLORS.plan, 145);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(xAt(windowStart), routeY);
  ctx.lineTo(xAt(windowEnd), routeY);
  ctx.stroke();
  ctx.restore();

  if (quest.start >= windowStart && quest.start <= windowEnd) {
    drawDetailWaypoint(ctx, xAt(quest.start), routeY + questOffsetAt(quest, quest.start) * routeScale, "QUEST START", true);
  }
  quest.checkpoints
    .filter((alignedSec) => alignedSec >= windowStart && alignedSec <= windowEnd)
    .forEach((alignedSec) => {
      drawDetailWaypoint(ctx, xAt(alignedSec), routeY + questOffsetAt(quest, alignedSec) * routeScale, "CHECKPOINT", true);
    });
  if (quest.end >= windowStart && quest.end <= windowEnd) {
    drawDetailWaypoint(ctx, xAt(quest.end), routeY + questOffsetAt(quest, quest.end) * routeScale, "DESTINATION", false);
  }

  ctx.save();
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.beginPath();
  for (let aligned = windowStart; aligned <= windowEnd + 0.001; aligned += 0.22) {
    const x = xAt(min(aligned, windowEnd));
    const y = routeY + questOffsetAt(quest, min(aligned, windowEnd)) * routeScale;
    if (aligned === windowStart) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.strokeStyle = hexWithAlpha(COLORS.actual, 42);
  ctx.lineWidth = 18;
  ctx.shadowColor = COLORS.actual;
  ctx.shadowBlur = 24;
  ctx.stroke();
  ctx.strokeStyle = hexWithAlpha(COLORS.actual, 235);
  ctx.lineWidth = 4;
  ctx.shadowBlur = 0;
  ctx.stroke();
  ctx.restore();

  quest.triggers
    .filter((event) => event.aligned_sec >= windowStart && event.aligned_sec <= windowEnd)
    .forEach((event) => {
      const x = xAt(event.aligned_sec);
      const y = routeY + questOffsetAt(quest, event.aligned_sec) * routeScale;
      ctx.strokeStyle = hexWithAlpha(COLORS.trigger, 235);
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(x, y, event.category === "explore" ? 15 : 11, 0, Math.PI * 2);
      ctx.stroke();
    });

  quest.gestures
    .filter((event) => event.aligned_sec >= windowStart && event.aligned_sec <= windowEnd)
    .forEach((event) => {
      const x = xAt(event.aligned_sec);
      const y = routeY + questOffsetAt(quest, event.aligned_sec) * routeScale;
      ctx.strokeStyle = hexWithAlpha(COLORS.gesture, 210);
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x, y - 12);
      ctx.lineTo(x, y + 12);
      ctx.stroke();
    });

  const avatarX = xAt(detailPlayhead);
  const avatarY = routeY + questOffsetAt(quest, detailPlayhead) * routeScale;
  const tangentBefore = max(windowStart, detailPlayhead - 0.12);
  const tangentAfter = min(windowEnd, detailPlayhead + 0.12);
  const tangentX = xAt(tangentAfter) - xAt(tangentBefore);
  const tangentY = (
    questOffsetAt(quest, tangentAfter) - questOffsetAt(quest, tangentBefore)
  ) * routeScale;
  drawDetailAvatarMarker(ctx, avatarX, avatarY, Math.atan2(tangentY, tangentX));
}

function drawDetailAvatarMarker(ctx, x, y, angle) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  ctx.fillStyle = hexWithAlpha(COLORS.actual, 24);
  ctx.beginPath();
  ctx.ellipse(0, 0, 38, 27, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = hexWithAlpha(COLORS.actual, 46);
  ctx.beginPath();
  ctx.ellipse(0, 0, 25, 18, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.shadowColor = COLORS.actual;
  ctx.shadowBlur = 16;
  ctx.fillStyle = hexWithAlpha(COLORS.background, 225);
  ctx.strokeStyle = COLORS.bright;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(17, 0);
  ctx.lineTo(-3, -9);
  ctx.lineTo(-12, 0);
  ctx.lineTo(-3, 9);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.shadowBlur = 0;
  ctx.strokeStyle = hexWithAlpha(COLORS.actual, 235);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-13, 0);
  ctx.lineTo(-24, 0);
  ctx.stroke();
  ctx.restore();
}

function drawDetailWaypoint(ctx, x, y, label, reached) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(Math.PI / 4);
  ctx.strokeStyle = hexWithAlpha(reached ? COLORS.trigger : COLORS.text, reached ? 235 : 175);
  ctx.lineWidth = reached ? 3 : 2;
  ctx.strokeRect(-8, -8, 16, 16);
  ctx.restore();

  ctx.save();
  ctx.textAlign = "center";
  ctx.fillStyle = hexWithAlpha(COLORS.text, 185);
  ctx.font = "16px IBM Plex Mono, ui-monospace, monospace";
  ctx.fillText(label, x, y - 23);
  ctx.restore();
}

function drawDetailGantt(ctx, quest, windowStart, windowEnd, detailPlayhead, xAt, ganttTop, ganttSpacing, motionClock) {
  ACTION_ORDER.forEach((category, rowIndex) => {
    const style = ACTION_STYLES[category];
    const rowY = ganttTop + rowIndex * ganttSpacing;

    ctx.strokeStyle = hexWithAlpha(COLORS.structure, 118);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(xAt(windowStart), rowY);
    ctx.lineTo(xAt(windowEnd), rowY);
    ctx.stroke();

    drawDetailActionIcon(ctx, category, xAt(windowStart) - 253, rowY, 23, style.color, 255);
    ctx.textAlign = "right";
    ctx.fillStyle = hexWithAlpha(style.color, 245);
    ctx.font = "600 27px IBM Plex Mono, ui-monospace, monospace";
    ctx.fillText(ACTION_DISPLAY_LABELS[category], xAt(windowStart) - 32, rowY + 8);
  });
  ctx.textAlign = "left";

  quest.actions.forEach((item) => {
    const clippedStart = max(windowStart, item.clippedStart);
    const clippedEnd = min(windowEnd, item.clippedEnd);
    if (clippedEnd <= clippedStart) return;
    const rowIndex = max(0, ACTION_ORDER.indexOf(item.category));
    const rowY = ganttTop + rowIndex * ganttSpacing;
    const x1 = xAt(clippedStart) + 2;
    const x2 = xAt(clippedEnd) - 2;
    const style = ACTION_STYLES[item.category] || ACTION_STYLES.story;

    ctx.save();
    ctx.lineCap = "butt";
    ctx.strokeStyle = hexWithAlpha(style.color, 62);
    ctx.lineWidth = 41;
    ctx.shadowColor = style.color;
    ctx.shadowBlur = 24;
    ctx.beginPath();
    ctx.moveTo(x1, rowY);
    ctx.lineTo(max(x1 + 2, x2), rowY);
    ctx.stroke();
    ctx.strokeStyle = hexWithAlpha(style.color, 242);
    ctx.lineWidth = 25;
    ctx.shadowBlur = 0;
    ctx.stroke();
    ctx.restore();
  });

  const playheadX = xAt(detailPlayhead);
  ctx.strokeStyle = hexWithAlpha(COLORS.bright, 88);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(playheadX, ganttTop - 25);
  ctx.lineTo(playheadX, ganttTop + (ACTION_ORDER.length - 1) * ganttSpacing + 25);
  ctx.stroke();

  ctx.fillStyle = hexWithAlpha(COLORS.text, 185);
  ctx.font = "19px IBM Plex Mono, ui-monospace, monospace";
  ctx.fillText("DIGITAL ACTION DURATION + ROUTE + BODY RESPONSE", 90, ganttTop - 38);
}

function drawDetailGanttRipple(ctx, quest, detailPlayhead, xAt, ganttTop, ganttSpacing, motionClock) {
  const activeAction = actionAtSourceTime(quest, detailPlayhead);
  const activePosture = intervalAtSourceTime(quest.postures, detailPlayhead);
  if (!activeAction || !activePosture) return;
  const activeRowIndex = max(0, ACTION_ORDER.indexOf(activeAction.category));
  const rippleX = xAt(detailPlayhead);
  const rippleY = ganttTop + activeRowIndex * ganttSpacing;
  const energy = abs(Number(activePosture.posture_score_raw) || 0);
  const rippleScale = energy === 0 ? 1.9 : 4.7;
  drawDetailRipple(ctx, rippleX, rippleY, physicalStyleAt(quest, detailPlayhead), motionClock, quest.id + 8, rippleScale);
}

function drawDetailRipple(ctx, x, y, style, motionClock, seed, scale) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(style.tilt * 0.45);
  ctx.globalCompositeOperation = "lighter";
  ctx.shadowColor = COLORS.physical;
  ctx.shadowBlur = 48 * style.glow;

  for (let index = 0; index < 7; index += 1) {
    const phase = (motionClock * style.rate + index / 7 + seed * 0.071) % 1;
    const eased = 1 - Math.pow(1 - phase, 1.7);
    const radius = 18 + style.maxRadius * scale * eased;
    const alpha = min(255, Math.pow(1 - phase, 1.42) * style.opacity * 1.16);
    ctx.strokeStyle = hexWithAlpha(COLORS.physical, alpha);
    ctx.lineWidth = 4 + (1 - phase) * style.weight * 3;
    ctx.beginPath();
    ctx.ellipse(
      style.driftX * phase * scale * 0.35,
      style.driftY * phase * scale * 0.35,
      radius * style.scaleX,
      radius * style.scaleY * 0.62,
      0,
      0,
      Math.PI * 2,
    );
    ctx.stroke();
  }
  ctx.restore();
}

function drawDetailLegend(ctx) {
  const y = 946;
  ctx.font = "21px IBM Plex Mono, ui-monospace, monospace";
  ctx.textAlign = "left";
  ctx.fillStyle = hexWithAlpha(COLORS.bright, 215);
  ctx.fillText("PLAN", 90, y);
  ctx.strokeStyle = hexWithAlpha(COLORS.plan, 190);
  ctx.setLineDash([12, 10]);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(158, y - 5);
  ctx.lineTo(238, y - 5);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = hexWithAlpha(COLORS.text, 150);
  ctx.fillText("ACTUAL ROUTE", 280, y);
  ctx.strokeStyle = hexWithAlpha(COLORS.actual, 235);
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(450, y - 5);
  ctx.lineTo(530, y - 5);
  ctx.stroke();

  ctx.fillStyle = hexWithAlpha(COLORS.text, 150);
  ctx.fillText("BODY ENERGY", 580, y);
  ctx.strokeStyle = hexWithAlpha(COLORS.physical, 210);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(750, y - 5, 31, 14, 0, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = hexWithAlpha(COLORS.text, 150);
  ctx.fillText("HAND GESTURE", 820, y);
  ctx.strokeStyle = hexWithAlpha(COLORS.gesture, 220);
  ctx.beginPath();
  ctx.moveTo(985, y - 16);
  ctx.lineTo(985, y + 5);
  ctx.stroke();

  ctx.fillStyle = hexWithAlpha(COLORS.text, 150);
  ctx.fillText("GAME TRIGGER", 1040, y);
  ctx.strokeStyle = hexWithAlpha(COLORS.trigger, 230);
  ctx.beginPath();
  ctx.arc(1200, y - 5, 10, 0, Math.PI * 2);
  ctx.stroke();

  ctx.textAlign = "right";
  ctx.fillStyle = hexWithAlpha(COLORS.text, 190);
  ctx.font = "19px IBM Plex Mono, ui-monospace, monospace";
  ctx.fillText("BAR LENGTH = ACTION DURATION  ·  RIPPLE SIZE = BODY ENERGY", DETAIL_CANVAS_W - 90, y);
  ctx.textAlign = "left";
}

function intervalAtSourceTime(items, alignedSec) {
  return items.find((item) => alignedSec >= item.clippedStart && alignedSec < item.clippedEnd)
    || items.at(-1);
}

function mapRange(value, inputMin, inputMax, outputMin, outputMax) {
  if (inputMax === inputMin) return outputMin;
  return outputMin + ((value - inputMin) / (inputMax - inputMin)) * (outputMax - outputMin);
}

function formatDuration(seconds) {
  const minutes = floor(seconds / 60);
  const remainder = round(seconds % 60);
  return `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
}

function stableSeed(sourceRow, category, sampleIndex, questId) {
  let hash = SECOND_WORLD_SEED ^ sourceRow ^ (sampleIndex * 0x45d9f3b) ^ (questId * 0x27d4eb2d);
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

function hexWithAlpha(hex, alpha) {
  return `${hex}${round(constrain(alpha, 0, 255)).toString(16).padStart(2, "0")}`;
}

function drawVignette() {
  noFill();
  for (let index = 0; index < 18; index += 1) {
    stroke(0, 0, 0, 7);
    strokeWeight(18);
    rect(index * 4, index * 4, width - index * 8, height - index * 8);
  }
}

function drawLoadError() {
  fill(COLORS.text);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(14);
  text(loadError || "Waiting for processed data…", width / 2, height / 2);
  textAlign(LEFT, BASELINE);
}

// Read-only audit hook for local QA.
function secondWorldQuestComparisonAudit() {
  return quests.map((quest) => ({
    quest: quest.label,
    sourceStart: quest.start,
    sourceEnd: quest.end,
    duration: quest.duration,
    finalLength: quest.finalLength,
    actionIntervals: quest.actions.length,
    postureIntervals: quest.postures.length,
    nonzeroPhysicalEmitters: quest.physicalEmitters.length,
    detourDuration: quest.detourDuration,
    detourShare: quest.detourDuration / quest.duration,
    gestures: quest.gestures.length,
    triggers: quest.triggers.length,
    overviewState: "complete",
    detailPlayheadSec: activeDetailQuestIndex === quest.id - 1 ? detailPlayheadSec : null,
  }));
}

window.secondWorldQuestComparisonAudit = secondWorldQuestComparisonAudit;
