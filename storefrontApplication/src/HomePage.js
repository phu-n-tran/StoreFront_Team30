import React, { useState, useEffect } from "react";
import { getItems } from "./APIFunctions";
import Item from "./Item";
import CartModal from "./CartModal";

function HomePage() {
  const [items, setItems] = useState();
  const [currentItem, setCurrentItem] = useState();
  const [modalOpen, setModalOpen] = useState();

  useEffect(() => {
    getItemsFromRDS();
  }, []);

  async function getItemsFromRDS() {
    setItems(await getItems());
  }

  function showCartModal(item) {
    setCurrentItem(item);
    setModalOpen(true);
  }

  function toggle() {
    setModalOpen(!modalOpen);
  }

  return (
    <div>
      <h1>Welcome! See items below.</h1>
      {modalOpen ? <CartModal
        item={currentItem}
        modalOpen={modalOpen}
        toggle={toggle} /> : <React.Fragment />}
      {items && items.map((x, index) => {
        return (
          <Item handleAddToCart={showCartModal} key={index} item={x} />
        );
      })}
    </div>
  );
}


export default HomePage;