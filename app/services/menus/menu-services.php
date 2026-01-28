<?php

namespace ZIPPY_MENU_ORDER\App\Services\Menus;

use ZIPPY_MENU_ORDER\App\Models\Menus\Menu_Model;

class Menu_Services
{
    public static function get_menus($infos)
    {
        try {
            $page         = $infos['page'] ?? null;
            $per_page     = $infos['per_page'] ?? null;

            if ($infos['ids']) {
                $menus = Menu_Model::get_menus_by_ids($infos['ids']);
                return self::db_menus_to_array($menus);
            }

            $menus = Menu_Model::get_all_menus($page, $per_page);

            return $menus;
        } catch (\Exception $e) {
            return new \WP_Error('server_error', $e->getMessage());
        }
    }

    public static function get_menu_detail($id)
    {
        try {
            $menu = Menu_Model::find_by_id($id);

            if (empty($menu)) {
                return new \WP_Error('menu_not_found', 'Menu not found!');
            }

            $result = $menu->toArray();
            $result['dishes_menus'] = Dishes_Menu_Services::get_dishes_menus(['menu_id' => $menu->id]);

            return $result;
        } catch (\Exception $e) {
            return new \WP_Error('server_error', $e->getMessage());
        }
    }

    public static function dishes_menus_to_array($dishes_menus)
    {
        $results = [];
        foreach ($dishes_menus as $menu) {
            $results[] = $menu->toArray();
        }
        return $results;
    }

    
    public static function db_menus_to_array($menus)
    {
        $results = [];
        foreach ($menus as $menu) {
            $results[] = $menu->toArray();
        }
        return $results;
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
            $description = $infos['description'] ?? "";
            $featured_img = $infos['featured_img'] ?? "";
            $min_pax = $infos['min_pax'] ?? 0;
            $max_pax = $infos['max_pax'] ?? 0;
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
                'featured_img' => $featured_img,
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
            $description = $infos['description'] ?? "";
            $featured_img = $infos['featured_img'] ?? "";
            $min_pax = $infos['min_pax'] ?? 0;
            $max_pax = $infos['max_pax'] ?? 0;
            $name = $infos['name'];
            $price = $infos['price'];
            $dishes_qty = $infos['dishes_qty'];
            $is_active = $infos['is_active'] ?? 1;

            $menu = new Menu_Model();
            $menuCreated = $menu->create([
                'name' => $name,
                'description' => $description,
                'featured_img' => $featured_img,
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
            return $menuCreated->toArray();
        } catch (\Exception $e) {
            $wpdb->query('ROLLBACK');
            return new \WP_Error('server_error', $e->getMessage());
        }
    }

    /**
     * Delete mmenus
     */

    public static function delete_menu($id)
    {
        try {
            $menu = Menu_Model::find_by_id($id);

            $deleted_menu = $menu->softDelete();

            if (!$menu) {
                return false;
            }

            return $deleted_menu;
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Toggle Status
     */

    public static function update_menu_status($id)
    {
        try {
            global $wpdb;
            $wpdb->query('START TRANSACTION');
            $menu = Menu_Model::find_by_id($id);

            if (empty($menu)) {
                $wpdb->query('ROLLBACK');
                return new \WP_Error('menu_not_found', 'Menu not found!');
            }

            $menu_data = $menu->toArray();

            $menuUpdated = $menu->update([
                'is_active' => !$menu_data['is_active'],
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
}
