"use client";
import React, { useState, useEffect, use } from "react";
import Image from "next/image";

import logo from "../../public/logo.png";
import { useRouter } from "next/navigation";
import Spinner from "./components/spinner/Spinner";
import { useUserStore } from "../store/store";
import LoginPage from "../app/login/page";
import { apiCall } from "@/utils/utilApi";
import { randomBytes, pbkdf2Sync } from "crypto";
import Head from "next/head";
export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [initialLogin, setInitialLoginLogin] = useState(false);
  const [responseChallenge, setResponseChallenge] = useState();
  const [otpChallenge, setOtpChallenge] = useState(false);
  const [OTPValue, setOTPValue] = useState("");
  const [sessionToken, setSessionToken] = useState("");
  const [btnState, setBtnState] = useState(false);
  const router = useRouter();

  const setUser = useUserStore((state) => state.setUser);

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.target.id === "email"
      ? setEmail(event.target.value)
      : setPassword(event.target.value);
  };
  const handleOnChangeNewPassword = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewPassword(event.target.value);
  };
  const handleOnChangeOTP = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOTPValue(event.target.value);
  };

  // const handleLogin = async () => {
  //   setBtnState(true);
  //   try {
  //     // const response = await fetch("/api/auth", {
  //     //   method: "POST",
  //     //   headers: {
  //     //     "Content-Type": "application/json",
  //     //   },
  //     //   body: JSON.stringify({ email, password }),
  //     // });
  //     const response = await apiCall("/api/auth", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ email, password }),
  //     });
  //     if (response.success) {
  //       setInitialLoginLogin(true);
  //       const responseData = await response.json();
  //       setResponseChallenge({ ...responseData });
  //       const { ChallengeName, Session, ChallengeParameters } =
  //         responseData.data;

  //       if (
  //         ChallengeName === "CUSTOM_CHALLENGE" ||
  //         responseData.message === "CUSTOM_CHALLENGE"
  //       ) {
  //         setSessionToken(Session);
  //         setOtpChallenge(true);
  //       }
  //       // Handle NEW_PASSWORD_REQUIRED challenge
  //       // For example, prompt user for a new password and call another API to confirm the new password with the session token
  //     } else {
  //       // Handle errors
  //       console.error("Login failed");
  //     }
  //   } catch (error) {
  //     console.error("Error during fetch:", error);
  //   } finally {
  //     setBtnState(false);
  //   }
  //   // Handle response
  // };
  // const handleOTPCustomChallenge = async () => {
  //   setBtnState(true);
  //   const body = {
  //     ChallengeName: "CUSTOM_CHALLENGE",
  //     Session: sessionToken,
  //     email,
  //     OTPValue,
  //   };
  //   try {
  //     // const response = await fetch("/api/auth/otp", {
  //     //   method: "POST",
  //     //   headers: {
  //     //     "Content-Type": "application/json",
  //     //   },
  //     //   body: JSON.stringify(body),
  //     // });

  //     const response = await apiCall("/api/auth/otp", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(body),
  //     });
  //     if (response.success) {
  //       setUser(email);
  //       setInitialLoginLogin(true);
  //       const data = await response.json();
  //       setResponseChallenge({ ...data });

  //       if (data.ChallengeName === "RESPONSE_TO_CUSTOM_CHALLENGE")
  //         setOtpChallenge(true);

  //       if (typeof window !== "undefined") {
  //         // router.push("/dashboard");
  //         setBtnState(false);
  //         // localStorage.setItem(
  //         //   "token",
  //         //   data.data.AuthenticationResult.AccessToken
  //         // );
  //         // setSessionToken(data.data.AuthenticationResult.AccessToken);
  //       }

  //       // Handle NEW_PASSWORD_REQUIRED challenge
  //       // For example, prompt user for a new password and call another API to confirm the new password with the session token
  //     } else {
  //       // Handle errors
  //       console.error("Login failed");
  //     }
  //   } catch (error) {
  //     console.error("Error during fetch:", error);
  //   } finally {
  //     setBtnState(false);
  //   }
  //   // Handle response
  // };

  const handleNewPassword = async () => {
    return;
    if (!responseChallenge) return;
    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ responseChallenge, newPassword, email }),
      });
      if (response.ok) {
        const data = await response.json();
        setInitialLoginLogin(false);
        // Handle NEW_PASSWORD_REQUIRED challenge
        // For example, prompt user for a new password and call another API to confirm the new password with the session token
      } else {
        // Handle errors
        console.error("Login failed");
      }
    } catch (error) {
      console.error("Error during fetch:", error);
    }
    // Handle response
  };

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=0"
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        {/* <link
          rel="icon"
          href="/icon?<generated>"
          type="image/png"
          sizes="32x32"
        /> */}
        {/* <link rel="shortcut icon" href="/public/icon.png" /> */}
      </Head>
      <LoginPage />
    </>
    // <main className="flex min-h-screen flex-col items-center justify-between p-24">
    //   {/* <div className="z-10 max-w-5xl w-full items-center justify-center  text-sm lg:flex">
    //     <form className="flex flex-col justify-between gap-10" action="">
    //       <div className="flex flex-row-reverse  border-cyan-800 border">
    //         <label htmlFor="">@arrowspot.com</label>
    //         <input type="text" placeholder="username" className=""/>
    //       </div>
    //       <div className="flex flex-col text-center">
    //         {/* <label htmlFor="">Password</label> */}
    //   <div className="w-full max-w-sm">
    //     {otpChallenge ? (
    //       OTPForm
    //     ) : (
    //       <>{initialLogin ? newPasswordForm : loginForm}</>
    //     )}
    //   </div>
    // </main>
  );
}
