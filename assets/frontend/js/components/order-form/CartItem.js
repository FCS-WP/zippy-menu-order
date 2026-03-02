import { faMinus, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useFetchCart } from "../../hooks/useFetchCart";
import { useOrderNowProvider } from "../../providers/OrderNowProvider";
import { toast } from "react-toastify";

const CartItem = ({ item, onRemoveItem }) => {
  const [itemQty, setItemQty] = useState(item.quantity);
  const { updateItemQty } = useFetchCart();
  const [isLoading, setIsLoading] = useState(false);
  const { updateState } = useOrderNowProvider();

  const handleChangeQty = async (value) => {
    setIsLoading(true);
    if (value < 1) {
      toast.error("min quantity is 1");
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
      return;
    }
    await sendUpdateRequest(value);
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
    return;
  };

  const sendUpdateRequest = async (newQty) => {
    const params = {
      cart_item_key: item.key,
      new_qty: newQty,
    };

    const res = await updateItemQty(params);
    if (!res) {
      toast.error("can not update this quantity!");
      return;
    }
    await updateState({ cart: res.cart_data });
    toast.success("Cart updated!");

    setItemQty(newQty);
    return;
  };

  const handleIncreaseQty = async (value) => {
    setIsLoading(true);
    const newQty = itemQty + value;
    if (newQty >= 1) {
      await sendUpdateRequest(newQty);
    }
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
    return;
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
              disabled={isLoading}
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
          disabled={isLoading}
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
