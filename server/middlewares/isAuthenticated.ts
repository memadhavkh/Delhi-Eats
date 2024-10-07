import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { CustomRequest } from "../types/types";
// Some advanced stuff: Do check a look

export const isAuthenticated = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies.token;
    if (!token) {
      res.status(401).json({
        success: false,
        error: "Not Authenticated",
      });
      return;
    } else {
      // verify token
      const decode = jwt.verify(
        token,
        process.env.SECRET_KEY!
      ) as jwt.JwtPayload;
      // check if token is valid
      if (!decode) {
        res.status(401).json({
          success: false,
          error: "Token is not valid",
        });
        return;
      }
      req.id = decode.userId;
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
    return;
  }
};
