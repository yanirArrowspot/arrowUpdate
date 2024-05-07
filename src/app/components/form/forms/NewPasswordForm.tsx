import React from "react";
import InputField from "../input/InputField";
import Button from "../button/Button";
import Spinner from "../../spinner/Spinner";

type Props = {
  handleOnChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleLogin: () => void;
  btnState: boolean;
  message: string;
};

{
  /* <form
      className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      onSubmit={(e) => e.preventDefault()}
    >
      <Image src={logo} alt="Logo" className="mb-4" />
      <h2>set new password</h2>

      <div className="mb-6">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="newpassword"
        >
          New Password
        </label>
        <input
          className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          id="newpassword"
          type="newpassword"
          autoComplete="off"
          placeholder="******************"
          onChange={handleOnChangeNewPassword}
          defaultValue={""}
        />
        <p className="text-red-500 text-xs italic">Please choose a password.</p>
      </div>
      <div className="flex items-center justify-between">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
          onClick={handleNewPassword}
        >
          Set new password
        </button>
        <a
          className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
          href="#"
        >
          Forgot Password?
        </a>
      </div>
    </form> */
}

const NewPasswordForm = ({
  handleOnChange,
  handleLogin,
  btnState,
  message,
}: Props) => {
  return (
    <form
      className="  rounded px-8 pt-6 pb-8 mb-4"
      onSubmit={(e) => e.preventDefault()}
    >
      <InputField
        id="password"
        type="password"
        placeholder="********"
        onChange={handleOnChange}
        label="new password"
      />
      {message.length > 0 ? (
        <div className="text-sm font-bold  flex items-center justify-center flex-col m-4">
          <p className="text-green-600">{message}</p>
        </div>
      ) : null}
      <div className="flex items-center justify-between">
        {btnState ? (
          <Spinner width="8" height="8" />
        ) : (
          <Button onClick={handleLogin} disabled={btnState}>
            Set new password
          </Button>
        )}
      </div>
    </form>
  );
};

export default NewPasswordForm;
