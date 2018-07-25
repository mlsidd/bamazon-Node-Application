// Create a Node application that first displays all items available for sale. Include the ids, names, and prices of products for sale.
var mysql = require("mysql");

var inquirer = require("inquirer");

// Create configuration so can connect to database
var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "Avery0504",
    database: "bamazon"
});

// Connect to database via connection variable above
connection.connect(function (err) {
    if (err) throw err;
    promptUser();
});

// function to ask user starting question
function promptUser() {
    inquirer
        .prompt(
            {
                name: "userRequest",
                type: "list",
                message: "What would you like to do today?",
                choices: ["Purchase an item", "I am finished with my transaction"]
            }
        )
        .then(function (answer) {
            if (answer.userRequest === "I am finished with my transaction") {
                console.log("Thank you for your business!")
                connection.end();
                process.exit();
            } else {
                makePurchase();
            }
        });
} // end of promptUser function


// Function to fulfill customers order by updating SQL database to reflect the remaining quantity.    
function updateProduct(id, quantityRequesting, currentQuantity, productName, price) {
    var customerCost = parseFloat(price) * parseInt(quantityRequesting);
    var product = productName;
    connection.query(
        "UPDATE products SET ? WHERE ?",
        [
            {
                stock_quantity: parseInt(currentQuantity) - parseInt(quantityRequesting)
            },
            {
                item_id: id
            }
        ],
        function (err, res) {
            if (err) throw err;
            // Once the update goes through, show the customer the total cost of their purchase.
            console.log(res.affectedRows + " product updated!\n" + "Your total cost for " + product + " is:  $" + customerCost);
            promptUser();
        }
    );
} // end of updateProduct function

function makePurchase() {
    inquirer
        .prompt([
            // First ask user for the ID of the product they would like to buy.
            {
                name: "id",
                type: "input",
                message: "What is the id of the product you would like to buy?",
                // validate: function(value) {
                //     if (isNaN(value) === false) {
                //       return true;
                //     }
                //     return false;
                //   }
            },
            // Second ask how many units of the product the user would like to buy.
            {
                name: "quantity",
                type: "input",
                message: "How many would you like to buy?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ])
        // Prompt method returns a promise containing the answers
        .then(function (answer) {
            // store answers in variables
            var itemId = parseInt(answer.id);
            var quantityRequested = parseInt(answer.quantity);

            // Create query to search database table
            var query = "SELECT item_id, product_name, stock_quantity, price FROM products WHERE ?";
            connection.query(query, { item_id: itemId }, function (err, res) {
                // Once the customer has placed the order, check if the "store" has enough of the product to meet the customer's request.
                // If not enough, log a phrase like "Insufficient quantity!", and then prevent the order from going through.
                if (res[0].stock_quantity === 0) {
                    console.log("Insufficient quantity!")
                    promptUser();
                    // If the "store" does have enough of the product, you should fulfill the customer's order
                } else if (res[0].stock_quantity < quantityRequested) {
                    console.log("There is only " + res[0].stock_quantity + " of this item remaining.")
                    promptUser();
                } else {
                    updateProduct(itemId, quantityRequested, res[0].stock_quantity, res[0].product_name, res[0].price);
                }
            });
        });
} // end of makePurchase function



