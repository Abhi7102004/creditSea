// App.jsx
import React from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Navbar from "./components/navbar";
import Home from "./components/home";
import Login from "./components/login";
import Register from "./components/register";
import AdminDashboard from "./dashboard/admin";
import UserDashboard from "./dashboard/user";
import VerifierDashboard from "./dashboard/verifier";
import GetALoan from "./components/GetALoan";
import CreateAdmin from "./components/createAdmin";
import CreateVerifier from "./components/createVerifier";
const Layout = () => (
  <>
    <Navbar />
    <Outlet />
  </>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Register />,
      },
      {
        path: "/admin/dashboard",
        element: <AdminDashboard />,
      },
      {
        path: "/user/dashboard",
        element: <UserDashboard />,
      },
      {
        path: "/verifier/dashboard",
        element: <VerifierDashboard />,
      },
      {
        path: "/admin/create-admin",
        element: <CreateAdmin />,
      },
      {
        path: "/admin/create-verifier",
        element: <CreateVerifier/>
      },
      {
        path:"/apply-loan",
        element:<GetALoan/>
      }
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
