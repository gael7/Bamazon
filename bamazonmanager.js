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
                        console.log('Product ID: '+product.ItemID+" Product Name: "+product.ProductName+" Price: $"+product.Price+" Inventory: "+product.StockQuantity);
                    i++;
                }
        });
  },
  addInventory: function(){
    bamazonM.viewProducts();
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
                        console.log(product.StockQuantity, answers.quantity);
                            var inventory=product.StockQuantity+answers.quantity;
                            bamazon.addquery(inventory, product.ItemID);
                            console.log('You just add '+answers.quantity+ ' '+product.ProductName+" to the inventory "+inventory);
                          }
                        i++;
      });
      });
    },
      addquery: function(inventory, id){
    conn.query('UPDATE Bamazon_db.Products SET StockQuantity='+inventory+' WHERE ItemID='+id, function (err, res){
      if (err) throw err;
      console.log("check mysql workbench");
      return;
});
}
};

bamazonM.viewLowInventory();
