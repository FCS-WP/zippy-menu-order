import React, { useEffect, useRef, useState } from "react";
import PaginationFE from "../Pagination";
import PerPage from "../PerPage";

const TableView = (props) => {
  const {
    tableConfig,
    dataRows,
    dataCols,
    onUpdateTable,
    onSelectedItems = () => {},
  } = props;

  const { page, rowsPerPage, totalRows } = tableConfig;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const rowHeightRef = useRef(null);

  if (!dataCols || !dataRows) {
    return (
      <h3 className="tv-error">Missing data. (Invalid columns or rows)</h3>
    );
  }

  const emptyRows = page > 0 ? Math.max(0, page * rowsPerPage - totalRows) : 0;

  const renderEmptyRows = (numberRows, colSpan) => {
    if (numberRows <= 0) return null;
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
  }, [tableConfig]);

  return (
    <div className="tv-container">
      <table className="tv-table">
        <thead className="tv-thead">
          <tr>
            <th className="tv-checkbox-header">
              <input
                type="checkbox"
                checked={dataRows.every((row) => selectedRows.includes(row.id))}
                onChange={toggleSelectAll}
              />
            </th>

            {dataCols &&
              dataCols.map((col, ind) => (
                <th key={ind} {...(col.attrs ?? {})} className="tv-th">
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
                className={`tv-tr ${index % 2 === 0 ? "tv-even" : "tv-odd"}`}
                ref={index === dataRows.length - 1 ? rowHeightRef : null}
              >
                <td className="tv-checkbox-cell">
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(row.id)}
                    onChange={() => toggleSelect(row.id)}
                  />
                </td>
                {Object.entries(row).map(([key, value]) => (
                  <td key={key} className="tv-td">
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          {emptyRows > 0 && renderEmptyRows(emptyRows, dataCols.length + 1)}
        </tbody>
      </table>

      <div className="tv-footer">
        <div className="tv-perpage">
          <PerPage
            title="Show booking per page:"
            onChange={handleChangePerPage}
          />
        </div>
        <PaginationFE
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handleChangePage}
        />
      </div>
    </div>
  );
};

export default TableView;
