/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html","./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
        dm: ["'DM Sans'", "sans-serif"],
      }, colors:{
        textColor:"#0E4194",
        bgColor: "#f6fbff",
        azulEsverdeado : "#006B97",
        verdeLima: "#7ED32A",
        azulCiano: "#2EB6ED",
        marromAvermelhado: "#410000",
        vermelho: "#E11519",
        azulButtonClaro: "#0055E0",
        azulButtonEscuro: "#001877",
        cinza: "#87A5B1",
        azulClarinhoColor: "#83B2FF",
      }},
  },
  plugins: [],
}
