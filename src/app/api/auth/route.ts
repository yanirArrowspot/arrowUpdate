// Import NextRequest and NextResponse from Next.js 14 (if you're using middleware, otherwise, you'll use the standard req, res)
import { NextRequest, NextResponse } from "next/server";

// This is an API route in Next.js
export async function POST(req: NextRequest) {
  const body = await req.json();

  const session = req.cookies.get("session")?.value;
  const headers: any = {
    "Content-Type": "application/json",
  };
  if (body.ChallengeName === "NEW_PASSWORD_REQUIRED")
    headers["Session"] = session;

  try {
    const response = await fetch(
      `${process.env.API_URL}/dev/auth`,
      // "https://n4k59xn7r1.execute-api.eu-central-1.amazonaws.com/dev/auth",
      {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      }
    );

    // Handle the Set-Cookie header if present
    const setCookieHeader = response.headers.get("Set-Cookie");
    const data = await response.json();
    // Construct and return the response to the client
    // Note: Adjust according to your actual use case
    if (response.ok && setCookieHeader) {
      // Note: In Next.js API routes, you directly work with res to set headers
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: {
          "Set-Cookie": setCookieHeader,
          "Content-Type": "application/json",
        },
      });
    } else {
      // Handle error or different response scenarios here
      return new Response(JSON.stringify(data), {
        status: response.status || 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.log("Error:", error);
    return new Response(
      JSON.stringify({
        message: "Authentication failed",
        error: error?.toString(),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
