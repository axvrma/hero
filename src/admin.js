import "./style.css";
import { auth, db } from "./firebase.js";
import {
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
  getIdTokenResult,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
const status = document.querySelector("#admin-status");
const login = document.querySelector("#login-section");
const dashboard = document.querySelector("#dashboard-section");
const save = document.querySelector("#save-btn");
const fields = {
  name: "name",
  headline: "headline",
  about: "about",
  location: "location",
  experience: "experience",
  resumeLink: "resume",
};
let authorized = false;
onAuthStateChanged(auth, async (user) => {
  authorized = false;
  save.disabled = true;
  dashboard.hidden = true;
  login.hidden = false;
  if (!user) return;
  try {
    const token = await getIdTokenResult(user, true);
    if (token.claims.portfolio_admin !== true) {
      status.textContent =
        "This account does not have portfolio administrator access.";
      await signOut(auth);
      return;
    }
    login.hidden = true;
    dashboard.hidden = false;
    document.querySelector("#user-info").textContent =
      `Signed in as ${user.email || "administrator"}.`;
    const snapshot = await getDoc(doc(db, "portfolio", "content"));
    const values = snapshot.exists() ? snapshot.data() : {};
    for (const [key, id] of Object.entries(fields))
      document.querySelector(`#input-${id}`).value =
        typeof values[key] === "string" ? values[key] : "";
    authorized = true;
    save.disabled = false;
    status.textContent =
      "Legacy record loaded. Public content is managed in Notion.";
  } catch {
    status.textContent =
      "Could not load the legacy record. Verify the deployed Firestore rules and account claim.";
  }
});
document.querySelector("#login-btn").addEventListener("click", async () => {
  status.textContent = "Opening Google sign-in…";
  try {
    await signInWithPopup(auth, new GoogleAuthProvider());
  } catch {
    status.textContent = "Sign-in did not complete. You can try again.";
  }
});
document
  .querySelector("#logout-btn")
  .addEventListener("click", () => signOut(auth));
document
  .querySelector("#legacy-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!authorized) return;
    save.disabled = true;
    const values = Object.fromEntries(
      Object.entries(fields).map(([key, id]) => [
        key,
        document.querySelector(`#input-${id}`).value.trim(),
      ]),
    );
    try {
      if (values.resumeLink && !values.resumeLink.startsWith("https://"))
        throw Error();
      await setDoc(doc(db, "portfolio", "content"), values);
      status.textContent =
        "Legacy record saved. This does not publish the public website.";
    } catch {
      status.textContent =
        "Save failed. Check connectivity, deployed rules, and authorization.";
    }
    save.disabled = false;
  });
