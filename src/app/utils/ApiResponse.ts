class ApiResponse<T> {
  public status: number;
  public data: T;
  public message: string;
  public success: boolean;

  constructor(status: number, data: T, message: string) {
    this.status = status;
    this.data = data;
    this.message = message;
    this.success = status < 400;
  }
}

export default ApiResponse;
