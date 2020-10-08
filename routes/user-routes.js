const express = require("express");
const routes = express.Router();
// const path = require("path");
const jwt = require("jsonwebtoken");
const UserModel = require("../my-modal");

require("dotenv").config();

function verifyUser(req, resp, next) {
  console.log("in user middleware");
  let myauth = req.cookies;
  console.log(req);console.log(resp.cookies);
  try{
    let decoded =  jwt.verify(myauth.auth_token.accesstoken,process.env.accessTokenSecret);
    // console.log(decoded);
    if(decoded){
      req.user=decoded;
      next();
    }else{
      resp.status(403).redirect("/login");
    }  
  }catch(err){
    console.log(err);
    resp.status(403).redirect("/login");
  }

}

routes.get("/home",verifyUser, (req, resp) => {
  let all_users=[];
  UserModel.find({},(err,resp)=>{
    if(err)throw err;
    else{
      // console.log(resp)
      all_users=[...resp];
    }
  }).then(()=>{
    let user = JSON.parse(req.user.data);
    resp.status(200).render("user/home",{username:user.username,all_users:all_users})
  })
  console.log(all_users);
});

routes.get("/updateUser/:id",verifyUser,(req,resp)=>{
  let mydata=null;
  // console.log(req.params);
  UserModel.findOne({_id:req.params.id},(err,resp)=>{
    if(err)throw err;
    mydata={...resp._doc}
    console.log(mydata);
  }).then(()=>{
    resp.status(200).render("user/updateUser",{myuser:mydata})
  })
})

routes.post("/updateUser",verifyUser,(req,resp)=>{
  console.log("In update user",req.body);
  let { id,username,useremail,mobile,password } = req.body;
  let user={
    '_id':id,
    'username':username,
    'useremail':useremail,
    'mobile':mobile,
    'password':password,
  };
  // console.log(user);
 let prev_user=UserModel.findByIdAndUpdate(id,user,function(err,data){
   if(err)throw err;
   else{
     resp.status(200).redirect("home");
   }
 })
})

routes.get("/deleteUser/:id",verifyUser,(req,resp)=>{
 let delId=req.params.id;
  // console.log(user);
 let prev_user=UserModel.deleteOne({_id:delId},function(err,data){
   if(err)throw err;
   else{
     resp.status(200).redirect("home");
   }
 })
})

routes.get("/logout",(req,resp)=>{
  console.log(req.cookies);
  console.log("in logout");
  resp.clearCookie('auth_token');
  req.user=null;
  resp.status(200).redirect("/");
})
module.exports = routes;
