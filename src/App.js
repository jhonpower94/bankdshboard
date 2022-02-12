import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Router } from "@reach/router";
import AccountIndex from "./pages/account";
import AdminIndex from "./pages/admin";
import AuthenticationIndex from "./pages/authentication";
import SignIn from "./pages/authentication/login";
import SignUp from "./pages/authentication/signup";

import DashboardIndex from "./pages/dashboard";
import ManageCards from "./pages/managecards";
import Security from "./pages/transfer/securitycode";
import SettingsIndex from "./pages/settings";
import TransactionIndex from "./pages/transactions";
import TransferIndex from "./pages/transfer";
import TransferMain from "./pages/transfer/main";
import AccessPage from "./pages/accesspage";
import { blue } from "@mui/material/colors";

const theme = createTheme({
  palette: {
    primary: {
      main: "#d20000",
    },
    secondary: {
      main: blue[600],
    },
  },
  typography: {
    body2: {
      fontSize: 18,
    },
  },
  components: {
    MuiListItemButton: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            backgroundColor: `#ffffff`,
            "&.Mui-selected:hover": {
              backgroundColor: "#ffffff",
            },
          },
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AuthenticationIndex path="/">
          <SignIn path="/" />
          <SignUp path="signup" />
        </AuthenticationIndex>

        <DashboardIndex path="dashboard">
          <AccountIndex path="account" />
          <TransferIndex path="transfer/:account" />
          <TransactionIndex path="transactions/:account" />
          <SettingsIndex path="settings/:action" />
          <AccessPage path="access" />
          <ManageCards path="cards/:account" />
          <Security path="security" />
        </DashboardIndex>

        <AdminIndex path="manager" />
      </Router>
    </ThemeProvider>
  );
}

export default App;
