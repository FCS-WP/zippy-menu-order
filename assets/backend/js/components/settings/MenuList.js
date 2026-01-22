import React, { useEffect, useState } from "react";
import TableView from "../table/TableView";
import Button from "../common/button/Button";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSettingsProvider } from "../../providers/SettingsProvider";
import Switch from "../common/Switch";
import { URL_MENU_SETTINGS, URL_SINGLE_MENU } from "../../helpers/constants";

const dataMenus = [
  {
    id: "1001",
    name: "New Year Party",
    is_active: 1,
  },
  {
    id: "1002",
    name: "Valentine Dinner",
    is_active: 1,
  },
  {
    id: "1003",
    name: "Company Annual Meeting",
    is_active: 0,
  },
  {
    id: "1004",
    name: "Birthday Celebration",
    is_active: 1,
  },
  {
    id: "1005",
    name: "Wedding Reception",
    is_active: 1,
  },
  {
    id: "1006",
    name: "Christmas Party",
    is_active: 0,
  },
  {
    id: "1007",
    name: "Product Launch Event",
    is_active: 1,
  },
  {
    id: "1008",
    name: "Team Building Day",
    is_active: 1,
  },
  {
    id: "1009",
    name: "Farewell Party",
    is_active: 0,
  },
  {
    id: "1010",
    name: "Customer Appreciation Night",
    is_active: 1,
  },
];

const dataCols = [
  {
    attrs: null,
    title: "ID",
  },
  {
    attrs: null,
    title: "Menu Name",
  },
  {
    attrs: null,
    title: "Active",
  },
  {
    attrs: null,
    title: "Action",
  },
];

const MenuList = () => {
  const [selectedIds, setSelectedIds] = useState();
  const [dataRows, setDataRows] = useState([]);
  const [menus, setMenus] = useState(dataMenus);

  const { tableConfigs, setTableConfigs } = useSettingsProvider();

  const handleSelectedRows = (selectedRows) => {
    setSelectedIds(selectedRows);
  };

  const handleEdit = (id) => {
    window.location.href = URL_SINGLE_MENU + '&menu_id='+id;
  };

  const handleDelete = (ids) => {
    console.log("Delete:", ids);
  };

  const ActionBox = ({ handleEdit, item, handleDelete }) => {
    return (
      <div className="flex gap-2">
        <Button onClick={() => handleEdit(item.id)}> Edit </Button>
        <Button
          className="bg-red-600 hover:bg-red-700"
          onClick={() => handleDelete(item.id)}
        >
          <FontAwesomeIcon icon={faTrash} className="text-white" />
        </Button>
      </div>
    );
  };

  const handleToggle = (id) => {
    setMenus((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, is_active: item.is_active ? 0 : 1 } : item,
      ),
    );
  };

  const createData = (item) => {
    const { id, name, is_active } = item;
    
    return {
      id,
      name,
      active: (
        <>
          <Switch checked={is_active > 0} onChange={() => handleToggle(item.id)} />
        </>
      ),
      action: (
        <ActionBox
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          item={item}
        ></ActionBox>
      ),
    };
  };

  const fetchTableData = async () => {
    const dataPage = menus.map((item) => {
      return createData(item);
    });
    setDataRows(dataPage);
  };

  useEffect(() => {
    fetchTableData();
  }, [menus]);

  const updateTableConfig = (newValue) => {
    const newData = { ...tableConfigs, ...newValue };
    setTableConfigs(newData);
  };

  const redirectToAddNew = () =>{
    window.location.href = URL_SINGLE_MENU + '&menu_id=0';
  }

  return (
    <div className="w-full mx-auto p-6 bg-white">
      <div className="mb-6 flex justify-end">
        <Button onClick={redirectToAddNew}> + Add new menu</Button>
      </div>
      <TableView
        tableConfig={tableConfigs}
        dataRows={dataRows}
        onUpdateTable={updateTableConfig}
        dataCols={dataCols}
        onSelectedItems={handleSelectedRows}
      />
    </div>
  );
};

export default MenuList;
