import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";

class JWTService {
  static sign(payload) {
    const expiry = "180000s";
    const secret = JWT_SECRET;
    return jwt.sign(payload, secret, { expiresIn: expiry });
  }
  static verify(payload) {
    const secret = JWT_SECRET;
    return jwt.verify(payload, secret);
  }
}

export default JWTService;
