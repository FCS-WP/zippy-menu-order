<?php

namespace ZIPPY_MENU_ORDER\App\Requests\Stores;

use ZIPPY_MENU_ORDER\Core\Base_Request;
use ZIPPY_MENU_ORDER\App\Requests\Stores\Time_Slots_Rules;

class Store_Operation_Request extends Base_Request
{
    protected $storeApiMessage;
    protected $storeOperationApiMessage;

    protected $rules;
    public function __construct(array $data)
    {
        parent::__construct($data);

        // $rule = new Time_Slots_Rules();

        // $rule->register($this->validator);

        // $this->storeApiMessage = $this->apiMessage['store'];
        // $this->storeApiMessage = $this->storeOperationApiMessage['operation'];
    }

    public function store_validate()
    {
        return [
            // 'store_id' => 'required|numeric',
            // 'days' => 'required|array',
            // 'days.*.day' => 'required|in:' . ENUM_DATE_OF_WEEK,
            // 'days.*.slots' => 'required|array|ordered_time_slots',
            // 'days.*.slots.*.start_time' => 'required|date:H:i:s',
            // 'days.*.slots.*.end_time' => 'required|date:H:i:s|after_time_loop:days.*.slots.*.start_time',
        ];
    }

    public function show_validate()
    {
        return [
            'id' => ['type' => 'integer', 'required' => true],
        ];
    }

    public function update_validate()
    {
        return [
            // 'store_id' => 'required|numeric',
            // 'days' => 'required|array',
            // 'days.*.day' => 'required|in:' . ENUM_DATE_OF_WEEK,
            // 'days.*.slots.*.id' => 'required|numeric',
            // 'days.*.slots' => 'required|array|ordered_time_slots',
            // 'days.*.slots.*.start_time' => 'required|date:H:i:s',
            // 'days.*.slots.*.end_time' => 'required|date:H:i:s|after_time_loop:days.*.slots.*.start_time',
        ];
    }

    public function destroy_validate()
    {
        return [
            'id' => ['type' => 'integer', 'required' => true],
        ];
    }

    public function messages()
    {
        return [
            "day:in" => "Invalid week day",
            "slots.*.open_time:required" => "Open time is required",
            "slots.*.end_time:required" => "End time is required",
            "slots.*.end_time:after_time" => "End time must be greater than Open time",
            "slots.*.id:required" => "Slot id is required",
            "slots.*.id:numeric" => "Slot id must be a number",
        ];
    }
}
