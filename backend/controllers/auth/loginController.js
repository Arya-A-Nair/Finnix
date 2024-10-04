import User from "../../models/user";
import bcrypt from "bcrypt";
import { JWTService } from '../../services';

const loginController = {
    async operation(req, res) {
      try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ status: 400, code: 0, data: null, message: "Incomplete Credentials", error: null });
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({status: 404, code: 0, data: null, message: "User not found", error: null});
        bcrypt.compare(password, user.password, function(error, result) {
            if (error) return res.status(400).json({status: 400, code: 0, data: null, message: "Something went wrong", error });
            if (result) {
              const accessToken = JWTService.sign({
                _id: user._id,
                email: user.email,
                role: user.role
            });
              return res.status(200).json({status: 200, code: 1, data: { user, accessToken }, message: "User logged in successfully", error: null});
            }
            return res.status(401).json({status: 401, code: 0, data: null, message: "Invalid / Wrong Credentials", error: null});
        });
    } catch(error) {
        return done(error, false);
    }
    }
}

export default loginController;