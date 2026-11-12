
import { createHmac, randomInt, timingSafeEqual } from "crypto";

const secret = process.env.OTP_SECRET;

if (!secret) {
  throw new Error("OTP_SECRET environment variable is missing");
}

export function generateOTP(): string {
  return randomInt(100000, 1000000).toString();
}

export function hashOTP(otp: string): string {
  return createHmac("sha256", secret!)
    .update(otp)
    .digest("hex");
}

export function verifyOTPHash(
  otp: string,
  storedHash: string
): boolean {
  const calculatedHash = Buffer.from(hashOTP(otp), "hex");
  const savedHash = Buffer.from(storedHash, "hex");

  if (calculatedHash.length !== savedHash.length) {
    return false;
  }

  return timingSafeEqual(calculatedHash, savedHash);
}
