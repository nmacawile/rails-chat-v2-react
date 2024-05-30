import "../stylesheets/App.css";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function App() {
  const auth = useSelector((state) => state.auth);

  return (
    <>
      <h1 className="text-2xl font-bold text-gray-700">React Rails Chat</h1>
        {auth.logged_in ? <Outlet /> : <Navigate to="/auth/login" />}
    </>
  );
}

export default App;
