import User from '../../models/user';
import bcrypt from "bcrypt";

const registerController = {
    async operation(req, res, next) {
        const { name, email, password, role } = req.body;
        const saltRounds = 8;
        const user = await User.findOne({email});
        if (user) return res.status(409).json({status: 409, code: 0, data: null, message: "User already exists", error: null});
        var newUser;
        bcrypt.genSalt(saltRounds, function(err, salt) {
            bcrypt.hash(password, salt, async function(err, hash) {
                newUser = await User.create({ name, email, password: hash, role });                
            });
        });
        return res.status(201).json({status: 201, code: 1, data: newUser, message: "User created successfully", error: null});
    }
}

export default registerController;