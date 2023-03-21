import Users from "../models/User.js";
import jwt from "jsonwebtoken";
 
export const refreshToken = async(req, res) => {
    try {
        const refreshToken = req.cookies?.refreshToken;
        // console.log("refreshToken", req.cookies);
        if(!refreshToken) return res.sendStatus(401);
        
        const user = await Users.find({
            refresh_token: refreshToken
        }).exec();
        if(!user[0]) return res.sendStatus(403);
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if(err) return res.sendStatus(403);
            const userId = user[0].id;
            const name = user[0].name;
            const email = user[0].email;
            const pinCode = user[0].pin_code;
            const isShowRemoved = user[0].isShowRemoved;
            const role = user[0].role;
            const accessToken = jwt.sign({userId, name, email, pinCode, isShowRemoved, role}, process.env.ACCESS_TOKEN_SECRET,{
                expiresIn: '15s'
            });
            res.json({ accessToken });
        });
    } catch (error) {
        console.log(error);
    }
}