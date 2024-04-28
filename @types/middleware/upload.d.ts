import { RequestHandler } from "express";

export default interface Upload {
  single: (fieldName: string) => RequestHandler;
}
