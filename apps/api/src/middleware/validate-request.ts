import type { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { ValidationError } from "../utils/app-error";

export function validate<T>(schema: ZodSchema<T>, source: "body" | "params" | "query" = "body") {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const data = schema.parse(req[source]);
      req[source] = data;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((e) => {
          const path = e.path.join(".");
          return path ? `${path}: ${e.message}` : e.message;
        });
        throw new ValidationError(errors);
      }
      throw error;
    }
  };
}

export function validateBody<T>(schema: ZodSchema<T>) {
  return validate(schema, "body");
}

export function validateParams<T>(schema: ZodSchema<T>) {
  return validate(schema, "params");
}

export function validateQuery<T>(schema: ZodSchema<T>) {
  return validate(schema, "query");
}
