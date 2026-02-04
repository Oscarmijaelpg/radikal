import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@domain': path.resolve(__dirname, './src/domain'),
        '@infrastructure': path.resolve(__dirname, './src/infrastructure'),
        '@features': path.resolve(__dirname, './src/presentation/features'),
        '@shared': path.resolve(__dirname, './src/presentation/shared'),
        '@context': path.resolve(__dirname, './src/presentation/context'),
        '@core': path.resolve(__dirname, './src/core'),
      }
    }
  };
});
