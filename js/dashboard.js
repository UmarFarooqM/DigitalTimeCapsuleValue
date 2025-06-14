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


















// import { auth, db } from './firebase-config.js';
// import {
//   onAuthStateChanged,
//   signOut
// } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';

// import {
//   collection,
//   addDoc,
//   query,
//   where,
//   orderBy,
//   getDocs,
//   Timestamp
// } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

// const form = document.getElementById("capsuleForm");
// const toggleFormBtn = document.getElementById("toggleFormBtn");
// const capsuleList = document.getElementById("capsuleList");
// const imageInput = document.getElementById("imageInput");

// let imageBase64 = "";

// toggleFormBtn.addEventListener("click", () => {
//   form.classList.toggle("hidden");
// });

// imageInput.addEventListener("change", async (e) => {
//   const file = e.target.files[0];
//   if (!file) return;

//   const reader = new FileReader();
//   reader.onload = () => {
//     const base64 = reader.result;
//     if (base64.length <= 900000) {
//       imageBase64 = base64;
//     } else {
//       alert("Image too large! Choose a smaller image.");
//       imageInput.value = "";
//       imageBase64 = "";
//     }
//   };
//   reader.readAsDataURL(file);
// });

// onAuthStateChanged(auth, async (user) => {
//   if (!user) {
//     window.location.href = "login.html";
//     return;
//   }

//   loadCapsules(user.uid);

//   form.addEventListener("submit", async (e) => {
//     e.preventDefault();

//     const title = document.getElementById("title").value.trim();
//     const message = document.getElementById("message").value.trim();
//     const unlockDate = new Date(document.getElementById("unlockDate").value);
//     const recipientEmail = document.getElementById("recipientEmail").value.trim();
//     const secretMessage = document.getElementById("secretMessage").value.trim();
//     const theme = document.getElementById("theme").value;

//     if (!title || !message || !unlockDate) {
//       alert("Please fill in the required fields.");
//       return;
//     }

//     try {
//       await addDoc(collection(db, "capsules"), {
//         userId: user.uid,
//         title,
//         message,
//         unlockDate: Timestamp.fromDate(unlockDate),
//         createdAt: Timestamp.now(),
//         recipientEmail,
//         secretMessage,
//         image: imageBase64,
//         theme
//       });

//       alert("Capsule saved!");
//       form.reset();
//       imageBase64 = "";
//       loadCapsules(user.uid);
//     } catch (err) {
//       console.error("Error saving capsule:", err);
//       alert("Error saving capsule.");
//     }
//   });
// });

// async function loadCapsules(userId) {
//   capsuleList.innerHTML = "";
//   const now = Timestamp.now();
//   const q = query(
//     collection(db, "capsules"),
//     where("userId", "==", userId),
//     where("unlockDate", "<=", now),
//     orderBy("unlockDate", "desc")
//   );

//   const querySnapshot = await getDocs(q);

//   if (querySnapshot.empty) {
//     capsuleList.innerHTML = "<p>No unlocked capsules yet.</p>";
//     return;
//   }

//   querySnapshot.forEach((doc) => {
//     const data = doc.data();
//     const card = document.createElement("div");
//     card.className = "capsule-card";
//     card.innerHTML = `
//       <h3>${data.title}</h3>
//       <p>${data.message}</p>
//       ${data.image ? `<img src="${data.image}" alt="Capsule Image" />` : ""}
//       <small>Unlocked on: ${data.unlockDate.toDate().toLocaleString()}</small>
//     `;
//     capsuleList.appendChild(card);
//   });
// }
