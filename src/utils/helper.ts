import multer from "multer";
import { URL } from "url";

export const setValueInRedisWithExp = async (
  redisObj: any,
  key: any,
  exp: any,
  value: any
) => {
  return redisObj.setex(key, exp, JSON.stringify(value));
};

export const getValueInRedis = async (redisObj: any, key: any) => {
  const resp = await new Promise((resolve, reject) => {
    redisObj.get(key, async (err: any, resp: any) => {
      if (err) {
        return reject(err);
      } else {
        return resolve(resp);
      }
    });
  }); 
  return resp;
};

export const getPath = (url: string) => {
  return new URL(url).pathname;
};

//Configuration for Multer
export const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `files/user-${file.fieldname}-${Date.now()}.${ext}`);
  },
});