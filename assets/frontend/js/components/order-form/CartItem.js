import { faMinus, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";

const CartItem = ({ item, onRemoveItem }) => {
  const [itemQty, setItemQty] = useState(item.quantity);
  const handleChangeQty = (value) => {
    if (value < 1) {
      window.alert("min quantity is 1");
      return;
    }
    setItemQty(value);
  };

  const handleIncreaseQty = (value) => {
    const newQty = itemQty + value;
    if (newQty >= 1) setItemQty(newQty);
  };

  useEffect(() => {
    setItemQty(item.quantity);
  }, [item.quantity]);

  return (
    <div className="cart-item">
      <div className="item-name">{item.name}</div>
      <div>
        <div className="flex">
          <div className="item-qty">
            <button
              onClick={() => handleIncreaseQty(-1)}
              className="!border-0 !p-2 !rounded-none !hover:bg-primary"
            >
              <FontAwesomeIcon icon={faMinus} />
            </button>
            <input
              id={item.key + "_qty"}
              className="cart-item-qty !text-sm"
              value={itemQty}
              onChange={(e) => handleChangeQty(e.target.value)}
              min={1}
            />
            <button
              onClick={() => handleIncreaseQty(1)}
              className="!border-0 !p-2 !rounded-none !hover:bg-primary"
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </div>
        </div>
      </div>
      <div className="text-right">
        <span
          className="item-price"
          dangerouslySetInnerHTML={{ __html: item.price }}
        ></span>
        <button
          className="!border-0 !p-0 !ml-2 !bg-white"
          onClick={() => onRemoveItem(item)}
        >
          <FontAwesomeIcon
            className="hover:text-[#ef8104]"
            color="red"
            icon={faTrash}
          />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
