export const errorHandler = (err, req, res, next) => {
  console.error("Unhandled error:", err);

  if (err.name === "ZodError") {
    const details = err.issues?.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    })) || [{ message: "Request validation failed" }];

    return res.status(400).json({
      error: "Validation failed",
      details,
    });
  }

  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ error: "Validation failed", details: messages });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(409).json({ error: `Duplicate value for ${field}` });
  }

  if (err.code?.startsWith("auth/")) {
    return res.status(401).json({ error: err.message });
  }

  if (err.message === "CORS origin not allowed") {
    return res.status(403).json({ error: "Request origin is not allowed" });
  }

  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === "production" ? "Internal server error" : (err.message || "Internal server error"),
  });
};
