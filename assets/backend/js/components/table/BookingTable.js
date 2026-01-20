import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import Button from "../common/button/Button";

const statusColor = {
  Pending: "bg-yellow-100 text-yellow-800",
  Success: "bg-green-100 text-green-800",
  Fulfilled: "bg-green-100 text-green-800",
  Unfulfilled: "bg-red-100 text-red-800",
};

const BookingTable = ({
  bookings,
  selectedBookings,
  toggleSelect,
  toggleSelectAll,
  handleEdit,
  handleDelete,
}) => {
  return (
    <div className="overflow-x-auto rounded-xl bg-white shadow-lg">
      <table className="w-full table-auto border-separate border-spacing-0">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3">
              <input
                type="checkbox"
                checked={bookings.every((b) => selectedBookings.includes(b.id))}
                onChange={toggleSelectAll}
              />
            </th>
            {[
              "Order",
              "Date",
              "Customer",
              "Payment",
              "Total",
              "Delivery",
              "Items",
              "Fulfillment",
              "Action",
            ].map((header) => (
              <th
                key={header}
                className="px-6 py-3 text-left text-sm font-medium tracking-wider text-gray-600 capitalize"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bookings.map((b, idx) => (
            <tr
              key={b.id}
              className={`transition-colors duration-200 ${
                idx % 2 === 0 ? "bg-white" : "bg-gray-50"
              } hover:bg-gray-100`}
            >
              <td className="px-4 py-4 text-center">
                <input
                  type="checkbox"
                  checked={selectedBookings.includes(b.id)}
                  onChange={() => toggleSelect(b.id)}
                />
              </td>
              <td className="px-6 py-4 font-medium text-gray-700">{b.id}</td>
              <td className="px-6 py-4 text-gray-600">{b.date}</td>
              <td className="px-6 py-4 text-gray-700">{b.customer}</td>
              <td>
                <span
                  className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${statusColor[b.payment]}`}
                >
                  {b.payment}
                </span>
              </td>
              <td className="px-6 py-4 font-medium text-gray-800">{b.total}</td>
              <td className="px-6 py-4 text-gray-600">{b.delivery}</td>
              <td className="px-6 py-4 text-gray-700">{b.items} items</td>
              <td>
                <span
                  className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${statusColor[b.fulfillment]}`}
                >
                  {b.fulfillment}
                </span>
              </td>
              <td className="flex space-x-2 px-6 py-4">
                <Button
                  onClick={() => handleEdit(b.id)}
                  className="bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
                >
                  <FontAwesomeIcon icon={faPenToSquare} />
                </Button>
                <Button
                  onClick={() => handleDelete(b.id)}
                  className="bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
                >
                  <FontAwesomeIcon icon={faTrashAlt} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingTable;
