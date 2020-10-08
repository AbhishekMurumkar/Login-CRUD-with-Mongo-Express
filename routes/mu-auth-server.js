const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const refreshTokens = [];
require("dotenv").config();
let accessTokenSecret = process.env.accessTokenSecret;
let refreshTokenSecret = process.env.refreshTokenSecret;

app.post("/login", (req, resp) => {
  const data = req.body;
  const accessToken = generateAccessToken(data);
  const refreshToken = generateRefreshToken(data);
  resp.set("authorization", {
    accessToken: accessToken,
    refreshToken: refreshToken,
  });
  resp.redirect("/user/home");
});

app.post("/token", (req, resp, next) => {
  const refreshToken = req.body.token;
  if (refreshToken == null || !refreshTokens.includes(refreshToken))
    return resp.sendStatus(403);
  else {
    jwt.verify(refreshToken,refreshTokenSecret,(err,user)=>{
        if(err)return resp.sendStatus(403)
        const accessToken = generateAccessToken({data:user});
        resp.json({})
    })
  }
});

function authorizeToken(req, resp, next) {
  let authHeader = req.header["authorization"];
  let token = authHeader && authHeader.split(" ")[1];
  if (token == null) return resp.sendStatus(401);

  jwt.verify(token, accessTokenSecret, (err, authData) => {
    if (err) return resp.sendStatus(401);
    req.user = user;
    next();
  });
}

function generateAccessToken(user) {
  return jwt.sign(user, process.env.accessTokenSecret, { expiresIn: "15s" });
}
function generateRefreshToken(user) {
  let refreshToken = jwt.sign(user, process.env.refreshTokenSecret);
  refreshTokens.push(refreshToken);
  return refreshToken;
}
app.listen(8086);
