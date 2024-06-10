import { NextRequest, NextResponse } from "next/server";

import { cookies } from "next/headers";
import { isTokenExpired } from "@/utils/auth";

type CustomResponse = {
  message: string;
  statusCode: number;
};

type updateData = {
  deviceIds: [];
  command: string;
};

type JobsToCancel = {
  [thingName: string]: string[]; // Assuming each job is identified by a string ID
};

const submitSMS = async (data: updateData, token: string) => {
  console.log({ data });
  console.log({ token });
  if (!data || data?.deviceIds.length === 0)
    return {
      message: "Please chose devices",
      statusCode: 400,
    };

  const { deviceIds, command } = data;
  if (!command) {
    return {
      message: "command is required",
      statusCode: 400,
    };
  }

  // const matchResults = version.match(/\d+/g);
  // const versionNumber = matchResults ? matchResults.join("") : "";

  // const jobId = uuidv4().replaceAll("-", "").slice(-16);
  const body = {
    // url: "sw.atupdate.arrowspot.com",
    // port: "21",
    // user: "arrowspot",
    // password: "~YWK$HA[U;#%7JI&",
    devices: deviceIds,
    command,
    // file: `DV_V${version}.bin`,
  };

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/dev/sms/submit`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      }
    );
    console.log({ response });
    if (response.status !== 200) throw Error();
    const data = await response.json();

    const dataBody = JSON.parse(data.body);
    console.log({ dataBody });

    console.log({ data });
    if (data.statusCode !== 200)
      return {
        message: "Something went wroung",
        statusCode: 500,
      };

    return {
      message: response.statusText,
      statusCode: response.status,
      failedFoundSimNumbers: dataBody.failedFoundSimNumbers,
      deviceFailedSMS: dataBody.deviceFailedSMS,
      deviceSucceedSMS: dataBody.deviceSucceedSMS,
    };

    return {
      message: data.statusText,
      statusCode: response.status,
      body: data,
    };
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
    console.log(JSON.stringify(error));
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
};

export async function POST(req: NextRequest) {
  const token = cookies().get("token")?.value;

  // Redirect if no token or token is expired
  if (!token || isTokenExpired(token)) {
    const url = req.nextUrl.clone().origin;
    // url.pathname = "/";
    return new Response(
      JSON.stringify({
        message: "Unauthorized",
        status: 401,
      })
    );
    return NextResponse.redirect(new URL("/", url));

    return NextResponse.rewrite(url);
    return NextResponse.redirect("/");
    NextResponse.redirect(new URL("/", req.url));
    // Assuming req.url is not needed for redirect URL construction
    return NextResponse.redirect("/");
  }

  // Proceed with the request handling
  const body = await req.json();
  const data = await submitSMS(body, token);
  // Respond with JSON
  // Directly assert the type when you're sure of it
  return NextResponse.json(data, {
    status: 200,
  });

  // const data = await response.json();
  // Handle the response (e.g., successful authentication or further action required)
  return NextResponse.json(data, {
    status: 200,
  });

  // return new Response(
  //   JSON.stringify({
  //     message: (response as CustomResponse).message,
  //     status: (response as CustomResponse).statusCode,
  //   }),
  //   { status: 200, headers: { "Content-Type": "application/json" } }
  // );

  // return new Response(
  //   JSON.stringify({
  //     message: response?.message,
  //     status: response?.statusCode,
  //   }),
  //   { status: 200, headers: { "Content-Type": "application/json" } }
  // );
}
