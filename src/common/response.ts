export class Response {
    statusCode: number;
  
    message: string;
  
    payload: any;
  
    constructor(code: number, message: string, payload: any) {
      this.statusCode = code;
      this.message = message;
      this.payload = payload;
    }
  }