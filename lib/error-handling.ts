export class ApiError extends Error {
  errorMsg: string;
  statusCode: number;

  constructor(message: string, statusCode: number ) {
    super(message);

    this.errorMsg = message;
    this.statusCode = statusCode;
  }
};
