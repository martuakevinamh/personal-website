"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

type CrossfadeImageProps = {
  src: string;
  alt: string;
  /** The photo likely to be shown next — fetched in advance so the crossfade starts instantly. */
  nextSrc?: string;
  className?: string;
  style?: CSSProperties;
  sizes?: string;
  priority?: boolean;
  /** Crossfade duration in ms. Defaults to 1200. */
  duration?: number;
  /** object-position — applied per-layer (baked in when the layer is pushed). */
  objectPosition?: string;
  /** CSS transform string, e.g. "scale(1.1)" — applied per-layer. */
  imageTransform?: string;
};

type Layer = {
  src: string;
  id: number;
  loaded: boolean;
  objectPosition: string;
  imageTransform: string;
};

/**
 * Crossfades between photos: when `src` changes, the previous image stays
 * fully visible until the new one has loaded, then they crossfade.
 *
 * Uses the Web Animations API for the fade — immune to React 18 batching
 * races that break CSS transitions in Edge/Opera GX.
 */
export default function CrossfadeImage(props: CrossfadeImageProps) {
  const {
    src,
    nextSrc,
    duration = 1200,
    objectPosition = "center",
    imageTransform = "none",
  } = props;

  const [layers, setLayers] = useState<Layer[]>([
    { src, id: 0, loaded: false, objectPosition, imageTransform },
  ]);

  // Track latest pos/transform via refs so the effect only depends on `src`.
  // Updating them in useLayoutEffect is safe (runs after DOM commit, not during render).
  const posRef = useRef(objectPosition);
  const transformRef = useRef(imageTransform);
  useLayoutEffect(() => {
    posRef.current = objectPosition;
    transformRef.current = imageTransform;
  }, [objectPosition, imageTransform]);

  // When src changes, push a new layer on top
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setLayers((prev) => {
        if (prev[prev.length - 1].src === src) return prev;
        return [
          ...prev,
          {
            src,
            id: prev[prev.length - 1].id + 1,
            loaded: false,
            objectPosition: posRef.current,
            imageTransform: transformRef.current,
          },
        ];
      });
    });
    return () => cancelAnimationFrame(raf);
  }, [src]);

  // Drop the oldest layer once a newer one is fully visible
  useEffect(() => {
    if (layers.length <= 1) return;
    if (!layers.slice(1).some((l) => l.loaded)) return;
    const oldestId = layers[0].id;
    const t = setTimeout(() => {
      setLayers((prev) => (prev[0]?.id === oldestId ? prev.slice(1) : prev));
    }, duration + 100);
    return () => clearTimeout(t);
  }, [layers, duration]);

  // The topmost loaded layer is "shown"; everything below fades out
  let topLoaded = -1;
  for (let i = layers.length - 1; i >= 0; i--) {
    if (layers[i].loaded) { topLoaded = i; break; }
  }

  const handleLoaded = (id: number) => {
    setLayers((prev) =>
      prev.map((l) => (l.id === id && !l.loaded ? { ...l, loaded: true } : l))
    );
  };

  // Preload the upcoming photo
  const topSrc = layers[layers.length - 1].src;
  const preloadSrc =
    nextSrc && nextSrc !== topSrc && !layers.some((l) => l.src === nextSrc)
      ? nextSrc
      : null;

  return (
    <>
      {layers.map((layer, i) => (
        <LayerImage
          key={layer.id}
          {...props}
          src={layer.src}
          objectPosition={layer.objectPosition}
          imageTransform={layer.imageTransform}
          shown={i === topLoaded}
          onLoaded={() => handleLoaded(layer.id)}
        />
      ))}
      {preloadSrc && (
        <Image
          key={`preload-${preloadSrc}`}
          src={preloadSrc}
          alt=""
          fill
          sizes={props.sizes}
          aria-hidden
          className="pointer-events-none opacity-0"
        />
      )}
    </>
  );
}

function LayerImage({
  src,
  alt,
  shown,
  onLoaded,
  className,
  style,
  sizes,
  priority,
  duration = 1200,
  objectPosition = "center",
  imageTransform = "none",
}: CrossfadeImageProps & { shown: boolean; onLoaded: () => void }) {
  const divRef = useRef<HTMLDivElement>(null);
  // Track previous value to skip no-op calls and handle initial mount correctly
  const prevShownRef = useRef<boolean | undefined>(undefined);

  useEffect(() => {
    const el = divRef.current;
    if (!el) return;

    const prev = prevShownRef.current;
    prevShownRef.current = shown;

    if (prev === shown) return; // No change

    // Cancel any in-progress animation before starting a new one
    el.getAnimations().forEach((a) => a.cancel());

    if (prev === undefined) {
      // Initial mount: only animate if already shown (rare), else stay at 0
      if (shown) {
        el.animate(
          [{ opacity: 0 }, { opacity: 1 }],
          { duration, easing: "ease-in-out", fill: "forwards" }
        );
      }
      return;
    }

    // Subsequent shown changes — WAAPI always starts from the explicit keyframe
    // value, so React batching cannot cause a "missing opacity:0 paint" race.
    el.animate(
      shown
        ? [{ opacity: 0 }, { opacity: 1 }]
        : [{ opacity: 1 }, { opacity: 0 }],
      { duration, easing: "ease-in-out", fill: "forwards" }
    );
  }, [shown, duration]);

  return (
    <div
      ref={divRef}
      style={{ position: "absolute", inset: 0, opacity: 0, willChange: "opacity" }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        aria-hidden={!shown}
        className={`object-cover ${className ?? ""}`}
        style={{ ...style, objectPosition, transform: imageTransform }}
        onLoad={onLoaded}
      />
    </div>
  );
}
