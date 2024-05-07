// utils/auth.ts
import jwt from "jsonwebtoken";

export function isTokenExpired(token: string) {
  if (!token) return true;
  const decoded: any = jwt.decode(token);
  if (!decoded || typeof decoded !== "object") return true;
  const currentTime = Math.floor(Date.now() / 1000);

  return decoded.exp < currentTime;
}
