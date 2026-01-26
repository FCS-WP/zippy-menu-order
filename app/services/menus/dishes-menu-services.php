<?php

namespace ZIPPY_MENU_ORDER\App\Services\Menus;

use ZIPPY_MENU_ORDER\App\Models\Menus\Dishes_Menu_Model;

class Dishes_Menu_Services
{
    public static function get_dishes_menus($data)
    {
        try {
            $menu_id = $data['menu_id'];

            if (empty($menu_id)) {
                return new \WP_Error('menu_not_found', 'Menu not found!');
            }

            $type = $data['type'] ?? "";
            $menus = Dishes_Menu_Model::get_all_dishes_menus($menu_id, $type);

            $results = [];
            foreach ($menus as $key => $menu) {
                $results[$key] = $menu->toArray();
                $results[$key]['dishes'] = self::dishes_to_array($menu->dishes);
            }

            return $results;
        } catch (\Exception $e) {
            return new \WP_Error('server_error', $e->getMessage());
        }
    }

    public static function dishes_to_array($dishes)
    {
        $results = [];
        foreach ($dishes as $key => $dish) {
            $results[$key] = $dish->toArray();
            $results[$key]['name'] = wc_get_product($dish->product_id)->get_name();
        }
        return $results;
    }

    public static function get_menu_detail($id)
    {
        try {
            $menu = Dishes_Menu_Model::find_by_id($id)?->toArray();

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

    public static function update_menu($data)
    {
        try {
            $dishes_menu_id = $data['id'];
            $menu_id = $data['menu_id'];
            $name = $data['name'] ?? "";
            $min_qty = $data['min_qty'] ?? 0;
            $max_qty = $data['max_qty'] ?? 0;
            $is_required = $data['is_required'] ?? 1;
            $type = $data['type'] ?? 'main';
            $dishes = $data['dishes'] ?? [];

            global $wpdb;
            $wpdb->query('START TRANSACTION');
            $menu = Dishes_Menu_Model::find_by_id($dishes_menu_id);

            if (empty($menu)) {
                $wpdb->query('ROLLBACK');
                return new \WP_Error('menu_not_found', 'Dishes menu not found!');
            }

            $menuUpdated = $menu->update([
                'name' => $name,
                'type'  => $type,
                'min_qty'  => $min_qty,
                'menu_id'  => $menu_id,
                'max_qty'  => $max_qty,
                'is_required' => $is_required,
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
    public static function create_dishes_menu($data)
    {
        global $wpdb;

        try {
            $wpdb->query('START TRANSACTION');

            $menu_id = $data['menu_id'];
            $name = $data['name'] ?? "";
            $min_qty = $data['min_qty'] ?? 0;
            $max_qty = $data['max_qty'] ?? 0;
            $is_required = $data['is_required'] ?? 1;
            $type = $data['type'] ?? 'main';
            $dishes = $data['dishes'] ?? [];

            $menu = new Menu_Model();
            $menuCreated = $menu->create([
                'name' => $name,
                'type'  => $type,
                'min_qty'  => $min_qty,
                'menu_id'  => $menu_id,
                'max_qty'  => $max_qty,
                'is_required' => $is_required,
            ]);

            if (empty($menuCreated)) {
                $wpdb->query('ROLLBACK');
                return new \WP_Error('menu_error', 'failed to create menu');
            }

            $wpdb->query('COMMIT');
            return $menuCreated->toArray();
        } catch (\Exception $e) {
            $wpdb->query('ROLLBACK');
            return new \WP_Error('server_error', $e->getMessage());
        }
    }

    /**
     * Delete mmenus
     */

    public static function delete_dishes_menu($id)
    {
        try {
            $menu = Dishes_Menu_Model::find_by_id($id);

            $deleted_menu = $menu->softDelete();

            if (!$menu) {
                return false;
            }

            return $deleted_menu;
        } catch (\Exception $e) {
            return false;
        }
    }
}
