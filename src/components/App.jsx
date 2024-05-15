import "../stylesheets/App.css";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <>
      <h1 className="text-2xl font-bold text-gray-700">React Rails Chat</h1>
      <Outlet />
    </>
  );
}

export default App;
