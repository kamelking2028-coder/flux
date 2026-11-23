
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

  if (!promptInput || !styleInput || !generateBtn ||
      !loader || !loadingText || !img || !downloadBtn) {
    console.error("Flux : éléments HTML introuvables.");
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
      setTimeout(() => status.style.display = "none", 1500);
    }
  }

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
        const blob = await new Promise(resolve =>
          canvas.toBlob(resolve, "image/png")
        );
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob })
        ]);
        showStatus("copyImageStatus");
      } catch (error) {
        console.error(error);
        alert("Impossible de copier l'image.");
      }
    });
  }

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
        alert("Impossible de copier le prompt.");
      }
    });
  }

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
    generateBtn.disabled = true;
    img.classList.remove("visible", "vibration");
    img.removeAttribute("src");

    if (currentObjectUrl) {
      URL.revokeObjectURL(currentObjectUrl);
      currentObjectUrl = null;
    }

    const styles = {
      animal: ", realistic animal photography, natural lighting, neutral background, no humans, high detail",
      humain: ", realistic human portrait, natural facial features, high detail",
      cyberpunk: ", cyberpunk style, futuristic city, neon lighting",
      cartoon: ", cartoon style, colorful, clean outlines",
      anime: ", anime style, detailed illustration, vibrant colors",
      realiste: ", realistic photo, natural lighting, high detail, no distortion"
    };

    const finalPrompt =
      `${userPrompt}, ultra detailed, high quality${styles[style] || ""}`;

    try {
      const response = await fetch(
        "https://mute-cell-5c4e.kamelking2028.workers.dev/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: finalPrompt })
        }
      );

      if (!response.ok) {
        let message = `Erreur HTTP ${response.status}`;
        try {
          const data = await response.json();
          message = data.error || message;
        } catch (_) {}
        throw new Error(message);
      }

      const blob = await response.blob();
      if (!blob.size || !blob.type.startsWith("image/")) {
        throw new Error("La réponse ne contient pas une image valide.");
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
        loadingText.textContent = "⚠️ L'image reçue n'a pas pu être affichée.";
        downloadBtn.style.display = "none";
      };

      img.src = currentObjectUrl;

    } catch (error) {
      console.error("Erreur API de génération :", error);
      hideLoader();
      loadingText.style.display = "block";
      loadingText.textContent = "⚠️ " + (error.message || "Connexion à l'API impossible.");
      downloadBtn.style.display = "none";
    } finally {
      generateBtn.disabled = false;
    }
  });

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
