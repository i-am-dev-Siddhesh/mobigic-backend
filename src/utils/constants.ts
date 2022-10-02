export const __prod__ = process.env.SERVER_ENV === "production";

export const ACCESS_DENIED_MESSAGE = "Access to the resource is denied", 
  GENERAL_ERROR_MESSAGE = "Something went wrong",
  SERVER_RUNNING_MESSAGE = "Server is in running state";

 
export const tokenKey = 'qid',
  tokenExp = 1000 * 60 * 60 * 24 * 365 * 10; // 10 years

export const signedUrlExp = 600 // seconds
