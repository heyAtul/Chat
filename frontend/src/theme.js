import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: "#00a884", dark: "#008f6f", contrastText: "#fff" },
    success: { main: "#25d366" },
    warning: { main: "#fbbf24" },
    error: { main: "#ef4444" },
    background: { default: "#f0f2f5" },
    text: { primary: "#41525d", secondary: "#667781" },
    // WhatsApp Web colors used by the chat screen.
    chat: {
      text: "#111b21",
      icon: "#54656f",
      panel: "#f0f2f5", // panel headers, message composer, intro screen
      border: "#d1d7db", // line between the two panels
      rowDivider: "#e9edef",
      rowHover: "#f5f6f6",
      rowSelected: "#f0f2f5",
      wallpaper: "#efeae2",
      bubbleIn: "#ffffff",
      bubbleOut: "#d9fdd3",
    },
  },
  typography: {
    fontFamily:
      '"Segoe UI", "Helvetica Neue", Helvetica, "Lucida Grande", Arial, Ubuntu, Cantarell, "Fira Sans", sans-serif',
  },
  components: {
    MuiTextField: {
      defaultProps: { variant: "standard", fullWidth: true },
    },
    MuiButton: {
      defaultProps: { variant: "contained", disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 999, paddingInline: 24, textTransform: "none" },
      },
    },
  },
});

export default theme;
