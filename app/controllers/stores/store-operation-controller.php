<?php

namespace ZIPPY_MENU_ORDER\App\Controllers\Stores;


use ZIPPY_MENU_ORDER\Core\Base_Controller;
use ZIPPY_MENU_ORDER\App\Models\Stores\Store_Model;
use ZIPPY_MENU_ORDER\App\Services\Stores\Store_Service;
use ZIPPY_MENU_ORDER\App\Services\Stores\Store_Operation_Service;
use ZIPPY_MENU_ORDER\App\Models\Stores\Store_Operation_Model;
use ZIPPY_MENU_ORDER\App\Requests\Stores\Store_Operation_Request;
use ZIPPY_MENU_ORDER\App\Services\Special_Days\Special_Days_Service;
use ZIPPY_MENU_ORDER\Core\Config;

class Store_Operation_Controller extends Base_Controller
{
    protected $store_model;
    protected $storeApiMessage;
    protected $storeOperationApiMessage;
    public function __construct()
    {
        $this->storeApiMessage = Config::message('store');
        $this->storeOperationApiMessage = Config::message('operation');
        $this->model = new Store_Operation_Model();
        $this->store_model = new Store_Model();
    }

    public function index(Store_Operation_Request $request)
    {
        return;
    }

    public function show(Store_Operation_Request $request)
    {
        $validated = $request->all();
        $storeId = intval($validated['id']);

        $store = Store_Service::checkStoreExist($storeId);

        if (!$store->id) {
            return $this->error($this->storeApiMessage['not_found']);
        }

        $rows = Store_Operation_Model::find_by_store($store->id);

        if (empty($rows)) {
            return $this->success([
                'store_id' => $store->id,
                'days'     => []
            ]);
        }

        $days = [];

        foreach ($rows as $row) {
            $day = intval($row->day_of_week);

            if (!isset($days[$day])) {
                $days[$day] = [
                    'day' => $day,
                    'slots' => []
                ];
            }

            $days[$day]['slots'][] = [
                'id'         => intval($row->id),
                'start_time' => $row->open_time,
                'end_time'   => $row->end_time,
            ];

            $days[$day]['is_open'] = intval($row->is_open) ? true : false;
        }

        $days = Store_Operation_Service::sortResponseData($days);
        $specialDays = Special_Days_Service::get_all_special_days($storeId);

        return $this->success([
            'store_id' => $store->id,
            'special_days' => $specialDays,
            'days'     => array_values($days)
        ]);
    }


    public function store(Store_Operation_Request $request)
    {
        // get all params
        $validated = $request->all();

        $storeId = intval($validated['store_id']);

        $days = $validated['days'];

        // check if store exist
        $store = Store_Service::checkStoreExist($storeId);

        if (!$store) {
            return $this->error($this->storeApiMessage['not_found']);
        }

        $insertData = [];

        foreach ($days as $value) {
            $day = $value['day'];
            $slots = $value['slots'];
            $is_open = $value['is_open'];

            // get all slots of request day
            $dbSlots = Store_Operation_Service::getSlotsByStoreAndDay($storeId, $day);

            foreach ($slots as $value) {

                $open_time = sanitize_text_field($value['start_time']);
                $end_time = sanitize_text_field($value['end_time']);

                // check if slot already existed
                $slots = $this->model->find_time_slots($storeId, $day, $open_time, $end_time);

                if ($slots) {
                    return $this->error('Slot ' . $open_time . ' to ' . $end_time . ' of day ' . $day . ' already existed');
                }

                // check if requested time slots overlap with any time slot in database
                // $overlapped = Store_Operation_Service::checkOverlapTimeSlot($dbSlots, $open_time, $end_time);

                // // if overlapped => return an error
                // if ($overlapped) {
                //     return $this->error(
                //         "Slot {$open_time} - {$end_time} overlaps with existing slot {$overlapped['db_open_time']} - {$overlapped['db_end_time']}"
                //     );
                // }

                // prepare insert data
                $insertData[] = [
                    'store_id' => $store->id,
                    'day_of_week' => $day,
                    'open_time' => $open_time,
                    'end_time' => $end_time,
                    'is_open' => $is_open ? 1 : 0,
                ];
            }
        }

        // return error if no insert data
        if (empty($insertData)) {
            return $this->error($this->storeOperationApiMessage['no_insert_data']);
        }

        // insert
        $inserted = $this->model->insert($insertData);

        // validate insert process and response
        if (!$inserted) {
            return $this->error($this->storeOperationApiMessage["can_not_add"]);
        }

        Store_Operation_Service::updateDayOpen($storeId, $day, $is_open);
        // prepare response data
        $response = Store_Operation_Service::formatSlotsResponse($inserted->toArray());

        return $this->success($response);
    }

    public function update(Store_Operation_Request $request)
    {
        $validated = $request->all();

        $storeId = intval($validated['store_id']);
        $days = $validated['days'];

        // check if store exist
        $store = Store_Service::checkStoreExist($storeId);

        if (!$store) {
            return $this->error($this->storeApiMessage['not_found']);
        }

        $update_data = [];

        foreach ($days as $value) {
            $day = $value['day'];
            $slots = $value['slots'];
            $is_open = $value['is_open'];
            // get all slots of request day
            $dbSlots = Store_Operation_Service::getSlotsByStoreAndDay($storeId, $day);

            foreach ($slots as $slot) {
                $open_time = sanitize_text_field($slot['start_time']);
                $end_time = sanitize_text_field($slot['end_time']);
                $slot_id = intval($slot['id']);

                // check if slot exist or not
                $slot = Store_Operation_Service::checkSlotExist(
                    $storeId,
                    $day,
                    $slot_id
                );

                // if not return an error
                if (!$slot) return $this->error("Slot ID: {$slot_id} not found");

                // check if requested time slots overlap with any time slot in database
                $overlapped = Store_Operation_Service::checkOverlapTimeSlot($dbSlots, $open_time, $end_time, $slot_id);

                // if overlapped => return an error
                if ($overlapped) {
                    return $this->error(
                        "Slot ID {$slot_id} overlaps with existing slot {$overlapped['db_open_time']} - {$overlapped['db_end_time']}"
                    );
                }

                $update_data[] = [
                    'id' => $slot_id,
                    'open_time' => $open_time,
                    'end_time'  => $end_time,
                ];
            }

            Store_Operation_Service::updateDayOpen($storeId, $day, $is_open);
        }

        // update
        if (!empty($update_data)) {
            $updated = $slot->updateMany($update_data);
            if (!$updated) {
                return $this->error('Updated Failed');
            }
        }

        $response = Store_Operation_Service::formatSlotsResponse($updated);

        return $this->success($response);
    }

    public function destroy(Store_Operation_Request $request)
    {
        $validated = $request->all();

        $slotId = intval($validated['id']);
        $storeId = intval($validated['store_id']);

        // check if store exist
        $store = Store_Service::checkStoreExist($storeId);

        if (!$store) {
            return $this->error($this->storeApiMessage['not_found']);
        }

        $slot = Store_Operation_Service::checkSlotExist(
            $storeId,
            $validated['day'],
            $slotId
        );

        // if not return an error
        if (!$slot) return $this->error("Slot ID: {$slotId} not found");

        $deleted = $slot->softDelete();

        if ($deleted) {
            return $this->success(['id' => $deleted]);
        }

        return $this->error($this->storeOperationApiMessage['can_not_delete']);
    }
}
