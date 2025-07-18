import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Dashboard from "./components/pages/Dashboard";
import Login from "./components/pages/Login";
import SignUp from "./components/pages/SignUp";

export const router = createBrowserRouter([
    {path: "/", element: <App />},
    {path: "/dashboard", element: <Dashboard />},
    {path: "/login", element: <Login />},
    {path: "/signup", element: <SignUp />}
]);