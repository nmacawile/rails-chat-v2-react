import "../stylesheets/App.css";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { WebSocketProvider } from "../contexts/WebSocketContext";
import { logoutThunk } from "../thunks/authThunks";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";

function App() {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [authIsValid, setAuthIsValid] = useState(false);
  const navigate = useNavigate();

  const tokenExpired = () => Date.now() > auth.exp * 1000;
  const validateAuth = () => auth.logged_in && !tokenExpired();

  const logOut = () => {
    dispatch(logoutThunk());
    navigate("/auth/login");
  };

  useEffect(() => {
    if (validateAuth()) setAuthIsValid(true);
    else logOut();
  }, []);

  return (
    <div className="p-4 h-full">
      {authIsValid && (
        <WebSocketProvider>
          <Outlet />
        </WebSocketProvider>
      )}
    </div>
  );
}

export default App;
