console.log("api.js chargé !");

function initFlux() {
  const promptInput = document.getElementById("prompt");
  const styleInput = document.getElementById("style");
  const generateBtn = document.getElementById("btn");
  const loader = document.getElementById("loader");
  const loadingText = document.getElementById("loadingText");
  const img = document.getElementById("result");
  const downloadBtn = document.getElementById("downloadBtn");
  const copyImageBtn = document.getElementById("copyImageBtn");
  const copyPromptBtn = document.getElementById("copyPromptBtn");

  if (
    !promptInput ||
    !styleInput ||
    !generateBtn ||
    !loader ||
    !loadingText ||
    !img ||
    !downloadBtn
  ) {
    console.error("Flux : un ou plusieurs éléments HTML sont introuvables.");
    return;
  }

  let currentObjectUrl = null;

  function hideLoader() {
    loader.style.display = "none";
  }

  function showStatus(id) {
    const status = document.getElementById(id);

    if (status) {
      status.style.display = "inline";
      setTimeout(() => {
        status.style.display = "none";
      }, 1500);
    }
  }

  // COPIER L'IMAGE EN BASE64
  if (copyImageBtn) {
    copyImageBtn.addEventListener("click", async () => {
      if (!img.complete || !img.naturalWidth) {
        alert("Aucune image à copier !");
        return;
      }

      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        const base64 = canvas.toDataURL("image/png");
        await navigator.clipboard.writeText(base64);

        showStatus("copyImageStatus");
      } catch (error) {
        console.error("Erreur de copie de l'image :", error);
        alert("Impossible de copier l'image. Vérifie les autorisations du navigateur.");
      }
    });
  }

  // COPIER LE PROMPT
  if (copyPromptBtn) {
    copyPromptBtn.addEventListener("click", async () => {
      const prompt = promptInput.value.trim();

      if (!prompt) {
        alert("Le prompt est vide !");
        return;
      }

      try {
        await navigator.clipboard.writeText(prompt);
        showStatus("copyStatus");
      } catch (error) {
        console.error("Erreur de copie du prompt :", error);
        alert("Impossible de copier le prompt.");
      }
    });
  }

          // GÉNÉRER L'IMAGE
   
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("generate");
  const input = document.getElementById("prompt");
  const img = document.getElementById("result");
  const loader = document.getElementById("loader");

  if (!btn || !input || !img || !loader) {
    console.error("Flux IA : élément HTML introuvable.");
    return;
  }

  btn.addEventListener("click", async () => {
    const prompt = input.value.trim();

    if (!prompt) {
      alert("Écris une description avant de générer !");
      return;
    }

    img.removeAttribute("src");
    loader.style.display = "block";
    btn.disabled = true;

    
try {
  const response = await fetch("https://ia-image.site.je/api.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    },
    body: new URLSearchParams({
      prompt: prompt,
      model: "openjourney"
    })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `Erreur HTTP ${response.status}`);
  }

  if (data.error) {
    throw new Error(data.error);
  }

  if (!data.image_base64) {
    throw new Error("Aucune image reçue du serveur.");
  }

  img.src =
    `data:${data.mime_type || "image/png"};base64,` +
    data.image_base64;

} catch (err) {
  console.error("Erreur API :", err);
  alert("Erreur API : " + err.message);

} finally {
  loader.style.display = "none";
  btn.disabled = false;
}



  // TÉLÉCHARGER L'IMAGE
  downloadBtn.addEventListener("click", () => {
    if (!currentObjectUrl || !img.naturalWidth) {
      alert("Aucune image à télécharger !");
      return;
    }

    const link = document.createElement("a");
    link.href = currentObjectUrl;
    link.download = "flux_image.png";

    document.body.appendChild(link);
    link.click();
    link.remove();
  });

  console.log("Flux est initialisé.");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initFlux, { once: true });
} else {
  initFlux();
}

