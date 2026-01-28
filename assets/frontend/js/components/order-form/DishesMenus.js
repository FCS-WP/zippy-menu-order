import React, { useEffect, useState } from "react";

const DishesMenus = ({
  data,
  onSelect,
  selectedItems,
  handleNextStep,
  type = "main",
  courses_required = 999,
}) => {
  const SingleMenuBox = ({ dishMenu }) => {
    const thisBoxItems = selectedItems.filter((item) => {
      return dishMenu.dishes.find(
        (dish) => parseInt(dish.id) === parseInt(item),
      );
    });

    if (!dishMenu) return;
    const isDisabled = (item) => {
      let flag = false;
      switch (type) {
        case "main":
          const condition1 = !selectedItems.includes(item.id);
          const condition2 = selectedItems.length >= courses_required;
          if (dishMenu?.max_qty) {
            const condition3 =
              thisBoxItems.length >= parseInt(dishMenu.max_qty);
            flag = (condition1 && condition2) || (condition1 && condition3);
          } else {
            flag = condition1 && condition2;
          }
          break;
        case "addons":
          flag = selectedItems.length >= parseInt(dishMenu.max_qty);
          break;
        default:
          break;
      }
      return flag;
    };

    return (
      <div className="menu-category">
        <h3 className="category-title">{dishMenu.name}</h3>
        <div className="category-items">
          {dishMenu.dishes.map((item) => (
            <label key={item.id} className="menu-item">
              <input
                type="checkbox"
                checked={selectedItems.includes(item.id)}
                onChange={(e) => onSelect(item.id, type)}
                disabled={isDisabled(item)}
                className="menu-checkbox"
              />
              <span className="item-name">
                {item.name}
                {item?.extra_price && parseFloat(item?.extra_price) > 0 && (
                  <span className="item-price-extra">
                    (+${parseFloat(item.extra_price).toFixed(2)})
                  </span>
                )}
              </span>
            </label>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="menu-grid">
      {data.length > 0 &&
        data.map((dishMenu) => (
          <SingleMenuBox
            key={dishMenu.id}
            dishMenu={dishMenu}
            onSelect={onSelect}
          />
        ))}
      {/* Button next */}
      <div className="form-actions">
        <button className="btn-submit-order" onClick={() => handleNextStep(2)}>
          Next
        </button>
      </div>
    </div>
  );
};

export default DishesMenus;
