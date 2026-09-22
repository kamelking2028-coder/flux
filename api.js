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
    // IA 1 simulée : juste reformule le prompt
      const optimized = { optimized: userPrompt + ", ultra detailed, high quality, neon lighting" };
   
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: userPrompt })
    }).then(r => r.json());

    const finalPrompt = optimized.optimized || userPrompt;


    /* ---------------------------------------------------------
       IA 2 — Génération de l’image
    --------------------------------------------------------- */
    const url = "https://image.pollinations.ai/prompt/" + encodeURIComponent(style + " " + finalPrompt);

    img.onload = () => {
      loader.style.display = "none";
      loadingText.style.display = "none";
      img.classList.add("visible");
      document.getElementById("downloadBtn").style.display = "inline-block";
    };

    img.onerror = () => {
      loader.style.display = "none";
      loadingText.style.display = "none";
      alert("Erreur de génération. Réessaie !");
      document.getElementById("downloadBtn").style.display = "none";
    };

    img.crossOrigin = "anonymous";
    img.src = url;

  } catch (error) {
    console.error("Erreur FluxIA :", error);
    alert("Erreur lors de la génération.");
    loader.style.display = "none";
    loadingText.style.display = "none";
  }
});

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


