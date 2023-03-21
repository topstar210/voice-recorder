import express from 'express';
import mongoose from "mongoose";
import User from "../models/User.js";

const router = express.Router();

// controllers
import Users, { Register, Login, Logout } from "../controllers/User.js";
// middlewares
import { verifyToken } from '../middlewares/jwt.js';
import { refreshToken } from "../controllers/RefreshToken.js";


router
  .get('/', (req, res) => {
    res.send("hey, how are you?");
  })
  // auth
  .post('/register', Register)
  .post('/login', Login)
  .get('/token', refreshToken)
  .post('/logout', Logout)
  .post('/login/:userId', verifyToken, (req, res, next) => { })

  // user management
  .post('/users/save', Users.saveUser)
  .get('/users/get', Users.getUsers)
  .get('/users/get/:userId', Users.getUserInfo)
  .delete('/users/:userId', Users.deleteUser)

  // initail user
  .get('/add_admin', async (req, res) => {
    const data = await new User({
      name: "admin",
      email: "admin@admin.com",
      pin_code: "5555",
      role:"admin",
      isShowRemoved: true
    });
    data.save()
      .then(user => {
        console.log(user)
      })
      .catch(err => {
        console.log(err)
      });

    res.send("okay");
  })
  // for dev
  .get('/clean_db', (req, res) => {
    mongoose.connection.db.dropCollection('files', function (err, result) {
      console.log("successfully drop the --- files --- collection")
    });
    mongoose.connection.db.dropCollection('users', function (err, result) {
      console.log("successfully drop the --- users --- collection")
    });
    res.send("successfully drop the collections");
  })

export default router;