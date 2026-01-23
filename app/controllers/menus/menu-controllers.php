<?php

namespace ZIPPY_MENU_ORDER\App\Controllers\Menus;

use ZIPPY_MENU_ORDER\Core\Base_Controller;
use WP_REST_Response;
use ZIPPY_MENU_ORDER\App\Requests\Menus\Menu_Request;
use ZIPPY_MENU_ORDER\App\Services\Menus\Menu_Services;
use ZIPPY_MENU_ORDER\Utils\Request_Helper;

class Menu_Controllers extends Base_Controller
{

	public function index(Menu_Request $request)
	{
		$infos = Request_Helper::get_params($request);
		$result = Menu_Services::get_menus($infos);
		return $this->success($result);
	}

	public function show(Menu_Request $request)
	{
		try {
			$validated = $request->all();
			$result = Menu_Services::get_menu_detail($validated['id']);
			if (is_wp_error($result)) {
				return $this->error($result->get_error_message());
			}

			return $this->success($result, 200);
		} catch (\Exception $e) {
			return $this->error($e->getMessage());
		}
	}

	public function store(Menu_Request $request)
	{
		// Data is already validated
		try {
			$validated = $request->all();
			$data = Menu_Services::create_menu($validated);

			if (is_wp_error($data)) {
				return $this->error($data->get_error_message());
			}

			return $this->success($data, 200);
		} catch (\Exception $e) {
			return $this->error($e->getMessage());
		}
	}

	public function update(Menu_Request $request)
	{
		try {
			$validated = $request->all();
			$updated_booking = Menu_Services::update_menu($validated);

			if (is_wp_error($updated_booking)) {
				return $this->error($updated_booking->get_error_message());
			}

			return $this->success($updated_booking, 200);
		} catch (\Exception $e) {
			return $this->error($e->getMessage());
		}
	}

	public function destroy(Menu_Request $request)
	{
		$validated = $request->all();
		$id = $validated['id'] ?? null;
		return $this->success($id, 200);
	}
}
