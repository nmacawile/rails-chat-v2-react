import Sidebar from "./sidebar/Sidebar.jsx";
import { Outlet } from "react-router-dom";

export function Home() {
  return (
    <div className="flex gap-4 flex-row w-full h-full">
      <Sidebar />
      <main className="flex flex-col w-full h-full bg-gray-900/[.8] rounded-lg overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}

export default Home;
