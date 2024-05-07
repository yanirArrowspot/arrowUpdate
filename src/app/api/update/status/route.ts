import type { NextApiResponse } from "next";

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: NextRequest, res: NextApiResponse) {
  const token = cookies().get("token")?.value;
  if (!token) {
    throw new Error();
  }

  try {
    const response = await fetch(`${process.env.API_URL}/dev/status`, {
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
