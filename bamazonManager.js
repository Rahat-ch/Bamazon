//required dependencies
var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table');

//create a connection the mysql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "bamazon_DB"
});

//connect and run inventory and menu functions
connection.connect(function(err){
  if (err) throw err;
  console.log("Connected to Bamazon");
  inventoryUpdate();
  mainMenu();
});

//my global variables
var updateItem = {};

//function for items that need to be updated
var inventoryUpdate = function() {
  updateItem = {};
};

//display actions manager can take
var mainMenu = function(){
  inquirer.prompt([
    {
      type: 'list',
      message: 'What would you like to do?',
      choices: ['View products for sale','View low inventory','Add to inventory','Add new product'],
      name: 'action'
    }
  ]).then(function (answer){
    switch (answer.action) {
        case 'View products for sale':
          getInventory();
        break;

        case 'View low inventory':
          viewLow();
        break;

        case 'Add to inventory':
          addInventory();
        break;

        case 'Add new product':
          addProduct();
        break;
    }
  });
};

//switch case functions

//function that displays inventory
var getInventory = function(){
  connection.query("SELECT * FROM products", function(err,res){
    if (err) throw err;

//create a table to display the inventory via cli table
var table = new Table(
  {
    head: ["Product ID", "Product Name", "Department Name", "Price", "Stock Quanitity"],
    colWidths: [15,75,25,15,15],
  });
  //loop inventory and push to table
  for (var i = 0; i < res.length; i++) {
    table.push(
      [res[i].item_id, res[i].product_Name, res[i].department_Name, res[i].price, res[i].stock_quantity]
    );
  }

  console.log(table.toString());
  returnToMenu();
});
};

var viewLow = function(){
  connection.query("SELECT * FROM products WHERE stock_quantity < 5 ORDER BY stock_quantity DESC", function(err,res){
    if (res.length > 0) {
      var lowStockTable = new Table(
        {
          head: ["Product ID", "Product Name", "Stock Quantity", "Price"],
          colWidths: [15,75,15,15]
        });

        for (var i = 0; i < res.length; i++) {
          lowStockTable.push(
            [res[i].item_id, res[i].product_Name,res[i].stock_quantity, res[i].price]
          );
        }

        console.log(lowStockTable.toString());
        returnToMenu();
    } else {
      console.log("You are well stocked!");
      returnToMenu();
    }
  });
};

var addInventory = function(){
  inquirer.prompt([
    {
      type: "number",
      message: "What is the ID of the item you would like to restock?",
      name: "id"

    },
    {
      type: "number",
      message: "How much would you like to add to the stock quantity?",
      name:"amount"
    }
  ]).then(function (answer){

    var id = answer.id;
    var amount = answer.amount;

    connection.query('SELECT * FROM products WHERE item_id = ' + id, function(err, stockItem){

      //add additional stock quantity
      connection.query("UPDATE products SET stock_quantity=? WHERE item_id=?", [stockItem[0].stock_quantity + amount, id],
      function (err,stock) {
        if (err) throw err;
        getInventory();

      });

    });
  });
};

//prompt for information needed to add a new product
var addProduct = function(){
  inquirer.prompt([
    {
      type: 'input',
      message: 'What is the name of your new product?',
      name: 'name'
    },
    {
      type: 'input',
      message: 'What department does this product belong in?',
      name: 'department'
    },
    {
      type: 'number',
      message: 'What is the sale price?',
      name: 'price'
    },
    {
      type: 'number',
      message: 'How much stock will you be adding?',
      name: 'stock'
    }
  ]).then(function (newProduct){
    connection.query('INSERT INTO products SET ?',{
      product_Name: newProduct.name,
      department_Name: newProduct.department,
      price: newProduct.price,
      stock_quantity: newProduct.stock
    }, function(err,stock){
      if (err) throw err;
      getInventory();
    })
  })
};

var returnToMenu = function(){
  inquirer.prompt([
    {
      type: "list",
      message: "Would you like to return to the main menu?",
      choices: ['Yes','No'],
      name: "return"
    }
  ]).then(function (answer){
    if (answer.return === 'Yes') {
      mainMenu();
    } else {
      connection.end();
    }
  });
};
