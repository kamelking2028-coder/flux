console.log("api.js chargé !");

// --- COPIER IMAGE EN BASE64 ---
document.getElementById("copyImageBtn").addEventListener("click", () => {
  const img = document.getElementById("result");

  if (!img.src) {
    alert("Aucune image à copier !");
    return; 
  }

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;

  ctx.drawImage(img, 0, 0);

  const base64 = canvas.toDataURL("image/png");

  navigator.clipboard.writeText(base64).then(() => {
    const status = document.getElementById("copyImageStatus");
    status.style.display = "inline";

    setTimeout(() => {
      status.style.display = "none";
    }, 1500);
  });
});

// --- COPIER PROMPT ---
document.getElementById("copyPromptBtn").addEventListener("click", () => {
  const prompt = document.getElementById("prompt").value;

  if (!prompt.trim()) {
    alert("Le prompt est vide !");
    return;
  }

  navigator.clipboard.writeText(prompt).then(() => {
    const status = document.getElementById("copyStatus");
    status.style.display = "inline";

    setTimeout(() => {
      status.style.display = "none";
    }, 1500);
  });
});

// --- GÉNÉRER IMAGE AVEC IA 1 + IA 2 ---
document.getElementById("btn").addEventListener("click", async () => {

  const userPrompt = document.getElementById("prompt").value.trim();
  const style = document.getElementById("style").value;
  const loader = document.getElementById("loader");
  const loadingText = document.getElementById("loadingText");
  const img = document.getElementById("result");

  if (!userPrompt) {
    alert("Écris une description avant de générer !");
    return;
  }

  loader.style.display = "block";
  loadingText.style.display = "block";
  img.src = "";
  img.classList.remove("visible");

  try {

    /* ---------------------------------------------------------
       IA 1 — Optimisation automatique du prompt
    --------------------------------------------------------- */
 

    // IA 1 simulée : reformule le prompt localement
    const optimized = { optimized: userPrompt + ", ultra detailed, high quality, neon lighting" };
    const finalPrompt = optimized.optimized;

    /* ---------------------------------------------------------
       IA 2 — Génération de l’image
    --------------------------------------------------------- */
    // Choix du style supplémentaire selon le moteur
    
let extra = "";
// --- Style Animal pur ---
if (style === "animal") {
  extra = ", animal, realistic animal photo, natural lighting, neutral background, no human, no hybrid, no neon, no glow, no cyberpunk, no distortion, high detail, professional wildlife photography";
} else if (style === "humain") {
  extra = ", human only, normal face, realistic portrait, no zombie, no distortion, no hybrid";
} else if (style === "cyberpunk") {
  extra = ", cyberpunk style, neon lighting, futuristic background, no zombie";
} else if (style === "cartoon") {
  extra = ", cartoon style, colorful, outlined";
} else if (style === "anime") {
  extra = ", anime style, detailed, vibrant";
} else if (style === "realiste") {
  extra = ", realistic photo, natural lighting, studio portrait, no neon, no glitch";
}

    // Construction finale de l’URL
const finalUrl = "https://image.pollinations.ai/prompt/" + encodeURIComponent(finalPrompt + extra);

// Vérification et génération
fetch(finalUrl)
  .then(response => {
    if (!response.ok) {
      throw new Error("Erreur serveur Pollinations (" + response.status + ")");
    }
    return response.blob();
  })
  .then(blob => {
    img.src = URL.createObjectURL(blob);
  })
  .catch(error => {
    console.error(error);
    loadingText.textContent = "⚠️ Erreur : impossible de générer l'image.";
  });

// Gestion du chargement
img.onload = () => {
  loader.style.display = "none";
  loadingText.style.display = "none";
  img.classList.add("visible", "vibration");
  document.getElementById("downloadBtn").style.display = "inline-block";
};

img.onerror = () => {
  loader.style.display = "none";
  loadingText.style.display = "none";
  alert("Erreur de génération. Réessaie !");
  document.getElementById("downloadBtn").style.display = "none";
};

img.crossOrigin = "anonymous";

// --- TÉLÉCHARGER L’IMAGE ---
document.getElementById("downloadBtn").addEventListener("click", () => {
  const img = document.getElementById("result");

  if (!img.src) {
    alert("Aucune image à télécharger !");
    return;
  }

  const link = document.createElement("a");
  link.href = img.src;
  link.download = "flux_image.png";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

console.log("api.js chargé !");


