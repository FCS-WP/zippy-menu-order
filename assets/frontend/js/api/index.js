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
  async saveSession(params) {
    return await makeRequest("stores/save-store-session", params, 'POST');
  },
  
};

export const FEProductsApi = {
  async getProducts(params) {
    return await makeRequest("/products", params);
  },
  async getProductsAndCategories(params) {
    return await makeRequest("/products/get-categories-products", params);
  },
};

export const FECartApi = {
  async normalAddToCart(params) {
    return await makeRequest("/cart/normal-add-to-cart", params, "POST");
  },
  async updateCartItemQty(params) {
    return await makeRequest("/cart/update-cart-item", params, "POST");
  },
  async getCart(params) {
    return await makeRequest("/cart/cart-data", params);
  },
  async removeCartItem(params) {
    return await makeRequest("/cart/remove-cart-item", params, "POST");
  },
};

export const orderApi = {
  async addToCart(params) {
    return await makeRequest("/cart/add-to-cart", params, "POST");
  },
};
