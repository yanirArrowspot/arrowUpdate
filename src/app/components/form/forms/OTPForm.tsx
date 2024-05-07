import React from "react";
import InputField from "../input/InputField";
import Button from "../button/Button";
import Spinner from "../../spinner/Spinner";

type Props = {
  handleOnChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleLogin: () => void;
  btnState: boolean;
};

<label className="block text-gray-700 text-m font-bold mb-2" htmlFor="otp">
  A verification code has been sent to your email. Please enter it below.
</label>;

const OTPForm = ({ handleOnChange, handleLogin, btnState }: Props) => {
  return (
    <form className="" onSubmit={(e) => e.preventDefault()}>
      <InputField
        id="otp"
        type="text"
        placeholder="Enter OTP"
        onChange={handleOnChange}
        maxLength={6}
        inputMode="numeric"
        text="A verification code has been sent to your email. Please enter it below."
        textStyle="block text-gray-700 text-m font-bold mb-2"
      />

      <div className="flex items-center justify-between">
        {btnState ? (
          <Spinner width="8" height="8" />
        ) : (
          <Button onClick={handleLogin} disabled={btnState}>
            Sign In
          </Button>
        )}
        {/* {btnState ? (
          <Spinner width="8" height="8" />
        ) : (
          <Button onClick={handleLogin} disabled={btnState}>
            Sign In
          </Button>
        )} */}
        {/* Forgot Password Link */}
      </div>
    </form>
  );
};

export default OTPForm;
