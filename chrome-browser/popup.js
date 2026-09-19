const DEFAULT_SETTINGS = Object.freeze({
  enabled: true,
  seekSeconds: 5,
});

const enabledInput = document.querySelector("#enabled");
const seekSecondsSelect = document.querySelector("#seek-seconds");
const status = document.querySelector("#status");

void initialize();

enabledInput.addEventListener("change", saveSettings);
seekSecondsSelect.addEventListener("change", saveSettings);

async function initialize() {
  const settings = await chrome.storage.sync.get(DEFAULT_SETTINGS);
  enabledInput.checked = Boolean(settings.enabled);
  seekSecondsSelect.value = String(settings.seekSeconds);
}

async function saveSettings() {
  await chrome.storage.sync.set({
    enabled: enabledInput.checked,
    seekSeconds: Number(seekSecondsSelect.value),
  });

  status.textContent = "Saved";
  window.setTimeout(() => {
    status.textContent = "";
  }, 1200);
}
