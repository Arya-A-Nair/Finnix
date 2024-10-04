import { JWTService } from "../services";
import rules from "../config/rules";

const sanctionUser = async (req, res, next) => {
  try {
    const requested = req.route.path;
    const headers = req.headers;
    if (!headers.authorization) {
      return res.status(401).json({
        data: null,
        message: "Bearer Token not found",
        error: "incomplete headers",
      });
    }
    const Bearer = headers.authorization;
    const accessToken = Bearer.split(" ")[1];
    try {
      const { _id, email, role } = JWTService.verify(accessToken);
      const userAccount = { _id, email, role };
      req.userAccount = userAccount;
      if (rules[requested] && rules[requested].includes(role)) return next();
      return res.status(401).json({
        data: null,
        message: "Role unauthorized for reuqested service",
        error: "unauthorized access",
      });
    } catch (error) {
      return res.status(401).json({
        data: null,
        message: "Invalid/Expired Access Token",
        error: "invalid access token",
      });
    }
  } catch (error) {
    return next(error);
  }
};

export default sanctionUser;
