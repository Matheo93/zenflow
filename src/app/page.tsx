import { MeditationTimer } from "@/components/meditation/meditation-timer";
import { AmbientOrbs } from "@/components/meditation/ambient-orbs";

export default function Home() {
  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center safe-bottom overflow-hidden">
      <AmbientOrbs />

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 flex items-center justify-center pt-8 sm:pt-12 pb-4">
        <h1 className="text-xs sm:text-sm font-medium tracking-[0.3em] uppercase text-muted">
          ZenFlow
        </h1>
      </header>

      {/* Timer — centered on screen */}
      <MeditationTimer />

      {/* Footer hint */}
      <footer className="absolute bottom-0 left-0 right-0 flex items-center justify-center pb-6 sm:pb-8 pt-4">
        <p className="text-[10px] sm:text-xs text-muted/50">
          2 min · Breathe · Reset · Flow
        </p>
      </footer>
    </main>
  );
}
