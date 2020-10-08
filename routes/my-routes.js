const express = require("express");
const routes = express.Router();
const path = require("path");
const UserModel = require("../my-modal");
const jwt = require("jsonwebtoken");
// const refreshTokens = [];
require("dotenv").config();
// const cookieParser = require('cookie-parser');

let accessTokenSecret = process.env.accessTokenSecret;


routes.get("/", (req, resp) => {
  resp.status(200).render("register");
});

routes.get("/login", (req, resp) => {
  resp.status(200).render("login");
});


routes.post("/login", (req, resp, next) => {
  console.log("in post /login");
  console.log(req.body);
  let { useremail, userpass } = req.body;
  console.log(useremail, userpass);
  UserModel.findOne({ useremail: useremail, password: userpass })
    .exec()
    .then((user) => {
      if (user) {
        let mytime=Math.floor(Date.now() / 1000) + 1000;
        let accesstoken = jwt.sign(
          {
            exp: mytime, //1 ht exp
            data: JSON.stringify({
              username: user.username,
              useremail: user.useremail,
            }),
          },
          accessTokenSecret
        );
        console.log(accesstoken);
        resp.cookie('auth_token',{accesstoken:accesstoken,edmo:1},{maxAge:mytime}).redirect("/user/home");
        console.log(resp);
      } else {
        resp.status(200).send("Incorrect User name and password combination");
      }
    });
});

routes.post("/", (req, resp) => {
  console.log("in post /");
  let formdata = req.body;
  console.log(formdata);
  //defining all restrictions to login here
  //1. checking if email exists
  let filter = { order_id: formdata.useremail };
  UserModel.find(filter)
    .exec()
    .then((result) => {
      if (result.length == 0) {
        //2. checking user inputs
        if (formdata.p1 === formdata.p2) {
          let new_user = new UserModel({
            username: req.body.username,
            useremail: req.body.useremail,
            mobile: req.body.mobile,
            password: req.body.p1,
          });
          new_user.save((err, user) => {
            if (err) {
              resp.status(500).send(err.toString());
            }
            console.log(user);
            resp.redirect("/login");
          });
        } else {
          resp.send("Password Mismatch");
        }
      } else {
        resp.status(200).send("User Already Exists");
      }
    });
});

exports.myroute = routes;
