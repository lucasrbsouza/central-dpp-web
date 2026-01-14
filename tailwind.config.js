/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cores extraídas da Logo do Governo do Piauí
        piaui: {
          blue: '#093089',    // Azul Escuro (Texto, Navbar)
          yellow: '#fdb913',  // Amarelo (Destaques, Alertas)
          red: '#ef4123',     // Vermelho (Erros, Botões de perigo)
          green: '#007236',   // Verde (Sucesso, Botões de ação positiva)
        },
        // Paleta Semântica (Melhor para acessibilidade e manutenção)
        brand: {
          primary: '#093089',
          secondary: '#007236',
          accent: '#fdb913',
          danger: '#ef4123',
        }
      },
      fontFamily: {
        // Fonte sans-serif padrão para boa leitura em telas
        sans: ['"Open Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'base-plus': '1.05rem', 
      }
    },
  },
  plugins: [],
}