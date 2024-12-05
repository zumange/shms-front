/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        light: "#f9db78",
        thermostat: "#789de5",
        camera: "#b7b7b7",
        blinds: "#9dc384",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "cupcake"],
  },
};
