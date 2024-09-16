import "../stylesheets/App.css";
import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { WebSocketProvider } from "../contexts/WebSocketContext";
import { logoutThunk } from "../thunks/authThunks";
import { useDispatch } from "react-redux";

function App() {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const tokenExpired = () => Date.now() > auth.exp * 1000;
  const validateAuth = () => auth.logged_in && !tokenExpired();

  const logOut = () => {
    dispatch(logoutThunk());
    return <Navigate to="/auth/login" />;
  };

  return (
    <div className="p-4 h-full">
      {validateAuth() ? (
        <WebSocketProvider>
          <Outlet />
        </WebSocketProvider>
      ) : (
        logOut()
      )}
    </div>
  );
}

export default App;
