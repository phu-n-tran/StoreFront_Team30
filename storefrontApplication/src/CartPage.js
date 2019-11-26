import React, { useState, useEffect } from "react";
import {
  getCartItems, getCartItemsByID,
  removeFromCart, addToCart
} from "./APIFunctions";
import { Button } from "reactstrap";
import QuantityButtons from "./QuantityButtons";
import Item from "./Item";
import { useCookies } from "react-cookie";

function CartPage(props) {
  const [cartItems, setCartItems] = useState([]);
  const [cookies] = useCookies(["name"]);
  const { accountID } = cookies;

  useEffect(() => {
    renderCartItems();
    //eslint-disable-next-line
  }, []);

  async function renderCartItems() {
    let items = await getCartItems(accountID);
    setCartItems(await getCartItemsByID(items));
  }

  function getTotal() {
    let total = 0;
    cartItems.forEach(function (item) {
      total += item.quantity * item.price;
    });
    return total;
  }

  function handleAdd(item) {
    addToCart(accountID, item.itemID, 1);
    cartItems.find((x) => x.itemID === item.itemID).quantity += 1;
  }

  function handleRemove(item) {
    removeFromCart(accountID, item.itemID, 1);
  }

  return (
    <div>
      <p>CartPage</p>
      <h1>Total: ${getTotal().toFixed(2)}</h1>
      {/* TODO: refactor return function in Item.js
        like here to become one component */}
      {cartItems.map((item, index) => {
        return (
          <Item key={index} item={item}
            children={
              <QuantityButtons
                item={item} handleAdd={handleAdd}
                handleRemove={handleRemove} />
            }
            cartPage={true} />
        );
      })}
      <Button>
        Submit
      </Button>
    </div>
  );
}


export default CartPage;