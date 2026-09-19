// ==UserScript==
// @name         Hoa Sen Video Arrow Keys
// @namespace    https://dttt.hoasen.edu.vn/
// @version      1.0.0
// @description  Seek Hoa Sen LMS videos with the left and right arrow keys.
// @match        https://dttt.hoasen.edu.vn/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

const SEEK_SECONDS = 5;

let statusElement;
let statusTimer;

document.addEventListener("keydown", handleKeydown, true);

function handleKeydown(event) {
  const isSeekKey = event.key === "ArrowLeft" || event.key === "ArrowRight";
  const isPauseKey =
    event.code === "Space" || event.key === " " || event.key === "Spacebar";

  if (
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
    video.currentTime + direction * SEEK_SECONDS,
    0,
    video.duration,
  );

  if (targetTime === video.currentTime) return;

  video.currentTime = targetTime;
  event.preventDefault();
  event.stopImmediatePropagation();
  showSeekStatus(direction, targetTime, video.duration);
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
  statusElement.textContent = `${sign}${SEEK_SECONDS}s  ${formatTime(currentTime)} / ${formatTime(duration)}`;
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
