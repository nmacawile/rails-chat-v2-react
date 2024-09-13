import "../stylesheets/App.css";
import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { WebSocketProvider } from "../contexts/WebSocketContext";

function App() {
  const auth = useSelector((state) => state.auth);

  return (
    <div className="p-4 h-full">
      {auth.logged_in ? (
        <WebSocketProvider>
          <Outlet />
        </WebSocketProvider>
      ) : (
        <Navigate to="/auth/login" />
      )}
    </div>
  );
}

export default App;
