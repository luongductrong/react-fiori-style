import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const Devtools = import.meta.env.DEV
  ? React.lazy(() =>
      import("@tanstack/react-query-devtools").then((mod) => ({
        default: mod.ReactQueryDevtools,
      })),
    )
  : () => null;

export function QueryProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [queryClient] = React.useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <React.Suspense fallback={null}>
        <Devtools />
      </React.Suspense>
    </QueryClientProvider>
  );
}
