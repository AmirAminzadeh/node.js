/********************************************************************************* 
 * WEB322 – Assignment 1 
 * I declare that this assignment is my own work in accordance with Seneca Academic Policy. 
 * No part of this assignment has been copied manually or electronically from any other source 
 * (including web sites) or distributed to other students. 
 * 
 * Name: Amir Aminzadeh             Student ID: 126554187            Date: 2019-09-09
 *  
 * Online (Heroku) URL:         https://secure-beyond-71866.herokuapp.com
 * 
 *********************************************************************************/
var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var app = express();

// setup a 'route' to listen on the default url path
app.get("/", (req, res) => {
    res.send("Amir Aminzadeh- 126554187");
});

// setup http server to listen on HTTP_PORT
app.listen(HTTP_PORT);