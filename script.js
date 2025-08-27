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
