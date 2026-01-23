<?php

namespace ZIPPY_MENU_ORDER\App\Services\Menus;

use ZIPPY_MENU_ORDER\App\Models\Menus\Menu_Model;

class Menu_Services
{
    public static function get_menus($name)
    {
        // $args = [
        //     'post_type'      => 'product',
        //     'post_status'    => 'publish',
        //     'posts_per_page' => -1,
        //     's'              => $name,
        // ];

        // $query = new \WP_Query($args);
        // $menus = [];

        // if ($query->have_posts()) {
        //     while ($query->have_posts()) {
        //         $query->the_post();
        //         $product = wc_get_product(get_the_ID());

        //         if (!$product) continue;

        //         $menus[] = [
        //             'id'          => $product->get_id(),
        //             'name'        => $product->get_name(),
        //             'status'      => $product->get_status(),
        //             'price'       => (float) $product->get_price(),
        //             'description' => wp_strip_all_tags($product->get_description()),
        //         ];
        //     }
        //     wp_reset_postdata();
        // }

        // return $products;
    }

    public static function get_menu_detail($id)
    {
        try {
            $menu = Menu_Model::find_by_id($id)?->toArray();

            if (empty($menu)) {
                return new \WP_Error('menu_not_found', 'Menu not found!');
            }

            return $menu;
        } catch (\Exception $e) {
            return new \WP_Error('server_error', $e->getMessage());
        }
    }

    /**
     * Update menu
     * @param mixed $infos
     * @return array|\WP_Error
     */

    public static function update_menu($infos)
    {
        try {
            $menu_id = $infos['id'];
            $name = $infos['name'];
            $description = $infos['description'];
            $min_pax = $infos['min_pax'] ?? 0;
            $max_pax = $infos['max_pax'] ?? null;
            $name = $infos['name'];
            $price = $infos['price'];
            $dishes_qty = $infos['dishes_qty'];
            $is_active = $infos['is_active'] ?? null;

            global $wpdb;
            $wpdb->query('START TRANSACTION');
            $menu = Menu_Model::find_by_id($menu_id);
    
            if (empty($menu)) {
                $wpdb->query('ROLLBACK');
                return new \WP_Error('menu_not_found', 'Menu not found!');
            }

            $menuUpdated = $menu->update([
                'name' => $name,
                'description' => $description,
                'min_pax'  => $min_pax,
                'max_pax'  => $max_pax,
                'price'  => $price,
                'dishes_qty'  => $dishes_qty,
                'is_active' => $is_active,
            ]);

            if (empty($menuUpdated)) {
                $wpdb->query('ROLLBACK');
                return new \WP_Error('menu_error', 'failed to update menu');
            }
            $wpdb->query('COMMIT');
            return $menuUpdated?->toArray();
        } catch (\Exception $e) {
            $wpdb->query('ROLLBACK');
            return new \WP_Error('server_error', $e->getMessage());
        }
    }

    /**
     * Create booking
     * @param mixed $infos
     * @return array|\WP_Error
     */
    public static function create_menu($infos)
    {
        global $wpdb;

        try {
            $wpdb->query('START TRANSACTION');

            $name = $infos['name'];
            $description = $infos['description'];
            $min_pax = $infos['min_pax'] ?? 0;
            $max_pax = $infos['max_pax'] ?? null;
            $name = $infos['name'];
            $price = $infos['price'];
            $dishes_qty = $infos['dishes_qty'];
            $is_active = $infos['is_active'] ?? 1;

            $menu = new Menu_Model();
            $menuCreated = $menu->create([
                'name' => $name,
                'description' => $description,
                'min_pax'  => $min_pax,
                'max_pax'  => $max_pax,
                'price'  => $price,
                'dishes_qty'  => $dishes_qty,
                'is_active' => $is_active,
            ]);
            if (empty($menuCreated)) {
                $wpdb->query('ROLLBACK');
                return new \WP_Error('menu_error', 'failed to create menu');
            }
            $wpdb->query('COMMIT');
            return $menuCreated;
        } catch (\Exception $e) {
            $wpdb->query('ROLLBACK');
            return new \WP_Error('server_error', $e->getMessage());
        }
    }
}
