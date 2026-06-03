export const errorHandler = (err, req, res, _next) => {
  if (err?.status >= 500 || (!err?.status && !err?.statusCode)) {
    console.error("Unhandled error:", err);
  }

  if (err?.name === "ZodError") {
    const details = err.issues?.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    })) || [{ message: "Request validation failed" }];

    return res.status(400).json({
      error: "Validation failed",
      details,
    });
  }

  if (err?.name === "ValidationError") {
    const messages = Object.values(err.errors || {}).map((e) => e.message);
    return res.status(400).json({ error: "Validation failed", details: messages });
  }

  // Mongoose cast error (e.g. invalid ObjectId in a URL param).
  if (err?.name === "CastError") {
    return res.status(400).json({
      error: `Invalid value for "${err.path}"`,
    });
  }

  if (err?.code === 11000) {
    const field = err.keyPattern ? Object.keys(err.keyPattern)[0] : "field";
    return res.status(409).json({ error: `Duplicate value for ${field}` });
  }

  if (typeof err?.code === "string" && err.code.startsWith("auth/")) {
    return res.status(401).json({ error: err.message });
  }

  if (err?.message === "CORS origin not allowed") {
    return res.status(403).json({ error: "Request origin is not allowed" });
  }

  // MongoDB / Mongoose connectivity issues bubble up here.
  if (
    err?.name === "MongooseServerSelectionError" ||
    err?.name === "MongoNetworkError" ||
    err?.name === "MongoServerSelectionError" ||
    err?.name === "MongoNotConnectedError" ||
    err?.name === "MongooseError" ||
    /Client must be connected before running operations/i.test(String(err?.message)) ||
    /before initial connection is complete/i.test(String(err?.message))
  ) {
    return res.status(503).json({
      error: "Database is temporarily unavailable. Please retry shortly.",
    });
  }

  const status = err?.status || err?.statusCode || 500;
  const isProd = process.env.NODE_ENV === "production";
  const fallback = status >= 500 ? "Internal server error" : "Request failed";

  res.status(status).json({
    error: isProd && status >= 500
      ? fallback
      : err?.message || fallback,
  });
};
