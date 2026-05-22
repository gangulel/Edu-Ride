import crypto from "crypto";

const TOKEN_PREFIX = "eduride-admin";
const TOKEN_TTL_SECONDS = 60 * 60 * 12;

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

function getTokenSecret(required = false) {
  if (!process.env.ADMIN_PANEL_TOKEN_SECRET) {
    if (!required) {
      return null;
    }

    throw new Error("ADMIN_PANEL_TOKEN_SECRET is required for admin session tokens");
  }

  return process.env.ADMIN_PANEL_TOKEN_SECRET;
}

export function createAdminSessionToken(adminUser) {
  const payload = {
    role: "admin",
    email: adminUser.email,
    fullName: adminUser.fullName,
    id: String(adminUser.id),
    exp: Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS,
  };

  const encodedPayload = toBase64Url(JSON.stringify(payload));
  const signature = crypto
    .createHmac("sha256", getTokenSecret(true))
    .update(encodedPayload)
    .digest("hex");

  return `${TOKEN_PREFIX}.${encodedPayload}.${signature}`;
}

export function verifyAdminSessionToken(token) {
  if (!token || typeof token !== "string") {
    return null;
  }

  const secret = getTokenSecret();
  if (!secret) {
    return null;
  }

  const parts = token.split(".");
  if (parts.length !== 3 || parts[0] !== TOKEN_PREFIX) {
    return null;
  }

  const encodedPayload = parts[1];
  const receivedSignature = parts[2];

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(encodedPayload)
    .digest("hex");

  if (receivedSignature !== expectedSignature) {
    return null;
  }

  try {
    const payload = JSON.parse(fromBase64Url(encodedPayload));
    const now = Math.floor(Date.now() / 1000);

    if (payload.exp < now || payload.role !== "admin") {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}