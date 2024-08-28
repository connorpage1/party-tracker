import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import LoginForm from "../components/forms/LoginForm";
import Landing from "../components/Landing";

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
        }
    ]
  }
])