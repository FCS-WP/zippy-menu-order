<?php

namespace ZIPPY_MENU_ORDER\App\Controllers\Stores;


use ZIPPY_MENU_ORDER\Core\Base_Controller;
use ZIPPY_MENU_ORDER\App\Models\Stores\Store_Model;
use ZIPPY_MENU_ORDER\App\Requests\Stores\Store_Request;
use ZIPPY_MENU_ORDER\App\Services\Stores\Store_Service;
use ZIPPY_MENU_ORDER\Core\Config;

class Store_Controller extends Base_Controller
{
    public function __construct()
    {
        $this->messages = Config::message('store');
        $this->model = new Store_Model();
    }

    public function index(Store_Request $request)
    {
        try {
            $validated = $request->all();

            $limit = isset($validated['limit']) ? intval($validated['limit']) : 2;
            $page = isset($validated['page']) ? intval($validated['page']) : 1;

            $stores = $this->model::get_stores($page, $limit);

            $data = [
                'stores' => $stores['data'],
                'pagination' => $stores['pagination'],
            ];

            if (empty($data)) {
                return $this->error($this->messages['not_found']);
            }

            return $this->success($data);
        } catch (\Exception $e) {
            return $this->error($e->getMessage());
        }
    }

    public function show(Store_Request $request)
    {
        $validated = $request->all();

        // get store
        $find = Store_Model::find_by_id($validated["id"]);



        $data = $find?->toArray();

        // response
        if ($data) {
            return $this->success($data);
        }

        return $this->error($this->messages['not_found']);
    }

    public function store(Store_Request $request)
    {
        $validated = $request->all();

        // prepare create data
        $data = [
            'name' => sanitize_text_field($validated['name'] ?? null),
            'duration' => $validated['duration'] ? intval($validated['duration']) : null,
            'phone' => sanitize_text_field($validated['phone'] ?? null),
            'postal_code' => sanitize_text_field($validated['postal_code'] ?? null),
            'coordinate' => $validated['coordinate'] ?? null,
            'default_capacity' => intval($validated['default_capacity'] ?? null),
            'active' => sanitize_text_field($validated['active']),
            'address' => sanitize_text_field($validated['address'] ?? null),
        ];

        // create store
        $created = $this->model->create($data);

        // response
        if ($created) {
            return $this->success($created->toArray());
        }

        return $this->error($this->messages['can_not_add']);
    }

    public function update(Store_Request $request)
    {
        $validated = $request->all();

        // check if store exist
        $store = Store_Model::find_by_id($validated["id"]);

        if (!$store->id) {
            return $this->error($this->messages['not_found']);
        }

        // prepare update data
        $update_data = [
            'duration' => $validated['duration'] ? intval($validated['duration']) : null,
            'phone' => sanitize_text_field($validated['phone'] ?? ""),
            'postal_code' => sanitize_text_field($validated['postal_code'] ?? null),
            'coordinate' => $validated['coordinate'] ?? "",
            'default_capacity' => intval($validated['default_capacity'] ?? null),
            'active' => sanitize_text_field($validated['active']),
            'address' => sanitize_text_field($validated['address'] ?? ""),
            'max_booking_days' => intval($validated['max_booking_days'] ?? null),
        ];

        $updated = $store->update($update_data);

        if ($updated) {
            return $this->success($updated->toArray());
        }

        return $this->error($this->messages['can_not_update']);
    }

    public function destroy(Store_Request $request)
    {
        $validated = $request->all();

        $store_ids = $validated['ids'];

        $response = [];
        foreach ($store_ids as $id) {
            // check if store exist
            $store = Store_Service::checkStoreExist($id);

            if (!$store->id) {
                return $this->error($this->messages['not_found']);
            }
        }

        foreach ($store_ids as $id) {
            $deleted = $store->softDelete();

            if ($deleted) {
                $response[] = [
                    'id' => $deleted,
                ];
            }
        }

        // delete
        if ($response) {
            return $this->success([
                'id' => array_map(fn($r) => (int) $r['id'], $response)
            ]);
        }

        return $this->error($this->messages['can_not_delete']);
    }

    public function get_store_info(Store_Request $request)
    {
        $validated = $request->all();

        $data = Store_Service::get_store_info($validated["store_id"], $validated["product_id"]);

        // response
        if ($data) {
            return $this->success($data);
        }

        return $this->error($this->messages['not_found']);
    }

    public function get_all_stores(Store_Request $request)
    {
        $validated = $request->all();
        $data = Store_Service::get_all_stores($validated["product_id"]);
        if (empty($data)) {
            return $this->error($this->messages['not_found']);
        }

        return $this->success($data);
    }
}
