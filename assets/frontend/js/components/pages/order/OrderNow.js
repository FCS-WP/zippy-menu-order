import React, { useEffect, useState, useRef } from "react";
import { useFetchStore } from "../../../hooks/useFetchStore";
import { useOrderNowProvider } from "../../../providers/OrderNowProvider";
import Button from "../../common/button/Button";
import ProductBox from "../../order-form/ProductBox";
import CartItems from "../../order-form/CartItems";
import { FECartApi } from "../../../api";
import { useFetchCart } from "../../../hooks/useFetchCart";
import ConfirmPopup from "../../common/popup/ConfirmPopup";
import { toast } from "react-toastify";

const OrderNow = () => {
  const store_id =
    new URLSearchParams(window.location.search).get("store_id") || "";

  const { saveStoreSession } = useFetchStore();
  const [isOpenPopupConfirm, setIsOpenPopupConfirm] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const { categories, cart, updateState } = useOrderNowProvider();
  const { checkCurrentCart, clearCart } = useFetchCart();
  //  refs map
  const sectionRefs = useRef({});
  //  Scroll handler
  const handleClickCategory = (id) => {
    setActiveCategory(id);
    const section = sectionRefs.current[id];

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handleCheckCart = async () => {
    if (!store_id) return;
    const params = {
      store_id: store_id,
    };

    const res = await checkCurrentCart(params);
    if (!res) return false;

    // empty cart || is current store -> save session;
    if (!res.has_cart || !res.is_new) {
      saveStoreSession({ store_id: store_id });
      return true;
    }
    // has cart -> is new cart -> show popup clear cart or not?
    setIsOpenPopupConfirm(true);
  };

  const handleConfirmPopup = async () => {
    saveStoreSession({ store_id: store_id });
    const res = await clearCart({ store_id: store_id });
    if (!res) {
      toast.error("Failed to handle request! Please try again later.");
      return;
    }
    await updateState({ cart: res.cart_data });
    setIsOpenPopupConfirm(false);
    toast.success("Create cart successfully!");
    return;
  };

  const handleCancelPopup = () => {
    setIsOpenPopupConfirm(false);
    window.location.replace("/order-online");
  };

  useEffect(() => {
    handleCheckCart();
  }, [store_id]);

  useEffect(() => {
    if (categories.length > 0) {
      setActiveCategory(categories[0].id);
    }
  }, []);

  const handleGoToCheckout = () => {
    window.location.href = window.location.origin + "/checkout";
  };

  if (categories.length == 0) return;

  return (
    <div className="order-now-layout">
      {/* Categories */}
      <div className="order-now-categories">
        <h4>Categories</h4>
        <div className="category-list">
          {categories.length > 0 &&
            categories.map((cat) => {
              if (cat.products.length <= 0) return;
              return (
                <button
                  key={cat.id}
                  className={`cat-btn ${activeCategory === cat.id ? "active" : ""}`}
                  onClick={() => handleClickCategory(cat.id)}
                >
                  {cat.name}
                </button>
              );
            })}
        </div>
      </div>

      {/* Products */}
      <div className="order-now-products">
        <h4>Dishes</h4>

        {categories.length > 0 &&
          categories.map((cat) => {
            if (cat.products.length <= 0) return;
            return (
              <div
                key={"box-" + cat.id}
                className="products-box"
                ref={(el) => (sectionRefs.current[cat.id] = el)}
              >
                <div className="products-box__title">{cat.name}</div>

                <div className="products-box__list">
                  {cat.products.map((product) => (
                    <ProductBox key={product.id} product={product} />
                  ))}
                </div>
              </div>
            );
          })}
      </div>

      {/* Cart */}
      <div className="order-now-cart">
        <h4>Order Summary</h4>

        <div className="cart-items">
          {cart?.items?.length > 0 ? (
            <CartItems items={cart?.items} />
          ) : (
            <div className="cart-item">Empty Cart</div>
          )}
        </div>
        {cart?.total && (
          <div className="sub-total">
            <span>Subtotal:</span>
            <span>${Number(cart?.total.subtotal).toFixed(2)}</span>
          </div>
        )}

        <div className="flex-center mt-default">
          <Button
            className="process-to-checkout-btn"
            onClick={handleGoToCheckout}
            disabled={!(cart?.items?.length > 0)}
          >
            Process to checkout
          </Button>
        </div>
      </div>

      <ConfirmPopup
        isOpen={isOpenPopupConfirm}
        title="Warning!"
        confirmText="New Cart"
        message="You already have a cart at another store. Creating a new cart will replace the existing one."
        onConfirm={() => handleConfirmPopup()}
        onClose={() => handleCancelPopup()}
      />
    </div>
  );
};

export default OrderNow;
