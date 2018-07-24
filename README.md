# bamazon-Node-Application

## Summary
This is a node application that is meant to be a pretend "store" where a user can purchase an item from a database holding stored items available for sale.

## Techniques
The inquirer npm package was used to get user input through the CUI.  The mysql npm package was used to format queries from mySQL database using JavaScript code.  The user is basically able to "purchase" an item by entering the id of the desired item and the amount of the item desired.  If the item is out of stock, the user is alerted through the command line.  If the user wants to purchase more than is in stock, the user is alerted of this as well.  If the quantity is available, the database is automatically updated to reflect the new quantity remaining and the customer is alerted of the total cost of their purchase.  

Please click the following link for a demonstration of this applicataion:  
