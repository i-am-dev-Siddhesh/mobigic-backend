"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const connect_redis_1 = __importDefault(require("connect-redis"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const ioredis_1 = __importDefault(require("ioredis"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const generalRoutes_1 = __importDefault(require("./routes/generalRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const constants_1 = require("./utils/constants");
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    dotenv_1.default.config();
    const app = (0, express_1.default)();
    const PORT = process.env.PORT || 8000;
    app.use(express_1.default.json());
    app.set("trust proxy", 1);
    app.use(body_parser_1.default.json());
    app.use((0, cookie_parser_1.default)());
    app.use((0, cors_1.default)({
        origin: [process.env.CLIENT_URL],
        methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD", "DELETE"],
        credentials: true,
    }));
    const RedisStore = (0, connect_redis_1.default)(express_session_1.default);
    const redis = new ioredis_1.default(process.env.REDIS_URL);
    app.use((0, express_session_1.default)({
        name: constants_1.tokenKey,
        proxy: constants_1.__prod__,
        store: new RedisStore({
            client: redis,
        }),
        cookie: {
            maxAge: constants_1.tokenExp,
            httpOnly: true,
            sameSite: "lax",
            secure: constants_1.__prod__,
            domain: constants_1.__prod__ ? process.env.COOKIE_DOMAIN : undefined,
        },
        saveUninitialized: false,
        secret: process.env.SESSION_SECRET,
        resave: false,
    }));
    app.use((req, _res, next) => {
        req.redis = redis;
        next();
    });
    app.use("/v1", generalRoutes_1.default);
    app.use("/v1/auth", authRoutes_1.default);
    app.use("/v1/user", userRoutes_1.default);
    app.listen(PORT, () => console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`));
});
main().catch((err) => {
    console.log("Error Occurred:", err);
    process.exit(1);
});
