import React, { useEffect, useState, useRef } from "react";
import { useFetchStore } from "../../../hooks/useFetchStore";

const OrderNow = () => {
  const store_id =
    new URLSearchParams(window.location.search).get("store_id") || "";

  const { operations, fetchOperations } = useFetchStore();

  const [activeCategory, setActiveCategory] = useState(null);

  // 🔥 refs map
  const sectionRefs = useRef({});

  const placeholderImg =
    window.location.origin +
    "/wp-content/plugins/woocommerce/assets/images/placeholder.png";

  const categories = [
    {
      id: 123,
      name: "Category 1",
      products: [
        {
          id: 999,
          name: "Product 1",
          price: 22,
          stock: 123,
          img: placeholderImg,
          description: "Delicious handmade dish made with fresh ingredients.",
        },
        {
          id: 991,
          name: "Product 2",
          price: 33,
          stock: 123,
          img: placeholderImg,
          description: "Chef's special recipe served hot and fresh.",
        },
        {
          id: 992,
          name: "Product 3",
          price: 44,
          stock: 123,
          img: placeholderImg,
          description: "Customer favorite with premium quality taste.",
        },
      ],
    },
    {
      id: 234,
      name: "Category 2",
      products: [
        {
          id: 888,
          name: "Sample 1",
          price: 20,
          stock: 123,
          img: placeholderImg,
          description: "A perfect choice for quick and satisfying meal.",
        },
        {
          id: 881,
          name: "Sample 2",
          price: 40,
          stock: 123,
          img: placeholderImg,
          description: "Balanced flavors crafted carefully.",
        },
        {
          id: 882,
          name: "Sample 3",
          price: 50,
          stock: 123,
          img: placeholderImg,
          description: "Premium ingredients for premium experience.",
        },
      ],
    },
    {
      id: 7676,
      name: "Category 3",
      products: [
        {
          id: 222,
          name: "QQQ 1",
          price: 20,
          stock: 123,
          img: placeholderImg,
          description: "Light and refreshing dish for any time.",
        },
        {
          id: 221,
          name: "QQQQ 2",
          price: 40,
          stock: 123,
          img: placeholderImg,
          description: "Popular choice among returning customers.",
        },
        {
          id: 223,
          name: "QQQQ 3",
          price: 50,
          stock: 123,
          img: placeholderImg,
          description: "Perfect combination of taste and presentation.",
        },
      ],
    },
  ];

  // 🔥 Scroll handler
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

  useEffect(() => {
    fetchOperations(store_id);
  }, [store_id]);

  useEffect(() => {
    if (categories.length > 0) {
      setActiveCategory(categories[0].id);
    }
  }, []);

  return (
    <div className="order-now-layout">
      {/* Categories */}
      <div className="order-now-categories">
        <h4>Categories</h4>
        <div className="category-list">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`cat-btn ${activeCategory === cat.id ? "active" : ""}`}
              onClick={() => handleClickCategory(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products */}
      <div className="order-now-products">
        <h4>Dishes</h4>

        {categories.map((cat) => (
          <div
            key={"box-" + cat.id}
            className="products-box"
            ref={(el) => (sectionRefs.current[cat.id] = el)}
          >
            <div className="products-box__title">{cat.name}</div>

            <div className="products-box__list">
              {cat.products.map((product) => (
                <div className="product-box" key={product.id}>
                  <div className="featured-img">
                    <img src={product?.img ?? ""} alt="" />
                  </div>

                  <div className="product-infos">
                    <h6 className="product-name">{product.name}</h6>
                    <h5 className="product-price">${product.price}</h5>
                  </div>

                  <div className="product-action">
                    <button
                      className="custom-add-to-cart"
                      data-product_id={product.id}
                    >
                      Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Cart */}
      <div className="order-now-cart">
        <h4>Order Summary</h4>
        <div className="cart-items">
          <div className="sub-total">
            <span>Subtotal:</span>
            <span>$99.99</span>
          </div>
        </div>

        <div className="flex-center mt-default">
          <button>Process to checkout</button>
        </div>
      </div>
    </div>
  );
};

export default OrderNow;
