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

// /users/login?email={email}&password={password}
app.get('/users/login', (req,res) =>{
    const { email, password } = req.query;
    pool.getConnection(function(err, con) {
        con.query(`select accountID from Account where email='${email}' and password='${password}'`, (err, results) => {
            if (err) res.send(err);
            else res.send(results);
        });

        con.release();
    });
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
        con.query(`select accountID from Account where email='${email}'`, (err, results) => {
            if(err) res.send(err);
            else {
                if(results.length == 0){
                    con.query(`insert into Account (email, password, name, cell, address) values(
                        '${email.trim()}',
                        '${password}',
                        '${name}',
                        '${cell}',
                        '${address}'
                        )`, (err,results) =>{
                            if (err) res.send(err);
                            else res.send({
                                accountID: results.insertId
                            });
                    });
                } else res.send({
                accountID: "Email already exists"
                });
            }
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
                            });
                        }
                    });
                } else{
                    res.send(`Card of ID ${cardID} not found`)
                }
            }
        });
        con.release();
    });
});

app.get('/item/categories', (req,res) => {
    // const { categoryID } = req.query;
    pool.getConnection(function(err, con) {
        con.query(`select * from Categories`, (err, results) =>{
            if(err) res.send(err)
            else res.send(results);
        });
        con.release();
    });
});

app.get('/item', (req,res) => {
    const { itemID, categoryID } = req.query;
    pool.getConnection(function(err, con){
        if(!itemID && !categoryID) {
            con.query(`select * from Item`, (err, results) => {
                if(err) res.send(err);
                else{
                    res.send(results)
                }
            });
        } else if(!categoryID) {
            con.query(`select * from Item where itemID = ${itemID}`, (err,results) => {
                if(err) res.send(err);
                else{
                    res.send(results);
                }
            });
        } else if(!itemID) {
            con.query(`
                select c.categoryID, c.categoryName, i.itemID, i.itemName, i.price, i.description, i.image, i.quantity from belongs inner join Item as i using (itemID) inner join Categories as c using (categoryID) where categoryID = ${categoryID};    
            `, (err, results) => {
                if(err) res.send(err);
                else res.send(results);
            });
        } else {
            con.query(`
                select c.categoryID, c.categoryName, i.itemID, i.itemName, i.price, i.description, i.image, i.quantity from belongs inner join Item as i using (itemID) inner join Categories as c using (categoryID) where categoryID = ${categoryID} and itemID = ${itemID}
            `, (err, results) => {
                if(err) res.send(err);
                else res.send(results);
            });
        }

        con.release();
    });
});

app.get('/item/add', (req, res) => {
    const { name, price, description, image, categoryID } = req.query;
    pool.getConnection(function(err, con) {
        con.query(`
        insert into Item(itemName, price, description, image)
        values(
            ${name},
            ${price},
            ${description},
            ${image}
        )`, (err, results) => {
            if(err) res.send(err);
            else {
                con.query(`select itemID from Item where itemName = ${name} and price = ${price} and description = ${description}`, (err, results) => {
                    if(err) res.send(err);
                    else{
                        con.query(`insert into belongs(itemID, categoryID) values(${results[0].itemID}, ${categoryID})`, (err, results) => {
                            if(err) res.send(err);
                            else res.send(`Successfully added ${name} into the database`);
                        });
                    }
                });
            }
        });
        con.release();
    });
});

app.get('/item/remove', (req, res) => {
    const { itemID } = req.query;
    pool.getConnection(function(err, con) {
        con.query(`delete from Item where itemID = ${itemID}`,(err, results) => {
            if(err) res.send(err);
            else{
                con.query(`delete from belongs where itemID = ${itemID}`, (err, results) => {
                    if(err) res.send(err);
                    else res.send(`Successfully deleted item ${itemID} from database`);

                });
            }
        });
        con.release();
    });
});

app.get('/orders', (req, res) => {
    const { id, orderID } = req.query;
    pool.getConnection(function(err, con) {
        if(!orderID){
            con.query(`
            select orderID, price from make inner join Orders using (orderID) inner join Account using (accountID) where accountID = ${id}
            `, (err, results) => {
                if(err) res.send(err);
                else res.send(results);
            });
        } else {
            con.query(`
            select orderID, price from make inner join Orders using (orderID) inner join Account using (accountID) where accountID = ${id} and orderID = ${orderID}
            `, (err, results) => {
                if(err) res.send(err);
                else res.send(results);
            });
        }

        con.release();
    });
});

// /orders/add?items=[[itemid, quantity], [itemid, quantity]]&accountID=`accountID`
app.get(`/orders/add`, (req, res) => {
    var accountID = req.query.accountID;
    var items = JSON.parse(req.query.items);
    var price = 0;
    var lastInsert;

    // console.log(items.length);
    pool.getConnection(function(err, con) {
        con.query(`insert into Orders(price) values('0')`, (err, results) =>{
            if(err) res.send(err);
            else {
                lastInsert = results.insertId;
                for(i = 0; i < items.length; i++){
                    con.query(`insert into contain(orderID, itemID, quantity) values('${lastInsert}','${items[i][0]}','${items[i][1]}')`, (err, results) =>{
                        if(err) res.send(err);
                        else{
                            con.query(`select price from Item where itemID='${items[i][0]}'`, (err, results) =>{
                                if(err) res.send(err);
                                else prices += results[0].price;
                            });
                        }
                    });
                }
        
                con.query(`update Orders set price='${price}' where orderID='${lastInsert}'`, (err, results) =>{
                    if(err) res.send(err);
                });
        
                con.query(`insert into make(accountID, orderID) values('${accountID}', '${lastInsert}')`, (err, results) =>{
                    if(err) res.send(err);
                    else res.send(`Successfully created order with id ${lastInsert} associated with account ${accountID}`);
                });
            }
        });

        con.release();
    });
});

app.get('/stock', (req,res) =>{
    const { stockID } = req.query;

    pool.getConnection(function (err,con) {
        con.query(`select * from StockLevels where stockID='${stockID}'`, (err,results) =>{
            if(err) res.send(err);
            else res.send(results);
        });

        con.release()
    });
});

app.get('/stock/add', (req,res) =>{
    const { itemID, quantity, date } = req.query;
    var lastInsert;

    pool.getConnection(function (err,con) {
        con.query(`insert into StockLevels(date, quantity) values('${date}', '${quantity}')`, (err,results) =>{
            if(err) res.send(err);
            else {
                lastInsert = results.insertId;

                con.query(`insert into has(stockID, itemID) values('${lastInsert}','${itemID}')`, (err, results) =>{
                    if(err) res.send(err);
                });
        
                con.query(`select quantity from Item where itemID='${itemID}'`, (err, results) =>{
                    if(err) res.send(err);
                    else{
                        var newQuantity = parseInt(quantity) + parseInt(results[0].quantity);
                        con.query(`update Item set quantity='${newQuantity}' where itemID='${itemID}'`, (err, results) => {
                            if(err) res.send(err);
                            else res.send({
                                itemID: itemID,
                                newQuantity: newQuantity
                            });
                        });
                    }
                });
            }
        });
        
        con.release();
    });
});

app.listen(4000, () => {
    console.log('Backend server listening on port 4000');
});