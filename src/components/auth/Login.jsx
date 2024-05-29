import { loginThunk } from "../../thunks/authThunks";
import { useState } from "react";
import FormField from "../shared/FormField";
import { useDispatch } from "react-redux";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [formError, setFormError] = useState("");
  const dispatch = useDispatch();

  const login = async (e) => {
    e.preventDefault();
    setIsPending(true);
    try {
      await dispatch(loginThunk(email, password));
    } catch (error) {
      setFormError(error.message);
    }
    setIsPending(false);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  return (
    <div className="p-4">
      <form
        className="max-w-sm mx-auto shadow-sm bg-gray-50 dark:bg-gray-900/[.8] p-8 rounded-lg space-y-8"
        onSubmit={login}
      >
        <h2 className="text-2xl font-semibold mb-4 dark:text-gray-100">
          Login
        </h2>
        <div className="space-y-4">
          <FormField
            id="email-input"
            type="email"
            label="Email"
            placeholder="your@email.com"
            value={email}
            onChange={handleEmailChange}
            required={true}
            disabled={isPending}
          ></FormField>
          <FormField
            id="password-input"
            type="password"
            label="Password"
            value={password}
            onChange={handlePasswordChange}
            required={true}
            disabled={isPending}
          ></FormField>
        </div>

        {formError && (
          <div className="text-sm text-red-400 bg-gray-700 border border-red-400 rounded-lg px-2 py-4">
            {formError}
          </div>
        )}

        <div className="flex flex-col">
          <button
            type="submit"
            id="login-button"
            className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 shadow-lg shadow-purple-500/50 dark:shadow-lg dark:shadow-purple-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            disabled={isPending}
          >
            {isPending ? "Please wait..." : "Log In"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
