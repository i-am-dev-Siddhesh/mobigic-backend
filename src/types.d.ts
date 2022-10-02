import { Redis } from "ioredis";
import { User } from "./utils/types";

declare global {
  namespace Express {
    interface Request {
      redis?: Redis;
      user: User;
    }
  }
}
