export const getComparator = (order, orderBy) => {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
};

export const listBookingCols = [
  {
    attrs: null,
    title: "Booking ID",
  },
  {
    attrs: null,
    title: "Order Id",
  },
  {
    attrs: null,
    title: "Booking Date",
  },
  {
    attrs: null,
    title: "Customer",
  },
  {
    attrs: null,
    title: "Status",
  },
  {
    attrs: null,
    title: "Total",
  },
  {
    attrs: null,
    title: "Delivery",
  },
  {
    attrs: null,
    title: "From",
  },
  {
    attrs: null,
    title: "To",
  },
  {
    attrs: null,
    title: "Slots",
  },

  {
    attrs: null,
    title: "Action",
  },
];
