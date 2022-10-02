import bodyParser from "body-parser";
import connectRedis from "connect-redis";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { Express } from "express";
import session from "express-session";
import Redis from "ioredis";
import authRoutes from "./routes/authRoutes";
import generalRoutes from "./routes/generalRoutes";
import userRoutes from "./routes/userRoutes";
import { tokenExp, tokenKey, __prod__ } from "./utils/constants";

const main = async () => {
  dotenv.config();
  const app: Express = express();
  const PORT = process.env.PORT || 8000;

  app.use(express.json());

  app.set("trust proxy", 1);

  app.use(bodyParser.json());

  app.use(cookieParser());

  app.use(
    cors({
      origin: [process.env.CLIENT_URL!],
      methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD", "DELETE"],
      credentials: true,
    })
  );

  const RedisStore = connectRedis(session);
  const redis = new Redis(process.env.REDIS_URL!);

  app.use(
    session({
      name: tokenKey,
      proxy: __prod__,
      store: new RedisStore({
        client: redis,
      }),
      cookie: {
        maxAge: tokenExp,
        httpOnly: true,
        sameSite: "lax",
        secure: __prod__,
        domain: __prod__ ? process.env.COOKIE_DOMAIN : undefined,
      },
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET!,
      resave: false,
    })
  );
  app.use((req, _res, next) => {
    req.redis = redis;
    next();
  });

  app.use("/v1", generalRoutes);
  app.use("/v1/auth", authRoutes);
  app.use("/v1/user", userRoutes);

  app.listen(PORT, () =>
    console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`)
  );
};

main().catch((err) => {
  console.log("Error Occurred:", err);
  process.exit(1);
});
