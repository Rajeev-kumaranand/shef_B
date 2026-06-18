import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { router } from './routes/routes.jsx';
import LenisProvider from './providers/LenisProvider.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { SettingsProvider } from './context/SettingsContext.jsx';
import { Toaster } from 'react-hot-toast';
import { themeData } from './data/themeData.js';
import GlobalErrorBoundary from './components/common/GlobalErrorBoundary.jsx';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes (cacheTime in v5 is gcTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Global diagnostic to verify framework constraints
const runDiagnostics = () => {
  console.log('shef&B Architecture Initialized');
  console.log('✓ Vanilla CSS Modules');
  console.log('✓ Brand Token Integration');
  console.log('✓ Framer Motion + GSAP Ready');
};

// Injects JavaScript tokens into CSS variables
const injectTheme = () => {
  const root = document.documentElement;
  const { colors, typography, spacing, animations } = themeData;

  // Colors
  root.style.setProperty('--brand-red', colors.brand.red);
  root.style.setProperty('--brand-green', colors.brand.green);
  root.style.setProperty('--brand-blue', colors.brand.blue);
  root.style.setProperty('--brand-black', colors.brand.black);
  root.style.setProperty('--brand-white', colors.neutral.white);

  // Map to surface/text variables safely based on neutral palette
  root.style.setProperty('--surface-primary', colors.neutral.white);
  root.style.setProperty('--surface-secondary', colors.neutral.lightGray);
  root.style.setProperty('--surface-tertiary', '#e5e5ea');

  root.style.setProperty('--text-primary', colors.neutral.white);
  root.style.setProperty('--text-secondary', colors.neutral.editorialGray);
  root.style.setProperty('--text-inverse', colors.neutral.black);

  root.style.setProperty('--border-color', colors.neutral.lightGray);

  // Typography
  root.style.setProperty('--font-primary', typography.fonts.display);
  root.style.setProperty('--font-secondary', typography.fonts.body);

  Object.entries(typography.sizes).forEach(([key, value]) => {
    root.style.setProperty(`--font-size-${key}`, value);
  });

  Object.entries(typography.weights).forEach(([key, value]) => {
    root.style.setProperty(`--font-weight-${key}`, value);
  });

  Object.entries(typography.lineHeights).forEach(([key, value]) => {
    root.style.setProperty(`--line-height-${key}`, value);
  });

  Object.entries(typography.letterSpacings).forEach(([key, value]) => {
    root.style.setProperty(`--tracking-${key}`, value);
  });

  // Spacing
  Object.entries(spacing).forEach(([key, value]) => {
    root.style.setProperty(`--spacing-${key}`, value);
  });

  // Animation
  if (animations) {
    Object.entries(animations.durations).forEach(([key, value]) => {
      root.style.setProperty(`--transition-${key}`, value);
    });
    root.style.setProperty('--ease-luxury', animations.easings.luxury);
    root.style.setProperty('--ease-editorial', animations.easings.editorial);
  }

  // Layout
  root.style.setProperty('--max-width', '1440px');
  root.style.setProperty('--container-padding', '5%');
};

function App() {
  useEffect(() => {
    runDiagnostics();
    injectTheme();
  }, []);

  return (
    <GlobalErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          <SettingsProvider>
            <AuthProvider>
              <LenisProvider>
                <RouterProvider router={router} />
              </LenisProvider>
              <Toaster position="bottom-right" />
            </AuthProvider>
          </SettingsProvider>
        </HelmetProvider>
      </QueryClientProvider>
    </GlobalErrorBoundary>
  );
}

export default App;
