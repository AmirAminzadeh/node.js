/********************************************************************************* 
* WEB322 – Assignment 02 
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part 
* of this assignment has been copied manually or electronically from any other source 
* (including 3rd party web sites) or distributed to other students. 
* 
* Name: Amir aminzadeh         Student ID: 126554187          Date: 2019-09-25 
* 
* Online (Heroku) Link:         https://peaceful-reaches-80817.herokuapp.com 
* 
********************************************************************************/

//interact with the data from server.js
var interactFileJs = require("./data-service.js");
var express = require("express");
var app = express();
var path = require("path");

//Set port
var HTTP_PORT = process.env.PORT || 8080;

//The server stars to listen our request
function onHttpPort(){
    console.log("Express http server listening on :" + HTTP_PORT);
};


// For reading the css file
app.use(express.static('public'));


//It is the first path (home)
app.get("/", function(req, res){
    res.sendFile(path.join(__dirname, "/views/home.html"));
});


//It is """a path""" for about (after home)
app.get("/about", function(req, res){
    res.sendFile(path.join(__dirname, "/views/about.html"));
});



//It is """a connection""" to employees
app.get("/employees", function(req, res){
    interactFileJs.getAllEmployees()
    .then((data) => {
        res.json(data);
    })
    .catch((err) => {
        //res.json(err.message);
        res.json({ message : err });

    })
});

//It is """a connection""" to managers
app.get("/managers", function(req, res){
    interactFileJs.getManagers()
    .then((data) => {
        res.json(data);
    })
    .catch((err) => {
        res.json({ message: err });
    });

});

//It is """a connection""" to departments
app.get("/departments", function(req, res){
    interactFileJs.getDepartments()
    .then((data) => {
        res.json(data);
    })
    .catch((err) => {
        res.json({ message: err });
    })

});

//It is a path for no matching routh
app.get("*", function(req, res){
    res.sendFile(path.join(__dirname, "/views/error.html"));
});

//no route
app.use(function(req, res){
    res.status(404).send("Page not Find");
});

//app.listen(HTTP_PORT, onHttpPort);
/*
Fundamentally, initialize() is responsible for reading the .json files from the "data" folder 
and parsing the results to create the "global" (to the module) arrays, "employees" and "departments" 
that are used by the other functions. However, it also returns a promise 
that will only resolve successfully once the files were read correctly 
and the "employees" and "departments" arrays were correctly loaded with the data.
*/
interactFileJs.initialize()  
.then((data) => {
    app.listen(HTTP_PORT, onHttpPort());
})
.catch((reason) => {
    console.log(reason);
});

