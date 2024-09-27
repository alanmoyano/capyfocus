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
      '@contexts': path.resolve(__dirname, './src/components/contexts')
    }
  },
  build: {
    rollupOptions: {
      output: {
        compact: true,
        manualChunks: {
          'radix-ui': [
            '@radix-ui/react-alert-dialog',
            '@radix-ui/react-avatar',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-hover-card',
            '@radix-ui/react-label',
            '@radix-ui/react-navigation-menu',
            '@radix-ui/react-popover',
            '@radix-ui/react-progress',
            '@radix-ui/react-radio-group',
            '@radix-ui/react-scroll-area',
            '@radix-ui/react-select',
            '@radix-ui/react-slot',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toggle',
            '@radix-ui/react-toggle-group',
            '@radix-ui/react-tooltip',
            'react-day-picker',
            'react-confetti-boom',
            'embla-carousel-react',
            'react-resizable-panels'
          ],
          charts: ['recharts'],
          shadcn: [
            './src/components/ui/alert-dialog.tsx',
            './src/components/ui/avatar.tsx',
            './src/components/ui/button.tsx',
            './src/components/ui/calendar.tsx',
            './src/components/ui/card.tsx',
            './src/components/ui/carousel.tsx',
            './src/components/ui/chart.tsx',
            './src/components/ui/checkbox.tsx',
            './src/components/ui/command.tsx',
            './src/components/ui/dialog.tsx',
            './src/components/ui/dropdown-menu.tsx',
            './src/components/ui/form.tsx',
            './src/components/ui/hover-card.tsx',
            './src/components/ui/input.tsx',
            './src/components/ui/label.tsx',
            './src/components/ui/navigation-menu.tsx',
            './src/components/ui/popover.tsx',
            './src/components/ui/progress.tsx',
            './src/components/ui/radio-group.tsx',
            './src/components/ui/scroll-area.tsx',
            './src/components/ui/select.tsx',
            './src/components/ui/sheet.tsx',
            './src/components/ui/table.tsx',
            './src/components/ui/tabs.tsx',
            './src/components/ui/toggle.tsx',
            './src/components/ui/toggle-group.tsx',
            './src/components/ui/tooltip.tsx'
          ]
        }
      }
    }
  }
})
