import crypto from "crypto";

const TOKEN_PREFIX = "eduride-mobile";
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

function getSecret() {
  return process.env.MOBILE_TOKEN_SECRET || process.env.ADMIN_PANEL_TOKEN_SECRET || null;
}

export function createMobileSessionToken(user) {
  const secret = getSecret();
  if (!secret) return null;

  const payload = {
    type: "mobile",
    id: String(user._id || user.id),
    role: user.role,
    email: user.email,
    exp: Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS,
  };

  const encodedPayload = toBase64Url(JSON.stringify(payload));
  const signature = crypto
    .createHmac("sha256", secret)
    .update(encodedPayload)
    .digest("hex");

  return `${TOKEN_PREFIX}.${encodedPayload}.${signature}`;
}

export function verifyMobileSessionToken(token) {
  if (!token || typeof token !== "string") return null;

  const secret = getSecret();
  if (!secret) return null;

  const parts = token.split(".");
  if (parts.length !== 3 || parts[0] !== TOKEN_PREFIX) return null;

  const encodedPayload = parts[1];
  const receivedSig = parts[2];
  const expectedSig = crypto
    .createHmac("sha256", secret)
    .update(encodedPayload)
    .digest("hex");

  if (receivedSig !== expectedSig) return null;

  try {
    const payload = JSON.parse(fromBase64Url(encodedPayload));
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now || payload.type !== "mobile") return null;
    return payload;
  } catch {
    return null;
  }
}
