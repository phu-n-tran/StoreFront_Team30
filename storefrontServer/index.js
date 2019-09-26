const express = require('express');
const cors = require('cors');
const mysql = require('mysql');

const app = express();

const connection = mysql.createConnection({
    port: "3306",
    host: "storefront.clcipke8dynd.us-west-1.rds.amazonaws.com",
    user: "root",
    password: "$aaronphuevanteam30storefront#",
});

connection.connect(err =>{
    if(err){
        return err;
    }
});

app.use(cors());

app.get('/',(req,res) =>{
    
});

app.get('/tempTables', (req,res) =>{
    connection.query("use CS157ATest");
    connection.query("SELECT * FROM Temp", (err, results) =>{
        if(err) res.send(err);
        else{
            return res.json({
                data: results
            });
        }
    });
});

app.get('/tempTables/add', (req,res) =>{
    const { name, age, dob } = req.query;
    connection.query("use CS157ATest");
    connection.query(`INSERT INTO Temp (name, age, dob) VALUES('${name}', ${age}, '${dob}')`, (err, results) =>{
        if(err) res.send(err);
        else res.send(`Successfully added ${name} of age ${age} into the table`);
    });
})

app.listen(4000, () => {
    console.log('Backend server listening on port 4000');
});