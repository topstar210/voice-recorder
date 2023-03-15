import http from "http";
import express from "express";
import logger from "morgan";
import cors from "cors";
import fileUpload from 'express-fileupload';
import dotenv from "dotenv";

// // mongo connection
// import "../config/mongo.js";

// routes
import indexRouter from "../routes/index.js";
import fileRouter from "../routes/file.js";

const app = express();
const corsObj = {
  origin: [
    'http://localhost:3000'],
  methods: ['GET', 'POST', "DELETE", "PUT"],
  credentials: true
}
app.use(cors(corsObj));

/** Get port from environment and store in Express. */
const port = process.env.PORT || "2087";
app.set("port", port);
app.use(logger("dev"));
// FILE UPLOAD
app.use(fileUpload());
// BODYPARSER
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

dotenv.config({path:'/../.env'});

app.use("/api/", indexRouter);
app.use("/api/file", fileRouter)

/** catch 404 and forward to error handler */
app.use('*', (req, res) => {
  return res.status(404).json({
    success: false,
    message: 'API endpoint doesnt exist'
  })
});

let server = null;
/** Create HTTP server. */
server = http.createServer(app);

/** Listen on provided port, on all network interfaces. */
server.listen(port);
/** Event listener for HTTP server "listening" event. */
server.on("listening", () => {
  console.log(`Listening on port:: ${port}`)
});