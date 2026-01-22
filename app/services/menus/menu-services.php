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

    public static function get_menu_detail()
    {
       
    }

    // public static function update_menu($infos)
    // {
    //     try {
    //         $menu_id = $infos['menu_id'];
    //         $name = $infos['name'];
    //         $description = $infos['description'];
    //         $min_pax = $infos['min_pax'] ?? 0;
    //         $max_pax = $infos['max_pax'] ?? null;
    //         $name = $infos['name'];
    //         $price = $infos['price'];
    //         $dishes_qty = $infos['dishes_qty'];
    //         $is_active = $infos['is_active'] ?? null;

    //         global $wpdb;
    //         $wpdb->query('START TRANSACTION');
    //         $menu = Booking_Model::find_by_id($booking_id);
    //         if (empty($booking)) {
    //             $wpdb->query('ROLLBACK');
    //             return new \WP_Error('booking_not_found', message('booking')['booking_not_found']);
    //         }

    //         if (!Timeslots_Services::can_book_slot($date, $store_id, $booking->service_id, $start_time, $end_time, $booking->booked, $slot)) {
    //             $wpdb->query('ROLLBACK');
    //             return new \WP_Error('not_available', message('booking')['not_enough_slots']);
    //         }

    //         $new_booking_slot = self::getBookingSlot($store_id, $date, $start_time, $end_time);
    //         if (empty($new_booking_slot)) {
    //             $wpdb->query('ROLLBACK');
    //             return new \WP_Error('slot_not_found', message('booking')['slot_not_found']);
    //         }

    //         $booking->update([
    //             'slot_id' => $new_booking_slot->id,
    //             'booked'  => $slot,
    //         ]);

    //         //2. Update new slot
    //         // $updateSlot = self::updateSlotAvailability($new_booking_slot, $slot);
    //         // if (!$updateSlot) {
    //         //     $wpdb->query('ROLLBACK');
    //         //     return new \WP_Error('not_enough_slots', message('booking')['not_enough_slots']);
    //         // }

    //         //3. Update order info
    //         Booking_Services::update_order_info($customer, $status, $booking, $slot);

    //         $wpdb->query('COMMIT');

    //         return true;
    //     } catch (\Exception $e) {
    //         $wpdb->query('ROLLBACK');
    //         return new \WP_Error('server_error', $e->getMessage());
    //     }
    // }

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
                return new \WP_Error('booking_error', 'failed to create menu');
            }
            $wpdb->query('COMMIT');
            return $menuCreated;
        } catch (\Exception $e) {
            $wpdb->query('ROLLBACK');
            return new \WP_Error('server_error', $e->getMessage());
        }
    }
}
