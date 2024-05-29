import { Outlet, Navigate } from "react-router-dom";
import "../../stylesheets/Auth.css";
import { useSelector } from "react-redux";

export function Auth() {
  const auth = useSelector((state) => state.auth);

  return (
    <>
      <header className="p-4 mb-8 bg-gradient-to-b from-gray-900/[0.4] to-transparent">
        <h1 className="text-3xl dark:text-gray-200 logo font-pacifico">
          React Chat
        </h1>
      </header>
      {auth.logged_in ? <Navigate to="/" /> : <Outlet />}
    </>
  );
}

export default Auth;
