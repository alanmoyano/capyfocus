import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { PostHogProvider } from 'posthog-js/react'

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {import.meta.env.PROD ? (
      <PostHogProvider
        options={{
          api_host: import.meta.env.VITE_POSTHOG_API_URL,
          ui_host: import.meta.env.VITE_POSTHOG_HOST,
        }}
        apiKey={import.meta.env.VITE_POSTHOG_KEY}
      >
        <App />
      </PostHogProvider>
    ) : (
      <App />
    )}
  </StrictMode>
)
