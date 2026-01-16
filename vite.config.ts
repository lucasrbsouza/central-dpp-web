import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig((config) => {
  const isProd = config.mode === 'production';

  return {
    plugins: [vue()],
    // Configuração para Build de Produção
    esbuild: {
      // Remove console.log e debugger apenas em produção
      drop: isProd ? ['console', 'debugger'] : [],
    },
    build: {
      // Otimizações adicionais
      chunkSizeWarningLimit: 1500,
      rollupOptions: {
        output: {
          manualChunks(id) {
            // Separa bibliotecas grandes em arquivos diferentes para carregar mais rápido
            if (id.includes('node_modules')) {
              return 'vendor';
            }
          }
        }
      }
    }
  }
})