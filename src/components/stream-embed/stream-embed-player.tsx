import type { StreamEmbedCandidate } from "@/lib/stream-embed-candidates";
import { useCallback, useEffect, useRef, useState } from "react";

const SLOW_HINT_MS = 2_000;

export type PlayerState = {
  index: number;
  label: string;
  total: number;
  loaded: boolean;
  failed: boolean;
  hasNext: boolean;
};

type Props = {
  candidates: StreamEmbedCandidate[];
  iframeTitle: string;
  onStateChange?: (state: PlayerState) => void;
  /** Ref che il parent può usare per avanzare manualmente al prossimo provider. */
  advanceRef?: React.MutableRefObject<(() => void) | null>;
};

export function StreamEmbedPlayer({
  candidates,
  iframeTitle,
  onStateChange,
  advanceRef,
}: Props) {
  const [index, setIndex] = useState(0);
  const [showSlowHint, setShowSlowHint] = useState(false);
  const [hardFailed, setHardFailed] = useState(false);

  const loadConfirmedRef = useRef(false);
  const slowTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const advanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = useCallback(() => {
    if (slowTimerRef.current) {
      clearTimeout(slowTimerRef.current);
      slowTimerRef.current = null;
    }
    if (advanceTimerRef.current) {
      clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
  }, []);

  const current = candidates[index];

  const emitState = useCallback(
    (overrides?: Partial<Pick<PlayerState, "loaded" | "failed">>) => {
      onStateChange?.({
        index,
        label: current?.label ?? "",
        total: candidates.length,
        loaded: overrides?.loaded ?? loadConfirmedRef.current,
        failed: overrides?.failed ?? false,
        hasNext: index < candidates.length - 1,
      });
    },
    [onStateChange, index, current?.label, candidates.length],
  );

  useEffect(() => {
    if (!current || candidates.length === 0) return;

    loadConfirmedRef.current = false;
    setHardFailed(false);
    setShowSlowHint(false);
    clearTimers();
    emitState({ loaded: false, failed: false });

    slowTimerRef.current = setTimeout(() => {
      if (!loadConfirmedRef.current) setShowSlowHint(true);
    }, SLOW_HINT_MS);

    advanceTimerRef.current = setTimeout(() => {
      if (loadConfirmedRef.current) return;
      if (index < candidates.length - 1) {
        setIndex((i) => i + 1);
      } else {
        setHardFailed(true);
        emitState({ failed: true });
      }
    }, current.settleMs);

    return clearTimers;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, current, candidates.length, clearTimers]);

  const handleLoad = useCallback(() => {
    loadConfirmedRef.current = true;
    clearTimers();
    setShowSlowHint(false);
    emitState({ loaded: true });
  }, [clearTimers, emitState]);

  const advanceManually = useCallback(() => {
    if (index < candidates.length - 1) {
      loadConfirmedRef.current = false;
      clearTimers();
      setIndex((i) => i + 1);
    }
  }, [index, candidates.length, clearTimers]);

  useEffect(() => {
    if (advanceRef) advanceRef.current = advanceManually;
  }, [advanceRef, advanceManually]);

  if (!current || candidates.length === 0) {
    return (
      <div className="flex h-full min-h-[200px] items-center justify-center bg-black font-sans text-sm text-mv-cream-muted">
        Nessuna sorgente disponibile.
      </div>
    );
  }

  return (
    <div className="relative h-full min-h-[200px] w-full bg-black">
      {showSlowHint && !hardFailed ? (
        <div
          className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-black/40 font-sans text-xs uppercase tracking-wider text-mv-cream-muted"
          aria-live="polite"
        >
          Connessione…
        </div>
      ) : null}

      {hardFailed ? (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/90 px-4 text-center font-sans text-sm text-mv-cream-muted">
          Impossibile caricare il player. Riprova più tardi o chiudi e riapri.
        </div>
      ) : null}

      <iframe
        key={`${index}-${current.url}`}
        title={iframeTitle}
        className="absolute inset-0 h-full w-full opacity-100"
        src={current.url}
        sandbox={
          current.sandboxed
            ? "allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-presentation"
            : undefined
        }
        allowFullScreen
        allow="fullscreen; autoplay; encrypted-media; picture-in-picture"
        loading="eager"
        referrerPolicy="no-referrer-when-downgrade"
        onLoad={handleLoad}
      />
    </div>
  );
}
