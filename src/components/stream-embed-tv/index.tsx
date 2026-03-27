import { useLockBodyScroll, useMountEffect } from "crustack/hooks";
import { FaForward, FaXmark } from "react-icons/fa6";
import { useCallback, useMemo, useRef, useState } from "react";
import { Portal } from "../portal";
import {
  StreamEmbedPlayer,
  type PlayerState,
} from "../stream-embed/stream-embed-player";
import {
  buildTvStreamCandidates,
  type VixsrcItalianCatalog,
} from "@/lib/stream-embed-candidates";

type Props = {
  tvId: number;
  season: number;
  episode: number;
  seriesTitle: string;
  episodeTitle: string;
  onClose: () => void;
  preferItalian: boolean;
  episodeInItalianCatalog: VixsrcItalianCatalog;
};

function buildHint(preferItalian: boolean, state: PlayerState | null): string {
  if (!preferItalian) return "Riproduzione in lingua originale / inglese.";
  if (!state) return "Ricerca della migliore sorgente in italiano…";
  if (state.failed) return "Nessun provider disponibile — riprova più tardi.";
  if (state.loaded)
    return `In riproduzione da ${state.label} (${state.index + 1}/${state.total}).`;
  return `Provo ${state.label} (${state.index + 1}/${state.total})…`;
}

export default function StreamEmbedTv({
  tvId,
  season,
  episode,
  seriesTitle,
  episodeTitle,
  onClose,
  preferItalian,
  episodeInItalianCatalog,
}: Props) {
  const { lock } = useLockBodyScroll();
  useMountEffect(lock);

  const candidates = useMemo(
    () =>
      buildTvStreamCandidates({
        tvId,
        season,
        episode,
        preferItalian,
        episodeInItalianCatalog,
      }),
    [tvId, season, episode, preferItalian, episodeInItalianCatalog],
  );

  const [playerState, setPlayerState] = useState<PlayerState | null>(null);
  const advanceRef = useRef<(() => void) | null>(null);

  const handleStateChange = useCallback((s: PlayerState) => {
    setPlayerState(s);
  }, []);

  const hint = buildHint(preferItalian, playerState);
  const showNextBtn = playerState?.hasNext && !playerState.failed;

  return (
    <Portal>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 md:p-6">
        <button
          type="button"
          className="absolute inset-0 bg-mv-void/85 backdrop-blur-sm"
          onClick={onClose}
          aria-label="Chiudi riproduzione"
        />
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-[max(1rem,env(safe-area-inset-top))] z-[202] flex h-11 w-11 items-center justify-center rounded-full border border-mv-gold/35 bg-mv-deep/95 text-mv-cream shadow-lg transition-colors hover:border-mv-gold/55 hover:bg-mv-panel hover:text-mv-gold-bright md:right-6 md:top-6"
          aria-label="Chiudi"
        >
          <FaXmark size={20} />
        </button>
        <div
          className="relative z-[201] flex w-full max-w-[min(96vw,1200px)] flex-col gap-2 shadow-marquee"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-end justify-between gap-3 px-1">
            <div className="min-w-0 space-y-0.5">
              <p className="truncate font-sans text-xs text-mv-cream-muted md:text-sm">
                {seriesTitle}
              </p>
              <p className="font-sans text-[0.65rem] uppercase tracking-wider text-mv-gold/60">
                S{season} E{episode} · {episodeTitle}
              </p>
              <p className="font-sans text-[0.65rem] uppercase tracking-wider text-mv-gold/60">
                {hint}
              </p>
            </div>
            {showNextBtn ? (
              <button
                type="button"
                onClick={() => advanceRef.current?.()}
                className="flex shrink-0 items-center gap-1.5 rounded-full border border-mv-gold/30 bg-mv-deep/80 px-3 py-1 font-sans text-[0.6rem] uppercase tracking-wider text-mv-cream-muted transition-colors hover:border-mv-gold/60 hover:text-mv-gold-bright"
              >
                Prova prossimo
                <FaForward size={9} />
              </button>
            ) : null}
          </div>
          <div className="relative aspect-video w-full max-h-[min(85dvh,720px)] min-h-[200px] overflow-hidden rounded-lg border border-mv-gold/25 bg-black shadow-gold-glow">
            <StreamEmbedPlayer
              candidates={candidates}
              iframeTitle={`${seriesTitle} S${season}E${episode}`}
              onStateChange={handleStateChange}
              advanceRef={advanceRef}
            />
          </div>
        </div>
      </div>
    </Portal>
  );
}
