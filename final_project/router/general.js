const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  //Write your code here
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: "Can not read username or password."});
  }
  if(!isValid(req.body.username)){
    users.push({username: req.body.username, password: req.body.password});
    return res.status(201).json({message: "User created."})
  }
  return res.status(400).json({message: "User already exists."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  if(!parseInt(req.params.isbn)){
      return res.status(400).json({message: "Can not read ISBN code."});
  }
  isbn_book = books[req.params.isbn];
  return isbn_book 
    ? res.status(200).json(isbn_book)
    : res.status(404).json({message: `Can not found books with ISBN ${req.params.isbn}.`});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  author_books = Object.values(books).filter(e => e.author.toLowerCase() === req.params.author.toLowerCase());
  return author_books.length 
    ? res.status(200).json(author_books)
    : res.status(400).json({message: `Can not found books with author ${req.params.author}.`});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  title_books = Object.values(books).filter(e => e.title.toLowerCase() === req.params.title.toLowerCase());
  return title_books.length 
    ? res.status(200).json(title_books)
    : res.status(404).json({message: `Can not found books with title ${req.params.title}.`});

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  if(!parseInt(req.params.isbn)){
    return res.status(400).json({message: "Can not read ISBN code."});
  }
  isbn_book = books[req.params.isbn];
  if(!isbn_book){
    return res.status(404).json({message: `Can not found books with ISBN ${req.params.isbn}.`});
  }
  return Object.keys(isbn_book["reviews"]).length 
    ? res.status(200).json(isbn_book["reviews"])
    : res.status(404).json({message: `The book with ISBN ${req.params.isbn} has no reviews.`});
});

module.exports.general = public_users;
