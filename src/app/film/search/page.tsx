import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import SearchPageClient from "./page-client";

export default async function SearchFilmPage({
  searchParams,
}: {
  searchParams: Promise<{ query: string }>;
}) {
  const queryClient = new QueryClient();
  const query = (await searchParams).query;
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SearchPageClient query={query} />
    </HydrationBoundary>
  );
}
