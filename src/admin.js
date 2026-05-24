import { auth, db } from './firebase.js';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

const loginSection = document.getElementById('login-section');
const dashboardSection = document.getElementById('dashboard-section');
const loginBtn = document.getElementById('login-btn');
const saveBtn = document.getElementById('save-btn');
const userInfo = document.getElementById('user-info');
const toast = document.getElementById('toast');

// Inputs
const inputName = document.getElementById('input-name');
const inputHeadline = document.getElementById('input-headline');
const inputAbout = document.getElementById('input-about');
const inputLocation = document.getElementById('input-location');
const inputExperience = document.getElementById('input-experience');
const inputResume = document.getElementById('input-resume');

let currentUser = null;

if (!auth || !db) {
  loginSection.innerHTML = '<p style="color: red;">Firebase is not configured yet! Please update src/firebase.js with your project config.</p>';
} else {
  // Listen for auth state
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      if (user.email !== 'axvrma@gmail.com') {
        alert("Unauthorized email address! You are not axvrma@gmail.com.");
        await signOut(auth);
        return;
      }
      currentUser = user;
      loginSection.classList.remove('active-section');
      dashboardSection.classList.add('active-section');
      userInfo.innerHTML = `Logged in as <b>${user.email}</b>.`;
      
      // Load current data
      loadData();
    } else {
      currentUser = null;
      loginSection.classList.add('active-section');
      dashboardSection.classList.remove('active-section');
    }
  });

  loginBtn.addEventListener('click', () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).catch(error => {
      console.error("Login failed:", error);
      alert("Login failed. See console.");
    });
  });

  saveBtn.addEventListener('click', async () => {
    saveBtn.innerText = "Saving...";
    try {
      const docRef = doc(db, "portfolio", "content");
      await setDoc(docRef, {
        name: inputName.value,
        headline: inputHeadline.value,
        about: inputAbout.value,
        location: inputLocation.value,
        experience: inputExperience.value,
        resumeLink: inputResume.value
      }, { merge: true });
      
      showToast("Live Website Updated!");
    } catch (e) {
      console.error(e);
      alert("Failed to save. Did you deploy the correct Firestore Security Rules?");
    }
    saveBtn.innerText = "Save Changes to Live Site";
  });
}

async function loadData() {
  try {
    const docRef = doc(db, "portfolio", "content");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      if(data.name) inputName.value = data.name;
      if(data.headline) inputHeadline.value = data.headline;
      if(data.about) inputAbout.value = data.about;
      if(data.location) inputLocation.value = data.location;
      if(data.experience) inputExperience.value = data.experience;
      if(data.resumeLink) inputResume.value = data.resumeLink;
    }
  } catch (e) {
    console.error("Failed to load data", e);
  }
}

function showToast(msg) {
  toast.innerText = msg;
  toast.style.display = 'block';
  setTimeout(() => {
    toast.style.display = 'none';
  }, 3000);
}
