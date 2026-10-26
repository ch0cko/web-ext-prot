let lastCountedAt = 0;

function getEditor(target) {
  if (!(target instanceof Element)) return null;

  return target.closest(
    'textarea, [contenteditable="true"], [role="textbox"]'
  );
}

function editorHasText(editor) {
  return Boolean(
    (editor.value ?? editor.innerText ?? editor.textContent ?? "").trim()
  );
}

async function countPrompt() {
  const now = Date.now();
  if (now - lastCountedAt < 800) return;
  lastCountedAt = now;

  const { prompt_count = 0 } =
    await chrome.storage.local.get("prompt_count");

  await chrome.storage.local.set({
    prompt_count: prompt_count + 1
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" || event.shiftKey || event.isComposing) return;

  const editor = getEditor(event.target);
  if (editor && editorHasText(editor)) {
    countPrompt();
  }
}, true);

document.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) return;

  const button = event.target.closest("button");
  if (!button || button.disabled) return;

  const description = [
    button.getAttribute("aria-label"),
    button.getAttribute("data-testid"),
    button.innerText,
    button.title
  ].filter(Boolean).join(" ").toLowerCase();

  if (!/(send|submit)/.test(description)) return;

  const editor = document.querySelector(
    'textarea, [contenteditable="true"], [role="textbox"]'
  );

  if (editor && editorHasText(editor)) {
    countPrompt();
  }
}, true);
