//Require sequelize
const Sequelize = require('sequelize');

//sets up the database
var sequelize = new Sequelize('d9p14dv8dr0apo', 'mxfpxajcurhedp', 'd2d5990863ad144df0d50fdd3657feae3f49c74132605cf1d8c70b149b19a155', {
    host: 'ec2-107-22-236-52.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: true
    }
});

//create an Employee table model
var Employee = sequelize.define('Employee',{
    employeeNum: {
       type: Sequelize.INTEGER,
       primaryKey: true,
       autoIncrement: true
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    SSN: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressState: Sequelize.STRING,
    addressPostal: Sequelize.STRING,
    maritalStatus: Sequelize.STRING,
    isManager: Sequelize.BOOLEAN,
    employeeManagerNum: Sequelize.INTEGER,
    status: Sequelize.STRING,
    department: Sequelize.INTEGER,
    hireDate: Sequelize.STRING
});

//setup a Department table model
var Department = sequelize.define('Department', {
    departmentId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    departmentName: Sequelize.STRING
});

Department.hasMany(Employee, {foreignKey: 'department'});

//calls the sync to initialize the database
function initialize(){
    return new Promise(function(resolve, reject){
        sequelize.sync()
        .then(function(data){
            resolve();
        })
        .catch(function(err){
            reject("unable to sync database");
        })       
    }); 
};

//displays all employees
function getAllEmployees(){
    return new Promise(function(resolve, reject){
       Employee.findAll()
       .then(function(data){
           resolve(data);
    }) 
    .catch(function(err){    
        console.log(err); 
        reject("no results returned");
    })
    });
}; 

//get employees that match the status provided
function getEmployeesByStatus(status) {
    return new Promise(function(resolve, reject){
        Employee.findAll({
            where: {
                status: status
            }
         })
        .then(function(data){
            resolve(data);
        })
        .catch(function(err){
         reject("no results returned");
        })
    })
};

//gets employees based on their department number
function getEmployeesByDepartment(department) {
    return new Promise(function(resolve, reject){
        Employee.findAll({
            where: {
                department: department
            }
        })
        .then(function(data){
            resolve(data);
        })
        .catch(function(err){
            reject("no results returned");
        })
    })
};

//prints list of employees based on their manager number
function getEmployeesByManager(manager) {
    return new Promise(function(resolve, reject){
        Employee.findAll({
            where: {
                employeeManagerNum: manager
            }
        })
        .then(function(data){
            resolve(data);
        })
        .catch(function(err){
            reject("no results returned");
        })
    })
}

//function that displays an employee by the employee number passed to it
function getEmployeeByNum(num){
    return new Promise(function(resolve, reject){
        Employee.findAll({
            where: {
                employeeNum: num
            }
        })
        .then(function(data){
            resolve(data[0]);
        })
        .catch(function(err){
            reject("no results returned");      
        })
    })
}

//displays departments
function getDepartments(){
    return new Promise(function(resolve, reject){
        Department.findAll()
        .then(function(data){
            resolve(data);
    })
    .catch(function(err){
        reject("no results returned");
    })
    });
};

//adds an employee to the array
function addEmployee(employeeData){ 
    return new Promise(function(resolve, reject){
        employeeData.isManager = (employeeData.isManager) ? true : false;
        for (const prop in employeeData){ 
            if (employeeData[prop] == ""){
                employeeData[prop] = null;
            }
        }
        Employee.create(employeeData)  
        .then(function(data){
            resolve();
        })
        .catch(function(err){
            reject("Unable to create employee");
        })
    })
}

//function that allows you to update an employee's information 
function updateEmployee(employeeData){
    return new Promise(function(resolve, reject){
        employeeData.isManager = (employeeData.isManager) ? true : false; 
        for (const prop in employeeData){ 
            if (employeeData[prop] == ""){
                employeeData[prop] = null;
            }
        }
        Employee.update(employeeData,
        {
            where: {employeeNum: employeeData.employeeNum}
        }) 
        .then(function(data){
            resolve();
        })
        .catch(function(err){
            reject("unable to update employee");
        })
    })
}

//function that allows for the addition of more Departments to the database
function addDepartment(departmentData){
    return new Promise(function(resolve, reject){
        for (const prop in departmentData){ 
            if (departmentData[prop] == ""){
                departmentData[prop] = null;
            }
        }
        Department.create(departmentData) 
        .then(function(data){
            resolve();
        })
        .catch(function(err){
            reject("unable to create department");
        })
    })
}

//function that allows for the updating of Departments in the database
function updateDepartment(departmentData){
    return new Promise(function(resolve, reject){
       for (const prop in departmentData){ 
            if (departmentData[prop] == ""){
                departmentData[prop] = null;
            }
        }
        Department.update(departmentData,
        {
          where: {departmentId: departmentData.departmentId}  
        }) 
        .then(function(data){
            resolve();
        })
        .catch(function(err){
            reject("unable to update department");
        })
    })
}

//function that allows for the searching of Departments in the database
function getDepartmentById(id){
    return new Promise(function(resolve, reject){
        Department.findAll({
            where: {
                departmentId: id
            }
        }) 
        .then(function(data){
            resolve(data[0]);
        })
        .catch(function(err){
            reject("no results returned");
        })
    })
}

function deleteDepartmentById(id){
    return new Promise(function(resolve, reject){
        Department.destroy({
          where:{ departmentId: id}
        })
        .then(function(data){
            resolve();
        })
        .catch(function(err){
            console.log(err);
        
            reject();
        })
    })
}

//deletes an employee by the passed number
function deleteEmployeeByNum(empNum){
    return new Promise(function(resolve, reject){
        Employee.destroy({
          where:{ employeeNum: empNum}
        })
        .then(function(data){
            resolve();
        })
        .catch(function(err){
            reject();
        })
    })
}

//slightly important
module.exports = {
    initialize,
    getAllEmployees,
    getDepartments,
    addEmployee,
    getEmployeesByStatus,
    getEmployeesByDepartment,
    getEmployeesByManager,
    getEmployeeByNum,
    updateEmployee,
    addDepartment,
    updateDepartment,
    getDepartmentById,
    deleteEmployeeByNum,
    deleteDepartmentById
};