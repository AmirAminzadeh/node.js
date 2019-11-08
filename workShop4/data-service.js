const fs = require("fs");  //This is a require library for reading file
var employees = [];
var departments = [];
var managers = [];

//This function will read the contents of the "./data/employees.json" file and "./data/employees.json" file too
function initialize(){
    return new Promise(function(resolve, reject){

        //The method for read file
        fs.readFile("./data/employees.json", (err, data) => {
            if(err){
                reject ("Unable to read file");    
            }else{
                employees = JSON.parse(data);  //Convert the file's contents into an array of objects
            }

            fs.readFile("./data/departments.json", (err, data2) => {
                if(err){ 
                    reject ("Unable to be read file");
                }else{
                    departments = JSON.parse(data2);   //Convert the file's contents into an array of objects
                    resolve("Success");
                }
            });
        });
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



function addEmployee(employeeData){ 

    return new Promise(function(resolve, reject){
        if (employeeData.isManager != "true" && employeeData.isManager != "false"){
            employeeData.isManager = "false";
        }else{
            employeeData.isManager = "true";
        }
        employeeData.employeeNum = employees.length + 1;
        employees.push(employeeData);
        resolve(employeeData);


    })
}

function getEmployeesByStatus(status) {
    var stats = [];
    return new Promise(function(resolve, reject){
        if (employees.length > 0){
        for (let i = 0; i < employees.length; i++){
            if(employees[i].status == status) 
            stats.push(employees[i]);
        }
        if (stats.length > 0){
            resolve(stats);
        }else{
            reject("No Employees in Status provided");
        }
    }else{
        reject("How are there no employees?");
    }
    })
};



function getEmployeesByDepartment(department) {
    var depars = [];
    return new Promise(function(resolve, reject){
        if (employees.length > 0){
            for (let i = 0; i < employees.length; i++){
                if(employees[i].department == department) 
                depars.push(employees[i]);
            }
            if (depars.length > 0){
                resolve(depars);
            }else{
                reject("No Employees in department provided");
            }
        }else{
            reject("How are there no employees?");
        }
    })
};



function getEmployeesByManager(manager) {
    var mans = [];
    return new Promise(function(resolve, reject){
        if (employees.length > 0){
            for (let i = 0; i < employees.length; i++){
                if(employees[i].employeeManagerNum == manager) 
                mans.push(employees[i]);
            }
            if (mans.length > 0){
                resolve(mans);
            }else{
                reject("No Employees in Status");
            }
        }else{
            reject("How are there no employees?");
        }
    })
}



function getEmployeeByNum(num){
    var temp = ""; 
    return new Promise(function(resolve, reject){
        if (employees.length > 0){
         for (let i = 0; i < employees.length; i++){
             if(employees[i].employeeNum == num)
             temp = employees[i];
        }
        if (temp != ""){ 
             resolve(temp);
         }else{
             reject("No Employees by that number");
         }
    }else{
        reject("How are there no employees?");
    }   
    })
}


//Assignment4
//Add the new method: updateEmployee(employeeData) that returns a promise
// Search through the "employees" array for an employee with an employeeNum that matches the JavaScript object 
// (parameter employeeData).
// o When the matching employee is found, overwrite it with the new employee passed in to the function 
// (parameter employeeData)
// o Once this has completed successfully, invoke the resolve() method without any data.
function updateEmployee(employeeData){
    return new Promise(function(reject, resolve){
        if(employees.length > 0){
            for(let i = 0; i <= employees.length; i++){
                if(employees[i].employeeNum == employeeData.employeeNum){
                    employees[i]=employeeDate;
                    resolve();
                }
            }
           
        }else{
            reject();
        }
    })
}




//slightly important
module.exports = {
    initialize,
    getAllEmployees,
    getManagers,
    getDepartments,
    addEmployee,
    getEmployeesByStatus,
    getEmployeesByDepartment,
    getEmployeesByManager,
    getEmployeeByNum,
    updateEmployee
};


// module.exports = {initialize, getAllEmployees, getManagers, getDepartments};
// //module.experts(initialize());  ?????

 



