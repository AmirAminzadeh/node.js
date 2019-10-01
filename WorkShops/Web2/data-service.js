const fs = require("fs");  //This is a require library for reading file
var employees = [];
var departments = [];
var managers = [];

//This function will read the contents of the "./data/employees.json" file and "./data/employees.json" file too
function initialize(){
    return new Promise(function(resolve, reject){

        //The method for read file
        fs.readFile("./data/employees.json", function(err, data) {
            if(err){
                reject ("Unable to read file");
            }else{
                employees = JSON.parse(data);  //Convert the file's contents into an array of objects
            }

            fs.readFile("./data/departments.json", function(err, data){
                if(err){ 
                    reject ("Unable to be read file");
                }else{
                    departments = JSON.parse(data);   //Convert the file's contents into an array of objects
                }
            });
        });
        resolve("Success");
    });
};


//Provide the """full array""" of "employee" objects
function getAllEmployees(){
    return new Promise(function(resolve, reject){
        if(employees.length == 0){ 
            reject("no results returned");
        }else{
        resolve(employees);   //Provide the """full array""" of "employee" objects
        }
    }); 

};


//Provide """an array""" of "employee" objects whose isManager property is true
function getManagers(){
    return new Promise(function(resolve, reject){
        if(employees.length == 0){
             reject("no results returned");
        }else{
            for(var i=0; i<employees.length; i++ ){
                if(employees[i].isManager == true){
                    //The push() method adds new items to the end of an array, and returns the new length.
                    //array.push(item1, item2, ..., itemX)   ,,,,The items will be entered inside of the array
                    managers.push(employees[i]);
                }
            }
            resolve(managers);
        }
    });
};



function getDepartments(){
    return new Promise(function(resolve, reject){
        if(departments.length == 0){ 
            reject("no results returned");
        }else{
        resolve(departments);
        }
    });
};


module.exports = {initialize, getAllEmployees, getManagers, getDepartments};
//module.experts(initialize());  ?????

 



