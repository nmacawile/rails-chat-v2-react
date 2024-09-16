import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App.jsx";
import "./stylesheets/index.css";
import Home from "./components/Home.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./components/auth/Login.jsx";
import Auth from "./components/auth/Auth.jsx";
import { StoreProvider } from "./components/StoreProvider.jsx";
import ChatWindow from "./components/ChatWindow.jsx";
import { ChatRoot } from "./components/ChatRoot.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Home />,
        children: [
          { path: "", element: <ChatRoot /> },
          { path: "/chats/:id", element: <ChatWindow /> },
        ],
      },
    ],
  },
  {
    path: "/auth",
    element: <Auth />,
    children: [{ path: "login", element: <Login /> }],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <StoreProvider>
      <RouterProvider router={router} />
    </StoreProvider>
  </React.StrictMode>
);
