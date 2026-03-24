import { ReactNode } from "react";

export default function SearchFilmPagelayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen w-full pt-4 pb-12 md:pt-6">{children}</div>
  );
}
