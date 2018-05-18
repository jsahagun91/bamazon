var mysql = require("mysql");
var inquirer = require("inquirer");
var table = require("console.table");

// create the connection information for the sql dtabase
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // Your username
    user: "root",

    password: "",
    database: "bamazon_db"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
    if (err) throw err;
    // run the start function after connection is made to prompt the user
    displayItems();
});

//  function which displays all item for sale.
function displayItems() {
    var query = "SELECT * FROM products";
    connection.query(query, function (err, res) {
        // for (var i = 0; i < res.length; i++) {
        //     console.log(
        //       "ID: " +
        //       res[i].id +
        //       " || Item: " +
        //       res[i].item_name +
        //       " || Department: " +
        //       res[i].department_name +
        //       " || Price: " +
        //       res[i].price,
        //       " || In Stock: " +
        //       res[i].stock_quantity
        //     );
        // };
        console.table(res);
        // run start function after displaying all products
        start();
        // console.log(res);
    });
}
// function which prompts the user for what action the should take
function start() {
    inquirer
    .prompt([
        {
        name: "id",
        type: "input",
        message: "What is the ID of the product you would like to buy?",
        validate: function(value) {
            if (!isNaN(value) && value< 11) {
                return true;
            }
            return false;
        }
    },
        {
            name: "quant",
            type: "input",
            message: "How many of these items would you like to buy? \n",
            validate: function(value) {
                if (!isNaN(value)) {
                    return true;
                }
                return false;
               }
           }
    ])
    .then(function(answer) {
        // get the information of the chosen item
        // console.log("Answer: ", answer.id);
        var chosenItem = answer.id;
        console.log("Chosen item id: " , chosenItem);

        var itemQuant = answer.quant;
			console.log("Chosen quantity from stock: " , itemQuant , "\n");
		connection.query("SELECT * FROM products WHERE ?", [{ id: answer.id }], function(err, res) {
				if (err) throw err;
				//grab the id from the table that matches
				//return the id
				console.table(res);
				var current_quantity = res[0].stock_quantity;
				console.log("Current quantity in stock: " , current_quantity);
				var price = res[0].price;
				var remaining_quantity = current_quantity - answer.quant;
				console.log("Remaining quantity in stock: " , remaining_quantity);

				if(current_quantity > answer.quant) {

					console.log("Amount Remaining: " + remaining_quantity);
					console.log("Total Cost: " + (answer.quant * price) + "\n");

					connection.query("UPDATE products SET stock_quantity=? WHERE id=?",
                    [
                    remaining_quantity, answer.id
                    ],

					// connection.query("UPDATE products SET stock_quantity=? WHERE id?",
					// 	[remaining_quantity, answer.id],

						function(err, res){
							console.table(res);
						});

					connection.query("SELECT * FROM products", function(err, res) {
						console.log("Here is an updated inventory: ");
                        console.log("------------------------------- \n");
                        console.table(res);
					});

				} else {
					console.log("Insufficient amounts, please try again!");
				}

			connection.end();

			});
		})

}
