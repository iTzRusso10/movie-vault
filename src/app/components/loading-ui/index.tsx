import { cn } from "crustack/utils";
import Image from "next/image";

type Props = {
  delayMs?: number;
  className?: string;
};

export function LoadingUI({ delayMs = 500, className }: Props) {
  return (
    <div
      className={cn(
        className,
        "flex items-center h-screen max-h-[90vh] gap-2 justify-center motion-preset-pulse"
      )}
    >
      <Image
        priority
        src={"/movie-app-logo.jpeg"}
        width={100}
        height={100}
        className="h-8 w-8"
        alt="MovieVault Logo"
      />
      <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
        MovieVault
      </span>
    </div>
  );
}
