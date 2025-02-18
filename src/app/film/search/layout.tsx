import { ReactNode } from "react";

export default function SearchFilmPagelayout({
  children,
}: {
  children: ReactNode;
}) {
  return <div className="w-full h-full pt-20">{children}</div>;
}
