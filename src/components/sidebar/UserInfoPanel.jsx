import { useSelector } from "react-redux";

export function UserInfoPanel() {
  const auth_user = useSelector((state) => state.auth.user);

  return (
    <>
      <div>
        <div className="bg-purple-400 h-10 w-10 rounded-full"></div>
      </div>
      <span className="ms-2.5 leading-none text-white">
        {auth_user.full_name}
      </span>
    </>
  );
}

export default UserInfoPanel;
