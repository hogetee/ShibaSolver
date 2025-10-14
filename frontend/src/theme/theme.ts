import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    customGray: {
      main: string;
      light: string;
      dark: string;
    };
  }
  interface PaletteOptions {
    customGray?: {
      main: string;
      light: string;
      dark: string;
    };
  }
}

const theme = createTheme({
  palette: {
    primary: {
      main: "#4b0082",
      light: "#8131bbff",
      dark: "#340c51ff",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#E384FF",
      light: "#f3a4ff",
      dark: "#d166ff",
      contrastText: "#ffffff",
    },
    error: {
      main: "#FF6B6B",
      light: "#ff8585",
      dark: "#ff5252",
    },
    success: {
      main: "#4CAF50",
      light: "#66BB6A",
      dark: "#43A047",
    },
    warning: {
      main: "#FFA726",
      light: "#FFB74D",
      dark: "#F57C00",
    },
    customGray: {
      main: "#6B7280",
      light: "#9CA3AF",
      dark: "#4B5563",
    },
    background: {
      default: "#ffffff",
      paper: "#f8f9fa",
    },
    text: {
      primary: "#111827",
      secondary: "#4B5563",
    },
  },
  typography: {
    fontFamily: [
      "Afacad",
      "Inter",
      "-apple-system",
      "BlinkMacSystemFont",
      "Segoe UI",
      "Roboto",
      "Helvetica Neue",
      "Arial",
      "sans-serif",
    ].join(","),
    h1: {
      fontSize: "2.5rem",
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: "1.5rem",
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: "1.25rem",
      fontWeight: 500,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.5,
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.5,
    },
    button: {
      textTransform: "none",
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: 'Afacad',
          textTransform: 'none',
          borderRadius: '12px',
          padding: '8px 16px',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: "24px",
          padding: "8px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          textAlign: 'center',
          fontSize: '2rem',
          fontWeight: 600,
          fontFamily: 'Afacad',
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: '24px',
          fontFamily: 'Afacad',
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          justifyContent: 'center',
          padding: '8px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: "transform 0.2s ease-in-out",
          "&:hover": {
            transform: "scale(1.1)",
          },
        },
      },
    },
  },
});

export default theme;
