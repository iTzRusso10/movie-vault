"use client";

import { HydrationBoundary, QueryClient } from "@tanstack/react-query";
import SearchPageClient from "./page-client";

export default function SearchFilmPage() {
  const queryClient = new QueryClient();
  return (
    <HydrationBoundary queryClient={queryClient}>
      <SearchPageClient />
    </HydrationBoundary>
  );
}
