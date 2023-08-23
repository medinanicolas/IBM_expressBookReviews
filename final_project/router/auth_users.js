const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check if the username is valid
// ternary rulz
  return users.filter(e => e.username === username).length ? true : false
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  if(isValid(username)){
    return users.filter(e => e.username === username && e.password === password).length ? true : false
  }
  return false
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  username = req.body.username
  if(authenticatedUser(username,req.body.password)){
    let accessToken = jwt.sign({
        data: req.bodypassword,
      },
      process.env.EBR_JWT_SECRET,
      {expiresIn: 60 * 60}
    );

    req.session.authorization = {accessToken, username};
    return res.status(200).json({message: `User ${username} logged successfully!`})
  }
  return res.status(401).json({message: "The user and password doesn't match."});
});

// Add a book review
regd_users.post("/auth/review/:isbn", (req, res) => {
  //Write your code here
  if(!parseInt(req.params.isbn)){
    return res.status(400).json({message: "Can not read ISBN code."});
  }

  isbn_book = books[req.params.isbn];

  if(!isbn_book){
    return res.status(404).json({message: `Can not found books with ISBN ${req.params.isbn}.`});
  }

  if(Object.keys(books[req.params.isbn]["reviews"]).length){
    return res.status(400).json({message: `Review for user ${req.session.authorization["username"]} already exists.`});
  }

  if(!req.body.review.length > 250){
    return res.status(400).json({message: "Review body exceed maximum length (250)."});
  }

  books[req.params.isbn]["reviews"][req.session.authorization["username"]] = req.body.review;

  return res.status(201).json({message: "Review created."});
});

// Modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  if(!parseInt(req.params.isbn)){
    return res.status(400).json({message: "Can not read ISBN code."});
  }

  isbn_book = books[req.params.isbn];

  if(!isbn_book){
    return res.status(404).json({message: `Can not found books with ISBN ${req.params.isbn}.`});
  }

  if(!Object.keys(books[req.params.isbn]["reviews"]).length){
    return res.status(400).json({message: `Review for user ${req.session.authorization["username"]} does not exists.`});
  }

  if(!req.body.review.length > 250){
    return res.status(400).json({message: "Review body exceed maximum length (250)."});
  }

  books[req.params.isbn]["reviews"][req.session.authorization["username"]] = req.body.review;

  return res.status(201).json({message: "Review modified."});
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here
  if(!parseInt(req.params.isbn)){
    return res.status(400).json({message: "Can not read ISBN code."});
  }

  isbn_book = books[req.params.isbn];

  if(!isbn_book){
    return res.status(404).json({message: `Can not found books with ISBN ${req.params.isbn}.`});
  }

  if(!Object.keys(books[req.params.isbn]["reviews"]).length){
    return res.status(400).json({message: `Review for user ${req.session.authorization["username"]} does not exists.`})
  }

  delete books[req.params.isbn]["reviews"][req.session.authorization["username"]];

  return res.status(201).json({message: "Review deleted."});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
