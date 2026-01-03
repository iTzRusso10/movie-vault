"use client";

import { useLockBodyScroll, useMountEffect } from "crustack/hooks";
import { Portal } from "../portal";
import { useIsMobile } from "@/hook/useIsMobile";

interface Props {
  video_id: string;
  onClose: () => void;
}

export default function YoutubeEmbed({ video_id, onClose }: Props) {
  const { lock } = useLockBodyScroll();
  useMountEffect(lock);
  const isMobile = useIsMobile();
  return (
    <Portal>
      <div className="fixed inset-0 h-screen w-screen">
        <div className="w-full h-full bg-black/70" onClick={onClose} />
        <iframe
          className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
          allowFullScreen
          width={isMobile ? "95%" : "55%"}
          height={isMobile ? "30%" : "50%"}
          src={`https://www.youtube.com/embed/${video_id}`}
        />
      </div>
    </Portal>
  );
}
