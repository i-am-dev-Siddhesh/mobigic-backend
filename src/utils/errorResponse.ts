import {
  ACCESS_DENIED_MESSAGE,
  GENERAL_ERROR_MESSAGE
} from "./constants";

export class HttpException extends Error {
  public status: number;
  public message: string;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.message = message;
  }
}

export const generalError = (error: HttpException) => {
  const errorMessage = error?.message || GENERAL_ERROR_MESSAGE;
  return {
    status: false,
    message: errorMessage,
  };
};

export const generalErrorStatusCode = (error: any) => {
  const code = error?.status_code || 500;
  return code;
};

export const forbiddenError = () => ({
  status: false,
  message: ACCESS_DENIED_MESSAGE,
});

 