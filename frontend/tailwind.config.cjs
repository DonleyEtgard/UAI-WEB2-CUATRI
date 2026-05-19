module.exports = {
  darkMode: "class",

  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,vue}",
  ],

  theme: {
    extend: {
      colors: {
        /* 🎯 BASE */
        background: "#10131a",
        surface: "#10131a",

        /* 🧱 CONTAINERS */
        "surface-container": "#1d2027",
        "surface-container-low": "#191b23",
        "surface-container-high": "#272a31",
        "surface-container-highest": "#32353c",
        "surface-dim": "#10131a",
        "surface-bright": "#363941",

        /* 🎨 UI */
        "outline-variant": "#424754",
        outline: "#8c909f",

        /* 🎯 BRAND - Primary */
        primary: "#adc6ff",
        "primary-container": "#4d8eff",
        "primary-fixed": "#d8e2ff",
        "primary-fixed-dim": "#adc6ff",
        "on-primary": "#002e6a",
        "on-primary-container": "#00285d",
        "on-primary-fixed": "#001a42",
        "on-primary-fixed-variant": "#004395",
        "inverse-primary": "#005ac2",

        /* 🎯 BRAND - Secondary */
        secondary: "#ddb7ff",
        "secondary-container": "#6f00be",
        "secondary-fixed": "#f0dbff",
        "secondary-fixed-dim": "#ddb7ff",
        "on-secondary": "#490080",
        "on-secondary-container": "#d6a9ff",
        "on-secondary-fixed": "#2c0051",
        "on-secondary-fixed-variant": "#6900b3",

        /* 🎯 BRAND - Tertiary */
        tertiary: "#ffb786",
        "tertiary-container": "#df7412",
        "tertiary-fixed": "#ffdcc6",
        "tertiary-fixed-dim": "#ffb786",
        "on-tertiary": "#502400",
        "on-tertiary-container": "#461f00",
        "on-tertiary-fixed": "#311400",
        "on-tertiary-fixed-variant": "#723600",

        /* 📝 TEXT */
        "on-surface": "#e1e2ec",
        "on-surface-variant": "#c2c6d6",
        "on-background": "#e1e2ec",
        "inverse-surface": "#e1e2ec",
        "inverse-on-surface": "#2e3038",

        /* ⚠️ ERROR */
        error: "#ffb4ab",
        "error-container": "#93000a",
        "on-error": "#690005",
        "on-error-container": "#ffdad6",

        /* 🔥 Legacy colors for compatibility */
        "primary-hover": "#4f46e5",
      },

      /* 🔥 BORDES */
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        full: "9999px",
      },

      /* 🔥 SPACING */
      spacing: {
        xs: "0.5rem",
        sm: "1rem",
        md: "1.5rem",
        lg: "2rem",
        xl: "3rem",
        gutter: "1.5rem",
        margin: "2rem",
        unit: "4px",
      },

      /* 🔥 SOMBRAS */
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,0.3)",
        glow: "0 0 0 1px rgba(99,102,241,0.2)",
      },

      /* 🔥 TRANSICIONES */
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      },

      /* 🔥 BLUR */
      backdropBlur: {
        xs: "2px",
      },

      /* 🔥 TYPOGRAPHY */
      fontFamily: {
        "label-bold": ["Inter", "sans-serif"],
        "label-sm": ["Inter", "sans-serif"],
        "headline-sm": ["Inter", "sans-serif"],
        "body-lg": ["Inter", "sans-serif"],
        "headline-md": ["Inter", "sans-serif"],
        "body-md": ["Inter", "sans-serif"],
        "display-lg": ["Inter", "sans-serif"],
      },

      fontSize: {
        "label-bold": ["12px", { lineHeight: "16px", letterSpacing: "0.05em", fontWeight: "600" }],
        "label-sm": ["12px", { lineHeight: "16px", letterSpacing: "0", fontWeight: "400" }],
        "headline-sm": ["18px", { lineHeight: "24px", letterSpacing: "0", fontWeight: "600" }],
        "body-lg": ["16px", { lineHeight: "24px", letterSpacing: "0", fontWeight: "400" }],
        "headline-md": ["24px", { lineHeight: "32px", letterSpacing: "-0.01em", fontWeight: "600" }],
        "body-md": ["14px", { lineHeight: "20px", letterSpacing: "0", fontWeight: "400" }],
        "display-lg": ["48px", { lineHeight: "56px", letterSpacing: "-0.02em", fontWeight: "700" }],
      },
    },
  },

  plugins: [],
};