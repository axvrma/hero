export function enablePhotos() {
  const dialog = document.createElement("dialog");
  dialog.className = "photo-dialog";
  dialog.setAttribute("aria-label", "Expanded photograph");

  const button = document.createElement("button");
  button.type = "button";
  button.textContent = "Close image";
  button.className = "button button-outline";
  const picture = document.createElement("img");
  dialog.append(button, picture);
  document.body.append(dialog);

  let trigger;
  button.addEventListener("click", () => dialog.close());
  dialog.addEventListener("close", () => trigger?.focus());

  for (const link of document.querySelectorAll("[data-photo]")) {
    link.addEventListener("click", (event) => {
      if (event.button || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      trigger = link;
      picture.src = link.href;
      picture.alt = link.querySelector("img").alt;
      dialog.showModal();
      button.focus();
    });
  }
}
