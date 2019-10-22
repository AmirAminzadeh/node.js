/********************************************************************************* 
* WEB322 – Assignment 03 
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part 
* of this assignment has been copied manually or electronically from any other source 
* (including 3rd party web sites) or distributed to other students. 
* 
* Name: Amir aminzadeh         Student ID: 126554187          Date: 2019-10-10 
* 
* Online (Heroku) Link:         https://intense-falls-54028.herokuapp.com
* 
********************************************************************************/

//interact with the data from server.js
var interactFileJs = require("./data-service.js");
var express = require("express");
//Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files.
var multer=require("multer");
var app = express();
var path = require("path");
const fs = require("fs");
var bp = require("body-parser");

//Set port
var HTTP_PORT = process.env.PORT || 8080;

//The server stars to listen our request
function onHttpPort(){
    console.log("Express http server listening on :" + HTTP_PORT);
};

//Step 1: Adding multer
//sets up multer(Define a "storage" variable using "multer.diskStorage" with the following options)
const storage = multer.diskStorage({
    destination: "./public/images/uploaded",
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    }
});
//Define an "upload" variable as multer({ storage: storage });
const upload = multer({ storage: storage });


// For reading the static file such as css files and images
app.use(express.static('./public/'));
//Add the bodyParser.urlencoded({ extended: true }) middleware (using app.use())
app.use(bp.urlencoded({extended: true}));

//It is the first path (home)
app.get("/", function(req, res){
    res.sendFile(path.join(__dirname, "/views/home.html"));
});


//It is """a path""" for about (after home)
app.get("/about", function(req, res){
    res.sendFile(path.join(__dirname, "/views/about.html"));
});

app.get("/employees/add", (req, res)=>{
     res.sendFile(path.join(__dirname, "/views/addEmployee.html"));
});

//setup route that displays all employees or relevant query
app.get("/employees", function(req, res){
    if(req.query.status){ 
        interactFileJs.getEmployeesByStatus(req.query.status)
        .then((data) => {
            res.json(data);
        })
        .catch((err)=>{
            res.json({message: err});
        })
    }else if(req.query.department){ 
        interactFileJs.getEmployeesByDepartment(req.query.department)
        .then((data) => {
            res.json(data);
        })
        .catch((err)=>{
            res.json({message: err});
        })
    }else if(req.query.manager){ 
        interactFileJs.getEmployeesByManager(req.query.manager)
        .then((data) => {
            res.json(data);
        })
        .catch((err)=>{
            res.json({message: err});
        })
    
    }else{
        interactFileJs.getAllEmployees()
        .then((data) => {
            res.json(data);
        })
        .catch((err)=> {
            res.json({message: err});
        }) 
    }   
})


app.get("/images/add", (req, res)=>{
    res.sendFile(path.join(__dirname, "/views/addImage.html"));
});

//Step 2: Adding the "Post" route
app.post("/images/add", upload.single("imageFile"), (req, res) => {
    //When accessed, this route will redirect to "/images"
    res.redirect("/images");
})

//Step 3:Adding "Get" route / using the "fs" module
app.get("/images", function (req, res){
    fs.readdir("./public/images/uploaded", function(err, items) {
        var str = "{images:[";
        for (var i = 0; i < items.length; i++){
            if (i + 1 != items.length){
            str = str + items[i] + ",";
            }else{
            str = str + items[i] + "]}"
            }
        }
        res.json(str); 

    })
})


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

 //setup the employees/employeenumber route
 app.get("/employee/:value",  function (req,res){
    interactFileJs.getEmployeeByNum(req.params.value) 
    .then((data) => {
       res.json(data);
   })
   .catch((err)=>{
       res.json({message: err});
   })
})

//sets up route that allows you to add employees
app.post("/employees/add", function (req, res){
    interactFileJs.addEmployee(req.body)
    .then((data) => {
        res.send(data);
    })
    .catch((err)=> {
        res.send({message: err});
    })  
})

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
// app.use(function(req, res){
//     res.status(404).send("Page not Find");
// });

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

