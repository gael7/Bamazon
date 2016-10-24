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


var bamazonC={
    welcome: function(){
      console.log("Welcome to Bazamon!!");
      this.showProducts();
    },
    showProducts: function(){
      conn.query('SELECT * FROM Products', function(err, res){
                  if(err) throw err;
                  var i = 0;
                  while(i<res.length){
                      var product = res[i];
                          console.log('Product ID: '+product.ItemID+" Product Name: "+product.ProductName+" Price: $"+product.Price);
                      i++;
                  }
                  bamazonC.prompt1();
          });

    },
    prompt1: function(){
    inquirer.prompt([{
        name: "product",
        message: "Type the ID of the product you would like to buy: ",
        validate: function(value){
          if (isNaN(value)===false) {
              return true;
          } else {
              return false;
          }
      }
    }, {
        name: "quantity",
        message: "How many would you like?: ",
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
                        if(product.StockQuantity<answers.quantity){
                          console.log("Insuficient quantity for "+product.ProductName);
                        } else {
                            var total=answers.quantity*product.Price;
                            var inventory=product.StockQuantity-answers.quantity;
                            console.log('You just bought '+answers.quantity+ ' '+product.ProductName+" your total was "+total);
                            bamazonC.lessInventory(inventory, product.ItemID);
                            bamazonC.selectDepartment(total, product.DepartmentName);
                          }
                        i++;
                    }
            });
      });
    },

    lessInventory: function(inventory, id){
      conn.query('UPDATE Bamazon_db.Products SET StockQuantity='+inventory+' WHERE ItemID='+id, function (err, res){
        if (err) throw err;
        console.log("check mysql workbench");
        return;
      });
    },

    selectDepartment: function(total, departments){
      var newSales;
      conn.query('SELECT * FROM Departments WHERE DepartmentName="'+departments+'"', function(err, res){
        if (err) throw err;
        var i = 0;
        while(i<res.length){
            var department = res[i];
            console.log(department.TotalSales);
            newSales=department.TotalSales+total;
            console.log(newSales);
            bamazonC.updateSales(newSales, departments);
            i++;
            }
      });
    },
    updateSales: function(total, department){
      console.log(total+" to change "+department);
      conn.query('UPDATE Departments SET TotalSales='+total+' WHERE DepartmentName="'+department+'"', function (err, res){
        if (err) throw err;
        console.log("check mysql workbench");
        return;
    });
  }

};

bamazonC.welcome();
