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

// --- GÉNÉRER IMAGE ---
document.getElementById("btn").addEventListener("click", () => {
  const prompt = document.getElementById("prompt").value.trim();
  const loader = document.getElementById("loader");
  const loadingText = document.getElementById("loadingText");
  const img = document.getElementById("result");
  const style = document.getElementById("style").value;

  if (!prompt) {
    alert("Écris une description avant de générer !");
    return;
  }

  loader.style.display = "block";
  loadingText.style.display = "block";
  img.crossOrigin = "anonymous";
  img.src = "";
  img.classList.remove("visible");

  const url = "https://image.pollinations.ai/prompt/" + encodeURIComponent(style + " " + prompt);

  img.onload = () => {
    loader.style.display = "none";
    loadingText.style.display = "none";
    img.classList.add("visible");
    // 👉 Le bouton devient cliquable et visible ici
    document.getElementById("downloadBtn").style.display = "inline-block";
  };

  img.onerror = () => {
    loader.style.display = "none";
    loadingText.style.display = "none";
    alert("Erreur de génération. Réessaie !");
    // 👉 On cache le bouton si l’image n’a pas été générée
    document.getElementById("downloadBtn").style.display = "none";
  };

  img.src = url;
});
// --- TÉLÉCHARGER L’IMAGE ---
document.getElementById("downloadBtn").addEventListener("click", () => {
  const img = document.getElementById("result");

  if (!img.src) {
    alert("Aucune image à télécharger !");
    return;
  }

  // Créer un lien temporaire pour le téléchargement
  const link = document.createElement("a");
  link.href = img.src;
  link.download = "flux_image.png"; // nom du fichier
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});




