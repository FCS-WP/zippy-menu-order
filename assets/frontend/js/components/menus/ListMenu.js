import React, { useEffect } from "react";
import { useFetchMenu } from "../../hooks/useFetchMenus";
import ListMenuItem from "./ListMenuItem";

const ListMenu = () => {
  const ids = document
    .querySelector("#menu_order_list")
    .getAttribute("data-menu_ids");

  const { menus, fetchMenus } = useFetchMenu();

  useEffect(() => {
    fetchMenus({ ids: ids });
  }, []);

  return (
    <div>
      {menus.map((menu) => (
        <ListMenuItem key={menu.id} menu={menu} />
      ))}
    </div>
  );
};

export default ListMenu;
