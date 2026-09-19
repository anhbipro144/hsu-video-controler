const DEFAULT_SETTINGS = Object.freeze({
  enabled: true,
  seekSeconds: 5,
});

let settings = { ...DEFAULT_SETTINGS };
let statusElement;
let statusTimer;
let controlsVideo;
let controlsWereEnabled;
let controlsTimer;
let timelineElement;
let timelineProgress;
let timelineThumb;
let timelineTimer;

void loadSettings();

chrome.storage.sync.onChanged.addListener((changes, areaName) => {
  if (areaName !== "sync") return;

  if (changes.enabled) settings.enabled = changes.enabled.newValue;
  if (changes.seekSeconds) settings.seekSeconds = changes.seekSeconds.newValue;
});

document.addEventListener("keydown", handleKeydown, true);

async function loadSettings() {
  const storedSettings = await chrome.storage.sync.get(DEFAULT_SETTINGS);
  settings = {
    enabled: Boolean(storedSettings.enabled),
    seekSeconds: normalizeSeekSeconds(storedSettings.seekSeconds),
  };
}

function handleKeydown(event) {
  const isSeekKey = event.key === "ArrowLeft" || event.key === "ArrowRight";
  const isPauseKey =
    event.code === "Space" || event.key === " " || event.key === "Spacebar";

  if (
    !settings.enabled ||
    event.defaultPrevented ||
    event.repeat ||
    event.altKey ||
    event.ctrlKey ||
    event.metaKey ||
    event.shiftKey ||
    (!isSeekKey && !isPauseKey) ||
    isTextEditingTarget(event.target)
  ) {
    return;
  }

  const video = getBestVideo();
  if (!video) return;

  if (isPauseKey) {
    const willPause = !video.paused;

    if (willPause) {
      video.pause();
    } else {
      void video.play();
    }

    event.preventDefault();
    event.stopImmediatePropagation();
    showPlaybackStatus(willPause);
    return;
  }

  if (!Number.isFinite(video.duration)) return;

  const direction = event.key === "ArrowRight" ? 1 : -1;
  const targetTime = clamp(
    video.currentTime + direction * settings.seekSeconds,
    0,
    video.duration,
  );

  if (targetTime === video.currentTime) return;

  video.currentTime = targetTime;
  showVideoControls(video);
  showTimeline(video, targetTime, video.duration);
  event.preventDefault();
  event.stopImmediatePropagation();
  showSeekStatus(direction, targetTime, video.duration);
}

function showVideoControls(video) {
  clearTimeout(controlsTimer);

  if (controlsVideo !== video) {
    controlsVideo = video;
    controlsWereEnabled = video.controls;
  }

  video.controls = true;
  controlsTimer = setTimeout(() => {
    if (controlsVideo !== video) return;

    if (!controlsWereEnabled) video.controls = false;
    controlsVideo = null;
    controlsWereEnabled = null;
  }, 2000);
}

function showTimeline(video, currentTime, duration) {
  if (!timelineElement) {
    timelineElement = document.createElement("div");
    timelineProgress = document.createElement("div");
    timelineThumb = document.createElement("div");
    timelineElement.style.cssText = [
      "position:fixed",
      "z-index:2147483647",
      "height:4px",
      "border-radius:4px",
      "background:rgba(255,255,255,.35)",
      "pointer-events:none",
      "box-shadow:0 0 2px rgba(0,0,0,.8)",
    ].join(";");
    timelineProgress.style.cssText = [
      "position:absolute",
      "top:0",
      "left:0",
      "height:100%",
      "border-radius:4px",
      "background:#1479e9",
    ].join(";");
    timelineThumb.style.cssText = [
      "position:absolute",
      "top:50%",
      "width:10px",
      "height:10px",
      "border-radius:50%",
      "background:#fff",
      "transform:translate(-5px,-50%)",
    ].join(";");
    timelineElement.append(timelineProgress, timelineThumb);
    (document.body || document.documentElement).append(timelineElement);
  }

  const rect = video.getBoundingClientRect();
  const percentage = clamp((currentTime / duration) * 100, 0, 100);
  timelineElement.style.left = `${rect.left}px`;
  timelineElement.style.top = `${Math.max(0, rect.bottom - 14)}px`;
  timelineElement.style.width = `${rect.width}px`;
  timelineElement.style.display = "block";
  timelineProgress.style.width = `${percentage}%`;
  timelineThumb.style.left = `${percentage}%`;

  clearTimeout(timelineTimer);
  timelineTimer = setTimeout(() => {
    timelineElement.style.display = "none";
  }, 2000);
}

function isTextEditingTarget(target) {
  if (!(target instanceof Element)) return false;

  return Boolean(
    target.closest(
      'input:not([type="range"]), textarea, select, [contenteditable="true"], [role="textbox"]',
    ),
  );
}

function getBestVideo() {
  const candidates = [...document.querySelectorAll("video")].filter(
    (video) =>
      video.readyState > HTMLMediaElement.HAVE_NOTHING &&
      isVisible(video),
  );

  if (candidates.length === 0) return null;

  return candidates.sort((left, right) => scoreVideo(right) - scoreVideo(left))[0];
}

function isVisible(element) {
  const style = window.getComputedStyle(element);
  const rect = element.getBoundingClientRect();

  return (
    style.display !== "none" &&
    style.visibility !== "hidden" &&
    Number.parseFloat(style.opacity) !== 0 &&
    rect.width > 0 &&
    rect.height > 0
  );
}

function scoreVideo(video) {
  const rect = video.getBoundingClientRect();
  const isPlaying = !video.paused && !video.ended;

  return (isPlaying ? 1_000_000_000 : 0) + rect.width * rect.height;
}

function clamp(value, minimum, maximum) {
  return Math.min(Math.max(value, minimum), maximum);
}

function showSeekStatus(direction, currentTime, duration) {
  clearTimeout(statusTimer);

  if (!statusElement) {
    statusElement = document.createElement("div");
    statusElement.setAttribute("aria-live", "polite");
    statusElement.style.cssText = [
      "position:fixed",
      "z-index:2147483647",
      "top:16px",
      "left:50%",
      "transform:translateX(-50%)",
      "padding:8px 12px",
      "border-radius:6px",
      "background:rgba(0, 0, 0, 0.78)",
      "color:#fff",
      "font:600 14px/1.2 system-ui, sans-serif",
      "pointer-events:none",
      "opacity:0",
      "transition:opacity 120ms ease",
    ].join(";");
    document.documentElement.append(statusElement);
  }

  const sign = direction > 0 ? "+" : "-";
  statusElement.textContent = `${sign}${settings.seekSeconds}s  ${formatTime(currentTime)} / ${formatTime(duration)}`;
  statusElement.style.opacity = "1";

  statusTimer = setTimeout(() => {
    statusElement.style.opacity = "0";
  }, 900);
}

function showPlaybackStatus(isPaused) {
  clearTimeout(statusTimer);

  if (!statusElement) {
    statusElement = document.createElement("div");
    statusElement.setAttribute("aria-live", "polite");
    statusElement.style.cssText = [
      "position:fixed",
      "z-index:2147483647",
      "top:16px",
      "left:50%",
      "transform:translateX(-50%)",
      "padding:8px 12px",
      "border-radius:6px",
      "background:rgba(0, 0, 0, 0.78)",
      "color:#fff",
      "font:600 14px/1.2 system-ui, sans-serif",
      "pointer-events:none",
      "opacity:0",
      "transition:opacity 120ms ease",
    ].join(";");
    document.documentElement.append(statusElement);
  }

  statusElement.textContent = isPaused ? "Paused" : "Playing";
  statusElement.style.opacity = "1";

  statusTimer = setTimeout(() => {
    statusElement.style.opacity = "0";
  }, 900);
}

function formatTime(timeInSeconds) {
  const totalSeconds = Math.floor(timeInSeconds);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function normalizeSeekSeconds(value) {
  const numericValue = Number(value);
  return [5, 10, 15, 30].includes(numericValue)
    ? numericValue
    : DEFAULT_SETTINGS.seekSeconds;
}
