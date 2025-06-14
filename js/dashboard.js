import { auth, db } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { collection, addDoc, query, where, orderBy, getDocs, Timestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const form = document.getElementById("capsuleForm");
const toggleBtn = document.getElementById("toggleFormBtn");
const imageInput = document.getElementById("imageInput");
const capsuleList = document.getElementById("capsuleList");

let base64Image = "";

toggleBtn.addEventListener("click", () => form.classList.toggle("hidden"));

imageInput.addEventListener("change", e => {
  const f = e.target.files[0];
  if (!f) return;
  const reader = new FileReader();
  reader.onload = () => {
    base64Image = reader.result.length < 1000000 ? reader.result : "";
    if (!base64Image) alert("Image too large!");
  };
  reader.readAsDataURL(f);
});

onAuthStateChanged(auth, user => {
  if (!user) return (window.location = "login.html");
  loadCapsules(user.uid);

  form.onsubmit = async e => {
    e.preventDefault();
    const title = form.title.value.trim(),
          msg = form.message.value.trim(),
          unlockValue = form.unlockDate.value;

    if (!title || !msg || !unlockValue) return alert("Fill all required fields.");

    try {
      await addDoc(collection(db, "capsules"), {
        userId: user.uid,
        title, message: msg,
        unlockDate: Timestamp.fromDate(new Date(unlockValue)),
        createdAt: Timestamp.now(),
        image: base64Image,
      });
      form.reset(); base64Image = ""; loadCapsules(user.uid);
    } catch (err) {
      console.error("Save Error:", err);
      alert("Save failed: " + err.message);
    }
  };

  document.getElementById("logoutBtn").onclick = async () => {
    await signOut(auth);
    window.location = "login.html";
  };
});

async function loadCapsules(uid) {
  capsuleList.innerHTML = "";
  const now = Timestamp.now();

  const q = query(
    collection(db, "capsules"),
    where("userId", "==", uid),
    where("unlockDate", "<=", now),
    orderBy("unlockDate", "desc")
  );

  try {
    const snap = await getDocs(q);
    if (snap.empty) return capsuleList.innerHTML = "<p>No unlocked capsules</p>";

    snap.forEach(doc => {
      const d = doc.data();
      const dateStr = d.unlockDate.toDate().toLocaleString();
      const div = document.createElement("div");
      div.className = "capsule-card";
      div.innerHTML = `
        <h3>${d.title}</h3>
        <p>${d.message}</p>
        ${d.image ? `<img src="${d.image}" class="capsule-image"/>` : ""}
        <small>Unlocked on: ${dateStr}</small>
      `;
      capsuleList.appendChild(div);
    });
  } catch (err) {
    console.error("Load Error:", err);
    capsuleList.innerHTML = `<p>Error loading capsules: ${err.message}</p>`;
  }
}

//dark mode

// DARK MODE TOGGLE
const darkToggle = document.getElementById("darkModeToggle");
darkToggle.onclick = () => {
  document.body.classList.toggle("dark-mode");
  // Save user preference
  localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
};

// Set dark mode if user had enabled it
window.onload = () => {
  const storedTheme = localStorage.getItem("theme");
  if (storedTheme === "dark") {
    document.body.classList.add("dark-mode");
  }
};

