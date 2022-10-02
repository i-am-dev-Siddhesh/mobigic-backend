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
exports.multerStorage = exports.getPath = exports.getValueInRedis = exports.setValueInRedisWithExp = void 0;
const multer_1 = __importDefault(require("multer"));
const url_1 = require("url");
const setValueInRedisWithExp = (redisObj, key, exp, value) => __awaiter(void 0, void 0, void 0, function* () {
    return redisObj.setex(key, exp, JSON.stringify(value));
});
exports.setValueInRedisWithExp = setValueInRedisWithExp;
const getValueInRedis = (redisObj, key) => __awaiter(void 0, void 0, void 0, function* () {
    const resp = yield new Promise((resolve, reject) => {
        redisObj.get(key, (err, resp) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                return reject(err);
            }
            else {
                return resolve(resp);
            }
        }));
    });
    return resp;
});
exports.getValueInRedis = getValueInRedis;
const getPath = (url) => {
    return new url_1.URL(url).pathname;
};
exports.getPath = getPath;
//Configuration for Multer
exports.multerStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public");
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split("/")[1];
        cb(null, `files/user-${file.fieldname}-${Date.now()}.${ext}`);
    },
});
