// REMOVE or COMMENT THIS:
const revealDate = new Date("2025-08-27T12:10:00").getTime();

// Update countdown every second
const countdownElement = document.getElementById("countdown");
setInterval(() => {
    const now = new Date().getTime();
    const distance = revealDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    countdownElement.innerText = `${days}d ${hours}h ${minutes}m ${seconds}s`;
}, 1000);
// Get reference to Firestore document
const pollRef = window.db.collection("polls").doc("genderReveal");

// Handle vote button clicks
async function castVote(vote) {
  const snap = await pollRef.get();
  if (!snap.exists) {
    await pollRef.set({ boy: 0, girl: 0 });
  }
  const data = snap.data();
  if (vote === "boy") {
    await pollRef.update({ boy: data.boy + 1 });
  } else {
    await pollRef.update({ girl: data.girl + 1 });
  }
}

// Button listeners
document.getElementById("boy-btn").addEventListener("click", () => castVote("boy"));
document.getElementById("girl-btn").addEventListener("click", () => castVote("girl"));

// Live update results
pollRef.onSnapshot((docSnap) => {
  if (docSnap.exists) {
    const data = docSnap.data();
    const total = data.boy + data.girl;
    if (total > 0) {
      const boyPercent = Math.round((data.boy / total) * 100);
      const girlPercent = Math.round((data.girl / total) * 100);
      document.getElementById("poll-results").innerText =
        `Boy 💙: ${boyPercent}% | Girl 💖: ${girlPercent}%`;
      document.getElementById("poll-results").style.display = "block";
    }
  }
});


