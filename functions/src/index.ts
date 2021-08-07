import * as functions from "firebase-functions";
import * as express from "express";
import * as admin from "firebase-admin";
// import firebase from "firebase/app";
// import Multer from "multer";
// import { FIREBASE_PROJECT } from "./constants";

const app = express();

admin.initializeApp();

app.use(express.static("public"));

exports.photo_upload = functions.https.onRequest(app);
