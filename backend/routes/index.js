import express from 'express';
import mongoose from "mongoose";

const router = express.Router();

router
  .get('/', (req, res) => {
    res.send("hey, how are you?");
  })
  // for dev
  .get('/clean_db', (req, res) => {
    mongoose.connection.db.dropCollection('files', function (err, result) {
      console.log("successfully drop the answers collection")
    });
    res.send("successfully drop the collections");
  })

export default router;