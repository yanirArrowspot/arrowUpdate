import { NextRequest, NextResponse } from "next/server";

import { cookies } from "next/headers";
import { isTokenExpired } from "../../../../utils/auth";

type CustomResponse = {
  message: string;
  statusCode: number;
};

type updateData = {
  devices: [];
  version: string;
  creator: string;
  date: Date;
  ts: Number;
};

type tDevice = {
  attributes: {};
  thingArn: "";
  thingName: "";
  thingTypeName: "";
  version: number;
};

type JobsToCancel = {
  [thingName: string]: string[]; // Assuming each job is identified by a string ID
};

const createUpdate = async (data: updateData, token: string) => {
  if (!data.devices || data.devices.length === 0)
    return {
      message: "Please chose devices",
      statusCode: 400,
    };

  const { devices, version = "", creator = "" } = data;
  if (!version) {
    return {
      message: "Version is required",
      statusCode: 400,
    };
  }

  const matchResults = version.match(/\d+/g);
  const versionNumber = matchResults ? matchResults.join("") : "";

  const jobId = crypto.randomUUID().replaceAll("-", "").slice(-16);
  // const jobId = uuidv4().replaceAll("-", "").slice(-16);
  const body = {
    // url: "sw.atupdate.arrowspot.com",
    // port: "21",
    // user: "arrowspot",
    // password: "~YWK$HA[U;#%7JI&",
    devices,
    directory: "/dryvan/updates",
    file: version,
    // file: `DV_V${version}.bin`,
    version: versionNumber,
    id: jobId,
    type: "00",
    createdBy: creator,
  };

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/dev/update/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      }
    );
    if (response.status !== 200) throw Error();
    const data = await response.json();

    return {
      message: response.statusText,
      statusCode: response.status,
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
        status: 500,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
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
  const response = await createUpdate(body, token);
  // Respond with JSON
  // Directly assert the type when you're sure of it
  return new Response(
    JSON.stringify({
      message: (response as CustomResponse).message,
      status: (response as CustomResponse).statusCode,
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );

  // return new Response(
  //   JSON.stringify({
  //     message: response?.message,
  //     status: response?.statusCode,
  //   }),
  //   { status: 200, headers: { "Content-Type": "application/json" } }
  // );
}
