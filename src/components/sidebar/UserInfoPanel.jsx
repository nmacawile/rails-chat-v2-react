import { useSelector } from "react-redux";

export function UserInfoPanel() {
  const { handle, full_name } = useSelector((state) => state.auth.user);

  return (
    <div className="flex flex-row">
      <div className="bg-purple-400 h-10 w-10 rounded-full"></div>
      <div className="ms-2.5 flex flex-col">
        <span className="leading-none text-white font-semibold">{full_name}</span>
        <span className="user-handle text-gray-400">{handle}</span>
      </div>
    </div>
  );
}

export default UserInfoPanel;
