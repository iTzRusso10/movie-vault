import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import SearchPageClient from "./page-client";

export default function SearchFilmPage() {
  const queryClient = new QueryClient();
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SearchPageClient />
    </HydrationBoundary>
  );
}
