<?php

namespace ZIPPY_MENU_ORDER\App\Controllers\Special_Days;

use ZIPPY_MENU_ORDER\Core\Base_Controller;
use ZIPPY_MENU_ORDER\Core\Base_Request;
use WP_REST_Response;
use WP_REST_Request;
use ZIPPY_MENU_ORDER\App\Models\Special_Days\Special_Days_Model;
use ZIPPY_MENU_ORDER\App\Requests\Special_Days\Special_Days_Request;
use ZIPPY_MENU_ORDER\App\Services\Special_Days\Special_Days_Service;
use ZIPPY_MENU_ORDER\Core\Config;

class Special_Days_Controllers extends Base_Controller
{
    public function __construct()
    {
        $this->model = new Special_Days_Model();
    }

    public function index(Special_Days_Request $request)
    {
        $validated = $request->all();
        $store_id = $validated['store_id'] ?? null;
        $date = $validated['date'] ?? null;
        $special_days = Special_Days_Service::get_all_special_days($store_id, $date);

        if (empty($special_days)) {
            return $this->success([]);
        }

        return $this->success($special_days);
    }

    public function show(Special_Days_Request $request) {}

    public function store(Special_Days_Request $request)
    {
        $validated = $request->all();

        $created = Special_Days_Service::create_special_day($validated);
        return $this->success($created);
    }

    public function update(Special_Days_Request $request) {}

    public function destroy(Special_Days_Request $request)
    {
        $validated = $request->all();
        $id = $validated['id'] ?? null;

        $deleted = Special_Days_Model::delete_by_id($id);
        if (is_wp_error($deleted)) {
            return $this->error($deleted);
        }

        return $this->success($deleted);
    }
}
