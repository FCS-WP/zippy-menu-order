<?php

namespace ZIPPY_MENU_ORDER\App\Services\Special_Days;

use ZIPPY_MENU_ORDER\Core\Base_Controller;
use ZIPPY_MENU_ORDER\Core\Base_Request;
use WP_REST_Response;
use WP_REST_Request;
use ZIPPY_MENU_ORDER\App\Models\Special_Days\Special_Days_Model;

class Special_Days_Service
{
    public static function get_all_special_days($store_id = null, $date = null): array
    {
        $special_days = Special_Days_Model::get_all($store_id, $date);

        $result = [];
        foreach ($special_days as $day) {
            $result[] = [
                'id' => $day->id,
                'store_id' => $day->store_id,
                'label' => $day->label,
                'date' => $day->date,
                'closed' => (bool)$day->closed,
                'open_time' => $day->open_time,
                'close_time' => $day->close_time,
            ];
        }

        return $result;
    }

    public static function create_special_day($data)
    {
        $store_id = $data['store_id'] ?? null;
        $days = $data['days'] ?? [];

        foreach ($days as $day_data) {
            $date = $day_data['date'] ?? null;
            $open_time = $day_data['open_time'] ?? null;
            $close_time = $day_data['close_time'] ?? null;
            $label = $day_data['label'] ?? null;
            $closed = $day_data['closed'] ?? false;

            $existing_special_day = Special_Days_Model::find_closed_date($store_id, $date, $open_time, $close_time);
            $special_day = $existing_special_day ? $existing_special_day : new Special_Days_Model();
            $special_day->store_id = $store_id;
            $special_day->date = $date;
            $special_day->open_time = $open_time;
            $special_day->close_time = $close_time;
            $special_day->label = $label;
            $special_day->closed = $closed ? 1 : 0;
            $special_day->save();
        }

        return true;
    }
}
