import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { DataProvider } from "./context/DataContext";
import "./index.css"; // Certifique-se de importar o CSS que contém a fonte
import AppRoutes from "./routes/Routes";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "'Inter', sans-serif",
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <DataProvider>
        <AppRoutes />
      </DataProvider>
    </ThemeProvider>
  </StrictMode>
);
