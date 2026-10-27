console.log("api.js chargé !");

function initFlux() {
  const promptInput = document.getElementById("prompt");
  const styleInput = document.getElementById("style");
  const btn = document.getElementById("btn");
  const loader = document.getElementById("loader");
  const loadingText = document.getElementById("loadingText");
  const img = document.getElementById("result");
  const downloadBtn = document.getElementById("downloadBtn");
  const copyImageBtn = document.getElementById("copyImageBtn");
  const copyPromptBtn = document.getElementById("copyPromptBtn");

  if (!promptInput || !btn || !loader || !img || !downloadBtn) {
    console.error("Flux : élément HTML obligatoire introuvable.");
    return;
  }

  const API_URL = "https://ia-image-2big.onrender.com/api/image";
  let currentObjectUrl = null;

  function showStatus(id) {
    const status = document.getElementById(id);
    if (!status) return;

    status.style.display = "inline";
    setTimeout(() => {
      status.style.display = "none";
    }, 1500);
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

        canvas.getContext("2d").drawImage(img, 0, 0);

        await navigator.clipboard.writeText(canvas.toDataURL("image/png"));
        showStatus("copyImageStatus");
      } catch (error) {
        console.error(error);
        alert("Impossible de copier l'image.");
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
        console.error(error);
        alert("Impossible de copier le prompt.");
      }
    });
  }

  // GÉNÉRER L'IMAGE
  btn.addEventListener("click", async () => {
    const prompt = promptInput.value.trim();

    if (!prompt) {
      alert("Écris une description avant de générer !");
      return;
    }

    if (btn.disabled) return;

    const styles = {
      animal: ", realistic animal photography, natural lighting, no humans",
      humain: ", realistic human portrait, natural facial features",
      cyberpunk: ", cyberpunk style, futuristic background, neon lighting",
      cartoon: ", cartoon style, colorful, clean outlines",
      anime: ", anime style, detailed illustration, vibrant colors",
      realiste: ", realistic photo, natural lighting, high detail"
    };

    const style = styleInput ? styleInput.value : "realiste";
    const finalPrompt =
      prompt + (styles[style] || "") + ", high quality, detailed";

    btn.disabled = true;
    loader.style.display = "block";

    if (loadingText) {
      loadingText.style.display = "block";
      loadingText.textContent = "🎨 Génération de l'image en cours…";
    }

    downloadBtn.style.display = "none";
    img.classList.remove("visible", "vibration");
    img.removeAttribute("src");

    if (currentObjectUrl) {
      URL.revokeObjectURL(currentObjectUrl);
      currentObjectUrl = null;
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ prompt: finalPrompt })
      });

      if (!response.ok) {
        let message = `Erreur HTTP ${response.status}`;

        try {
          const data = await response.json();
          message = data.error || message;
        } catch (_) {}

        throw new Error(message);
      }

      const blob = await response.blob();

      if (!blob.type.startsWith("image/") || !blob.size) {
        throw new Error("Le serveur n'a pas renvoyé une image valide.");
      }

      currentObjectUrl = URL.createObjectURL(blob);
      img.src = currentObjectUrl;

      await img.decode();

      img.classList.add("visible", "vibration");
      downloadBtn.style.display = "inline-block";

    } catch (error) {
      console.error("Erreur API Flux :", error);

      if (loadingText) {
        loadingText.textContent = "⚠️ " + error.message;
        loadingText.style.display = "block";
      } else {
        alert("Erreur API : " + error.message);
      }

      if (currentObjectUrl) {
        URL.revokeObjectURL(currentObjectUrl);
        currentObjectUrl = null;
      }

      img.removeAttribute("src");
      downloadBtn.style.display = "none";

    } finally {
      loader.style.display = "none";
      btn.disabled = false;
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


