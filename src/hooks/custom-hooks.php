<?php

/**
 * Remove permalink for product menu.
 * 
 */

use ZIPPY_MENU_ORDER\App\Models\Menus\Menu_Model;
use ZIPPY_MENU_ORDER\App\Services\Stores\Store_Operation_Service;

add_filter('woocommerce_cart_item_permalink', function ($link, $cart_item) {
    if (!empty($cart_item['is_custom_menu'])) {
        return '';
    }
    return $link;
}, 10, 2);

/**
 * Update product menu name
 * 
 */
add_filter('woocommerce_cart_item_name', function ($name, $cart_item) {
    if (!empty($cart_item['is_custom_menu'])) {
        return $cart_item['menu_data']['name'];
    }
    return $name;
}, 99, 2);


add_filter('woocommerce_order_item_name', function ($name, $item, $is_visible) {
    if ($item->get_meta('_is_custom_menu')) {
        $menu_data = $item->get_meta('menu_data');
        if (!empty($menu_data['name'])) {
            $name = esc_html($menu_data['name']);
        }
    }
    return $name;
}, 10, 3);

add_action('woocommerce_checkout_create_order_line_item', function ($item, $cart_item_key, $values) {
    if (!empty($values['is_custom_menu'])) {
        $item->add_meta_data('_is_custom_menu', true, true);
        $item->add_meta_data('menu_data', $values['menu_data'], true);
    }

    if (!empty($values['is_dish_item'])) {
        $item->add_meta_data('Type', $values['dish_data']['dish_type'], true);
        $item->add_meta_data('dish_data', $values['dish_data'], true);
        $item->add_meta_data('is_dish_item', 1, true);
    }
}, 10, 3);

add_filter('woocommerce_order_item_visible', function ($visible, $item) {
    if ($item->get_meta('is_dish_item')) {
        return false;
    }
    return $visible;
}, 10, 2);

add_filter('woocommerce_cart_item_thumbnail', function ($thumbnail, $cart_item, $cart_item_key) {

    if (!empty($cart_item['is_custom_menu'])) {
        $menu_id = $cart_item['menu_data']['id'] ?? 0;
        $menu = Menu_Model::find_by_id($menu_id);
        if (!$menu) {
            return $thumbnail;
        }
        $image_url = $menu->featured_img;
        if ($image_url) {
            $thumbnail = '<img class="woocommerce-placeholder wp-post-image" src="' . esc_url($image_url) . '" style="width: 100px"/>';
        }
    }

    return $thumbnail;
}, 10, 3);

/**
 * Calc menu prices
 * 
 */
add_action('woocommerce_before_calculate_totals', function ($cart) {
    if (is_admin() && !defined('DOING_AJAX')) return;

    $saved_product_menu_key = null;
    $extra_prices = 0;
    $cart_items = $cart->get_cart();

    foreach ($cart_items as $item) {
        if (!empty($item['is_custom_menu'])) {
            $price = $item['menu_data']['price'] ?? 0;
            $item['data']->set_price($price);
            $saved_product_menu_key = $item['key'];
        }

        if (!empty($item['is_dish_item'])) {
            $item['data']->set_price(0);
            $extra_prices += floatval($item['dish_data']['extra_price']);
        }
    }

    if (!empty($saved_product_menu_key)) {
        $new_menu_price = $cart_items[$saved_product_menu_key]['data']->get_price() + $extra_prices;
        $cart_items[$saved_product_menu_key]['data']->set_price($new_menu_price);
    }
});

/**
 * Hidden dish item
 * 
 */
// CART
add_filter('woocommerce_cart_item_visible', function ($visible, $cart_item) {
    if (!empty($cart_item['is_dish_item'])) {
        return false;
    }
    return $visible;
}, 10, 2);

// CHECKOUT
add_filter('woocommerce_checkout_cart_item_visible', function ($visible, $cart_item) {
    return empty($cart_item['is_dish_item']);
}, 10, 2);

// EMAIL
add_filter('woocommerce_email_order_item_visible', function ($visible, $item) {
    if ($item->get_meta('is_dish_item')) {
        return false;
    }
    return $visible;
}, 10, 2);


/**
 * Remove related cart item
 * 
 */
add_action('woocommerce_remove_cart_item', function ($cart_item_key, $cart) {
    $removed_item = $cart->removed_cart_contents[$cart_item_key] ?? null;
    if (!$removed_item) return;
    /**
     * If removed item is DISH
     */
    if (!empty($removed_item['is_custom_menu'])) {
        WC()->cart->empty_cart();
    }
}, 10, 2);


/**
 * Custom display items.
 * 
 */

add_action('woocommerce_after_cart_item_name', function ($cart_item, $cart_item_key) {
    if (empty($cart_item['is_custom_menu'])) return;
    zippy_render_menu_dishes(WC()->cart->get_cart());
}, 10, 2);


add_action('woocommerce_review_order_after_cart_contents', function () {
    if (!WC()->cart) return;
    echo '<tr class="zippy-menu-row">
        <td colspan="2">';
    zippy_render_menu_dishes(WC()->cart->get_cart());
    echo '</td></tr>';
});

add_action('woocommerce_order_details_after_order_table', function ($order) {
    if (!$order) return;
    echo '<h3>Menu Details</h3>';
    echo '<div style="margin-top:20px;padding:15px;border:1px solid #ddd; background: #FFF">';
    zippy_render_menu_dishes($order->get_items());
    echo '</div>';
});
add_action('woocommerce_email_after_order_table', function ($order) {
    echo '<h2>Menu Details</h2>';
    echo '<div style="padding: 12px; color: #636363; border: 1px solid #e5e5e5">';
    zippy_render_menu_dishes($order->get_items());
    echo '</div>';
}, 20);

/**
 * Add order meta
 */

add_action('woocommerce_checkout_create_order', function ($order, $data) {
    $delivery_date = WC()->session->get('zippy_delivery_date');
    $delivery_time_id = WC()->session->get('zippy_delivery_time');
    $delivery_time = Store_Operation_Service::get_display_time_by_slot_id(STORE_ID, $delivery_date, $delivery_time_id) ?? $delivery_time_id;

    $nums_of_pax   = WC()->session->get('zippy_nums_of_pax');
    if ($delivery_date) {
        $order->update_meta_data('_delivery_date', $delivery_date);
    }
    if ($delivery_time) {
        $order->update_meta_data('_delivery_time', $delivery_time);
    }
    if ($nums_of_pax) {
        $order->update_meta_data('_nums_of_pax', $nums_of_pax);
    }
}, 10, 2);

add_action('woocommerce_checkout_order_processed', function () {
    WC()->session->__unset('zippy_delivery_date');
    WC()->session->__unset('zippy_delivery_time');
    WC()->session->__unset('zippy_nums_of_pax');
});

/**
 * skhow order meta in admin page
 * 
 */
add_action('woocommerce_admin_order_data_after_shipping_address', function ($order) {
    echo '<p><strong>Delivery Date:</strong> '
        . esc_html($order->get_meta('_delivery_date')) . '</p>';
    echo '<p><strong>Delivery Time:</strong> '
        . esc_html($order->get_meta('_delivery_time')) . '</p>';
    echo '<p><strong>Number of Pax:</strong> '
        . esc_html($order->get_meta('_nums_of_pax')) . '</p>';
});

/**
 * show in thankyou page
 */

add_action('woocommerce_thankyou', function ($order_id) {
    if (!$order_id) return;
    $order = wc_get_order($order_id);
    $delivery_date = $order->get_meta('_delivery_date');
    $delivery_time = $order->get_meta('_delivery_time');
    $nums_of_pax   = $order->get_meta('_nums_of_pax');

    if (!$delivery_date && !$delivery_time) return;

    echo '<h3>Delivery Information</h3>';
    echo '<div class="zippy-delivery-info" style="margin-top:20px;padding:15px;border:1px solid #ddd; background: #FFF">';
    if ($delivery_date) {
        echo '<p><strong>Date:</strong> ' . esc_html($delivery_date) . '</p>';
    }
    if ($delivery_time) {
        echo '<p><strong>Time:</strong> ' . esc_html($delivery_time) . '</p>';
    }
    if ($nums_of_pax) {
        echo '<p><strong>Number of Pax:</strong> ' . esc_html($nums_of_pax) . '</p>';
    }
    echo '</div>';
}, 20);

/**
 * Show delivery into email
 */
add_action('woocommerce_email_order_meta', function ($order, $sent_to_admin, $plain_text, $email) {

    $delivery_date = $order->get_meta('_delivery_date');
    $delivery_time = $order->get_meta('_delivery_time');
    $nums_of_pax   = $order->get_meta('_nums_of_pax');

    if (!$delivery_date && !$delivery_time && !$nums_of_pax) {
        return;
    }

    // ---- Plain text emails ----
    if ($plain_text) {
        echo "\nDelivery Information\n";
        if ($delivery_date) {
            echo "Date: " . $delivery_date . "\n";
        }
        if ($delivery_time) {
            echo "Time Slot: " . $delivery_time . "\n";
        }
        if ($nums_of_pax) {
            echo "Pax: " . $nums_of_pax . "\n";
        }
    }
    // ---- HTML emails ----
    else {
        echo '<h2 style="margin-top: 24px">Delivery Information</h2>';
        echo '<div style="padding: 12px; color: #636363; border: 1px solid #e5e5e5">';
        if ($delivery_date) {
            echo '<p><strong>Date:</strong> ' . esc_html($delivery_date) . '</p>';
        }
        if ($delivery_time) {
            echo '<p><strong>Time:</strong> ' . esc_html($delivery_time) . '</p>';
        }
        if ($nums_of_pax) {
            echo '<p><strong>Pax:</strong> ' . esc_html($nums_of_pax) . '</p>';
        }
        echo '</div>';
    }
}, 20, 4);


/**
 * Common Function
 */

function zippy_render_menu_dishes($items)
{

    $grouped_dishes = [];

    foreach ($items as $item) {

        // Works for BOTH cart & order
        $is_dish = is_array($item)
            ? !empty($item['is_dish_item'])
            : $item->get_meta('is_dish_item');

        if (!$is_dish) continue;

        $dish_data = is_array($item)
            ? ($item['dish_data'] ?? [])
            : $item->get_meta('dish_data');

        if (empty($dish_data['dishes_menu_id'])) continue;

        $menu_id = $dish_data['dishes_menu_id'];

        $grouped_dishes[$menu_id]['dishes'][] = [
            'name' => is_array($item)
                ? get_the_title($item['product_id'])
                : $item->get_name(),
            'extra_price' => $dish_data['extra_price'] ?? 0
        ];
    }

    if (empty($grouped_dishes)) return;

    echo '<div class="zippy-menu-dishes" style="margin-top:8px;">';

    foreach ($grouped_dishes as $menu_id => $data) {

        $menu = \ZIPPY_MENU_ORDER\App\Models\Menus\Dishes_Menu_Model::find_by_id($menu_id);
        if (!$menu) continue;

        echo '<div style="margin-left:15px;">';
        echo '<strong>' . esc_html($menu->name) .
            ' <small>(' . esc_html($menu->type) . ' courses)</small></strong>';

        echo '<ul>';

        foreach ($data['dishes'] as $dish) {
            echo '<li>- ' . esc_html($dish['name']);

            if ($dish['extra_price'] > 0) {
                echo ' <b>(+' . wc_price($dish['extra_price']) . ')</b>';
            }

            echo '</li>';
        }

        echo '</ul></div>';
    }

    echo '</div>';
}

/**
 * Hidden custom meta_data */
add_filter('woocommerce_hidden_order_itemmeta', function ($hidden_meta_keys) {
    $hidden_meta_keys[] = 'is_custom_menu';
    $hidden_meta_keys[] = 'is_dish_item';
    $hidden_meta_keys[] = 'dish_data';
    $hidden_meta_keys[] = 'menu_data';
    return $hidden_meta_keys;
});
