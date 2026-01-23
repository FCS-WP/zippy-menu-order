<?php

namespace ZIPPY_MENU_ORDER\App\Services\Stores;

use ZIPPY_MENU_ORDER\App\Models\Stores\Store_Operation_Model;

class Store_Operation_Service
{
    public static function sortResponseData($days)
    {
        foreach ($days as &$d) {
            usort($d['slots'], function ($a, $b) {
                return strcmp($a['start_time'], $b['start_time']);
            });
        }
        unset($d);

        // sort days by day key
        ksort($days);

        return $days;
    }


    public static function checkSlotExist($store_id, $day, $slot_id)
    {
        $model = new Store_Operation_Model();

        $find = $model->find_time_slot_by_slot_id($store_id, $day, $slot_id);

        if (empty($find)) {
            return false;
        }

        return $find;
    }

    public static function getSlotsByStoreAndDay($store_id, $day)
    {
        $model = new Store_Operation_Model();

        $slotList = $model->get_store_slot_list($store_id, $day);

        if (empty($slotList)) {
            return false;
        }

        return $slotList;
    }


    public static function checkOverlapTimeSlot($dbSlots, $request_open_time, $request_close_time, $current_slot_id = null)
    {
        $response = [];

        $new_start = strtotime($request_open_time);
        $new_end = strtotime($request_close_time);

        if (empty($dbSlots)) {
            return $response;
        }

        foreach ($dbSlots->toArray() as $s) {
            if ($current_slot_id !== null && $s['id'] == $current_slot_id) {
                continue;
            }

            $db_start = strtotime($s['open_time']);
            $db_end = strtotime($s['end_time']);

            if ($new_start < $db_end && $new_end > $db_start) {
                $response = [
                    'db_open_time' => $s['open_time'],
                    'db_end_time' => $s['end_time'],
                ];
                break;
            }
        }

        return $response;
    }

    public static function formatSlotsResponse($rows)
    {
        if (empty($rows)) {
            return [];
        }

        $storeId = (int) $rows[0]['store_id'];

        $days = [];

        foreach ($rows as $slot) {
            $day = (int) $slot['day_of_week'];

            if (!isset($days[$day])) {
                $days[$day] = [
                    'day' => $day,
                    'slots' => [],
                ];
            }

            $days[$day]['slots'][] = [
                'id'         => (int) $slot['id'],
                'start_time' => $slot['open_time'],
                'end_time'   => $slot['end_time'],
            ];
        }


        $days = array_values($days) ?? [];

        return [
            'store_id' => $storeId,
            'days'     => $days,
        ];
    }

    public static function updateDayOpen($store_id, $day, $is_open)
    {
        $operation_times = Store_Operation_Model::find_by_store_and_day($store_id, $day);

        foreach ($operation_times as $operation_time) {
            $updated = $operation_time->update([
                'is_open' => $is_open ? 1 : 0,
            ]);
        }

        return true;
    }
}
