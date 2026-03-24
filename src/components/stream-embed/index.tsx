import { useLockBodyScroll, useMountEffect } from "crustack/hooks";
import { FaXmark } from "react-icons/fa6";
import { Portal } from "../portal";
import {
  VIXSRC_MOVIE_BASE,
  VIXSRC_PREFERRED_LANG,
} from "@/routes/-const";

type Props = {
  movieId: number;
  movieTitle: string;
  onClose: () => void;
};

export default function StreamEmbed({ movieId, movieTitle, onClose }: Props) {
  const { lock } = useLockBodyScroll();
  useMountEffect(lock);
  const streamUrl = new URL(`${VIXSRC_MOVIE_BASE}/${movieId}`);
  streamUrl.searchParams.set("lang", VIXSRC_PREFERRED_LANG);
  const src = streamUrl.toString();

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
          <div className="space-y-0.5 px-1">
            <p className="truncate font-sans text-xs text-mv-cream-muted md:text-sm">
              {movieTitle}
            </p>
            <p className="font-sans text-[0.65rem] uppercase tracking-wider text-mv-gold/60">
              Lingua preferita: italiano (se il player la offre)
            </p>
          </div>
          <div className="relative aspect-video w-full max-h-[min(85dvh,720px)] min-h-[200px] overflow-hidden rounded-lg border border-mv-gold/25 bg-black shadow-gold-glow">
            <iframe
              title={`Riproduzione: ${movieTitle}`}
              className="absolute inset-0 h-full w-full"
              src={src}
              allowFullScreen
              allow="fullscreen; autoplay; encrypted-media; picture-in-picture"
              loading="eager"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </Portal>
  );
}
