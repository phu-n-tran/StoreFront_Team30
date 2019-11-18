import React from "react";
import { ListGroupItem, Row, Col, Button } from "reactstrap";
import { roundToTwo } from "./APIFunctions";

function Item(props) {
  const { itemName, price, description, itemID } = props.item;

  return (
    <ListGroupItem key={itemID}>
      <div style={{ display: "inline-block", width: "90%" }}>
        <div style={{ float: "left" }}>
          <Row>
            <h3>{itemName}</h3>
          </Row>
          <Row>
            <Col>
              <p>Price: ${roundToTwo(price)}</p>
              {props.children}
            </Col>
            <Col>
              <p style={{ fontStyle: "italic" }}> Description: {description}</p>
              {!props.cartPage ?
                <Button onClick={() => props.handleAddToCart(props.item)}>
                  Add to cart
                </Button> :
                <p>Quantity: {props.item.quantity}</p>}
            </Col>
          </Row>
        </div>
      </div>
    </ListGroupItem>
  );
}

export default Item;
