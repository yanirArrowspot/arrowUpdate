import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// Function to check if the JWT token has expired
function isTokenExpired(token: string) {
  if (!token) return true; // Assume expired if no token is provided
  const decoded: any = jwt.decode(token);
  const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
  return !decoded || decoded.exp < currentTime;
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value || ""; // Fallback to an empty string if token is undefined
  // Check if the token is expired or not provided
  const expiredOrNotProvided = isTokenExpired(token);

  // Redirect based on token status and requested path
  if (
    !expiredOrNotProvided &&
    !request.nextUrl.pathname.startsWith("/dashboard")
  ) {
    // User has a valid token but is not on the dashboard page, redirect them to the dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (expiredOrNotProvided && request.nextUrl.pathname !== "/") {
    // User's token is expired or not provided, and they're trying to access a protected route, redirect them to the home/login page
    return NextResponse.redirect(new URL("/", request.url));
  }

  // For all other cases, do nothing and let the request proceed as normal
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|.*\\.png$).*)",
    // "/api/:update*",

    // "/api/update/:path*",
  ],
};

// export const config = {
//   matcher: [
//     "/api/devices/:path*",
//     "/api/update/:path*",
//     "/dashboard/:path*", // Assuming you want to protect dashboard routes as well
//     "/", // For the root, if it's also a protected route
//   ],
// };
