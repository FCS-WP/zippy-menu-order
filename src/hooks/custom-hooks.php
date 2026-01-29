<?php

add_filter('woocommerce_cart_item_permalink', function ($link, $cart_item) {

    if (!empty($cart_item['is_custom_menu'])) {
        return '';
    }

    return $link;

}, 10, 2);

add_filter('woocommerce_cart_item_name', function ($name, $cart_item) {
    
    if (!empty($cart_item['is_custom_menu'])) {
        return $cart_item['menu_data']['name'];
    }

    return $name;

}, 10, 2);

add_action('woocommerce_before_calculate_totals', function ($cart) {
    if (is_admin() && !defined('DOING_AJAX')) return;
    
    foreach ($cart->get_cart() as $item) {

        if (!empty($item['is_custom_menu'])) {
            $price = $item['menu_data']['price'] ?? 0;
            $item['data']->set_price($price);
        }

        if (!empty($item['is_dish_item'])) {
            $dish_price = $item['dish_data']['extra_price'] ?? 0;
            $item['data']->set_price($dish_price);
        }
    }
});