let showPhoto;

export function openPhoto(link) {
  showPhoto ??= createPhotoViewer();
  showPhoto(link);
}

function createPhotoViewer() {
  const dialog = document.createElement("dialog");
  dialog.className = "photo-dialog";
  dialog.setAttribute("aria-label", "Expanded photograph");

  const actions = document.createElement("div");
  actions.className = "photo-dialog-actions";
  const close = document.createElement("button");
  close.type = "button";
  close.textContent = "Close image";
  close.className = "button button-outline";
  const original = document.createElement("a");
  original.textContent = "Open full-size image";
  original.className = "text-link";
  original.target = "_blank";
  original.rel = "noopener noreferrer";
  actions.append(close, original);

  const picture = document.createElement("img");
  const caption = document.createElement("figcaption");
  const figure = document.createElement("figure");
  figure.append(picture, caption);
  dialog.append(actions, figure);

  let trigger;
  close.addEventListener("click", () => dialog.close());
  dialog.addEventListener("close", () => trigger?.focus());

  return (link) => {
    trigger = link;
    const thumbnail = link.querySelector("img");
    picture.alt = thumbnail.alt;
    picture.width = Number(thumbnail.getAttribute("width"));
    picture.height = Number(thumbnail.getAttribute("height"));
    picture.src = link.href;
    original.href = link.href;
    const sourceCaption = link.closest("figure")?.querySelector("figcaption");
    caption.textContent = (sourceCaption?.querySelector("p") ?? sourceCaption)?.textContent.trim() || "";
    caption.hidden = !caption.textContent;
    if (!dialog.isConnected) document.body.append(dialog);
    dialog.showModal();
    close.focus();
  };
}
