import {
  defaultShouldDehydrateQuery,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactNode, useState } from "react";

export const QueryProvider = ({ children }: { children: ReactNode }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 0,
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
            refetchOnMount: true,
            staleTime: 10000,
            gcTime: 5000000,
            networkMode: "online",
          },
          dehydrate: {
            // serialize promises as well
            // per default, only successful Queries are included,
            // this includes pending Queries as well
            shouldDehydrateQuery: (query) =>
              defaultShouldDehydrateQuery(query) ||
              query.state.status === "pending",
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
