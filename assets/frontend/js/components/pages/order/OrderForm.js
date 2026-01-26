import React, { useState } from "react";

// Hardcoded menu data
const MENU_CATEGORIES = [
  {
    name: "SALAD",
    items: [
      { id: 1, name: "Potato Salad", price: 0 },
      { id: 2, name: "Garden Salad", price: 0 },
      { id: 3, name: "Caesar Salad", price: 0 },
      { id: 4, name: "Thai Mango Salad", price: 0.5 },
      { id: 5, name: "Tropical Fruits Salad", price: 0 },
    ],
  },
  {
    name: "SANDWICH",
    items: [
      { id: 6, name: "Egg Mayo", price: 0 },
      { id: 7, name: "Tuna Mayo", price: 0 },
      { id: 8, name: "Cheddar Cheese", price: 0 },
      { id: 9, name: "Sardine", price: 0 },
      { id: 10, name: "Veggie", price: 0 },
    ],
  },
  {
    name: "CAKES/PASTRY",
    items: [
      { id: 11, name: "Mini Custard Puff", price: 0 },
      { id: 12, name: "Mini Chocolate Puff", price: 0 },
      { id: 13, name: "Assorted Swiss Roll", price: 0 },
      { id: 14, name: "Butter Cake Sliced", price: 0 },
      { id: 15, name: "Marble Cake Sliced", price: 0 },
      { id: 16, name: "Mini Chocolate Éclair", price: 0.5 },
      { id: 17, name: "Mini Apple Strudel", price: 0.8 },
      { id: 18, name: "Mini Egg Tart", price: 0.5 },
    ],
  },
  {
    name: "DEEP FRIED",
    items: [
      { id: 19, name: "Fish Ball", price: 0 },
      { id: 20, name: "Crispy Golden Long Spring Roll", price: 0 },
      { id: 21, name: "Sotong You Tiao", price: 0 },
      { id: 22, name: "Breaded Scallop", price: 0 },
      { id: 23, name: "Mini Curry Puff", price: 0 },
      { id: 24, name: "Curry Samosa", price: 0 },
      { id: 25, name: "Sotong Ball", price: 0 },
    ],
  },
];

const SELECTED_ITEM = {
  name: "VALUE HIGH TEA - B",
  price: 7.0,
  image:
    "https://web-staging.theshin.info/wp-content/uploads/2025/07/IMG_3425-768x1024.jpg", // Update with actual image path
};

const OrderForm = () => {
  const menuId =
    new URLSearchParams(window.location.search).get("menu_id") || "";

  const [selectedItems, setSelectedItems] = useState([]);
  const [numberOfPax, setNumberOfPax] = useState(80);
  const [deliveryTime, setDeliveryTime] = useState("");

  const MINIMUM_PAX = 80;
  const COURSES_REQUIRED = 5;
  const GST_RATE = 0.09;

  const handleItemToggle = (itemId) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter((id) => id !== itemId));
    } else {
      if (selectedItems.length < COURSES_REQUIRED) {
        setSelectedItems([...selectedItems, itemId]);
      }
    }
  };

  const handlePaxChange = (increment) => {
    const newPax = numberOfPax + increment;
    if (newPax >= MINIMUM_PAX) {
      setNumberOfPax(newPax);
    }
  };

  const calculatePrice = () => {
    const basePrice = SELECTED_ITEM.price * numberOfPax;
    const additionalPrice = selectedItems.reduce((total, itemId) => {
      const item = MENU_CATEGORIES.flatMap((cat) => cat.items).find(
        (i) => i.id === itemId,
      );
      return total + (item ? item.price * numberOfPax : 0);
    }, 0);
    return basePrice + additionalPrice;
  };

  const price = calculatePrice();
  const totalWithGST = price * (1 + GST_RATE);

  return (
    <div className="order-form-container">
      <div className="order-form-layout">
        {/* Left Sidebar */}
        <div className="order-form-sidebar">
          {/* Delivery Time */}
          <div className="delivery-section">
            <div className="form-group">
              <label className="form-label">DELIVERY DATE</label>
              <input
                type="text"
                className="form-input"
                value={deliveryTime}
                onChange={(e) => setDeliveryTime(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">DELIVERY TIME</label>
              <input
                type="text"
                className="form-input"
                placeholder="hh:mm"
                value={deliveryTime}
                onChange={(e) => setDeliveryTime(e.target.value)}
              />
            </div>
          </div>

          {/* Your Selection */}
          <div className="selection-section">
            <div className="selection-box">
              <h6 className="section-title">YOUR SELECTION</h6>
              <img
                src={SELECTED_ITEM.image}
                alt={SELECTED_ITEM.name}
                className="selection-image"
              />
              <div className="selection-name">{SELECTED_ITEM.name}</div>
              <div className="selection-price">
                ${SELECTED_ITEM.price.toFixed(2)} / PAX
              </div>
            </div>
          </div>

          {/* Number of Pax */}
          <div className="pax-section">
            <h3 className="section-title">
              <span className="section-icon">📌</span> NUMBER OF PAX
            </h3>
            <div className="pax-info">
              (Minimum {MINIMUM_PAX} Pax) | {COURSES_REQUIRED} courses
            </div>
            <div className="pax-controls">
              <button
                onClick={() => handlePaxChange(-1)}
                className="pax-btn pax-btn-decrease"
              >
                −
              </button>
              <input
                type="number"
                value={numberOfPax}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || MINIMUM_PAX;
                  if (val >= MINIMUM_PAX) setNumberOfPax(val);
                }}
                className="pax-input"
              />
              <button
                onClick={() => handlePaxChange(1)}
                className="pax-btn pax-btn-increase"
              >
                +
              </button>
            </div>
            <div className="pax-selected-label">
              <span>NUMBER OF PAX SELECTED</span>
              <a href="#" className="edit-link">
                ✏️
              </a>
            </div>
            <div className="pax-selected-value">{numberOfPax}</div>
            <div className="price-label">
              <span>PRICE</span>
            </div>
            <div className="price-value">${price.toFixed(2)}</div>
            <div className="total-label">
              <span>TOTAL W/ GST</span>
            </div>
            <div className="total-value">${totalWithGST.toFixed(2)}</div>
          </div>
        </div>

        {/* Right Side - Menu Items */}
        <div className="order-form-content">
          <div className="menu-grid">
            {MENU_CATEGORIES.map((category) => (
              <div key={category.name} className="menu-category">
                <h3 className="category-title">{category.name}</h3>
                <div className="category-items">
                  {category.items.map((item) => (
                    <label key={item.id} className="menu-item">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => handleItemToggle(item.id)}
                        disabled={
                          !selectedItems.includes(item.id) &&
                          selectedItems.length >= COURSES_REQUIRED
                        }
                        className="menu-checkbox"
                      />
                      <span className="item-name">
                        {item.name}
                        {item.price > 0 && (
                          <span className="item-price-extra">
                            (+${item.price.toFixed(2)})
                          </span>
                        )}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
            {/* Button next */}
            <div className="form-actions">
              <button className="btn-submit-order">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderForm;
