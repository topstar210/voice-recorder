import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const getUsers = async (req, res) => {
    try {
        const users = await User.find({
            attributes: ['id', 'name', 'email', 'role', 'pin_code']
        });
        res.json(users);
    } catch (error) {
        console.log(error);
    }
}

export const saveUser = async (req, res) => {
    if(req.body.isEdit){
        const conditions = {'_id': req.body.userId}
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(req.body.filePwd, salt);
        let data = {
            ...req.body,
            filePwd: hashPassword
        }
        User.findOneAndUpdate(conditions, data, (err, user) => {
            if (err) return handleError(err);
            if (user) res.send(JSON.stringify(user));
        });
    } else {
        const data = new User(req.body);
        data.save()
            .then(user => {
                res.send(JSON.stringify(user));
            })
            .catch(err => {
                res.status(400).send("unable to save to database");
            });
    }
}

export const deleteUser = async (req, res) => {
    await User.deleteOne({ _id: req.params.userId }).exec();
    res.send("okay");
}
export const getUserInfo = async (req, res) => {
    const users = await User.findOne({ _id: req.params.userId }).exec();
    res.json(users);
}

export const checkFilePwd = async (req, res) => {
    const user = await User.find({
        _id: req.body.userId
    }).exec();
    const match = await bcrypt.compare(req.body.filePwd, user[0].filePwd);
    if (!match) return res.status(400).json({ msg: "Wrong Password" });
    return res.json({ msg: "Okay" });
}

export const Register = async (req, res) => {
    const { name, email, password, confPassword } = req.body;
    if (password !== confPassword) return res.status(400).json({ msg: "Password and Confirm Password do not match" });
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    try {
        await User.create({
            name,
            email,
            password: hashPassword
        });
        res.json({ msg: "Registration Successful" });
    } catch (error) {
        console.log(error);
    }
}

export const Login = async (req, res) => {
    try {
        const user = await User.find({
            pin_code: (req.body.pin_code).join("")
        }).exec();
        // const match = await bcrypt.compare(req.body.password, user[0].password);
        // if (!match) return res.status(400).json({ msg: "Wrong Password" });
        const userId = user[0]._id;
        const name = user[0].name;
        const email = user[0].email;
        const pinCode = user[0].pin_code;
        const isShowRemoved = user[0].isShowRemoved;
        const role = user[0].role;
        const accessToken = jwt.sign({ userId, name, email, pinCode, role, isShowRemoved }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '15s'
        });
        const refreshToken = jwt.sign({ userId, name, email, pinCode, role, isShowRemoved }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '1d'
        });
        await User.findOneAndUpdate({ _id: userId }, { refresh_token: refreshToken }).exec();
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });
        res.json({ accessToken });
    } catch (error) {
        res.status(404).json({ msg: "Pin code not found" });
    }
}

export const Logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.sendStatus(204);
    }
    const user = await User.findOne({ refresh_token: refreshToken });
    if (!user) {
        return res.sendStatus(204);
    }
    const userId = user._id;
    await User.findOneAndUpdate({ _id: userId }, { refresh_token: null }).exec();
    res.clearCookie('refreshToken');
    return res.sendStatus(200);
}

export default {
    getUsers,
    saveUser,
    deleteUser,
    getUserInfo,
    checkFilePwd
}