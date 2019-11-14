import React, { useState, useEffect } from "react";
import {
  getCartItems, getCartItemsByID,
  removeFromCart, addToCart
} from "./APIFunctions";
import { ListGroupItem, Row, Col, Button, ButtonGroup } from "reactstrap";

function CartPage(props) {
  const [cartItems, setCartItems] = useState([]);
  const quantityButtons = [
    { name: "+", callback: handleAdd },
    { name: "-", callback: handleRemove }
  ];

  useEffect(() => {
    renderCartItems();
  }, []);

  async function renderCartItems() {
    // put user ID here
    let items = await getCartItems(1);
    setCartItems(await getCartItemsByID(items));
  }

  function getTotal() {
    let total = 0;
    cartItems.forEach(function(item) {
      total += item.quantity * item.price;
    });
    return total;
  }

  function handleAdd(item) {
    addToCart(1, item.itemID, 1);
    cartItems.find((x) => x.itemID === item.itemID).quantity += 1;
  }

  function handleRemove(item) {
    removeFromCart(1, item.itemID, item.quantity - 1);
  }

  return (
    <div>
      <p>CartPage</p>
      <h1>Total: ${getTotal().toFixed(2)}</h1>
      {/* TODO: refactor return function in Item.js
        like here to become one component */}
      {cartItems.map((item, index) => {
        return (
          <ListGroupItem key={index}>
            <div style={{ display: "inline-block", width: "90%" }}>
              <div style={{ float: "left" }}>
                <Row>
                  <h3>{item.itemName}</h3>
                </Row>
                <Row>
                  <Col>
                    <p>Price: ${item.price}</p>
                    <p>Quantity: {item.quantity}</p>
                  </Col>
                  <Col>
                    <ButtonGroup>
                      {quantityButtons.map((x, index) => {
                        return (
                          <Button key={index}
                            onClick={() => { x.callback(item); }}>
                            {x.name}
                          </Button>
                        );
                      })}
                    </ButtonGroup>
                  </Col>
                </Row>
              </div>
            </div>
          </ListGroupItem>
        );
      })}
      <Button>
        Submit
      </Button>
    </div>
  );
}


export default CartPage;