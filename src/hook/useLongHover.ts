import { useRef, useState } from "react";
import {
  useIsHydrated,
  useEventHandler,
  useEventListener,
} from "crustack/hooks";
import { noop } from "crustack/utils";

export const useOnLongHover = (
  listener: (() => void) | undefined,
  delayMs = 60
) => {
  useIsHydrated(); // renrenders on mount, ensure the ref has been assigned
  const [target, setTarget] = useState<HTMLElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const callback = useEventHandler(listener ?? noop);

  function schedule() {
    timeoutRef.current = setTimeout(() => callback(), delayMs);
  }

  function cancel() {
    clearTimeout(timeoutRef.current);
  }

  useEventListener(target, "mouseenter", schedule);
  useEventListener(target, "focus", cancel);
  useEventListener(target, "mouseleave", cancel);
  useEventListener(target, "mousedown", cancel);

  return setTarget;
};
