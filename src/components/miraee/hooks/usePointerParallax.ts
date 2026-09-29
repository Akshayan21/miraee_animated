"use client";

import { RefObject, useEffect } from "react";
import { gsap } from "@/lib/motion/gsap";

export function usePointerParallax(stageRef: RefObject<HTMLElement | null>, enabled: boolean) {
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || !enabled || !window.matchMedia("(pointer: fine)").matches) return;
    const avatar = stage.querySelector<HTMLElement>('[data-gsap="mirai-layer"]');
    if (!avatar) return;
    const avatarX = gsap.quickTo(avatar, "--pointer-x", { duration: 0.8, ease: "power3.out" });
    const avatarY = gsap.quickTo(avatar, "--pointer-y", { duration: 0.8, ease: "power3.out" });
    const move = (event: PointerEvent) => {
      const x = event.clientX / window.innerWidth - 0.5;
      const y = event.clientY / window.innerHeight - 0.5;
      avatarX(x * 8); avatarY(y * 8);
    };
    stage.addEventListener("pointermove", move);
    return () => stage.removeEventListener("pointermove", move);
  }, [stageRef, enabled]);
}
