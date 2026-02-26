import { faCartShopping, faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useFetchCart } from "../../hooks/useFetchCart";
import { useOrderNowProvider } from "../../providers/OrderNowProvider";
import Button from "../common/button/Button";
import { toast } from "react-toastify";

const ProductBox = ({ product }) => {
  const { addProductToCart } = useFetchCart();
  const { updateState } = useOrderNowProvider();
  const handleAddToCart = async () => {
    // send add to cart
    const store_id =
      new URLSearchParams(window.location.search).get("store_id") || "";
    const params = {
      store_id: store_id,
      product_id: product.id,
    };

    const res = await addProductToCart(params);

    if (!res || !res.added_to_cart) {
      toast.error(res.message ?? "Add to cart failed!");
      return;
    }

    toast.success(res.message ?? "Add to cart successfully!");
    await updateState({ cart: res.cart_data });
    return;
  };

  const isAvailableProduct = (product) => {
    if (!product.price || product.stock <= 0) {
      return false;
    }

    return true;
  };

  return (
    <div className="product-box">
      <div className="featured-img">
        <img src={product?.featured_image ?? ""} alt="" />
      </div>

      <div className="product-infos">
        <h6 className="product-name">{product.name}</h6>
        <h5 className="product-price">
          {product.stock > 0
            ? product.price
              ? "$" + product.price
              : "___"
            : "Out of stock"}
        </h5>
        <p className="product-description">
          {product.short_description
            ? product.short_description
            : product.description}
        </p>
      </div>

      <div className="product-action">
        <Button
          className="custom-add-to-cart !rounded-1"
          data-product_id={product.id}
          onClick={handleAddToCart}
          disabled={!isAvailableProduct(product)}
        >
          <FontAwesomeIcon icon={faCartShopping} />
        </Button>

        <span className="add-to-cart-noti hidden">
          <FontAwesomeIcon icon={faCheck} />{" "}
        </span>
      </div>
    </div>
  );
};

export default ProductBox;
