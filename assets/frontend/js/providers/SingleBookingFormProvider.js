// import React, { useContext, useState } from "react";
// import { SingleBookingFormContext } from "../contexts";

// export const SingleBookingFormProvider = ({ children }) => {
//   const [state, setState] = useState({});
//   const { productData = {}, storeData = {},  ...data } = state;

//   const updateState = (updates) =>
//     setState((prev) => ({ ...prev, ...updates }));

//   const value = {
//     ...data,
//     productData,
//     storeData,
//     updateState
//   };

//   return (
//     <SingleBookingFormContext.Provider value={value}>
//       {children}
//     </SingleBookingFormContext.Provider>
//   );
// };

// export const useSingleBookingFormProvider = () =>
//   useContext(SingleBookingFormContext);
