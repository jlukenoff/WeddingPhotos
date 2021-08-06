import * as functions from "firebase-functions";
import * as express from "express";
import * as admin from "firebase-admin";

const app = express();

admin.initializeApp();

/* app.use((req, res, next) => {
  console.log(req.url);
  next();
});
 */
app.use(express.static("public"));

exports.photo_upload = functions.https.onRequest(app);
