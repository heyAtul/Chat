import { Box, SvgIcon, Typography } from "@mui/material";

export default function ChatLogo() {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <SvgIcon fontSize="large">
        <path d="M12 2C6.48 2 2 6.03 2 11c0 2.4 1.05 4.58 2.77 6.19L4 22l4.97-2.13c.97.27 1.99.42 3.03.42 5.52 0 10-4.03 10-9S17.52 2 12 2z" />
      </SvgIcon>
      <Typography variant="subtitle2" sx={{ textTransform: "uppercase", letterSpacing: 1 }}>
        Chat
      </Typography>
    </Box>
  );
}
