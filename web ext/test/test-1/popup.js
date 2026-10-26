async function showCount() {
  const { prompt_count = 0 } =
    await chrome.storage.local.get("prompt_count");

  document.querySelector("#prompt-count").textContent = prompt_count;
}

document.addEventListener("DOMContentLoaded", showCount);

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.prompt_count) {
    document.querySelector("#prompt-count").textContent =
      changes.prompt_count.newValue ?? 0;
  }
});