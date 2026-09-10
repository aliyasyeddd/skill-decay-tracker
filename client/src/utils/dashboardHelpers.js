// Dashboard-specific helpers — kept separate from utils/constants.js
// since these are helper logic/data, not app-wide config values like
// BACKEND_URL.

// Rustiness (0–1) → a color band, matching the app's pastel palette.
export const rustinessStyle = (rustiness) => {
  if (rustiness < 0.33) {
    return {
      badge: "bg-[#bde0fe]/50 text-[#2b5f8a]",
      bar: "bg-[#bde0fe]",
      label: "Fresh",
    };
  }
  if (rustiness < 0.66) {
    return {
      badge: "bg-[#ffd6a5]/55 text-[#9c5a1e]",
      bar: "bg-[#ffd6a5]",
      label: "Getting rusty",
    };
  }
  return {
    badge: "bg-[#ffb6c1]/35 text-[#a13f5c]",
    bar: "bg-[#ffb6c1]",
    label: "Needs review",
  };
};

