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
})

//connect and run inventory function
connection.connect(function(err){
  if (err) throw err;
  console.log("Connected to Bamazon");
  getInventory();
});


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
  buySomething();
  })
};

//function for purchasing an item
var buySomething = function(){
  //ask the "customer" what they woul dlike to purchase via inquierer
  inquirer.prompt([
    {
      type: "number",
      message: "If you would like to purchase an item, please enter the product ID now.",
      name: "id"
    },
    {
      type: "number",
      message: "How many of this item would you like to purchase?",
      name: "quantity"
    },
    //once we have the input time to query the database and remove the purchases form the inventory
  ]).then(function (purchase){

    var id = purchase.id;
    var quantity = purchase.quantity;

    connection.query('SELECT * FROM products WHERE item_id = ' + id, function(err, customerItem){
      if (err) throw err;

      //check if item quntity is enough
      if (customerItem[0].stock_quantity >= quantity) {
        console.log("Checking Inventory...");
        console.log("The item you desire is available in the quantity you desire. We will assume you have infinite funds and a drone will deliver your purchase shortly. Please tip the drone");

        //remove the item from stock_quantity
        connection.query("UPDATE products SET stock_quantity=? WHERE item_id=?", [customerItem[0].stock_quantity - quantity, id],
        function (err,stock) {
          if (err) throw err;
          keepShopping();

        });
      } else {
        console.log("Checking Inventory...");
        console.log("YOU CANNOT BUY THIS! Choose an existing item or change your quantity");
        getInventory();

      }
    });


  });
};

var keepShopping = function(){
  inquirer.prompt([
    {
      type: "list",
      message: "Would you like to keep shopping?",
      choices: ['Yes','No'],
      name: "return"
    }
  ]).then(function (answer){
    if (answer.return === 'Yes') {
      getInventory();
    } else {
      connection.end();
    }
  });
};
