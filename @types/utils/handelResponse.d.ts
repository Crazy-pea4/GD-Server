import { Response } from "express";

export default interface HandelResponse {
  (res: Response, result: any, data?: any, message?: string): void;
}
