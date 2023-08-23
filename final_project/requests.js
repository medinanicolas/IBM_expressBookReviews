const axios = require('axios').default;
// Harcoded url constant
HOST = 'http://0.0.0.0:5000'


const getAllBooks = async(url)=>{
    console.log("Doing async/await request", Date.now().toString())
    const outcome = axios.get(url);
    let res = await outcome;
       console.log(res.data, Date.now().toString());
};

const getBookByISBNCode = (url)=>{
    console.log("Doing promise request", Date.now().toString())
    const req = axios.get(url);
    console.log(req);
    req.then(resp => {
        console.log(resp.data);
    })
    .catch(err => {
        console.log(err.toString())
    });
}

const getBookByAuthorName = async(url)=>{
    console.log("Doing async/await request", Date.now().toString())
    const outcome = axios.get(url);
    let res = await outcome;
       console.log(res.data, Date.now().toString());
}

const getBookByTitle = async(url)=>{
    console.log("Doing async/await request", Date.now().toString())
    const outcome = axios.get(url);
    let res = await outcome;
       console.log(res.data, Date.now().toString());
}

console.log("Before requests");
// Get all books with async/await
getAllBooks(HOST).catch(err=>console.log(err.toString()));
// Get books by ISBN code with Promises
getBookByISBNCode(HOST + "/isbn/1");
// Get Books by Author Name
getBookByAuthorName(HOST + "/author/unknown").catch(err=>console.log(err.toString()));;
// Get Books by Title
getBookByTitle(HOST + "/title/pride and prejudice").catch(err=>console.log(err.toString()));
console.log("After requests");
