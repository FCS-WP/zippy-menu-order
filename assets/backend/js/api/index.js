import { makeRequest } from "./axios.js";

export const ProductApi = {
  async searchProductsByName(params) {
    return await makeRequest("/products/get-by-name", params);
  },
};

export const MenuApi = {
  async getDetail(id) {
    return await makeRequest("/menus/"+id);
  },
   async getMenus(params) {
    return await makeRequest("/menus", params);
  },
};
