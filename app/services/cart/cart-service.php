<?php

namespace ZIPPY_MENU_ORDER\App\Services\Cart;

use ZIPPY_MENU_ORDER\App\Models\Cart\Cart_Handler;


class Cart_Service
{
    public static function add_to_cart($data)
    {
        $dish_ids = $data['dish_ids'] ?? [];
        $delivery_date = $data['delivery_date'] ?? null;
        $delivery_time = $data['delivery_time'] ?? null;
        $nums_of_pax = $data['nums_of_pax'] ?? null;

        if (empty($dish_ids) || !is_array($dish_ids)) {
            return [
                'success' => false,
                'message' => 'Dish IDs are required',
            ];
        }

        $cart_handler = new Cart_Handler();
        $added_items = [];

        // Prepare custom data for cart items
        $custom_data = [
            'delivery_date' => $delivery_date,
            'delivery_time' => $delivery_time,
            'nums_of_pax' => $nums_of_pax,
        ];

        // Add each dish to cart
        foreach ($dish_ids as $dish_id) {
            $product_id = is_array($dish_id) ? ($dish_id['product_id'] ?? $dish_id['id'] ?? null) : $dish_id;
            if (empty($product_id)) {
                continue;
            }

            $cart_item_key = $cart_handler->add_to_cart($product_id, $nums_of_pax, $custom_data);

            if (!empty($cart_item_key)) {
                $added_items[] = [
                    'product_id'    => $product_id,
                    'quantity'      => $nums_of_pax,
                    'cart_item_key' => $cart_item_key,
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
}
