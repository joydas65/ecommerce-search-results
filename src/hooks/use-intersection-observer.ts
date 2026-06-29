"use client";

import { useEffect, useRef, useState } from "react";

interface UseIntersectionObserverOptions {
  enabled: boolean;
  onIntersect: () => void;
  rootMargin?: string;
  threshold?: number;
}

export function useIntersectionObserver({
  enabled,
  onIntersect,
  rootMargin = "240px 0px",
  threshold = 0,
}: UseIntersectionObserverOptions) {
  const [target, setTarget] = useState<Element | null>(null);
  const onIntersectRef = useRef(onIntersect);

  useEffect(() => {
    onIntersectRef.current = onIntersect;
  }, [onIntersect]);

  useEffect(() => {
    if (!enabled || !target || typeof IntersectionObserver === "undefined") {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          onIntersectRef.current();
        }
      },
      { rootMargin, threshold },
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [enabled, rootMargin, target, threshold]);

  return setTarget;
}
