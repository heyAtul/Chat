import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: "#00a884", dark: "#008f6f", contrastText: "#fff" },
    success: { main: "#25d366" },
    warning: { main: "#fbbf24" },
    error: { main: "#ef4444" },
    background: { default: "#f0f2f5" },
    text: { primary: "#41525d", secondary: "#667781" },
  },
});

export default theme;
