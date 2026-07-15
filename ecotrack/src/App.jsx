import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Layout from "./components/common/Layout";
import Home from "./components/Home";

import Register from "./components/user/Register";
import Login from "./components/user/Login";
import RaiseRequest from "./components/user/RaiseRequest";
import UserDashboard from "./components/user/UserDashboard";
import AdminDashboard from "./components/user/AdminDashboard";
import HowItWorks from "./components/user/HowItWorks";
import Contact from "./components/user/Contact";

import { LoginProvider } from "./context/LoginContext";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "raise-request",
        element: <RaiseRequest />,
      },
      {
        path: "user/dashboard",
        element: <UserDashboard />,
      },
      {
        path: "admin/dashboard",
        element: <AdminDashboard />,
      },
      {
        path: "how-it-works",
        element: <HowItWorks />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
    ],
  },
]);

function App() {
  return (
    <LoginProvider>
      <ToastContainer position="top-right" autoClose={3000} />
      <RouterProvider router={routes} />
    </LoginProvider>
  );
}

export default App;