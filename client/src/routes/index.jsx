import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import LoginForm from "../components/forms/LoginForm";
import Landing from "../components/Landing";
import PartyTable from "../components/parties/PartyTable";
import PartyForm from "../components/forms/PartyForm";
import PartyDetail from "../components/parties/PartyDetail";
import PackageCreationForm from "../components/forms/PackageCreationForm";
import UserProfile from "../components/user/UserProfile";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
        {
            index: true,
            element: <Landing />
        },
        {
            path: "/login",
            element: <LoginForm />
        },
        {
          path: '/parties',
          element: <PartyTable />
        },
        {
          path:'/parties/new',
          element: <PartyForm />
        },
        {
          path: '/parties/:id',
          element: <PartyDetail />
        },
        {
          path:'/packages/new',
          element: <PackageCreationForm />
        },
        {
          path: '/profile',
          element: <UserProfile />
        }

    ]
  }
])