import { ReactNode } from "react";

export default function SearchFilmPagelayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen w-full pt-24 md:pt-28 pb-12">{children}</div>
  );
}
