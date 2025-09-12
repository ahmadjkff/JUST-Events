import { Box } from "@mui/material";
import SideBar from "../../common/Sidebar";

function Events() {
  return (
    <Box sx={{ display: "flex" }}>
      <SideBar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <h1>Events</h1>
      </Box>
    </Box>
  );
}

export default Events;
