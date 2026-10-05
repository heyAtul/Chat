import { SvgIcon } from "@mui/material";

const createIcon = (path) =>
  function Icon(props) {
    return (
      <SvgIcon {...props}>
        <path d={path} />
      </SvgIcon>
    );
  };

export const ChatIcon = createIcon(
  "M12 2C6.48 2 2 6.03 2 11c0 2.4 1.05 4.58 2.77 6.19L4 22l4.97-2.13c.97.27 1.99.42 3.03.42 5.52 0 10-4.03 10-9S17.52 2 12 2z"
);
export const SearchIcon = createIcon(
  "M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
);
export const BackIcon = createIcon("M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z");
export const SendIcon = createIcon("M2.01 21 23 12 2.01 3 2 10l15 2-15 2z");
export const MoreIcon = createIcon(
  "M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
);
