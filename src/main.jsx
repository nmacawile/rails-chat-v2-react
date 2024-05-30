import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App.jsx";
import "./stylesheets/index.css";
import Home from "./components/Home.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./components/auth/Login.jsx";
import Auth from "./components/auth/Auth.jsx";
import { Provider } from "react-redux";
import store from "./store/store";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [{ path: "", element: <Home /> }],
  },
  {
    path: "/auth",
    element: <Auth />,
    children: [{ path: "login", element: <Login /> }],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
