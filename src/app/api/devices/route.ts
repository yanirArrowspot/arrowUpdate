import type { NextApiRequest, NextApiResponse } from "next";
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  RespondToAuthChallengeCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { NextRequest, NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { IoTClient, ListThingsCommand } from "@aws-sdk/client-iot"; // ES Modules import

export async function GET(req: NextRequest, res: NextApiResponse) {
  // cookies().set("access-token", "we did it");
  const token = cookies().get("token")?.value;
  if (!token) {
    throw new Error();
  }

  try {
    const response = await fetch(`${process.env.API_URL}/dev/devices`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    // Handle the response (e.g., successful authentication or further action required)
    return NextResponse.json(data, {
      status: 200,
    });

    return new Response(
      JSON.stringify({
        message: response.statusText,
        data,
      }),
      {
        status: response.status,
        headers: {
          "Content-Type": "application/json",
        },
      } // handle otp screen
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
