import React, { useState } from 'react'
import CartItem from './CartItem';
import Popup from '../common/popup/Popup';
import ConfirmPopup from '../common/popup/ConfirmPopup';
import { useFetchCart } from '../../hooks/useFetchCart';
import { useOrderNowProvider } from '../../providers/OrderNowProvider';

const CartItems = ({ items }) => {
  const [isOpenPopupConfirm, setIsOpenPopupConfirm] = useState(false);
  const [selectedItem, setSelectedItem] = useState();
  const { removeItemFromCart } = useFetchCart()
  const { updateState } = useOrderNowProvider();

  const handleDelete = async (item) => {
    const params = {
      cart_item_key: item.key,
    }

    const res = await removeItemFromCart(params);

    if (!res) {
      window.alert("Failed to delete item");
      return;
    }
    await updateState({ cart: res.cart_data });
    setIsOpenPopupConfirm(false);
    setSelectedItem(null);
    return;
  }

  const onClickRemoveItem = (item) => {
    setSelectedItem(item);
    setIsOpenPopupConfirm(true);
  }

  if (items.length <= 0) return;
    return (
      <>
        {items.map((cartItem) => (
          <CartItem item={cartItem} key={cartItem.key} onRemoveItem={onClickRemoveItem}/>
        ))}

        <ConfirmPopup 
          isOpen={isOpenPopupConfirm}
          title="Delete menu?"
          message="Confirm to delete this item?"
          onConfirm={() => handleDelete(selectedItem)}
          onClose={() => setIsOpenPopupConfirm(false)}
        />
      </>
    );
}

export default CartItems