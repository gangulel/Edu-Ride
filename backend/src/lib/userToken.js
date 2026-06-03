// Lightweight HMAC-signed token for mobile users. Same shape as the admin
// session token (prefix.base64payload.signature) so the existing
// adminSessionToken middleware patterns transfer 1-to-1. No external JWT
// library — we already have `crypto`.
import crypto from "crypto";

const TOKEN_PREFIX = "eduride-user";
const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days

function toBase64Url(input) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function fromBase64Url(input) {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "===".slice((normalized.length + 3) % 4);
  return Buffer.from(padded, "base64").toString("utf8");
}

function getSecret(required = false) {
  const secret =
    process.env.USER_TOKEN_SECRET ||
    process.env.ADMIN_PANEL_TOKEN_SECRET ||
    process.env.JWT_SECRET;
  if (!secret) {
    if (!required) return null;
    throw new Error(
      "USER_TOKEN_SECRET (or JWT_SECRET) is required to sign user tokens."
    );
  }
  return secret;
}

export function createUserToken(user, options = {}) {
  const ttl = options.ttlSeconds || TOKEN_TTL_SECONDS;
  const payload = {
    sub: String(user._id || user.id),
    email: user.email,
    role: user.role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + ttl,
  };

  const encodedPayload = toBase64Url(JSON.stringify(payload));
  const signature = crypto
    .createHmac("sha256", getSecret(true))
    .update(encodedPayload)
    .digest("hex");

  return `${TOKEN_PREFIX}.${encodedPayload}.${signature}`;
}

export function verifyUserToken(token) {
  if (!token || typeof token !== "string") return null;

  const secret = getSecret();
  if (!secret) return null;

  const parts = token.split(".");
  if (parts.length !== 3 || parts[0] !== TOKEN_PREFIX) return null;

  const [, encodedPayload, receivedSignature] = parts;
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(encodedPayload)
    .digest("hex");

  // Constant-time compare to avoid timing leaks.
  const a = Buffer.from(receivedSignature, "hex");
  const b = Buffer.from(expectedSignature, "hex");
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

  try {
    const payload = JSON.parse(fromBase64Url(encodedPayload));
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}
