import { makeRequest } from "./axios";

// export const SlotsApi = {
//   async getSlots(params) {
//     return await makeRequest("/timeslots", params);
//   },
// };

export const FEMenuApi = {
  async getDetail(id) {
    return await makeRequest("/menus/" + id);
  },
  async getMenus(params) {
    return await makeRequest("/menus/ids", params);
  },
};

export const FEStoreApi = {
  async getStore(id) {
    return await makeRequest("/stores/" + id);
  },
  async getTimeSlots(id) {
    return await makeRequest("/menus/" + id);
  },
  async getOperations(id) {
    return await makeRequest("/operations/" + id);
  },
};

export const orderApi = {
  async createCart(params) {
    return await makeRequest("/stores", params);
  },
};
