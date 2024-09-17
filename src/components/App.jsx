import "../stylesheets/App.css";
import { Outlet, Navigate, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { WebSocketProvider } from "../contexts/WebSocketContext";
import { logoutThunk } from "../thunks/authThunks";
import { useDispatch } from "react-redux";
import { useEffect, useRef, useState } from "react";

function App() {
  const auth = useSelector((state) => state.auth);
  const readyRef = useRef(false);
  const dispatch = useDispatch();
  const [authIsValid, setAuthIsValid] = useState(false);
  const navigate = useNavigate();

  const tokenExpired = () => Date.now() > auth.exp * 1000;
  const validateAuth = () => auth.logged_in && !tokenExpired();

  const logOut = () => {
    dispatch(logoutThunk());
    //return <Navigate to="/auth/login" />;

    navigate("/auth/login");
  };

  useEffect(() => {
    if (validateAuth()) setAuthIsValid(true);
    else logOut();
    // if (!readyRef.current) {
    //   readyRef.current = true;
    // }
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
