<?php

namespace ZIPPY_MENU_ORDER\App\Services\Stores;

use ZIPPY_MENU_ORDER\App\Models\Cart\Cart_Handler;
use ZIPPY_MENU_ORDER\App\Models\Products_Booking\Products_Booking_Model;
use ZIPPY_MENU_ORDER\App\Models\Stores\Store_Model;

class Store_Service
{
    public static function checkStoreExist($id)
    {
        $store_id = $id && $id !== 0 ? $id : WC()->session->get('selected_store');
        $store = Store_Model::find()
            ->where(['id' => $store_id])
            ->WhereNull('deleted_at')
            ->andWhere(['active' => 1])
            ->one();

        if (!$store) {
            return null;
        }

        return $store;
    }

    public static function get_store_info(int $store_id, int $product_id)
    {
        $store = Store_Model::find_by_id($store_id);
        if (empty($store)) {
            return null;
        }

        $data = [];
        $info = $store->toArray();
        $close_days_info = self::get_store_operations($store, $product_id);

        $data = array_merge($info, $close_days_info);
        return $data;
    }

    public static function get_store_operations(Store_Model $store, int $product_id): array
    {
        $data = [
            'close_days' => [],
            'special_days' => [],
        ];

        $product_booking = Products_Booking_Model::find_by_service_id_and_store_id($product_id, $store->id);
        $product_slots = $product_booking?->products_slots;
        $product_special_days = $product_booking?->product_special_days;

        if (!empty($product_slots)) {
            foreach ($product_slots as $slot) {
                if (in_array($slot->day_of_week, $data['close_days'])) {
                    continue;
                }

                if ($slot->is_open == 0) {
                    $data['close_days'][] = $slot->day_of_week;
                }
            }
        } else {
            $store_operations = $store->store_operations;
            foreach ($store_operations as $operation) {
                if (in_array($operation->day_of_week, $data['close_days'])) {
                    continue;
                }

                if ($operation->is_open == 0) {
                    $data['close_days'][] = $operation->day_of_week;
                }
            }
        }

        if (!empty($product_special_days)) {
            foreach ($product_special_days as $special_day) {
                if (in_array($special_day->date, $data['special_days'])) {
                    continue;
                }

                if ($special_day->closed == 1) {
                    $data['special_days'][] = $special_day->date;
                }
            }
        } else {
            $store_special_days = $store->special_days;
            foreach ($store_special_days as $special_day) {
                if (in_array($special_day->date, $data['special_days'])) {
                    continue;
                }

                if ($special_day->closed == 1) {
                    $data['special_days'][] = $special_day->date;
                }
            }
        }

        return $data;
    }

    public static function get_all_stores($product_id): array
    {
        $data = [];
        $stores = Store_Model::get_all_stores();
        $operations = [];
        foreach ($stores as $store) {
            $operations = self::get_store_operations($store, $product_id);
            $store->close_days = $operations['close_days'];
            $store->special_days = $operations['special_days'];
        }

        foreach ($stores as $store) {
            $data[] = $store->toArray();
        }

        return $data;
    }

    public static function save_session($store_id) {
        $store = Store_Model::find_by_id($store_id);
        if (!$store) {
           return [
                'success' => false,
                'message' => 'Store not found',
            ];
        }
        $cart_handler = new Cart_Handler();

        WC()->session->set('selected_store', $store_id);
        WC()->session->save_data();

        return [
            'message' => 'saved session!',
            'store' => $store->name,
        ];
    }

     public static function show_store($store_id) {
        $id = null;
        if (!$store_id || $store_id == 0) {
            $cart_handler = new Cart_Handler();
            $id = WC()->session->get('selected_store');
        } else {
            $id = $store_id;
        }

        if (!$id) {
            return [
                'success' => false,
                'message' => 'Store_id not found',
            ];
        }

        $store = Store_Model::find_by_id($store_id);
        
        if (!$store) {
           return [
                'success' => false,
                'message' => 'Store not found',
            ];
        }
      
        return $store->toArray();
    }

}
