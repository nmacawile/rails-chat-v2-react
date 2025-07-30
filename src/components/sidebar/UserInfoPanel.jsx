import { useSelector, useDispatch } from "react-redux";
import { updateVisibilityThunk } from "../../thunks/userThunks";
import { useState } from "react";

export function UserInfoPanel() {
  const { handle, full_name, visibility } = useSelector(
    (state) => state.auth.user
  );

  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const toggleVisibility = async () => {
    setLoading(true);
    try {
      await dispatch(updateVisibilityThunk(!visibility));
    } catch (error) {
      console.error(
        "There was a problem changing the visibility status",
        error
      );
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-row w-full justify-between">
      <div className="flex flex-row">
        <div className="bg-purple-400 h-10 w-10 rounded-full"></div>
        <div className="ms-2.5 flex flex-col">
          <span className="leading-none text-white font-semibold">
            {full_name}
          </span>
          <span className="user-handle text-gray-400">{handle}</span>
        </div>
      </div>

      <div className="flex items-center">
        <label className="inline-flex items-center cursor-pointer gap-2">
          <input
            data-testid="visibility-toggle"
            type="checkbox"
            checked={visibility}
            className="sr-only peer"
            onChange={toggleVisibility}
            disabled={loading}
          />
          <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
            Online
          </span>
          <div
            className={[
              "relative",
              "w-11",
              "h-6",
              "bg-gray-200",
              "peer-focus:outline-none",
              "peer-focus:ring-4",
              "peer-focus:ring-green-300",
              "dark:peer-focus:ring-pink-800",
              "rounded-full",
              "peer",
              "dark:bg-gray-700",
              "peer-checked:after:translate-x-full",
              "rtl:peer-checked:after:-translate-x-full",
              "peer-checked:after:border-white",
              "after:content-['']",
              "after:absolute",
              "after:top-[2px]",
              "after:start-[2px]",
              "after:bg-white",
              "after:border-gray-300",
              "after:border",
              "after:rounded-full",
              "after:h-5",
              "after:w-5",
              "after:transition-all",
              "dark:border-gray-600",
              "peer-checked:bg-pink-600",
              "dark:peer-checked:bg-pink-600",
            ].join(" ")}
          ></div>
        </label>
      </div>
    </div>
  );
}

export default UserInfoPanel;
