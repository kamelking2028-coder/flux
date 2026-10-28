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
  generateBtn.addEventListener("click", async () => {
    const userPrompt = promptInput.value.trim();
    const style = styleInput.value;

    if (!userPrompt) {
      alert("Écris une description avant de générer !");
      return;
    }

    loader.style.display = "block";
    loadingText.style.display = "block";
    loadingText.textContent = "🎨 Génération de l'image en cours…";
    downloadBtn.style.display = "none";

    img.classList.remove("visible", "vibration");
    img.removeAttribute("src");

    if (currentObjectUrl) {
      URL.revokeObjectURL(currentObjectUrl);
      currentObjectUrl = null;
    }

    const styles = {
      animal:
        ", realistic animal photography, natural lighting, neutral background, no humans, high detail",

      humain:
        ", realistic human portrait, natural facial features, high detail",

      cyberpunk:
        ", cyberpunk style, futuristic city, neon lighting",

      cartoon:
        ", cartoon style, colorful, clean outlines",

      anime:
        ", anime style, detailed illustration, vibrant colors",

      realiste:
        ", realistic photo, natural lighting, high detail, no distortion"
    };

    const extra = styles[style] || "";
    const finalPrompt =
      `${userPrompt}, ultra detailed, high quality${extra}`;

    const finalUrl =
      "https://image.pollinations.ai/prompt/" +
      encodeURIComponent(finalPrompt) +
      "?model=flux&nologo=true";

    try {
      console.log("Demande de génération :", finalUrl);

      const response = await fetch(finalUrl);

      if (!response.ok) {
        throw new Error(
          `Pollinations a répondu avec le statut HTTP ${response.status}.`
        );
      }

      const blob = await response.blob();

      if (!blob.size) {
        throw new Error("Le serveur a renvoyé une réponse vide.");
      }

      if (blob.type && !blob.type.startsWith("image/")) {
        throw new Error(
          `Réponse inattendue du serveur : ${blob.type}.`
        );
      }

      currentObjectUrl = URL.createObjectURL(blob);

      img.onload = () => {
        hideLoader();
        loadingText.style.display = "none";
        img.classList.add("visible", "vibration");
        downloadBtn.style.display = "inline-block";
      };

      img.onerror = () => {
        hideLoader();
        loadingText.style.display = "block";
        loadingText.textContent =
          "⚠️ L'image reçue n'a pas pu être affichée.";
        console.error("Impossible d'afficher l'image reçue.");
        downloadBtn.style.display = "none";
      };

      img.src = currentObjectUrl;

    } catch (error) {
      console.error("Erreur API de génération :", error);

      hideLoader();
      loadingText.style.display = "block";
      loadingText.textContent =
        "⚠️ " + (error.message || "Connexion à l'API impossible.");

      downloadBtn.style.display = "none";
    }
  });

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



