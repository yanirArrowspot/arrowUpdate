import React from "react";
import InputField from "../input/InputField";
import Button from "../button/Button";
import Spinner from "../../spinner/Spinner";

type Props = {
  handleOnChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleLogin: () => void;
  btnState: boolean;
};

const LoginForm = ({ handleOnChange, handleLogin, btnState }: Props) => {
  return (
    <form
      // className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      onSubmit={(e) => e.preventDefault()}
    >
      <InputField
        id="email"
        type="text"
        placeholder="Email"
        onChange={handleOnChange}
        label="email"
      />

      <InputField
        id="password"
        type="password"
        placeholder="********"
        onChange={handleOnChange}
        label="password"
      />
      <div className="flex items-center justify-between">
        {btnState ? (
          <Spinner width="8" height="8" />
        ) : (
          <Button onClick={handleLogin} disabled={btnState}>
            Sign In
          </Button>
        )}
        {/* Forgot Password Link */}
      </div>
    </form>
  );
};

export default LoginForm;
