import Sidebar from "./sidebar/Sidebar.jsx";
import { Outlet } from "react-router-dom";
import { ChannelSubscriptionProvider } from "../contexts/ChannelSubscriptionContext.jsx";

export function Home() {
  const channelIdentifier = {
    channel: "PresenceChannel",
  };

  return (
    <ChannelSubscriptionProvider channelIdentifier={channelIdentifier}>
      <div className="flex gap-4 flex-row w-full h-full">
        <Sidebar />
        <main className="flex flex-col w-full h-full bg-gray-900/[.8] rounded-lg overflow-hidden">
          <Outlet />
        </main>
      </div>
    </ChannelSubscriptionProvider>
  );
}

export default Home;
