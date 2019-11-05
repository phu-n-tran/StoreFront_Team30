import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Row, Col, ListGroupItem } from "reactstrap";
import { getCategory } from "./APIFunctions";

function Item() {
  const [items, setItems] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    getItems();
    // eslint-disable-next-line
  }, []);

  async function getItems() {
    setItems(await getCategory(id));
  }

  return (
    <div style={{ textAlign: "left" }} className="Employees">
      {items.length && items.map((item) => {
        return (
          <ListGroupItem key={item.itemID}>
            <div style={{ display: "inline-block", width: "90%" }}>
              <div style={{ float: "left" }}>
                <Row>
                  <h3>{item.itemName}</h3>
                </Row>
                <Row>
                  <Col>
                    <p>Price: ${item.price}</p>
                  </Col>
                  <Col>
                  </Col>
                </Row>
              </div>
            </div>
          </ListGroupItem>
        );
      })}
    </div>
  );
}

export default Item;
