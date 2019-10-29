const express = require('express');
const cors = require('cors');
var Config = require('./config');
var mysql = require('mysql');

const app = express();

var pool = mysql.createPool({
    connectionLimit : 66,
    host: Config.dbHost,
    user: Config.username,
    password: Config.password,
    database: "CS157ATest"
});

app.use(cors());

app.get('/',(req,res) =>{

});

app.get('/tempTables', (req,res) =>{
    pool.getConnection(function(err, con){
        con.query('select * from Temp', (err, results) => {
            if(err) res.send(err);
            else {
                return res.json(
                    {
                    ...results,
                    data: true
                });
            }
        });

        con.release();
    });
});

app.get('/tempTables/add', (req,res) =>{
    const { name, age } = req.query;
    dobY = 2019 - age;
    dobQ = dobY + "-1-1";
    pool.getConnection(function(err, con){
        con.query(`insert into Temp (name, age, dob) values('${name.trim()}', ${age}, '${dobQ}')`, (err, results) => {
            if(err) res.send(err);
            else res.send(`Successfully added ${name} of age ${age} into the table`);
        });

        con.release();
    });
});

app.get('/tempTables/remove', (req,res) =>{
    const { id } = req.query;
    pool.getConnection(function(err, con){
        con.query(`delete from Temp where id = ${id}`, (err, results) => {
            if(err) res.send(err);
            else res.send(`Successfully deleted entry ${id} from the table`);
        });

        con.release();
    });
});

app.listen(4000, () => {
    console.log('Backend server listening on port 4000');
});