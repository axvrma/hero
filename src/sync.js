import "./style.css";
const form = document.querySelector("#sync-form");
const status = document.querySelector("#sync-status");
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const button = form.querySelector("button");
  const input = form.querySelector("input");
  button.disabled = true;
  status.textContent = "Requesting rebuild…";
  try {
    const response = await fetch("/api/sync-notion-background", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-secret": input.value,
      },
      body: "{}",
    });
    if (response.status === 202)
      status.textContent =
        "Build requested. Check the Netlify dashboard for progress and the published result.";
    else if (response.status === 401)
      status.textContent =
        "Authorization failed. Verify your administrator secret.";
    else if (response.status === 403)
      status.textContent =
        "This origin is not authorized. Check the ADMIN_ORIGIN configuration.";
    else
      status.textContent =
        "The build request was not accepted. Verify the server configuration in Netlify.";
  } catch {
    status.textContent =
      "Could not reach the build service. Try again when the connection is restored.";
  }
  input.value = "";
  button.disabled = false;
});
