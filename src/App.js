import { blue } from "@mui/material/colors";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Router } from "@reach/router";
import AccessPage from "./pages/accesspage";
import AccountIndex from "./pages/account";
import AdminIndex from "./pages/admin";
import AllUserTablesmain from "./pages/admin/allusers";
import CreateTransferIndex from "./pages/admin/createtransaction";
import EditUser from "./pages/admin/user/user";
import AuthenticationIndex from "./pages/authentication";
import SignIn from "./pages/authentication/login";
import SignUp from "./pages/authentication/signup";
import DashboardIndex from "./pages/dashboard";
import ManageCards from "./pages/managecards";
import SettingsIndex from "./pages/settings";
import SuccessPage from "./pages/successpayment";
import TransactionIndex from "./pages/transactions";
import TransferIndex from "./pages/transfer";
import Security from "./pages/transfer/securitycode";

const theme = createTheme({
  palette: {
    primary: {
      main: "#073407",
    },
    secondary: {
      main: blue[600],
    },
  },
  typography: {
    body2: {
      fontSize: 18,
    },
    h4: {
      fontWeight: 2000,
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
          <SignIn path="admin/:pathtonavigate" />
          <SignUp path="signup" />
        </AuthenticationIndex>

        <DashboardIndex path="dashboard">
          <AccountIndex path="account" />
          <TransferIndex path="transfer/:account" />
          <TransactionIndex path="transactions/:account" />
          <SettingsIndex path="settings/:action" />
          <SuccessPage path="success" />
          <AccessPage path="access" />
          <ManageCards path="cards/:account" />
          <Security path="security" />
        </DashboardIndex>

        <AdminIndex path="manager">
          <AllUserTablesmain path="/" />
          <EditUser path="user/:id" />
          <CreateTransferIndex path="addtransaction/:id" />
        </AdminIndex>
      </Router>
    </ThemeProvider>
  );
}

export default App;
