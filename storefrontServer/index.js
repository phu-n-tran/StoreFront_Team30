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
    database: "Storefront"
});

app.use(cors());

app.get('/',(req,res) =>{

});

app.get('/users', (req,res) =>{
    const { id } = req.query;
    pool.getConnection(function(err, con){
        con.query(`select * from Account where accountID='${id}'`, (err, results) =>{
            if(err) res.send(err);

            else{
                res.send({
                    ...results
                });
            }
        });
        con.release();
    });
});

app.get('/users/add', (req,res) => {
    const { email, password, name, cell, address } = req.query;
    pool.getConnection(function (err, con){
        con.query(`insert into Account (email, password, name, cell, address) values(
            '${email.trim()}',
            '${password}',
            '${name}',
            '${cell}',
            '${address}'
            )`, (err,results) =>{
                if (err) res.send(err);
                else res.send(`Account successfully created with email ${email}`);
            });
        con.release();
    });
});

app.get('/users/remove', (req,res) => {
    const { id } = req.query;
    pool.getConnection(function (err, con) {
        con.query(`delete from Account where accountID='${id}'`, (err, results) => {
            if (err) res.send(err);
            else res.send(`Successfully deleted account ${id}`); 
        })
        con.release();
    })
});

app.get('/cards', (req,res) => {
    const { id } = req.query;
    pool.getConnection(function (err, con){
        con.query(`
        select 
            cardID, 
            CardHolder,
            CVV, 
            Zip, 
            CardNumber
        from 
            holds
        inner join 
            CardInfo 
        using 
            (cardID) 
        where 
            accountID = ${ id }
        `, (err, results) => {
            if(err) res.send(err);
            else{
                res.send({
                    data: results
                });
            }
        });

        con.release();
    });
});

app.get('/cards/add', (req,res) => {
    const { id, cardHolder, CVV, Zip, CardNumber } = req.query;
    pool.getConnection(function (err, con) {
        con.query(`
        insert into 
            CardInfo(CardHolder, CVV, Zip, CardNumber) 
        values
            ${cardHolder},
            ${CVV},
            ${Zip},
            ${CardNumber}
        `, (err, results) => {
            if(err) res.send(err);
            else{
                con.query(`
                select cardID from CardInfo 
                where
                    CardHolder = ${cardHolder} and
                    CVV = ${CVV} and
                    Zip = ${Zip} and
                    CardNumber = ${CardNumber}`, (err, results) => {
                        if(err) res.send(err);
                        else{
                            con.query(`
                            insert into
                                holds(accountID, cardID)
                            values 
                                ${id},
                                ${results[0].cardID}
                            `, (err,res) => {
                                if(err) res.send(err)
                                else{
                                    res.send(`Successfully added card into account id ${id}`);
                                }
                            });
                        }
                    });
            }
        });

        con.release();
    });
});

app.get('/cards/remove', (req,res) => {
    const { id, cardID } = req.query;
    pool.getConnection(function(err, con){
        con.query(`select * from holds where accountID = ${id} and cardID = ${cardID}`, (err, results) => {
            if(err) res.send(err);
            else{
                if(results.length == 1) {
                    con.query(`delete from CardInfo where cardID = ${cardID}`, (err, results) => {
                        if(err) res.send(err);
                        else{
                            con.query(`delete from holds where accountID = ${id} and cardID = ${cardID}`, (err, results) => {
                                if(err) res.send(err);
                                else res.send(`Successfully deleted card of id ${cardID}`);
                            })
                        }
                    })
                } else{
                    res.send(`Card of ID ${cardID} not found`)
                }
            }
        });
        con.release();
    });
});

app.get('/item', (req,res) => {
    const { itemID } = req.query;
    pool.getConnection(function(err, con){
        if(!itemID) {
            con.query(`select * from Item`, (err, results) => {
                if(err) res.send(err);
                else{
                    res.send(results)
                }
            })
        } else{
            con.query(`select * from Item where itemID = ${itemID}`, (err,results) => {
                if(err) res.send(err);
                else{
                    res.send(results);
                }
            })
        }

        con.release();
    });
});

app.get('/item/add', (req, res) => {
    const { name, price, description, image } = req.query;
    pool.getConnection(function(err, con) {
        con.query(`
        insert into Item(name, price, description, image)
        values(
            ${name},
            ${price},
            ${description},
            ${image}
        )`, (err, results) => {
            if(err) res.send(err);
            else res.send(results);
        });
        con.release;
    });
});

app.get('/item/remove', (req, res) => {
    const { itemID } = req.query;
    pool.getConnection(function(err, con) {
        con.query(`delete `)
    })
})
// app.get('/tempTables', (req,res) =>{
//     pool.getConnection(function(err, con){
//         con.query('select * from Temp', (err, results) => {
//             if(err) res.send(err);
//             else {
//                 return res.json({
//                     data: results
//                 });
//             }
//         });

//         con.release();
//     });
// });

// app.get('/tempTables/add', (req,res) =>{
//     const { name, age } = req.query;
//     dobY = 2019 - age;
//     dobQ = dobY + "-1-1";
//     pool.getConnection(function(err, con){
//         con.query(`insert into Temp (name, age, dob) values('${name.trim()}', ${age}, '${dobQ}')`, (err, results) => {
//             if(err) res.send(err);
//             else res.send(`Successfully added ${name} of age ${age} into the table`);
//         });

//         con.release();
//     });
// });

// app.get('/tempTables/remove', (req,res) =>{
//     const { id } = req.query;
//     pool.getConnection(function(err, con){
//         con.query(`delete from Temp where id = ${id}`, (err, results) => {
//             if(err) res.send(err);
//             else res.send(`Successfully deleted entry ${id} from the table`);
//         });

//         con.release();
//     });
// });

app.listen(4000, () => {
    console.log('Backend server listening on port 4000');
});