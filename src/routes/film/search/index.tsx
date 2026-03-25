import { createFileRoute } from "@tanstack/react-router";
import SearchPageClient from "./-page-client";
import SearchFilmPagelayout from "./-layout";

export const Route = createFileRoute("/film/search/")({
  component: SearchFilmPage,
  validateSearch: (search: { query?: string }) => {
    return {
      query: search.query ?? "",
    };
  },
});

function SearchFilmPage() {
  const { query } = Route.useSearch();

  return (
    <SearchFilmPagelayout>
      <SearchPageClient query={query} />
    </SearchFilmPagelayout>
  );
}
