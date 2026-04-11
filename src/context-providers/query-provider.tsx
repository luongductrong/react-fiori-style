import * as React from 'react';
import { IS_DEV } from '@/app-env';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const Devtools = IS_DEV
  ? React.lazy(() =>
      import('@tanstack/react-query-devtools').then((mod) => ({
        default: mod.ReactQueryDevtools,
      })),
    )
  : () => null;

export function QueryProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: 0,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <React.Suspense fallback={null}>
        <Devtools />
      </React.Suspense>
    </QueryClientProvider>
  );
}
