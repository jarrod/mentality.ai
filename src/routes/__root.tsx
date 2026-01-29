import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'

import { ClerkProvider } from '@clerk/tanstack-react-start'
import {
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query'

import appCss from '../styles.css?url'

// Create a client
const queryClient = new QueryClient()

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'TanStack Start Starter',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),

  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <ClerkProvider>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </ClerkProvider>
        <Scripts />
      </body>
    </html>
  )
}
