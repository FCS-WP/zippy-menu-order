import React, { useEffect, useRef, useState } from "react";
import { getComparator } from "../../helpers/table-helpers";
import Pagination from "./Pagination";
import PerPage from "./PerPage";

const TableView = (props) => {
  const {
    tableConfig,
    dataRows,
    dataCols,
    onUpdateTable,
    onSelectedItems = () => {},
  } = props;
  const { page, rowsPerPage, totalRows } = tableConfig;
  const safeRowsPerPage = rowsPerPage > 0 ? rowsPerPage : 1;
  const totalPages = Math.ceil(totalRows / safeRowsPerPage) || 1;
  const rowHeightRef = useRef(null);

  if (!dataCols || !dataCols) {
    return (
      <h3 className="text-red-500">Missing data. (Invalid columns or rows)</h3>
    );
  }

  const emptyRows = page > 0 ? Math.max(0, page * rowsPerPage - totalRows) : 0;

  const renderEmptyRows = (numberRows, colSpan) => {
    if (numberRows <= 0) return null;

    const defaultHeight = 40;
    const rowHeight = rowHeightRef.current?.offsetHeight ?? defaultHeight;
    const height = rowHeightRef.current?.offsetHeight * numberRows;

    return (
      <tr style={{ height: `${height}px` }}>
        <td colSpan={colSpan}></td>
      </tr>
    );
  };

  const [selectedRows, setSelectedRows] = useState([]);

  const toggleSelectAll = () => {
    const currentIds = dataRows.map((row) => row.id);
    const allSelected = currentIds.every((id) => selectedRows.includes(id));
    if (allSelected) {
      setSelectedRows((prev) => prev.filter((id) => !currentIds.includes(id)));
    } else {
      setSelectedRows((prev) => [...new Set([...prev, ...currentIds])]);
    }
  };

  const toggleSelect = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleChangePage = (pageNumber) => {
    onUpdateTable({ page: pageNumber });
  };

  const handleChangePerPage = (e) => {
    onUpdateTable({ rowsPerPage: parseInt(e.target.value), page: 1 });
  };

  useEffect(() => {
    onSelectedItems(selectedRows);
  }, [selectedRows]);

  useEffect(() => {
    setSelectedRows([]);
  }, [tableConfig, dataRows]);

  return (
    <div className="overflow-x-auto rounded-xl bg-white shadow-lg">
      <table className="w-full table-auto border-separate border-spacing-0">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3">
              <input
                type="checkbox"
                className="cursor-pointer"
                checked={dataRows.every((row) => selectedRows.includes(row.id))}
                onChange={toggleSelectAll}
              />
            </th>

            {dataCols &&
              dataCols.map((col, ind) => (
                <th
                  key={ind}
                  {...(col.attrs ?? "")}
                  className="p-4 text-left text-sm font-medium tracking-wider capitalize"
                >
                  {col.title}
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          {dataRows &&
            dataRows.map((row, index) => (
              <tr
                key={row?.id ?? index}
                className={`transition-colors duration-200 ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-gray-100`}
                ref={index == dataRows.length - 1 ? rowHeightRef : null}
              >
                <td className="p-4 text-center">
                  <input
                    type="checkbox"
                    className="cursor-pointer"
                    checked={selectedRows.includes(row.id)}
                    onChange={() => toggleSelect(row.id)}
                  />
                </td>
                {Object.entries(row).map(([key, value]) => {
                  return (
                    <td key={key} className="p-4 font-medium">
                      {value}
                    </td>
                  );
                })}
              </tr>
            ))}
          {emptyRows > 0 && renderEmptyRows(emptyRows, dataCols.length + 1)}
        </tbody>
      </table>
      <div className="p-4">
        <div className="flex justify-end">
          <PerPage
            title="Show booking per page:"
            onChange={handleChangePerPage}
          />
        </div>

        {
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handleChangePage}
          />
        }
      </div>
    </div>
  );
};

export default TableView;
