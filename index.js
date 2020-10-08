const express = require("express");
const cookieParser = require('cookie-parser');
const my_routes = require("./routes/my-routes");
const user_routes = require("./routes/user-routes");
const bodyparser = require('body-parser');
const path = require("path");


const app = express();

app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json());
app.use(cookieParser());

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));


app.use(my_routes.myroute);
app.use("/user/",user_routes);

app.use((req,resp)=>{
    resp.status(400).send("<h2> Page does not exist</h2>");
})

app.listen(8085);