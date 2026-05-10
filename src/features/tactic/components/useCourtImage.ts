"use client";

import { useEffect, useState } from "react";

const SRC = "/img/basket_court.png";

let cached: HTMLImageElement | null = null;

export function useCourtImage() {
  const [image, setImage] = useState<HTMLImageElement | null>(cached);

  useEffect(() => {
    let cancelled = false;
    if (cached) {
      setImage(cached);
      return;
    }
    const img = new window.Image();
    img.src = SRC;
    img.crossOrigin = "anonymous";

    const onReady = () => {
      if (cancelled) return;
      // n'expose l'image à Konva que si elle est réellement décodée (taille > 0)
      if (img.naturalWidth > 0 && img.naturalHeight > 0) {
        cached = img;
        setImage(img);
      }
    };

    if (typeof img.decode === "function") {
      img.decode().then(onReady).catch(() => {
        // certains navigateurs throw sur decode si pas encore prêt → fallback onload
        img.onload = onReady;
      });
    } else {
      img.onload = onReady;
    }
    img.onerror = () => {
      // image manquante → on laisse le fallback Rect prendre le relais
    };

    return () => {
      cancelled = true;
    };
  }, []);

  return image;
}
