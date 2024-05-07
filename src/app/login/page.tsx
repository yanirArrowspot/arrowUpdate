"use client";
import React, { useState } from "react";
import OTPForm from "../components/form/forms/OTPForm";
import NewPasswordForm from "../components/form/forms/NewPasswordForm";
import LoginForm from "../components/form/forms/LoginForm";
import Image from "next/image";
import logo from "../../../public/logo.png";
import { apiCall } from "@/utils/utilApi";
import { useRouter } from "next/navigation";
import { getValidationErrorMessage, isValid } from "@/utils/validation";
import { randomBytes, createCipheriv } from "crypto";
import { useErrorMessagesValidationStore } from "@/store/store";
import Spinner from "../components/spinner/Spinner";

type Props = {};
type ErrorMessages = {
  [key: string]: string | boolean;
};

const newErrorMessages: ErrorMessages = {};
type ResponseChallenge = {
  // Define the structure according to your API response
  ChallengeName?: string;
  Session?: string;
  ChallengeParameters?: any;
};

const Page = (props: Props) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [otpValue, setOtpValue] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [btnState, setBtnState] = useState<boolean>(false);
  const [initialLogin, setInitialLogin] = useState<boolean>(false);
  const [otpChallenge, setOtpChallenge] = useState<boolean>(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [responseChallenge, setResponseChallenge] =
    useState<ResponseChallenge | null>(null);
  const router = useRouter();

  const { setErrorMessage, clearErrorMessages } =
    useErrorMessagesValidationStore((state) => state);

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    clearErrorMessages();
    setError("");

    const { id, value } = event.target;
    if (id === "email") setEmail(value.trim());
    if (id === "password") setPassword(value.trim());
  };

  const isValidForm = (fields: {}) => {
    const validationResults = isValid(fields);
    let hasErrors = true;
    const newErrorMessages: ErrorMessages = {}; // Use the interface as the type for newErrorMessages

    for (const key in validationResults) {
      if (validationResults[key] !== true) {
        // Assuming null means no error
        hasErrors = false;
        // newErrorMessages[key] = validationResults[key]; // Collect error messages
        newErrorMessages[key] = getValidationErrorMessage(key); // Collect error messages
        setErrorMessage(key, getValidationErrorMessage(key));
      }
    }

    return hasErrors;
  };

  const encryptPassword = (password: any) => {
    let iv = randomBytes(16);

    const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY ?? "";

    // if(process.env.ENCRYPTION_KEY===undefined) return
    let cipher = createCipheriv(
      "aes-256-cbc",
      Buffer.from(ENCRYPTION_KEY as string, "base64"),
      iv
    );
    let encrypted = cipher.update(password);

    encrypted = Buffer.concat([encrypted, cipher.final()]);
    const encryptedPassword =
      iv.toString("hex") + ":" + encrypted.toString("hex");

    return encryptedPassword;
  };

  interface LoginResponse {
    success: boolean;
    data?: LoginData; // This should be optional since you check its existence
    error?: {
      message?: string;
    };
  }

  interface LoginData {
    ChallengeName?: "CUSTOM_CHALLENGE" | "NEW_PASSWORD_REQUIRED";
  }

  const handleLogin = async (): Promise<void> => {
    setBtnState(true);

    if (!isValidForm({ email, password })) {
      setBtnState(false);
      return;
    }

    try {
      const encryptedPassword = encryptPassword(password);
      const response = (await apiCall("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password: encryptedPassword }),
      })) as LoginResponse; // Ensure that the API call conforms to the LoginResponse interface

      if (!response.success) {
        console.error("Login failed:", response.error?.message);
        setError(response.error?.message || "An unknown error occurred");
        return;
      }

      const data = response.data; // TypeScript now understands the structure of data
      if (!data) return;

      if (data.ChallengeName === "CUSTOM_CHALLENGE") {
        setOtpChallenge(true);
      } else if (data.ChallengeName === "NEW_PASSWORD_REQUIRED") {
        setInitialLogin(true);
      }
    } catch (error: unknown) {
      console.error("Login error:", error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setBtnState(false);
    }
  };
  // type ApiResponse = {
  //   ChallengeName?: string; // Use optional since it might not be present in all responses
  //   // Include other properties as per your API response
  // };

  // // Assuming `apiCall` is a function that fetches data and returns a promise with ApiResponse

  // const handleLogin = async (): Promise<void> => {
  //   setBtnState(true);

  //   if (!isValidForm({ email, password })) {
  //     setBtnState(false);
  //     return;
  //   }

  //   try {
  //     // const response = await fetch("/api/auth", {
  //     //   method: "POST",
  //     //   headers: { "Content-Type": "application/json" },
  //     //   body: JSON.stringify({ email, password }),
  //     // });

  //     const encryptedPassword = encryptPassword(password);
  //     const response = await apiCall("/api/auth", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ email, password: encryptedPassword }),
  //     });
  //     if (!response.success) {
  //       // const errorData = await response.json();
  //       console.error("Login failed:", response?.error?.message);
  //       // setError(response?.error?.message); // Display error message using state
  //       // Inside your function component or relevant function
  //       setError(response?.error?.message || "An unknown error occurred");

  //       return;
  //     }
  //     const data = await response.data;
  //     if (!data) return;
  //     if (data?.ChallengeName === "CUSTOM_CHALLENGE") {
  //       setOtpChallenge(true);
  //     } else if (data?.ChallengeName === "NEW_PASSWORD_REQUIRED")
  //       setInitialLogin(true);
  //   } catch (error: unknown) {
  //     console.error("Login error:", error);
  //     // You should handle the error accordingly, for instance, updating the state
  //     if (error instanceof Error) {
  //       setError(error.message); // Assuming setError is used to update the UI with the error message
  //     } else {
  //       setError("An unknown error occurred");
  //     }
  //   } finally {
  //     setBtnState(false); // Re-enable the button regardless of the outcome
  //     // setError("");
  //   }
  // };

  const handleOnChangeOTP = (event: React.ChangeEvent<HTMLInputElement>) => {
    clearErrorMessages();
    setError("");

    setOtpValue(event.target.value.trim());
  };

  const handleOTPCustomChallenge = async (): Promise<void> => {
    setBtnState(true);
    if (!isValidForm({ otp: otpValue })) {
      setBtnState(false);
      return;
    }
    const body = {
      ChallengeName: "CUSTOM_CHALLENGE",
      // Session: sessionToken,
      email,
      otpValue,
    };
    try {
      const response = await apiCall("/api/auth/otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (!response.success) {
        // Log and set error message. `response.error` is an Error object.
        console.error("Login failed:", response.error?.message);
        // router.back();
        setError(
          "Verification failed. Please try login again. Redirecting  login page..."
        );
        // setError(
        //   response.error?.message || "Verification failed. Please try again."
        // );
        setTimeout(() => {
          setBtnState(false);
          setOtpChallenge(false);
        }, 3000);
      } else {
        // Handle successful verification

        // Redirect using Next.js Router if you are in a Next.js environment
        // Replace with your routing method if different
        router.push("/dashboard");
        // setBtnState(false);
      }
    } catch (error) {
      console.error("Error", error);
      setBtnState(false);
    }
  };

  const handleOnChangeNewPassword = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    clearErrorMessages();
    setError("");
    // setNewPassword(event.target.value);
    setNewPassword(event.target.value);
  };

  const handleNewPassword = async () => {
    setBtnState(true);

    if (!isValidForm({ password: newPassword })) {
      setBtnState(false);
      return;
    }

    const encryptedPassword = encryptPassword(newPassword);

    const body = {
      ChallengeName: "NEW_PASSWORD_REQUIRED",
      // Session: sessionToken,
      email,
      newPassword: encryptedPassword,
    };
    try {
      const response = await apiCall("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (!response.success) {
        // Log and set error message. `response.error` is an Error object.
        console.error("New password failed:", response.error?.message);
        // router.back();
        setError(response.error?.message || "Please try again later.");
        throw new Error(response.error?.message);
      } else if (response?.success) {
        // setError("Password has been change,redirect to login screen");
        setMessage("New password set. Redirecting to login...");
        setTimeout(() => {
          setInitialLogin(false);
          setMessage("");
          setBtnState(false);
        }, 3500);
        // Handle successful verification

        // Redirect using Next.js Router if you are in a Next.js environment
        // Replace with your routing method if different
      }
    } catch (error) {
      console.error("Error", error);
      setBtnState(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="w-full max-w-sm bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <Image src={logo} alt="Logo" className="m-4" />

        {otpChallenge ? (
          <OTPForm
            handleOnChange={handleOnChangeOTP}
            handleLogin={handleOTPCustomChallenge}
            btnState={btnState}
          />
        ) : initialLogin ? (
          <NewPasswordForm
            handleOnChange={handleOnChangeNewPassword}
            handleLogin={handleNewPassword}
            btnState={btnState}
            message={message}
          />
        ) : (
          <LoginForm
            handleOnChange={handleOnChange}
            handleLogin={handleLogin}
            btnState={btnState}
          />
        )}

        {error && (
          <div className="text-sm font-bold  flex items-center justify-center flex-col mt-2">
            <p className="text-red-500">{error}</p>
            <div className="text-slate-500	 flex space-x-2  justify-center items-center mt-2 bg-white  dark:invert">
              {otpChallenge && <Spinner width="8" height="8" />}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Page;
