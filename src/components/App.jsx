import "../stylesheets/App.css";
import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function App() {
  const auth = useSelector((state) => state.auth);

  return (
    <div className="p-4 h-full">
      {auth.logged_in ? <Outlet /> : <Navigate to="/auth/login" />}
    </div>
  );
}

export default App;
