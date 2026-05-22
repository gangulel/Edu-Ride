import { ZodError } from "zod";

export const validate = (schemas = {}) => {
  const { body, query, params } = schemas;

  return (req, _res, next) => {
    try {
      if (body) {
        req.body = body.parse(req.body);
      }

      if (query) {
        const parsedQuery = query.parse(req.query);

        // Express 5 exposes req.query via a getter, so mutate the object
        // instead of reassigning the property.
        for (const key of Object.keys(req.query)) {
          delete req.query[key];
        }
        Object.assign(req.query, parsedQuery);
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
