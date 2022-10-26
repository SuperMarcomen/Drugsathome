const parser = require('./parser.js');
var mysql = require('mysql2');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "GcXmB86^!Vm2R8DjgK46",
  database: "drugsathome"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");

  const sql = "CREATE TABLE `drugs` ("
	+ "`pzn` INT(8) NOT NULL, "
	+ "`name` VARCHAR(50) NOT NULL, "
	+ "`description` TEXT NOT NULL, "
	+ "`purchase_date` DATE NOT NULL, "
	+ "`max_use_date` DATE NOT NULL, "
  + "`img` VARCHAR(255) NOT NULL, "
	+ "PRIMARY KEY (`pzn`) "
    + ");";
  con.query(sql, function (err, result) {
    if (err && err.errno == 1050) console.log("Table already exists");
    else console.log("Table created");
    
  });
});

module.exports = {
  addDrug: async function(pzn) {
      const drugsData = await parser.getDrugsData(pzn);
      if (drugsData === undefined) return;
      const name = await drugsData.name,
            description = drugsData.description,
            img = drugsData.img;

      console.log("name:" + name);

      const currentDate = new Date();
      const formCurrentDate = currentDate.toISOString().split('T')[0];
      currentDate.setMonth(currentDate.getMonth() + 6);
      const expDate = currentDate;
      const formExpDate = expDate.toISOString().split('T')[0]; // TODO get exp date from user

      const sql = "INSERT INTO drugs (pzn, name, description, purchase_date, max_use_date, img) VALUES (?, ?, ?, ?, ?, ?);";

      con.query(sql, [pzn, name, description, formCurrentDate, formExpDate, img], function (err, result) {
        if (err && err.code == 'ER_DUP_ENTRY') console.error(`A drug with the PZN ${pzn} is already present in the database!`);
      });
  },

  getDrugs: async function() {
    console.log("chiamato 1");
      const sql = "SELECT * FROM drugs;"
      return new Promise((resolve, reject) =>{
        try {
            con.query(sql, function (err, result) {
                if (err) {
                    return reject(err)
                }
                
                return resolve(result)
            });
        }
        catch(e) {
            reject(e)
        }
      });
  }
};