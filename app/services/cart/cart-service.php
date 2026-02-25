<?php

namespace ZIPPY_MENU_ORDER\App\Services\Cart;

use ZIPPY_MENU_ORDER\App\Models\Cart\Cart_Handler;
use ZIPPY_MENU_ORDER\App\Models\Dishes\Dishes_Model;
use ZIPPY_MENU_ORDER\App\Models\Menus\Menu_Model;
use ZIPPY_MENU_ORDER\App\Models\Stores\Store_Model;

class Cart_Service
{
    public static function add_to_cart($data)
    {
        $menu_id = $data['menu_id'] ?? 0;
        $menu = Menu_Model::find_by_id($menu_id);

        if (!$menu) {
            return [
                'success' => false,
                'message' => 'menu not found',
            ];
        }

        $dish_ids = $data['dish_ids'] ?? [];
        $dish_ids = array_map('intval', $dish_ids);
        $delivery_date = $data['delivery_date'] ?? null;
        $delivery_time = $data['delivery_time'] ?? null;
        $nums_of_pax = $data['num_pax'] ?? $menu->min_pax;

        if (empty($dish_ids) || !is_array($dish_ids)) {
            return [
                'success' => false,
                'message' => 'Dish IDs are required',
            ];
        }

        $cart_handler = new Cart_Handler();
        $added_items = [];

        // Store order-level data in WooCommerce session
        WC()->session->set('zippy_delivery_date', $delivery_date);
        WC()->session->set('zippy_delivery_time', $delivery_time);
        WC()->session->set('zippy_nums_of_pax', $nums_of_pax);
        // Add each dish to cart
        $cart_handler->clear_cart();

        foreach ($dish_ids as $dish_id) {
            $dish = Dishes_Model::find_by_id($dish_id);
            if (empty($dish)) {
                continue;
            }

            $product_id = $dish->product_id;
            $extra_price = $dish->extra_price;

            // Product-specific custom data
            $dish_custom_data = [
                'is_dish_item' => true,
                'dish_data' => [
                    'extra_price' => $extra_price,
                    'dish_id' => $dish_id,
                    'dish_type' => $dish->dishes_menus->type,
                    'dishes_menu_id' => $dish->dishes_menus->id,
                    'menu_id' => $menu_id
                ]
            ];

            $cart_item_key = $cart_handler->add_to_cart($product_id, $nums_of_pax, $dish_custom_data);
            if (!empty($cart_item_key)) {
                $added_items[] = [
                    'product_id'    => $product_id,
                    'quantity'      => $nums_of_pax,
                    'cart_item_key' => $cart_item_key,
                ];
            }
        }
        // Add product menu to cart
        $product_menu_id = self::zippy_get_menu_product_id();

        if ($product_menu_id) {
            $menu_product_key = $cart_handler->add_to_cart(
                $product_menu_id,
                $nums_of_pax,
                [
                    'is_custom_menu' => true,
                    'menu_data' => [
                        'id' => $menu->id,
                        'name' => $menu->name,
                        'price' => $menu->price
                    ],
                    'unique_key' => md5(microtime())
                ]
            );

            if (empty($menu_product_key)) {
                return [
                    'success' => false,
                    'message' => 'Add menu failed',
                ];
            }
        }

        WC()->cart->calculate_totals();
        WC()->session->save_data();

        return [
            'success' => !empty($added_items),
            'message' => !empty($added_items) ? 'Items added to cart successfully' : 'Failed to add items to cart',
            'items' => $added_items,
            'cart_data' => [
                'delivery_date' => $delivery_date,
                'delivery_time' => $delivery_time,
                'nums_of_pax' => $nums_of_pax,
            ],
        ];
    }

    public static function normal_add_to_cart($data)
    {
        // Validate store
        $store_id = $data['store_id'] ?? 0;
        $store = Store_Model::find_by_id($store_id);

        if (!$store) {
            return [
                'success' => false,
                'message' => 'store not found',
            ];
        }

        $product_id = $data['product_id'] ?? null;
        $product = wc_get_product($product_id);

        if (!$product) {
            return null;
        }

        $cart_handler = new Cart_Handler();
        $cart_item_key = $cart_handler->add_to_cart($product_id);

        WC()->cart->calculate_totals();
        WC()->session->save_data();

        $items = [];
        foreach ($cart_handler->get_cart_items() as $key => $item) {

            $product = $item['data'];
            $items[] = [
                'key'        => $key,
                'product_id' => $item['product_id'],
                'name'       => $product->get_name(),
                'price'      => wc_price($product->get_price()),
                'quantity'   => $item['quantity'],
                'subtotal'   => $item['line_total'],
            ];
        }


        return [
            'message' => !empty($cart_item_key) ? 'Item added to cart successfully' : 'Failed to add item to cart',
            'cart_data' => [
                'items' => $items,
                'total' => $cart_handler->get_cart_totals(),
            ]
        ];
    }

    public static function get_cart_data()
    {
        try {
            $cart_handler = new Cart_Handler();
            $items = [];
            foreach ($cart_handler->get_cart_items() as $key => $item) {

                $product = $item['data'];
                $items[] = [
                    'key'        => $key,
                    'product_id' => $item['product_id'],
                    'name'       => $product->get_name(),
                    'price'      => wc_price($product->get_price()),
                    'quantity'   => $item['quantity'],
                    'subtotal'   => $item['line_total'],
                ];
            }

            return [
                'items' => $items,
                'total' => $cart_handler->get_cart_totals(),
            ];
        } catch (\Throwable $th) {
            throw $th;
        }
    }

    public static function get_cart()
    {
        try {
            $cart_data = self::get_cart_data();
            return [
                'cart_data' => $cart_data,
                'message' => 'get cart successfully!',
            ];
        } catch (\Throwable $th) {
            throw $th;
        }
    }

    public static function update_qty($data)
    {
        try {
            $cart_handler = new Cart_Handler();
            $cart_item_key = $data['cart_item_key'] ?? null;
            $new_qty = $data['new_qty'] ?? 0;
            $cart_item = $cart_handler->get_cart_item_by_key($cart_item_key);

            if (!$cart_item) {
                return [
                    'success' => false,
                    'message' => 'Cart item not found',
                ];
            }

            if ($new_qty <= 0) {
                $cart_handler->remove_cart_item($cart_item_key);
            } else {
                $cart_handler->update_cart_item($cart_item_key, $new_qty);
            }

            return [
                'cart_data' => self::get_cart_data(),
                'message' => 'update cart successfully!',
            ];
        } catch (\Throwable $th) {
            throw $th;
        }
    }

    public static function remove_item($data)
    {
        try {
            $cart_handler = new Cart_Handler();
            $cart_item_key = $data['cart_item_key'] ?? null;
            $cart_item = $cart_handler->get_cart_item_by_key($cart_item_key);

            if (!$cart_item) {
                return [
                    'success' => false,
                    'message' => 'Cart item not found',
                ];
            }

            $removed = $cart_handler->remove_cart_item($cart_item_key);

            WC()->cart->calculate_totals();
            WC()->session->save_data();

            $items = [];
            foreach ($cart_handler->get_cart_items() as $key => $item) {
                $product = $item['data'];
                $items[] = [
                    'key'        => $key,
                    'product_id' => $item['product_id'],
                    'name'       => $product->get_name(),
                    'price'      => wc_price($product->get_price()),
                    'quantity'   => $item['quantity'],
                    'subtotal'   => $item['line_total'],
                ];
            }

            return [
                'message' => !empty($removed) ? 'Item has been removed' : 'Failed to remove item',
                'cart_data' => [
                    'items' => $items,
                    'total' => $cart_handler->get_cart_totals(),
                ]
            ];
        } catch (\Throwable $th) {
            throw $th;
        }
    }

    public static function zippy_get_menu_product_id()
    {
        $cached = get_transient('zippy_menu_product_id');
        if ($cached) return $cached;

        $product_id = wc_get_products([
            'limit' => 1,
            'tag'   => ['unique-product-menu'],
            'return' => 'ids',
        ]);

        if (!empty($product_id)) {
            set_transient('zippy_menu_product_id', $product_id[0], DAY_IN_SECONDS);
            return $product_id[0];
        }

        return false;
    }
}
