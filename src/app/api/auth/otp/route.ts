import type { NextApiRequest, NextApiResponse } from "next";
import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";
import { NextRequest } from "next/server";
import { redirect } from "next/navigation";

const client = new CognitoIdentityProviderClient({
  region: "eu-central-1",
});

const maxAge = 3600; //60 minutes
export async function POST(req: NextRequest) {
  const body = await req.json();
  // const { email, ChallengeName, Session, OTPValue } = body;
  // console.log("getSetCookie", req.headers.getSetCookie());
  // const session = req.cookies.get("session")?.value;
  const session = req.cookies.get("session")?.value;
  const setCookieHeader = req.headers.get("Set-Cookie");

  // const session = req.headers.get("Set-Cookie");
  if (!session || session.length === 0) {
    console.error("Session is missing");
    return new Response("Unauthorized", { status: 401 });
  }
  try {
    const response = await fetch(`${process.env.API_URL}/dev/auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Session: session,
      },
      body: JSON.stringify(body),
    });

    const token = response.headers.get("Set-Cookie");
    if (!token || token.length === 0) {
      console.error("Session is missing 2");
      return new Response("Unauthorized", { status: 401 });
    }
    return new Response(
      JSON.stringify({
        message: "OTP verified",
        // Do not send the token in the response body if using HttpOnly cookies
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": token,
        },
      }
    );
  } catch (error) {
    console.log(error);
    return new Response(
      JSON.stringify({
        message: "Authentication failed",
        error: error?.toString(),
      }),
      {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
