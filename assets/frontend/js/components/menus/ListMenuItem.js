import React from "react";

const ListMenuItem = ({ menu }) => {
  if (!menu) return;
  return (
    <div className="menu-item-wrapper">
      <div className="featured_img">
        <img src={menu.featured_img ?? ""} alt={menu.name} />
      </div>
      <div className="details">
        <h3>
          <a href={`/order-form?menu_id=${menu.id}`}>{menu.name ?? ""}</a>
        </h3>
        <div className="description">{menu.description ?? ""}</div>
        <a href={`/order-form?menu_id=${menu.id}`} className="order-btn">
          Order Now
        </a>
      </div>
    </div>
  );
};

export default ListMenuItem;
