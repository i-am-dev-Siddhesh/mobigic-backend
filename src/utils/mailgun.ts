import formData from "form-data";
import Mailgun from "mailgun.js";
import dotenv from "dotenv";
dotenv.config();

const API_KEY = process.env.MAILGUN_API_KEY!;
const DOMAIN = process.env.MAILGUN_DOMAIN!;

const mailgun = new Mailgun(formData);

const client = mailgun.client({
  username: "api",
  key: API_KEY,
});

export const sendMailGunEmail = async (messageData: any) => {
  await client.messages
    .create(DOMAIN, messageData)
    .then((res: any) => {
      return res;
    })
    .catch((err: any) => {
      throw err;
    });
};