/* 引入crypto包 */
import crypto from "crypto";

export default function (password: string) {
  return crypto.createHash("md5").update(password).digest("hex");
}
