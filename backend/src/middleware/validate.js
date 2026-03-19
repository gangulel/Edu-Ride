import { ZodError } from "zod";

export const validate = (schemas = {}) => {
  const { body, query, params } = schemas;

  return (req, _res, next) => {
    try {
      if (body) {
        req.body = body.parse(req.body);
      }

      if (query) {
        req.query = query.parse(req.query);
      }

      if (params) {
        req.params = params.parse(req.params);
      }

      next();
    } catch (err) {
      if (err instanceof ZodError) {
        err.status = 400;
      }
      next(err);
    }
  };
};
