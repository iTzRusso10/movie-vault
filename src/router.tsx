import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import {
  defaultShouldDehydrateQuery,
  dehydrate,
  hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

export function getRouter() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 0,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: true,
        staleTime: 30000,
        gcTime: 100000,
      },
      dehydrate: {
        // serialize promises as well
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
      },
    },
  });
  return createRouter({
    routeTree,
    defaultPendingComponent: () => null, // no Suspense if omitted
    defaultPreloadStaleTime: 0, // https://tanstack.com/router/latest/docs/framework/react/guide/data-loading#passing-all-loader-events-to-an-external-cache
    defaultStaleTime: 0, // https://tanstack.com/router/latest/docs/framework/react/guide/data-loading#passing-all-loader-events-to-an-external-cache
    scrollRestoration: true,
    scrollToTopSelectors: ["main", "main>*", "#root"],
    defaultPreload: "intent",
    context: { queryClient },
    dehydrate() {
      return { queryClientState: dehydrate(queryClient) };
    },
    hydrate(dehydrated: any) {
      hydrate(queryClient, dehydrated.queryClientState);
    },
    Wrap({ children }) {
      return (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );
    },
  });
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
