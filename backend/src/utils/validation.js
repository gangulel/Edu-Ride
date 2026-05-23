export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_REGEX = /^\+?\d{7,15}$/;
export const TIME_24H_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;
export const LICENSE_PLATE_REGEX = /^[A-Z0-9 -]{5,12}$/;
export const VIN_REGEX = /^[A-HJ-NPR-Z0-9]{11,17}$/;

export function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function parsePagination(page, limit, maxLimit = 1000) {
  const parsedPage = Math.max(parseInt(page, 10) || 1, 1);
  const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 20, 1), maxLimit);

  return {
    page: parsedPage,
    limit: parsedLimit,
    skip: (parsedPage - 1) * parsedLimit,
  };
}

export function sanitizeNoSqlInput(value) {
  if (Array.isArray(value)) {
    return value.map((item) => sanitizeNoSqlInput(item));
  }

  if (!value || typeof value !== "object") {
    return value;
  }

  return Object.entries(value).reduce((acc, [key, nestedValue]) => {
    // Drop keys that can be interpreted as MongoDB operators.
    if (key.startsWith("$") || key.includes(".")) {
      return acc;
    }

    acc[key] = sanitizeNoSqlInput(nestedValue);
    return acc;
  }, {});
}

export function isFutureDate(dateValue) {
  const date = new Date(dateValue);
  return !Number.isNaN(date.getTime()) && date.getTime() > Date.now();
}

export function isValidObjectIdString(value) {
  return typeof value === "string" && /^[a-f\d]{24}$/i.test(value.trim());
}
