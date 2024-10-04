import { RouterProvider } from "react-router-dom";
import router from "./config/router";
import "./index.css";
import StyleThemeProvider from "./theme/ThemeProvider";
import AuthProvider from "./context/AuthProvider";
import { SnackbarProvider } from "notistack";

function App() {
  return (
    <SnackbarProvider maxSnack={5} preventDuplicate>
      <AuthProvider>
        <StyleThemeProvider>
          <RouterProvider router={router} />
        </StyleThemeProvider>
      </AuthProvider>
    </SnackbarProvider>
  );
}

export default App;
