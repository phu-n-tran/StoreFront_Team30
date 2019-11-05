import React, { useState, useEffect } from "react";
import { Row, Button, ListGroupItem } from "reactstrap";
import { getCategory } from "./APIFunctions";

function Categories(props) {
  const [categories, setCategories] = useState();

  useEffect(() => {
    getCategories();
  }, []);

  async function getCategories() {
    setCategories(await getCategory());
  }
  
  function handleClick(id) {
    props.history.push(`/item/${id}`);
  }

  return (
    <div style={{ textAlign: "left" }} className="Employees">
      {categories && categories.map((item, index) => {
        return (
          <ListGroupItem key={index}>
            <div style={{ display: "inline-block", width: "90%" }}>
              <div style={{ float: "left" }}>
                <Row>
                  <h3>{item.categoryName}</h3>
                </Row>
                <Button onClick={() => handleClick(index + 1)}>
                  See Items
                </Button>
              </div>
            </div>
          </ListGroupItem>
        );
      })}
    </div>
  );
}

export default Categories;
