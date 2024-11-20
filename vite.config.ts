import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@contexts': path.resolve(__dirname, './src/components/contexts'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        compact: true,
        manualChunks: {
          standalone: [
            './src/components/ui/input.tsx',
            './src/components/ui/card.tsx',
            './src/components/ui/table.tsx',
          ],
          button: ['./src/components/ui/button.tsx', '@radix-ui/react-slot'],
          label: ['./src/components/ui/label.tsx', '@radix-ui/react-label'],
          select: ['./src/components/ui/select.tsx', '@radix-ui/react-select'],
          checkbox: [
            './src/components/ui/checkbox.tsx',
            '@radix-ui/react-checkbox',
          ],
          dialog: [
            './src/components/ui/dialog.tsx',
            './src/components/ui/sheet.tsx',
            '@radix-ui/react-dialog',
          ],
          popover: [
            './src/components/ui/popover.tsx',
            '@radix-ui/react-popover',
          ],
          toggle: [
            './src/components/ui/toggle.tsx',
            '@radix-ui/react-toggle',
            './src/components/ui/toggle-group.tsx',
            '@radix-ui/react-toggle-group',
          ],
          tooltip: [
            './src/components/ui/tooltip.tsx',
            '@radix-ui/react-tooltip',
          ],
          calendar: ['./src/components/ui/calendar.tsx', 'react-day-picker'],
          'dropdown-menu': [
            './src/components/ui/dropdown-menu.tsx',
            '@radix-ui/react-dropdown-menu',
          ],
          'scroll-area': [
            './src/components/ui/scroll-area.tsx',
            '@radix-ui/react-scroll-area',
          ],
          smallers: [
            './src/components/ui/hover-card.tsx',
            '@radix-ui/react-hover-card',
            './src/components/ui/radio-group.tsx',
            '@radix-ui/react-radio-group',
            './src/components/ui/resizable.tsx',
            'react-resizable-panels',
            './src/components/ui/alert-dialog.tsx',
            '@radix-ui/react-alert-dialog',
            './src/components/ui/avatar.tsx',
            '@radix-ui/react-avatar',
            './src/components/ui/progress.tsx',
            '@radix-ui/react-progress',
            './src/components/ui/tabs.tsx',
            '@radix-ui/react-tabs',
          ],
          command: ['./src/components/ui/command.tsx', 'cmdk'],
          carousel: [
            './src/components/ui/carousel.tsx',
            'embla-carousel-react',
          ],
          'navigation-menu': [
            './src/components/ui/navigation-menu.tsx',
            '@radix-ui/react-navigation-menu',
          ],
          analytics: [
            'posthog-js',
            '@vercel/analytics',
            '@vercel/speed-insights',
          ],
          sonner: ['sonner'],
          core:["react", "react-dom", "wouter"],
          form: ['./src/components/ui/form.tsx', 'react-hook-form', 'zod'],
          charts: ['recharts', './src/components/ui/chart.tsx'],
          icons: ['lucide-react'],
        },
      },
    },
  },
})
