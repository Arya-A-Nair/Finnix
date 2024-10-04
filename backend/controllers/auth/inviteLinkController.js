import User from "../../models/user";
import sendEmail from "../../services/emailWorking";

import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../config";
import emailHtml from "../../constants/emailHtml";

const inviteLinkController = {
  async operation(req, res) {
    try {
      const { _id } = req.body;
      if (!_id)
        return res.status(400).json({
          status: 400,
          code: 0,
          data: null,
          message: "No _id found",
          error: "incomplete body",
        });
      const user = await User.findOne({ _id });
      if (!user)
        return res.status(404).json({
          status: 404,
          code: 0,
          data: null,
          message: "No account found",
          error: "account not found",
        });
      const emailAcceptor = user.email;
      const token = jwt.sign(
        {
          token: user._id,
        },
        JWT_SECRET,
        { expiresIn: "18000s" }
      );

      const invitationUrl = `${process.env.FRONTEND_URL}/set-password/${token}`;
      sendEmail({
        from: "dhanushfundtool@gmail.com",
        to: emailAcceptor,
        subject: "Invitation from Dhanush",
        text: `Invitation`,
        html: emailHtml(invitationUrl),
      });
      return res.status(200).json({
        status: 200,
        code: 1,
        data: null,
        message: "Email sent successfully",
        error: null,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: 500,
        code: 0,
        data: null,
        message: "Email not sent",
        error,
      });
    }
  },
};

export default inviteLinkController;
