import { sanitizeNoSqlInput } from "../utils/validation.js";

function replaceObjectContents(target, source) {
  for (const key of Object.keys(target)) {
    delete target[key];
  }

  if (source && typeof source === "object") {
    Object.assign(target, source);
  }
}

export const sanitizeRequest = (req, _res, next) => {
  req.body = sanitizeNoSqlInput(req.body);

  const sanitizedQuery = sanitizeNoSqlInput(req.query);
  if (req.query && typeof req.query === "object") {
    replaceObjectContents(req.query, sanitizedQuery);
  }

  const sanitizedParams = sanitizeNoSqlInput(req.params);
  if (req.params && typeof req.params === "object") {
    replaceObjectContents(req.params, sanitizedParams);
  }

  next();
};
