"use client";

import { useEffect } from "react";

interface KeyboardShortcuts {
  onSpace: () => void;
  onR: () => void;
}

export function useKeyboard({ onSpace, onR }: KeyboardShortcuts) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Don't capture if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (e.code) {
        case "Space":
          e.preventDefault();
          onSpace();
          break;
        case "KeyR":
          if (!e.metaKey && !e.ctrlKey) {
            e.preventDefault();
            onR();
          }
          break;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onSpace, onR]);
}
