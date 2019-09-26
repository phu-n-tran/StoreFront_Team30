const express = require('express');
const cors = require('cors');
var db = require('./db')

const app = express();

app.use(cors());

app.get('/',(req,res) =>{

});


app.get('/tempTables', (req,res) =>{
    db.query("SELECT * FROM Temp", (err, results) =>{
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
    dobY = 2019 - age;
    dobQ = dobY + "-1-1";
    console.log(`${name}`);
    // db.query(`INSERT INTO Temp (name, age, dob) VALUES('${name}', ${age}, '${dobQ}')`, (err, results) =>{
    //     if(err) res.send(err);
    //     else res.send(`Successfully added ${name} of age ${age} into the table`);
    // });
})

app.get('/tempTables/remove', (req,res) =>{
    const { id } = req.query;
    db.query(`DELETE FROM Temp where id = ${id}`, (err, results) =>{
        if(err) res.send(err);
        else res.send(`Successfully deleted entry ${id} from the table`);
    });
})

app.listen(4000, () => {
    console.log('Backend server listening on port 4000');
});