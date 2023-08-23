// import express module
const express = require("express");
// import jsonwebtoken module
const jwt = require("jsonwebtoken");
// import express-session
const session = require("express-session");
// import authenticated router from auth_users module
const customer_routes = require("./router/auth_users.js").authenticated;
// import general router from general module
const genl_routes = require("./router/general.js").general;
// instantiate express
const app = express();
// use express json middleware function
app.use(express.json());
// use express-session in /customer
app.use(
  "/customer",
  session({
    // use env variable EBR_SESSION_SECRET for secret
    secret: process.env.EBR_SESSION_SECRET,
    // prevent delete still-active sessions
    resave: true,
    // stores empty sessions
    saveUninitialized: true,
  })
);

// use the auth middleware mechanism in /customer/path
app.use("/customer/auth/*", function auth(req, res, next) {
  //Write the authenication mechanism here
  if(req.session.authorization){
    jwt.verify(req.session.authorization["accessToken"], process.env.EBR_JWT_SECRET, (err, user) => {
      if(!err){
        req.user = user;
        next();
      }else{
        return res.status(403).json({message: "User not authenticated."})
      }
    })
  }else{
    return res.status(401).json({message: "User not logged in."});
  }
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}.`));
