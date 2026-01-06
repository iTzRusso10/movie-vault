import { createFileRoute } from "@tanstack/react-router";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import SearchPageClient from "./-page-client";
import SearchFilmPagelayout from "./layout";

export const Route = createFileRoute("/film/search/")({
  component: SearchFilmPage,
  validateSearch: (search: { query?: string }) => {
    return {
      query: search.query ?? "",
    };
  },
});

function SearchFilmPage() {
  const queryClient = new QueryClient();
  const { query } = Route.useSearch();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SearchFilmPagelayout>
        <SearchPageClient query={query} />
      </SearchFilmPagelayout>
    </HydrationBoundary>
  );
}
