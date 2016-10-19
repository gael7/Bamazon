var mysql=require('mysql');

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

conn.query('SELECT * FROM Products', function(err, res){
            if(err) throw err;
            var i = 0;
            while(i<res.length){
                var product = res[i];
                    console.log('Product ID: '+product.ItemID+" Product Name: "+product.ProductName+" Price: $"+product.Price);
                i++;
            }
    });
