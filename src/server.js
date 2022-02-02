import 'dotenv/config';
import express from 'express';
import mongoose from "mongoose";
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import Session from 'express-session';
import cors from 'cors';
import user from "./routes/user.js";
import { initMongoServer } from './db/connection.js';

const session = Session;

initMongoServer();
const app = express();
app.use(session({
  secret: "Hello",
  resave: false,
  saveUninitialized: false,
}));

const PORT = process.env.PORT || 3000;
const db = mongoose.connection;


app.use(express.json());
app.use(cors());
app.use("/api", user);

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next()
})

app.use(cookieParser());
app.use(bodyParser.json()).use(bodyParser.urlencoded({ extended: false }));
app.use(logger('combined'));

db.on("error", error => console.log(error.message));
db.on("connected", () => console.log("Mongo is connected"));
db.on("disconnected", () => console.log('Mongo is disconnected'));

app.listen(PORT, () => {
  console.log(`Listening on Port ${PORT}`);
});
