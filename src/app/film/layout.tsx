import { ReactNode } from "react";

export default function FilmPageLayout({ children }: { children: ReactNode }) {
  return <div className="w-full h-full">{children}</div>;
}
