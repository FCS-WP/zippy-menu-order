import { makeRequest } from "./axios.js";

export const ProductApi = {
  async searchProductsByName(params) {
    return await makeRequest("/products/get-by-name", params);
  },
};

export const MenuApi = {
  async getDetail(id) {
    return await makeRequest("/menus/" + id);
  },
  async getMenus(params) {
    return await makeRequest("/menus", params);
  },
  async createMenu(params) {
    return await makeRequest("/menus", params, 'POST');
  },
  async updateMenu(params) {
    return await makeRequest("/menus", params, 'PUT');
  },
};

export const StoreApi = {
  async getStores(params) {
    return await makeRequest("/stores", params);
  },
  async getStoreByID(id) {
    return await makeRequest(`/stores/${id}`);
  },
  async createStore(params) {
    return await makeRequest("/stores", params, "POST");
  },
  async updateStore(params) {
    return await makeRequest(`/stores`, params, "PUT");
  },
  async deleteStore(params) {
    return await makeRequest(`/stores`, params, "DELETE");
  },
};

export const OperetionsApi = {
  async getOperations(store_id) {
    return await makeRequest(`/operations/${store_id}`, {}, "GET");
  },
  async createOperation(params) {
    return await makeRequest(`/operations/`, params, "POST");
  },
  async updateOperation(params) {
    return await makeRequest(`/operations/`, params, "PUT");
  },
  async deleteOperation(params) {
    return await makeRequest("/operations/", params, "DELETE");
  },
};

export const SpecialDaysApi = {
  async getSpecialDays(params) {
    return await makeRequest(`/special-days`, params);
  },
  async createSpecialDays(params) {
    return await makeRequest("/special-days", params, "POST");
  },
  async updateSpecialDays(params) {
    return await makeRequest("/special-days", params, "PUT");
  },
  async deleteSpecialDays(params) {
    return await makeRequest("/special-days", params, "DELETE");
  },
};
