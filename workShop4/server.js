/********************************************************************************* 
* WEB322 – Assignment 04
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part 
* of this assignment has been copied manually or electronically from any other source 
* (including 3rd party web sites) or distributed to other students. 
* 
* Name: Amir Aminzadeh         Student ID: 126554187          Date: 2019-10-31 
* 
* Online (Heroku) Link:         https://afternoon-cove-82667.herokuapp.com
* 
********************************************************************************/

//interact with the data from server.js
var interactFileJs = require("./data-service.js");
var express = require("express");
//Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files.
var multer = require("multer");
var app = express();
var path = require("path");
const fs = require("fs");
var bp = require("body-parser");



//Assignment4
const exphbs = require("express-handlebars");
//////////


//Set port
var HTTP_PORT = process.env.PORT || 8080;

//The server stars to listen our request
function onHttpPort() {
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

//Assignment4
//add the app.engine() code using exphbs({ … }) and the "extname" property as ".hbs" and 
//the "defaultLayout" property as "main"
app.engine('.hbs', exphbs({
    extname: '.hbs',

    defaultLayout: 'main',

    helpers: {

        navLink: function (url, options) {
            return '<li' +
                ((url == app.locals.activeRoute) ? ' class="active" ' : '') +
                '><a href="' + url + '">' + options.fn(this) + '</a></li>';
        },

        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        }
    }
}));

app.set('view engine', '.hbs');
//////////


// For reading the static file such as css files and images
app.use(express.static('./public/'));
//Add the bodyParser.urlencoded({ extended: true }) middleware (using app.use())
app.use(bp.urlencoded({ extended: true }));

//Assignment4
//Step 4: Fixing the Navigation Bar to Show the correct "active" item
app.use(function (req, res, next) {
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
    next();
});



//Assignment4
//It is the first path (home)
// app.get("/", function(req, res){
//     res.sendFile(path.join(__dirname, "/views/home.html"));
// });

//Assignment4
//In your server.js file, change the GET route for "/" to "render" the "home" view, instead of sending home.html
app.get("/", function (req, res) {
    res.render(path.join(__dirname, "/views/home.hbs"));
});


//It is """a path""" for about (after home)
app.get("/about", function (req, res) {
    res.render(path.join(__dirname, "/views/about.hbs"));
});

app.get("/employees/add", (req, res) => {
    res.render(path.join(__dirname, "/views/addEmployee.hbs"));
});

//setup route that displays all employees or relevant query
app.get("/employees", function (req, res) {
    if (req.query.status) {
        interactFileJs.getEmployeesByStatus(req.query.status)
            .then((data) => {
                res.render("employees", { employees: data });
            })
            .catch((err) => {
                res.render({ message: "no results" });
            })
    } else if (req.query.department) {
        interactFileJs.getEmployeesByDepartment(req.query.department)
            .then((data) => {
                res.render("employees", { employees: data });
            })
            .catch((err) => {
                res.render({ message: "no results" });
            })
    } else if (req.query.manager) {
        interactFileJs.getEmployeesByManager(req.query.manager)
            .then((data) => {
                res.render("employees", { employees: data });
            })
            .catch((err) => {
                res.render({ message: "no results" });
            })

    } else {
        interactFileJs.getAllEmployees()
            .then((data) => {
                res.render("employees", { employees: data });
            })
            .catch((err) => {
                res.render({ message: "no results" });
            })
    }
})


//setup the employees/employeenumber route
//params is the specifed parameters
app.get("/employee/:value", function (req, res) {
    interactFileJs.getEmployeeByNum(req.params.value)
        .then((data) => {
            res.render("employee", { employee: data });
        })
        .catch((err) => {
            res.render("employee", { message: "no results" });
        })
})

//sets up route that allows you to add employees
app.post("/employees/add", function (req, res) {
    interactFileJs.addEmployee(req.body)
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.send({ message: err });
        })
})

//Assignment4
//Once the form is complete, we must add the POST route: /employee/update in our server.js file
app.post("/employee/update", (req, res) => { 
    interactFileJs.updateEmployee(req.body)
    .then((data)=>{
        res.redirect("/employees"); 
    }) 
    .catch((err)=>{
        res.send({ message: err });
    })
});
// This will show you all the data from your form in the console, once the user clicks "Update Employee". 
// However, in order to take that data and update our "employees" array in memory, 
// we must add some new functionality to the data-service.js module
//////////

app.get("/images/add", (req, res) => {
    res.render(path.join(__dirname, "/views/addImage.hbs"));
});

//Step 2: Adding the "Post" route
app.post("/images/add", upload.single("imageFile"), (req, res) => {
    //When accessed, this route will redirect to "/images"
    res.redirect("/images");
})

//Step 3:Adding "Get" route / using the "fs" module
//ie { "images": ["1518109363742.jpg", "1518109363743.jpg"] }
app.get("/images", function (req, res) {
    fs.readdir("./public/images/uploaded", function (err, items) {
        //Assignment4
        console.log(items);
        res.render("images", { images: items })

        //Assignment3
        // var str = "{images:[";
        // for (var i = 0; i < items.length; i++){
        //     if (i + 1 != items.length){
        //     str = str + items[i] + ",";
        //     }else{
        //     str = str + items[i] + "]}"
        //     }
        // }
        // res.json(str); 

    })
})




//It is """a connection""" to employees
app.get("/employees", function (req, res) {
    interactFileJs.getAllEmployees()
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            //res.json(err.message);
            res.json({ message: err });

        })
});

//It is """a connection""" to managers
app.get("/managers", function (req, res) {
    interactFileJs.getManagers()
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            res.json({ message: err });
        });
});

//It is """a connection""" to departments
app.get("/departments", function (req, res) {
    interactFileJs.getDepartments()
        .then((data) => {
            res.render("departments", { departments: data });
        })
        .catch((err) => {
            res.json({ message: err });
        })

});

//It is a path for no matching routh
app.get("*", function (req, res) {
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

