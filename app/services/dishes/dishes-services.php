<?php

namespace ZIPPY_MENU_ORDER\App\Services\Dishes;

use ZIPPY_MENU_ORDER\App\Models\Dishes\Dishes_Model;
use WP_Error;

class Dishes_Services
{
    /**
     * Sync dishes for a dishes_menu
     *
     * @param int   $dishes_menu_id
     * @param array $dishes  [
     *   [
     *     'product_id' => 12,
     *    ...
     *   ]
     * ]
     *
     * @return true|WP_Error
     */
    public static function sync_dishes_menu($dishes_menu_id, array $dishes)
    {
        global $wpdb;

        try {
            $wpdb->query('START TRANSACTION');

            /** 1️⃣ Get existing dishes in menu */
            $existing_dishes = Dishes_Model::find_by_menu_id($dishes_menu_id);

            // Map existing dishes by product_id
            $existing_map = [];
            foreach ($existing_dishes as $dish) {
                $existing_map[$dish->product_id] = $dish;
            }

            /** 2️⃣ Track incoming product IDs */
            $incoming_product_ids = [];

            foreach ($dishes as $dish_data) {
                if (empty($dish_data['product_id'])) {
                    continue;
                }

                $product_id = (int) $dish_data['product_id'];
                $incoming_product_ids[] = $product_id;

                $payload = [
                    'dishes_menu_id' => $dishes_menu_id,
                    'product_id'     => $product_id,
                    'extra_price'    => $dish_data['extra_price'] ?? 0,
                ];

                /** 3️⃣ Update or Create */
                if (isset($existing_map[$product_id])) {
                    // Update existing dish
                    $updated = $existing_map[$product_id]->update($payload);

                    if (!$updated) {
                        throw new \Exception('Failed to update dish: ' . $product_id);
                    }
                } else {
                    // Create new dish
                    $dish = new Dishes_Model();
                    $created = $dish->create($payload);

                    if (!$created) {
                        throw new \Exception('Failed to create dish: ' . $product_id);
                    }
                }
            }

            /** 4️⃣ Remove dishes not in request */
            foreach ($existing_map as $product_id => $dish) {
                if (!in_array($product_id, $incoming_product_ids, true)) {
                    // Soft delete preferred
                    $dish->hardDelete();
                }
            }

            $wpdb->query('COMMIT');
            return true;
        } catch (\Exception $e) {
            $wpdb->query('ROLLBACK');
            return new WP_Error('sync_dishes_failed', $e->getMessage());
        }
    }
}
