import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import User from "../models/user";

const verifyCreatePasswordToken = async (req, res, next) => {
  const { token } = req.body;
  console.log("token", token);
  try {
    const { token: id } = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(id);
    if (!user)
      res.status(400).json({
        data: null,
        error: "Invalid/Expired link. Contact Admin to resend link",
      });
    req.body.user = user;
  } catch (error) {
    res.status(401).json({
      data: null,
      error: "Invalid/Expired link. Contact Admin to resend link",
    });
  } finally {
    next();
  }
};

export default verifyCreatePasswordToken;
