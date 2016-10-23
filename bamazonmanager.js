var mysql=require('mysql');
var inquirer = require('inquirer');

var conn=mysql.createConnection({
  host: '127.0.0.1',
  port: 3306,
  user: 'gael',
  password: '07G15a92',
  database: 'Bamazon_db'
});

conn.connect(function(err){
  if (err){
    console.log(err);
    return;
  }

});

var bamazonM={
  displayOptions: function(){
    inquirer.prompt([{
      type: 'list',
      name: 'option',
      message: 'Select your manager option',
      choices:['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product']
    }]).then(function(answers) {
        switch (answers.option) {
          case 'View Products for Sale':
          bamazonM.viewProducts();
          break;
          case 'View Low Inventory':
          bamazonM.viewLowInventory();
          break;
          case 'Add to Inventory':
          bamazonM.addInventory();
          break;
          case 'Add New Product':
          bamazonM.addNewProduct();
          break;
      }
    });
  },
  viewProducts: function(){
    conn.query('SELECT * FROM Products', function(err, res){
                if(err) throw err;
                var i = 0;
                while(i<res.length){
                    var product = res[i];
                        console.log('Product ID: '+product.ItemID+" Product Name: "+product.ProductName+" Price: $"+product.Price+" Inventory: "+product.StockQuantity);
                    i++;
                }
        });
  },
  viewLowInventory: function(){
    conn.query('SELECT * FROM Products WHERE StockQuantity<5', function(err, res){
                if(err) throw err;
                var i = 0;
                while(i<res.length){
                    var product = res[i];
                        console.log('Product ID: '+product.ItemID+" Product Name: "+product.ProductName+" Inventory: "+product.StockQuantity);
                    i++;
                }
        });
  },
  addInventory: function(){
    bamazonM.viewProducts();

    bamazonM.addPrompt();
    },
  addPrompt: function(){
    inquirer.prompt([{
        name: "product",
        message: "Which item would you like to restock: ",
        validate: function(value){
          if (isNaN(value)===false) {
              return true;
          } else {
              return false;
          }
      }
    }, {
        name: "quantity",
        message: "How many would you like to restock?: ",
        validate: function(value){
          if (isNaN(value)===false){
            return true;
          } else {
            return false;
          }
        }
      }]).then(function(answers) {
        conn.query('SELECT * FROM Products WHERE ItemID="'+answers.product+'"', function(err, res){
                    if(err) throw err;
                    var i = 0;
                    while(i<res.length){
                        var product = res[i];
                            var inventory=parseInt(product.StockQuantity)+parseInt(answers.quantity);
                            bamazonM.addquery(inventory, product.ItemID);
                            console.log('You just add '+answers.quantity+ ' '+product.ProductName+" to the inventory "+inventory);
                            i++;
                          }

      });
      });
  },
  addquery: function(inventory, id){
    conn.query('UPDATE Bamazon_db.Products SET StockQuantity='+inventory+' WHERE ItemID='+id, function (err, res){
      if (err) throw err;
      console.log("check mysql workbench to view the change");
      return;
});
},
  addNewProduct: function(){
    inquirer.prompt([{
      name: 'productname',
      message: 'What is the name of the product',
    },{
      name: 'productprice',
      message: 'What is the price of the product',
      validate: function(value){
        if (isNaN(value)===false) {
            return true;
        } else {
            return false;
        }
      }
      },{
        name: 'inventory',
        message: 'How many do you wanna add to the inventory?',
        validate: function(value){
          if (isNaN(value)===false) {
              return true;
          } else {
              return false;
          }
        }
      },{
        name: 'department',
        message: 'Which is the department for this item?',
    }]).then(function(answers) {
      conn.query('INSERT INTO Bamazon_db.Products (ProductName, DepartmentName, Price, StockQuantity) VALUES ("'+answers.productname+'", "'+answers.department+'", "'+answers.productprice+'", "'+answers.inventory+'")', function (err, res){
        if (err) throw err;
        console.log("check mysql workbench");
        return;
  });
});
}
};

bamazonM.displayOptions();
