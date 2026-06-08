/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Criando a paleta padrão do seu Sistema de Reservas
        primary: {
          DEFAULT: '#4E73DF', // O seu azul principal
          dark: '#3b59b6',    // O azul mais escuro para quando passar o mouse (hover)
          light: '#85a1ef',   // Um azul mais claro para detalhes sutis, se precisar
        }
      },
      fontFamily: {
        // Caso queira padronizar uma fonte no futuro, o espaço já está pronto
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}