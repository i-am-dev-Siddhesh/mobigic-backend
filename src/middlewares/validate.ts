import { NextFunction, Request, Response } from "express";

export const validate =
  (schema: any) => (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);

    if (error) {
      res.status(422).json({ message: error?.details[0].message });
    } else {
      next();
    }
  };
