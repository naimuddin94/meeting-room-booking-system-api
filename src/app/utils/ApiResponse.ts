class ApiResponse<T> {
  public statusCode: number;
  public data: T;
  public message: string;
  public success: boolean;
  public token?: string;

  constructor(statusCode: number, data: T, message: string, token?: string) {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
    if (token) {
      this.token = token;
    }
  }
}

export default ApiResponse;
