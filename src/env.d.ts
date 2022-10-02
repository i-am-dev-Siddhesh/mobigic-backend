import { Session } from "express-session";

declare namespace NodeJS {
  interface ProcessEnv {
    PORT: string;
    API_KEY: string;
    CLIENT_URL: string;
    DATABASE_URL: string;
    SESSION_SECRET: string;
    REDIS_URL: string;
    COOKIE_DOMAIN: string;
  }
}

declare namespace Express {
  export interface Request {
    session: Session;
  }
}
