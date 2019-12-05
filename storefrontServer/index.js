const express = require('express');
const cors = require('cors');
var Config = require('./config');
var mysql = require('mysql');
var md5 = require('md5');
const uuidv5 = require('uuid/v5');

var uuidNameSpace = '85991d47-e742-45ea-83ff-b987d9f9c206';

const app = express();

var pool = mysql.createPool({
    connectionLimit: 66,
    host: Config.dbHost,
    user: Config.username,
    password: Config.password,
    database: "Storefront"
});

app.use(cors());

app.get('/', (req, res) => {

});

app.get('/users/session', (req, res) => {
    const { id } = req.query;
    pool.getConnection(function (err, con) {
        con.query(`select accountID from Account where sessionID='${id}'`, (err, results) => {
            if (err) res.send(err);
            else res.send(results);
        });
        con.release();
    });
});



app.get('/users/update', (req, res) => {
    const { email, password, name, cell, address, accountID } = req.query;
    pool.getConnection(function (err, con) {
        con.query(`update Account set email='${email}', password='${password}', 
            name='${name}', cell='${cell}', address='${address}' 
            where accountID=${accountID}`, (err, results) => {
            if (err) res.send(err);
            else res.send(results);
        });
        con.release();
    });

});


app.get('/users/emailcheck', (req, res) => {
    const { email } = req.query;
    pool.getConnection(function (err, con) {
        con.query(`select accountID from Account where email='${email}'`, (err, results) => {
            if (err) res.send(err);
            else {
                res.send(results);
            }
        });
        con.release();
    });
});



// /users/login?email={email}&password={password}
app.get('/users/login', (req, res) => {
    const { email, password } = req.query;
    pool.getConnection(function (err, con) {
        var hashedPassword = md5(password);
        con.query(`select accountID from Account where email='${email}' and password='${hashedPassword}'`, (err, results) => {
            if (err) res.send(err);
            else {
                if (results.length > 0) {
                    var accountID = results[0].accountID;
                    uuid = uuidv5(accountID + "", uuidNameSpace);
                    con.query(`update Account set sessionID='${uuid}' where accountID=${accountID}`, (err, results) => {
                        if (err) res.send(err);
                        else {
                            res.send({
                                accountID: accountID,
                                sessionID: uuid
                            });
                        }
                    });
                } else {
                    res.send(results);
                }
            }
        });

        con.release();
    });
});

app.get('/users', (req, res) => {
    const { id } = req.query;
    pool.getConnection(function (err, con) {
        con.query(`select * from Account where accountID='${id}'`, (err, results) => {
            if (err) res.send(err);

            else {
                res.send({
                    ...results
                });
            }
        });
        con.release();
    });
});

app.get('/users/add', (req, res) => {
    const { email, password, name, cell, address } = req.query;
    pool.getConnection(function (err, con) {
        var hashedPassword = md5(password);
        con.query(`select accountID from Account where email='${email}'`, (err, results) => {
            if (err) res.send(err);
            else {
                if (results.length == 0) {
                    con.query(`insert into Account (email, password, name, cell, address) values(
                        '${email.trim()}',
                        '${hashedPassword}',
                        '${name}',
                        '${cell}',
                        '${address}'
                        )`, (err, results) => {
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

app.get('/users/remove', (req, res) => {
    const { id } = req.query;
    pool.getConnection(function (err, con) {
        con.query(`delete from Account where accountID='${id}'`, (err, results) => {
            if (err) res.send(err);
            else res.send(`Successfully deleted account ${id}`);
        })
        con.release();
    })
});

app.get('/cards', (req, res) => {
    const { id } = req.query;
    pool.getConnection(function (err, con) {
        con.query(`
        select 
            cardID, 
            CardHolder,
            CVV, 
            Zip, 
            CardNumber,
            ExpMonth,
            ExpYear
        from 
            holds
        inner join 
            CardInfo 
        using 
            (cardID) 
        where 
            accountID = ${ id}
        `, (err, results) => {
            if (err) res.send(err);
            else {
                res.send({
                    data: results
                });
            }
        });

        con.release();
    });
});

app.get('/cards/add', (req, res) => {
    const { id, cardHolder, CVV, Zip, CardNumber, ExpMonth, ExpYear } = req.query;

    var lastInsert;
    pool.getConnection(function (err, con) {
        con.query(`insert into CardInfo(CardHolder, CVV, Zip, CardNumber, ExpMonth, ExpYear) values (
            '${cardHolder}', ${CVV}, ${Zip}, '${CardNumber}', '${ExpMonth}', '${ExpYear}'
        )`, (err, results) =>{
            if(err) res.send(err)
            else{
                lastInsert = results.insertId;
                con.query(`insert into holds values(${id}, ${lastInsert})`, (err, results) => {
                    if (err) res.send(err);
                    else res.send("Successfully added card to account");
                });
            }
        });
        con.release();
    });
});

app.get('/cards/remove', (req, res) => {
    const { id, cardID } = req.query;
    pool.getConnection(function (err, con) {
        con.query(`select * from holds where accountID = ${id} and cardID = ${cardID}`, (err, results) => {
            if (err) res.send(err);
            else {
                if (results.length == 1) {
                    con.query(`delete from CardInfo where cardID = ${cardID}`, (err, results) => {
                        if (err) res.send(err);
                        else {
                            con.query(`delete from holds where accountID = ${id} and cardID = ${cardID}`, (err, results) => {
                                if (err) res.send(err);
                                else res.send(`Successfully deleted card of id ${cardID}`);
                            });
                        }
                    });
                } else {
                    res.send(`Card of ID ${cardID} not found`)
                }
            }
        });
        con.release();
    });
});


app.get('/cart', (req, res) => {
    const { accountID } = req.query;
    pool.getConnection(function (err, con) {
        con.query(`select * from Cart where accountID=${accountID}`, (err, results) => {
            if (err) res.send(err);
            else {
                res.send(results);
            }
        });
        con.release();
    });
});

app.get('/cart/add', (req, res) => {
    const { accountID, itemID, quantity } = req.query;
    pool.getConnection(function (err, con) {
        con.query(`select * from Cart where accountID=${accountID}
        and itemID=${itemID}`, (err, results) => {
            if (err) res.send(err);
            else {
                if (results.length === 1) {
                    con.query(`update Cart set quantity =
                    quantity + ${quantity} where accountID=${accountID}
                    and itemID=${itemID}`, (err, results) => {
                        if (err) res.send(err);
                        else res.send(results);
                    });
                } else {
                    con.query(`
                                insert into 
                                    Cart(accountID, itemID, quantity) 
                                values(${accountID},${itemID},${quantity})`, (err, results) => {
                        if (err) res.send(err);
                        else res.send(results);
                    });
                }
            }
        });
        con.release();
    });
});

app.get('/cart/remove', (req, res) => {
    const { accountID, itemID, quantity } = req.query;
    pool.getConnection(function (err, con) {
        con.query(`select * from Cart where accountID=${accountID}
        and itemID=${itemID}`, (err, results) => {
            if (err) res.send(err);
            else {
                let currentQuantity = parseInt(results[0].quantity);
                if (currentQuantity === 1) {
                    con.query(`delete from Cart where accountID=${accountID}
                    and itemID=${itemID}`, (err, results) => {
                        if (err) res.send(err);
                        else res.send(results);
                    });
                } else {
                    con.query(`update Cart set quantity =
                    ${currentQuantity - quantity} where accountID=${accountID}
                    and itemID=${itemID}`, (err, results) => {
                        if (err) res.send(err);
                        else res.send(results);
                    });
                }
            }
        });
        con.release();
    });
});

app.get('/item/categories', (req, res) => {
    // const { categoryID } = req.query;
    pool.getConnection(function (err, con) {
        con.query(`select * from Categories`, (err, results) => {
            if (err) res.send(err)
            else res.send(results);
        });
        con.release();
    });
});

app.get('/category', (req,res) => {
    const { categoryName } = req.query;
    pool.getConnection(function(err, con) {
        con.query(`select categoryID from Categories where categoryName like`+
        ` '%${categoryName}%'`, (err, results) =>{
            if(err) res.send(err)
            else res.send(results);
        });
        con.release();
    });
});

app.get('/item', (req,res) => {
    const { itemName, itemID, categoryID } = req.query;
    pool.getConnection(function(err, con){
        if(itemName) {
            con.query(`select itemID from Item where itemName like`+
            ` '%${itemName}%'`, (err, results) =>{
                if(err) res.send(err)
                else res.send(results);
            });
        } else if(!itemID && !categoryID) {
            con.query(
                "select c.categoryName, i.itemID, i.itemName, i.price, i.description, i.image, i.quantity" +
                " from belongs inner join Item as i using (itemID) inner join Categories as c using (categoryID) where belongs.categoryID = categoryID and belongs.itemID = itemID;", 
                      (err, results) => {
                        //   console.log(error);
                          
                if(err) res.send(err);
                else{
                    res.send(results)
                }
            });
        } else if (!categoryID) {
            con.query(`select * from Item where itemID = ${itemID}`, (err, results) => {
                if (err) res.send(err);
                else {
                    res.send(results);
                }
            });
        } else if (!itemID) {
            con.query(`
                select c.categoryID, c.categoryName, i.itemID, i.itemName, i.price, i.description, i.image, i.quantity from belongs inner join Item as i using (itemID) inner join Categories as c using (categoryID) where categoryID = ${categoryID};    
            `, (err, results) => {
                if (err) res.send(err);
                else res.send(results);
            });
        } else {
            con.query(`
                select c.categoryID, c.categoryName, i.itemID, i.itemName, i.price, i.description, i.image, i.quantity from belongs inner join Item as i using (itemID) inner join Categories as c using (categoryID) where categoryID = ${categoryID} and itemID = ${itemID}
            `, (err, results) => {
                if (err) res.send(err);
                else res.send(results);
            });
        }

        con.release();
    });
});

app.get('/item/add', (req, res) => {
    const { name, price, description, image, categoryID } = req.query;
    pool.getConnection(function (err, con) {
        con.query(`
        insert into Item(itemName, price, description, image)
        values(
            ${name},
            ${price},
            ${description},
            ${image}
        )`, (err, results) => {
            if (err) res.send(err);
            else {
                con.query(`select itemID from Item where itemName = ${name} and price = ${price} and description = ${description}`, (err, results) => {
                    if (err) res.send(err);
                    else {
                        con.query(`insert into belongs(itemID, categoryID) values(${results[0].itemID}, ${categoryID})`, (err, results) => {
                            if (err) res.send(err);
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
    pool.getConnection(function (err, con) {
        con.query(`delete from Item where itemID = ${itemID}`, (err, results) => {
            if (err) res.send(err);
            else {
                con.query(`delete from belongs where itemID = ${itemID}`, (err, results) => {
                    if (err) res.send(err);
                    else res.send(`Successfully deleted item ${itemID} from database`);

                });
            }
        });
        con.release();
    });
});

app.get('/orders', (req, res) => {
    const { id, orderID } = req.query;
    pool.getConnection(function (err, con) {
        if (!orderID) {
            con.query(`
            select orderID, price, itemID, quantity, itemName, itemPrice, 
                image, description
            from Orders natural join make natural join contain 
            natural join 
            (select itemID, itemName, price as itemPrice,
                description, image from Item) i 
            where accountID = ${id}
            `, (err, results) => {
                if (err) res.send(err);
                else res.send(results);
            });
        } else {
            con.query(`
            select orderID, price, itemID, quantity, itemName, itemPrice,
                image, description
            from Orders natural join make natural join contain 
            natural join 
            (select itemID, itemName, price as itemPrice, 
                description, image from Item) i 
            where accountID = ${id} and orderID = ${orderID}
            `, (err, results) => {
                if (err) res.send(err);
                else res.send(results);
            });
        }

        con.release();
    });
});

app.get('/orders/amount', (req, res) => {
    const { accountID } = req.query;
    pool.getConnection(function (err, con) {
        con.query(`SELECT COUNT(*) AS counting from make where accountID=${accountID}`, (err, results) => {
            if (err) res.send(err);
            else {
                res.send(results);
            }
        });
        con.release();
    });
});



// /orders/add?items=[[itemid, quantity], [itemid, quantity]]&accountID=`accountID`
app.get(`/orders/add`, (req, res) => {
    var accountID = req.query.accountID;
    var items = JSON.parse(req.query.items);
    var prices = 0;
    var lastInsert;
    var query = `select price from Item where`;

    for (i = 0; i < items.length; i++) {
        if (i == 0) query += ` itemID=${items[0][0]}`
        else query += ` or itemID=${items[i][0]}`
    }

    pool.getConnection(function (err, con) {
        con.query(`insert into Orders(price) values('0')`, (err, results) => {
            if (err) res.sendStatus(500);
            else {
                lastInsert = results.insertId;
                for (i = 0; i < items.length; i++) {
                    con.query(`insert into contain(orderID, itemID, quantity) values(${lastInsert},${items[i][0]},${items[i][1]})`, (err, results) => {
                        if (err) res.sendStatus(500);
                    });
                }
                con.query(query, (err, results) => {
                    if (err) res.sendStatus(500);
                    else {
                        for (i = 0; i < results.length; i++) {
                            prices += results[i].price * items[i][1];
                        }
                        con.query(`update Orders set price='${prices}' where orderID='${lastInsert}'`, (err, results) => {
                            if (err) res.sendStatus(500);
                            else {
                                con.query(`insert into make(accountID, orderID) values('${accountID}', '${lastInsert}')`, (err, results) => {
                                    if (err) res.sendStatus(500);
                                    else {
                                        con.query(`delete from Cart where accountID=${accountID}`, (err, results) => {
                                            if (err) res.sendStatus(500);
                                            else res.send(`Successfully created order with id ${lastInsert} associated with account ${accountID}`);
                                        })
                                    }
                                });

                            }
                        });

                    }
                });
            }
        });

        con.release();
    });
});

app.get('/stock', (req, res) => {
    const { stockID } = req.query;

    pool.getConnection(function (err, con) {
        con.query(`select * from StockLevels where stockID='${stockID}'`, (err, results) => {
            if (err) res.send(err);
            else res.send(results);
        });

        con.release()
    });
});

app.get('/stock/add', (req, res) => {
    const { itemID, quantity, date } = req.query;
    var lastInsert;

    pool.getConnection(function (err, con) {
        con.query(`insert into StockLevels(date, quantity) values('${date}', '${quantity}')`, (err, results) => {
            if (err) res.send(err);
            else {
                lastInsert = results.insertId;

                con.query(`insert into has(stockID, itemID) values('${lastInsert}','${itemID}')`, (err, results) => {
                    if (err) res.send(err);
                });

                con.query(`select quantity from Item where itemID='${itemID}'`, (err, results) => {
                    if (err) res.send(err);
                    else {
                        var newQuantity = parseInt(quantity) + parseInt(results[0].quantity);
                        con.query(`update Item set quantity='${newQuantity}' where itemID='${itemID}'`, (err, results) => {
                            if (err) res.send(err);
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